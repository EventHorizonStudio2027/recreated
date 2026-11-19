import test from 'node:test';import assert from 'node:assert/strict';
import {enhanceToolsKeyboard,announceSaveStatus} from '../src/ui/tools-keyboard.mjs';
test('gracefully handles missing elements',()=>{assert.equal(enhanceToolsKeyboard({document:{getElementById:()=>null}}),null);assert.equal(announceSaveStatus({document:{getElementById:()=>null}}),false)});
test('adds accessible live region attributes',()=>{const attrs={};const node={setAttribute:(k,v)=>attrs[k]=v};assert.equal(announceSaveStatus({document:{getElementById:()=>node}}),true);assert.deepEqual(attrs,{role:'status','aria-live':'polite','aria-atomic':'true'})});
