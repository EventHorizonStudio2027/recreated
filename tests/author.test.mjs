import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validatePatch} from '../author/validate-patch.mjs';
const world=JSON.parse(readFileSync(new URL('../content/world.json',import.meta.url),'utf8'));
test('accepts bounded tuning',()=>assert.equal(validatePatch({id:'test-1',ops:[{type:'enemy_hp_multiplier',region:'mire',value:1.05}]},world).ok,true));
test('rejects economy operations',()=>assert.equal(validatePatch({id:'test-2',ops:[{type:'economy',region:'mire',value:1}]},world).ok,false));
test('rejects excessive tuning',()=>assert.equal(validatePatch({id:'test-3',ops:[{type:'enemy_hp_multiplier',region:'mire',value:10}]},world).ok,false));
test('rejects invalid regions',()=>assert.equal(validatePatch({id:'test-4',ops:[{type:'enemy_hp_multiplier',region:'unknown',value:1}]},world).ok,false));
