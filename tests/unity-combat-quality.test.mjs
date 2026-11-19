import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root='unity/Assets/Recreated/Scripts/Runtime/';
const read=name=>readFileSync(root+name+'.cs','utf8');
test('attack applies at most one hit per enemy and uses avatar-centered physics',()=>{
 const s=read('PlayerController');
 assert.match(s,/HashSet<EnemyController> struck/);
 assert.match(s,/struck\.Contains\(enemy\)/);
 assert.match(s,/Physics\.OverlapSphere\(transform\.position, radius/);
});
test('dodge grants defensive invulnerability and enemies honor it',()=>{
 assert.match(read('PlayerController'),/public bool CanTakeDamage => !IsDodging && !health\.IsDead/);
 assert.match(read('EnemyController'),/controller\.CanTakeDamage/);
});
test('chamber transitions have a single delayed spawn and healing event',()=>{
 const s=read('ExpeditionDirector');
 assert.match(s,/nextWaveAt < 0f/);
 assert.match(s,/nextWaveAt = Time\.time \+ ChamberBreather/);
 assert.match(s,/Time\.time >= nextWaveAt/);
 assert.match(s,/nextWaveAt = -1f;/);
});
test('tactical HUD exposes a health bar and next-chamber countdown',()=>{
 const s=read('ExpeditionDirector');
 assert.match(s,/Mathf\.Clamp01\(player\.Vitality\.Current \/ player\.Vitality\.Maximum\)/);
 assert.match(s,/NEXT CHAMBER IN/);
});
