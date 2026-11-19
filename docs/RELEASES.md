# Recreated release tracking

## v0.8 — local build

The offline playable prototype v0.8 exists as a local HTML and project ZIP. This repository does **not** yet contain the large embedded HTML game file or its art assets. Do not describe GitHub as hosting a playable release.

Changes verified with Node syntax and static Python checks:
- Bounded enemy spawn attempts to avoid infinite loops in crowded arenas.
- Echo magnetism and eventual automatic pickup to prevent portal progression soft-locks.
- Safe hub resume instead of silently regenerating an incomplete expedition.
- Drop counts in debug state.

Browser interaction tests remain pending. Import the existing game source and approved art before any web deployment.
