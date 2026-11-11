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
    payLabel.textContent = 'Pago no habilitado · demostración';
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
  payBtn.disabled = true;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    payLabel.textContent = 'Pago no habilitado · demostración';
  });

  render(false);
})();
