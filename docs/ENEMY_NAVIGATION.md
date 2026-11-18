# Enemy navigation and cover — v1.3

The local v1.3 browser build adds cover-aware enemy steering. When an obstacle intersects the enemy-to-player segment, an enemy steers toward a tangent waypoint beyond the obstacle instead of directly pushing into it. A stable tie-breaker selects the steering side for near-collinear encounters. Existing collision resolution still prevents movement through cover.

Enemy windup initiation and resolved melee damage now require clear line of sight through solid stone cover. This applies to regular enemies and the Drowned Warden.

## Verification status

Local Node syntax checks, Python static regression checks, and ZIP integrity passed. Interactive browser gameplay and pathfinding edge cases remain unverified. This is a local prototype change: the complete playable HTML and approved artwork are not yet committed to GitHub.

## Next technical work

- Integrate browser-based gameplay tests for obstacle navigation and combat occlusion.
- Extract movement/geometry helpers into independently tested modules.
- Import the complete offline build and original embedded artwork into version control.
