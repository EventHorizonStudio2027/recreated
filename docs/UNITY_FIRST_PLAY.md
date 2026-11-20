# Unity first-play acceptance checklist

**Status: BLOCKED — requires an actual Unity 6 Editor run.** Source inspection and GitHub Actions are not substitutes for this test.

## Before pressing Play

1. In Unity Hub, add the repository's **unity/** directory (not repository root).
2. Open with Unity **6000.0.43f1** where possible. Allow Package Manager and asset imports to finish.
3. Open **Window → General → Console**, enable Error filtering, and clear prior messages.
4. Select **Recreated → Open Prototype Scene**. Wait for the generated scene to load.
5. Verify the Hierarchy contains a player, camera, and expedition director. Confirm the scene is not blank.

## Play Mode acceptance

- [ ] Editor completes import and C# compilation without red Console errors.
- [ ] Prototype scene generation completes without overwrite/save dialogs on a clean checkout.
- [ ] Camera frames the arena and the player is visible on entering Play Mode.
- [ ] WASD moves; mouse aim follows cursor; left-click/Space attacks.
- [ ] Shift dodge works from standstill; Q Echo Pulse produces feedback.
- [ ] Enemies approach, can damage the player only within valid attack range, and can be defeated.
- [ ] HUD health and chamber status update; victory and defeat remain legible.
- [ ] Restart clears old enemies, resets player state and camera feedback.
- [ ] Narrow Game view remains readable without clipped status text.
- [ ] Exit Play Mode without a new red Console error.

## If blocked

Copy the **first red Console error**, including stack trace and file:line. Record Unity version, macOS version, whether the scene builder menu exists, and whether the error occurred during import, generation, or Play Mode. Fix the first error before chasing downstream messages.

## Evidence record

| Gate | Status | Evidence |
| --- | --- | --- |
| Browser code and tests | Previously reported passing | Re-run `npm test` before release |
| Unity source committed | Yes | `unity/` |
| Unity Editor compile | Unverified | Editor Console needed |
| Scene generation | Unverified | Generated scene and Console needed |
| Play Mode gameplay | Unverified | Manual test needed |
| Unity EditMode NUnit | Unverified | Unity Test Runner needed |

Do not mark any Unity gate complete without evidence from a Unity run. Preserve the browser game throughout migration.
