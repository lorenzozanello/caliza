# CALIZA R7 · Auditoría externa del dominio e indexación
**Fecha:** 2026-11-12 (Colombia). **Ámbito:** https://www.calizagroup.shop/ y nueva rama QA R7.

## Evidencia HTTP de Production ANTES de R7
Obtenida por GitHub Actions mediante Playwright Chromium desde runner externo, sin credenciales ni escrituras:
- [Ejecución validada #43254795492](https://github.com/lorenzozanello/caliza/actions/runs/43254795492); artefacto **caliza-public-domain-qa** con captura desktop 1440×... y móvil 390px, y JSON de auditoría.
- **200 OK** en home. Título: «La materia toma forma. · CALIZA GROUP».
- Todas las primeras 12 imágenes de `#main` cargaron en ambas resoluciones; no hubo overflow horizontal.
- **HTTP X-Robots-Tag:** `noindex, nofollow, noarchive`.
- **Meta robots:** `noindex,nofollow`.
- **robots.txt:** HTTP 200 con `User-agent: * / Disallow: /`.
- **sitemap.xml:** HTTP 404.
- **canonical:** ausente.
- El hero real de Home corresponde al derivado `approved/kitchen-island-a-960.webp`. La sección Stone Care mostraba imagen de lavamanos con contexto de obra, visualmente discordante.

## Correcciones preparadas en PR R7 (NO activadas en Production)
1. `prototype/vercel.json`: noindex exclusivamente en hosts distintos de `www.calizagroup.shop`, además de cabeceras de seguridad globales. Las Preview continúan sin indexación (también Vercel las bloquea automáticamente).
2. `prototype/index.html`: canonical absoluta y meta index/follow para la eventual versión pública; conserva contenido de marca sin afirmaciones no verificadas.
3. `prototype/robots.txt`: permitir rastreo + declarar sitemap.
4. `prototype/sitemap.xml`: solo la URL canónica de Home; la navegación actual usa hash routes, por lo que **las secciones individuales no serán indexables como URLs independientes** hasta migrar a rutas normales.
5. Botón de CTA de héroes editoriales: contraste AA corregido en fondo claro.
6. Stone Care: sustituye la foto deficiente por el original CALIZA `IMG_1621.jpeg` (`caliza-r6-118`), no por imagen generativa.
7. Catálogo comercial: 27 referencias retenidas reprocesadas mediante recortes fieles a los píxeles originales, sin precios, con etiqueta de «detalle» cuando la pieza no se ve completa. 54 archivos WebP, manifiesto y hashes.

## Puntos de aceptación antes de publicar
- Revisar de forma independiente el contraste y aspecto del nuevo hero Stone Care y Home en Preview R7 a 390/1440px, y comprobar que el componente responde a los cambios de rama.
- Comprobar que los 27 nuevos recortes están libres de precios y rótulos a resolución completa; si alguno conserva texto o pierde demasiado producto, volver a HOLD solo ese recurso.
- Exigir PASS consultative-qa, visual-qa y la revisión de la configuración `vercel.json`.
- **No hacer merge automático de R7:** la activación de indexación pública es un cambio deliberado de visibilidad. Tras autorizar merge, verificar en vivo que el hostname principal ya no devuelve X-Robots noindex, que meta/robots/sitemap/canonical están coordinados y que Search Console identifica la URL sin bloqueo.
- No publicar un sitemap de rutas `#/...` como si fueran páginas web independientes.

**Alcance de evidencia:** las capturas existentes corresponden a Production previa a R7, no a las modificaciones en PR #20.
