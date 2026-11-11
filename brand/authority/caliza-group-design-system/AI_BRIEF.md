# CALIZA GROUP — Sistema de diseño (brief para IA)

Este archivo es la referencia completa y autosuficiente del sistema de diseño de CALIZA GROUP. Si solo puedes leer un archivo, lee este. Todos los valores son exactos: úsalos tal cual, no los aproximes ni los "mejores".

**Paquete**: `MANUAL.md` (manual de marca completo) · `tokens/tokens.json` (fuente de verdad) · `tokens/tokens.css` (variables CSS + @font-face + clases de texto) · `tokens/tailwind.preset.js` · `fonts/` (woff2, licencia OFL) · `logos/` y `simbolos/` (SVG) · `imagen/` (referencias de dirección de arte, baja resolución) · `referencia/manual-de-marca.jpg` (manual original) · `components/` (React 18: `bundle.js` expone `window.Caliza`, `bundle.css`, `index.d.ts`, una guía `.md` por componente).

## Reglas no negociables

1. Usa solo los cuatro colores de marca y los tokens derivados de abajo. Nada de degradados decorativos, azules, morados ni colores saturados.
2. Titulares, logotipo y rótulos de sección en **Playfair Display 400**. Texto, botones, navegación y etiquetas en **Montserrat**. Nunca al revés; nunca otra fuente (no Inter, no Roboto).
3. Rótulos cortos (1–3 palabras) en MAYÚSCULAS con tracking amplio (0.16–0.22em). Titulares en sentence case con punto final: "Espacios que perduran."
4. Esquinas rectas en todo (fotos, tarjetas, botones). La única curva permitida es el arco de medio punto en la parte superior de un marco de imagen.
5. Separa con filetes finos de 1px, no con cajas, sombras ni tarjetas con borde de color a la izquierda.
6. Terracotta (#AE7256) NO es color de texto pequeño (3.3:1). Para texto en tono terracotta usa `accent-text`. El botón principal es Marine Ink con texto Limewash.
7. Mucho espacio en blanco (limewash). Composición centrada o en columnas iguales.
8. Sin emoji, sin exclamaciones, sin superlativos vacíos.
9. No redibujes el logotipo con texto en otra fuente: usa los SVG de `logos/` o el componente `Wordmark`.

## Arquitectura de marca

| Marca | Símbolo | Promesa | Uso |
| --- | --- | --- | --- |
| CALIZA GROUP | — (solo logotipo) | Piedra natural, diseño, vida contemporánea | Corporativo, plataforma digital |
| CALIZA Stone Design | Arcos concéntricos | Piedra que transforma espacios | Superficies, lavamanos, encimeras, proyectos |
| CALIZA Living Design | Arco | Diseño que habita la vida | Mobiliario y objetos |
| CALIZA Stone Care | Estrella de 4 puntas | Cuidado que prolonga la belleza | Mantenimiento y restauración de piedra |

Lema: **Materia · Espacios · Personas — Colombia al mundo.**

## Color

Dos temas: `light` = **Limewash** (principal) y `dark` = **Marine** (versión inversa). Actívalos con `data-theme="light|dark"` en `<html>`; el primero es el valor por defecto en `:root`.

| Token | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| `--marine-ink` | `#18343c` | `#18343c` | Marine Ink — color primario de marca: sofisticación, confianza, profundidad. Texto del logotipo y fondo de la versión inversa. |
| `--terracotta` | `#ae7256` | `#ae7256` | Terracotta — tierra, calidez, artesanía. Símbolos de submarca, filete bajo el logotipo y acentos gráficos. Como texto solo a 24px o más (3.3:1 sobre limewash). |
| `--sand` | `#ceb99b` | `#ceb99b` | Sand — naturaleza, equilibrio, atemporalidad. Bloques de color, fondos de piezas impresas y texto claro sobre marine-ink (6.9:1). |
| `--limewash` | `#f2eadc` | `#f2eadc` | Limewash — luz, pureza, espacios. Fondo principal y texto de la versión inversa sobre marine-ink (11:1). |
| `--surface` | `#f2eadc` (= `limewash`) | `#18343c` | Fondo de página. Limewash en el tema claro; marine-ink en la versión inversa. |
| `--surface-raised` | `#f8f3ea` | `#1f414a` | Tarjetas, menús y paneles sobre surface. |
| `--surface-sand` | `#e9dcc7` | `#122a31` | Bandas de pie de foto, bloques de información y franjas que separan secciones. |
| `--line` | `#d8c8b0` | `#3a5961` | Filetes finos decorativos entre columnas y secciones (no llevan significado). |
| `--line-strong` | `#8c7f6c` | `#7d9196` | Bordes de campos y controles; ≥3:1 sobre surface y surface-raised en ambos temas. |
| `--ink` | `#18343c` (= `marine-ink`) | `#f2eadc` | Texto principal y títulos, sobre surface, surface-raised y surface-sand (≥9:1 en ambos temas). |
| `--ink-muted` | `#5f5a52` | `#c8b9a2` | Texto secundario, pies de foto y metadatos, sobre surface, surface-raised y surface-sand (≥4.5:1 en ambos temas). |
| `--accent` | `#ae7256` (= `terracotta`) | `#ae7256` | Acento gráfico: símbolos, filetes de marca, íconos. Marca de 3:1 sobre surface en ambos temas; nunca para texto menor a 24px. |
| `--accent-text` | `#85513b` | `#d49a7e` | Terracotta legible para texto pequeño (enlaces, cifras destacadas) sobre surface, surface-raised y surface-sand (≥4.5:1). |
| `--primary` | `#18343c` (= `marine-ink`) | `#f2eadc` | Relleno del botón principal y de bloques de máximo contraste. |
| `--on-primary` | `#f2eadc` (= `limewash`) | `#18343c` | Texto e íconos sobre un relleno primary (11:1). |
| `--focus` | `#18343c` (= `marine-ink`) | `#f2eadc` | Anillo de foco de teclado: 2px sólido con 2px de separación; ≥9:1 sobre todas las superficies. |
| `--rule` | `#ae7256` (= `terracotta`) | `#ae7256` | Filete corto bajo el logotipo y bajo los titulares de portada. |
| `--scrim` | `rgba(24, 52, 60, 0.65)` | `rgba(24, 52, 60, 0.65)` | Velo marine-ink sobre fotografía detrás de texto limewash (Hero); se desvanece hacia la derecha. |

Pares verificados (WCAG): `ink` sobre `surface` 11:1 · `ink-muted` sobre `surface` 5.7:1 (claro) / 6.8:1 (oscuro) · `accent-text` sobre `surface` 5.4:1 / 5.5:1 · `on-primary` sobre `primary` 11:1 · `terracotta` sobre `limewash` o `marine-ink` ≈3.3:1 (solo marcas gráficas o texto ≥24px).

## Tipografía

Familias: `--font-serif` = `"Playfair Display", Georgia, "Times New Roman", serif` · `--font-sans` = `Montserrat, "Helvetica Neue", Arial, sans-serif`. Pesos incluidos: Playfair 400, 400 itálica, 500, 600 · Montserrat 300, 400, 500, 600. Cada estilo existe como clase CSS en `tokens.css` (`.headline`, `.body`, …).

| Estilo | Familia | Tamaño / interlineado | Peso | Tracking | Ejemplo | Uso |
| --- | --- | --- | --- | --- | --- | --- |
| `display` | Playfair Display | 72px / 0.95 | 400 | 0.01em | CALIZA GROUP | Logotipo tipográfico y portadas. Siempre en mayúsculas. |
| `headline` | Playfair Display | 44px / 1.1 | 400 | 0 | Espacios que perduran. | Titular de héroe y de campaña. Frase corta, sentence case, con punto final. |
| `title` | Playfair Display | 30px / 1.2 | 400 | 0 | Piedra que transforma espacios | Títulos de página y de proyecto. |
| `subtitle` | Playfair Display | 21px / 1.35 | 400 | 0 | Materia, espacios, personas | Subtítulos y entradillas. |
| `section` | Playfair Display | 15px / 20px | 400 | 0.2em | ARQUITECTURA | Rótulo de sección en MAYÚSCULAS, seguido de un filete line (componente SectionTitle). |
| `quote` | Playfair Display itálica | 21px / 1.4 | 400 | 0 | La piedra recuerda el tiempo que la formó. | Citas y testimonios, en cursiva. |
| `lead` | Montserrat | 17px / 28px | 300 | 0 | Fusionamos la materia, el diseño y el bienestar. | Párrafos de introducción. |
| `body` | Montserrat | 15px / 24px | 400 | 0 | Espacios atemporales que honran la naturaleza y la arquitectura colombiana. | Texto corrido. |
| `descriptor` | Montserrat | 13px / 18px | 400 | 0.22em | STONE DESIGN | Descriptor de submarca, navegación y botones, en MAYÚSCULAS. |
| `label` | Montserrat | 11px / 16px | 500 | 0.16em | VERSIÓN PRINCIPAL | Etiquetas de pie de imagen y metadatos, en MAYÚSCULAS. |
| `caption` | Montserrat | 12px / 18px | 400 | 0 | Presentación de productos y muestras. | Pies de foto y notas, en ink-muted. |

## Espaciado, radios, filetes y sombra

| Token | Valor | Uso |
| --- | --- | --- |
| `--space-1` | `4px` | Ajustes finos entre rótulo y texto. |
| `--space-2` | `8px` | Separación entre símbolo y nombre en elementos pequeños. |
| `--space-3` | `12px` | Separación entre título y descriptor. |
| `--space-4` | `16px` | Relleno interno de bandas de pie de foto. |
| `--space-5` | `24px` | Relleno de tarjetas y espacio entre columnas. |
| `--space-6` | `32px` | Separación entre bloques dentro de una sección. |
| `--space-7` | `48px` | Margen de página en escritorio. |
| `--space-8` | `64px` | Separación entre secciones. |
| `--space-9` | `96px` | Respiración de portadas y héroes. |
| `--radius-none` | `0` | Por defecto: fotografías, tarjetas, botones y bandas son de esquina recta, como un bloque de piedra cortado. |
| `--radius-xs` | `2px` | Solo campos de formulario y etiquetas físicas. |
| `--radius-arch` | `999px` | Esquinas superiores de marcos en arco (ArchFrame), eco del símbolo Living Design. Nunca en las cuatro esquinas. |
| `--radius-round` | `50%` | Muestras circulares de color y discos. |
| `--hairline` | `1px` | Filetes line entre columnas y bajo rótulos de sección. |
| `--rule-weight` | `2px` | Grosor del filete terracotta bajo el logotipo y titulares. |
| `--shadow-float` | claro `0 12px 32px rgba(24, 52, 60, 0.12)` · oscuro `0 12px 32px rgba(0, 0, 0, 0.35)` | Solo menús y diálogos que flotan sobre el contenido. |

## Logotipo

- `logos/caliza-group.svg` — principal (marine-ink + filete terracotta) sobre fondos claros.
- `logos/caliza-group-inversa.svg` — limewash + filete terracotta, sobre marine-ink o foto oscura.
- `logos/caliza-group-monocroma.svg` — una tinta, marine-ink.
- `logos/caliza-{stone-design|living-design|stone-care}.svg` (+ `-inversa`) — lockups de submarca: símbolo terracotta sobre "CALIZA" (Playfair) y descriptor (Montserrat, mayúsculas, tracking 0.2em).
- Área de respeto: la altura de la mayúscula de CALIZA en todo el contorno. Tamaño mínimo recomendado: 96px de ancho (grupo), 72px (submarca); por debajo, solo el símbolo.
- Prohibido: deformar, cambiar la fuente, añadir sombras o contornos, cambiar el color del filete (salvo monocroma), poner el logo sobre terracotta o fotos claras sin velo.

## Símbolos (geometría exacta, SVG, `fill="currentColor"`)

```svg
<!-- Stone Design --><svg viewBox="-84 -60 124 144"><path d="M0 0 L0 40 A40 40 0 1 1 40 0 Z"/><path d="M0 -60 A60 60 0 0 0 0 60 L0 50 A50 50 0 0 1 0 -50 Z"/><path d="M-84 0 A84 84 0 0 0 0 84 L0 74 A74 74 0 0 1 -74 0 Z"/></svg>
<!-- Living Design --><svg viewBox="0 0 92 116"><path d="M0 116 L0 46 A46 46 0 0 1 92 46 L92 116 L72 116 L72 46 A26 26 0 0 0 20 46 L20 116 Z"/></svg>
<!-- Stone Care --><svg viewBox="-100 -100 200 200"><path d="M0 -100 Q20 -20 100 0 Q20 20 0 100 Q-20 20 -100 0 Q-20 -20 0 -100 Z"/></svg>
```

Color: terracotta sobre limewash, sand o marine-ink; limewash sobre terracotta o fotografía. Un solo símbolo por pieza (salvo al presentar el ecosistema: Stone Design · Living Design · Stone Care, separados por filetes verticales).

## Patrones de interfaz

- **Rótulo de sección**: Playfair 15px, MAYÚSCULAS, tracking 0.2em, color `ink`, seguido de un filete de 56×1px `line-strong` a 24px. Ej.: `ARQUITECTURA ——`.
- **Botón**: alto 44px, padding 0 28px, esquinas rectas, Montserrat 500 12px MAYÚSCULAS tracking 0.2em. Primario `primary`/`on-primary` (hover `accent-text`); secundario contorno 1px `ink`; enlace `accent-text` subrayado con "→"; sobre imagen contorno limewash. Foco: outline 2px `focus`, offset 2px.
- **Navegación**: logotipo pequeño (18px, sin filete) a la izquierda; enlaces Montserrat 11px MAYÚSCULAS tracking 0.22em a la derecha (PROYECTOS · MARCAS · NOSOTROS · CONTACTO); filete inferior `line`; activo subrayado en `accent`.
- **Héroe**: foto a sangre con velo `scrim` de izquierda a derecha; rótulo en mayúsculas, titular Playfair 44px limewash, filete terracotta 64×2px, texto Montserrat 300 17px, un botón "sobre imagen".
- **Tarjeta de imagen**: foto 16:9 a sangre + banda `surface-sand` con nombre (`descriptor`) y promesa (`label`, `ink-muted`). En retícula de 3 columnas iguales.
- **Marco en arco**: imagen vertical (3:4) con `border-radius: 999px 999px 0 0`; uno por composición.
- **Etiqueta de muestra**: tarjeta 240px `surface-raised`, perforación circular arriba, lockup de submarca, filete terracotta 40px, nombre en Playfair 21px, datos en Montserrat (etiqueta 10px mayúsculas `ink-muted` + valor 12px), código en `accent-text`.

## Voz

Calma y precisión; frases cortas con sustantivos concretos (piedra, luz, arco, textura, tiempo). Primera persona del plural para la marca ("Fusionamos", "Creamos"). Ejemplos: "Piedra que transforma espacios." · "Diseño que habita la vida." · "Cuidado que prolonga la belleza." · "Espacios que perduran." Botones: verbo en infinitivo ("Ver proyectos", "Solicitar muestra").

## Fotografía

Luz natural cálida y lateral, sombras largas y suaves. La piedra caliza es protagonista: texturas porosas, planos amplios, arcos, muros, escaleras, manos trabajando el material. Paleta beige, arena, terracota, verdes secos; nada saturado ni frío. Escenas: Stone Design = baños y cocinas en piedra; Living Design = salas con mobiliario orgánico bajo arcos; Stone Care = manos puliendo la superficie. Referencias en `imagen/` (solo dirección de arte; baja resolución).

## Componentes React (`components/`)

Carga en orden: `tokens/tokens.css`, `components/bundle.css`, React 18 y ReactDOM 18, `components/bundle.js` → `window.Caliza`. Firmas en `components/index.d.ts`.

### Wordmark

```ts
export interface WordmarkProps { variant?: 'auto' | 'principal' | 'inversa' | 'monocroma'; size?: number; rule?: boolean; className?: string; style?: React.CSSProperties }
```

El logotipo CALIZA GROUP en Playfair Display, dos líneas centradas y filete terracotta debajo.

- **Recibe**: `variant` (`auto` sigue el tema con `ink` y `rule`; `principal`, `inversa`, `monocroma` fijan los colores del manual), `size` (cuerpo en px de la letra; el filete y el interlineado escalan con él) y `rule` (`false` para quitar el filete, solo en tamaños pequeños como la navegación).
- **Úsalo** en portadas, cierres y cabeceras. Para piezas impresas o externas usa los SVG de `assets/Logos/`, que tienen el texto en curvas.
- **Respeta** un área libre igual a la altura de la mayúscula alrededor de todo el bloque.
- **No** lo pongas sobre terracotta ni sobre fotografía clara; no cambies tipografía, interlineado ni color del filete (salvo `monocroma`).

### BrandSymbol

```ts
export interface BrandSymbolProps { brand: Brand; size?: number; title?: string; className?: string; style?: React.CSSProperties }
```

Símbolo vectorial de una submarca, en `currentColor` (por defecto `accent`, terracotta).

- **Recibe**: `brand` (`stone-design`, `living-design`, `stone-care`), `size` (alto en px; el ancho sale de la proporción del símbolo) y `title` (nombre accesible; pasa `''` si es decorativo junto a texto que ya nombra la marca).
- **Úsalo** como sello, avatar, favicon, marcador de sección de una submarca o en bajorrelieve.
- **Color**: terracotta sobre limewash, sand o marine-ink; limewash sobre terracotta o fotografía (cambia `color` del contenedor o de `style`).
- **No** combines dos símbolos en un mismo elemento, no los rotes ni los contornees.

### SubBrandLockup

```ts
export interface SubBrandLockupProps { brand: Brand; size?: number; tone?: 'auto' | 'inversa'; symbol?: boolean; className?: string; style?: React.CSSProperties }
```

El logotipo de una submarca: símbolo terracotta, CALIZA en Playfair Display y descriptor en Montserrat con tracking amplio.

- **Recibe**: `brand`, `size` (cuerpo en px de CALIZA; símbolo y descriptor escalan con él), `tone` (`inversa` para texto limewash sobre marine-ink fijo; `auto` sigue el tema) y `symbol` (`false` para la versión solo tipográfica).
- **Úsalo** cuando habla una línea de negocio: empaques, etiquetas, cabeceras de catálogo.
- Para presentar el ecosistema, alinea los tres en el orden Stone Design · Living Design · Stone Care, separados por filetes verticales `line`.
- **No** pongas el descriptor en otra tipografía ni cambies el orden vertical.

### SectionTitle

```ts
export interface SectionTitleProps { children: React.ReactNode; as?: 'h1' | 'h2' | 'h3' | 'h4'; className?: string }
```

Rótulo de sección en Playfair Display, mayúsculas con 0.2em de tracking, seguido de un filete corto `line-strong`.

- **Recibe**: `children` (una a tres palabras; el componente aplica las mayúsculas) y `as` (nivel de encabezado, `h2` por defecto).
- **Úsalo** para abrir cada bloque de una página o documento, como en el manual: ARQUITECTURA, PALETA, TIPOGRAFÍA.
- **No** lo uses como titular de página (usa el estilo `title` o `headline`) ni con frases largas.

### Button

```ts
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'link' | 'onimage'; href?: string }
```

Botón rectangular de esquinas rectas con rótulo en Montserrat 12px, mayúsculas y 0.2em de tracking.

- **Recibe**: `variant` (`primary`, `secondary`, `link`, `onimage`), `href` (lo convierte en enlace `<a>`), `children` (verbo en infinitivo, dos a tres palabras: "Ver proyectos", "Solicitar muestra") y cualquier atributo de `<button>`.
- **primary** (`primary` / `on-primary`): una sola vez por vista, para la acción principal. Al pasar el cursor toma `accent-text`.
- **secondary**: borde `ink`, para acciones de apoyo.
- **link**: texto `accent-text` subrayado con flecha, para "Conocer más" dentro de contenido.
- **onimage**: contorno limewash, solo sobre fotografía con velo o sobre marine-ink.
- **No** uses terracotta como relleno de botón con texto pequeño (no alcanza 4.5:1) ni redondees las esquinas.

### ImageCard

```ts
export interface ImageCardProps { src: string; alt?: string; title: React.ReactNode; subtitle?: React.ReactNode; ratio?: string; className?: string; style?: React.CSSProperties }
```

Fotografía a sangre con una banda `surface-sand` debajo: nombre en `descriptor` y promesa en `label` `ink-muted`.

- **Recibe**: `src`, `alt` (describe la escena, no la marca), `title`, `subtitle` y `ratio` (por defecto `16 / 9`). El contenedor define el ancho.
- **Úsalo** en retículas de tres columnas iguales con 12–24px de separación para presentar submarcas, proyectos o colecciones.
- La fotografía sigue el Universo visual: luz natural cálida, piedra protagonista, sin texto encima.
- **No** pongas sombras, bordes redondeados ni más de dos líneas en la banda.

### ArchFrame

```ts
export interface ArchFrameProps { src: string; alt?: string; width?: number; ratio?: string; className?: string; style?: React.CSSProperties }
```

Marco de imagen con remate en arco de medio punto (`radius-arch` en las esquinas superiores), eco del símbolo Living Design y de la arquitectura de las fotografías.

- **Recibe**: `src`, `alt`, `width` (px; si falta, ocupa el ancho del contenedor) y `ratio` (por defecto `3 / 4`; usa proporciones verticales).
- **Úsalo** como acento: una imagen en arco por composición, junto a texto o a imágenes rectas.
- **No** lo uses para retratos de personas ni en retículas donde todas las imágenes sean arcos.

### NavBar

```ts
export interface NavBarProps { links: NavLink[]; homeHref?: string; label?: string; className?: string }
```

Barra de navegación de una línea: logotipo pequeño (sin filete) a la izquierda y enlaces en Montserrat 11px, mayúsculas y 0.22em de tracking a la derecha, sobre `surface` con filete inferior `line`.

- **Recibe**: `links` (`[{label, href, active}]`, máximo cinco: PROYECTOS, MARCAS, NOSOTROS, CONTACTO), `homeHref` y `label` (nombre accesible del `<nav>`).
- El enlace activo se subraya en `accent`; el resto, en `line-strong` al pasar el cursor.
- En pantallas estrechas, el consumidor debe colapsar los enlaces en un menú propio.

### Hero

```ts
export interface HeroProps { src: string; alt?: string; title: React.ReactNode; kicker?: string; text?: React.ReactNode; cta?: { label: string; href: string }
```

Portada a sangre: fotografía con velo `scrim` desde la izquierda, rótulo, titular Playfair Display en limewash, filete terracotta, texto y un botón `onimage`.

- **Recibe**: `src`, `alt`, `title` (frase corta con punto final: "Espacios que perduran."), `kicker` (rótulo en mayúsculas), `text` (una oración), `cta` (`{label, href}`) y `height` (px, 480 por defecto).
- **Elige** fotografías con la zona izquierda tranquila (muro, sombra); el velo garantiza el contraste del texto limewash.
- **No** centres el texto sobre la imagen ni uses más de un botón.

### SampleTag

```ts
export interface SampleTagProps { brand: Brand; name: string; details?: SampleTagDetail[]; code?: string; className?: string; style?: React.CSSProperties }
```

Etiqueta colgante para productos y muestras: perforación, lockup de submarca, filete terracotta, nombre del material en Playfair Display y datos técnicos en Montserrat.

- **Recibe**: `brand`, `name` (nombre del material o producto), `details` (`[{label, value}]`, dos a cuatro filas) y `code` (referencia interna).
- **Úsalo** en catálogos digitales, fichas de muestra y como base para la etiqueta impresa.
- **No** agregues precios ni promociones; la etiqueta identifica, no vende.

## Si construyes sin React

Carga `tokens/tokens.css` y usa las variables (`var(--ink)`, `var(--space-6)`, `var(--font-serif)`…) y las clases de texto (`.headline`, `.body`, `.descriptor`). Con Tailwind usa `tokens/tailwind.preset.js` (ej. `bg-surface text-ink font-serif p-6 rounded-none`). Copia las medidas de "Patrones de interfaz" literalmente.

## Notas de procedencia

Sistema derivado del manual de marca original (`referencia/manual-de-marca.jpg`). Los logos y símbolos están redibujados en vector desde esa imagen; si aparecen archivos maestros, tienen prioridad. El manual no define iconografía de interfaz: usa trazos lineales de 1.5px en `ink`, sin relleno, o los símbolos de marca.
