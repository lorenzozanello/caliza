# Prototipo navegable — Caliza

Prototipo en HTML, CSS y JavaScript para validar la experiencia antes del desarrollo final. Está pensado para trasladarse luego a un tema de Shopify (Liquid) o a un front propio sin cambiar el diseño.

## Páginas

| Archivo | Qué muestra |
| --- | --- |
| `index.html` | Home: hero, estudio, Stone · Design · Care, proyecto destacado, colección, historia, materiales, método, Care y contacto |
| `producto.html` | Ficha de producto con configurador (piedra, tamaño, base), precio animado, pago 50/50 y carrito lateral |
| `checkout.html` | Entrega con datos de acceso, plan de pago, métodos de pago y confirmación con seguimiento del pedido |

Para verlo, abre `index.html` en un navegador. Los datos del carrito viven en `localStorage` del navegador.

## Sistema

- **Retícula:** 12 columnas, margen lateral `--gutter`, separación `--col-gap`.
- **Espaciado vertical:** tres valores, `--s1`, `--s2`, `--s3`.
- **Titulares:** tres tamaños, `--t-display`, `--t-h2`, `--t-h3`.
- **Tipografía:** Instrument Serif (titulares) y Hanken Grotesk (texto e interfaz).
- **Movimiento:** GSAP + ScrollTrigger y Lenis (scroll suave), cargados desde CDN. Todo se desactiva con `prefers-reduced-motion`.

## Microinteracciones

- Entrada del hero (una vez por sesión) y parallax de la imagen.
- Manifiesto que se enciende palabra por palabra con el scroll.
- Paneles de Stone · Design · Care que se expanden y revelan su descripción.
- Proyecto destacado que se abre de marco a pantalla completa.
- Colección con desplazamiento horizontal y barra de progreso.
- Lista de materiales con imagen que sigue al cursor.
- Método con línea de progreso ligada al scroll.
- Cursor contextual ("Ver proyecto", "Configurar"), botones magnéticos y transición entre páginas.
- WhatsApp flotante que aparece después del hero y se oculta en la sección de contacto.

## WhatsApp y campañas

`assets/js/caliza.js` define `CONFIG.whatsapp` (número en formato internacional, sin `+`). Cada enlace de WhatsApp lleva un mensaje prellenado según el contexto (pieza, configuración, pedido) y agrega el origen de la visita tomado de `utm_source`, por ejemplo `index.html?utm_source=tiktok`.

## Pendiente

- Reemplazar las fotografías provisionales (recortes de baja resolución) por la sesión real.
- Nombres, precios, medidas y proyectos son de ejemplo.
- Conectar pasarela de pago, CRM y catálogo al elegir la plataforma.
