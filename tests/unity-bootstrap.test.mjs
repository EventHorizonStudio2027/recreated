import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const builder=readFileSync('unity/Assets/Recreated/Scripts/Editor/PrototypeSceneBuilder.cs','utf8');
const guide=readFileSync('unity/README.md','utf8');
test('Unity project exposes a first-launch scene menu',()=>{
 assert.match(builder,/MenuItem\("Recreated\/Open Prototype Scene"\)/);
 assert.match(builder,/EditorSceneManager\.OpenScene\(ScenePath, OpenSceneMode\.Single\)/);
});
test('Unity batch bootstrap fails visibly if the scene is not serialized',()=>{
 assert.match(builder,/public static void GenerateBatch\(\)/);
 assert.match(builder,/if \(!File\.Exists\(ScenePath\)\)/);
 assert.match(builder,/RECREATED_SCENE_READY/);
 assert.match(builder,/if \(!EditorSceneManager\.SaveScene\(scene, ScenePath\)\)/);
});
test('documentation does not misrepresent scene as already built',()=>{
 assert.match(guide,/scene file may not exist/);
 assert.match(guide,/not yet been verified/);
 assert.match(guide,/GenerateBatch/);
});
