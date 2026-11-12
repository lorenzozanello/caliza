# CALIZA — Auditoría adversarial UX/UI y recuperación de dirección de arte
**Fecha:** 12 noviembre 2026. **Base visual:** captura pública desktop 1440px y móvil 390px de `www.calizagroup.shop`, registrada por GitHub Actions. **Código:** rama R7 (PR #20). **Autoridad:** `brand/identity/DESIGN_SYSTEM.md` → `brand/authority/caliza-group-design-system/AI_BRIEF.md`, `tokens/tokens.json`, `MANUAL.md`, especificaciones de Hero/ImageCard/ArchFrame; `brand/APPROVED_OPTION08.md` como decisión editorial complementaria, subordinada al sistema rector en caso de conflicto.

## Dictamen
**La regresión estética es real y visible**, pese a que la identidad base, tipografía y parte de la arquitectura consultiva se conservan. Los cambios sustituyeron fotografías conceptuales art-directed por imágenes documentales sin recalibrar el *tratamiento de los contenedores*; la cantidad de fotos y rejillas aumentó mientras perdieron fuerza el hero, las escenas de las tres marcas, los dos banners narrativos, el ritmo de escenas y detalles, el uso del arco como motivo de acento y la progresión comercial. El PASS automatizado de Lighthouse y axe no equivale a aprobación estética.

## Hallazgos por prioridad
| ID | Severidad | Observación verificada | Regla del diseño | Corrección propuesta |
|---|---|---|---|---|
| UX01 | P0 | Home hero sustituido por **split 44/56**, con amplio panel liso y fotografía de obra en proporción sin encuadre, más próximo a presentación documental que a portada boutique | Hero: portada a sangre, scrim Marine desde izquierda, Playfair Limewash, un CTA onimage | Recuperar Hero rector como variante preferente con imagen real **solo si** existe 3000px y zona izquierda tranquila; si no, mantener split como variante secundaria y presentar un concepto editorial no engañoso |
| UX02 | P0 | El primer banner Stone Design muestra suelo/reflejos/entorno incidental, no una composición que haga hero del material | Universo Stone: piedra, luz lateral, arquitectura; tres escalas espacio/pieza/veta | Construir una imagen maestra alta resolución por banner, con dirección de arte de un proyecto real, recorte 16:9/3:2, enfoque en material y veta |
| UX03 | P0 | Banner Stone Care ilustra lavamanos e instalación, no cuidado; además recorte/objetos cercanos rebajan la estética | Universo Stone Care: manos cuidando superficie real, estrella simbólica | Sustituir por intervención real de mantenimiento solo tras validar proceso; si no existe, macro fiel de piedra pulida y copy no específico, o composición conceptual explícitamente identificada |
| UX04 | P0 | En la banda 'De nuestro archivo' hay una **tarjeta visual en blanco** (captura desktop) | Cada ImageCard con medio, pie y jerarquía legibles | Bloquear tarjetas cuya imagen no carga, revisar id de favoritos y fallbacks, añadir prueba de `naturalWidth > 0` en todos los cards visibles, no solo primeros 12 |
| UX05 | P1 | Tarjetas de submarca mantienen símbolos y banda Sand, pero escenas heterogéneas, escalas distintas y una fotografía de baño con sanitarios colindantes | ImageCard: foto a sangre, banda Sand, 3 columnas iguales, sin superposiciones; universo propio por marca | Selección de tres maestras con encuadre/luz consistentes, mismo horizonte y contraste; no poner foto de lavamanos sin acto de cuidado como Stone Care |
| UX06 | P1 | Algunas fotos se muestran **contenidas con bandas y espacio muerto**: catálogo de mesas y tarjetas grandes con imagen horizontal en contenedor mayor | Tres escalas: espacio/pieza/veta; formato adecuado al componente | Distinguir objeto aislado (contain) y lifestyle (cover con safe-area); evitar contenedores de 3:4 para fotos horizontales sin art direction |
| UX07 | P1 | Los bloques de Living son grandes fichas densas en textos/CTAs; hay poca alternancia con escenas editoriales de alto valor | Calma, columnas iguales, mucha respiración, líneas de 1px | Retícula selectiva de piezas destacadas, pocos textos, una imagen de contexto + detalle + ficha por familia, separar galería completa tras CTA |
| UX08 | P1 | Galería de 140 registros compite con narrativa boutique y repite titulares genéricos; duplicaciones en producto no equivalen a variedad comercial | Arquitectura consultiva y precisión factual | Mostrar 6-9 casos/escenas curados en página; archivo completo en `#/archivo` con filtros, evitar repetir 'Cocinas y superficies' tres veces sin diferenciación |
| UX09 | P1 | Paleta y tipografía respetadas parcialmente; pero hay abundancia de paneles/cajas y limitación del motivo ArchFrame | Brief: esquinas rectas, filetes, 1 arco intencional, sin sombras | Introducir un único ArchFrame por composición clave (especialmente Living), alternar full-bleed / retícula / macro sin introducir fondos ajenos |
| UX10 | P1 | Encabezados y CTA secundarios parecen diminutos frente a imágenes y grandes títulos; escena principal pierde conversión visible | Montserrat body/label, primary Marine/Limewash, foco AA | Auditar tamaño óptico, CTA sobreimagen, escala móvil, estados hover/focus, contraste AA y jerarquía de enlace principal |
| UX11 | P1 | En desktop hay sobreoferta de secciones y módulo social extenso que genera descompresión del ritmo | Reglas de calma, progresión aspiración→prueba→acción | Social resumido en 1 franja elegante con enlaces y opcional visor bajo interacción; no simular posts ni inundar landing de explicaciones técnicas |
| UX12 | P1 | Móvil captura página muy larga y con poco contraste visual entre categorías, banners y módulos; auditar antes de describir como resuelto | Mobile-first, continuidad de marca, jerarquía | Portadas maestras 4:5, banners ajustados, tipografía legible, tarjetas 1 columna, máximo 2 CTAs visibles por pantalla |
| UX13 | P1 | Se aprobó QA automatizado, pero no existe gate de evaluación humana comparada con Option08 antes/después | Sistema de diseño original y autoridad de marca | Capturas de 17 rutas, comparación lado a lado, matriz de 12 criterios con decisión independiente; no merge hasta PASS humano |
| UX14 | P2 | Product catalogue mezcla recortes de lámina comercial con fotografía de ambiente, creando incoherencia de estilismo | Fondo claro, cámara/ángulo consistentes por familia | Dos plantillas: producto aislado normalizado / proyecto real; explicitar detalle editorial vs vista íntegra, nunca inventar SKU/precio |

## Tensiones normativas que deben resolverse
- La Opción 08 favorece hero con fotografía real y diseño visual mediterráneo. El manual rector define **fotografía a sangre + scrim** y explícitamente **sin degradados decorativos**; el scrim es una excepción funcional de legibilidad del Hero, no decoración. El split R3 fue una respuesta a baja resolución, pero **no puede sustituir indiscriminadamente el componente Hero aprobado**.
- `brand/fotografia.md` exige fotografías de héroe **>=3000 px**, paneles **>=1800 px**; muchos archivos fuente son menores. No aumentar artificialmente ni prometer resolución ausente. Elegir un componente menos exigente o nueva producción fotográfica.
- La guía prohíbe presentar imágenes generadas como obra entregada. Una IA puede **limpiar iluminación/encuadre** de una imagen real, pero cambios de arquitectura, vetas, mobiliario o equipamiento requieren etiqueta de propuesta de ambientación, nunca 'proyecto CALIZA'.
- El modelo comercial actual es consultivo, no checkout. No usar precios ni claims de inventario de las láminas.

## Arquitectura visual objetivo
1. **Hero:** una escena maestra potente; kicker + titular breve + un CTA; diseño rector con escrutinio de resolución y contraste.
2. **Tres submarcas:** tres ImageCard en proporciones iguales con imagen cohesionada y pie Sand; símbolos auténticos.
3. **Narrativa:** arco arquitectónico puntual (una composición), módulos asimétricos intencionales de escena→pieza→veta y espacios de Limewash.
4. **Prueba real:** 3 proyectos/ambientes seleccionados, con series reales y descripciones verificadas, no muro de fotos.
5. **Familias:** dos productos destacados por familia + enlace a catálogo completo; variantes con relación de aspecto válida.
6. **Banners:** Stone Design = materia/arquitectura; Living = pieza en contexto; Care = cuidado de superficie, no catálogo de lavamanos.
7. **Cierre:** CTA editorial fuerte y compacto; redes como soporte, no como protagonista.

## Definition of Done editorial
- 17 rutas desktop, tablet y móvil; sin imagen vacía, distorsión, pixelación notable, recorte destructivo ni texto sobre el sujeto.
- 3 héroes/2 banners principales comparados con referente Option08 y manual rector; ninguno aprobado solo por estar en WebP.
- Home: 3 escenas de submarca, 1 macro y 1 arco; no más de 9 imágenes antes del archivo completo.
- Contraste AA y foco visible, performance y CLS automáticos PASS; revisión visual independiente separada.
- Fotografías auténticas trazadas por ID; las composiciones generativas se etiquetan y no reclaman obra propia.
- Mobile 390px y 768px sin espacio muerto, CTA oculto, superposición de WhatsApp ni titulares cortados.
- **Publicación no autorizada por este informe**; PR #20 permanece Draft hasta aprobación visual de las maquetas reformuladas.
