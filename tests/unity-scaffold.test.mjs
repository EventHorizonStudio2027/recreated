import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const root='unity/';
const read=p=>readFileSync(root+p,'utf8');
test('Unity project is present without replacing browser game',()=>{
 assert.ok(existsSync('index.html'));
 assert.ok(existsSync('src/game-engine.js'));
 assert.match(read('ProjectSettings/ProjectVersion.txt'),/6000\.0/);
 const manifest=JSON.parse(read('Packages/manifest.json'));
 assert.ok(manifest.dependencies['com.unity.render-pipelines.universal']);
 assert.ok(manifest.dependencies['com.unity.inputsystem']);
});
test('C# runtime foundation and editor scene generator are present',()=>{
 for(const file of ['GameTuning','Health','PlayerController','EnemyController','ExpeditionDirector','FollowCamera']){
  const source=read('Assets/Recreated/Scripts/Runtime/'+file+'.cs');
  assert.match(source,new RegExp('class '+file+'\\b'));
 }
 assert.match(read('Assets/Recreated/Scripts/Editor/PrototypeSceneBuilder.cs'),/Generate Prototype Scene/);
 assert.match(read('Assets/Recreated/Scripts/Editor/PrototypeSceneBuilder.cs'),/EditorBuildSettings\.scenes/);
});
test('Unity runtime uses modern input and health has clamped damage',()=>{
 const controller=read('Assets/Recreated/Scripts/Runtime/PlayerController.cs');
 assert.match(controller,/UnityEngine\.InputSystem/);
 assert.doesNotMatch(controller,/Input\.GetAxisRaw|Input\.GetKeyDown|Input\.GetMouseButtonDown/);
 const health=read('Assets/Recreated/Scripts/Runtime/Health.cs');
 assert.match(health,/Mathf\.Min\(Current, amount\)/);
 assert.match(health,/Died\?\.Invoke/);
});
test('Unity scene creation is editor-only and migration is additive',()=>{
 const asm=JSON.parse(read('Assets/Recreated/Scripts/Editor/RecreatedEditor.asmdef'));
 assert.deepEqual(asm.includePlatforms,['Editor']);
 assert.ok(existsSync('tests/e2e'));
});
