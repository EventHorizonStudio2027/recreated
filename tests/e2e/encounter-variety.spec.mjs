import {test,expect} from '@playwright/test';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const url=process.env.RECREATED_URL || pathToFileURL(resolve('index.html')).href;
test.beforeEach(async({page})=>{await page.addInitScript(()=>{window.__RECREATED_E2E__=true});await page.goto(url);await page.locator('#new').click()});
test('Warden begins phase I and visibly enters phase II at half health',async({page})=>{
 await page.evaluate(()=>{window.RecreatedDebug.enter('ruins');window.RecreatedDebug.forceFinalWave()});
 await expect(page.locator('#chamberReadout')).toContainText('WARDEN · PHASE I');
 const set=await page.evaluate(()=>window.RecreatedDebug.setWardenHealthFraction(.45));
 expect(set).toBe(true);
 await expect(page.locator('#chamberReadout')).toContainText('WARDEN · PHASE II');
 await expect(page.locator('#chamberReadout')).toHaveAttribute('data-phase','two');
 expect(await page.evaluate(()=>window.RecreatedDebug.getState().wardenPhase)).toBe('two');
});
test('chamber HUD is visible and identifies active expedition',async({page})=>{
 await page.evaluate(()=>window.RecreatedDebug.enter('mire'));
 await expect(page.locator('#chamberReadout')).toContainText('CHAMBER 1/3');
 await expect(page.locator('#chamberReadout')).toBeVisible();
});
test('new journeys show sanctuary rather than combat phase',async({page})=>{
 await expect(page.locator('#chamberReadout')).toHaveText('SANCTUARY');
 await expect(page.locator('#chamberReadout')).toHaveAttribute('data-phase','normal');
});
