# Caliza — guía para agentes

Sitio web de Caliza: espacios y piezas en piedra natural. Tres generaciones de marmoleros italianos; la tercera diseña en Colombia. Líneas: Caliza Stone (transformar), Caliza Design (habitar), Caliza Care (preservar).

## Fuente de verdad

- `brand/README.md` — sistema de marca: arquitectura, logo, color, tipografía, retícula, forma. Léelo antes de diseñar o escribir interfaz.
- `brand/tokens.json` — todos los valores de diseño. `node brand/scripts/build-tokens.mjs` genera `brand/tokens.css`.
- `brand/components/` — estilos (`bundle.css`, clases `cz-*`) y guía de cada componente.
- `brand/fotografia.md`, `brand/movimiento.md`, `brand/voz-y-tono.md` — reglas de fotografía, animación y escritura.
- `prototype/` — prototipo navegable (home, producto, checkout). Es la referencia de experiencia; su CSS es anterior a los tokens y debe migrar a ellos.

## Reglas

- Usa solo tokens y componentes existentes. No introduzcas colores, tamaños de letra, espaciados, radios, sombras ni curvas de movimiento nuevos; si hace falta uno, agrégalo primero a `brand/tokens.json` y documéntalo.
- Interfaz en español de Colombia. Solo Stone, Design y Care quedan en inglés.
- Un solo botón primario por pantalla visible. El verde de WhatsApp solo en acciones que abren WhatsApp.
- La piedra es la protagonista: al listar materiales, la piedra va primero.
- No inventes datos de negocio (proyectos, precios, clientes, historia). Usa datos de ejemplo marcados como "ejemplo".
- Nunca presentes una imagen generada como un proyecto o producto real.
- Todo el movimiento se desactiva con `prefers-reduced-motion`.
- Accesibilidad WCAG 2.2 AA: contraste 4.5:1 en texto (3:1 desde 24px), foco visible, objetivos táctiles de 44px, etiquetas en todos los campos.

## Definition of done de una tarea

1. Cumple los criterios de aceptación del issue.
2. Usa solo tokens y componentes del sistema de marca.
3. Funciona en 390, 768 y 1440 px de ancho, sin desplazamiento horizontal.
4. Sin errores de consola.
5. Las pruebas pasan (cuando exista el arnés de pruebas: end-to-end, accesibilidad y rendimiento).
6. Commit en la rama asignada y push.
