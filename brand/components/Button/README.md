# Button

Botón de acción. Un solo botón primario por pantalla visible; lo demás es `cz-btn--ghost` o `cz-link`.

## Variantes
- `cz-btn` — primario sobre fondos claros. Al pasar el cursor se llena desde abajo con `nogal`.
- `cz-btn--ghost` — secundario sobre fondos claros.
- `cz-btn--light` y `cz-btn--ghost-light` — sobre `carbon` o sobre fotografía oscura.
- `cz-btn--wa` — solo para acciones que abren WhatsApp. Lleva el ícono de WhatsApp.
- `cz-btn--sm` — 44px de alto, para el encabezado.
- Estados: `is-loading` con `cz-spinner`, y `disabled`.

## Contenido
Verbo + objeto ("Agregar al carrito", "Ver proyecto"). Nunca "Clic aquí" ni "Más información". Una flecha `cz-arrow` solo cuando la acción lleva a otra página o sección.

## Accesibilidad
Altura mínima 44px. Usa `<a>` si navega y `<button>` si ejecuta una acción.
