import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const identity = resolve(fileURLToPath(import.meta.url), '..', '..');
const root = resolve(identity, '..', '..');
const conf = JSON.parse(readFileSync(join(identity, 'identity.config.json'), 'utf8'));
const tokens = JSON.parse(readFileSync(join(root, 'brand/tokens.json'), 'utf8'));
const dist = join(identity, 'dist');
const expected = conf.marks.flatMap(({ id, type }) => [
  ...['primary', 'inverse', 'monochrome'].map((v) => `caliza-${id}-${v}.svg`),
  ...(type === 'division' ? ['primary', 'inverse', 'monochrome'].map((v) => `symbol-${id}-${v}.svg`) : []),
]).sort();
const actual = readdirSync(dist).filter((p) => p.endsWith('.svg')).sort();
assert.deepEqual(actual, expected, 'Exactly 21 identity SVGs expected');
const before = new Map();
const sha = (s) => createHash('sha256').update(s).digest('hex');
for (const file of expected) {
  const data = readFileSync(join(dist, file), 'utf8');
  assert.match(data, /<svg\s[^>]*viewBox="0 0 \d+ \d+"/);
  assert.match(data, /preserveAspectRatio="xMidYMid meet"/);
  assert.ok(!/<text[\s>]|<script[\s>]|<image[\s>]|<foreignObject[\s>]/i.test(data), `${file} must contain portable vector outlines only`);
  assert.match(data, /<path\s/);
  assert.ok(data.includes('aria-label="CALIZA '), `${file} accessible name`);
  for (const folder of ['prototype/assets/img/brand', 'web/public/brand']) {
    assert.equal(readFileSync(join(root, folder, file), 'utf8'), data, `${folder}/${file} must match master`);
  }
  before.set(file, sha(data));
}
for (const [alias, mark] of [['stone', 'stone-design'], ['living', 'living-design'], ['care', 'stone-care']]) {
  const src = readFileSync(join(root, 'web/public/brand', `symbol-${mark}-primary.svg`), 'utf8');
  assert.equal(readFileSync(join(root, 'web/public/brand', `option08-${alias}.svg`), 'utf8'), src);
  assert.equal(readFileSync(join(root, 'prototype/assets/img', `option08-${alias}.svg`), 'utf8'), src);
}
for (const [name, value] of Object.entries({ piedra: 'limewash', arena: 'sand', carbon: 'marineInk', acento: 'terracotta' })) {
  assert.equal(tokens.color.tokens.find((entry) => entry.name === name)?.value.toUpperCase(), conf.colors[value].toUpperCase(), `Palette drift: ${name}`);
}
execFileSync(process.execPath, [join(identity, 'scripts/build-identity.mjs')], { cwd: root, stdio: 'pipe' });
for (const file of expected) assert.equal(sha(readFileSync(join(dist, file), 'utf8')), before.get(file), `Non-deterministic output: ${file}`);
const prototype = readFileSync(join(root, 'prototype/index.html'), 'utf8');
assert.ok(prototype.includes('caliza-group-primary.svg'));
assert.ok(!prototype.includes('<span>CALIZA</span><span>GROUP</span>'), 'No reconstructed CSS text wordmarks in prototype');
console.log(`PASS ${expected.length} SVGs, 2 synced distribution trees, 3 compatibility aliases, palette, deterministic build, UI integration`);
