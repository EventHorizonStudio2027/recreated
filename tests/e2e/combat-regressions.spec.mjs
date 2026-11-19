import {test,expect} from '@playwright/test';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const url=process.env.RECREATED_URL || pathToFileURL(resolve('index.html')).href;
test.beforeEach(async({page})=>{
 await page.addInitScript(()=>{window.__RECREATED_E2E__=true});
 await page.goto(url,{waitUntil:'domcontentloaded'});
 await page.locator('#new').click();
 await expect(page.locator('#gameLayer')).toBeVisible();
});
test('movement responds to keyboard input',async({page})=>{
 const before=await page.evaluate(()=>window.RecreatedDebug.getState().player.y);
 await page.keyboard.down('w');
 await page.waitForTimeout(350);
 await page.keyboard.up('w');
 const after=await page.evaluate(()=>window.RecreatedDebug.getState().player.y);
 expect(after).toBeLessThan(before);
});
test('cover blocks line-of-sight across an obstacle',async({page})=>{
 await page.evaluate(()=>window.RecreatedDebug.enter('ruins'));
 const result=await page.evaluate(()=>{
  const d=window.RecreatedDebug;
  const o=d.getState().obstacles[0];
  return {obstacle:!!o,blocked:o?d.hasLineOfSight(o.x-o.r-45,o.y,o.x+o.r+45,o.y):null,clear:d.hasLineOfSight(100,100,100,100)};
 });
 expect(result.obstacle).toBe(true);
 expect(result.blocked).toBe(false);
 expect(result.clear).toBe(true);
});
test('relic progression unlocks Steam and Storm synergies',async({page})=>{
 const result=await page.evaluate(()=>{
  const d=window.RecreatedDebug;
  for(let i=0;i<9;i++)d.grantEcho();
  return {relics:d.getState().player.relics,synergy:d.getSynergy()};
 });
 expect(result.relics).toEqual(['Ember','Tide','Gale']);
 expect(result.synergy.steam).toBe(true);
 expect(result.synergy.storm).toBe(true);
 expect(result.synergy.current).toBe(true);
});
test('Sunken Ruins final wave spawns Drowned Warden',async({page})=>{
 const result=await page.evaluate(()=>{
  const d=window.RecreatedDebug;d.enter('ruins');
  const advanced=d.forceFinalWave();
  return {advanced,types:d.getState().enemyTypes};
 });
 expect(result.advanced).toBe(true);
 expect(result.types).toContain('warden');
});
