# VariantSelector

Configurador de la ficha de producto: precio, piedra (muestras con textura real), tamaño y base (control segmentado con indicador deslizante).

- Las muestras de piedra siempre muestran la textura, nunca un círculo de color. El nombre de la piedra elegida aparece a la derecha.
- Al cambiar una opción, el precio cuenta hasta el nuevo valor y la foto de detalle cambia a la piedra elegida.
- Debajo del selector siempre va la nota: "Cada placa es única: la veta de tu pieza será distinta a la de la foto."
- Cada grupo usa `role="group"` con `aria-label` y cada opción `aria-pressed`.
