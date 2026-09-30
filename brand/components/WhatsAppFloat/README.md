# WhatsAppFloat

Botón flotante de WhatsApp, abajo a la derecha. Es el canal principal de conversación.

- Aparece después del hero y se oculta en la sección de contacto y cuando el carrito está abierto, para no duplicar ni tapar acciones.
- La etiqueta se despliega al pasar el cursor y una vez, durante 3 segundos, la primera vez que aparece (`is-teasing`).
- El enlace abre `https://wa.me/<número>?text=` con un mensaje según la página y el origen de la visita (`utm_source`).
- Nunca se monta sobre un botón o un texto: deja libre la esquina inferior derecha en móvil.
