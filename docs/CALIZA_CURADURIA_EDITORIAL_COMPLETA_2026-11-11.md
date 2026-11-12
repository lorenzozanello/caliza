# CALIZA — Cierre de curaduría editorial de la biblioteca audiovisual
**Corte:** 11–12 de noviembre de 2026 · **Entorno:** PR #19 / QA · **Publicación:** HOLD

## 1. Alcance y método
Se recorrieron las nueve carpetas hoja bajo `CALIZA PRODUCTOS` (Drive ID `1EqynOIwyh21PGnzsNIPxZNv_PqUVRGtF`), con **178 registros: 140 fotografías y 38 videos**. Se recuperaron los originales fotográficos y se visualizaron en hojas de contacto, incluidos los dos recursos inicialmente omitidos por la descarga en lotes. Los videos se descargaron; se extrajo al menos un fotograma de sus **36 nombres únicos** (dos nombres aparecen en dos carpetas). **La inspección de fotogramas no equivale a verificar toda la duración, audio o transiciones:** por esta razón ningún video está listo para producción.

La matriz **`docs/CALIZA_FULL_LIBRARY_INVENTORY_2026-11-11.json`** contiene los 178 registros, carpeta de origen, ID de Drive, MIME, bytes, decisión individual, motivo, uso propuesto y bloqueo por defecto. El propietario autorizó usar el conjunto de medios, pero esa autorización no acredita inventarios, precios, características de productos ni proyectos específicos.

## 2. Dictamen por activo
| Dictamen | Fotografías | Videos | Regla |
|---|---:|---:|---|
| P1 — candidato editorial principal | 10 | — | Composición auténtica y útil; requiere tratamiento editorial y QA de recortes |
| P2 — candidato de galería | 30 | — | Apoyo visual; revisar contexto, repetición y perspectiva |
| P3 — archivo condicionado | 46 | — | No prioritario para esta versión |
| Referencia de producto / lámina publicitaria | 45 | — | **No publicar tal cual:** tipografía, precios, branding o información incrustada |
| Duplicado / variante secundaria | 9 | — | Suprimir redundancia; se detectaron al menos 8 pares idénticos por SHA-256 de fuente |
| Video candidato condicionado | — | 21 | 19 nombres únicos; revisión dinámica/audio/privacidad previa |
| Video archivo condicionado | — | 11 | No justifica incorporación inmediata |
| Video excluido de la web | — | 6 | Pantalla opaca/blanca, overlays o presentación comercial no apta |
| **Total** | **140** | **38** | **Todos en HOLD** |

## 3. Selección editorial por experiencia
**Inicio:** preferir escenas completas con material auténtico, especialmente `3748627c-4605-4005-ba6e-b09dd324951b.jpg` (cocina cálida con madera), `IMG_2469.JPG` (isla y espacio residencial) y `IMG_1514.jpeg` (isla y entorno arquitectónico). `05af4ad1-6b89-411e-8501-4d614afab3bd.jpg` destaca la veta y el volumen, pero necesita controlar elementos de obra en los bordes. No convertir una toma de taller/obra en una foto de vivienda terminada mediante retoque inventado.

**Stone Design / proyectos:** fotos de cocinas e islas para narrar ejecución y oficio; usar colecciones por tipo de trabajo, no atribuir ubicaciones, nombres de clientes, medidas o materiales no documentados. Imágenes verticales pueden generar buenas secuencias de detalle.

**Lavamanos:** `IMG_0773.jpeg`, `IMG_0770.jpeg`, `IMG_5615.jpeg`, `IMG_5614.jpeg` son candidatos prioritarios. Corregir líneas verticales, exposición y objetos distractores sin modificar el producto. Diferenciar lavamanos integrados, de sobreponer y superficies de piedra únicamente cuando la fotografía lo pruebe.

**Living Design:** los archivos de sillas y mesas contienen en gran parte fichas promocionales con precios visibles. Usarlos como **referencias internas** de modelos, no como fotografías comerciales. Rehacer la presentación mediante recorte limpio y revisión independiente, no generar modelos ni sustituir acabados. `IMG_9820.jpeg` es un candidato de detalle auténtico para mesas auxiliares; sin ficha de producto confirmada, presentar como inspiración bajo consulta.

**Stone Care:** no representar procedimientos técnicos ni resultados antes/después basándose solo en superficies o clips de pulido. Los videos de trabajo deben validar contexto, seguridad de la escena y no implicar promesas de desempeño.

## 4. Video: shortlist y exclusiones
Candidatos condicionados: `IMG_0961.MOV`, `IMG_0962.MOV`, `IMG_9035.MOV`, `IMG_9036.MOV`, `IMG_1355.MOV`, `IMG_1356.MOV`, `IMG_1357.MOV`, `IMG_0711.MOV`, `IMG_0771.MOV`, `IMG_0772.MOV`, `IMG_5620.MOV`, `IMG_5621.MOV`, `IMG_6349.MOV`, `IMG_6668.MOV`, `IMG_1234.MOV`, `af497f9a-8e04-4432-a885-8a4e98416c91.mp4`, `c81ff892-9530-44d2-98e1-87e1f08b6269.mp4`, `b474fddb-0b57-4f25-9c1d-9a4c576033fd.mp4`, `mojo_video.mp4`.
No habilitar autoplay ni insertar originales enormes. Preparar clips de 5–12 s con poster WebP, H.264 MP4, subtítulos solo si hay audio relevante y sin reproducción automática con sonido; confirmar movimiento, marcas, personas y datos incidentales en todo el material.

Excluir de la web hasta contar con material limpio: `64310bb651674612b3a1f3e729dbadc0.mp4`, `copy_145AD195-F4FC-4B17-BDFD-40755C348B75.mov`, `copy_22BD32EA-49C4-459C-9DBC-2CA7EB14E68E.mov`, `copy_B5E1A61A-D3A0-4252-B935-B6A23715DA89.mov`, `copy_C352D952-A16C-4733-AB29-0C7479324DC3.mov`, `video-output-3DD1060C-DE14-4474-B0DA-B2E021C3EECD.mov`.

## 5. Tratamiento editorial y reglas inviolables
- **Color:** blancos neutros, calidez moderada, no desplazar el tono de piedra/veta, no aumentar saturación de acabados ni ocultar defectos materiales.
- **Composición:** hero 16:9 con espacio negativo para texto; producto 4:5 o 1:1 con pieza completa; galería 3:2; video 9:16 únicamente cuando el original lo permita.
- **Retoque:** enderezado, corrección de lente, exposición, luces y sombras; recortar cables/objetos periféricos cuando sea fiel. No añadir muebles, transformar piedra, reconstruir proyectos o borrar rasgos determinantes.
- **Carga:** AVIF + WebP responsivos a 320/480/640/960/1280/1600 px según contexto; poster y lazy-loading para video; no fuentes de Drive ni videos originales en el frontend.
- **Texto:** alt específico a lo visible, sin afirmaciones de SKU, lugar, cliente, precio, certificaciones o disponibilidad no acreditadas.
- **Control de duplicados:** un mismo escenario no debe repetirse como si representara proyectos distintos.

## 6. Defectos detectados y cierre parcial en QA
El lote técnico inicial de 11 fotos y 118 derivados era estructuralmente íntegro, pero asignaba láminas de mesas/sillas con textos y precios a imágenes de familia. Se corrigió el generador y el manifiesto de QA para **exponer en fichas únicamente el lavamanos real limpio**; las cuatro familias de mobiliario quedan con imágenes conceptuales rotuladas hasta que existan recortes limpios y certificados. Ningún archivo fuente fue borrado de Drive.

## 7. Condiciones de parada
La **curaduría y clasificación individual** están documentadas. **No están terminados**: edición final de las 40 fotografías candidatas, validación completa de movimiento/audio de los videos, comprobación visual de todos los derivados, evaluación de Preview Vercel, ni auditoría independiente del contenido comercial. El PR #19 sigue en borrador y no debe fusionarse ni desplegarse a Production.