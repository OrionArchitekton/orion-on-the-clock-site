import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('copy controls wait for client initialization while command text remains readable',()=>{
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 const buttons=[...html.matchAll(/<button\b[^>]*aria-label="Copy command:[^"]*"[^>]*>/g)].map(x=>x[0]);
 assert.ok(buttons.length>0);
 for(const button of buttons)assert.match(button,/\bdisabled(?:[ =/>])/);
 assert.match(html,/<pre\b[^>]*>[\s\S]*?<code>/);
});
