# Recreated

**The world remembers. Nothing stays the same.**

Recreated is a web-first 2D/2.5D action roguelite set in the Weave, with a persistent Loomhouse hub, evolving regions, and a bounded AI Author system. Unity migration is planned after the browser game is validated.

## Project status

The playable browser prototype has reached **v0.7** locally. Migration of the existing build and its approved visual assets into this repository is in progress; the GitHub repository is not yet a playable release.

## Development principles

- Preserve the approved Recreated identity, purple-and-gold branding, and original iconography.
- Keep this game visually and mechanically distinct from Fate's Passage.
- Prefer portable content schemas, deterministic gameplay tests, and explicit patch rollback.
- Keep the Author constrained by validated rules; never let it modify monetization or protected game rules.
- Verify actual browser behavior before declaring features complete.

## Planned layout

`game/` browser client; `content/` versioned world definitions; `author/` proposal and validation logic; `tests/` automated checks; `docs/` architecture and design decisions.

## Source

Based on the Recreated prototype and the original Evergame concept dossier. Current work is experimental and not production-ready.
