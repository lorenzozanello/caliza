# Contrato de datos CALIZA GROUP v1 · 11/11/2026

Fuente maestra: https://docs.google.com/spreadsheets/d/1ibSKxlHH2uPfRwxaiQcrocMWgkDX4qjvw-g_TGkqk4g/edit
Origen multimedia inalterable: https://drive.google.com/drive/folders/1EqynOIwyh21PGnzsNIPxZNv_PqUVRGtF

## Identidad y propietario de los registros

| Tabla | Identidad obligatoria | Aprobación para publicar |
| --- | --- | --- |
| 01_PRODUCTOS | `producto_id` único | `estado_catalogo=Aprobado`, `slug_web` válido y fila `10_CONTROL` individual |
| 02_VARIANTES | `sku` único, referencia a `producto_id` | `estado=Aprobado`, material principal aprobado |
| 03_MATERIALES | `material_id` único | `estado=Aprobado`, `slug_web`, `10_CONTROL` |
| 04_PRECIOS | `sku` único, COP | `estado=Aprobado`, aprobador, impuesto, anticipo + saldo = 100 |
| 05_INVENTARIO | `sku` único | `estado=Aprobado`; stock numérico en inmediatos, plazo en bajo pedido |
| 06_IMAGENES | `medio_id` único | derechos + aprobación `Sí`, producto real `Sí`, alt y `url_asset_publico_optimizado` HTTPS |
| 07_PROYECTOS | `proyecto_id` único | estado, permiso, ficha, imágenes y control individuales |
| 08_STONE_CARE | `care_id` único | estado, descripción, slug y control individuales |
| 09_LOGISTICA | `regla_id` único | revisión comercial/logística y fechas de vigencia cuando aplique |
| 10_CONTROL | entidad + registro_id | datos, fotos, precio, legal y `listo_publicar` todos Sí |

No inferir material, acabado, modelo, ubicación, permiso o precio a partir de una foto. Los archivos históricos no son SKU reales. La dimensión comercial, impuestos y precios los aprueba CALIZA.

## Campos añadidos sin tocar registros anteriores

- `01_PRODUCTOS!Q:S`: `slug_web`, `seo_title`, `seo_descripcion`.
- `03_MATERIALES!S`: `slug_web`.
- `06_IMAGENES!T:U`: `url_asset_publico_optimizado`, `orden_galeria`.
- `07_PROYECTOS!O:P`: `slug_web`, `seo_title`.
- `08_STONE_CARE!O`: `slug_web`.

Solo las columnas nuevas pueden completarse; las 178 filas de medios originales siguen intactas.

## Datos que NUNCA se exportan a la web pública

Proveedores, costos, márgenes, responsables internos, notas administrativas, números de documentos, secretos, tokens, snapshots completos, enlaces privados de originales ni datos de pedidos/clientes.

El sincronizador `tools/catalog-sync` produce una **propuesta de contenido público** con listas blancas de campos. Al menor error bloquea la salida. No borra referencias de una versión anterior sin autorización específica.

## Diferencias con el CMS actual (por resolver en fase de integración)

El repositorio tiene un `web/` Next.js + Payload. `Products.ts` usa precio base y opciones configurables; la hoja maestra representa SKU y precios por variante. Debemos definir un mapeo uno-a-muchos sin perder configuraciones. El CMS no dispone todavía de `producto_id` externo ni de `medio_id` para un upsert seguro; tampoco debe confundir el stock comercial con la reserva de unidades ya vendidas.

Las categorías antiguas **Caliza Stone/Design/Care** del código no sustituyen la marca aprobada **CALIZA GROUP / CALIZA STONE DESIGN / CALIZA LIVING DESIGN / CALIZA STONE CARE** ni la estética Option 08 Warm Mediterranean.

## Gates

G0: identidad y derechos; G1: integridad referencial; G2: aprobación comercial/legal; G3: propuesta sin datos privados; G4: diferencias y bajas revisadas; G5: entorno de prueba y validación visual/funcional; G6: autorización humana de publicación.
