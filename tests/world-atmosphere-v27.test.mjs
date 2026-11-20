import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const engine=readFileSync('src/game-engine.js','utf8');
const html=readFileSync('index.html','utf8');
test('region atmosphere is rendered inside the playable loop',()=>{
 assert.match(engine,/function drawCinematicFloor\(\)/);
 assert.match(engine,/drawWorldAtmosphere\(\);drawCinematicFloor\(\)/);
});
test('atmosphere remains deterministic and respects reduced motion',()=>{
 assert.match(engine,/const reduced=reducedCombatMotion\(\),t=reduced\?0/);
 assert.match(engine,/room==='mire'/);
 assert.match(engine,/ctx\.createRadialGradient\(x,y,1,x,y,radius\)/);
});
test('player is grounded with a separate responsive halo',()=>{
 assert.match(engine,/const shadowGlow=ctx\.createRadialGradient/);
 assert.match(engine,/now<player\.invuln/);
});
test('standalone HTML embeds exactly the updated renderer and visual styling',()=>{
 assert.ok(html.includes(engine.trim()),'embedded engine must match source');
 assert.match(html,/id="v27-world-polish"/);
});
