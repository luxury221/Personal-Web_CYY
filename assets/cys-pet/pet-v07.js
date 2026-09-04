(() => {
  'use strict';

  const api = window.CYSPet;
  const root = document.querySelector('.cys-pet-root');
  if (!api || !root || root.dataset.v07Ready === '1') return;

  const VERSION = '0.7.0';
  const ASSET = 'assets/cys-pet/';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.dataset.v07Ready = '1';

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = `${ASSET}pet-v07.css?v=${VERSION}`;
  document.head.appendChild(style);

  const assetForState = {
    boot: 'idle.webp',
    idle: 'idle.webp',
    hover: 'idle.webp',
    dragging: 'idle.webp',
    wake: 'wave.webp',
    wave: 'wave.webp',
    success: 'wave.webp',
    point: 'wave.webp',
    read: 'read.webp',
    working: 'read.webp',
    thinking: 'thinking.webp',
    error: 'thinking.webp',
    sleep: 'sleep.webp'
  };

  function createSet(index) {
    const set = document.createElement('div');
    set.className = `cys-v07-set${index === 0 ? ' is-active' : ''}`;
    set.dataset.rigSet = String(index);

    ['lower', 'torso', 'upper'].forEach((part) => {
      const img = document.createElement('img');
      img.className = `cys-v07-layer cys-v07-layer--${part}`;
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      img.draggable = false;
      img.decoding = 'async';
      set.appendChild(img);
    });

    return set;
  }

  function layeredRenderer() {
    let rig = null;
    let sets = [];
    let activeSet = 0;
    let currentAsset = '';
    let currentState = 'idle';
    let destroyed = false;
    let swapToken = 0;

    function imagesFor(set) {
      return [...set.querySelectorAll('.cys-v07-layer')];
    }

    function loadSet(set, src, token) {
      const images = imagesFor(set);
      return Promise.all(images.map((img) => new Promise((resolve) => {
        if (destroyed || token !== swapToken) return resolve();
        if (img.src.endsWith(src) && img.complete) return resolve();
        const done = () => {
          img.onload = null;
          img.onerror = null;
          resolve();
        };
        img.onload = done;
        img.onerror = done;
        img.src = src;
      })));
    }

    function applySemanticState(state) {
      currentState = state || 'idle';
      if (rig) rig.dataset.motionState = currentState;
    }

    return {
      kind: 'layered-motion',

      mount(host) {
        rig = document.createElement('div');
        rig.className = 'cys-v07-rig';
        rig.dataset.motionState = 'idle';
        sets = [createSet(0), createSet(1)];
        sets.forEach((set) => rig.appendChild(set));
        host.replaceChildren(rig);

        const idle = `${ASSET}${assetForState.idle}`;
        currentAsset = idle;
        sets.forEach((set) => imagesFor(set).forEach((img) => { img.src = idle; }));
      },

      setState(state, options = {}) {
        if (!rig || destroyed) return;
        const semantic = state || 'idle';
        const src = `${ASSET}${assetForState[semantic] || assetForState.idle}`;
        applySemanticState(semantic);

        /* Semantic states can share the same pose asset (POINT uses WAVE while
           the old point.webp is bypassed). In that case restart motion only;
           there is no reason to cross-fade the same bitmap. */
        if (src === currentAsset) {
          if (!reduceMotion && !options.immediate) {
            rig.classList.remove('is-restarting');
            void rig.offsetWidth;
            rig.classList.add('is-restarting');
            requestAnimationFrame(() => rig.classList.remove('is-restarting'));
          }
          return;
        }

        currentAsset = src;
        const token = ++swapToken;
        const nextIndex = activeSet === 0 ? 1 : 0;
        const next = sets[nextIndex];
        const prev = sets[activeSet];

        const activate = () => {
          if (destroyed || token !== swapToken) return;
          next.classList.add('is-active');
          prev.classList.remove('is-active');
          activeSet = nextIndex;
        };

        if (reduceMotion || options.immediate) {
          imagesFor(next).forEach((img) => { img.src = src; });
          activate();
          return;
        }

        loadSet(next, src, token).then(activate);
      },

      setActive(active) {
        if (!rig) return;
        rig.classList.toggle('is-paused', !active);
      },

      setLook() {
        /* Intentionally ignored for the WebP pseudo-rig. Pointer movement no
           longer shifts the whole character. A future Rive model can consume
           normalized gaze without changing this public renderer contract. */
      },

      resize() {
        /* CSS keeps the segmented layers aligned to the renderer host. */
      },

      destroy() {
        destroyed = true;
        ++swapToken;
        rig?.remove();
        rig = null;
        sets = [];
      }
    };
  }

  function mount() {
    if (typeof api.mountRenderer !== 'function') return false;
    const ok = api.mountRenderer(layeredRenderer());
    if (!ok) return false;

    root.dataset.motionEngine = 'layered-webp';
    api.version = VERSION;
    api.motionEngine = () => root.dataset.motionEngine || 'unknown';

    window.dispatchEvent(new CustomEvent('cys:pet:motion-ready', {
      detail: {
        version: VERSION,
        renderer: api.renderer?.(),
        motionEngine: api.motionEngine()
      }
    }));
    return true;
  }

  /* v0.6 creates mountRenderer synchronously before this file loads, but keep a
     short retry path so a slow browser cannot leave the character invisible. */
  if (!mount()) {
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (mount() || tries > 20) clearInterval(timer);
    }, 80);
  }
})();
