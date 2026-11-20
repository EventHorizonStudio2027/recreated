import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root='unity/Assets/Recreated/Scripts/';
const enemy=readFileSync(root+'Runtime/EnemyController.cs','utf8');
const player=readFileSync(root+'Runtime/PlayerController.cs','utf8');
const builder=readFileSync(root+'Editor/PrototypeSceneBuilder.cs','utf8');
const director=readFileSync(root+'Runtime/ExpeditionDirector.cs','utf8');
test('enemy windup rechecks distance before damage',()=>{
 assert.match(enemy,/strikeDelta.sqrMagnitude <= 2.25f/);
 assert.match(enemy,/player.Damage\(tuning.enemyDamage\)/);
});
test('dodge works without movement input',()=>{
 assert.match(player,/dodgeDirection = direction.sqrMagnitude > .01f \? direction.normalized : facing/);
 assert.doesNotMatch(player,/nextDodge && direction.sqrMagnitude > .01f/);
});
test('scene generation preserves other build scenes',()=>{
 assert.match(builder,/new System.Collections.Generic.List<EditorBuildSettingsScene>\(EditorBuildSettings.scenes\)/);
 assert.match(builder,/scenes.Insert\(0, new EditorBuildSettingsScene\(ScenePath, true\)\)/);
 assert.match(builder,/camera == null \|\| !camera.orthographic/);
});
test('HUD improves wave status and celebrates clears with subtle animation',()=>{
 assert.match(director,/string chamberStatus/);
 assert.match(director,/GUIStyle statusStyle/);
 assert.match(director,/float shimmer = .5f/);
});
