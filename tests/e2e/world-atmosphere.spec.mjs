import {test,expect} from '@playwright/test';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const url=process.env.RECREATED_URL || pathToFileURL(resolve('index.html')).href;
test.beforeEach(async({page})=>{await page.addInitScript(()=>{window.__RECREATED_E2E__=true});await page.goto(url);await page.locator('#new').click()});
test('Loomhouse presents the sanctuary identity and renders atmosphere safely',async({page})=>{
 await expect(page.locator('#regionMood')).toHaveText('THE HEART OF THE WEAVE');
 await expect(page.locator('#playfield')).toBeVisible();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.waitForTimeout(200);expect(errors).toEqual([]);
});
test('each expedition has distinct location identity',async({page})=>{
 await page.evaluate(()=>window.RecreatedDebug.enter('mire'));
 await expect(page.locator('#regionMood')).toHaveText('WHERE ROOTS REMEMBER');
 await page.evaluate(()=>window.RecreatedDebug.enter('ruins'));
 await expect(page.locator('#regionMood')).toHaveText('ECHOES BENEATH THE TIDE');
});
test('reduced motion keeps atmospheric rendering functional on mobile',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.setViewportSize({width:390,height:844});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.evaluate(()=>window.RecreatedDebug.enter('mire'));
 await page.waitForTimeout(180);
 expect(errors).toEqual([]);
 await expect(page.locator('#regionLabel')).toBeVisible();
 await expect(page.locator('#playfield')).toBeVisible();
});
