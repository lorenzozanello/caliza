# CALIZA GROUP · identidad aprobada (Opción 08)

**Estado:** referencia visual aprobada por el propietario el 11 de noviembre de 2026.
Este documento identifica la decisión editorial que gobierna la interfaz; no sustituye los archivos maestros de marca ni el catálogo comercial.

## Jerarquía y lenguaje

- Marca madre: **CALIZA GROUP**; tono: «Crear. Habitar. Preservar.»
- **CALIZA STONE DESIGN** — símbolo geométrico concéntrico; eje «Crear»; mensaje «Espacios que perduran».
- **CALIZA LIVING DESIGN** — arco; eje «Habitar»; mensaje «Piezas para habitar».
- **CALIZA STONE CARE** — estrella de cuatro puntas; eje «Preservar»; mensaje «Cuidar también es diseñar».
- Portada aprobada: «La materia toma forma.»; tres líneas en tarjetas fotográficas directamente debajo del hero; después productos destacados, materiales y llamada a iniciar proyecto.
- **Marine Ink** `#18343C`, **Terracotta** `#AE7256`, **Sand** `#CEB99B`, **Limewash** `#F2EADC`.
- Tipografía: **Playfair Display** para titulares y marca; **Montserrat** para interfaz y cuerpos.
- Arquitectura visual: fotografía cálida mediterránea, piedra natural porosa, sombras suaves, arcos, carpintería y vegetación; evita fondos oscuros dominantes y estética tecnológica.

## Activos y precisión

Los cinco montajes aportados por el propietario son **referencias de dirección de arte**, no archivos originales extraíbles de fotografía ni logos vectoriales. Los SVG `option08-*.svg` recrean de forma aproximada la geometría de las tres marcas y deben sustituirse por los vectores maestros una vez aprobados. Las imágenes `option08-*.webp` son **conceptuales generadas con IA**, sin pretensión de mostrar proyectos o productos realmente entregados.

Se prohíbe describir estas imágenes como fotografías de obras, inventario disponible o resultados de Caliza. En una publicación comercial sustituir por fotografías de producto autorizadas y ajustar los textos alternativos a la imagen final.

## Rutas implementadas

| Entorno | Entrada | Fuente |
| --- | --- | --- |
| Vercel de revisión (estático) | `prototype/index.html` | `prototype/assets/css/option08.css` y `prototype/assets/img/option08-*` |
| Tienda Next.js/Payload | `web/src/app/(site)/page.tsx` | `web/src/styles/option08.css` y `web/public/option08-*` |
| Componentes compartidos | Encabezado, pie, menú móvil | `web/src/components/SiteHeader.tsx`, `SiteFooter.tsx` |
| Tokens editables | `brand/tokens.json` | `node brand/scripts/build-tokens.mjs`, luego copiar a `web/src/styles/tokens.css` |

El catálogo y las fichas reales del entorno Next.js provienen de Payload tras su sincronización gobernada. La hoja de Google Drive sigue siendo el origen editorial autorizado para descripción, SKU, precios aprobados, inventario y fotos; **no existe en esta entrega actualización automática de Drive a Payload ni despliegue automático condicionado por revisión**.

## Condiciones antes de comercio real

1. Verificar que los logos SVG oficiales sustituyeron los bocetos y que las fotos tienen derechos comerciales.
2. Validar SKU, material, precio, IVA, variante, stock, peso, plazos y envíos con la hoja comercial aprobada; no usar cifras del prototipo.
3. Conectar teléfono WhatsApp real y correo comercial confirmado; mantener inactivos los contactos ficticios.
4. Configurar PostgreSQL persistente, almacenamiento multimedia, autenticación administrativa, backups y monitorización de la tienda.
5. Activar la pasarela elegida en **sandbox**, verificar webhooks firmados, idempotencia, antifraude, pagos parciales y conciliación; solo después pasar a producción por autorización explícita.
6. Completar términos, privacidad, retracto, devoluciones, garantía y políticas de entrega revisadas por Caliza.
7. Revisar QA móvil y escritorio, accesibilidad, SEO, imágenes y proceso real de compra. Solo entonces conectar `calizagroup.shop` a Production.

**Regla de publicación:** el branch de diseño se entrega para revisión en Pull Request; no fusionar a la rama productiva ni activar pagos, DNS o datos de clientes sin aprobación del propietario.
