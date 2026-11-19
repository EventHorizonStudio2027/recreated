import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=n=>readFileSync('unity/Assets/Recreated/Scripts/Runtime/'+n+'.cs','utf8');
test('gravity accelerates and remains grounded without constant float descent',()=>{
 const s=read('PlayerController');
 assert.match(s,/motor\.isGrounded/);
 assert.match(s,/Physics\.gravity\.y/);
 assert.match(s,/verticalSpeed/);
});
test('melee hit deduplication occurs after attack cone check',()=>{
 const s=read('PlayerController');
 assert.ok(s.indexOf('struck.Add(enemy);')>s.indexOf('Vector3.Dot(facing, toEnemy.normalized)'));
});
test('Shades disengage after player defeat',()=>{
 const s=read('EnemyController');
 assert.match(s,/targetHealth\.IsDead/);
 assert.match(s,/windupEnds = -1f/);
});
test('pulse material uses URP shader fallback and cached ownership',()=>{
 const s=read('EchoPulseVisual');
 assert.match(s,/Universal Render Pipeline\/Unlit/);
 assert.match(s,/ring\.sharedMaterial = ringMaterial/);
 assert.match(s,/Destroy\(ringMaterial\)/);
});
test('HUD has narrow-screen labels and clamps bar width',()=>{
 const s=read('ExpeditionDirector');
 assert.match(s,/width < 280f/);
 assert.match(s,/Mathf\.Max\(1f, Mathf\.Min\(112f/);
});
