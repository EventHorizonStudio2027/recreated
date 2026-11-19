# Recreated migration ledger

**Source of truth:** root `index.html` and `src/game-engine.js` remain unchanged during Phase 1. The Unity prototype is a parallel implementation, not a replacement.

| Browser gameplay system | Unity Phase 1 implementation | Status |
|---|---|---|
| Movement / directional facing | `PlayerController` and mouse aiming | Implemented; Unity runtime unverified |
| Melee strike | Physics overlap + forward cone | Implemented; Unity runtime unverified |
| Echo Pulse | Q radial attack with cooldown | Implemented; Unity runtime unverified |
| Dodge | Shift burst + cooldown | Implemented; Unity runtime unverified |
| Enemy pursuit | `EnemyController` | Implemented; Unity runtime unverified |
| Player and enemy health | `Health` | Implemented; EditMode tests authored |
| 3-chamber expedition | `ExpeditionDirector` | Prototype only |
| Top-down camera | `FollowCamera` orthographic 2.5D | Implemented; Unity runtime unverified |
| Mire environment | Procedural floor and ruins | Placeholder prototype |
| Loomhouse hub | Not yet migrated | Open |
| Sunken Ruins / Warden | Not yet migrated | Open |
| Echo relics / elemental synergies | Not yet migrated | Open |
| Local world evolution / Author | Not yet migrated | Open |
| Save/load / import/export | Not yet migrated | Open |
| Gamepad and touch input | Not yet migrated | Open |
| Art, animation, audio | Placeholders only | Open |
| Unity Editor compilation / builds | No Unity runner connected | **Blocked / unverified** |

## Visual direction

2.5D orthographic camera, 3D terrain and characters, stylized atmospheric lighting. The initial Unity prototype deliberately uses primitive meshes so core gameplay can be validated before investing in production assets. The in-game top-left HUD is the first Unity interface improvement.

## Quality gates

1. GitHub Node and browser regression tests green (verifies additive source layout and preserves browser game).
2. Unity Hub imports `unity/` and resolves packages without errors.
3. Generate Prototype Scene and run EditMode tests inside Unity.
4. Press Play; verify movement, melee, dodge, pulse, enemy damage, chamber transitions, restart and camera follow.
5. Commit generated scene, project configuration and any Unity-specific fixes.
6. Only then call the Unity foundation **verified** and close GitHub issue #21.

Do not delete or rewrite the web game while migration is incomplete.

## Current import risk and next verification

- Runtime assembly explicitly references `Unity.InputSystem`; missing this reference previously risked an Editor compile error.
- The scene generator uses URP/Lit materials when available, with a Standard fallback; final URP pipeline asset assignment and lighting must be checked in Unity Editor.
- The generated scene is not committed yet because it requires Unity Editor to serialize it. Generate via **Recreated > Generate Prototype Scene**.
- Verify material appearance, collider behavior, enemy pursuit, camera tracking, HUD scaling and console errors in the Editor. GitHub source tests do not establish runtime correctness.
