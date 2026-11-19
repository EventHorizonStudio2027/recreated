import {test,expect} from '@playwright/test';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const url=process.env.RECREATED_URL || pathToFileURL(resolve('index.html')).href;
const key='recreated-playable-v2';
test('Mire checkpoint restores room and chamber without double-counting visits',async({page})=>{
 await page.goto(url);await page.locator('#new').click();
 await page.evaluate(()=>window.RecreatedDebug.enter('mire'));
 await page.evaluate(k=>{const d=JSON.parse(localStorage.getItem(k));d.wave=2;localStorage.setItem(k,JSON.stringify(d))},key);
 const visits=await page.evaluate(()=>window.RecreatedDebug.getState().roomVisits.mire);
 await page.reload();await page.locator('#continue').click();
 const state=await page.evaluate(()=>window.RecreatedDebug.getState());
 expect(state.room).toBe('mire');expect(state.wave).toBe(2);expect(state.roomVisits.mire).toBe(visits);
 expect(state.enemyCount).toBeGreaterThan(0);
 await expect(page.locator('#toast')).toContainText('CHECKPOINT RESTORED');
});
test('Ruins checkpoint restores final chamber with boss',async({page})=>{
 await page.goto(url);await page.locator('#new').click();
 await page.evaluate(()=>window.RecreatedDebug.enter('ruins'));
 await page.evaluate(k=>{const d=JSON.parse(localStorage.getItem(k));d.wave=3;localStorage.setItem(k,JSON.stringify(d))},key);
 await page.reload();await page.locator('#continue').click();
 const state=await page.evaluate(()=>window.RecreatedDebug.getState());
 expect(state.room).toBe('ruins');expect(state.wave).toBe(3);
 expect(state.enemyTypes).toContain('warden');
});
test('invalid chamber values are clamped to safe first or final chamber',async({page})=>{
 await page.goto(url);await page.locator('#new').click();
 await page.evaluate(()=>window.RecreatedDebug.enter('mire'));
 await page.evaluate(k=>{const d=JSON.parse(localStorage.getItem(k));d.wave=99999;localStorage.setItem(k,JSON.stringify(d))},key);
 await page.reload();await page.locator('#continue').click();
 expect(await page.evaluate(()=>window.RecreatedDebug.getState().wave)).toBe(3);
});
test('new journeys still begin in Loomhouse',async({page})=>{
 await page.goto(url);await page.locator('#new').click();
 const state=await page.evaluate(()=>window.RecreatedDebug.getState());
 expect(state.room).toBe('hub');expect(state.wave).toBe(1);
});
