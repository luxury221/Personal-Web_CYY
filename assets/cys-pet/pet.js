(() => {
  'use strict';

  if (window.CYSPet?.version) return;

  const VERSION = '0.5.0';
  const ASSET = 'assets/cys-pet/';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  const STATES = new Set([
    'boot', 'idle', 'hover', 'wave', 'point', 'read', 'thinking', 'working',
    'success', 'error', 'dragging', 'sleep', 'wake'
  ]);

  const SPRITES = {
    boot: 'idle.webp', idle: 'idle.webp', hover: 'idle.webp', dragging: 'idle.webp',
    wake: 'wave.webp', wave: 'wave.webp', success: 'wave.webp', point: 'point.webp',
    read: 'read.webp', working: 'read.webp', thinking: 'thinking.webp',
    error: 'thinking.webp', sleep: 'sleep.webp'
  };

  const PRIORITY = {
    idle: 0, hover: 10, point: 20, read: 20, wave: 26, wake: 35,
    thinking: 70, working: 75, success: 80, error: 85, sleep: 90,
    dragging: 100, boot: 100
  };

  const labels = {
    zh: {
      profile: '简介', experience: '经历', education: '教育', focus: '方向', contact: '联系',
      ask: '可以问我：项目、训练、方向或联系方式。',
      placeholder: '问问 CYY…', thinking: 'THINKING', working: 'WORKING', here: '当前页'
    },
    en: {
      profile: 'Profile', experience: 'Experience', education: 'Education', focus: 'Focus', contact: 'Contact',
      ask: 'Ask me about projects, training, focus, or contact.',
      placeholder: 'Ask CYY…', thinking: 'THINKING', working: 'WORKING', here: 'HERE'
    }
  };

  const routes = {
    'index.html': { state: 'wave', zh: '欢迎来到我的个人档案。想先看哪一部分？', en: 'Welcome to my archive. Where would you like to begin?' },
    '': { state: 'wave', zh: '欢迎来到我的个人档案。想先看哪一部分？', en: 'Welcome to my archive. Where would you like to begin?' },
    'profile.html': { state: 'read', zh: '这里是个人简介与档案时间线。', en: 'This page holds the profile and archive timeline.' },
    'experience.html': { state: 'point', zh: '这里记录四组 AI 项目：RAG、智能体、数字人与可解释性。可以拖拽切换案例。', en: 'Four AI projects live here — RAG, agents, digital human, interpretability. Drag the deck to switch cases.' },
    'education.html': { state: 'read', zh: '这里按方向归档训练轨迹与技术栈。', en: 'Training directions and toolchains are archived here.' },
    'focus.html': { state: 'thinking', zh: '这里是持续深化的三个方向：检索、推理、构建。', en: 'Three directions keep deepening here — retrieve, reason, build.' },
    'contact.html': { state: 'wave', zh: '如果你想交流 RAG、智能体或工程实践，可以从这里联系。', en: 'For RAG, agents, or engineering conversations, you can reach out here.' }
  };

  const navMessages = {
    'profile.html': ['查看个人简介与时间线。', 'Open the profile and timeline.'],
    'experience.html': ['这里是实践经历档案。', 'Open the practice archive.'],
    'education.html': ['查看训练方向与技术栈。', 'Open training and toolchains.'],
    'focus.html': ['查看关注方向与研究问题。', 'Open focus and research questions.'],
    'contact.html': ['查看联系方式。', 'Open contact details.']
  };

  const runtime = {
    state: 'boot', previous: 'idle', statePriority: PRIORITY.boot, priorityUntil: 0,
    timer: 0, bubbleTimer: 0, inactivityTimer: 0, hoverTimer: 0, idleTimer: 0,
    dragging: false, moved: false, startX: 0, startY: 0, originLeft: 0, originTop: 0,
    introDone: false, pointerWasSleeping: false, lastHintHref: '', lastHintAt: 0,
    cssReady: false, spriteReady: false, activeSprite: 0, currentSprite: '',
    agentBusy: false, renderer: null
  };

  function lang() {
    return document.documentElement.lang?.toLowerCase().startsWith('en') ? 'en' : 'zh';
  }
  function copy() { return labels[lang()]; }
  function pathname() { return location.pathname.split('/').pop() || ''; }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function now() { return performance.now(); }
  function isHome() { return pathname() === 'index.html' || pathname() === ''; }
  function isBusyState(state = runtime.state) { return ['thinking', 'working', 'success', 'error'].includes(state); }

  const styleLink = document.createElement('link');
  styleLink.rel = 'stylesheet';
  styleLink.href = `${ASSET}pet.css?v=${VERSION}`;
  document.head.appendChild(styleLink);

  const root = document.createElement('aside');
  root.className = 'cys-pet-root is-hidden';
  root.setAttribute('aria-label', 'CYY Archive Companion');
  root.dataset.state = 'boot';
  root.hidden = true;
  root.innerHTML = `
    <div class="cys-pet-bubble" role="status" aria-live="polite">
      <div class="cys-pet-bubble-head"><span>01 / CYY</span><button class="cys-pet-bubble-close" type="button" aria-label="Close">×</button></div>
      <p class="cys-pet-bubble-text"></p>
    </div>
    <section class="cys-pet-panel" aria-label="Archive Companion panel">
      <div class="cys-pet-panel-head">
        <div class="cys-pet-panel-title">CYY · ARCHIVE COMPANION</div>
        <button class="cys-pet-panel-close" type="button" aria-label="Close">×</button>
        <div class="cys-pet-panel-sub">AGENT / RETRIEVAL / RESEARCH · v0.5 WEB</div>
      </div>
      <div class="cys-pet-actions">
        <button class="cys-pet-action" type="button" data-pet-route="profile.html" data-label="PROFILE"><b>PROFILE</b><span data-pet-label="profile"></span></button>
        <button class="cys-pet-action" type="button" data-pet-route="experience.html" data-label="EXPERIENCE"><b>EXPERIENCE</b><span data-pet-label="experience"></span></button>
        <button class="cys-pet-action" type="button" data-pet-route="education.html" data-label="EDUCATION"><b>EDUCATION</b><span data-pet-label="education"></span></button>
        <button class="cys-pet-action" type="button" data-pet-route="focus.html" data-label="FOCUS"><b>FOCUS</b><span data-pet-label="focus"></span></button>
        <button class="cys-pet-action" type="button" data-pet-route="contact.html" data-label="CONTACT"><b>CONTACT</b><span data-pet-label="contact"></span></button>
      </div>
      <form class="cys-pet-ask">
        <div class="cys-pet-input-wrap"><input class="cys-pet-input" autocomplete="off" /><button class="cys-pet-submit" type="submit" aria-label="Send">→</button></div>
        <p class="cys-pet-hint"></p>
      </form>
    </section>
    <div class="cys-pet-character" role="button" tabindex="0" aria-label="Open CYY Archive Companion">
      <img class="cys-pet-sprite is-active" data-pet-sprite="0" alt="CYY Archive Companion" draggable="false" />
      <img class="cys-pet-sprite" data-pet-sprite="1" alt="" aria-hidden="true" draggable="false" />
      <span class="cys-pet-sparkle" aria-hidden="true"></span>
      <span class="cys-pet-sleep-mark" aria-hidden="true">Z z</span>
      <span class="cys-pet-status"><i class="cys-pet-status-dot"></i><b>THINKING</b></span>
    </div>`;
  document.body.appendChild(root);

  const character = root.querySelector('.cys-pet-character');
  const spriteLayers = [...root.querySelectorAll('.cys-pet-sprite')];
  const bubble = root.querySelector('.cys-pet-bubble');
  const bubbleText = root.querySelector('.cys-pet-bubble-text');
  const panel = root.querySelector('.cys-pet-panel');
  const input = root.querySelector('.cys-pet-input');
  const hint = root.querySelector('.cys-pet-hint');
  const statusText = root.querySelector('.cys-pet-status b');

  function updateLanguage() {
    const c = copy();
    ['profile', 'experience', 'education', 'focus', 'contact'].forEach((key) => {
      const el = root.querySelector(`[data-pet-label="${key}"]`);
      if (el) el.textContent = c[key];
    });
    input.placeholder = c.placeholder;
    hint.textContent = c.ask;
    markCurrentRoute();
  }
  updateLanguage();

  const langObserver = new MutationObserver(updateLanguage);
  langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  function spriteFor(state) { return `${ASSET}${SPRITES[state] || SPRITES.idle}`; }

  function createSpriteRenderer() {
    function setState(state, options = {}) {
      const src = spriteFor(state);
      if (runtime.currentSprite === src && !options.immediate) return;
      runtime.currentSprite = src;

      if (options.immediate || reduceMotion) {
        spriteLayers.forEach((layer, index) => {
          layer.src = src;
          layer.classList.toggle('is-active', index === 0);
        });
        runtime.activeSprite = 0;
        return;
      }

      const nextIndex = runtime.activeSprite === 0 ? 1 : 0;
      const next = spriteLayers[nextIndex];
      const prev = spriteLayers[runtime.activeSprite];
      const activate = () => {
        next.classList.add('is-active');
        prev.classList.remove('is-active');
        runtime.activeSprite = nextIndex;
      };

      if (next.src.endsWith(src) && next.complete) {
        activate();
        return;
      }
      next.onload = activate;
      next.onerror = activate;
      next.src = src;
    }

    return { kind: 'sprite-crossfade', setState };
  }

  runtime.renderer = createSpriteRenderer();

  function registerRenderer(renderer) {
    if (!renderer || typeof renderer.setState !== 'function') return false;
    runtime.renderer = renderer;
    runtime.renderer.setState(runtime.state, { immediate: true });
    root.dataset.renderer = renderer.kind || 'custom';
    return true;
  }

  function preloadSprites() {
    [...new Set(Object.values(SPRITES))].forEach((name) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = `${ASSET}${name}`;
    });
  }

  function canTransition(next, options) {
    if (options.force) return true;
    if (runtime.dragging && next !== 'dragging') return false;
    const nextPriority = options.priority ?? PRIORITY[next] ?? 0;
    if (now() < runtime.priorityUntil && nextPriority < runtime.statePriority) return false;
    return true;
  }

  function setState(next, options = {}) {
    if (!STATES.has(next)) next = 'idle';
    if (!canTransition(next, options)) return false;

    const nextPriority = options.priority ?? PRIORITY[next] ?? 0;
    if (runtime.state !== next) runtime.previous = runtime.state;
    runtime.state = next;
    runtime.statePriority = nextPriority;
    runtime.priorityUntil = options.hold ? Number.POSITIVE_INFINITY : now() + (options.lock || options.duration || 0);
    root.dataset.state = next;
    statusText.textContent = next === 'working' ? copy().working : copy().thinking;
    runtime.renderer?.setState(next, { immediate: options.immediate });

    clearTimeout(runtime.timer);
    if (options.duration) {
      runtime.timer = setTimeout(() => {
        runtime.priorityUntil = 0;
        setState(options.after || 'idle', { force: true, priority: PRIORITY[options.after || 'idle'] || 0 });
      }, options.duration);
    }

    if (next === 'idle') scheduleIdleMotion();
    else clearTimeout(runtime.idleTimer);

    root.dispatchEvent(new CustomEvent('cys:state', { detail: { state: next, priority: nextPriority } }));
    return true;
  }

  function say(message, options = {}) {
    if (!message) return;
    bubbleText.textContent = message;
    bubble.classList.add('is-visible');
    clearTimeout(runtime.bubbleTimer);
    if (options.duration !== 0) {
      runtime.bubbleTimer = setTimeout(() => bubble.classList.remove('is-visible'), options.duration || 4200);
    }
    if (options.state) {
      setState(options.state, {
        priority: options.priority,
        lock: options.lock || 900,
        hold: options.hold,
        duration: options.stateDuration || 1900,
        after: options.after || 'idle',
        force: options.force
      });
    }
  }

  function closeBubble() {
    clearTimeout(runtime.bubbleTimer);
    bubble.classList.remove('is-visible');
  }

  function markCurrentRoute() {
    const current = pathname();
    root.querySelectorAll('[data-pet-route]').forEach((button) => {
      const active = button.dataset.petRoute === current;
      button.classList.toggle('is-current', active);
      button.setAttribute('aria-current', active ? 'page' : 'false');
      button.title = active ? copy().here : '';
    });
  }

  function openPanel(force) {
    const shouldOpen = typeof force === 'boolean' ? force : !panel.classList.contains('is-open');
    panel.classList.toggle('is-open', shouldOpen);
    root.classList.toggle('is-panel-open', shouldOpen);
    if (shouldOpen) {
      closeBubble();
      markCurrentRoute();
      setState('hover', { force: true, priority: PRIORITY.hover });
      setTimeout(() => input.focus({ preventScroll: true }), 120);
    } else if (!runtime.agentBusy) {
      setState('idle', { force: true });
    }
  }

  function navigate(href, label) {
    if (href === pathname()) {
      say(lang() === 'en' ? 'You are already here.' : '已经在这一页了。', { state: 'wave', duration: 1500, force: true });
      return;
    }
    openPanel(false);
    setState('point', { force: true, priority: 40, lock: 500, duration: 650, after: 'idle' });
    setTimeout(() => {
      if (typeof window.runExitTransition === 'function') window.runExitTransition(label || 'ARCHIVE', href);
      else location.href = href;
    }, 160);
  }

  function inferAsk(text) {
    const q = text.trim().toLowerCase();
    const isEn = lang() === 'en';
    if (!q) return;

    runtime.agentBusy = true;
    setState('thinking', { force: true, priority: PRIORITY.thinking, hold: true });
    say(isEn ? 'Searching the archive…' : '正在检索档案…', { duration: 0 });

    setTimeout(() => {
      let target = null;
      let label = null;
      let message = '';
      let state = 'success';

      if (/(经历|实习|项目|project|experience|intern|rag|agent)/i.test(q)) {
        target = 'experience.html'; label = 'EXPERIENCE';
        message = isEn ? 'The experience archive holds four AI project cases. I can take you there.' : '经历档案里有四组 AI 项目案例，我带你过去。';
      } else if (/(教育|课程|学校|gpa|education|course|school)/i.test(q)) {
        target = 'education.html'; label = 'EDUCATION'; state = 'read';
        message = isEn ? 'Training directions and toolchains are filed on the Training page.' : '训练方向与技术栈都整理在 Training 页面。';
      } else if (/(研究|方向|focus|research|检索|推理|构建)/i.test(q)) {
        target = 'focus.html'; label = 'FOCUS'; state = 'thinking';
        message = isEn ? 'The Focus archive covers the three directions — retrieve, reason, build.' : 'Focus 档案整理了检索、推理与构建三个方向。';
      } else if (/(联系|邮箱|email|contact|微信|wechat)/i.test(q)) {
        target = 'contact.html'; label = 'CONTACT'; state = 'wave';
        message = isEn ? 'Contact details are in the final archive page.' : '联系方式在最后一页档案里，我带你过去。';
      } else if (/(简介|是谁|profile|about|介绍)/i.test(q)) {
        target = 'profile.html'; label = 'PROFILE'; state = 'point';
        message = isEn ? 'The Profile page is the shortest introduction and timeline.' : 'Profile 页面有简短介绍和档案时间线。';
      } else {
        runtime.agentBusy = false;
        runtime.priorityUntil = 0;
        say(isEn ? 'I can guide you through Profile, Experience, Training, Focus, and Contact. Try asking about one of them.' : '我可以带你查看简介、经历、训练、方向和联系方式。试着问我其中一项吧。', {
          state: 'wave', priority: 35, duration: 2600, stateDuration: 1900, force: true
        });
        return;
      }

      runtime.agentBusy = false;
      runtime.priorityUntil = 0;
      say(message, { state, priority: 45, duration: 1800, stateDuration: 1500, force: true });
      if (target) setTimeout(() => navigate(target, label), 900);
    }, 650);
  }

  function scheduleIdleMotion() {
    clearTimeout(runtime.idleTimer);
    if (reduceMotion || root.hidden || document.hidden) return;
    const delay = 22000 + Math.random() * 18000;
    runtime.idleTimer = setTimeout(() => {
      if (runtime.state !== 'idle' || runtime.agentBusy || runtime.dragging || panel.classList.contains('is-open')) {
        scheduleIdleMotion();
        return;
      }
      const roll = Math.random();
      const state = roll < .52 ? 'wave' : roll < .78 ? 'read' : 'thinking';
      const duration = state === 'thinking' ? 2200 : 1700;
      setState(state, { priority: 15, lock: duration, duration, after: 'idle' });
    }, delay);
  }

  root.addEventListener('click', (event) => event.stopPropagation());
  root.addEventListener('pointerenter', () => document.body.classList.add('cys-pet-hovering'));
  root.addEventListener('pointerleave', () => document.body.classList.remove('cys-pet-hovering'));
  root.querySelector('.cys-pet-bubble-close').addEventListener('click', closeBubble);
  root.querySelector('.cys-pet-panel-close').addEventListener('click', () => openPanel(false));
  root.querySelectorAll('[data-pet-route]').forEach((button) => {
    button.addEventListener('click', () => navigate(button.dataset.petRoute, button.dataset.label));
  });
  root.querySelector('.cys-pet-ask').addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input.value;
    input.value = '';
    inferAsk(text);
  });

  character.addEventListener('mouseenter', () => {
    if (!runtime.dragging && runtime.state !== 'sleep' && !runtime.agentBusy) {
      setState('hover', { priority: PRIORITY.hover });
    }
  });
  character.addEventListener('mouseleave', () => {
    if (!runtime.dragging && runtime.state === 'hover' && !panel.classList.contains('is-open')) {
      setState('idle', { force: true });
    }
  });
  character.addEventListener('dblclick', () => {
    if (runtime.dragging || runtime.agentBusy) return;
    setState('wave', { force: true, priority: 32, duration: 1700, after: 'idle' });
  });
  character.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPanel();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel.classList.contains('is-open')) openPanel(false);
  });
  document.addEventListener('pointerdown', (event) => {
    if (panel.classList.contains('is-open') && !root.contains(event.target)) openPanel(false);
  }, true);

  if (finePointer && !reduceMotion) {
    window.addEventListener('pointermove', (event) => {
      if (runtime.dragging || root.hidden) return;
      const rect = character.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * .26;
      root.style.setProperty('--look-x', clamp((event.clientX - cx) / window.innerWidth * 4, -2.0, 2.0).toFixed(2));
      root.style.setProperty('--look-y', clamp((event.clientY - cy) / window.innerHeight * 3, -1.4, 1.4).toFixed(2));
    }, { passive: true });
  }

  function storedPosition() {
    try { return JSON.parse(localStorage.getItem('cys-pet-position-v1') || 'null'); }
    catch (_) { return null; }
  }

  function applyStoredPosition() {
    const pos = storedPosition();
    if (!pos) return;
    root.classList.toggle('is-left', pos.side === 'left');
    const height = root.getBoundingClientRect().height || 230;
    const top = clamp((pos.y || .66) * innerHeight, 76, innerHeight - height - 8);
    root.style.top = top + 'px';
    root.style.bottom = 'auto';
  }

  character.addEventListener('pointerdown', (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    runtime.pointerWasSleeping = runtime.state === 'sleep';
    runtime.dragging = true;
    runtime.moved = false;
    runtime.startX = event.clientX;
    runtime.startY = event.clientY;
    const rect = root.getBoundingClientRect();
    runtime.originLeft = rect.left;
    runtime.originTop = rect.top;
    root.style.left = rect.left + 'px';
    root.style.right = 'auto';
    root.style.top = rect.top + 'px';
    root.style.bottom = 'auto';
    root.classList.add('is-dragging');
    setState('dragging', { force: true, priority: PRIORITY.dragging, hold: true });
    character.setPointerCapture?.(event.pointerId);
  });

  character.addEventListener('pointermove', (event) => {
    if (!runtime.dragging) return;
    const dx = event.clientX - runtime.startX;
    const dy = event.clientY - runtime.startY;
    if (Math.hypot(dx, dy) > 5) runtime.moved = true;
    const width = root.getBoundingClientRect().width;
    const height = root.getBoundingClientRect().height;
    root.style.left = clamp(runtime.originLeft + dx, 4, innerWidth - width - 4) + 'px';
    root.style.top = clamp(runtime.originTop + dy, 70, innerHeight - height - 4) + 'px';
  });

  function finishDrag(event) {
    if (!runtime.dragging) return;
    runtime.dragging = false;
    runtime.priorityUntil = 0;
    root.classList.remove('is-dragging');
    const rect = root.getBoundingClientRect();
    const side = rect.left + rect.width / 2 < innerWidth / 2 ? 'left' : 'right';
    const top = clamp(rect.top, 76, innerHeight - rect.height - 8);
    root.classList.toggle('is-left', side === 'left');
    root.style.left = '';
    root.style.right = '';
    root.style.top = top + 'px';
    root.style.bottom = 'auto';

    try { localStorage.setItem('cys-pet-position-v1', JSON.stringify({ side, y: top / innerHeight })); }
    catch (_) {}

    if (!reduceMotion && window.gsap) {
      gsap.fromTo(character, { x: side === 'left' ? -3 : 3 }, { x: 0, duration: .35, ease: 'back.out(2)' });
    }

    if (runtime.pointerWasSleeping && !runtime.moved) {
      runtime.pointerWasSleeping = false;
      setState('wake', { force: true, priority: PRIORITY.wake, duration: 1300, after: 'idle' });
      say(lang() === 'en' ? 'I am here.' : '我在。', { duration: 1400 });
    } else {
      runtime.pointerWasSleeping = false;
      setState('idle', { force: true });
      if (!runtime.moved) openPanel();
    }

    if (event?.pointerId !== undefined) character.releasePointerCapture?.(event.pointerId);
  }

  character.addEventListener('pointerup', finishDrag);
  character.addEventListener('pointercancel', finishDrag);

  function markActivity() {
    clearTimeout(runtime.inactivityTimer);
    if (runtime.state === 'sleep' && !runtime.dragging) {
      runtime.priorityUntil = 0;
      setState('wake', { force: true, priority: PRIORITY.wake, duration: 1300, after: 'idle' });
    }
    runtime.inactivityTimer = setTimeout(() => {
      if (!runtime.dragging && !runtime.agentBusy && !panel.classList.contains('is-open')) {
        closeBubble();
        setState('sleep', { force: true, priority: PRIORITY.sleep, hold: true });
      }
    }, 90000);
  }

  ['pointerdown', 'keydown', 'wheel', 'scroll', 'touchstart'].forEach((name) => {
    window.addEventListener(name, markActivity, { passive: true });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      closeBubble();
      setState('sleep', { force: true, priority: PRIORITY.sleep, hold: true });
    } else {
      runtime.priorityUntil = 0;
      markActivity();
    }
  });

  function scheduleNavHint(link) {
    clearTimeout(runtime.hoverTimer);
    const href = link?.getAttribute('href') || '';
    const msg = navMessages[href];
    if (!msg || runtime.dragging || runtime.state === 'sleep' || runtime.agentBusy || panel.classList.contains('is-open')) return;
    setState('point', { priority: PRIORITY.point, lock: 650 });
    runtime.hoverTimer = setTimeout(() => {
      const tooSoon = runtime.lastHintHref === href && Date.now() - runtime.lastHintAt < 12000;
      if (tooSoon) return;
      runtime.lastHintHref = href;
      runtime.lastHintAt = Date.now();
      if (finePointer) say(msg[lang() === 'en' ? 1 : 0], { duration: 1500 });
    }, 420);
  }

  document.addEventListener('mouseover', (event) => {
    const link = event.target.closest?.('.nav-links a, .home-actions a');
    if (link) scheduleNavHint(link);
  });
  document.addEventListener('mouseout', (event) => {
    const link = event.target.closest?.('.nav-links a, .home-actions a');
    if (!link) return;
    clearTimeout(runtime.hoverTimer);
    if (runtime.state === 'point' && !bubble.classList.contains('is-visible')) setState('idle', { force: true });
  });

  const observeTargets = Array.from(document.querySelectorAll('.content-block, .case-section, .slide-panel, .subpage-hero'));
  if ('IntersectionObserver' in window && observeTargets.length) {
    let lastSectionAt = 0;
    const observer = new IntersectionObserver((entries) => {
      const best = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!best || Date.now() - lastSectionAt < 5200 || panel.classList.contains('is-open') || runtime.state === 'sleep' || runtime.agentBusy) return;
      if (best.intersectionRatio > .45) {
        lastSectionAt = Date.now();
        setState(best.target.matches('.subpage-hero') ? 'point' : 'read', {
          priority: 18, lock: 900, duration: 1700, after: 'idle'
        });
      }
    }, { threshold: [.45, .65] });
    observeTargets.forEach((el) => observer.observe(el));
  }

  window.addEventListener('resize', () => {
    if (!root.hidden) applyStoredPosition();
  });

  window.addEventListener('cys:pet', (event) => {
    const detail = event.detail || {};
    if (detail.message) {
      say(detail.message, {
        state: detail.state,
        priority: detail.priority,
        duration: detail.duration,
        stateDuration: detail.stateDuration,
        hold: detail.hold,
        force: detail.force
      });
    } else if (detail.state) {
      setState(detail.state, {
        priority: detail.priority,
        duration: detail.duration,
        after: detail.after,
        hold: detail.hold,
        force: detail.force
      });
    }
  });

  function agentThinking(message) {
    runtime.agentBusy = true;
    setState('thinking', { force: true, priority: PRIORITY.thinking, hold: true });
    say(message || (lang() === 'en' ? 'Thinking…' : '正在思考…'), { duration: 0 });
  }

  function agentWorking(message) {
    runtime.agentBusy = true;
    setState('working', { force: true, priority: PRIORITY.working, hold: true });
    say(message || (lang() === 'en' ? 'Working through the archive…' : '正在处理档案…'), { duration: 0 });
  }

  function finishAgent(state, message, duration) {
    runtime.agentBusy = false;
    runtime.priorityUntil = 0;
    say(message, {
      state, force: true, priority: PRIORITY[state], duration,
      stateDuration: state === 'error' ? 2200 : 1800, after: 'idle'
    });
  }

  const api = {
    version: VERSION,
    state: () => runtime.state,
    renderer: () => runtime.renderer?.kind || 'unknown',
    registerRenderer,
    setState: (state, options = {}) => setState(state, { ...options, force: options.force ?? true }),
    say,
    open: () => openPanel(true),
    close: () => openPanel(false),
    sleep: () => setState('sleep', { force: true, priority: PRIORITY.sleep, hold: true }),
    wake: () => { runtime.priorityUntil = 0; markActivity(); },
    agent: {
      thinking: agentThinking,
      working: agentWorking,
      success(message) { finishAgent('success', message || (lang() === 'en' ? 'Done.' : '完成。'), 2600); },
      error(message) { finishAgent('error', message || (lang() === 'en' ? 'Something went wrong.' : '这里遇到了一点问题。'), 3000); }
    }
  };
  window.CYSPet = api;

  function shouldShowRouteGreeting() {
    if (isHome()) return true;
    try {
      const last = Number(sessionStorage.getItem('cys-pet-last-greeting') || 0);
      return Date.now() - last > 22000;
    } catch (_) {
      return true;
    }
  }

  function stampGreeting() {
    try { sessionStorage.setItem('cys-pet-last-greeting', String(Date.now())); }
    catch (_) {}
  }

  function showPet() {
    if (runtime.introDone || !runtime.cssReady || !runtime.spriteReady) return;
    runtime.introDone = true;
    root.hidden = false;
    applyStoredPosition();
    root.classList.remove('is-hidden');

    requestAnimationFrame(() => {
      if (reduceMotion) {
        root.classList.add('is-ready');
      } else if (isHome()) {
        const origin = document.getElementById('homeArchiveCard');
        if (origin && window.gsap) {
          const from = origin.getBoundingClientRect();
          const to = root.getBoundingClientRect();
          const dx = from.left + from.width * .76 - (to.left + to.width / 2);
          const dy = from.top + from.height * .69 - (to.top + to.height / 2);
          gsap.set(root, { x: dx, y: dy, scale: .32, opacity: 0 });
          root.classList.add('is-ready');
          gsap.to(root, {
            x: 0, y: 0, scale: 1, opacity: 1,
            duration: .92, delay: .14, ease: 'power4.out', clearProps: 'transform,opacity'
          });
        } else {
          root.classList.add('is-ready');
        }
      } else {
        root.classList.add('is-ready');
        if (window.gsap) {
          gsap.from(root, { y: 14, opacity: 0, duration: .5, ease: 'power3.out', clearProps: 'transform,opacity' });
        }
      }
    });

    markActivity();
    const route = routes[pathname()] || routes[''];
    const showGreeting = shouldShowRouteGreeting();
    setTimeout(() => {
      runtime.priorityUntil = 0;
      setState(route.state, {
        force: true,
        priority: 30,
        lock: 1500,
        duration: route.state === 'thinking' ? 2500 : 1800,
        after: 'idle'
      });
      if (showGreeting) {
        stampGreeting();
        say(route[lang()], { duration: 4100 });
      }
    }, reduceMotion ? 100 : 880);
  }

  function waitForIntro() {
    const intro = document.getElementById('intro');
    if (!intro) {
      showPet();
      return;
    }
    const observer = new MutationObserver(() => {
      if (!document.getElementById('intro')) {
        observer.disconnect();
        showPet();
      }
    });
    observer.observe(document.body, { childList: true, subtree: false });
    setTimeout(() => {
      if (!document.getElementById('intro')) showPet();
    }, 4600);
  }

  styleLink.addEventListener('load', () => {
    runtime.cssReady = true;
    waitForIntro();
  }, { once: true });
  styleLink.addEventListener('error', () => {
    runtime.cssReady = true;
    waitForIntro();
  }, { once: true });

  const firstSprite = spriteLayers[0];
  firstSprite.decoding = 'async';
  firstSprite.src = spriteFor('idle');
  runtime.currentSprite = firstSprite.src;
  firstSprite.addEventListener('load', () => {
    runtime.spriteReady = true;
    runtime.renderer.setState('idle', { immediate: true });
    preloadSprites();
    waitForIntro();
  }, { once: true });
  firstSprite.addEventListener('error', () => {
    runtime.spriteReady = true;
    waitForIntro();
  }, { once: true });
})();
