/**
 * Pipeline editorial CALIZA: usa solo imágenes aprobadas en 06_IMAGENES y 10_CONTROL.
 *
 * Ejecución desde /web:
 *   npm run media:prepare -- --manifest /ruta/manifest-privado.json --source /ruta/originales-autorizados
 *
 * El manifest privado es una exportación CURADA de las filas aprobadas:
 * {
 *   "medios": [
 *     {
 *       "medio_id": "CAL-MED-0001", "familia_slug": "mesas-de-comedor",
 *       "archivo_original": "foto-01.jpg",
 *       "texto_alt": "Descripción específica revisada",
 *       "derechos_publicacion_confirmados": "Sí", "aprobado_web": "Sí",
 *       "producto_real": "Sí", "control_listo_publicar": "Sí",
 *       "revision_sin_precios": "Sí", "recorte": { "left": 0, "top": 0, "width": 800, "height": 800 }
 *     }
 *   ]
 * }
 * NUNCA guardar ese manifest ni los originales en el repositorio público.
 */
import sharp from 'sharp';
import { readFile, mkdir, mkdtemp, rename, copyFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const option = (flag) => args[args.indexOf(flag) + 1];
if (!args.includes('--manifest') || !args.includes('--source')) {
  console.error('Se requiere --manifest y --source. No se modifica el repositorio.');
  process.exit(2);
}
const here = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(here, '..');
const prototype = path.resolve(webRoot, '../prototype');
const source = path.resolve(option('--source'));
const manifestFile = path.resolve(option('--manifest'));
const target = path.join(prototype, 'assets/img/approved');
const outputManifest = path.join(prototype, 'assets/data/approved-media.js');
if (source.startsWith(prototype + path.sep) || source.startsWith(webRoot + path.sep) || manifestFile.startsWith(prototype + path.sep)) {
  throw new Error('Los originales y el manifest deben permanecer fuera de GitHub.');
}
const parsed = JSON.parse(await readFile(manifestFile, 'utf8'));
const records = parsed.medios;
if (!Array.isArray(records) || records.length === 0) throw new Error('Sin medios aprobados: no modificar activos públicos.');
const allowed = new Set(['mesas-de-comedor', 'mesas-auxiliares', 'sillas-para-hogar', 'sillas-comerciales', 'lavamanos']);
const checked = [];
const slugs = new Set();
for (const media of records) {
  if (!allowed.has(media.familia_slug) || slugs.has(media.familia_slug)) throw new Error('Slug inválido o duplicado.');
  slugs.add(media.familia_slug);
  if (!/^CAL-MED-\d{4}$/.test(media.medio_id || '')) throw new Error('medio_id inválido');
  if (media.derechos_publicacion_confirmados !== 'Sí' || media.aprobado_web !== 'Sí' ||
      media.producto_real !== 'Sí' || media.control_listo_publicar !== 'Sí' || media.revision_sin_precios !== 'Sí') {
    throw new Error(media.medio_id + ': falta aprobación real por medio y entidad; no exportar.');
  }
  if (typeof media.texto_alt !== 'string' || media.texto_alt.trim().length < 15) throw new Error('Alt insuficiente para ' + media.medio_id);
  if (typeof media.archivo_original !== 'string' || !/^[\w. -]+\.(jpg|jpeg|png|webp)$/i.test(media.archivo_original)) throw new Error('Nombre de original inseguro.');
  const full = path.resolve(source, media.archivo_original);
  if (!full.startsWith(source + path.sep)) throw new Error('Ruta inválida');
  const st = await stat(full);
  if (!st.isFile() || st.size > 20 * 1024 * 1024) throw new Error('Original inválido o demasiado grande');
  const meta = await sharp(full).metadata();
  if (meta.width < 500 || meta.height < 500) throw new Error('Resolución insuficiente de ' + media.medio_id);
  const crop = media.recorte || null;
  if (crop && (!['left','top','width','height'].every((k) => Number.isInteger(crop[k])) ||
    crop.left < 0 || crop.top < 0 || crop.width < 320 || crop.height < 320 ||
    crop.left + crop.width > meta.width || crop.top + crop.height > meta.height)) {
    throw new Error('Recorte inválido para ' + media.medio_id);
  }
  checked.push({ media, full, width: crop?.width || meta.width, height: crop?.height || meta.height, crop });
}
const staging = await mkdtemp(path.join(os.tmpdir(), 'caliza-approved-'));
try {
  const manifest = {};
  for (const { media, full, width, height, crop } of checked) {
    const name = media.familia_slug;
    let primaryWidth = null;
    const generatedWidths = [];
    for (const w of [320, 480, 640, 960, 1280, 1920]) {
      if (w > width) continue;
      const photo = (crop ? sharp(full).extract(crop) : sharp(full)).rotate().resize({ width: w, withoutEnlargement: true })
        .modulate({ saturation: 0.94, brightness: 1.015 });
      await photo.clone().webp({ quality: 79, effort: 5 }).toFile(path.join(staging, name + '-' + w + '.webp'));
      await photo.clone().avif({ quality: 55, effort: 5 }).toFile(path.join(staging, name + '-' + w + '.avif'));
      primaryWidth = w;
      generatedWidths.push(w);
    }
    if (!primaryWidth || !(await stat(path.join(staging, name + '-' + primaryWidth + '.webp')).catch(() => null))) throw new Error('No se generó formato válido.');
    // Ruta WebP de fallback para navegadores compatibles; AVIF y srcset en un futuro renderer.
    manifest[name] = {
      src: 'approved/' + name + '-' + primaryWidth + '.webp',
      alt: media.texto_alt.trim(),
      medio_id: media.medio_id,
      widths: generatedWidths,
      aspectRatio: Math.round(width / height * 10000) / 10000
    };
  }
  const files = await import('node:fs/promises').then((fs) => fs.readdir(staging));
  await mkdir(target, { recursive: true });
  for (const name of files) await copyFile(path.join(staging, name), path.join(target, name));
  // No copia estados internos, ni URL de Drive, ni datos comerciales privados.
  const output = '/* Generado por el pipeline de medios verificados de CALIZA. */\nwindow.CALIZA_APPROVED_MEDIA = Object.freeze(' + JSON.stringify(manifest, null, 2) + ');\n';
  const temp = outputManifest + '.tmp';
  await import('node:fs/promises').then((fs) => fs.writeFile(temp, output, 'utf8'));
  await rename(temp, outputManifest);
  console.log('Se prepararon ' + checked.length + ' familias aprobadas; revise el diff y pruebas antes de publicar.');
} finally {
  await rm(staging, { recursive: true, force: true });
}
