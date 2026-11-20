import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const scene=readFileSync('unity/Assets/Recreated/Scripts/Editor/PrototypeSceneBuilder.cs','utf8');
const camera=readFileSync('unity/Assets/Recreated/Scripts/Runtime/FollowCamera.cs','utf8');
test('regeneration prompts to save current scene',()=>assert.match(scene,/SaveCurrentModifiedScenesIfUserWantsTo\(\)/));
test('scene includes navigational pathways and altar landmark',()=>{
 assert.match(scene,/Mire — stone approach/);
 assert.match(scene,/Mire — distant echo altar/);
 assert.match(scene,/Mire — altar violet radiance/);
});
test('materials refresh existing assets and fail clearly without shader',()=>{
 assert.match(scene,/EditorUtility.SetDirty\(existing\)/);
 assert.match(scene,/Shader.Find\("Unlit\/Color"\)/);
 assert.match(scene,/No compatible material shader found/);
});
test('camera adjusts orthographic framing for narrow aspect ratios',()=>{
 assert.match(camera,/sceneCamera.aspect/);
 assert.match(camera,/sceneCamera.orthographicSize = Mathf.Lerp/);
});
