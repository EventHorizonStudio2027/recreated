# Recreated — browser functionality audit (2026-11-20)

## Confirmed by source inspection (not yet browser-tested this iteration)

- The repository root `index.html` includes a separate `#gameLayer` with canvas `#playfield`, combat HUD, hub navigation, mobile buttons, controls dialog and save import/export controls.
- The playable script defines `start(fresh=false)`, `stop()`, `refreshJourneyButtons()` and binds title screen New/Continue actions to real gameplay.
- `save()` writes `recreated-playable-v2` to localStorage and keeps a valid backup; `load()` attempts primary and backup recovery using `isValidSave`.
- The old title-screen script also defines `begin()`, which still contains an obsolete non-playable modal. The later playable script replaces the New/Continue click handlers; remove or isolate that legacy code only after integration tests prove no other menu dependency.
- Title markup formerly claimed BUILD 1.5 while document title claimed v2.3 and package.json claims 0.7.0. User-facing title/build text has been normalized without changing game state or package version.

## Changes in this iteration

1. Corrected obsolete title-screen modal text that inaccurately claimed no playable combat existed.
2. Removed conflicting visible version numbers in browser title/footer.
3. Improved menu keyboard-focus styling and journey hint readability.
4. Added a second final visual pass: quieter gold footer divider and reduced-motion hover behavior.

## Outstanding issues — start at 1

1. **Browser integration test:** launch from a clean profile; verify New, Continue, Hub, expedition combat, return and save/reload end-to-end. Source presence is not proof.
2. **Legacy menu cleanup:** remove dead `begin()` flow after proving no regressions and add a test preventing future false non-playable messaging.
3. **Persistence validation:** test corrupt primary, valid backup, imported saves, and reward duplication across restart.
4. **World consequence validation:** confirm the same expedition choice changes world state, persists, and displays correctly after reload.
5. **Unity Editor verification:** compile, generate scene, run Play Mode and EditMode tests in an actual Unity 6 editor.

## QA notes

The browser entry point is `index.html`. No live browser or Unity Editor run occurred during this audit. No claim of feature parity or full playability is made. Do not discard the browser game during Unity migration.
