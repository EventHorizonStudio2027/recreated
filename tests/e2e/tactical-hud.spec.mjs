import {test,expect} from '@playwright/test';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const url=process.env.RECREATED_URL || pathToFileURL(resolve('index.html')).href;
test.beforeEach(async({page})=>{await page.addInitScript(()=>{window.__RECREATED_E2E__=true});await page.goto(url);await page.locator('#new').click()});
test('XP progressbar reflects earned echoes and is accessible',async({page})=>{
 const xp=page.locator('#xpTrack');await expect(xp).toHaveAttribute('aria-valuenow','0');
 await page.evaluate(()=>window.RecreatedDebug.grantEcho());
 await expect(page.locator('#xpText')).toContainText('20 / 100 XP');
 await expect(xp).toHaveAttribute('aria-valuenow','20');
});
test('threat count updates when entering an expedition',async({page})=>{
 await expect(page.locator('#threatReadout')).toHaveText('SAFE HAVEN');
 await page.evaluate(()=>window.RecreatedDebug.enter('mire'));
 await expect(page.locator('#threatReadout')).toContainText('THREATS REMAINING');
 await expect(page.locator('#threatReadout')).toHaveAttribute('data-danger','true');
});
test('healing button communicates availability and disables at full health',async({page})=>{
 const heal=page.locator('#usePotion');await expect(heal).toBeDisabled();
 await page.evaluate(()=>window.RecreatedDebug.setPlayerHealthFractionForTest(.6));
 await expect(heal).toBeEnabled();
 await expect(heal).toHaveAttribute('aria-label',/3 charges/);
 await heal.click();
 await expect(heal).toBeDisabled();
});
test('mobile HUD shows compact tactical indicators',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await expect(page.locator('#xpText')).toBeVisible();
 await expect(page.locator('#dodgeReadout')).toContainText('DODGE');
 const box=await page.locator('#tacticalReadouts').boundingBox();
 expect(box.width).toBeLessThan(390);
});
