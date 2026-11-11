# CALIZA GROUP — auditoría e integración del sistema rector

**Fecha:** 11 de noviembre de 2026  
**Alcance:** repositorio CALIZA, prototipo estático de Vercel y storefront Next.js.  
**Fuente:** ZIP `11512e921f109d12be1a7ba7a2a6ce5e1534dc91b23ddef588409137afa100e7` conservado en `brand/authority/`.  
**Método:** comparación del brief/tokens/SVG originales con el código heredado; cambios de integración; pruebas automatizadas. Los juicios sobre funcionalidad que dependen de terceros se indican como pendientes.

## Hallazgos y resolución

| ID | Severidad | Hallazgo | Acción | Estado |
| --- | --- | --- | --- | --- |
| M01 | P0 | Lockups anteriores reconstruidos con proporciones y trazos distintos al nuevo paquete rector; riesgo visible de deformación | Se sustituyen por SVG completos suministrados; la generación ya no redibuja letras ni curvas; se distribuyen copias exactas de los principales e inversos | **Corregido en código** |
| M02 | P0 | Proporciones HTML de Group `330×232` y submarcas `260×202` no coinciden con los maestros | Se usan `347.2×199` y `347.2×258.8` como proporciones CSS y tamaños de imagen concordantes | **Corregido en vistas revisadas** |
| M03 | P0 | Fuente de verdad anterior era un generador propio, sin custodia del nuevo ZIP | Se conserva ZIP original y extracción, con hashes y README jerárquico en Git | **Corregido en repositorio** |
| M04 | P0 | CTA terracotta con texto blanco heredado de Option08: contraste insuficiente | Adaptador semántico: primario Marine Ink/Limewash, 44 px, Montserrat 500/12; `accent-text` para texto pequeño | **Corregido en componentes con selector adaptado** |
| M05 | P1 | Identidad antigua usaba `0.5×` altura capital como área de respeto | Guía pública y documentación actualizadas a **1×**; mínimos 96/72 px | **Corregido en guías** |
| M06 | P1 | Carga de Google Fonts no corresponde a las fuentes locales del sistema rector | Se incluyen 8 WOFF2 con licencia desde el ZIP y se retira importación externa del prototipo, guía y layout Next | **Corregido en código** |
| M07 | P1 | Ausencia de tokens semánticos light/dark del brief rector | `authority-tokens.css` distribuido en ambas aplicaciones; importado después de CSS heredado | **Corregido a nivel de tokens** |
| M08 | P1 | Variante inversa omitida en algún pie oscuro | Footer estático/Next usan SVG inverso, sin invertir colores con filtros | **Corregido** |
| M09 | P1 | Iconos de líneas anteriores eran aproximados | Aliases web y prototipo ahora apuntan al símbolo original de cada línea | **Corregido** |
| M10 | P1 | Documento `marca.html` describía tamaños, fidelidad, y espaciado obsoletos | Guía pública explica originales recibidos, dimensiones, exclusión, contraste, temas y fuentes | **Corregido** |
| M11 | P1 | Tokens/variables antiguos aún aparecen en páginas anteriores y estilos no migrados | Importación rectora y adaptador reducen desvíos visibles; requiere evaluación por componente en flujo completo | **Mitigado; cierre pendiente** |
| M12 | P1 | UI Next.js usa React 19; el bundle del kit fue preparado para React 18 UMD | Se conservan componentes originales como referencia pero no se inyecta el UMD incompatible; CSS y activos se adaptan | **Decisión de compatibilidad documentada** |
| M13 | P2 | Imágenes del kit son referencias de dirección de arte de baja resolución | Se conservan; no se declaran fotografía comercial certificada | **Documentado** |
| M14 | P2 | SVG monocromos de divisiones no venían como fuentes separadas | Se generan mediante reemplazo de color de principal sin modificar curvas; **requiere validación para impresión** | **Provisional explícito** |
| M15 | P1 | En un viewport intermedio de 958 px, el header mantenía seis enlaces y CTA, con desbordamiento horizontal hasta 1201 px | El menú compacto se activa bajo 1320 px y el desplegable usa `surface`, `line` y la sombra flotante semántica | **Corregido en CSS; requiere revalidación tras despliegue** |
| M16 | P1 | Hero heredado con velo claro y texto oscuro, contrario a `scrim` Marine Ink y tipografía Limewash del brief | Adaptador fija velo degradado Marine, texto Limewash y CTA transparente de contorno Limewash sobre fotografía; ajusta etiquetas pequeñas a `accent-text` | **Corregido en CSS; requiere revalidación tras despliegue** |

## Funcionalidad existente, separada de la identidad

- **Prototipo estático:** la regresión automatizada verifica 17 rutas, selección de productos, asistentes de configuración, visor de publicaciones, archivos y ausencia de checkout simulado. No significa que publicaciones externas concretas puedan embeberse siempre (las plataformas imponen restricciones y consentimiento).
- **Tienda:** el prototipo ofrece selección para cotización y no cobra. El storefront Next.js tiene rutas de catálogo, productos, checkout, seguimiento y webhook, pero sus procesos comerciales **no se activaron ni modificaron** en esta integración de identidad. Validación con credenciales, stock real, pasarela, seguridad y operaciones requiere pruebas independientes y aprobación comercial.
- **Instagram y TikTok:** el prototipo permite pegar enlaces públicos válidos, elegir Visualizar y cargar iframe bajo interacción; la URL se valida y limita; resultados reales dependen de terceros. No es una integración API verificada ni un feed autónomo en producción.
- **Contenido:** los textos, productos, fotografías y datos comerciales que dependan del cliente siguen sujetos a revisión editorial y de derechos. La presente entrega no certifica contenido final de catálogo.

## Pruebas y criterios de aceptación

1. `node brand/identity/tests/identity.test.mjs`: ZIP SHA-256, igualdad binaria de principales e inversas, 24 variantes distribuidas, fuentes y tokens, generación determinista.
2. `node prototype/tests/smoke.cjs`: cobertura funcional de 17 rutas del prototipo.
3. `npm run typecheck` en `web/`: comprobación TypeScript sin errores.
4. `git diff --check`: integridad básica del parche.
5. Antes de declarar identidad en Vercel: revisar visualmente escritorio y móvil, al menos cabecera, grupo, tres submarcas, guía, CTA y footer; confirmar que SVG y WOFF2 responden 200 y que botón primaria usa `#18343c/#f2eadc`.

## Pendientes verificables (sin atribuir una certificación inexistente)

1. **QA visual por viewport:** comparar directamente cada página de Next y las 17 rutas del prototipo en móvil, tablet y escritorio; ajustar componentes que sobrescriban el adaptador, sobre todo hero, tarjetas, formularios y opciones de navegación.
2. **Auditoría de contraste AA por estado:** tema light/dark, hover, foco, error y elementos que todavía usan colores legacy en `site.css`, `option08.css`, `experience.css`.
3. **Conversión completa de componentes:** migrar `ImageCard`, `ArchFrame`, `SectionTitle` y acciones secundarias a tokens del kit, evitando inyectar el bundle React 18 en Next 16/React 19.
4. **Prueba E2E de comercio de producción:** catálogo real, disponibilidad, confirmaciones, cancelaciones, pasarela, estados y webhooks. Requiere entorno/credenciales autorizados y no se simulará como compra válida.
5. **Prueba de redes:** permisos, políticas de embedding, cookies, controles de privacidad, manejo de publicación borrada y actividad real de Instagram/TikTok.
6. **Validación del propietario:** recibir si existen los originales AI/EPS/SVG del diseñador para cotejo geométrico final; confirmar arte comercial definitivo, fotografía autorizada y copy.

**Dictamen:** integración del **sistema de marca como autoridad técnica y repositorio histórico reproducible: PASS en pruebas de código**. **Certificación integral de UI y operación comercial: NO DECLARADA** hasta completar las comprobaciones visuales y pruebas externas pendientes. No se han iniciado cobros, cambios de datos comerciales ni acciones en pasarela.
