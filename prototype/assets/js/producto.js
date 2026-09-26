/* Caliza — ficha de producto: configurador, precio, carrito lateral. Datos de ejemplo. */
(function () {
  'use strict';
  var C = window.Caliza;
  if (!C) return;

  var PRODUCT = {
    id: 'mesa-estrato',
    name: 'Mesa Estrato',
    image: 'assets/img/p1.jpg',
    stones: [
      { name: 'Gris veteado', img: 'assets/img/m_piedra.jpg', add: 0 },
      { name: 'Oscuro profundo', img: 'assets/img/piedra_macro.jpg', add: 600000 },
      { name: 'Arena texturizada', img: 'assets/img/m_textura.jpg', add: 1200000 }
    ],
    sizes: [
      { label: '6 personas', dims: '180 × 90 × 75 cm', price: 7400000 },
      { label: '8 personas', dims: '220 × 100 × 75 cm', price: 8900000 },
      { label: '10 personas', dims: '260 × 110 × 75 cm', price: 10600000 }
    ],
    bases: [
      { label: 'Roble macizo', add: 0 },
      { label: 'Metal negro', add: 350000 }
    ]
  };
  var CITIES = ['barranquilla', 'bogota', 'bogotá', 'medellin', 'medellín', 'cartagena', 'cali', 'santa marta', 'bucaramanga'];

  var state = { stone: 0, size: 1, base: 0 };
  var $ = function (s) { return document.querySelector(s); };
  var priceEl = $('[data-price]');
  var halfEl = $('[data-half]');
  var detail = $('[data-stone-detail]');

  function total() { return PRODUCT.sizes[state.size].price + PRODUCT.stones[state.stone].add + PRODUCT.bases[state.base].add; }
  function summary() { return PRODUCT.stones[state.stone].name + ' · ' + PRODUCT.sizes[state.size].label + ' · ' + PRODUCT.bases[state.base].label; }

  function render(animate) {
    var t = total();
    if (animate) { C.tweenNumber(priceEl, t, C.formatCOP); C.tweenNumber(halfEl, t / 2, C.formatCOP); }
    else { priceEl.textContent = C.formatCOP(t); priceEl.setAttribute('data-value', t); halfEl.textContent = C.formatCOP(t / 2); halfEl.setAttribute('data-value', t / 2); }
    $('[data-stone-name]').textContent = PRODUCT.stones[state.stone].name;
    $('[data-size-dims]').textContent = PRODUCT.sizes[state.size].dims;
    var wa = $('[data-wa-config]');
    wa.setAttribute('href', C.waLink('Hola, me interesa la ' + PRODUCT.name + ' en ' + summary() + '.'));
    wa.setAttribute('target', '_blank'); wa.setAttribute('rel', 'noopener');
  }

  // Segmentos con indicador deslizante
  function placeThumb(group) {
    var on = group.querySelector('[aria-pressed="true"]');
    var thumb = group.querySelector('.segmented__thumb');
    if (!on || !thumb) return;
    thumb.style.width = on.offsetWidth + 'px';
    thumb.style.transform = 'translateX(' + on.offsetLeft + 'px)';
  }
  document.querySelectorAll('[data-segmented]').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      group.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      if (b.hasAttribute('data-size')) state.size = +b.getAttribute('data-size');
      if (b.hasAttribute('data-base')) state.base = +b.getAttribute('data-base');
      placeThumb(group);
      render(true);
    });
    placeThumb(group);
  });
  window.addEventListener('resize', function () { document.querySelectorAll('[data-segmented]').forEach(placeThumb); });

  // Piedras: cambia también la foto de detalle
  document.querySelectorAll('[data-stone]').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('[data-stone]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      state.stone = +b.getAttribute('data-stone');
      var src = PRODUCT.stones[state.stone].img;
      if (window.gsap && !C.reduce) {
        window.gsap.to(detail, { opacity: 0, scale: 1.04, duration: .25, ease: 'power2.in', onComplete: function () {
          detail.src = src;
          window.gsap.fromTo(detail, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: .8, ease: 'power3.out' });
        } });
      } else { detail.src = src; }
      render(true);
    });
  });

  // Ciudad de envío
  var city = $('[data-city]');
  var cityMsg = $('[data-city-msg]');
  city.addEventListener('input', function () {
    var v = city.value.trim().toLowerCase();
    if (v.length < 3) { cityMsg.textContent = ''; return; }
    var ok = CITIES.some(function (c) { return c.indexOf(v) === 0; });
    cityMsg.style.color = ok ? '#2F5D50' : 'var(--veta)';
    cityMsg.textContent = ok ? 'Envío con instalación disponible · costo según acceso' : 'Te confirmamos opciones de envío por WhatsApp';
  });

  // Carrito lateral
  var itemsEl = $('[data-cart-items]');
  var totalEl = $('[data-cart-total]');
  function drawCart() {
    var items = C.cart();
    itemsEl.innerHTML = '';
    if (!items.length) { itemsEl.innerHTML = '<p class="muted">Tu carrito está vacío.</p>'; }
    var sum = 0;
    items.forEach(function (it, i) {
      sum += it.price;
      var row = document.createElement('div');
      row.className = 'drawer__item';
      row.innerHTML = '<img src="' + it.image + '" alt="">' +
        '<div style="display:flex;flex-direction:column;gap:4px"><span class="h3" style="font-size:22px">' + it.name + '</span>' +
        '<span class="small muted">' + it.config + '</span><span class="small muted">Bajo pedido · 6 a 8 semanas</span>' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px"><span class="tnum">' + C.formatCOP(it.price) + '</span>' +
        '<button class="link" data-remove="' + i + '" style="border:0;background:none;padding:0;font-size:13px"><span class="u">Quitar</span></button></div></div>';
      itemsEl.appendChild(row);
    });
    totalEl.textContent = C.formatCOP(sum);
  }
  itemsEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-remove]');
    if (!b) return;
    var items = C.cart(); items.splice(+b.getAttribute('data-remove'), 1);
    C.store.set('caliza_cart', items); drawCart(); C.updateCartCount(false);
  });
  var drawer = $('.drawer');
  function openCart() { drawCart(); document.body.classList.add('drawer-open'); drawer.setAttribute('aria-hidden', 'false'); if (C.lenis) C.lenis.stop(); document.querySelector('.wa-float').classList.remove('is-visible'); }
  function closeCart() { document.body.classList.remove('drawer-open'); drawer.setAttribute('aria-hidden', 'true'); if (C.lenis) C.lenis.start(); }
  document.querySelectorAll('[data-open-cart]').forEach(function (b) { b.addEventListener('click', openCart); });
  document.querySelectorAll('[data-close-cart]').forEach(function (b) { b.addEventListener('click', closeCart); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCart(); });

  var addBtn = $('[data-add]');
  addBtn.addEventListener('click', function () {
    var items = C.cart();
    items.push({ id: PRODUCT.id, name: PRODUCT.name, image: PRODUCT.image, config: summary(), price: total() });
    C.store.set('caliza_cart', items);
    C.updateCartCount(true);
    addBtn.classList.add('is-done');
    setTimeout(openCart, 650);
    setTimeout(function () { addBtn.classList.remove('is-done'); }, 2400);
  });

  render(false);
})();
