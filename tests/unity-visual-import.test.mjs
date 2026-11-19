import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root='unity/Assets/Recreated/';
const read=p=>readFileSync(root+p,'utf8');
test('Unity runtime assembly explicitly references Input System',()=>{
 const assembly=JSON.parse(read('Scripts/Runtime/RecreatedRuntime.asmdef'));
 assert.ok(assembly.references.includes('Unity.InputSystem'));
 assert.match(read('Scripts/Runtime/PlayerController.cs'),/using UnityEngine.InputSystem;/);
});
test('scene generator adds atmosphere and directional Weaver silhouette',()=>{
 const s=read('Scripts/Editor/PrototypeSceneBuilder.cs');
 for(const token of ['Mire — lantern','Mire — moss cluster','Weaver — midnight mantle','Weaver — gilded blade','Recreated/Generate Prototype Scene']) assert.ok(s.includes(token),token);
});
test('enemies have distinct hoods and emissive-looking eyes without colliders',()=>{
 const s=read('Scripts/Runtime/ExpeditionDirector.cs');
 assert.match(s,/Shade — hood/);
 assert.match(s,/Shade — luminous eyes/);
 assert.match(s,/Destroy\(hood.GetComponent<SphereCollider>\(\)\)/);
 assert.match(s,/Destroy\(eyes.GetComponent<BoxCollider>\(\)\)/);
});
test('HUD adapts to viewport width instead of overflowing',()=>{
 const s=read('Scripts/Runtime/ExpeditionDirector.cs');
 assert.match(s,/Mathf\.Min\(344f, Screen\.width - 28f\)/);
 assert.match(s,/Mathf\.Min\(344f, Screen\.width - 28f\)/);
});
