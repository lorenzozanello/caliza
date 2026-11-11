import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const identity = resolve(fileURLToPath(import.meta.url), '..', '..');
const root = resolve(identity, '..', '..');
const authority = join(root, 'brand/authority/caliza-group-design-system');
const conf = JSON.parse(readFileSync(join(identity, 'identity.config.json'), 'utf8'));
const hash = (buffer) => createHash('sha256').update(buffer).digest('hex');
assert.equal(hash(readFileSync(join(root, 'brand/authority/caliza-group-design-system.zip'))), conf.sourcePackageSha256);
const dist = join(identity, 'dist');
const names = ['group', 'stone-design', 'living-design', 'stone-care'];
const variants = ['primary', 'inverse', 'monochrome'];
const expected = names.flatMap((n) => variants.map((v) => `caliza-${n}-${v}.svg`).concat(n === 'group' ? [] : ['primary', 'inverse', 'monochrome', 'limewash'].map((v) => `symbol-${n}-${v}.svg`))).sort();
assert.deepEqual(readdirSync(dist).filter((f) => f.endsWith('.svg')).sort(), expected);
const before = new Map();
for (const filename of expected) {
  const content = readFileSync(join(dist, filename));
  const svg = content.toString('utf8');
  assert.match(svg, /viewBox="[\-0-9. ]+"/);
  assert.ok(!/<script[\s>]|<foreignObject[\s>]|<text[\s>]/i.test(svg), `portable SVG: ${filename}`);
  for (const folder of ['web/public/brand', 'prototype/assets/img/brand']) assert.deepEqual(readFileSync(join(root, folder, filename)), content, `${folder}/${filename}`);
  before.set(filename, hash(content));
}
for (const name of names) {
  const srcName = `caliza-${name}`;
  assert.equal(readFileSync(join(dist, `${srcName}-primary.svg`), 'utf8'), readFileSync(join(authority, `logos/${srcName}.svg`), 'utf8'), `source vector mismatch: ${name}`);
}
for (const font of readdirSync(join(authority, 'fonts')).filter((p) => p.endsWith('.woff2'))) {
  for (const dir of ['web/public/brand/fonts', 'prototype/brand/fonts']) assert.deepEqual(readFileSync(join(root, dir, font)), readFileSync(join(authority, 'fonts', font)));
}
const css = readFileSync(join(root, 'web/src/styles/authority-tokens.css'), 'utf8');
assert.ok(css.includes('--accent-text: #85513b'));
assert.ok(css.includes('url("/brand/fonts/PlayfairDisplay-400-normal.woff2")'));
execFileSync(process.execPath, [join(identity, 'scripts/build-identity.mjs')], { cwd: root });
for (const filename of expected) assert.equal(hash(readFileSync(join(dist, filename))), before.get(filename), `non-deterministic ${filename}`);
assert.ok(readFileSync(join(root, 'prototype/index.html'), 'utf8').includes('authority-tokens.css'));
console.log(`PASS authority hash, ${expected.length} exact SVG variants, 2 mirrors, local fonts, semantic tokens and deterministic generation`);
