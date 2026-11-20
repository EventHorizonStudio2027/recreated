import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('index.html','utf8');
test('browser game remains standalone HTML with an accessible entry point',()=>{
 assert.match(html,/<!doctype html>/i);
 assert.match(html,/id="gameLayer"/);
 assert.match(html,/id="game-main"/);
});
test('combat actions remain available and visibly distinct',()=>{
 for(const id of ['castPulse','usePotion','pauseGame','returnTitle']) assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(html,/#gameBottom #castPulse/);
 assert.match(html,/#gameBottom #usePotion/);
});
test('mobile controls use a horizontal action rail',()=>{
 assert.match(html,/scroll-snap-type:x proximity/);
 assert.match(html,/#gameBottom button\{flex:0 0 auto/);
});
test('pause and visibility changes expose accessible and safe input state',()=>{
 assert.match(html,/aria-pressed="false"/);
 assert.match(html,/visibilitychange/);
 assert.match(html,/aria-label.*Pause expedition/);
});
