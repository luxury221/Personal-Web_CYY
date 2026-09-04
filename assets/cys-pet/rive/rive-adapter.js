(() => {
  'use strict';

  /*
    Rive adapter scaffold for CYS Archive Companion.

    This file is intentionally NOT loaded by script.js yet. It is the handoff
    layer that becomes active once a real `cys-companion.riv` file exists and a
    Rive runtime has been provided by the host page.

    Usage after the .riv asset is ready:

      const renderer = CYSRiveAdapter.create({
        rive: riveInstance,
        stateMachine: 'CYS Companion'
      });
      CYSPet.mountRenderer(renderer);

    `riveInstance` is expected to expose state-machine inputs in the normal Rive
    JS shape. Keeping construction outside this file avoids pinning the website
    to a CDN/runtime version before the final asset is approved.
  */

  const DEFAULT_MACHINE = 'CYS Companion';

  const STATE = {
    idle: 'idle',
    hover: 'idle',
    boot: 'idle',
    wave: 'wave',
    point: 'wave',
    read: 'read',
    thinking: 'think',
    working: 'working',
    success: 'success',
    error: 'error',
    dragging: 'dragging',
    sleep: 'sleep',
    wake: 'wake'
  };

  function indexInputs(inputs = []) {
    const map = new Map();
    for (const input of inputs) {
      if (input?.name) map.set(input.name, input);
    }
    return map;
  }

  function setBoolean(input, value) {
    if (!input) return;
    try { input.value = Boolean(value); } catch (_) {}
  }

  function setNumber(input, value) {
    if (!input) return;
    try { input.value = Number(value); } catch (_) {}
  }

  function fire(input) {
    if (!input) return;
    try {
      if (typeof input.fire === 'function') input.fire();
      else input.value = true;
    } catch (_) {}
  }

  function create(options = {}) {
    const rive = options.rive;
    if (!rive) throw new Error('CYSRiveAdapter.create requires a Rive instance.');

    const stateMachine = options.stateMachine || DEFAULT_MACHINE;
    let inputs = new Map();
    let active = true;
    let currentState = 'idle';

    function refreshInputs() {
      const list = typeof rive.stateMachineInputs === 'function'
        ? rive.stateMachineInputs(stateMachine)
        : [];
      inputs = indexInputs(list);
    }

    function resetMomentaryFlags() {
      setBoolean(inputs.get('isWorking'), false);
      setBoolean(inputs.get('isSleeping'), false);
      setBoolean(inputs.get('isDragging'), false);
    }

    function applyState(state) {
      currentState = state || 'idle';
      const semantic = STATE[currentState] || 'idle';

      if (semantic !== 'working') setBoolean(inputs.get('isWorking'), false);
      if (semantic !== 'sleep') setBoolean(inputs.get('isSleeping'), false);
      if (semantic !== 'dragging') setBoolean(inputs.get('isDragging'), false);

      switch (semantic) {
        case 'wave':
          fire(inputs.get('wave'));
          break;
        case 'read':
          fire(inputs.get('read'));
          break;
        case 'think':
          fire(inputs.get('think'));
          break;
        case 'working':
          setBoolean(inputs.get('isWorking'), true);
          break;
        case 'success':
          fire(inputs.get('success'));
          break;
        case 'error':
          fire(inputs.get('error'));
          break;
        case 'dragging':
          setBoolean(inputs.get('isDragging'), true);
          break;
        case 'sleep':
          setBoolean(inputs.get('isSleeping'), true);
          break;
        case 'wake':
          setBoolean(inputs.get('isSleeping'), false);
          fire(inputs.get('wake'));
          break;
        default:
          break;
      }
    }

    return {
      kind: 'rive',

      mount(host) {
        if (!host) return;
        refreshInputs();
        resetMomentaryFlags();
        applyState(currentState);
      },

      setState(state) {
        applyState(state);
      },

      setLook({ x = 0, y = 0 } = {}) {
        setNumber(inputs.get('lookX'), Math.max(-1, Math.min(1, x)));
        setNumber(inputs.get('lookY'), Math.max(-1, Math.min(1, y)));
      },

      setActive(next) {
        active = Boolean(next);
        try {
          if (active) rive.play?.();
          else rive.pause?.();
        } catch (_) {}
      },

      resize() {
        try { rive.resizeDrawingSurfaceToCanvas?.(); } catch (_) {}
      },

      destroy() {
        resetMomentaryFlags();
        try { rive.cleanup?.(); } catch (_) {}
      },

      debug() {
        return {
          kind: 'rive',
          stateMachine,
          currentState,
          active,
          inputs: [...inputs.keys()]
        };
      }
    };
  }

  window.CYSRiveAdapter = Object.freeze({ create, stateMachine: DEFAULT_MACHINE });
})();
