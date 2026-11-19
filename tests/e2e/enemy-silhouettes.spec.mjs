import {test,expect} from '@playwright/test';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const url=process.env.RECREATED_URL || pathToFileURL(resolve('index.html')).href;
test.beforeEach(async({page})=>{await page.addInitScript(()=>{window.__RECREATED_E2E__=true});await page.goto(url);await page.locator('#new').click()});
test('Mire enemy silhouettes render without browser errors',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.evaluate(()=>window.RecreatedDebug.enter('mire'));
 await page.waitForTimeout(180);
 expect(errors).toEqual([]);
 expect((await page.evaluate(()=>window.RecreatedDebug.getState())).enemyCount).toBeGreaterThan(0);
});
test('Warden phase II armor renders after enrage',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.evaluate(()=>{const d=window.RecreatedDebug;d.enter('ruins');d.forceFinalWave();d.setWardenHealthFraction(.4)});
 await expect(page.locator('#chamberReadout')).toContainText('PHASE II');
 await page.waitForTimeout(180);expect(errors).toEqual([]);
});
test('mobile threat indicator remains visible with distinct enemy artwork',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.evaluate(()=>window.RecreatedDebug.enter('mire'));
 await expect(page.locator('#threatReadout')).toHaveAttribute('data-danger','true');
 await expect(page.locator('#playfield')).toBeVisible();
});
