# Recreated

**The world remembers. Nothing stays the same.**

Recreated is a web-first action roguelite set in the Weave, with a persistent Loomhouse hub, evolving regions, and a bounded AI Author system. A Unity 6 URP 2.5D prototype is developed alongside the browser game, **not as a replacement**.

## Play and develop

- **Browser:** open [index.html](index.html) or serve the repository root with a local static HTTP server. The browser game and its tests remain preserved.
- **Unity:** open the [unity project](unity/) in Unity Hub with Unity 6 (project baseline 6000.0.43f1); use **Recreated → Open Prototype Scene**, then Play.
- **Browser tests:** `npm test` (Node.js required).
- **Unity first-run checklist and troubleshooting:** [unity/README.md](unity/README.md) and [docs/UNITY_FIRST_PLAY.md](docs/UNITY_FIRST_PLAY.md).

## Verification status

Browser source and automated checks have been developed and exercised in earlier iterations. Unity C# source, editor scene builder, combat, controller support, and HUD are committed, **but real Unity Editor compilation, scene generation and Play Mode have not yet been verified**. Do not mistake passing source-level checks for a Unity playtest. The generated scene is not necessarily committed until built by the Editor.

## Design principles

- Preserve Recreated's purple-and-gold visual identity and original iconography; keep it distinct from Fate's Passage.
- Keep browser and Unity implementations in parallel until the new version reaches verified parity.
- Prefer portable content schemas, deterministic tests, and explicit patch rollback.
- Keep the Author constrained by validated rules; it must never modify monetization or protected game rules.
- Track verified behavior separately from implemented features.

## Project areas

`index.html` and browser assets: playable browser prototype; `unity/`: Unity 6 prototype; `content/`: world definitions; `author/`: proposal/validation; `tests/`: automated checks; `docs/`: design and engineering notes.

## Next blocking milestone

Open Unity and complete the [first-play acceptance checklist](docs/UNITY_FIRST_PLAY.md). If compilation fails, capture the **first red Console error** with its full message and file/line. That is the highest-priority unresolved blocker.
