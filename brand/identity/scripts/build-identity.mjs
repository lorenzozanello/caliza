/** Deterministic adapter of the approved CALIZA package. No logo redrawing. */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const source = join(root, 'brand/authority/caliza-group-design-system');
const destinations = ['brand/identity/dist', 'prototype/assets/img/brand', 'web/public/brand'];
const read = (rel) => readFileSync(join(source, rel), 'utf8');
const write = (rel, content) => {
  const target = join(root, rel);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
};
const copy = (from, to) => {
  const target = join(root, to);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(join(source, from), target);
};
const recolor = (svg) => svg.replaceAll(/#ae7256/gi, '#18343c');
const marks = ['group', 'stone-design', 'living-design', 'stone-care'];
const symbols = { 'stone-design': 'simbolo-stone-design', 'living-design': 'simbolo-living-design', 'stone-care': 'simbolo-stone-care' };
const aliases = { 'stone-design': 'stone', 'living-design': 'living', 'stone-care': 'care' };
let count = 0;
for (const mark of marks) {
  const filename = `caliza-${mark}`;
  const primary = read(`logos/${filename}.svg`);
  const inverse = read(`logos/${filename}-inversa.svg`);
  const mono = mark === 'group' ? read('logos/caliza-group-monocroma.svg') : recolor(primary);
  for (const [variant, svg] of Object.entries({ primary, inverse, monochrome: mono })) {
    for (const folder of destinations) write(`${folder}/${filename}-${variant}.svg`, svg);
    count++;
  }
  if (mark === 'group') continue;
  const original = read(`simbolos/${symbols[mark]}.svg`);
  const limewash = read(`simbolos/${symbols[mark]}-limewash.svg`);
  for (const [variant, svg] of Object.entries({ primary: original, inverse: original, monochrome: recolor(original), limewash })) {
    for (const folder of destinations) write(`${folder}/symbol-${mark}-${variant}.svg`, svg);
    count++;
  }
  write(`prototype/assets/img/option08-${aliases[mark]}.svg`, original);
  write(`web/public/brand/option08-${aliases[mark]}.svg`, original);
}
const fontFiles = readdirSync(join(source, 'fonts')).filter((name) => name.endsWith('.woff2'));
for (const font of fontFiles) {
  copy(`fonts/${font}`, `web/public/brand/fonts/${font}`);
  copy(`fonts/${font}`, `prototype/brand/fonts/${font}`);
}
const tokens = read('tokens/tokens.css').replaceAll('../fonts/', '/brand/fonts/');
write('web/src/styles/authority-tokens.css', tokens);
write('prototype/assets/css/authority-tokens.css', tokens);

const css = `/* CALIZA GROUP — adaptación web del manual rector. Archivo generado. */
:root { --caliza-mark-min-group:96px; --caliza-mark-min-division:72px; --caliza-mark-min-symbol:24px; }
.caliza-brand-logo { display:block; flex:none; width:var(--caliza-mark-width,120px); max-width:100%; height:auto; object-fit:contain; object-position:center; aspect-ratio:347.2 / 199; }
.caliza-brand-logo[data-caliza-mark="division"] { aspect-ratio:347.2 / 258.8; }
.caliza-brand-logo[data-caliza-mark="symbol"] { aspect-ratio:auto; }
.caliza-brand-link { display:inline-flex; align-items:center; flex:none; min-width:0; text-decoration:none; }
.caliza-brand-link .caliza-brand-logo { width:var(--caliza-mark-width,120px); height:auto; }
.site-header .logo img.caliza-brand-logo { position:static; inset:auto; width:var(--caliza-mark-width,104px); height:auto; opacity:1; transform:none; max-height:none; }
.mobile-menu img.caliza-brand-logo,.site-footer img.caliza-brand-logo { width:var(--caliza-mark-width,104px); height:auto; position:static; }
.o8-page,.o8-site { background:var(--surface); color:var(--ink); font-family:var(--font-sans); }
.o8-header,.site-header,.site-header.is-solid,.site-header--solid-start { background:var(--surface); color:var(--ink); border-bottom:1px solid var(--line); box-shadow:none; }
.o8-nav a,.site-header nav a { font:400 11px/16px var(--font-sans); letter-spacing:.22em; text-transform:uppercase; }
.o8-nav a[aria-current=page],.site-header nav a[aria-current=page] { color:var(--ink); border-bottom:1px solid var(--accent); }
.o8-page .o8-button,.o8-site .o8-button,.site-header .cta,.site-header.is-solid .cta { min-height:44px; height:44px; padding:0 28px; background:var(--primary); border:1px solid var(--primary); color:var(--on-primary); font:500 12px/1 var(--font-sans); letter-spacing:.2em; text-transform:uppercase; border-radius:0; box-shadow:none; }
.o8-page .o8-button:hover,.o8-site .o8-button:hover,.site-header .cta:hover { background:var(--accent-text); border-color:var(--accent-text); color:var(--on-primary); transform:none; }
.o8-page :focus-visible,.o8-site :focus-visible { outline:2px solid var(--focus); outline-offset:2px; }
.o8-page .exp-card,.o8-page .exp-social-card,.o8-page .exp-social-form { border-radius:0; box-shadow:none; }
.o8-page .exp-hero h1,.o8-site .o8-hero h1 { font-family:var(--font-serif); font-weight:400; letter-spacing:0; }
.o8-page .exp-social-card strong,.o8-page .exp-card-info h3 { font-family:var(--font-serif); }
.o8-page .exp-social-actions a,.o8-page .o8-text-link { color:var(--accent-text); }
.o8-page .o8-hero::after,.o8-page .exp-hero::after { background:linear-gradient(90deg,var(--scrim) 0%,rgba(24,52,60,.42) 43%,rgba(24,52,60,0) 85%); }
.o8-page .o8-hero-copy,.o8-page .exp-hero-content { color:var(--limewash); }
.o8-page .o8-hero .o8-button,.o8-page .exp-hero .o8-button { color:var(--limewash); border:1px solid var(--limewash); background:transparent; }
.o8-page .o8-hero .o8-button:hover,.o8-page .exp-hero .o8-button:hover { background:var(--limewash); color:var(--marine-ink); }
.o8-page .exp-social-card>div:first-child span,.o8-page .exp-brand-deck span,.o8-page .exp-subnav a[aria-current=page],.o8-page .exp-remove,.o8-page .o8-section-heading a { color:var(--accent-text); }
.o8-page .o8-footer strong { color:var(--sand); }
.o8-page .o8-demo-note { background:var(--marine-ink); color:var(--limewash); }
.o8-page .o8-footer,.site-footer { background:var(--marine-ink); color:var(--limewash); }
@media(max-width:660px) { .o8-header .caliza-brand-logo,.site-header .logo img.caliza-brand-logo { width:96px; } .site-footer .caliza-brand-logo { width:110px; } }
@media(prefers-reduced-motion:reduce){.o8-button{transition:none!important}}
`;
for (const path of ['brand/identity/dist/identity.css', 'prototype/assets/css/identity.css', 'web/src/styles/identity.css']) write(path, css);
console.log(`CALIZA authority synced: ${count} SVG variants, ${fontFiles.length} local fonts, semantic tokens`);
