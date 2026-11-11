# CALIZA GROUP — plan de activación QA y autorizaciones (11 de noviembre de 2026)

**Decisiones del propietario:** Instagram profesional; revisión de 7 fotos con pruebas de derechos; tienda futura con precios/pagos solo tras validación; dominio objetivo `calizagroup.shop`; contactos por WhatsApp + Google Sheets sujetos a privacidad y aprobación de datos; **sin gasto, credenciales nuevas, cambios de DNS ni Production**.

## 1. Situación real verificada en el Catálogo Maestro 2026
Fuente: `CALIZA — CATÁLOGO MAESTRO 2026`, pestañas `06_IMAGENES` y `10_CONTROL`.

| Medio | Fila en 06_IMAGENES | Uso editorial candidato | Derechos | Publicación web | Producto real / SKU | Alt aprobado |
| --- | ---: | --- | --- | --- | --- | --- |
| CAL-MED-0129 | 130 | Mesas de comedor con base de madera | Pendiente | Pendiente | Pendiente / sin SKU | Sin diligenciar |
| CAL-MED-0118 | 119 | Mesas auxiliares | Pendiente | Pendiente | Pendiente / sin SKU | Sin diligenciar |
| CAL-MED-0147 | 148 | Sillas de hogar | Pendiente | Pendiente | Pendiente / sin SKU | Sin diligenciar |
| CAL-MED-0137 | 138 | Sillas comerciales | Pendiente | Pendiente | Pendiente / sin SKU | Sin diligenciar |
| CAL-MED-0106 | 107 | Lavamanos | Pendiente | Pendiente | Pendiente / sin SKU | Sin diligenciar |
| CAL-MED-0001 | 2 | Cocinas / Stone Design (NO SKU de Living Design) | Pendiente | Pendiente | Pendiente / sin SKU | Sin diligenciar |
| CAL-MED-0066 | 67 | Cocinas / Stone Design (NO SKU de Living Design) | Pendiente | Pendiente | Pendiente / sin SKU | Sin diligenciar |

**Decisión de revisión** NO equivale a derecho de uso ni a aprobación comercial. Ningún estado se altera automáticamente y no se publican originales ni derivados en GitHub/Vercel. Los dos medios de cocina NO se reclasifican como SKU de mobiliario.

### Evidencia individual requerida antes de liberar
1. Identificar titular/autor y base jurídica del derecho de uso: titular propio, autorización escrita, licencia o contrato; documentar restricciones y vencimiento.
2. Comprobar terceros: personas reconocibles, marcas, arquitectura/interiores de otros autores y derechos de los proyectos.
3. Relacionar fotografía con familia, pieza, material o proyecto correcto, sin inferir autoría de la fotografía por su carpeta.
4. Aprobar un texto alternativo descriptivo, recorte y derivados WebP/AVIF sin rótulos de precio/autoría no verificados.
5. Registrar aprobación web individual en `06_IMAGENES` y, cuando aplique, resolver la fila de producto/proyecto y los gates de `10_CONTROL`.
6. Revisión independiente de medios y cambio de QA a público solo después de autorización de publicación separada.

## 2. Conectar Instagram @calizastonedesign
- La cuenta profesional está confirmada por el propietario; todavía no se ha acreditado control de una **aplicación Meta** ni dado acceso OAuth.
- Configuración técnica elegida: Instagram API with Instagram Login, permisos mínimos de lectura `instagram_business_basic`. No se solicita publicación, mensajería, anuncios ni edición.
- El propietario/admin crea o selecciona su aplicación en Meta for Developers y acepta el consentimiento OAuth desde la plataforma, no por chat. Revisar modo Development/Live y permisos para el uso previsto.
- **Después de aprobar la instalación del secreto**, configurar `CALIZA_INSTAGRAM_ACCESS_TOKEN` en Vercel **Preview únicamente**, fuera del repositorio. Mantener identificación de cuenta `calizastonedesign`, revisar caducidad y plan de renovación; no imprimir token en CI ni logs.
- El endpoint `/api/instagram-feed` devuelve 503 `not_connected` hasta que exista una conexión válida. El frontend solo pide el contenido tras clic y ofrece enlace alternativo.
- Pruebas pendientes con cuenta real: autorización Meta; nombre correcto; 1–9 publicaciones actuales; token inválido, cuenta ajena, expiración, CDN no disponible y accesibilidad.

## 3. TikTok @calizastone
Se usa el **Creator Profile Embed** oficial bajo clic voluntario. No se puede confirmar que esta cuenta admita incrustación únicamente por contar con URL. Verificar que es pública/no restringida, que TikTok acepte el embed en la URL de QA y que se muestre el reproductor en desktop y móvil; si falla, conservar enlaces oficiales. No usar scraping ni credenciales.

## 4. Dominio y SEO futuro
- Dominio objetivo: `https://calizagroup.shop`. No está verificada su titularidad ni su estado DNS; **no cambiar DNS, asociar Vercel, emitir certificados, desactivar `noindex` ni publicar sitemap público**.
- La vista `prototype/` mantiene `#/...`, `robots.txt` bloqueado y `X-Robots-Tag: noindex` en QA.
- La aplicación `web/` Next/Payload ya define rutas reales (`/stone`, `/design`, `/care` ...). Incorpora gates: el dominio exacto debe ser verificado y el propietario debe aprobar legal/publicación antes de habilitar indexación, sitemap o enlaces canónicos públicos.
- Previas a publicación: comprobar dominio/cuenta registradora, DNS, SSL, contenido, política/avisos, redirects, Search Console y revisión independiente. No inducir indexación de la preview.

## 5. Tienda futura con precios/pagos
- El checkout de Next/Payload se mantiene **cerrado por defecto**. Se exige dominio verificado, términos y políticas aprobadas, fichas de producto/stock/precios válidos y autorizaciones separadas de checkout y pasarela.
- La existencia del código Wompi o de productos de ejemplo no autoriza habilitar comercio. `PAYMENTS_PROVIDER=simulated` jamás debe habilitar cobros en Production.
- Antes de solicitar activación: fichas reales, variaciones, IVA, plazos, entregas y costos, políticas de retracto/garantías, protección de datos, proveedor de pagos, webhook e idempotencia auditados.
- Nada se configura en Wompi ni se hacen transacciones ahora.

## 6. WhatsApp + Google Sheets: preparación sin datos reales
- WhatsApp permanece como canal operativo para **mensajes revisados y enviados voluntariamente por el visitante** al número oficial `+57 302 598 3218`.
- El contrato de filas a Google Sheets se encuentra en `web/src/lib/leads/contract.ts`, con validación de finalidad, versión de política, campos limitados y neutralización de fórmulas.
- **No existe conexión activa, token, endpoint de recepción pública ni nuevas filas de clientes**. El contrato puro no guarda ni transmite información.
- Hoja futura dedicada y con acceso restringido (no el Catálogo Maestro): columnas `lead_id, created_at_utc, linea, familia, ruta_origen, nombre, telefono, correo, ciudad, mensaje, consentimiento_version, consentimiento_fecha_utc, estado`.
- Bloqueos previos al envío real: política de tratamiento aprobada, texto de aviso y casilla de consentimiento, finalidades, base jurídica, retención/eliminación, rol responsable, acceso restringido y controles de spam/rate-limit, idempotencia, validación server-side, protección de credenciales y test independiente.
- Los eventos actuales `caliza:intent` son locales; no enviar a GA4, Meta Pixel ni Google Sheets sin consentimiento/configuración.

## 7. Calidad y frontera de QA
- Al corte antes de estos cambios: GitHub Actions 43105828551: pruebas funcionales y 8 Playwright PASS; Lighthouse inicio Performance 0.80, accesibilidad 1.00, mejores prácticas 1.00; colección Performance 0.89, accesibilidad 0.98, mejores prácticas 1.00; CLS 0.019 en ambas.
- Últimos cambios de protección SEO/checkout/CRM se validan por CI nuevo. CI de QA no sustituye una auditoría independiente de Production.
- Publicar fuera de QA, fotos reales, credenciales, analítica y pagos: STOP hasta aprobación específica.

**Secuencia de activación futura:** validar cada autorización fotográfica → autorizar integración Meta y configurar secreto Preview → probar TikTok real → aprobar política de privacidad → hoja CRM aislada y pruebas con datos ficticios → validar titularidad de dominio y políticas comerciales → pruebas independientes → aprobación explícita antes de Production.
