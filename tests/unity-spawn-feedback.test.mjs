import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=n=>readFileSync('unity/Assets/Recreated/Scripts/Runtime/'+n+'.cs','utf8');
test('spawning configures enemy after Awake with wave tuning',()=>{
 const director=read('ExpeditionDirector'), enemy=read('EnemyController');
 assert.match(director,/enemy\.Configure\(player\.transform, tuning\)/);
 assert.match(enemy,/public void Configure\(Transform followTarget, GameTuning sharedTuning\)/);
 assert.match(enemy,/Vitality\.Configure\(tuning\.enemyHealth\)/);
});
test('enemy hit interrupts attack and staggers without altering dead state',()=>{
 const s=read('EnemyController');
 assert.match(s,/Vitality\.Damaged \+= OnDamaged/);
 assert.match(s,/windupEnds = -1f/);
 assert.match(s,/if \(source\.IsDead\) return/);
 assert.match(s,/if \(IsStaggered\) return/);
});
test('enemy eye feedback distinguishes stagger from attack telegraph',()=>{
 assert.match(read('EnemyWindupVisual'),/enemy\.IsStaggered \? \.55f/);
});
test('camera responds to damage and unsubscribes',()=>{
 const s=read('FollowCamera');
 assert.match(s,/trackedHealth\.Damaged \+= OnTargetDamaged/);
 assert.match(s,/trackedHealth\.Damaged -= OnTargetDamaged/);
 assert.match(s,/shakeUntil = Time\.time \+ \.18f/);
});
test('victory/defeat interface and countdown are readable',()=>{
 const s=read('ExpeditionDirector');
 assert.match(s,/THE WEAVER HAS FALLEN/);
 assert.match(s,/THE MIRE ENDURES/);
 assert.match(s,/Mathf\.Max\(0, Mathf\.CeilToInt\(nextWaveAt - Time\.time\)\)/);
});
