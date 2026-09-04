(() => {
  'use strict';

  const api = window.CYSPet;
  const root = document.querySelector('.cys-pet-root');
  if (!api || !root || root.dataset.v061Ready === '1') return;

  const VERSION = '0.6.1';
  const ASSET = 'assets/cys-pet/';
  root.dataset.v061Ready = '1';

  const character = root.querySelector('.cys-pet-character');
  const bubble = root.querySelector('.cys-pet-bubble');
  const bubbleText = root.querySelector('.cys-pet-bubble-text');
  const bubbleName = root.querySelector('.cys-pet-bubble-head span');
  const panelSub = root.querySelector('.cys-pet-panel-sub');
  const spriteLayers = [...root.querySelectorAll('.cys-pet-sprite')];

  if (bubbleName) bubbleName.textContent = 'Yaoyang Chen';
  if (panelSub) panelSub.remove();

  function routeKey() {
    if (document.querySelector('.home-cover') || document.getElementById('homeArchiveCard')) return 'index';
    const segment = location.pathname.split('/').filter(Boolean).pop() || 'index';
    return segment.toLowerCase().replace(/\.html$/, '') || 'index';
  }

  const currentRoute = routeKey();
  const isHome = currentRoute === 'index';
  const pageState = {
    profile: 'read',
    experience: 'read',
    education: 'read',
    focus: 'thinking',
    contact: 'wave'
  };

  /* The v0.5 point sprite is the asset that can show the colour/glitch artifact
     during navigation. Keep the semantic state, but render it with the stable
     wave pose until the final Rive rig replaces these WebP assets. */
  if (api.registerRenderer && spriteLayers.length >= 2) {
    const map = {
      boot: 'idle.webp', idle: 'idle.webp', hover: 'idle.webp', dragging: 'idle.webp',
      wake: 'wave.webp', wave: 'wave.webp', success: 'wave.webp', point: 'wave.webp',
      read: 'read.webp', working: 'read.webp', thinking: 'thinking.webp',
      error: 'thinking.webp', sleep: 'sleep.webp'
    };
    let active = Math.max(0, spriteLayers.findIndex((layer) => layer.classList.contains('is-active')));
    let current = '';

    api.registerRenderer({
      kind: 'sprite-crossfade',
      setState(state, options = {}) {
        const src = `${ASSET}${map[state] || map.idle}`;
        if (src === current && !options.immediate) return;
        current = src;

        if (options.immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          spriteLayers.forEach((layer, index) => {
            layer.src = src;
            layer.classList.toggle('is-active', index === 0);
          });
          active = 0;
          return;
        }

        const nextIndex = active === 0 ? 1 : 0;
        const next = spriteLayers[nextIndex];
        const prev = spriteLayers[active];
        const activate = () => {
          next.classList.add('is-active');
          prev.classList.remove('is-active');
          active = nextIndex;
        };
        if (next.src.endsWith(src) && next.complete) activate();
        else {
          next.onload = activate;
          next.onerror = activate;
          next.src = src;
        }
      }
    });
  }

  /* Mouse movement/hover should no longer switch poses. Hover CSS can still
     style links normally; only the companion action state is suppressed. */
  const navSelector = '.nav-links a, .home-actions a';
  ['mouseover', 'mouseout'].forEach((type) => {
    window.addEventListener(type, (event) => {
      if (event.target?.closest?.(navSelector)) event.stopPropagation();
    }, true);
  });
  ['mouseenter', 'mouseleave'].forEach((type) => {
    window.addEventListener(type, (event) => {
      if (event.target === character) event.stopPropagation();
    }, true);
  });

  /* v0.5 also translates the whole sprite by a few pixels on pointer move.
     Until we have a real eye/head rig, keep the current WebP character still. */
  window.addEventListener('pointermove', () => {
    root.style.setProperty('--look-x', '0');
    root.style.setProperty('--look-y', '0');
  }, { passive: true });

  /* Reject the old hover/nav/ambient action priorities. Page-entry and section
     observers use higher/different priorities, so those remain event-driven. */
  root.addEventListener('cys:state', (event) => {
    const state = event.detail?.state;
    const priority = Number(event.detail?.priority ?? -1);
    const hoverDriven = priority === 10;
    const idleMicroAction = priority === 15;
    const navHoverPoint = state === 'point' && priority === 20;
    if (hoverDriven || idleMicroAction || navHoverPoint) {
      queueMicrotask(() => api.setState?.('idle', { force: true, priority: 0 }));
    }
  });

  /* Clicking the character is now the explicit manual action trigger. The
     existing click still opens/closes the archive panel; this adds one wave. */
  if (character) {
    let press = null;
    character.addEventListener('pointerdown', (event) => {
      press = { x: event.clientX, y: event.clientY, sleep: api.state?.() === 'sleep' };
    });
    character.addEventListener('pointerup', (event) => {
      if (!press) return;
      const moved = Math.hypot(event.clientX - press.x, event.clientY - press.y) > 6;
      const wasSleep = press.sleep;
      press = null;
      if (moved || wasSleep) return;
      api.setState?.('wave', { force: true, priority: 42, duration: 1650, after: 'idle' });
    });
  }

  /* Only the home page is allowed to show the default welcome sentence. Any
     route greeting from the legacy core is suppressed on subpages, while the
     page-specific entry pose still plays silently. */
  if (!isHome) {
    try { sessionStorage.setItem('cys-pet-last-greeting', String(Date.now())); } catch (_) {}

    const legacyGreetings = new Set([
      '欢迎来到我的个人档案。想先看哪一部分？',
      'Welcome to my archive. Where would you like to begin?',
      '这里是个人简介与档案时间线。',
      'This page holds the profile and archive timeline.',
      '这里记录四组 AI 项目：RAG、智能体、数字人与可解释性。可以拖拽切换案例。',
      'Four AI projects live here — RAG, agents, digital human, interpretability. Drag the deck to switch cases.',
      '这里按方向归档训练轨迹与技术栈。',
      'Training directions and toolchains are archived here.',
      '这里是持续深化的三个方向：检索、推理、构建。',
      'Three directions keep deepening here — retrieve, reason, build.',
      '如果你想交流 RAG、智能体或工程实践，可以从这里联系。',
      'For RAG, agents, or engineering conversations, you can reach out here.'
    ]);

    const greetingObserver = new MutationObserver(() => {
      const text = bubbleText?.textContent?.trim();
      if (bubble?.classList.contains('is-visible') && legacyGreetings.has(text)) {
        bubble.classList.remove('is-visible');
      }
    });
    if (bubble) greetingObserver.observe(bubble, { attributes: true, attributeFilter: ['class'] });
    setTimeout(() => greetingObserver.disconnect(), 4200);

    const triggerPageEntry = () => {
      if (root.hidden) return false;
      const state = pageState[currentRoute] || 'idle';
      api.setState?.(state, { force: true, priority: 32, duration: state === 'thinking' ? 2200 : 1800, after: 'idle' });
      return true;
    };

    if (!triggerPageEntry()) {
      const visibleObserver = new MutationObserver(() => {
        if (triggerPageEntry()) visibleObserver.disconnect();
      });
      visibleObserver.observe(root, { attributes: true, attributeFilter: ['hidden', 'class'] });
      setTimeout(() => visibleObserver.disconnect(), 5000);
    }
  }

  api.version = VERSION;
})();
