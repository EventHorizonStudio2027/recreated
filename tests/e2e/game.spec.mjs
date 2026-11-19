import {test,expect} from '@playwright/test';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const url=process.env.RECREATED_URL || pathToFileURL(resolve('index.html')).href;

test('offline title renders with playable entrypoint',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await expect(page).toHaveTitle(/RECREATED/i);
  await expect(page.locator('#new')).toBeVisible();
  await expect(page.locator('#playfield')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('start game, use controls dialog and keyboard shortcut',async({page})=>{
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.locator('#new').click();
  await expect(page.locator('#gameLayer')).toBeVisible();
  await expect(page.locator('#playfield')).toBeVisible();
  await page.locator('#gameToolsToggle').click();
  await page.locator('#controlsHelp').click();
  await expect(page.locator('#controlsDialog')).toBeVisible();
  await expect(page.locator('#controlsTitle')).toHaveText('Controls');
  await page.keyboard.press('Escape');
  await expect(page.locator('#controlsDialog')).not.toBeVisible();
  await page.keyboard.press('Shift+/');
  await expect(page.locator('#controlsDialog')).toBeVisible();
  await page.keyboard.press('Escape');
});

test('save, reload and continue',async({page})=>{
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.locator('#new').click();
  await page.locator('#saveNow').click();
  await expect(page.locator('#saveStatus')).not.toHaveText('Save unavailable');
  const keys=await page.evaluate(()=>Object.keys(localStorage));
  expect(keys.some(k=>k.includes('recreated'))).toBeTruthy();
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('#continue')).toBeVisible();
  await page.locator('#continue').click();
  await expect(page.locator('#gameLayer')).toBeVisible();
});

test('tools menu opens, supports keyboard and closes',async({page})=>{
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.locator('#new').click();
  const toggle=page.locator('#gameToolsToggle');
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('#gameToolsMenu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded','false');
});

test('expedition transition, deterministic cover and world changes',async({page})=>{
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.locator('#new').click();
  const initial=await page.evaluate(()=>window.RecreatedDebug.getState());
  expect(initial.room).toBe('hub');
  await page.evaluate(()=>window.RecreatedDebug.enter('mire'));
  const mire=await page.evaluate(()=>window.RecreatedDebug.getState());
  expect(mire.room).toBe('mire');
  expect(mire.enemyCount).toBeGreaterThan(0);
  expect(mire.roomVisits.mire).toBeGreaterThan(0);
  const cover=await page.evaluate(()=>window.RecreatedDebug.chamberCover('mire',1,1));
  expect(cover).toEqual(await page.evaluate(()=>window.RecreatedDebug.chamberCover('mire',1,1)));
  await page.evaluate(()=>window.RecreatedDebug.enter('ruins'));
  const ruins=await page.evaluate(()=>window.RecreatedDebug.getState());
  expect(ruins.room).toBe('ruins');
  expect(ruins.enemyCount).toBeGreaterThan(0);
});

test('combat actions, relic readout and responsive viewport',async({page})=>{
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.locator('#new').click();
  await page.evaluate(()=>window.RecreatedDebug.enter('mire'));
  await page.evaluate(()=>{window.RecreatedDebug.attack();window.RecreatedDebug.pulse();window.RecreatedDebug.dodge()});
  const state=await page.evaluate(()=>window.RecreatedDebug.getState());
  expect(state.player.hp).toBeGreaterThan(0);
  await expect(page.locator('#relicText')).toBeAttached();
  await page.setViewportSize({width:390,height:844});
  await expect(page.locator('#playfield')).toBeAttached();
  await expect(page.locator('#mobilePad')).toBeAttached();
});
