# CALIZA GROUP — sistema de identidad digital v1.0

**Fuente visual:** lámina «Manual de marca» aprobada y proporcionada por Caliza (11-11-2026). **Estado:** reconstrucción vectorial fiel a la dirección de arte, **no** un archivo maestro recibido del estudio diseñador. La comparación geométrica punto a punto queda pendiente de recibir los originales AI/SVG/EPS del propietario. No comunicar que esta reconstrucción es el logo oficial definitivo.

## 1. Arquitectura de marca

| Identidad | Composición fija | Símbolo distintivo | Aplicación |
|---|---|---|---|
| CALIZA GROUP | CALIZA / GROUP centrados + filete Terracotta | No se inventa símbolo corporativo | Navegación, pie, comunicaciones corporativas |
| CALIZA STONE DESIGN | «C» concéntrica + CALIZA + STONE DESIGN | Tres arcos y remate lleno | Arquitectura, proyectos, materiales |
| CALIZA LIVING DESIGN | Arco + CALIZA + LIVING DESIGN | Arco mediterráneo abierto abajo | Muebles, objetos, tienda / colección |
| CALIZA STONE CARE | Estrella de cuatro puntas + CALIZA + STONE CARE | Estrella cóncava simétrica | Limpieza, cuidado, restauración |

Los iconos no sustituyen los logos completos cuando es necesaria la identificación de una línea. No convertir `CALIZA GROUP` en una marca horizontal ni modificar la geometría de ningún símbolo mediante CSS.

## 2. Parámetros normativos

Los números exactos están en [`identity.config.json`](identity.config.json), única fuente de verdad; el script [`scripts/build-identity.mjs`](scripts/build-identity.mjs) produce automáticamente **21 SVG autocontenidos** y CSS para web y prototipo.

| Variable | Valor | Regla |
|---|---|---|
| Marine Ink | `#18343C` | Texto y logo sobre superficies claras |
| Terracotta | `#AE7256` | Símbolos, filetes, detalles, CTA |
| Sand | `#CEB99B` | Superficies neutras complementarias |
| Limewash | `#F2EADC` | Fondo cálido principal y texto inverso |
| Paper | `#FBF7F0` | Superficie editorial auxiliar |
| Serif | Playfair Display Regular (400) | Titulares y logotipos |
| Sans | Montserrat Regular (400) | Descriptores, navegación y textos |
| Área de respeto | ≥ **0,5× cap-height** alrededor de lockup | Ningún texto, icono o borde invade el perímetro |
| Mínimo grupo | **90 px** de ancho | Por debajo, usar texto legible en vez de escalar de más |
| Mínimo línea | **96 px** de ancho | Por debajo, usar solo símbolo + nombre accesible |
| Mínimo símbolo | **24 px** | No disminuir el trazo manualmente |
| Esquinas de UI | 0 px | Placas rectas; redondeos solo para controles excepcionales |

Estos mínimos son pautas de interfaz digital derivadas de la lámina, no especificaciones oficiales de imprenta.

## 3. Archivos maestros independientes

En [`dist/`](dist/) hay un SVG autónomo por marca y variante (no depende de que el usuario tenga una fuente instalada):

```
caliza-group-primary.svg         caliza-group-inverse.svg         caliza-group-monochrome.svg
caliza-stone-design-primary.svg  caliza-stone-design-inverse.svg  caliza-stone-design-monochrome.svg
caliza-living-design-primary.svg caliza-living-design-inverse.svg caliza-living-design-monochrome.svg
caliza-stone-care-primary.svg    caliza-stone-care-inverse.svg    caliza-stone-care-monochrome.svg
symbol-stone-design-{primary,inverse,monochrome}.svg
symbol-living-design-{primary,inverse,monochrome}.svg
symbol-stone-care-{primary,inverse,monochrome}.svg
```

`primary` = Marine Ink + Terracotta, para fondo claro. `inverse` = Limewash + Terracotta, para fondo Marine Ink. `monochrome` = Marine Ink uniforme. No aplicar filtros CSS de color al SVG; se selecciona su variante. No se crea símbolo inventado para Group.

Los mismos archivos se distribuyen en `web/public/brand/` y `prototype/assets/img/brand/`. Las antiguas rutas `option08-stone.svg`, `option08-living.svg` y `option08-care.svg` son **aliases regenerados** con la misma geometría para conservar la compatibilidad.

## 4. Construcción geométrica

- Símbolos en retícula cuadrada de `64 × 64` unidades y `viewBox` permanente.
- Lockup principal `330 × 232`; lockups divisionales `260 × 202`.
- El símbolo, las dos líneas tipográficas y los márgenes comparten un eje central.
- El generador transforma los glifos de Playfair Display y Montserrat en contornos vectoriales estáticos (`<path>`); no inserta `<text>` ni depende de Google Fonts durante el pintado de un logo.
- Los `<img>` conservan su razón de aspecto (`width:auto` no se combina con un `height` ajeno a la proporción). Se prohíbe `object-fit:cover`, `transform:scaleX/Y`, estiramiento y fondos muy concurridos sin máscara de contraste.

## 5. Uso de interfaz

**Header:** logo Group en variante `primary` sobre Limewash. En móvil puede bajar a 82 px de ancho. **Footer y menú oscuro:** variante `inverse` sobre Marine Ink. **Pilares de negocio:** marca divisional completa cuando identifica a la línea, símbolo solo cuando acompaña un título que contiene el nombre completo. **Favicon:** no reinterpretar un símbolo de línea como logo corporativo; hasta recibir un favicon maestro, usar la versión Group completa y verificar su legibilidad.

Ejemplo React:

```tsx
import { BrandMark } from '@/components/BrandMark'

<BrandMark brand="group" variant="primary" width={105} />
<BrandMark brand="living-design" variant="inverse" width={160} />
```

Ejemplo HTML:

```html
<img src="assets/img/brand/caliza-group-primary.svg"
  class="caliza-brand-logo" data-caliza-mark="group"
  width="330" height="232" alt="CALIZA GROUP"
  style="--caliza-mark-width:105px">
```

## 6. Reglas tipográficas, imagen y accesibilidad

- Titulares editoriales en Playfair Display (400); texto y microetiquetas en Montserrat (400/500).
- Evitar texto con tracking artificial y tamaños menores de 10 px en pantallas normales; las etiquetas deben ser legibles también en móvil.
- Fotografía: piedra porosa, luz cálida, sombras de arquitectura, materia y artesanía; no sustituir productos reales con imágenes generadas sin identificarlas.
- Fondos de marca y contraste: los SVG inversos se reservan para fondos oscuros; la variante `primary` sobre fondos claros. Validar contraste de textos, foco visible y lecturas del lector de pantalla.
- La imagen del logo dentro de un enlace cuyo `aria-label` ya da el nombre debe usar `alt=""`; en otros contextos debe incluir el nombre de marca como `alt`.

## 7. Control de versiones y prueba

1. Editar exclusivamente `identity.config.json` para paleta, proporciones y rutas geométricas.
2. `node brand/identity/scripts/build-identity.mjs` genera toda la familia de archivos; nunca ajustar copias a mano.
3. `node brand/identity/tests/identity.test.mjs` verifica determinismo, color, variantes, ratios, rutas y consistencia con `brand/tokens.json`.
4. Abrir `/marca.html` en el prototipo de Vercel y comprobar las cuatro marcas y tres variantes en escritorio/móvil.
5. Confrontar los símbolos y los espacios con los **vectores oficiales** cuando Caliza los entregue; si difieren, actualizar la configuración y regenerar, sin editar 21 recursos por separado.

## Licencias y trazabilidad

Se partió de las versiones abiertas de [Playfair Display](https://github.com/google/fonts/tree/main/ofl/playfairdisplay) y [Montserrat](https://github.com/google/fonts/tree/main/ofl/montserrat), ambas bajo SIL Open Font License 1.1. Sus contornos se extraen exclusivamente para las letras de las marcas. Los archivos `licenses/` conservan las licencias de fuentes. La lámina adjunta aporta dirección de marca; el copyright de la identidad de Caliza permanece en sus titulares.
