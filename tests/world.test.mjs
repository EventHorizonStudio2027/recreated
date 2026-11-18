import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const world=JSON.parse(readFileSync(new URL('../content/world.json',import.meta.url),'utf8'));
test('world schema and stable region IDs',()=>{
  assert.equal(world.schemaVersion,1);
  assert.ok(world.regions.some(r=>r.id==='mire'));
  assert.equal(new Set(world.regions.map(r=>r.id)).size,world.regions.length);
});
test('Author tuning budget stays bounded',()=>{
  assert.ok(world.author.minEnemyHpMultiplier>0);
  assert.ok(world.author.maxEnemyHpMultiplier<=1.25);
  assert.ok(world.author.minEnemyHpMultiplier<=world.author.maxEnemyHpMultiplier);
});
