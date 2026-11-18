# Chamber expeditions — v0.9

## Implemented in local HTML build

Each non-hub region now has three consecutive combat waves. The next wave starts 1.25 seconds after the previous wave's enemies and Echo drops are cleared. New spawns are bounded to 400 placement attempts, avoid the player and hazards, and gain 14% base HP per subsequent wave plus modest speed increases. The exit portal unlocks only when wave 3 is cleared.

The current build is delivered as `Recreated_Playable_v0_9.html` and a versioned ZIP outside GitHub. The playable HTML and its embedded visual assets are **not yet committed** to this repository. This file is design/implementation tracking, not evidence of a deployed game.

## Verification

Local Node syntax validation and static regression tests passed. Interactive browser testing is pending. A future integration should move encounter rules into portable modules and add end-to-end browser checks before releasing.
