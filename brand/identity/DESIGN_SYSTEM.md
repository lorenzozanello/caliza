# CALIZA GROUP — autoridad de diseño

**La fuente de verdad es exclusivamente el paquete entregado por el propietario el 11-11-2026**, conservado sin cambios en `brand/authority/caliza-group-design-system.zip`. SHA-256: `11512e921f109d12be1a7ba7a2a6ce5e1534dc91b23ddef588409137afa100e7`.

Orden de precedencia en caso de discrepancia:

1. [`brand/authority/caliza-group-design-system/AI_BRIEF.md`](../authority/caliza-group-design-system/AI_BRIEF.md) — reglas integrales de marca, diseño, componentes y accesibilidad.
2. [`brand/authority/caliza-group-design-system/tokens/tokens.json`](../authority/caliza-group-design-system/tokens/tokens.json) — valores exactos, temas claro y oscuro.
3. [`brand/authority/caliza-group-design-system/MANUAL.md`](../authority/caliza-group-design-system/MANUAL.md) — manual editorial.
4. [`brand/authority/caliza-group-design-system/logos/`](../authority/caliza-group-design-system/logos/) y [`simbolos/`](../authority/caliza-group-design-system/simbolos/) — **vectores rectores**, sin redibujado en CSS.
5. [`brand/authority/caliza-group-design-system/components/`](../authority/caliza-group-design-system/components/) — especificaciones UI originales. El bundle React 18 es una referencia, no se inyecta directamente en Next.js.

El antiguo sistema de identidad generado a partir de la imagen quedó **supeditado** a este paquete. `glyphs.json` y `scripts/extract-glyphs.py` se conservan únicamente como evidencia histórica y no participan en la generación actual.

## Distribución reproducible

Ejecutar desde la raíz del repositorio:

```sh
node brand/identity/scripts/build-identity.mjs
node brand/identity/tests/identity.test.mjs
```

El distribuidor toma los SVG **sin alterar las curvas** del paquete original y genera sus nombres de compatibilidad para:

- `brand/identity/dist/` — copia web normalizada de SVG.
- `web/public/brand/` — storefront Next.js.
- `prototype/assets/img/brand/` — experiencia estática.
- `web/public/brand/fonts/` y `prototype/brand/fonts/` — fuentes WOFF2 licenciadas incluidas en el ZIP.
- `web/src/styles/authority-tokens.css` y `prototype/assets/css/authority-tokens.css` — variables semánticas oficiales y `@font-face` con rutas locales.
- `web/src/styles/identity.css` y `prototype/assets/css/identity.css` — adaptación del sistema a la interfaz existente.

La familia de compatibilidad expone los lockups completos en variantes `primary`, `inverse` y `monochrome`; `monochrome` para submarcas es una versión a tinta Marine Ink derivada del principal y debe validarse antes de uso impreso. Los iconos separados incluyen `primary` Terracotta y `limewash`. La variante `inverse` mantiene Terracotta según el manual. No se inventa símbolo corporativo de Group.

## Regla de integración

`BrandMark` es un adaptador del SVG rector; nunca recompone el logotipo con texto. Las proporciones reales son 347.2/199 (Group) y 347.2/258.8 (submarcas). Los tokens se aplican después de los estilos antiguos para evitar que colores/contrastes heredados se impongan. Las páginas pendientes de migración completa se detallan en la auditoría.
