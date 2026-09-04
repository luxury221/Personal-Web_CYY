(() => {
  'use strict';

  const api = window.CYSPet;
  const root = document.querySelector('.cys-pet-root');
  if (!api || !root || root.dataset.v062Ready === '1') return;

  const VERSION = '0.6.2';
  root.dataset.v062Ready = '1';

  const panel = root.querySelector('.cys-pet-panel');
  const bubble = root.querySelector('.cys-pet-bubble');
  const bubbleText = root.querySelector('.cys-pet-bubble-text');
  const bubbleName = root.querySelector('.cys-pet-bubble-head span');
  const panelSub = root.querySelector('.cys-pet-panel-sub');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (bubbleName) bubbleName.textContent = 'Yaoyang Chen';
  if (panelSub) panelSub.remove();

  function routeKey() {
    if (document.querySelector('.home-cover') || document.getElementById('homeArchiveCard')) return 'index';
    const segment = location.pathname.split('/').filter(Boolean).pop() || 'index';
    return segment.toLowerCase().replace(/\.html$/, '') || 'index';
  }

  const route = routeKey();
  const isHome = route === 'index';

  /* ------------------------------------------------------------------
     Greeting guard

     The default archive greeting belongs to the home page only. Do the check
     immediately as well as reactively so a very fast cached CSS load cannot
     briefly expose a legacy subpage greeting before the enhancement layer is
     ready.
  ------------------------------------------------------------------ */
  if (!isHome && bubble && bubbleText) {
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

    const suppressLegacyGreeting = () => {
      const text = bubbleText.textContent?.trim();
      if (legacyGreetings.has(text)) bubble.classList.remove('is-visible');
    };

    suppressLegacyGreeting();
    const greetingObserver = new MutationObserver(suppressLegacyGreeting);
    greetingObserver.observe(bubble, {
      attributes: true,
      attributeFilter: ['class'],
      childList: true,
      subtree: true,
      characterData: true
    });
    setTimeout(() => greetingObserver.disconnect(), 6500);
  }

  /* ------------------------------------------------------------------
     Action director

     The companion reacts to semantic navigation, not incidental pointer
     movement. v0.5 can still emit low-priority hover, ambient and legacy
     section states; normalize those back to idle before they become a visible
     pose change. The v0.6.1 page-entry action (priority 32) remains intact.
  ------------------------------------------------------------------ */
  root.addEventListener('cys:state', (event) => {
    const state = event.detail?.state;
    const priority = Number(event.detail?.priority ?? -1);

    const legacyHover = priority === 10;
    const legacyAmbient = priority === 15;
    const legacySection = priority === 18;
    const legacyNavHover = state === 'point' && priority === 20;
    const duplicateSubpageEntry = !isHome && priority === 30;

    if (legacyHover || legacyAmbient || legacySection || legacyNavHover || duplicateSubpageEntry) {
      queueMicrotask(() => {
        const current = api.state?.();
        if (['thinking', 'working', 'success', 'error', 'sleep', 'dragging'].includes(current)) return;
        api.setState?.('idle', { force: true, priority: 0 });
      });
    }
  });

  /* ------------------------------------------------------------------
     Stable region entry

     A region only triggers after it remains the dominant visible block for a
     short dwell. Fast scrolling therefore does not make the character flick
     through poses. The first visible content block is treated as part of page
     entry; later blocks each trigger at most once per page visit.
  ------------------------------------------------------------------ */
  const targets = [...document.querySelectorAll(
    '.content-block, .case-section, .slide-panel, .focus-item, .timeline-item'
  )];

  const seen = new WeakSet();
  const visible = new Map();
  let candidate = null;
  let dwellTimer = 0;
  let lastActionAt = 0;
  let initialVisiblePrimed = false;
  const directorReadyAt = Date.now() + (isHome ? 1800 : 3300);

  function sectionState(el) {
    if (el?.matches?.('.focus-item')) return 'thinking';
    if (route === 'focus' && !el?.matches?.('.timeline-item')) return 'thinking';
    if (route === 'contact') return 'wave';
    return 'read';
  }

  function bestVisible() {
    return [...visible.entries()]
      .filter(([el, ratio]) => !seen.has(el) && ratio >= 0.52)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  }

  function armCandidate(el) {
    if (!el || seen.has(el) || candidate === el) return;
    candidate = el;
    clearTimeout(dwellTimer);

    dwellTimer = setTimeout(() => {
      const ratio = visible.get(el) || 0;
      const current = api.state?.();
      const busy = ['thinking', 'working', 'success', 'error', 'sleep', 'dragging'].includes(current);
      const panelOpen = panel?.classList.contains('is-open');
      const tooEarly = Date.now() < directorReadyAt;
      const coolingDown = Date.now() - lastActionAt < 2600;

      if (candidate !== el || ratio < 0.52) {
        candidate = null;
        return;
      }

      if (busy || panelOpen || tooEarly || coolingDown) {
        candidate = null;
        setTimeout(() => armCandidate(bestVisible()), 700);
        return;
      }

      seen.add(el);
      candidate = null;
      lastActionAt = Date.now();
      const state = sectionState(el);
      api.setState?.(state, {
        force: true,
        priority: 34,
        duration: state === 'thinking' ? 2100 : 1750,
        after: 'idle'
      });
    }, reduceMotion ? 180 : 620);
  }

  function reconsider() {
    armCandidate(bestVisible());
  }

  if ('IntersectionObserver' in window && targets.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.set(entry.target, entry.intersectionRatio);
        else visible.delete(entry.target);
      });

      if (!initialVisiblePrimed) {
        initialVisiblePrimed = true;
        const initial = [...visible.entries()]
          .filter(([, ratio]) => ratio >= 0.52)
          .sort((a, b) => b[1] - a[1])[0]?.[0];
        if (initial) seen.add(initial);
      }

      reconsider();
    }, { threshold: [0.35, 0.52, 0.68, 0.82] });

    targets.forEach((el) => observer.observe(el));
  }

  if (panel) {
    const panelObserver = new MutationObserver(() => {
      if (!panel.classList.contains('is-open')) setTimeout(reconsider, 260);
    });
    panelObserver.observe(panel, { attributes: true, attributeFilter: ['class'] });
  }

  root.addEventListener('cys:state', (event) => {
    if (event.detail?.state === 'idle') setTimeout(reconsider, 240);
  });

  /* Keep the WebP body still on pointer movement. A future Rive/Live2D
     renderer may use normalized gaze inputs without translating the whole
     character sprite. */
  window.addEventListener('pointermove', () => {
    root.style.setProperty('--look-x', '0');
    root.style.setProperty('--look-y', '0');
  }, { passive: true });

  api.version = VERSION;
})();
