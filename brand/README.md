# Caliza

Sistema de marca y diseño de Caliza: espacios y piezas en piedra natural. Tres generaciones de marmoleros italianos; la tercera diseña en Colombia.

Este documento es la fuente de verdad para el sitio web, las campañas y cualquier pieza digital. Quien construya algo para Caliza, persona o agente, usa solo lo que está aquí: tokens, componentes y reglas. Si algo falta, se agrega aquí primero.

## Esencia

**Piedra con criterio.** Caliza no vende piedra por metro: la elige, la interpreta, la transforma y la cuida. El sitio debe sentirse como entrar a un estudio, no como recorrer un catálogo.

- **La piedra es la protagonista.** Madera, metal y texturas la acompañan, nunca la reemplazan.
- **Oficio antes que lujo.** El valor se demuestra con materia real, proceso y proyectos, no con adjetivos.
- **Tradición italiana, hecho en Colombia.** La herencia es de oficio. Nunca se sugiere que las piezas o las piedras vienen de Italia si no es así.

El método de Caliza ordena todo el contenido: **Seleccionar → Interpretar → Transformar → Cuidar.**

## Arquitectura de marca

| Nombre | Rol | Verbo |
| --- | --- | --- |
| **CALIZA** | Marca visible en todos los canales | — |
| Caliza Stone | Proyectos en piedra: cocinas, baños, pisos, muros, piscinas, fachadas | Transformar el espacio |
| Caliza Design | Mobiliario y objetos donde la piedra es protagonista | Habitar el espacio |
| Caliza Care | Mantenimiento, protección y restauración de superficies de piedra | Preservar el espacio |
| Caliza Group | Razón social. Solo en el pie de página y documentos legales | — |

- Stone, Design y Care comparten un solo sistema visual. No tienen colores propios; se distinguen por la fotografía y el contenido.
- Los nombres de las líneas quedan en inglés. Todo lo demás en la interfaz va en español.
- **Leonardo Zanello** es la dirección creativa. Su firma aparece en piezas de autor numeradas y en la historia del estudio, no en el logo.

## Logo

Grupo **Logos**. El logo no se modifica.

- `lockup_dark.svg` sobre fondos claros (`piedra`, `papel`, `arena`); `lockup_light.svg` sobre `carbon` y sobre fotografía oscura.
- El símbolo solo (`symbol_*.svg`) se usa como firma pequeña: favicon, sello del manifiesto, cierre de la página.
- La firma "by Leonardo Zanello" es opcional y va bajo el nombre solo en piezas institucionales.
- Altura mínima del logo horizontal en pantalla: 22px. Espacio libre alrededor: la altura de la "C" del símbolo.
- No se estira, no se rota, no se recolorea fuera de `carbon` y `claro`, no se le agregan sombras ni contornos.

Los archivos actuales se vectorizaron desde el manual en PDF. Hay que reemplazarlos por los vectores originales cuando estén disponibles.

## Color

Un solo tema, **Piedra**, con secciones oscuras en `carbon`. El color lo pone la materia en las fotos; la interfaz es contenida.

- Fondo: `piedra`. Superficies elevadas: `papel`. Bloques de acento: `arena`.
- Texto: `carbon`; secundario: `veta`. Sobre oscuro: `claro` y `claro-2`.
- `acento` es el único acento y solo vive sobre `carbon`.
- `wa` es exclusivo de WhatsApp. Si un botón no abre WhatsApp, no es verde.
- `exito` y `error` solo comunican estado, siempre acompañados de texto.
- Nunca dos secciones oscuras seguidas. Nunca blanco puro de fondo.

## Tipografía

Dos familias, tres tamaños de titular.

- **Instrument Serif** (`serif`) para titulares: `display` (uno por página), `titulo` (secciones), `subtitulo` (piezas, proyectos). Itálica solo para una frase dentro de un titular.
- **Hanken Grotesk** (`sans`) para todo lo demás: `cuerpo`, `pequeno`, `boton`, `etiqueta`.
- Ambas se cargan desde Google Fonts. Si Caliza elige una tipografía de pago, se reemplaza aquí y se licencia para web.
- Titulares en tipo oración ("Piezas para habitar."), nunca en mayúsculas. Las mayúsculas solo en `etiqueta`, una por bloque.
- Los números que se comparan (precios, medidas) van con `font-variant-numeric: tabular-nums`.

## Retícula y espaciado

- **12 columnas** en escritorio, una sola columna bajo 900px. Margen lateral `gutter` (56px → 20px), separación `space-6`.
- **Tres espaciados verticales** entre secciones: `section-s1`, `section-s2`, `section-s3`. Ningún otro.
- Las secciones no tienen altura fija: el contenido define su alto.
- Dos momentos a pantalla completa por página como máximo (el hero y un proyecto).

## Forma

- Cantos rectos (`radius-none`) en todo, como una placa cortada.
- Redondeo solo en chips (`radius-pill`) y en el botón de WhatsApp y los puntos de seguimiento (`radius-circle`).
- Sin sombras, salvo `shadow-float` en WhatsApp. La profundidad viene de la fotografía, el espacio y las líneas `linea`.

## Componentes

Todos viven en `components/bundle.css` y se documentan uno por uno. Grupos:

- **Acciones:** Button, Link, Chip.
- **Navegación:** Header, WhatsAppFloat.
- **Comercio:** ProductCard, Badge, VariantSelector, PaymentChoice, OrderTracking.
- **Contenido:** LinePanel, MaterialRow.
- **Formularios:** Field.

Regla de acciones: **un solo botón primario por pantalla visible**. Lo demás es secundario (`btn--ghost`) o enlace (`link`).

## Uso en código

- Los tokens salen de `tokens.json`. En el repositorio, `node brand/scripts/build-tokens.mjs` genera `brand/tokens.css` con una variable CSS por token (`--piedra`, `--space-6`, `--font-serif`).
- Los estilos de componente están en `components/bundle.css` y solo usan esas variables.
- **No se introducen colores, tamaños de letra, espaciados, radios, sombras ni curvas de movimiento nuevos.** Si hace falta uno, se agrega primero a este sistema.

## Pendiente

- Vectores originales del logo.
- Confirmación de la tipografía definitiva.
- Fotografía real: las imágenes del grupo **Fotografía provisional** son recortes de baja resolución que solo marcan encuadre y tono.
