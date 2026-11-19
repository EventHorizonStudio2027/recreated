import test from 'node:test';
import assert from 'node:assert/strict';
import {mountGameTools} from '../src/ui/game-tools.mjs';
test('requires a document and header',()=>assert.throws(()=>mountGameTools({document:null,header:null})));
test('returns null when no controls are available',()=>{
 const doc={getElementById:()=>null};
 assert.equal(mountGameTools({document:doc,header:{}}),null);
});
