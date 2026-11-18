# Relic Resonance — local prototype v1.2

The approved Recreated logo, iconography and violet/gold palette remain embedded in the offline playable build.

## Two-relic effects

| Equipped relics | Resonance | Effect |
|---|---|---|
| Ember + Tide | Steam | +6 melee strike damage and +9 Echo Pulse damage |
| Ember + Gale | Storm | Melee cooldown reduced from 310 ms to 240 ms |
| Tide + Gale | Current | Restore up to 12 HP at the next chamber transition |

## Combat fixes

- Melee and Echo Pulse use segment-circle checks to prevent striking through stone cover.
- Enemy melee windups evaluate range at the moment damage resolves, rather than using a stale distance.

## Release status

Changes implemented and checked in the **local** `Recreated_Playable_v1_2.html` and project ZIP. JavaScript syntax, static regression tests and ZIP integrity passed. Interactive browser gameplay remains unverified. The full playable HTML and approved artwork have **not** yet been imported into GitHub; this document is not a deployment.
