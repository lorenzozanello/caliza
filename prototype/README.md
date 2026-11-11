# CALIZA GROUP · Versión 1 consultiva (QA)

**Fuente publicada en Vercel Preview:** esta carpeta `prototype/`, no la aplicación Next.js experimental de `web/`.

## Versión vigente

- **Portada**: Stone Design, Living Design, Stone Care; navegación al brief, catálogo y diagnóstico.
- **Living Design**: cinco familias reales de `11_CATEGORIAS_FUENTE`. Sus páginas `#/living-design/familia/<slug>` son consultivas, con agrupaciones, preguntas y mensajes preparados para WhatsApp.
- **Stone Design y proyectos**: orientación y ámbitos documentados por el archivo, **sin atribuir a CALIZA obras o proyectos que todavía no figuren verificados**.
- **Materiales**: biblioteca editorial visual. Sin declaración de inventario de piedra.
- **Stone Care**: orientador preliminar, no diagnóstico profesional.
- **Contacto**: prepara el mensaje localmente; el visitante decide si lo comparte por WhatsApp.
- **Social**: enlaces oficiales a Instagram `@calizastonedesign` y TikTok `@calizastone`. TikTok incorpora la tarjeta de creador bajo acción voluntaria. Instagram dispone de un módulo que consulta `/api/instagram-feed` únicamente después de pulsar el botón.
- **El botón flotante de WhatsApp** se muestra en verde y en móvil como círculo; se oculta cerca del pie de página.

## Instagram — conexión segura pendiente

El código `api/instagram-feed.js` consulta medios propios por Instagram API with Instagram Login y valida la cuenta `calizastonedesign`. La API devuelve solo hasta nueve imágenes/enlaces y nunca el token. Se sirve con caché de CDN breve.

**La cuenta profesional debe completar OAuth en Meta, con el permiso `instagram_business_basic`.** Su responsable debe configurar `CALIZA_INSTAGRAM_ACCESS_TOKEN` como secreto de Vercel limitado a Preview, sin compartirlo por chat, GitHub ni navegador. `CALIZA_IG_API_VERSION` permite fijar la versión de Graph API. El token debe renovarse o rotarse conforme a su vencimiento. Hasta entonces el sitio muestra el perfil oficial, no publicaciones ficticias.

Se validó el código en pruebas deterministas, **no se ha comprobado que la cuenta específica esté habilitada en Instagram ni que TikTok acepte su inserción desde todas las redes**.

## Integración de fotografías y catálogo

El Catálogo Maestro 2026 se encuentra en Google Drive. `06_IMAGENES` tiene **cero imágenes con derechos y aprobación web confirmados**, y `10_CONTROL` bloquea las familias. Los originales y los recortes reales viven en paquete privado de revisión. No se incluyen imágenes privadas en GitHub ni en Vercel hasta aprobación individual. No hay precios, productos, stock ni proyectos individuales suficientes para vender.

El generador `../web/scripts/prepare-approved-caliza-media.mjs` acepta exclusivamente medios con validación expresa y genera WebP/AVIF por familia. No ejecutar con fuentes no aprobadas.

## Calidad

```bash
node prototype/tests/smoke.cjs
node prototype/tests/instagram-api.cjs
# GitHub Actions: .github/workflows/prototype-qa.yml
# Navegador real Chromium + axe, ejecutado con npm ci en web/
```

Todos los despliegues QA están expresamente excluidos de motores de búsqueda (`noindex`, `robots.txt`, `X-Robots-Tag`). No convertir la vista actual a sitio público indexable hasta definir dominio, políticas legales y contenido final.

## Eventos comerciales

Se emite `caliza:intent` con **tipo y ruta solamente** para los siguientes eventos: `whatsapp_handoff`, `contact_ready`, `family_inquiry_ready`, `brief_ready`, `diagnosis_ready`. **No se envían estos eventos a ningún proveedor ni se guarda PII**. Requiere aprobación de consentimiento y analítica antes de activar recopilación real.

## Prohibiciones de publicación

- No desplegar la aplicación `web/` (contiene datos de ejemplo, checkout y pagos simulados) como tienda pública.
- No habilitar pagos, precios, inventario, carga de datos reales ni recopilar información personal hasta aprobación de negocio, seguridad, legales y QA.
- No fusionar ni promover el PR por el resultado de una única prueba técnica: se necesita revisión independiente, editorial y aprobación de la persona propietaria.

## Decisiones registradas en QA — 11 de noviembre de 2026

- **Dominio futuro:** `calizagroup.shop`. No se ha verificado titularidad ni alterado DNS, Vercel Domains, SSL o indexación pública.
- **Instagram:** confirmado como cuenta profesional por el propietario; falta autorización OAuth real de Meta y conexión segura en Vercel Preview. No hay token instalado.
- **TikTok:** visor de creador disponible bajo clic. La disponibilidad efectiva del embed de @calizastone requiere verificación en navegador con el proveedor; no se simula un feed.
- **Fotografía:** siete medios CAL-MED-0129, 0118, 0147, 0137, 0106, 0001 y 0066 en **revisión condicionada**; derechos, aprobación web, relación comercial y alt siguen pendientes en el catálogo. No se publican fotos privadas.
- **Tienda futura:** `web/src/lib/launch-gates.ts` exige aprobación de dominio, legal, publicación, productos, checkout y pasarela; por defecto indexación y comercio están cerrados.
- **Contactos:** WhatsApp voluntario activo. `web/src/lib/leads/contract.ts` prepara filas para un Google Sheet separado, pero no existe endpoint de envío ni almacenamiento real. La política de privacidad está en borrador y necesita validación.
- **Evidencia:** pruebas de seguridad de gates y contratos en GitHub Actions; al corte previo, Lighthouse de QA 0.80 inicio y 0.89 catálogo, con CLS 0.019. El resultado de las últimas pruebas debe verificarse en el run asociado al commit actual.

Más información de decisiones y fotos: `docs/CALIZA_QA_ACTIVACION_AUTORIZACIONES_2026-11-11.md`; borrador no publicable: `docs/CALIZA_BORRADOR_PRIVACIDAD_NO_PUBLICAR.md`.
