# CALIZA GROUP · procedimiento Drive → GitHub → Vercel v1

**No es un proceso de publicación automática.** Estado: preparación técnica; no conectado aún al CMS ni a Vercel Production.

## Responsables

- CALIZA comercial: modelos, SKU, precios, anticipos, disponibilidad, vigencia.
- CALIZA técnico/operaciones: medidas, piedra, acabados, plazos, transporte e instalación.
- CALIZA legal/dirección: uso de imágenes, políticas, términos, impuestos, publicaciones.
- Desarrollo: extracción, pruebas, seguridad, GitHub, preview, control de release y reversión.

## Procedimiento de actualización

1. **Registrar** cambios en la hoja oficial, sin borrar identificadores ni reemplazar fotos de origen.
2. **Revisar** que las filas dependientes coincidan (`producto_id` ↔ `sku` ↔ material ↔ precio ↔ inventario ↔ medios).
3. **Aprobar** fila por entidad en `10_CONTROL`. No escribir manualmente encima de la fórmula de `listo_publicar`.
4. **Extraer** mediante conector o `fetch-drive.mjs`, con permiso de solo lectura. No publicar el archivo de extracción.
5. **Validar** ejecutando `node --test` y `cli.mjs --dry-run`. Guardar reporte y comparar con el manifiesto previamente aprobado.
6. **Bloquear** si hay faltantes, duplicados, imágenes sin derechos, enlaces privados, cambios de precio no aprobados, bajas inesperadas o catálogo vacío.
7. **Crear rama** `content/caliza-AAAA-MM-DD-descripcion` desde la rama de desarrollo verificada; generar PR con diferencias explicadas y datos públicos mínimos.
8. **Probar preview**: navegación, ficha, variantes, valor del carrito recalculado en servidor, cotización, checkout simulado, móvil, contraste, SEO y rendimiento. No ejecutar seed en bases con datos reales.
9. **Solicitar aceptación** por CALIZA de contenido visual, precio, políticas y comportamiento comercial. Sin aprobación no se fusiona ni publica.
10. **Publicar** solo con autorización de producción separada y con identificación del commit/proyecto/ambiente. Verificar resultado y registrar URL/fecha/hash del contenido.
11. **Revertir** a commit/despliegue anterior si se detectan errores, sin eliminar órdenes ni pagos. Registrar incidente.

## Límites técnicos

- No activar GitHub Actions adicionales ni pasarelas reales desde este procedimiento.
- Confirmar rama de producción Vercel: el repositorio actualmente usa `claude/pensive-noether-z9exw8` como predeterminada, lo que **no demuestra** rama Vercel.
- El repositorio GitHub es público: jamás subir información privada o snapshots completos.
- `PAYMENTS_PROVIDER=simulated` mientras no haya integración de pagos aprobada; credenciales siempre fuera del repo.
- El CMS actual usa base SQL; Drive es la fuente del contenido editorial aprobado, no de órdenes, transacciones, reservas o stock en tiempo real.
- Las fotografías necesitan archivo optimizado accesible públicamente y derechos expresos; un enlace privado a Drive no sustituye distribución web.

## Evidencias mínimas por release

Fecha, autor/aprobador, IDs modificados, capturas comparativas, hash de manifiesto, errores = 0, pruebas ejecutadas/resultados, commit SHA, PR, URL preview, aceptación y destino de despliegue.

## Bloqueos pendientes

1. Primeros SKU y materiales reales con precios e inventario aprobados.
2. Fotos optimizadas enlazadas a IDs con derechos de publicación.
3. Upsert idempotente y no destructivo de Payload con identificadores externos.
4. Resolver discrepancia entre branding histórico del repo y Option 08 aprobada.
5. Confirmar rama/proyecto Vercel y pruebas de desplegado, sin tocar Production.
