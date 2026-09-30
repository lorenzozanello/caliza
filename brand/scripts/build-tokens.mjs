// Genera brand/tokens.css a partir de brand/tokens.json.
// Uso: node brand/scripts/build-tokens.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..');
const t = JSON.parse(readFileSync(join(dir, 'tokens.json'), 'utf8'));
const first = t.color.themes[0].id;
const val = (v) => (typeof v === 'string' ? v : v[first]);
const alias = (v) => v.replace(/^\{(.+)\}$/, 'var(--$1)');

const lines = [];
lines.push('/* Generado desde tokens.json. No editar a mano. */', ':root {');
for (const c of t.color.tokens) lines.push(`  --${c.name}: ${alias(val(c.value))};`);
for (const fam of ['spacing', 'radius', 'shadow', 'zIndex']) {
  for (const x of (t[fam]?.tokens ?? [])) lines.push(`  --${x.name}: ${val(x.value)};`);
}
for (const [k, v] of Object.entries(t.type.families)) lines.push(`  --font-${k}: ${v};`);
lines.push('}', '');
for (const g of t.type.groups) {
  for (const s of g.styles) {
    const fam = s.family ?? g.family;
    const decl = [`font-family: var(--font-${fam})`, `font-size: ${s.fontSize}`, `line-height: ${s.lineHeight}`, `font-weight: ${s.fontWeight}`];
    if (s.letterSpacing) decl.push(`letter-spacing: ${s.letterSpacing}`);
    if (s.fontStyle) decl.push(`font-style: ${s.fontStyle}`);
    if (s.name === 'etiqueta') decl.push('text-transform: uppercase');
    lines.push(`.${s.name} { ${decl.join('; ')}; }`);
  }
}
writeFileSync(join(dir, 'tokens.css'), lines.join('\n') + '\n');
console.log('tokens.css generado');
