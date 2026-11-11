# CALIZA GROUP — fuente única de verdad (11 de noviembre de 2026)

Este directorio conserva la entrega **suministrada por el propietario como sistema rector** de identidad digital y visual. Cualquier cambio posterior de logos, color, tipografía o componentes debe comenzar aquí, no en los archivos publicados o duplicados.

## Originales inmutables

| Archivo | Integridad | Uso |
| --- | --- | --- |
| `caliza-group-design-system.zip` | SHA-256 `11512e921f109d12be1a7ba7a2a6ce5e1534dc91b23ddef588409137afa100e7` | Entrega original exacta, no editar |
| `CALIZA_GROUP_AI_BRIEF.md` | SHA-256 `f6fec0ad47255cab202ac7a6680495275ed90dcf04838a1c9332499a29490e55` | Brief independiente exacto, no editar |
| `caliza-group-design-system/` | Extracción verificada del ZIP | Consulta del manual, SVG, tokens, fuentes y componentes |

La carpeta extraída se rastrea en GitHub para permitir revisión de cambios por archivo. **No se modifican estos archivos.** Los SVG de `logos/` y `simbolos/` son la referencia geométrica suministrada, pero la entrega misma indica que fueron reconstruidos; no representan una certificación independiente de equivalencia con masters de diseño aún no recibidos.

## Jerarquía

1. Brief rector `caliza-group-design-system/AI_BRIEF.md` y tokens precisos `tokens/tokens.json`.
2. Manual `MANUAL.md`, SVG maestros y archivos de fuentes licenciadas.
3. Componentes documentados en `components/`.
4. Adaptador en `../identity/scripts/build-identity.mjs` (solo distribuye y aplica estilos; no altera geometría).
5. Versiones públicas en `../../prototype/` y `../../web/`, que son **artefactos derivados**.

En caso de discrepancia, corregir el adaptador o la página y **no** modificar el original para que coincida con ella.

## Validación reproducible

Desde la raíz:

```sh
node brand/identity/scripts/build-identity.mjs
node brand/identity/tests/identity.test.mjs
node prototype/tests/smoke.cjs
```

El test comprueba el SHA-256 del ZIP rector, la igualdad de SVG originales frente a los distribuidos, copias de WOFF2, tokens y generación determinista. Las páginas y los flujos de compra se verifican por separado.

La sincronización no sustituye la revisión visual real de la marca en móviles, el control de contraste de cada vista ni la confirmación de arte original por CALIZA.
