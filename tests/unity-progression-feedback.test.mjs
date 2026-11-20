import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root='unity/Assets/Recreated/';
const read=p=>readFileSync(root+p,'utf8');
test('progress schema version and corrupt-data recovery',()=>{
 const s=read('Scripts/Runtime/ExpeditionProgress.cs');
 assert.match(s,/CurrentVersion = 1/);
 assert.match(s,/try\s*\{/);
 assert.match(s,/catch \(Exception\)/);
 assert.match(s,/Mathf\.Clamp\(data\.earnedEchoes, 0, 1000000\)/);
});
test('progress persists clear, defeat and earned echoes',()=>{
 const s=read('Scripts/Runtime/ExpeditionDirector.cs');
 assert.match(s,/progress\.RecordClear\(CurrentWave\)/);
 assert.match(s,/progress\.RecordDefeat\(CurrentWave\)/);
 assert.match(s,/ProgressStore\.Save\(progress\)/);
 assert.match(s,/if \(!defeatRecorded\)/);
});
test('health exposes damage events and actors get hit feedback',()=>{
 assert.match(read('Scripts/Runtime/Health.cs'),/Damaged\?\.Invoke\(this, actual\)/);
 assert.match(read('Scripts/Runtime/ExpeditionDirector.cs'),/obj\.AddComponent<DamageFlash>\(\)/);
 assert.match(read('Scripts/Editor/PrototypeSceneBuilder.cs'),/player\.AddComponent<DamageFlash>\(\)/);
 assert.match(read('Scripts/Runtime/DamageFlash.cs'),/MaterialPropertyBlock/);
});
test('HUD includes persistent progress and maintains controls',()=>{
 const s=read('Scripts/Runtime/ExpeditionDirector.cs');
 assert.match(s,/ECHOES /);
 assert.match(s,/CLEARS /);
 assert.match(s,/Q \/ RB  PULSE/);
 assert.match(s,/Screen\.width/);
});

test('Shade windups are visible and cancel when player leaves melee range',()=>{
 const enemy=read('Scripts/Runtime/EnemyController.cs');
 assert.match(enemy,/windupEnds = -1f/);
 assert.match(enemy,/windupEnds = Time\.time \+ \.42f/);
 assert.match(enemy,/public bool IsWindingUp/);
 assert.match(read('Scripts/Runtime/EnemyWindupVisual.cs'),/enemy\.IsWindingUp/);
 assert.match(read('Scripts/Runtime/ExpeditionDirector.cs'),/AddComponent<EnemyWindupVisual>/);
});
