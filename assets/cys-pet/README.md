# CYS Archive Companion — Web Pet v0.7.1

This folder contains the website-integrated CYS Archive Companion for the static portfolio site.

## Runtime layout

- `pet.js` — v0.5 core state machine, Agent bridge, drag/sleep/page events.
- `pet.css` — core visual layer and legacy sprite renderer styles.
- `pet-v06.js` / `pet-v06.css` — v0.6 interaction shell, page context, minimize/restore, viewport fitting and renderer-v2 bridge.
- `pet-v061.js` — v0.6.1 behavior correction: mouse/hover suppression, home-only welcome, simplified labels and stable transition pose.
- `pet-v062.js` — v0.6.2 semantic action director: stable page/region actions, dwell gating and duplicate-trigger suppression.
- `pet-v07.js` / `pet-v07.css` — v0.7 layered continuous-motion renderer.
- `rive/` — v0.7.1 production handoff for the true Rive character.

The public site still includes only the shared `script.js` entry. It loads the site runtime and companion layers in order, so no HTML page needs duplicate pet markup.

## Trigger policy

Character pose changes remain tied to meaningful events:

- home page: welcome sentence and entry action;
- subpage entry: one silent page-specific action;
- content region: one action after the region remains dominant for a short dwell;
- character click: explicit `wave` action while opening/closing the archive panel;
- Agent lifecycle: `thinking / working / success / error` overrides lower-priority page actions;
- mouse movement, character hover, nav hover, fast scrolling and random idle timers do not visibly switch poses;
- 90-second sleep/wake and drag/snap remain intact.

## v0.7 layered-motion renderer

v0.7 mounts through the existing `CYSPet.mountRenderer()` bridge and replaces the visible two-sprite crossfade renderer with `layered-motion`.

The current WebP artwork is still flattened, so this remains a **pseudo-rig rather than a skeletal rig**. Each pose is split into feathered upper / torso / lower bands with independent, very small continuous motion. The goal is to reduce rigid-bitmap movement while preserving the current artwork until final layered art is available.

Current continuous loops:

- `idle` — slow breathing and balance shift;
- `wave / wake / success / point` — upper-body greeting rhythm with anchored lower body;
- `read / working` — slow reading/nodding rhythm, with a faster working cadence;
- `thinking / error` — restrained head/upper-body tilt;
- `sleep` — slow settling/breathing motion;
- `dragging` — motion loops pause so the figure remains stable under the pointer.

State changes cross-fade between pose sets. The old `point.webp` remains bypassed because of its colour/glitch artifact; semantic `point` uses the stable wave artwork.

## v0.7.1 Rive production handoff

The repository now contains an explicit Rive contract under `assets/cys-pet/rive/`:

```text
rive/
├─ manifest.json
├─ RIG_SPEC.md
└─ rive-adapter.js
```

`manifest.json` freezes the artboard, part names, animation names and state-machine inputs. `RIG_SPEC.md` defines the production layer hierarchy, pivots, motion limits and the first five approval animations: `idle`, `blink`, `wave`, `thinking`, and `read`.

`rive-adapter.js` is a dormant renderer adapter scaffold. It is deliberately **not loaded by the website yet** because the actual `cys-companion.riv` asset has not been authored. Once the Rive file exists, the adapter can translate the existing semantic website states into the Rive state machine without rewriting page triggers, context awareness, panel logic, drag/sleep behavior or the Agent bridge.

Target final asset path:

```text
assets/cys-pet/rive/cys-companion.riv
```

The Rive state machine name is fixed as:

```text
CYS Companion
```

Inputs:

- numbers: `lookX`, `lookY`, `energy`
- booleans: `isWorking`, `isSleeping`, `isDragging`
- triggers: `wave`, `read`, `think`, `success`, `error`, `wake`

Mouse hover intentionally has no animation input. The current product policy keeps the character quiet unless a meaningful page/section/click/Agent event occurs.

## UI cleanup retained

- speech bubble header: `Yaoyang Chen` only;
- no public web/version line in the panel;
- home-only default welcome sentence;
- no hover/nav chatter;
- page/section context, minimize/restore, keyboard focus and viewport clamping remain available.

## Public API

```js
CYSPet.state();
CYSPet.context();
CYSPet.open();
CYSPet.close();
CYSPet.minimize();
CYSPet.restore();
CYSPet.isMinimized();
CYSPet.refit();
CYSPet.renderer();      // layered-motion until the .riv asset is mounted
CYSPet.motionEngine();  // layered-webp
```

Agent lifecycle:

```js
CYSPet.agent.thinking('正在检索档案…');
CYSPet.agent.working('正在读取相关材料…');
CYSPet.agent.success('已找到相关经历。');
CYSPet.agent.error('读取失败，请稍后重试。');
```

## Final Rive path

The next production task is artwork, not more WebP motion logic. The neutral character must be redrawn/exported as genuinely separated eyes, eyelids, pupils, face, front/back hair, torso, arms, hands, legs and archive-book parts with fully painted overlap regions. That layered artwork can then be rigged to the contract in `rive/RIG_SPEC.md` and exported as `cys-companion.riv`.
