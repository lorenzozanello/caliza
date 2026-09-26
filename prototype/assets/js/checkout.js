/* Caliza — checkout de ejemplo: plan 50/50, método de pago y confirmación con seguimiento. */
(function () {
  'use strict';
  var C = window.Caliza;
  if (!C) return;
  var SHIPPING = 420000;

  var items = C.cart();
  if (!items.length) items = [{ name: 'Mesa Estrato', image: 'assets/img/p1.jpg', config: 'Gris veteado · 8 personas · Roble macizo', price: 8900000 }];

  var list = document.querySelector('[data-sum-items]');
  var subtotal = 0;
  items.forEach(function (it) {
    subtotal += it.price;
    var row = document.createElement('div');
    row.style.cssText = 'display:grid;grid-template-columns:80px 1fr;gap:14px';
    row.innerHTML = '<img src="' + it.image + '" alt="" style="width:80px;height:80px;object-fit:cover;background:#E9E3D8">' +
      '<div style="display:flex;flex-direction:column;gap:3px"><span class="h3" style="font-size:22px">' + it.name + '</span>' +
      '<span class="small muted">' + it.config + '</span><span class="small tnum">' + C.formatCOP(it.price) + '</span></div>';
    list.appendChild(row);
  });
  var total = subtotal + SHIPPING;
  document.querySelector('[data-subtotal]').textContent = C.formatCOP(subtotal);
  document.querySelector('[data-total]').textContent = C.formatCOP(total);

  var plan = 0.5;
  var method = 'Tarjeta';
  var today = document.querySelector('[data-today]');
  var payLabel = document.querySelector('[data-pay-label]');
  function render(animate) {
    var v = total * plan;
    if (animate) C.tweenNumber(today, v, C.formatCOP); else { today.textContent = C.formatCOP(v); today.setAttribute('data-value', v); }
    payLabel.textContent = 'Pagar ' + C.formatCOP(v) + ' con ' + method.toLowerCase().replace('pse', 'PSE').replace('nequi', 'Nequi').replace('bancolombia', 'Bancolombia');
  }

  function group(selector, onPick) {
    var btns = document.querySelectorAll(selector);
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        onPick(b);
      });
    });
  }
  group('[data-plan]', function (b) { plan = parseFloat(b.getAttribute('data-plan')); render(true); });
  group('[data-method]', function (b) { method = b.getAttribute('data-method'); render(false); });

  var form = document.getElementById('checkout-form');
  var payBtn = document.querySelector('[data-pay]');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (payBtn.classList.contains('is-loading')) return;
    payBtn.classList.add('is-loading');
    payLabel.textContent = 'Procesando pago…';
    setTimeout(function () {
      var order = 'C-' + String(Math.floor(1000 + Math.random() * 9000));
      document.querySelector('[data-order]').textContent = order;
      document.querySelector('[data-paid-line]').textContent = 'Hoy · ' + C.formatCOP(total * plan) + ' · ' + method;
      var wa = document.querySelector('[data-wa-order]');
      wa.setAttribute('href', C.waLink('Hola, tengo una pregunta sobre mi pedido ' + order + '.'));
      wa.setAttribute('target', '_blank'); wa.setAttribute('rel', 'noopener');
      document.body.classList.add('is-paid');
      payBtn.classList.remove('is-loading');
      payBtn.disabled = true;
      payLabel.textContent = 'Pago recibido ✓';
      C.store.set('caliza_cart', []);
      C.updateCartCount(false);
      window.scrollTo({ top: 0, behavior: C.reduce ? 'auto' : 'smooth' });
      if (window.gsap && !C.reduce) {
        window.gsap.from('.success > *', { y: 24, opacity: 0, duration: 1, stagger: .08, ease: 'power3.out' });
        window.gsap.from('.track li', { x: -12, opacity: 0, duration: .8, stagger: .1, ease: 'power3.out', delay: .3 });
      }
    }, 1400);
  });

  render(false);
})();
