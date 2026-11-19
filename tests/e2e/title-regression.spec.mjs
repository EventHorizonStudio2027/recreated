import {test,expect} from '@playwright/test';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const url=process.env.RECREATED_URL || pathToFileURL(resolve('index.html')).href;

test('New Journey enters playable game without runtime errors',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url,{waitUntil:'domcontentloaded'});
 await page.locator('#new').click();
 await expect(page.locator('#gameLayer')).toHaveClass(/active/);
 await expect(page.locator('#playfield')).toBeVisible();
 expect(errors).toEqual([]);
});
