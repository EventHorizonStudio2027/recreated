# Recreated — Unity 6 2.5D migration

This Unity project lives alongside, not in place of, the original offline browser game in the repository root. The existing `index.html`, JavaScript engine, and browser tests remain authoritative references during migration.

## Open
1. In Unity Hub, choose **Add project from disk** and select the **`unity`** directory.
2. Install/open with **Unity 6 6000.0.43f1** (or compatible Unity 6 editor). Package Manager will resolve URP.
3. In Unity choose **Recreated > Generate Prototype Scene**. This creates `Assets/Recreated/Scenes/Prototype.unity` and adds it to Build Settings.
4. Press Play. Move with WASD/arrows, aim with mouse, left-click/Space to attack, Shift to dodge, Q for Echo Pulse.

## Scope
Prototype foundation only: orthographic 2.5D camera, procedural primitive environment, player movement, simple melee and pulse, pursuing enemies, HUD, wave and health progression. Not yet feature-parity with the browser game. Source-only checks can run in GitHub Actions; actual Unity compilation and Play Mode testing still require Unity Editor/CI runner.

## Architecture
Runtime `Recreated.Runtime` assembly owns reusable gameplay systems. `Recreated.Editor` provides deterministic scene generation. No purchased assets or external SDK are required. Gameplay balance values are defined in `GameTuning` and can be moved into ScriptableObjects later.
