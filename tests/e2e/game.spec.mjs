import {test,expect} from '@playwright/test';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const url=process.env.RECREATED_URL || pathToFileURL(resolve('index.html')).href;
test('title screen loads and displays approved branding',async({page})=>{
  await page.goto(url);
  await expect(page).toHaveTitle(/RECREATED/i);
  await expect(page.locator('#new')).toBeVisible();
  await expect(page.locator('#gameLayer')).toHaveCount(1);
});
test('player can start a journey and open accessible controls',async({page})=>{
  await page.goto(url);
  await page.locator('#new').click();
  await expect(page.locator('#gameLayer')).toBeVisible();
  await page.locator('#controlsHelp').click();
  await expect(page.locator('#controlsDialog')).toBeVisible();
  await expect(page.locator('#controlsTitle')).toHaveText('Controls');
  await page.keyboard.press('Escape');
  await expect(page.locator('#controlsDialog')).not.toBeVisible();
});
test('manual save displays feedback and survives reload',async({page})=>{
  await page.goto(url);
  await page.locator('#new').click();
  await page.locator('#saveNow').click();
  await expect(page.locator('#saveStatus')).not.toHaveText('Save unavailable');
  await page.reload();
  await expect(page.locator('#continue')).toBeVisible();
});
