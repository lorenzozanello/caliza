# NavBar

Barra de navegación de una línea: logotipo pequeño (sin filete) a la izquierda y enlaces en Montserrat 11px, mayúsculas y 0.22em de tracking a la derecha, sobre `surface` con filete inferior `line`.

- **Recibe**: `links` (`[{label, href, active}]`, máximo cinco: PROYECTOS, MARCAS, NOSOTROS, CONTACTO), `homeHref` y `label` (nombre accesible del `<nav>`).
- El enlace activo se subraya en `accent`; el resto, en `line-strong` al pasar el cursor.
- En pantallas estrechas, el consumidor debe colapsar los enlaces en un menú propio.
