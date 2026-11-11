/**
 * CALIZA logo compiler. Run: node brand/identity/scripts/build-identity.mjs
 * All exported logos are vector paths: no fonts, scripts or external images.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const identity = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(identity, '..', '..');
const config = JSON.parse(readFileSync(join(identity, 'identity.config.json'), 'utf8'));
const outlines = JSON.parse(readFileSync(join(identity, 'glyphs.json'), 'utf8'));
const colors = config.colors;
const round = (n) => Number(n.toFixed(3));
const xml = (s) => String(s).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

function word(text, family, size, tracking, cx, baseline, fill) {
  const font = outlines[family];
  const scale = size / font.unitsPerEm;
  const glyphs = [...text].map((letter) => {
    if (!(letter in font.glyphs)) throw new Error(`No outline for ${family}: ${letter}`);
    return font.glyphs[letter];
  });
  const advance = glyphs.reduce((sum, item) => sum + item.advance * scale, 0) + Math.max(0, glyphs.length - 1) * tracking;
  let cursor = cx - advance / 2;
  const paths = glyphs.map((glyph) => {
    const position = round(cursor);
    cursor += glyph.advance * scale + tracking;
    return glyph.path ? `<path d="${xml(glyph.path)}" transform="translate(${position} ${round(baseline)}) scale(${round(scale)} -${round(scale)})"/>` : '';
  }).join('');
  return `<g fill="${fill}" aria-hidden="true">${paths}</g>`;
}

function symbol(name, x, y, size, color) {
  const geometry = config.symbolGeometry[name];
  if (!geometry) throw new Error(`Symbol missing: ${name}`);
  const paths = geometry.map((item) => item.type === 'stroke'
    ? `<path d="${xml(item.path)}" fill="none" stroke="${color}" stroke-width="${item.width}" stroke-linecap="butt" stroke-linejoin="round"/>`
    : `<path d="${xml(item.path)}" fill="${color}"/>`).join('');
  return `<g transform="translate(${x} ${y}) scale(${round(size / 64)})">${paths}</g>`;
}

const variants = {
  primary: { ink: colors.marineInk, accent: colors.terracotta },
  inverse: { ink: colors.limewash, accent: colors.terracotta },
  monochrome: { ink: colors.marineInk, accent: colors.marineInk },
};

function renderLogo(mark, variantName) {
  const theme = variants[variantName];
  const isGroup = mark.type === 'group';
  const box = config.construction[isGroup ? 'group' : 'division'];
  const center = box.width / 2;
  const family = config.typography.wordmark;
  let body;
  if (isGroup) {
    body = word('CALIZA', 'playfair', box.wordmarkSize, family.tracking, center, box.topBaseline, theme.ink)
      + word('GROUP', 'playfair', box.wordmarkSize, family.tracking, center, box.bottomBaseline, theme.ink)
      + `<path d="M${round(center - box.underlineWidth / 2)} ${box.underlineY}h${box.underlineWidth}" stroke="${theme.accent}" stroke-width="${box.underlineStroke}"/>`;
  } else {
    body = symbol(mark.id, box.symbolX, box.symbolY, box.symbolSize, theme.accent)
      + word('CALIZA', 'playfair', box.wordmarkSize, -0.7, center, box.wordmarkBaseline, theme.ink)
      + word(mark.descriptor, 'montserrat', box.descriptorSize, config.typography.descriptor.tracking, center, box.descriptorBaseline, theme.ink);
  }
  return svg(box.width, box.height, mark.name, body);
}

function svg(width, height, title, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${xml(title)}">${body}</svg>\n`;
}

function writeRelative(file, content) {
  const target = join(root, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
}

const assetPaths = ['brand/identity/dist', 'prototype/assets/img/brand', 'web/public/brand'];
let exported = 0;
for (const mark of config.marks) {
  for (const variant of Object.keys(variants)) {
    const name = `caliza-${mark.id}-${variant}.svg`;
    const data = renderLogo(mark, variant);
    for (const folder of assetPaths) writeRelative(`${folder}/${name}`, data);
    exported += 1;
  }
  if (mark.type === 'division') {
    for (const [variant, theme] of Object.entries(variants)) {
      const name = `symbol-${mark.id}-${variant}.svg`;
      const data = svg(64, 64, mark.name, symbol(mark.id, 0, 0, 64, theme.accent));
      for (const folder of assetPaths) writeRelative(`${folder}/${name}`, data);
      exported += 1;
    }
    const alias = { 'stone-design': 'stone', 'living-design': 'living', 'stone-care': 'care' }[mark.id];
    const data = svg(64, 64, mark.name, symbol(mark.id, 0, 0, 64, colors.terracotta));
    writeRelative(`web/public/brand/option08-${alias}.svg`, data);
    writeRelative(`prototype/assets/img/option08-${alias}.svg`, data);
  }
}

const styles = `/* Auto-generado desde identity.config.json. Mantener sin ediciones manuales. */
:root {
  --caliza-marine-ink: ${colors.marineInk};
  --caliza-terracotta: ${colors.terracotta};
  --caliza-sand: ${colors.sand};
  --caliza-limewash: ${colors.limewash};
  --caliza-paper: ${colors.paper};
  --caliza-font-display: "Playfair Display", Georgia, serif;
  --caliza-font-body: "Montserrat", Arial, sans-serif;
  --caliza-clearspace: 0.5em;
  --caliza-mark-min-group: ${config.construction.minimumWidthsPx.group}px;
  --caliza-mark-min-division: ${config.construction.minimumWidthsPx.division}px;
  --caliza-mark-min-symbol: ${config.construction.minimumWidthsPx.symbol}px;
}
.caliza-brand-logo {
  display: block;
  flex: none;
  width: var(--caliza-mark-width, 120px);
  max-width: 100%;
  height: auto;
  object-fit: contain;
  object-position: center;
  aspect-ratio: 330 / 232;
}
.caliza-brand-logo[data-caliza-mark="division"] { aspect-ratio: 260 / 202; }
.caliza-brand-logo[data-caliza-mark="symbol"] { aspect-ratio: 1; }
.caliza-brand-link { display: inline-flex; align-items: center; flex: none; min-width: 0; text-decoration: none; }
.caliza-brand-link .caliza-brand-logo { width: var(--caliza-mark-width, 120px); height: auto; }
.site-header .logo img.caliza-brand-logo {
  position: static; inset: auto; width: var(--caliza-mark-width, 104px);
  height: auto; opacity: 1; transform: none; max-height: none;
}
.mobile-menu img.caliza-brand-logo, .site-footer img.caliza-brand-logo {
  width: var(--caliza-mark-width, 104px); height: auto; position: static;
}
@media (max-width: 660px) {
  .o8-header .caliza-brand-logo, .site-header .logo img.caliza-brand-logo { width: 82px; }
  .site-footer .caliza-brand-logo { width: 96px; }
}
`;
for (const path of ['brand/identity/dist/identity.css', 'prototype/assets/css/identity.css', 'web/src/styles/identity.css']) writeRelative(path, styles);
console.log(`CALIZA identity: ${exported} SVG masters x ${assetPaths.length} targets, 3 compatible aliases, 3 token stylesheets`);
