import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('index.html','utf8');
const css=html.match(/<style id="v26-game-clarity">([\s\S]*?)<\/style>/)?.[1]||'';
test('playable canvas and HUD remain intact',()=>{
 for(const id of ['gameLayer','gameTop','gameViewport','playfield','gameHud','gameBottom']) assert.match(html,new RegExp('id="'+id+'"'));
});
test('expedition HUD separates identity, progress, and utilities',()=>{
 assert.match(css,/#gameTop\{display:grid/);
 assert.match(css,/#gameTop>#gameStats/);
 assert.match(css,/#gameTop>#saveStatus/);
 assert.match(css,/#gameTop>#returnTitle/);
});
test('action grid and gameplay viewport preserve usability',()=>{
 assert.match(css,/#gameBottom\{display:grid/);
 assert.match(css,/#gameViewport\{min-height:320px/);
 assert.match(css,/#gameBottom #castPulse,#gameBottom #usePotion/);
});
test('mobile and low-height viewports have explicit layouts',()=>{
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(css,/@media\(max-height:640px\)/);
 assert.match(css,/scroll-snap-type:x mandatory/);
});
