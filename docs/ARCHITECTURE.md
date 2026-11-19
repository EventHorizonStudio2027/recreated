# Recreated architecture

The browser prototype v0.7 is the source for the gameplay migration. Preserve its approved embedded artwork. New shared content and Author modules live separately from the browser renderer, so Unity can later consume equivalent JSON definitions.

## Author safety

Patches are data, never executable scripts. The initial validator accepts only bounded enemy HP tuning for known regions. Future operations require explicit schemas, simulation tests, rollback, and review. This validator is groundwork; it is **not yet integrated with the v0.7 HTML game**.

## Testing

Run `npm test` with Node 20+. Browser interaction and visual testing are still outstanding.
