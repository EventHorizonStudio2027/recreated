import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const scene=readFileSync('unity/Assets/Recreated/Scripts/Editor/PrototypeSceneBuilder.cs','utf8');
const director=readFileSync('unity/Assets/Recreated/Scripts/Runtime/ExpeditionDirector.cs','utf8');
test('Unity batch scene generator never waits for a modal save prompt',()=>{
 assert.match(scene,/!Application\.isBatchMode && !EditorSceneManager\.SaveCurrentModifiedScenesIfUserWantsTo\(\)/);
});
test('batch validation checks scene player director camera bindings',()=>{
 assert.match(scene,/public static void ValidateScene\(\)/);
 assert.match(scene,/RECREATED_SCENE_VALID/);
 assert.match(scene,/director\.player != player/);
 assert.match(scene,/follow\.target != player\.transform/);
 assert.match(scene,/ValidateScene\(\);/);
});
test('restart disables previous actors before deferred destruction',()=>{
 assert.match(director,/enemy\.enabled = false/);
 assert.match(director,/body\.enabled = false/);
 assert.match(director,/Destroy\(enemy\.gameObject\)/);
});
test('HUD panel has a deliberate dark and gold visual hierarchy',()=>{
 assert.match(director,/new Color\(\.035f, \.055f, \.09f, \.9f\)/);
 assert.match(director,/new Rect\(14, 14, 3f, 184\)/);
});
