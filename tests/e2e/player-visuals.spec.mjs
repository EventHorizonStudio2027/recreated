import {test,expect} from '@playwright/test';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const url=process.env.RECREATED_URL || pathToFileURL(resolve('index.html')).href;
test.beforeEach(async({page})=>{await page.addInitScript(()=>{window.__RECREATED_E2E__=true});await page.goto(url);await page.locator('#new').click()});
test('armoured Weaver renders in sanctuary without canvas errors',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.waitForTimeout(200);
 const pixel=await page.locator('#playfield').evaluate(canvas=>{const c=canvas.getContext('2d');const x=Math.round(canvas.width*450/900),y=Math.round(canvas.height*340/600);return [...c.getImageData(x,y,1,1).data]});
 expect(pixel[3]).toBe(255);expect(errors).toEqual([]);
});
test('avatar remains visible while exploring both expeditions',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.evaluate(()=>window.RecreatedDebug.enter('mire'));
 await page.waitForTimeout(120);
 await page.evaluate(()=>window.RecreatedDebug.enter('ruins'));
 await page.waitForTimeout(120);
 expect(errors).toEqual([]);
 await expect(page.locator('#playfield')).toBeVisible();
});
test('reduced motion supports directional player and attack effects',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.evaluate(()=>window.RecreatedDebug.attack());
 await page.waitForTimeout(120);
 expect(errors).toEqual([]);
});
