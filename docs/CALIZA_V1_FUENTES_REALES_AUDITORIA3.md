# CALIZA v1 — reconciliación real, medios y tercera auditoría

**Origen:** [Catálogo maestro CALIZA 2026](https://docs.google.com/spreadsheets/d/1ibSKxlHH2uPfRwxaiQcrocMWgkDX4qjvw-g_TGkqk4g/edit).
**Fecha:** 2026-11-11. **Rama:** `feat/caliza-v1-real-media-audit3-20261111`. **Estado:** primera versión editorial en QA, NO salida comercial.

## Evidencia del archivo
- 178 medios clasificados: 140 imágenes, 38 videos, en 9 agrupaciones fuente.
- 01_PRODUCTOS, 02_VARIANTES, 03_MATERIALES, 04_PRECIOS, 05_INVENTARIO y 07_PROYECTOS: sin fichas aprobadas en el maestro; no hay SKU, proyecto individual o tarifa validada para publicación.
- 06_IMAGENES: **cero fotografías con derechos de publicación «Sí» y aprobado_web «Sí»**. 10_CONTROL: nueve familias con `listo_publicar = No`.
- Se preparó en un paquete **privado** el tratamiento fotográfico de 7 imágenes reales del archivo. No se suben esos medios a GitHub público ni a Vercel mientras carezcan de aprobación individual.
- Muestras editoriales privadas preparadas con los IDs de referencia: CAL-MED-0129 (comedor), CAL-MED-0118 (auxiliares), CAL-MED-0147 (sillas hogar), CAL-MED-0137 (comercial), CAL-MED-0106 (lavamanos), CAL-MED-0001 y CAL-MED-0066 (piedra/cocinas). La fuente se mantiene en Drive.

## Integración cuando CALIZA apruebe imágenes
1. Asociar `medio_id` y familia o `producto_id` verificado en 06_IMAGENES; registrar `texto_alt`, derechos confirmados Sí, aprobado_web Sí, producto real y revisión de recorte sin precios históricos confirmada.
2. Para fichas individuales, completar entidad y campo `listo_publicar` en 10_CONTROL; no utilizar el campo global SRC-CAT como sustituto.
3. Preparar un JSON **privado fuera del repositorio** con registros aprobados y rutas a originales autorizados. Ejecutar desde `web/`: `npm run media:prepare -- --manifest /ruta/manifest-privado.json --source /ruta/originales`.
4. El script bloquea imágenes sin las cinco validaciones y admite un recorte dentro del original, genera AVIF/WebP responsive, y actualiza `prototype/assets/data/approved-media.js` sin URLs privadas.
5. Hacer inspección visual humana antes de subir medios al repositorio y desplegar. No copiar a GitHub ZIPs originales de Drive, capturas con precios o enlaces privados.

## Tercera auditoría
- T1: título Contacto sin marca repetida.
- T2: pie de página en Montserrat 500, sin 700.
- T3: el dock WhatsApp se oculta cuando el menú móvil está abierto.
- T4: banner único de una línea con explicación desplegable.
- T5: la sección de dos familias de la portada usa dos columnas, no cuatro.
- A1/M10/N10/B2: etiquetas sociales ≥11 px, «usted», flechas internas → y alto contraste de íconos dentro de botones.
- N4: docking más compacto y ocultación durante la rejilla de familias.
- N8: URLs `#/tienda`, `#/living-design/pieza/*` y carrito se reemplazan por la colección si existe History API.
- B4/M12: precarga de fuentes y foto del héroe, favicon y metadatos iniciales Open Graph; el prototipo mantiene `noindex`.

## Trabajos aún abiertos
- Validación visual/axe-core/Lighthouse CI independiente antes de fusionar.
- Rutas reales, canonical y SEO público cuando exista dominio comercial y contenido aprobado.
- Relación producto/imagen/SKU, precios, inventario, fotos de proyectos, dirección, agenda y política de datos.
- Animaciones de P2: añadir solo si no afectan accesibilidad ni Core Web Vitals. No forzar Lenis/GSAP/WebGL sin presupuestos y ensayos.
- No publicar precios impresos en flyers históricos aunque aparezcan dentro de archivos originales.
