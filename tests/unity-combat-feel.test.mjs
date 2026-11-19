import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root='unity/Assets/Recreated/Scripts/';
const read=p=>readFileSync(root+p,'utf8');
test('Shades have varied pursuit orbit without overriding windup',()=>{
 const s=read('Runtime/EnemyController.cs');
 assert.match(s,/Vector3 tangent/);
 assert.match(s,/strafeSign/);
 assert.match(s,/windupEnds = -1f/);
});
test('Weaver sword and mantle visuals follow combat animation timelines',()=>{
 const player=read('Runtime/PlayerController.cs');
 assert.match(player,/AttackAnimation01/);
 assert.match(player,/PulseAnimation01/);
 const visual=read('Runtime/WeaverCombatVisual.cs');
 assert.match(visual,/blade\.localRotation/);
 assert.match(visual,/mantle\.localRotation/);
 assert.match(read('Editor/PrototypeSceneBuilder.cs'),/AddComponent<WeaverCombatVisual>/);
});
test('Echo Pulse ring is transient and follows actual pulse radius',()=>{
 const s=read('Runtime/EchoPulseVisual.cs');
 assert.match(s,/LineRenderer/);
 assert.match(s,/player\.tuning\.pulseRadius/);
 assert.match(s,/ring\.enabled = t < 1f/);
 assert.match(read('Editor/PrototypeSceneBuilder.cs'),/AddComponent<EchoPulseVisual>/);
});
test('HUD includes pulse and dodge readiness without adding panels',()=>{
 const s=read('Runtime/ExpeditionDirector.cs');
 assert.match(s,/pulseReady/);
 assert.match(s,/dodgeReady/);
 assert.match(s,/cooldownWidth/);
});
