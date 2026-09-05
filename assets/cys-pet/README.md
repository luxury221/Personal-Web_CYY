# CYY Research Assistant — Web Pet v0.8

This folder contains the website-integrated **CYY Research Assistant**, a lightweight chibi mascot derived from Yaoyang Chen's own visual identity rather than the previous unrelated female character.

## Character direction

The current mascot keeps a small set of recognizable personal features:

- fluffy black hair;
- black rectangular glasses;
- navy / cream / muted-red knitwear palette;
- restrained student / research-assistant styling;
- transparent WebP artwork optimized for the small floating companion size.

The visual goal is **personal research identity first, mascot cuteness second**. It should read as a compact CYY research companion inside the Editorial AI × Research Console portfolio rather than as an unrelated anime character.

## Current pose assets

```text
assets/cys-pet/
├─ idle.webp       # neutral standing pose
├─ wave.webp       # greeting / wake / success
├─ thinking.webp   # thinking / error
├─ point.webp      # presentation / direction pose
├─ read.webp       # tablet / reading / working
└─ sleep.webp      # quiet-rest fallback
```

All six files now use the CYY character. The previous female artwork is no longer referenced by these pose paths.

Current runtime semantics:

- `idle / hover / dragging` → `idle.webp`
- `wave / wake / success` → `wave.webp`
- `read / working` → `read.webp`
- `thinking / error` → `thinking.webp`
- `sleep` → `sleep.webp`
- `point` → dedicated `point.webp`

### Point-state compatibility

The historical v0.7 JavaScript renderer temporarily aliases `point` to `wave.webp` because the old point artwork had a colour/glitch artifact. The new CYY point artwork is clean, so `pet-v07.css` now applies a state-specific compatibility override: while the semantic state is `point`, the dedicated `point.webp` is rendered directly and the legacy wave layers are hidden.

This keeps the consolidated runtime backward-compatible while making the visible state mapping correct. A future runtime refactor can remove the historical JavaScript alias entirely.

## Runtime architecture

The public site uses the consolidated `script.js` entry. It contains the historical pet layers in order:

1. core state machine and Agent bridge;
2. interaction shell / minimize / restore / viewport fitting;
3. behavior correction and semantic action director;
4. layered continuous-motion renderer;
5. research-assistant retrieval and greeting layer.

The supporting CSS remains split under `assets/cys-pet/` for easier visual maintenance.

## Trigger policy

Character pose changes stay tied to meaningful events:

- home page: one welcome action;
- subpage entry: one silent page-specific action;
- content region: action only after a meaningful dwell;
- page/navigation guidance: dedicated presentation pose;
- character click: explicit greeting interaction;
- Agent lifecycle: `thinking / working / success / error` overrides lower-priority page actions;
- mouse movement, character hover, nav hover, fast scrolling and random idle timers do not visibly switch poses;
- sleep/wake and drag/snap remain intact.

## UI identity

The user-facing assistant identity is:

```text
CYY / RESEARCH ASSISTANT
```

The minimized restore control is visually labeled `CYY`.

Internal CSS classes and the global API still keep the historical `cys-pet-*` / `CYSPet` names for backward compatibility. These are implementation identifiers only and do not represent the public character identity.

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
CYSPet.renderer();
CYSPet.motionEngine();
```

Agent lifecycle:

```js
CYSPet.agent.thinking('正在检索档案…');
CYSPet.agent.working('正在读取相关材料…');
CYSPet.agent.success('已找到相关经历。');
CYSPet.agent.error('读取失败，请稍后重试。');
```

## Rive production path

The current WebP artwork is still flattened, so the layered renderer is a **pseudo-rig rather than a true skeletal rig**. The repository keeps the future Rive contract under:

```text
assets/cys-pet/rive/
├─ manifest.json
├─ RIG_SPEC.md
└─ rive-adapter.js
```

A future production-quality version should redraw the CYY mascot as genuine separated layers:

- eyes / eyelids / pupils;
- front and back hair;
- face;
- torso;
- left / right upper and lower arms;
- hands;
- legs;
- optional tablet / research-card prop.

That layered artwork can then be rigged without changing the website's page-context, Agent lifecycle, panel, drag, sleep or routing logic.

Target final asset path remains:

```text
assets/cys-pet/rive/cys-companion.riv
```

The next meaningful animation upgrade should therefore be **true layered art + Rive rigging**, not additional flattened WebP motion hacks.
