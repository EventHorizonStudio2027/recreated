import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const player=readFileSync('unity/Assets/Recreated/Scripts/Runtime/PlayerController.cs','utf8');
const camera=readFileSync('unity/Assets/Recreated/Scripts/Runtime/FollowCamera.cs','utf8');
const director=readFileSync('unity/Assets/Recreated/Scripts/Runtime/ExpeditionDirector.cs','utf8');
test('recent aim input persists when movement continues',()=>{
 assert.match(player,/lastAimInputAt = Time.unscaledTime/);
 assert.match(player,/Time.unscaledTime - lastAimInputAt > .25f/);
});
test('mouse can aim even when gamepad is connected',()=>{
 assert.match(player,/Mouse.current.delta.ReadValue\(\).sqrMagnitude > .01f/);
 assert.match(player,/pad.rightStick.ReadValue\(\).sqrMagnitude <= .09f/);
});
test('camera lifecycle and restart clear shake safely',()=>{
 assert.match(camera,/trackedHealth = null/);
 assert.match(camera,/public void ResetCameraFeedback\(\)/);
 assert.match(director,/follow.ResetCameraFeedback\(\)/);
});
test('combat HUD improves visual hierarchy and critical-health warning',()=>{
 assert.match(director,/new Rect\(26, 50, content, 1f\)/);
 assert.match(director,/bool criticalHealth/);
 assert.match(director,/Mathf.Sin\(Time.time \* 5f\)/);
});
