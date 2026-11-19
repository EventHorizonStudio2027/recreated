import {test,expect} from '@playwright/test';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const url=process.env.RECREATED_URL || pathToFileURL(resolve('index.html')).href;
test.beforeEach(async({page})=>{await page.addInitScript(()=>{window.__RECREATED_E2E__=true});await page.goto(url);await page.locator('#new').click()});
test('Warden defeat grants bonus echoes, heals and trophy banner',async({page})=>{
 await page.evaluate(()=>{const d=window.RecreatedDebug;d.enter('ruins');d.forceFinalWave();d.clearEnemiesForTest()});
 await expect(page.locator('#rewardBanner')).toContainText('WARDEN VANQUISHED');
 await expect(page.locator('#rewardBanner')).toContainText('TROPHY UNLOCKED');
 const state=await page.evaluate(()=>window.RecreatedDebug.getState());
 expect(state.bossDefeated).toBe(true);
 expect(state.heals).toBeGreaterThanOrEqual(5);
 expect(state.player.echoes).toBeGreaterThanOrEqual(2);
});
test('chamber completion restores health and presents reward banner',async({page})=>{
 await page.evaluate(()=>{const d=window.RecreatedDebug;d.enter('mire');d.setPlayerHealthFractionForTest(.5);d.clearEnemiesForTest()});
 await expect.poll(async()=>page.evaluate(()=>window.RecreatedDebug.getState().dropCount),{timeout:5000}).toBeGreaterThan(0);
 await page.evaluate(()=>window.RecreatedDebug.clearDropsForTest());
 await expect.poll(async()=>page.evaluate(()=>window.RecreatedDebug.getState().wave),{timeout:5000}).toBe(2);
 const state=await page.evaluate(()=>window.RecreatedDebug.getState());
 expect(state.player.hp).toBeGreaterThan(state.player.max*.5);
 await expect(page.locator('#rewardBanner')).toContainText('CHAMBER SURVIVED');
});
test('victory banner stays compact on mobile',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>{const d=window.RecreatedDebug;d.enter('ruins');d.forceFinalWave();d.clearEnemiesForTest()});
 const banner=page.locator('#rewardBanner');
 await expect(banner).toBeVisible();
 const rect=await banner.boundingBox();
 expect(rect.width).toBeLessThan(390);
});
