import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const player=readFileSync('unity/Assets/Recreated/Scripts/Runtime/PlayerController.cs','utf8');
const director=readFileSync('unity/Assets/Recreated/Scripts/Runtime/ExpeditionDirector.cs','utf8');
test('Unity supports controller-only gameplay',()=>{
 assert.match(player,/Gamepad pad = Gamepad.current/);
 assert.match(player,/if \(keyboard == null && pad == null\) return/);
 assert.match(player,/pad.leftStick.ReadValue\(\)/);
 assert.match(player,/pad.rightStick.ReadValue\(\)/);
 assert.match(player,/pad.buttonSouth.wasPressedThisFrame/);
 assert.match(player,/pad.buttonEast.wasPressedThisFrame/);
 assert.match(player,/pad.rightShoulder.wasPressedThisFrame/);
});
test('aim stick retains priority over movement and mouse',()=>{
 assert.match(player,/direction.sqrMagnitude > .01f && Time.unscaledTime - lastAimInputAt > .25f/);
 assert.match(player,/Mouse.current != null && \(pad == null \|\| Mouse.current.delta.ReadValue\(\).sqrMagnitude > .01f\)/);
});
test('expedition restart clears transient combat state and recenters player',()=>{
 assert.match(player,/public void ResetForExpedition\(Vector3 spawnPosition\)/);
 assert.match(player,/nextAttack = nextDodge = nextPulse = dodgeEnd = 0f/);
 assert.match(player,/motor.enabled = false/);
 assert.match(director,/player.ResetForExpedition\(new Vector3\(0f, 1f, 0f\)\)/);
});
test('HUD communicates controller mappings',()=>{
 assert.match(director,/Q \/ RB  PULSE/);
 assert.match(director,/SHIFT \/ B  DODGE/);
});
