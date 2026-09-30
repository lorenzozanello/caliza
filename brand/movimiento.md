# Movimiento

El movimiento revela y confirma; nunca actúa. Una coreografía cuidada vale más que muchos efectos sueltos.

## Curvas y duraciones

| Nombre | Valor | Uso |
| --- | --- | --- |
| `ease` | `cubic-bezier(.22, 1, .36, 1)` | Casi todo: entradas, revelados, hover |
| `ease-in` | `cubic-bezier(.64, 0, .78, 0)` | Salidas: cortina de cambio de página |
| Rápido | 220–360 ms | Hover, estados de botón, selección |
| Considerado | 520–720 ms | Paneles, carrito lateral, menú, cambios de imagen |
| Editorial | 1.1–1.6 s | Revelados de sección e imagen |
| Escena | ligado al scroll | Parallax, proyecto que se abre, colección horizontal |

## Lo que se anima

- **Entrada del hero** (una vez por sesión): símbolo, cortina que sube, titular línea por línea desde una máscara.
- **Revelados** al entrar en pantalla: desplazamiento de 34px y opacidad desde 0.15, nunca desde 0.
- **Imágenes**: se abren desde un marco (`clip-path`) mientras la foto pasa de escala 1.2 a 1.
- **Escenas con scroll**: parallax del hero, proyecto que se abre a pantalla completa, colección horizontal, línea del método, manifiesto que se enciende palabra por palabra.
- **Microinteracciones**: subrayado que se recorre, flecha que avanza 5px, botón que se llena desde abajo, botones magnéticos, cursor contextual ("Ver proyecto", "Configurar"), precio que cuenta hasta el nuevo valor, indicador deslizante del selector de tamaño.

## Lo que no se hace

- Rebotes ni curvas elásticas.
- Secuestrar el scroll o impedir que el usuario avance.
- Animar párrafos palabra por palabra fuera del manifiesto.
- Autoreproducir video con sonido.
- Contadores regresivos, confeti o urgencia falsa.

## Accesibilidad

Con `prefers-reduced-motion: reduce` todo el movimiento se desactiva: sin entrada, sin scroll suave, sin escenas, y el contenido se muestra en su estado final.
