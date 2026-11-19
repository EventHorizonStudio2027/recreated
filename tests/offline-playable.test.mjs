import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const engine=readFileSync(new URL('../src/game-engine.js',import.meta.url),'utf8');
test('offline game contains its complete game engine',()=>{
 const match=html.match(/<script id="game-engine">([\s\S]*?)<\/script>/);
 assert.ok(match,'embedded engine is present');
 assert.equal(match[1],engine,'extracted source matches playable engine');
});
test('offline artwork is embedded',()=>{
 assert.ok((html.match(/data:image\//g)||[]).length>=10,'approved artwork is embedded');
 assert.doesNotMatch(html,/<(?:script|link)\b[^>]*(?:src|href)=["']https?:\/\//i,'no remote script or stylesheet dependency');
});
test('playable entrypoint contains main game elements',()=>{
 for(const id of ['new','continue','gameLayer','playfield','gameHud','saveNow'])
 assert.match(html,new RegExp('id=["\\\']'+id+'["\\\']'),'missing '+id);
});
