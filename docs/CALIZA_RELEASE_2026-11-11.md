# CALIZA GROUP — cierre técnico de optimización UX, contenido y captación

**Fecha:** 11-11-2026. **Rama:** `feat/caliza-verified-channels-20261111`.

## Decisiones rectoras

1. **Identidad inmutable:** `brand/authority/caliza-group-design-system/` continúa como fuente de verdad de logotipos, símbolos, colores y fuentes. No se redibujaron marcas a mano. El test de integridad verifica 24 SVG y tipografías locales.
2. **Canales oficiales proporcionados por CALIZA:** WhatsApp `+57 302 598 3218` (`573025983218`), Instagram `@calizastonedesign`, TikTok `@calizastone`. Los valores heredados del CMS que no coincidan se sustituyen por el canal verificado.
3. **Contenido de Drive:** [Catálogo Maestro 2026](https://docs.google.com/spreadsheets/d/1ibSKxlHH2uPfRwxaiQcrocMWgkDX4qjvw-g/edit) y [contrato de publicación](https://docs.google.com/document/d/1D89kMSYa5knYQcPajH--8iq8FefPzZNW9vgLM1jxz_c/edit). La existencia de 178 archivos originales no acredita identidad de SKU, relación con proyectos, dimensiones, inventario, disponibilidad o derechos públicos. Al corte, `01_PRODUCTOS` y `07_PROYECTOS` no tienen registros aprobados y el control declara `listo_publicar=No`.
4. **Publicación segura:** el sitio Next/Payload presenta únicamente productos con `sourceProductId`, `status=publicado`, `publicationApproved`, `imageRightsConfirmed` y `isExample!=true`. Proyectos y materiales tienen aprobaciones equivalentes y vínculo de origen. Las fichas inventadas del prototipo anterior **no son catálogo público**.
5. **Redes:** la página `/inspiracion` y el prototipo muestran los perfiles oficiales. Un administrador selecciona enlaces individuales públicos en `Settings.socialPostLinks`; solo los aprobados se convierten en publicaciones y el iframe requiere clic explícito del visitante. El visitante no puede publicar enlaces propios en una galería que aparente ser oficial.

## Arquitectura implementada

| Área | Plataforma Next/Payload (`web/`) | Prototipo de revisión (`prototype/`) |
| --- | --- | --- |
| Marca | SVG oficiales, tokens y fuentes locales | Identidad fuente y correcciones de escala/accesibilidad |
| Navegación | `/stone`, `/design`, `/care`, `/proyectos`, `/materiales`, `/estudio`, `/inspiracion` | Rutas equivalentes con `#/` y alias `#/tienda` |
| Adquisición | WhatsApp contextual flotante con número confirmado | WhatsApp contextual flotante con UTM limitadas al texto voluntario |
| Living Design | Fichas CMS solamente si están aprobadas; estado vacío de asesoría | Cinco familias documentadas en Drive, sin SKU/precio/fotos atribuidas |
| Proyectos/materiales | Reglas de aprobación y derechos | Escenas conceptuales explícitas; ninguna obra simulada |
| Redes | Perfiles oficiales y embeds editoriales aprobados | Perfiles oficiales, enlaces editoriales mantenidos en código de revisión |
| Conversión | Formulario/checkout existente sujeto a configuración, legal y datos aprobados | Brief, diagnóstico y consulta locales; sin envío ni cobros |
| SEO | Redirecciones canónicas desde rutas de prototipo y sitemap filtrado | `noindex` deliberado para QA |

## Activación de fichas reales — gates obligatorios

Para cada producto: completar `01_PRODUCTOS`, `02_VARIANTES`, `04_PRECIOS`, `05_INVENTARIO`, `06_IMAGENES` y decisión individual en `10_CONTROL`; acreditar relación inequívoca foto→referencia, derechos confirmados, precio/plazo y condiciones. Para cada proyecto: completar `07_PROYECTOS`, validar ejecutor/autoría, fotos, permisos, descripción y créditos. Para materiales: crear registro de origen e imagen aprobada. Solo entonces migrar/sincronizar a Payload con identificadores estables y realizar prueba de preview. Las salidas de Drive **privado** no se comitean a GitHub público.

## Condiciones antes de promover a producción

- Aprobar el contrato, política de privacidad, términos comerciales, responsable de consultas y canal de recepción.
- Planificar migración de esquema Payload para los nuevos campos (el proyecto no incluye migraciones versionadas), con respaldo verificable. No ejecutar `seed` sobre bases existentes: contiene datos de demostración y no es un mecanismo de actualización segura.
- Obtener URL de Vercel vinculada a la cuenta/proyecto correcto, configurar base de datos y variables protegidas, revisar preview en móvil/escritorio y aprobar publicación.
- No habilitar pasarela ni analítica con datos personales sin autorización y pruebas independientes de cumplimiento.

## Pruebas reproducibles sin tocar datos reales

```sh
node brand/identity/tests/identity.test.mjs
node prototype/tests/smoke.cjs
cd web && npm run typecheck && npm run build
git diff --check
```

**Nota:** los test E2E históricos basados en los productos ficticios “Mesa Estrato”, “Consola Umbral” y pagos simulados requieren un fixture aislado y no se deben ejecutar contra una instancia comercial. No prueban la aprobación de los datos reales del catálogo maestro.
