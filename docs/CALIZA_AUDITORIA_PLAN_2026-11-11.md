# CALIZA — matriz de implementación del plan de auditoría (11-11-2026)

## Alcance
Rama de revisión: `feat/caliza-verified-channels-20261111`, PR #16. No se fusiona, no se habilita checkout/pagos y no se publica inventario ficticio.

| Bloque | Resultado | Evidencia o límite |
|---|---|---|
| P0.1 Colecciones y fotos | Implementación segura | Cinco familias, imágenes comerciales pendientes con `data-pendiente`; no se usan imágenes generadas como fotos de catálogo. |
| P0.2 Mi selección | Implementado en modo familias | Carrito sin datos desactivado; enlaces antiguos llegan a colecciones. |
| P0.3 CTA móvil | Implementado en CSS | Ancho máximo, texto que envuelve y botones mínimos de 44 px; requiere captura E2E. |
| P0.4 Título | Implementado | Mapa de título por rutas principales. |
| P0.5 Texto | Regla estática | Cero `font-size: 7–10px` en las tres hojas auditadas; falta contrastar estilos computados. |
| P0.6 Voz | Ajuste | Se corrigieron principales textos de tuteo; requiere última revisión editorial. |
| P1 sistema | Parcial técnico | Colores centralizados en `authority-tokens.css`, cero hex en otras tres hojas, tracking negativo eliminado, menú SVG con foco inicial y Escape, materiales sin paleta corporativa. |
| P1 visor social | Listo para aprobar contenido | Se oculta en portada si hay menos de tres publicaciones editoriales aprobadas. |
| P1 flotante | Implementación progresiva | WhatsApp verificado; IntersectionObserver oculta dock al ver héroe/pie en escritorio y conserva barra en móvil. |
| P2 movimiento | No activado | GSAP, Lenis, video y WebGL requieren línea base de rendimiento, recursos y QA de movimiento reducido. |
| P3 imágenes, SEO y rutas | Pendiente | Requiere originales, medidas, dominio canónico y migración controlada; QA mantiene noindex. |
| P4 | Bloqueado por contenido o autorización | Citas, muestras, formularios reales, 3D, proyectos, inglés y ecommerce no pueden simular disponibilidad ni recolectar datos sin aprobación. |

## Verificaciones alcanzadas
- Simulador determinista de 17 rutas: se comprobó presencia de H1, 5 familias, dos familias bajo filtro Sillas, placeholders de fotografía, WhatsApp, ausencia de paleta de marca y cierre de menú con Escape: **PASS**.
- Sintaxis JavaScript: **PASS**.
- CSS: llaves equilibradas, sin colores hexadecimales en las tres hojas de interfaz, sin tracking negativo y sin fuente declarada de 7–10 px: **PASS estático**.
- Vercel vía estado reportado en GitHub: **success** en el commit de reparación de CSS `24204a6`.
- **No acreditado:** Playwright con capturas, axe-core, Lighthouse CI y métricas de campo p75. No se infieren como exitosos.

## Condiciones de salida de QA
Revisar en navegador real a los anchos definidos, ejecutar axe y Lighthouse, validar controles y contrastes computados, aprobar contenidos comerciales y efectuar revisión independiente. Solo entonces decidir si promover la rama y planificar la migración del CMS.
