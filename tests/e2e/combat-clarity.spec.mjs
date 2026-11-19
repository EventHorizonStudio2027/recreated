import {test,expect} from '@playwright/test';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const url=process.env.RECREATED_URL || pathToFileURL(resolve('index.html')).href;
test('combat HUD reports Echo Pulse readiness and cooldown',async({page})=>{
 await page.goto(url);await page.locator('#new').click();
 const status=page.locator('#combatReadout');
 await expect(status).toContainText('ECHO PULSE READY');
 await expect(status).toHaveAttribute('data-ready','true');
 await page.locator('#castPulse').click();
 await expect(status).toContainText(/ECHO PULSE [0-9.]+s/);
 await expect(status).toHaveAttribute('data-ready','false');
});
test('combat readout is legible at narrow mobile viewport',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto(url);await page.locator('#new').click();
 const status=page.locator('#combatReadout');
 await expect(status).toBeVisible();
 const box=await status.boundingBox();
 expect(box.width).toBeGreaterThan(100);
 expect(box.width).toBeLessThan(390);
});
test('reduced-motion preference preserves gameplay without runtime errors',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.locator('#new').click();
 await page.evaluate(()=>window.RecreatedDebug.enter('mire'));
 await page.locator('#castPulse').click();
 await page.waitForTimeout(180);
 expect(errors).toEqual([]);
 await expect(page.locator('#playfield')).toBeVisible();
});
