import {test,expect} from '@playwright/test';
const gameUrl = '/index.html';

test('new journey, pause, panel navigation, save and continue', async ({page}) => {
  const errors=[];
  page.on('pageerror', error=>errors.push(error.message));
  await page.goto(gameUrl);
  await expect(page.locator('#new')).toBeVisible();
  await page.locator('#new').click();
  await expect(page.locator('#gameLayer')).toHaveClass(/active/);
  await expect(page.locator('#playfield')).toBeVisible();
  await page.locator('#pauseGame').click();
  await expect(page.locator('#pauseGame')).toHaveText('Resume');
  await page.locator('#pauseGame').click();
  await expect(page.locator('#pauseGame')).toHaveText('Pause');
  await page.locator('#showLedger').click();
  await expect(page.locator('#gamePanel')).toBeVisible();
  await expect(page.locator('#closeGamePanel')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#gamePanel')).toBeHidden();
  await page.locator('#returnTitle').click();
  await expect(page.locator('#continue')).toBeEnabled();
  await page.reload();
  await expect(page.locator('#continue')).toBeEnabled();
  await page.locator('#continue').click();
  await expect(page.locator('#gameLayer')).toHaveClass(/active/);
  expect(errors).toEqual([]);
});

test('title settings and ledger do not crash on malformed stored state', async ({page}) => {
  const errors=[];
  page.on('pageerror', error=>errors.push(error.message));
  await page.goto(gameUrl);
  await page.evaluate(()=>localStorage.setItem('recreated-title-v1', JSON.stringify({changes:'bad data'})));
  await page.reload();
  await page.locator('#ledger').click();
  await expect(page.locator('#overlay')).toHaveClass(/open/);
  await page.locator('#close').click();
  await page.locator('#settings').click();
  await expect(page.locator('#motion')).toBeVisible();
  expect(errors).toEqual([]);
});

test('switching tabs pauses gameplay and keeps a saved journey', async ({page}) => {
  await page.goto(gameUrl);
  await page.locator('#new').click();
  await page.evaluate(()=>{
    Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator('#pauseGame')).toHaveText('Resume');
  await expect(page.locator('#saveStatus')).not.toHaveText('Save unavailable');
  await page.locator('#returnTitle').click();
  await expect(page.locator('#continue')).toBeEnabled();
});
