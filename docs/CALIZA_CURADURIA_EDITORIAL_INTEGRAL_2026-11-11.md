# CALIZA GROUP — Curaduría editorial integral del archivo multimedia
**Corte:** 11–12 de noviembre de 2026 · **Ámbito:** 178 registros (140 fotos + 38 registros de video).  
**Fuente:** Google Drive personal compartido / carpeta CALIZA PRODUCTOS `1EqynOIwyh21PGnzsNIPxZNv_PqUVRGtF`.  
**Matriz de fuente de verdad:** `docs/CALIZA_FULL_LIBRARY_INVENTORY_2026-11-11.json`.  
**Regla:** selección editorial NO equivale a autorización técnica de despliegue; `publication=HOLD` en los 178 registros.

## Resultado consolidado

| Clase | Registros | Tratamiento |
|---|---:|---|
| Fotografía P1 | 10 | Prioridad de retoque, inspección a escala 100%, encuadre y uso editorial |
| Fotografía P2 | 30 | Galería secundaria de producto, proyectos y detalles |
| Fotografía P3 | 46 | Archivo condicionado; no presentar como protagonista |
| Fotografía duplicada | 9 | Descartar para publicación repetida; conservar trazabilidad |
| Lámina comercial con precio/texto | 45 | Referencia de producto únicamente; NO fotografía limpia ni precio validado |
| Video editorial condicionado | 17 | Selección por 3 fotogramas, sin autorización de publicación |
| Video archivo condicionado | 10 | Menor prioridad editorial |
| Video publicidad/overlay | 8 | Archivo comercial exclusivamente; reemplazar con grabación limpia si procede |
| Video con personas/privacidad a verificar | 2 | No activar sin revisión específica |
| Video demasiado corto (0,3 s) | 1 | Excluir del video web |
| **Total** | **178** | **178 con HOLD** |

### Selección espacial y narrativa

**Portada:** escoger máximo dos piezas de arquitectura real, privilegiando la cocina con isla de madera `3748627c-4605-4005-ba6e-b09dd324951b.jpg` y la isla iluminada `IMG_2469.JPG`, sujetas a retoque de objetos distractores, decisión final de encuadre 16:9 y contraste de titular. No simular espacios terminados; si la obra está incompleta se declara “proceso” o se descarta de portada.

**Stone Design:** `05af4ad1-6b89-411e-8501-4d614afab3bd.jpg` (pieza de isla de piedra), `IMG_1514.jpeg.jpg` y `IMG_1512.jpeg.jpg` (obra/instalación), detalles de vetas en cocina y lavamanos. Priorizar líneas, uniones y material real; no eliminar juntas o defectos para fingir producto distinto.

**Living Design:** mesa auxiliar `IMG_9820.jpeg.jpg`; seleccionar entre modelos reales limpios y medios ya optimizados en el lote inicial; las 45 láminas con precios y títulos funcionan solo como guía de nomenclatura. Nunca extraer de la lámina un precio vigente sin confirmación.

**Lavamanos:** `IMG_0773.jpeg.jpg`, `IMG_0770.jpeg.jpg`, `IMG_5615.jpeg.jpg`, `IMG_5614.jpeg.jpg` sirven para piezas/detalles y seguimiento de obra. Evitar imagen principal que muestre plástico protector, sanitarios contiguos o personas reflejadas. Seleccionar encuadres finales limpios de P2 antes que forzar P1.

**Proyectos:** agrupar series del mismo ambiente en una única ficha, sin inventar cliente, nombre de proyecto, ubicación, fecha, estado de entrega ni materiales específicos no confirmados.

**Stone Care:** videos `IMG_0836.MOV` y `video-output-3DD1060C-DE14-4474-B0DA-B2E021C3EECD.mov` muestran manipulación/pulido de superficie, pero no constituyen evidencia de un procedimiento comercial específico. Excluir mensajes promocionales incrustados y no añadir afirmaciones técnicas sin sustento.

## Revisión de videos (muestreo temporal verificable)

- Se recuperaron **36 archivos locales únicos** para 38 registros en Drive; dos registros duplican variantes o nombres de origen. Cada video único tiene **tres fotogramas examinados** aproximadamente al 12%, 50% y 86% de su duración: **108 fotogramas**.
- Duración acumulada aproximada: **11,3 minutos**. **31/36** archivos contienen pista de audio; **5/36** no la contienen. Presencia de pista NO acredita música, diálogo ni licencias.
- Priorizar tomas reales cortas de cocina, textura de piedra, mesa o lavamanos, preferiblemente sin pista de audio tras revisar su contenido, con poster responsivo y consentimiento de cualquier persona identificable.
- Excluir de montaje del sitio los videos de anuncios con descuentos/precios superpuestos (`copy_*`, `mojo_video.mp4`, algunos `video-output-*`) y `IMG_0962.MOV` (0,3 s). `IMG_1355.MOV`/`IMG_1356.MOV`: revisar apariciones de terceros.
- **Limitación explícita:** el muestreo por fotogramas NO equivale a reproducción continua completa ni escucha de las pistas de audio. **Todos los videos siguen bloqueados para publicar hasta que esas comprobaciones se realicen.**

## Estándar de tratamiento editorial

1. Corregir orientación EXIF; no alterar la geometría real de piezas, vetas, acabados o montaje.
2. Temperatura cálida neutra, blancos naturales, contraste moderado, saturación contenida. Comparar el derivado con original para evitar falso color de piedra.
3. Recortar en **16:9 / 4:5 / 1:1** según componente, con variante móvil específica sin cortar el elemento principal. En interiores de obra, no borrar detalles que cambien la realidad del proyecto.
4. Emplear AVIF/WebP multiresolución, dimensiones declaradas, `srcset` y `sizes`; hero con recurso específico y carga prioritaria, resto diferido. No insertar video en carga inicial de forma automática.
5. Mantener `alt` descriptivo; no fingir fichas SKU, precios, garantía o disponibilidad. Fotografías reales no deben llevar la etiqueta “imagen conceptual”.
6. Mantener evidencias de origen y hashes en repositorio; no exponer links privados ni imágenes originales pesadas por defecto.
7. Antes de usar un clip, comprobar todo el video, sonido, personas, marcas de terceros, material publicitario y licencias auxiliares. Usar subtítulos o texto de apoyo si la pieza informa procesos.

## Condiciones de aceptación

- **Aprobado como curaduría documental:** cobertura de los 178 registros con decisión individual, trazabilidad Drive y muestreo temporal multicuadro de 36 videos únicos.
- **NO aprobado como publicación integral:** falta cotejo SHA binario derivado-origen, evaluación visual a resolución original de todas las candidatas, reproducción/audición completa de video, producción de recortes finales y QA de Preview.
- **QA:** mantener PR #19 en borrador; no publicar en Production, no cambiar DNS/dominio, no activar pasarela ni indexación por efecto de este documento.

**Evidencias visuales locales:** hojas de contacto P1, P2, y tres líneas temporales de video. No incluirlas en archivos públicos de producción.