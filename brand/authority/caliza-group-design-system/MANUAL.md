# CALIZA GROUP — Manual de marca

CALIZA GROUP es un ecosistema de marcas especializado en piedra natural, diseño de vida y cuidado. Fusiona la materia, el diseño y el bienestar para crear espacios atemporales que honran la naturaleza y la arquitectura contemporánea colombiana. Lema de portada: **Materia · Espacios · Personas — Colombia al mundo**.

## Arquitectura de marca

Una marca madre y tres submarcas. Cada submarca comparte el nombre CALIZA y se distingue por un símbolo geométrico y un descriptor.

| Marca | Símbolo | Promesa | Uso |
| --- | --- | --- | --- |
| **CALIZA GROUP** | — (solo logotipo) | Piedra natural, diseño, vida contemporánea | Corporativo, inversionistas, plataforma digital |
| **CALIZA Stone Design** | Arcos concéntricos | Piedra que transforma espacios | Superficies, lavamanos, encimeras, proyectos arquitectónicos |
| **CALIZA Living Design** | Arco | Diseño que habita la vida | Mobiliario y objetos para habitar |
| **CALIZA Stone Care** | Estrella de cuatro puntas | Cuidado que prolonga la belleza | Mantenimiento, limpieza y restauración de piedra |

- Usa `logos/caliza-group.svg` cuando habla el grupo; usa el lockup de submarca (`caliza-stone-design.svg`, `caliza-living-design.svg`, `caliza-stone-care.svg`) cuando habla una línea de negocio.
- Nunca mezcles dos símbolos en una misma pieza, salvo en la presentación del ecosistema completo, donde van en el orden Stone Design · Living Design · Stone Care, separados por filetes verticales `line`.

## Voz y contenido

- Habla con calma y precisión: frases cortas, sustantivos concretos (piedra, luz, arco, textura, tiempo). Sin exclamaciones, sin superlativos vacíos, sin emoji.
- Primera persona del plural para la marca ("Fusionamos", "Creamos"); trato de usted o impersonal hacia el cliente.
- Titulares en sentence case y con punto final: "Espacios que perduran." Los rótulos de sección, descriptores y navegación van en MAYÚSCULAS con tracking amplio: "ARQUITECTURA", "STONE DESIGN", "PROYECTOS".
- Los nombres de submarca se escriben "CALIZA Stone Design" en texto corrido; en el logotipo siempre en mayúsculas.
- Tríadas que resumen la marca: "Materia, espacios, personas" · "Piedra natural, diseño, vida contemporánea". Úsalas en portadas y cierres, no en texto corrido.
- Ejemplos de tono: "Piedra que transforma espacios." · "Diseño que habita la vida." · "Cuidado que prolonga la belleza."

## Color

Cuatro colores, en este orden de peso visual: Limewash (fondo), Marine Ink (texto y logotipo), Sand (bloques), Terracotta (acento).

| Token | Hex | Significado | Uso |
| --- | --- | --- | --- |
| `marine-ink` | #18343C | Sofisticación, confianza, profundidad | Logotipo, titulares, fondo inverso |
| `terracotta` | #AE7256 | Tierra, calidez, artesanía | Símbolos, filete de marca, acentos |
| `sand` | #CEB99B | Naturaleza, equilibrio, atemporalidad | Bloques, empaques, texto claro sobre marine |
| `limewash` | #F2EADC | Luz, pureza, espacios | Fondo principal, texto sobre marine |

- Construye la interfaz con los tokens semánticos, no con los de marca: `surface` de fondo, `ink` para texto, `ink-muted` para pies de foto, `line` para filetes, `accent` para símbolos y filetes de marca.
- El tema **Limewash (claro)** es el principal. El tema **Marine (inversa)** invierte fondo y texto, como la versión inversa del logotipo; el terracotta se mantiene.
- Terracotta no es un color de texto pequeño (3.3:1 sobre limewash). Para enlaces o cifras en terracotta usa `accent-text`; para el resto, `accent` solo en símbolos, filetes e íconos, o en texto de 24px o más.
- El botón principal es `primary` con texto `on-primary`, nunca terracotta con texto blanco.
- No uses degradados ni colores fuera de la paleta. La calidez la pone la fotografía.

## Tipografía

- **Playfair Display** (serif): elegancia, autoridad, atemporalidad. Logotipo (`display`), titulares (`headline`, `title`, `subtitle`), rótulos de sección (`section`, en mayúsculas con 0.2em de tracking) y citas (`quote`, cursiva). Siempre en peso 400; el contraste del trazo es suficiente.
- **Montserrat** (sans serif): claridad, modernidad, versatilidad. Texto corrido (`body`, `lead` en peso 300), descriptores de submarca y navegación (`descriptor`, mayúsculas, 0.22em), etiquetas (`label`, mayúsculas, 0.16em) y pies de foto (`caption`).
- Nunca pongas Montserrat en titulares ni Playfair en botones o navegación.
- Las mayúsculas con tracking amplio son la firma de la marca: aplícalas solo a rótulos cortos (una a tres palabras).

## Logotipo

- **Versión principal** (`caliza-group.svg`): marine-ink con filete terracotta, sobre fondos claros (limewash, sand, blanco).
- **Versión inversa** (`caliza-group-inversa.svg`): limewash con filete terracotta, sobre marine-ink o fotografía oscura.
- **Versión monocroma** (`caliza-group-monocroma.svg`): todo en marine-ink, para impresión a una tinta, grabado y sellos.
- **Área de respeto**: deja libre alrededor del logotipo un margen igual a la altura de la letra "X" de CALIZA (la altura de mayúscula). Ningún elemento gráfico o texto invade ese espacio.
- **Tamaño mínimo** (recomendación; el manual no lo fija): logotipo de grupo 24mm / 96px de ancho; lockup de submarca 18mm / 72px. Por debajo, usa solo el símbolo.
- No deformes, no cambies la tipografía, no añadas sombras ni contornos, no cambies el filete terracotta por otro color salvo en la monocroma.

## Símbolos y geometría

Los tres símbolos se construyen sobre una retícula modular de círculos y cuadrados:

- **Stone Design**: un disco de tres cuartos rodeado por un semianillo y un cuarto de anillo concéntricos; evoca el corte y las vetas de la piedra.
- **Living Design**: un arco de medio punto de trazo grueso; evoca la arquitectura y el habitar.
- **Stone Care**: una estrella de cuatro puntas de lados cóncavos inscrita en un círculo; evoca el brillo y el pulido.

Los símbolos van en `accent` (terracotta) sobre cualquier fondo de la paleta, o en limewash sobre terracotta y fotografía. Puedes usarlos solos como avatar, favicon, sello de empaque o bajorrelieve en piedra (ver Aplicaciones).

## Forma, espacio y filetes

- Esquinas rectas por defecto (`radius-none`): fotografías, tarjetas, botones y bandas son bloques cortados. El único redondeo con intención es el arco (`radius-arch`), solo en las esquinas superiores de un marco de imagen.
- Separa columnas y secciones con filetes finos `line` de `hairline` (1px), nunca con cajas ni sombras. Los rótulos de sección llevan un filete corto a la derecha.
- Deja respirar: `space-8` entre secciones, `space-9` en portadas. La composición es centrada o en retícula de columnas iguales, con mucho limewash alrededor.
- Sin sombras en la interfaz; `shadow-float` solo para menús y diálogos.
- Foco de teclado: anillo sólido de 2px en `focus`, separado 2px del elemento.

## Universo visual (fotografía)

- Luz natural cálida y lateral, sombras largas y suaves; nada de flash ni luz fría.
- La piedra caliza es protagonista: texturas porosas, planos grandes, bordes cortados. Encuadres amplios de arquitectura (arcos, muros, escaleras) y detalles de mano y material.
- Paleta de la foto alineada con la marca: beige, arena, terracota, verdes secos; sin colores saturados.
- Cada submarca tiene su escena: Stone Design = baños y cocinas en piedra (`universo-stone-design.jpg`); Living Design = salas con mobiliario orgánico y arcos (`universo-living-design.jpg`); Stone Care = manos cuidando la superficie (`universo-stone-care.jpg`).
- Bajo la imagen, una banda `surface-sand` con el nombre en `descriptor` y la promesa en `label` (componente ImageCard).

## Aplicaciones

- **Papelería corporativa**: tarjetas en sand o terracotta con el logotipo centrado; dorso con el símbolo en bajorrelieve.
- **Embalajes**: cajas de textura pétrea con el símbolo grabado, sin texto en la cara principal.
- **Etiquetado**: etiqueta colgante limewash con el lockup de submarca (componente SampleTag).
- **Plataforma digital**: navegación de una línea en mayúsculas, héroe a sangre con titular Playfair en limewash (componentes NavBar y Hero).

## Iconografía

El manual no define un set de íconos. Usa los tres símbolos como único sistema gráfico de marca; para íconos de interfaz (flechas, menú, cerrar) usa trazos lineales de 1.5px en `ink`, esquinas rectas y sin relleno. No uses emoji.

## Componentes

`components/bundle.js` expone `window.Caliza` (React 18): Wordmark, BrandSymbol, SubBrandLockup, SectionTitle, Button, ImageCard, ArchFrame, NavBar, Hero y SampleTag. Carga `tokens/tokens.css` y `components/bundle.css` antes. Cada componente tiene su guía en `components/<Componente>.md`.
