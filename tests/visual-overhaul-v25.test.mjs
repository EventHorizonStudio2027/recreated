import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('index.html','utf8');
const style=html.match(/<style id="v25-art-direction">([\s\S]*?)<\/style>/)?.[1];
test('premium visual system is present and keeps playable game',()=>{
 assert.ok(style);
 assert.match(html,/id="gameLayer"/);
 assert.match(html,/id="playfield"/);
});
test('hub art direction is consistent across hero and panels',()=>{
 for(const selector of ['.layout{','.hero{','.lower>.side','.menu .action.primary{']) assert.ok(style.includes(selector),selector);
});
test('combat UI uses bounded responsive viewport and readable controls',()=>{
 for(const selector of ['#gameTop{','#gameViewport{','#gameBottom{','#gameBottom #castPulse']) assert.ok(style.includes(selector),selector);
});
test('small screens and reduced motion are supported',()=>{
 assert.match(style,/@media\(max-width:640px\)/);
 assert.match(style,/scroll-snap-type:x mandatory/);
 assert.match(style,/@media\(prefers-reduced-motion:reduce\)/);
});
