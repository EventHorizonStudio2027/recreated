# Recreated — Focused playable release contract

**Product promise:** The world remembers what the player does. Nothing stays the same.

## Scope: exactly five connected systems

1. **Action combat:** move, aim, attack, dodge, enemy behavior, damage, death and restart. Done when a player can finish a full encounter with mouse/keyboard and controller without broken input or state.
2. **Evolving world:** a bounded, deterministic consequence of a completed expedition changes a named region. Done when a changed region visibly differs and persists across reloads.
3. **Expeditions:** enter, fight, succeed/fail, earn deterministic rewards, return. Done when every run has an unambiguous outcome and no duplicate reward grants.
4. **Persistent progression:** earn, spend, save, reload and restore upgrades with schema validation and safe recovery. Done when upgrades affect gameplay after reload and corrupted saves fail safely.
5. **Loomhouse hub:** view progress, choose an expedition, apply an upgrade, and re-enter play. Done when each hub control performs its labeled action and routes to a real system.

## Explicitly outside the first release

Unbounded generative AI, multiplayer, accounts/cloud sync, monetization, large content catalogs, cosmetic-only menus, and Unity-only enhancements that have no proven gameplay use. The bounded AI Author stays experimental until validated consequences, persistence and rollback are reliable.

## Integration contract

Each interaction follows **input → validated game command → deterministic state transition → saved state (when appropriate) → visible feedback**. No button may merely simulate success. UI must never award resources independently of the gameplay state. Use versioned, portable save/world data and keep browser and Unity behavior aligned.

## Release gates

- [ ] A clean install launches without a blank screen or runtime exception.
- [ ] Each of the five systems works end-to-end, not just as isolated functions.
- [ ] Automated tests cover combat state, rewards, persistence migration, and world consequences.
- [ ] A human verifies full keyboard/mouse and controller gameplay.
- [ ] Save/reload preserves progression and world changes; invalid data recovers safely.
- [ ] The UI has no inert controls, misleading labels or inaccessible critical status.
- [ ] Browser release verified before Unity is treated as a replacement.

## Interface direction

Prioritize a clear play area; group health, cooldowns and encounter progress in a compact, high-contrast HUD. Keep the purple/gold identity. Reserve celebratory animation for real state changes (earned reward, changed region, completed expedition), not empty button clicks. A final pass must check text contrast, spacing, small viewports and reduced motion.

## Outstanding work — renumber from 1 each cycle

1. Audit browser and Unity code against this contract; identify actual working paths and inert controls.
2. Wire the first complete expedition loop: combat → outcome → reward → hub.
3. Prove save/load and world consequence persistence across a restart.
4. Run browser integration tests and Unity Editor/Play Mode verification; Unity requires an actual Editor run.
5. Refine HUD clarity and add a second restrained visual polish pass, then verify both in a rendered build.

**Status:** This document defines acceptance criteria; it does not claim implementation or testing of the above items.
