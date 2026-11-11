# Caliza

Sistema de marca y diseño de Caliza: espacios y piezas en piedra natural. Tres generaciones de marmoleros italianos; la tercera diseña en Colombia.

**Fuente rectora vinculante:** [authority/caliza-group-design-system/](authority/caliza-group-design-system/) y el [ZIP original intacto](authority/caliza-group-design-system.zip) suministrados por CALIZA. Su `MANUAL.md`, `AI_BRIEF.md`, `tokens/`, `logos/`, `simbolos/`, `fonts/` y componentes prevalecen sobre cualquier implementación anterior. La [guía de integración](identity/DESIGN_SYSTEM.md) explica las copias exactas y el test de fidelidad. Las normas de contenido de este archivo son subsidiarias cuando no entren en conflicto.

## Esencia

**Piedra con criterio.** Caliza no vende piedra por metro: la elige, la interpreta, la transforma y la cuida. El sitio debe sentirse como entrar a un estudio, no como recorrer un catálogo.

- **La piedra es la protagonista.** Madera, metal y texturas la acompañan, nunca la reemplazan.
- **Oficio antes que lujo.** El valor se demuestra con materia real, proceso y proyectos, no con adjetivos.
- **Tradición italiana, hecho en Colombia.** La herencia es de oficio. Nunca se sugiere que las piezas o las piedras vienen de Italia si no es así.

El método de Caliza ordena todo el contenido: **Seleccionar → Interpretar → Transformar → Cuidar.**

## Arquitectura de marca

| Nombre | Rol | Verbo |
| --- | --- | --- |
| **CALIZA GROUP** | Marca madre visible en cabecera, pie y comunicación institucional | Crear · Habitar · Preservar |
| **CALIZA STONE DESIGN** | Proyectos en piedra: cocinas, baños, pisos, muros, piscinas, fachadas | Crear |
| **CALIZA LIVING DESIGN** | Mobiliario y objetos donde la piedra es protagonista | Habitar |
| **CALIZA STONE CARE** | Mantenimiento, protección y restauración de superficies de piedra | Preservar |

- Las tres líneas comparten paleta y tipografía, pero **cada una tiene un símbolo geométrico distinto** documentado en el sistema de identidad.
- Los nombres de las líneas quedan en inglés. Todo lo demás en la interfaz va en español.
- **Leonardo Zanello** es la dirección creativa. Su firma aparece en piezas de autor numeradas y en la historia del estudio, no en el logo.

## Logo

Los maestros están en **`authority/caliza-group-design-system/logos/`** y **`simbolos/`**. El generador **copia** los SVG al directorio público y no vuelve a dibujar letras ni geometría. Los archivos antiguos `assets/Logos/lockup_*.svg` y los generados antes de este paquete se consideran históricos. Mantener las proporciones de cada `viewBox`, una zona de protección de **una altura de capital** y tamaños mínimos de **96 px para Group**, **72 px para divisiones**.

## Color

Dos temas rectores: **Limewash** de base y **Marine Ink** invertido. El color lo pone la materia en las fotos; la interfaz es contenida.

- Fondo: `piedra`. Superficies elevadas: `papel`. Bloques de acento: `arena`.
- Texto: `carbon`; secundario: `veta`. Sobre oscuro: `claro` y `claro-2`.
- `accent` Terracotta se utiliza en símbolos y filetes. El **botón primario es Marine Ink/Limewash** (invertido en tema oscuro); `accent-text` sustituye a Terracotta cuando un texto pequeño necesita contraste.
- `wa` es exclusivo de WhatsApp. Si un botón no abre WhatsApp, no es verde.
- `exito` y `error` solo comunican estado, siempre acompañados de texto.
- Nunca dos secciones oscuras seguidas. Nunca blanco puro de fondo.

## Tipografía

Dos familias, tres tamaños de titular.

- **Playfair Display** (`serif`) para titulares: `display` (uno por página), `titulo` (secciones), `subtitulo` (piezas, proyectos). Itálica solo para una frase dentro de un titular.
- **Montserrat** (`sans`) para todo lo demás: `cuerpo`, `pequeno`, `boton`, `etiqueta`.
- Ambas se sirven localmente desde los WOFF2 del kit rector. El repositorio incluye las licencias OFL suministradas.
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
- Los logotipos y las fuentes salen **exclusivamente** del kit rector inalterado. `node brand/identity/scripts/build-identity.mjs` sincroniza SVG/CSS/WOFF2 tanto al storefront Next.js como al prototipo estático. `node brand/identity/tests/identity.test.mjs` verifica SHA-256, igualdad binaria y generación determinista.
- Los estilos de componente están en `components/bundle.css` y solo usan esas variables.
- **No se introducen colores, tamaños de letra, espaciados, radios, sombras ni curvas de movimiento nuevos.** Si hace falta uno, se agrega primero a este sistema.

## Pendiente

- Vectores originales del logo.
- Confirmación de la tipografía definitiva.
- Fotografía real: las imágenes del grupo **Fotografía provisional** son recortes de baja resolución que solo marcan encuadre y tono.
