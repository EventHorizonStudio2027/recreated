import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('every inline script parses',()=>{
 const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
 assert.ok(scripts.length>=3);
 for(const [i,match] of scripts.entries())assert.doesNotThrow(()=>new vm.Script(match[1],{filename:'recreated-'+i+'.js'}));
});

test('HTML IDs are unique so buttons target one element',()=>{
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.ok(ids.length>40);
 assert.equal(ids.length,new Set(ids).size);
});

test('malformed title-state storage is normalized to an object',()=>{
 assert.match(html,/stored&&typeof stored==='object'&&!Array\.isArray\(stored\)\?stored:\{\}/);
 assert.match(html,/catch\(e\)\{state=\{\}\}/);
});

test('backup quota failure cannot prevent saving the current run',()=>{
 assert.match(html,/try\{localStorage\.setItem\(backupKey,previous\)\}catch\(_\)/);
 assert.match(html,/localStorage\.setItem\(saveKey,payload\)/);
});

test('save validation and recovery remain available',()=>{
 assert.match(html,/function isValidSave\(data\)/);
 assert.match(html,/for\(const \[key,isBackup\] of \[\[saveKey,false\],\[backupKey,true\]\]\)/);
 assert.match(html,/function manualSave\(\)/);
});

test('ledger safely renders only validated, escaped entries',()=>{
 assert.match(html,/const changes=Array\.isArray\(state\.changes\)\?state\.changes:\[\]/);
 assert.match(html,/escapeText\(c\.date\)/);
 assert.match(html,/escapeText\(c\.text\)/);
 assert.match(html,/\.slice\(-100\)/);
});

test('gameplay hotkeys respect focused controls and pause clears movement',()=>{
 assert.match(html,/e\.target\?\.closest\?\.\('input,textarea,select,button/);
 assert.match(html,/if\(k==='escape'&&!e\.repeat\)/);
 assert.match(html,/paused=!paused;keys\.clear\(\)/);
});

test('focus loss pauses play rather than allowing unintended movement',()=>{
 assert.match(html,/window\.addEventListener\('blur',\(\)=>\{keys\.clear\(\);if\(running&&!paused\)/);
});

test('combat shortcuts cannot auto-repeat or fire while paused',()=>{
 assert.match(html,/if\(!e\.repeat&&!paused\)\{if\(k===' '\)attack\(\)/);
 assert.match(html,/if\(k==='e'&&!paused&&!e\.repeat\)enter\('hub'\)/);
});

test('new or resumed runs clear held input',()=>{
 assert.match(html,/function start\(fresh=false\)\{keys\.clear\(\)/);
});

test('return to title warns when local progress cannot be saved',()=>{
 assert.match(html,/const saved=save\(\)/);
 assert.match(html,/if\(!saved\)window\.alert\('Your journey could not be saved/);
});

test('paused gameplay does not accumulate movement input',()=>{
 assert.match(html,/if\(!paused&&k!=='escape'\)keys\.add\(k\)/);
 assert.match(html,/if\(!running\|\|paused\|\|!el\('gamePanel'\)\.hidden\)return;keys\.add\(k\)/);
});

test('resuming from keyboard and pause button restores playfield focus',()=>{
 assert.match(html,/if\(!paused\)canvas\.focus\(\)/);
});
