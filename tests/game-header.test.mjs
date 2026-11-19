import test from 'node:test';import assert from 'node:assert/strict';
import {initializeGameHeader} from '../src/ui/game-header.mjs';
const mock=()=>{const elements={};const doc={getElementById:id=>elements[id]||null};for(const id of ['regionLabel','gameStats','saveStatus'])elements[id]={attributes:{},setAttribute(k,v){this.attributes[k]=v},textContent:'',dataset:{}};return {doc,elements}};
test('labels region and player progression',()=>{const {doc,elements}=mock();initializeGameHeader({doc,storage:{setItem(){},removeItem(){}}});assert.equal(elements.regionLabel.attributes['aria-live'],'polite');assert.equal(elements.gameStats.attributes['aria-label'],'Player progression and expedition status')});
test('reports blocked browser storage',()=>{const {doc,elements}=mock();const result=initializeGameHeader({doc,storage:{setItem(){throw Error('blocked')},removeItem(){}}});assert.equal(result.storageAvailable,false);assert.equal(elements.saveStatus.textContent,'Save unavailable')});
test('reports available browser storage',()=>{const {doc}=mock();const result=initializeGameHeader({doc,storage:{setItem(){},removeItem(){}}});assert.equal(result.storageAvailable,true)});
