/** Deterministic Author patch validation. No generated code is executed. */
export function validatePatch(patch, world) {
  const errors = [];
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) return {ok:false,errors:['Patch must be an object']};
  if (typeof patch.id !== 'string' || !/^[a-zA-Z0-9_-]{1,64}$/.test(patch.id)) errors.push('Invalid patch id');
  if (!Array.isArray(patch.ops) || patch.ops.length < 1 || patch.ops.length > 5) errors.push('Expected 1-5 operations');
  for (const op of Array.isArray(patch.ops) ? patch.ops : []) {
    if (!op || op.type !== 'enemy_hp_multiplier' || typeof op.region !== 'string' || !world.regions.some(r=>r.id===op.region) || typeof op.value !== 'number' || !Number.isFinite(op.value) || op.value < world.author.minEnemyHpMultiplier || op.value > world.author.maxEnemyHpMultiplier) errors.push('Unsupported or out-of-budget operation');
  }
  return {ok:errors.length===0,errors};
}
