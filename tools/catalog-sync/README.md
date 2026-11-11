# CALIZA GROUP · sincronización editorial bajo demanda (v1)

**Estado:** módulo aislado, sin publicar datos ni modificar el sitio/Payload. Node.js 20+; sin dependencias nuevas.

## Fuentes y separación de responsabilidades

- **Google Sheets CALIZA 2026**: fuente maestra para fichas, precios y aprobaciones comerciales.
- **Google Drive CALIZA PRODUCTOS**: fuentes originales intactas; los enlaces privados NO son URLs de imágenes públicas.
- **GitHub**: código y propuesta de contenido público verificado. Nunca costos, márgenes, proveedores, secretos ni snapshot crudo.
- **Payload/Postgres**: pedidos, clientes, pagos e inventario operativo. Este módulo no accede a esa base ni ejecuta `seed`.
- **Vercel**: previews y publicación solo después de revisión y autorización.

## Preparar un snapshot de Sheets

Opción A (asistente conectado): el operador autorizado lee las diez pestañas mediante el conector Google Sheets y genera **fuera del repositorio** un JSON `{ "spreadsheetId":"...", "tabs": {"01_PRODUCTOS":[[cabeceras],[valores]...] } }`.

Opción B (operador con OAuth de solo lectura ya configurado):

```bash
export CALIZA_GOOGLE_ACCESS_TOKEN='[token temporal configurado por el operador]'
node tools/catalog-sync/fetch-drive.mjs --out /tmp/caliza-sheet-snapshot.json
unset CALIZA_GOOGLE_ACCESS_TOKEN
```

No subas el token ni el snapshot a GitHub. Nunca conviertas la hoja a pública para facilitar su lectura.

## Verificar cambios sin publicar

```bash
node --test tools/catalog-sync/test.mjs
node tools/catalog-sync/cli.mjs \
  --input /tmp/caliza-sheet-snapshot.json \
  --out /tmp/caliza-public-proposal.json \
  --report /tmp/caliza-validation.json \
  --dry-run
```

Para comparar con una versión aprobada existente, añade `--baseline /ruta/a/release-anterior.json`. Si detecta bajas, se bloquea por defecto.

El comando **no** modifica Payload, GitHub, Vercel, pagos ni el catálogo maestro. Un resultado válido es una propuesta JSON para revisión posterior. El importador hacia Payload es una fase separada: sus colecciones actuales no tienen un ID externo/SKU único ni un mapeo de medios suficientemente seguro para upserts reales.

## Regla de publicación

Un producto requiere: estado `Aprobado`, slug único, descripción, marca vigente, variantes/SKU aprobados, material aprobado, precio e impuestos/anticipo aprobados, inventario o plazo aprobado, una foto real con derechos confirmados y URL web optimizada, y fila **individual** en `10_CONTROL` para la entidad `PRODUCTO`. Una aprobación de *familia de medios* nunca sustituye la aprobación individual.

Nunca rellenar vacíos con los 16 productos ficticios de prototipo o con los 37 modelos históricos. No transferir automáticamente contenidos al CMS si el resultado es vacío o contiene errores.

## Publicación manual segura (futura fase)

1. Guardar el informe de diferencias y el hash de la propuesta en el expediente del release.
2. Preparar PR en rama de contenido aislada. No subir snapshots crudos ni costos.
3. Conectar/adaptar el JSON aprobado a las colecciones reales de Payload en un **entorno de prueba** con identificadores externos estables.
4. Ejecutar typecheck/build/e2e/SEO/accesibilidad y probar pagos simulados.
5. Revisar el preview en Vercel y obtener aprobación escrita de CALIZA.
6. Solo entonces autorizar el merge y despliegue productivo. Nunca activar Wompi real desde este módulo.

**Pendiente técnico explícito:** implementar y probar la importación idempotente a Payload cuando existan los primeros SKU, relaciones de medios y reglas comerciales aprobados, y confirmar rama/proyecto de producción de Vercel.
