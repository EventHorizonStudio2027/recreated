import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('every inline script parses',()=>{
 const scripts=[...html.matchAll(/<script\\b[^>]*>([\\s\\S]*?)<\\/script>/gi)];
 assert.ok(scripts.length>=3);
 for(const [i,match] of scripts.entries())assert.doesNotThrow(()=>new vm.Script(match[1],{filename:'recreated-'+i+'.js'}));
});

test('HTML IDs are unique so buttons target one element',()=>{
 const ids=[...html.matchAll(/\\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.ok(ids.length>40);
 assert.equal(ids.length,new Set(ids).size);
});

test('malformed title-state storage is normalized to an object',()=>{
 assert.match(html,/stored&&typeof stored==='object'&&!Array\\.isArray\\(stored\\)\\?stored:\\{\\}/);
 assert.match(html,/catch\\(e\\)\\{state=\\{\\}\\}/);
});

test('backup quota failure cannot prevent saving the current run',()=>{
 assert.match(html,/try\\{localStorage\\.setItem\\(backupKey,previous\\)\\}catch\\(_\\)/);
 assert.match(html,/localStorage\\.setItem\\(saveKey,payload\\)/);
});

test('save validation and recovery remain available',()=>{
 assert.match(html,/function isValidSave\\(data\\)/);
 assert.match(html,/for\\(const \\[key,isBackup\\] of \\[\\[saveKey,false\\],\\[backupKey,true\\]\\]\\)/);
 assert.match(html,/function manualSave\\(\\)/);
});
