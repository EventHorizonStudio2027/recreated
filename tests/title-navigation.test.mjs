import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('playable game owns New and Continue navigation', () => {
  assert.match(html, /el\('new'\)\.onclick\s*=\s*\(\)\s*=>/);
  assert.match(html, /el\('continue'\)\.onclick\s*=\s*\(\)\s*=>/);
  assert.doesNotMatch(html, /\$\('#new'\)\.onclick\s*=\s*begin/);
  assert.doesNotMatch(html, /\$\('#continue'\)\.onclick\s*=/);
});

test('title shortcuts only expose functional title utilities', () => {
  assert.match(html, /if\(n!=='Ledger'&&n!=='Settings'\)return/);
  assert.match(html, /\$\('#ledger'\)\.onclick=ledger/);
  assert.match(html, /\$\('#settings'\)\.onclick=settings/);
});

test('no obsolete non-playable claim or conflicting build labels', () => {
  assert.doesNotMatch(html, /not a combat build|BUILD 1\.5 · THE MODERN WEAVE/i);
  assert.match(html, /id="playfield"/);
});

test('title reset explicitly excludes gameplay save', () => {
  assert.match(html, /Reset title-screen preferences\?/);
  assert.match(html, /Gameplay saves are managed separately/);
});
