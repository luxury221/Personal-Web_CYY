# CYS Archive Companion — Rive Rig Spec v0.7.1

This document is the production handoff for replacing the current `layered-motion` WebP renderer with a true Rive character while keeping the existing website state machine, section triggers, drag/sleep behavior and Agent bridge unchanged.

## 1. Master artwork

Recommended source canvas: **2048 × 2560 px**, transparent background, front-facing neutral pose, full body visible, feet anchored to a shared baseline.

All hidden overlap regions must be fully painted. Do not crop an arm exactly at the jacket edge, do not stop hair where it passes behind the torso, and do not leave unpainted gaps behind the archive book. Rive deformation and bone rotation will reveal those areas.

Keep the current character identity and palette:

- suit: `#28302E`
- shirt: `#EAE4D8`
- tie/accent: `#315A59`
- brass: `#A68A63`
- paper: `#DCD4C6`
- ink: `#1E2A2B`

The final silhouette should remain restrained and professional rather than exaggerated or game-like.

## 2. Layer hierarchy

Recommended draw order, back to front:

```text
ROOT
├─ hair_back
│  ├─ hair_back_left
│  └─ hair_back_right
├─ body
│  ├─ hips
│  ├─ thigh_left
│  ├─ thigh_right
│  ├─ calf_left
│  ├─ calf_right
│  ├─ shoe_left
│  └─ shoe_right
├─ torso
│  ├─ shirt
│  ├─ collar_left
│  ├─ collar_right
│  ├─ tie
│  ├─ suit_torso
│  ├─ lapel_left
│  ├─ lapel_right
│  └─ cys_pin
├─ arm_left
│  ├─ upper_arm_left
│  ├─ forearm_left
│  └─ hand_left
├─ archive_book
│  ├─ archive_book_back
│  ├─ archive_pages
│  └─ archive_book_front
├─ arm_right
│  ├─ upper_arm_right
│  ├─ forearm_right
│  └─ hand_right
├─ neck
├─ face
│  ├─ face_base
│  ├─ ear_left
│  ├─ ear_right
│  ├─ brow_left
│  ├─ brow_right
│  ├─ eye_white_left
│  ├─ eye_white_right
│  ├─ iris_left
│  ├─ iris_right
│  ├─ pupil_left
│  ├─ pupil_right
│  ├─ eye_highlight_left
│  ├─ eye_highlight_right
│  ├─ eyelid_left
│  ├─ eyelid_right
│  ├─ nose
│  ├─ mouth_closed
│  ├─ mouth_open
│  └─ mouth_smile
└─ hair_front
   ├─ hair_front_center
   ├─ hair_front_left
   ├─ hair_front_right
   ├─ hair_side_left
   └─ hair_side_right
```

## 3. Bone / pivot plan

Use restrained rotations. The site is an archive portfolio, not a character game.

```text
root                pivot: feet center
hips                pivot: pelvis center
spine_01            pivot: lower torso
spine_02            pivot: upper torso
neck                 pivot: base of neck
head                 pivot: neck/head junction
arm_l_upper          pivot: left shoulder
arm_l_fore           pivot: left elbow
hand_l               pivot: left wrist
arm_r_upper          pivot: right shoulder
arm_r_fore           pivot: right elbow
hand_r               pivot: right wrist
book                 pivot: hand/book contact center
leg_l_upper          pivot: left hip
leg_l_lower          pivot: left knee
leg_r_upper          pivot: right hip
leg_r_lower          pivot: right knee
```

Recommended maximum visible ranges:

- head yaw-like 2D rotation: ±3.5°
- head translation: ±3 px at 1024×1280 artboard scale
- torso rotation: ±1.5°
- torso breath scale: 0.995–1.006
- idle shoulder shift: ≤ 2 px
- hair secondary rotation: ±2.5°
- eye look: ±4 px horizontally, ±2.5 px vertically

## 4. Five first-release animations

### idle

Loop, ~5.6 s. Lower body nearly fixed. Torso performs slow breath. Head drifts on a slightly different period to avoid synchronized mechanical movement. Hair follows head with a small delay.

### blink

Trigger, ~140 ms. Both lids close and reopen. Add a 15–20% chance of a second blink 120–180 ms later in runtime logic or the Rive state machine.

### wave

Trigger, ~1.65 s. Right arm lifts, forearm rotates outward, wrist gives two restrained beats, then returns to the neutral pose. Torso should shift only slightly so the feet stay visually anchored.

### thinking

Trigger/short hold, ~2.1 s. Head tilts slightly, gaze moves down-left or down-right, one hand may approach the chin if the artwork supports it. No exaggerated sway.

### read

Trigger/short hold, ~1.8 s. Eyes and head shift toward the archive book, book tilts slightly, left hand grip adjusts subtly. Used for page and section entry actions.

The second release can add `working`, `sleep`, `wake`, `success`, and `error` once the five core motions are approved.

## 5. State machine

State machine name: **`CYS Companion`**

Inputs:

### Numbers

- `lookX` in `[-1, 1]`
- `lookY` in `[-1, 1]`
- `energy` in `[0, 1]`

### Booleans

- `isWorking`
- `isSleeping`
- `isDragging`

### Triggers

- `wave`
- `read`
- `think`
- `success`
- `error`
- `wake`

Priority inside Rive should mirror the website runtime:

```text
isDragging
  > isWorking / error / success
  > isSleeping
  > explicit trigger
  > idle
```

Do not create a hover trigger. The current product policy deliberately keeps mouse hover and mouse movement from changing the visible pose.

## 6. Website mapping

Existing semantic states map to Rive as follows:

| Website state | Rive behavior |
| --- | --- |
| `idle` | idle loop |
| `hover` | idle loop |
| `wave` | fire `wave` |
| `point` | temporarily fire `wave` until a clean point animation exists |
| `read` | fire `read` |
| `thinking` | fire `think` |
| `working` | `isWorking = true` |
| `success` | fire `success` |
| `error` | fire `error` |
| `dragging` | `isDragging = true` |
| `sleep` | `isSleeping = true` |
| `wake` | `isSleeping = false`, fire `wake` |

The existing website already emits these semantic states. Do not duplicate page/section logic inside Rive.

## 7. Export rules

Before exporting `cys-companion.riv`:

1. All artboard and state-machine names must match this spec exactly.
2. No public debug labels or version strings should appear visually.
3. Character origin must remain bottom-center so drag/snap does not jump when the renderer changes.
4. The model must look acceptable at ~120–160 px CSS width.
5. Avoid thin subpixel facial strokes that disappear at desktop-pet scale.
6. Test with transparent background only.
7. Test `prefers-reduced-motion`: runtime may freeze non-essential loops.
8. Ensure `setActive(false)` can pause the model without losing state.

Target repository path after export:

```text
assets/cys-pet/rive/cys-companion.riv
```

Once that file exists, the existing `CYSPet.mountRenderer()` bridge can replace the WebP pseudo-rig without changing the website interaction model.
