import {test,expect} from '@playwright/test';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const url=process.env.RECREATED_URL || pathToFileURL(resolve('index.html')).href;
const key='recreated-playable-v2';
test('new journey confirmation preserves existing progress when cancelled',async({page})=>{
 await page.goto(url);await page.locator('#new').click();
 await page.evaluate(()=>{window.RecreatedDebug.grantEcho?.()});
 await page.locator('#saveNow').click();
 const original=await page.evaluate(k=>localStorage.getItem(k),key);
 await page.locator('#returnTitle').click();
 await expect(page.locator('#journeyHint')).toContainText('JOURNEY SAVED');
 page.once('dialog',d=>d.dismiss());
 await page.locator('#new').click();
 await expect(page.locator('#gameLayer')).not.toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(original);
});
test('confirmed new journey archives old save before replacing it',async({page})=>{
 await page.goto(url);await page.locator('#new').click();
 await page.evaluate(()=>window.RecreatedDebug.enter('mire'));
 await page.locator('#saveNow').click();
 const old=await page.evaluate(k=>localStorage.getItem(k),key);
 await page.locator('#returnTitle').click();
 page.once('dialog',d=>d.accept());
 await page.locator('#new').click();
 await expect(page.locator('#gameLayer')).toBeVisible();
 const result=await page.evaluate(k=>({old:localStorage.getItem(k+'-previous-journey'),now:localStorage.getItem(k)}),key);
 expect(result.old).toBe(old);
 expect(result.now).not.toBe(old);
 expect(JSON.parse(result.now).room).toBe('hub');
});
test('backup-only save enables Continue and recovers progress',async({page})=>{
 await page.goto(url);await page.locator('#new').click();
 await page.evaluate(()=>window.RecreatedDebug.enter('mire'));
 await page.locator('#saveNow').click();
 await page.evaluate(k=>{localStorage.setItem(k+'-backup',localStorage.getItem(k));localStorage.removeItem(k)},key);
 await page.reload();
 await expect(page.locator('#journeyHint')).toContainText('BACKUP FOUND');
 await expect(page.locator('#continue')).toBeEnabled();
 await page.locator('#continue').click();
 await expect(page.locator('#gameLayer')).toBeVisible();
 await expect(page.locator('#saveStatus')).not.toHaveText('Save unavailable');
});
test('returning to title keeps Continue enabled',async({page})=>{
 await page.goto(url);await page.locator('#new').click();
 await page.locator('#returnTitle').click();
 await expect(page.locator('#continue')).toBeEnabled();
});
