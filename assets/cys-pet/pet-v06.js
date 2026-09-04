(() => {
  'use strict';

  const api = window.CYSPet;
  const root = document.querySelector('.cys-pet-root');
  if (!api || !root || root.dataset.v06Ready === '1') return;

  const VERSION = '0.6.0';
  const ASSET = 'assets/cys-pet/';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => window.matchMedia('(max-width: 720px)').matches;

  root.dataset.v06Ready = '1';
  root.dataset.renderer = api.renderer?.() || 'sprite-crossfade';

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = `${ASSET}pet-v06.css?v=${VERSION}`;
  document.head.appendChild(style);

  const character = root.querySelector('.cys-pet-character');
  const panel = root.querySelector('.cys-pet-panel');
  const panelHead = root.querySelector('.cys-pet-panel-head');
  const panelClose = root.querySelector('.cys-pet-panel-close');
  const panelSub = root.querySelector('.cys-pet-panel-sub');
  const bubble = root.querySelector('.cys-pet-bubble');
  const input = root.querySelector('.cys-pet-input');
  const spriteLayers = [...root.querySelectorAll('.cys-pet-sprite')];

  if (!character || !panel || !panelHead || !bubble) return;

  /* Renderer host: v0.5 owns state dispatch; v0.6 supplies a mount point and a
     richer contract for Rive/Live2D without touching page or Agent logic. */
  let renderStage = root.querySelector('.cys-pet-render-stage');
  if (!renderStage) {
    renderStage = document.createElement('div');
    renderStage.className = 'cys-pet-render-stage';
    spriteLayers.forEach((layer) => renderStage.appendChild(layer));
    character.insertBefore(renderStage, character.firstChild);
  }

  let rendererHost = root.querySelector('.cys-pet-renderer-host');
  if (!rendererHost) {
    rendererHost = document.createElement('div');
    rendererHost.className = 'cys-pet-renderer-host';
    rendererHost.setAttribute('aria-hidden', 'true');
    character.insertBefore(rendererHost, renderStage.nextSibling);
  }

  /* Page context row. It updates quietly as sections become prominent, giving
     the companion actual awareness of what the visitor is reading. */
  let contextRow = root.querySelector('.cys-pet-context');
  if (!contextRow) {
    contextRow = document.createElement('div');
    contextRow.className = 'cys-pet-context';
    contextRow.innerHTML = '<span>NOW</span><b>ARCHIVE</b>';
    panelHead.insertAdjacentElement('afterend', contextRow);
  }
  const contextLabel = contextRow.querySelector('b');
  let activeSection = '';

  function routeName() {
    const name = location.pathname.split('/').pop() || 'index.html';
    const map = {
      'index.html': 'HOME', 'profile.html': 'PROFILE', 'experience.html': 'EXPERIENCE',
      'education.html': 'EDUCATION', 'focus.html': 'FOCUS', 'contact.html': 'CONTACT'
    };
    return map[name] || 'ARCHIVE';
  }

  function labelForSection(el) {
    if (!el) return routeName();
    const heading = el.querySelector?.('h1, h2, h3, .sub-kicker, .case-role');
    const raw = heading?.textContent?.trim().replace(/\s+/g, ' ');
    if (!raw) return routeName();
    return `${routeName()} · ${raw}`.slice(0, 82);
  }

  function updateContext(label) {
    activeSection = label || routeName();
    contextLabel.textContent = activeSection;
    contextLabel.title = activeSection;
  }
  updateContext(routeName());

  const contextTargets = [...document.querySelectorAll('.subpage-hero, .content-block, .case-section, .slide-panel, .focus-item, .timeline-item')];
  if ('IntersectionObserver' in window && contextTargets.length) {
    const visible = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.set(entry.target, entry.intersectionRatio);
        else visible.delete(entry.target);
      });
      if (!visible.size) return;
      const [best] = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
      updateContext(labelForSection(best));
    }, { threshold: [0.3, 0.5, 0.7] });
    contextTargets.forEach((el) => observer.observe(el));
  }

  /* Accessibility: expose panel state and keep hidden controls out of the tab
     order. */
  panel.id ||= 'cysPetPanel';
  character.setAttribute('aria-controls', panel.id);
  character.setAttribute('aria-expanded', panel.classList.contains('is-open') ? 'true' : 'false');
  if ('inert' in panel) panel.inert = !panel.classList.contains('is-open');

  const panelObserver = new MutationObserver(() => {
    const open = panel.classList.contains('is-open');
    character.setAttribute('aria-expanded', String(open));
    if ('inert' in panel) panel.inert = !open;
    if (open) requestAnimationFrame(() => fitFloating(panel, 'panel'));
  });
  panelObserver.observe(panel, { attributes: true, attributeFilter: ['class'] });

  if (panelSub) panelSub.textContent = 'CASE / TREATY / RESEARCH · v0.6 WEB';

  /* Minimize/restore: useful on phones and long reading sessions. It persists
     only for the current tab session, so the companion always returns next time. */
  const tools = document.createElement('span');
  tools.className = 'cys-pet-panel-tools';
  const minimize = document.createElement('button');
  minimize.type = 'button';
  minimize.className = 'cys-pet-panel-minimize';
  minimize.setAttribute('aria-label', 'Minimize CYS companion');
  minimize.textContent = '−';
  tools.append(minimize);
  if (panelClose) tools.append(panelClose);
  panelHead.append(tools);

  const summon = document.createElement('button');
  summon.type = 'button';
  summon.className = 'cys-pet-summon';
  summon.setAttribute('aria-label', 'Restore CYS Archive Companion');
  summon.textContent = 'CYS';
  document.body.appendChild(summon);

  function minimizedStored() {
    try { return sessionStorage.getItem('cys-pet-minimized-v1') === '1'; }
    catch (_) { return false; }
  }
  function storeMinimized(value) {
    try { sessionStorage.setItem('cys-pet-minimized-v1', value ? '1' : '0'); }
    catch (_) {}
  }
  function syncSummonSide() {
    summon.classList.toggle('is-left', root.classList.contains('is-left'));
  }
  function minimizePet() {
    api.close?.();
    root.classList.add('is-minimized');
    summon.classList.add('is-visible');
    storeMinimized(true);
    syncSummonSide();
  }
  function restorePet({ greet = true } = {}) {
    root.classList.remove('is-minimized');
    summon.classList.remove('is-visible');
    storeMinimized(false);
    if (greet) {
      api.setState?.('wave', { force: true, priority: 36, duration: 1500, after: 'idle' });
      api.say?.(document.documentElement.lang?.startsWith('en') ? 'Archive Companion restored.' : '档案助手已回来。', { duration: 1500 });
    }
  }
  minimize.addEventListener('click', minimizePet);
  summon.addEventListener('click', () => restorePet());

  const sideObserver = new MutationObserver(syncSummonSide);
  sideObserver.observe(root, { attributes: true, attributeFilter: ['class'] });
  syncSummonSide();
  if (minimizedStored()) minimizePet();

  /* Smart floating placement for a pet that can be dragged anywhere. */
  function fitFloating(el, type) {
    if (!el || isMobile() || root.classList.contains('is-minimized')) return;
    const prop = type === 'panel' ? '--cys-panel-shift-y' : '--cys-bubble-shift-y';
    el.style.setProperty(prop, '0px');
    const rect = el.getBoundingClientRect();
    const safeTop = 82;
    const safeBottom = innerHeight - 14;
    let shift = 0;
    if (rect.top < safeTop) shift += safeTop - rect.top;
    if (rect.bottom + shift > safeBottom) shift -= rect.bottom + shift - safeBottom;
    el.style.setProperty(prop, `${Math.round(shift)}px`);
  }

  const bubbleObserver = new MutationObserver(() => {
    if (bubble.classList.contains('is-visible')) requestAnimationFrame(() => fitFloating(bubble, 'bubble'));
  });
  bubbleObserver.observe(bubble, { attributes: true, attributeFilter: ['class'] });

  function refit() {
    if (panel.classList.contains('is-open')) fitFloating(panel, 'panel');
    if (bubble.classList.contains('is-visible')) fitFloating(bubble, 'bubble');
    syncSummonSide();
  }
  window.addEventListener('resize', refit, { passive: true });
  window.addEventListener('orientationchange', () => setTimeout(refit, 120), { passive: true });
  root.addEventListener('cys:state', () => requestAnimationFrame(refit));

  /* Renderer v2 adapter. Expected shape:
     { kind, mount(host, ctx), setState(state, options), setLook({x,y}),
       setActive(bool), resize(rect), destroy() }
     Only setState is required. */
  let mountedRenderer = null;
  const coreRegisterRenderer = api.registerRenderer?.bind(api);

  function mountRenderer(renderer) {
    if (!renderer || typeof renderer.setState !== 'function' || !coreRegisterRenderer) return false;
    try { mountedRenderer?.destroy?.(); } catch (_) {}
    rendererHost.replaceChildren();

    const context = {
      root,
      character,
      host: rendererHost,
      version: VERSION,
      reducedMotion: reduceMotion,
      assetBase: ASSET,
      getContext: () => companionContext()
    };

    try { renderer.mount?.(rendererHost, context); }
    catch (error) {
      console.error('[CYS] custom renderer mount failed', error);
      return false;
    }

    const adapter = {
      kind: renderer.kind || 'custom-v2',
      setState(state, options) { renderer.setState(state, options, context); }
    };
    const ok = coreRegisterRenderer(adapter);
    if (!ok) return false;

    mountedRenderer = renderer;
    root.dataset.renderer = adapter.kind;
    try { renderer.setActive?.(!document.hidden && !root.classList.contains('is-minimized')); } catch (_) {}
    try { renderer.resize?.(character.getBoundingClientRect()); } catch (_) {}
    return true;
  }

  function companionContext() {
    return {
      version: VERSION,
      route: routeName(),
      path: location.pathname,
      language: document.documentElement.lang || 'zh-CN',
      section: activeSection || routeName(),
      state: api.state?.() || root.dataset.state || 'idle',
      renderer: api.renderer?.() || root.dataset.renderer || 'unknown',
      minimized: root.classList.contains('is-minimized')
    };
  }

  if (!reduceMotion) {
    window.addEventListener('pointermove', (event) => {
      if (!mountedRenderer?.setLook || mountedRenderer.kind === 'layered-motion' || root.classList.contains('is-minimized')) return;
      const rect = character.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * .28;
      const x = Math.max(-1, Math.min(1, (event.clientX - cx) / Math.max(innerWidth * .34, 1)));
      const y = Math.max(-1, Math.min(1, (event.clientY - cy) / Math.max(innerHeight * .34, 1)));
      try { mountedRenderer.setLook({ x, y }); } catch (_) {}
    }, { passive: true });
  }

  document.addEventListener('visibilitychange', () => {
    try { mountedRenderer?.setActive?.(!document.hidden && !root.classList.contains('is-minimized')); } catch (_) {}
  });
  const characterResize = new ResizeObserver(() => {
    try { mountedRenderer?.resize?.(character.getBoundingClientRect()); } catch (_) {}
    refit();
  });
  characterResize.observe(character);

  /* Public v0.6 surface. Preserve v0.5 methods while adding non-breaking APIs. */
  api.version = VERSION;
  api.mountRenderer = mountRenderer;
  api.context = companionContext;
  api.minimize = minimizePet;
  api.restore = restorePet;
  api.isMinimized = () => root.classList.contains('is-minimized');
  api.refit = refit;
  api.rendererHost = () => rendererHost;

  const readyDetail = { api, context: companionContext() };
  window.dispatchEvent(new CustomEvent('cys:pet:ready', { detail: readyDetail }));
  document.dispatchEvent(new CustomEvent('cys:pet:ready', { detail: readyDetail }));
})();
