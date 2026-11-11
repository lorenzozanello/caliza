# CALIZA GROUP — experiencia de revisión Opción 08

El archivo principal es **`index.html`**. Esta experiencia reemplaza la antigua portada estática y el checkout de ejemplo con una navegación completa por `#/...`, compatible con un alojamiento de archivos estáticos. `producto.html` y `checkout.html` redirigen a la colección y la selección sin cobros.

## Rutas y funciones

| Ruta (`index.html#...`) | Funcionalidad |
| --- | --- |
| `/` | Portada editorial de tres marcas, destacados, materia y contacto |
| `/stone-design` | Propuesta y servicios Stone Design |
| `/stone-design/proyectos` y `/proyectos` | Galería conceptual |
| `/stone-design/brief` | Brief guiado de tres pasos; copia de resumen |
| `/living-design` | Storytelling y acceso a la colección |
| `/living-design/coleccion` | Catálogo de 16 nombres del prototipo histórico y filtros |
| `/living-design/pieza/{slug}` | Ficha orientativa y selector de materia/medida/cantidad |
| `/living-design/experiencia` | Tres modos de relacionamiento comercial |
| `/living-design/carrito` | Selección local de piezas, ajuste de cantidades y copia de solicitud |
| `/stone-care` | Servicios de cuidado y restauración |
| `/stone-care/diagnostico` | Guía de tres pasos y recomendaciones preventivas generales |
| `/materiales` | Biblioteca de referencias de piedra, separada de la paleta corporativa |
| `/grupo` | Narrativa y arquitectura de marca |
| `/inspiracion` | Visor local y opt-in de URLs públicas de Instagram y TikTok |
| `/contacto` | Preparación y copia de consulta, sin transmisión de datos |

## Políticas de revisión

- **No se procesan pagos ni pedidos**, ni se ofrecen importes o inventario ficticios. El carrito es una *selección para cotizar*; se guarda solo en `localStorage`.
- Los formularios guiados y el contacto no envían información a un servidor. Preparan texto para que el visitante lo copie cuando exista un canal comercial confirmado. No solicitar teléfonos, direcciones o PII en esta revisión.
- El visualizador admite hasta ocho enlaces públicos de post/reel de Instagram o videos de TikTok. Los iframes se cargan solo al pulsar **Visualizar**. No hay feed automático, OAuth ni acceso a cuentas sociales.
- Los productos y nombres provienen de una versión de prototipo y se **deben ratificar** en el catálogo maestro. Las fotos son imágenes conceptuales o de muestra, no pruebas de inventario o proyectos ejecutados.
- Los símbolos Opción 08 se mantienen como **aproximaciones vectoriales**, hasta que Caliza entregue los maestros oficiales. No considerarlos una reproducción final certificada del logotipo.
- Esta vista usa `noindex,nofollow` para evitar que los contenidos provisionales se indexen.

## Verificación local

```bash
python3 -m http.server 8765 --directory prototype
node prototype/tests/smoke.cjs
```

El smoke test comprueba 17 rutas, rutas de imágenes, flujo de selección y cantidades, formularios guiados, visor y ausencia del cobro de ejemplo. Conviene completar siempre una inspección visual real en móvil y escritorio antes de aprobar la salida a Production.

## Antes de activar comercio real

1. Archivos maestros SVG y fotografías aprobadas con derechos.
2. SKU, precios, impuestos, stock, plazos, transporte, políticas y contenidos legalmente aprobados.
3. Canal de contacto y perfiles sociales oficiales, confirmados por Caliza.
4. Backend Next.js/Payload con PostgreSQL persistente, almacenamiento, backups y administración segura.
5. Pasarela de pagos en sandbox, pruebas de idempotencia/webhooks e integración de pedidos, seguidas de una autorización separada de Production.

La aplicación Next.js/Payload en `web/` sigue siendo el destino de comercio conectado a datos. Este prototipo de revisión **no sustituye su backend ni lo declara listo para vender**.
