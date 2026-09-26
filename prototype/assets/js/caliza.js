/* Caliza — prototipo navegable. Movimiento, WhatsApp con origen de campaña y carrito. */
(function () {
  'use strict';

  // Número de WhatsApp Business en formato internacional, sin "+".
  var CONFIG = { whatsapp: '570000000000' };

  var root = document.documentElement;
  var page = document.body.getAttribute('data-page') || '';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  if (gsap && ST) gsap.registerPlugin(ST);

  /* ---------- Almacenamiento seguro ---------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- Origen de campaña (utm_source) ---------- */
  function campaignOrigin() {
    var src = '';
    try {
      src = new URLSearchParams(window.location.search).get('utm_source') || '';
      if (src) store.set('caliza_origin', src); else src = store.get('caliza_origin', '');
    } catch (e) {}
    var names = { instagram: 'Instagram', ig: 'Instagram', tiktok: 'TikTok', facebook: 'Facebook', fb: 'Facebook', google: 'Google' };
    return names[String(src).toLowerCase()] || src || 'la web';
  }

  function waLink(message) {
    var text = message + ' (Los vi en ' + campaignOrigin() + '.)';
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text);
  }

  function bindWhatsApp(scope) {
    (scope || document).querySelectorAll('[data-wa]').forEach(function (el) {
      el.setAttribute('href', waLink(el.getAttribute('data-wa')));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });
  }

  /* ---------- Carrito ---------- */
  function cart() { return store.get('caliza_cart', []); }
  function updateCartCount(bump) {
    var n = cart().length;
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = n;
      el.hidden = n === 0;
      if (bump && n) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
    });
  }

  var money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
  function formatCOP(v) { return money.format(Math.round(v)).replace(/ /g, ' '); }

  function tweenNumber(el, to, format) {
    var from = parseFloat(el.getAttribute('data-value') || '0');
    el.setAttribute('data-value', to);
    if (!gsap || reduce) { el.textContent = format(to); return; }
    var o = { v: from };
    gsap.to(o, { v: to, duration: .9, ease: 'power3.out', onUpdate: function () { el.textContent = format(o.v); } });
  }

  window.Caliza = { waLink: waLink, bindWhatsApp: bindWhatsApp, store: store, cart: cart, updateCartCount: updateCartCount, formatCOP: formatCOP, tweenNumber: tweenNumber, reduce: reduce };

  bindWhatsApp();
  updateCartCount(false);

  /* ---------- Intención en el cierre ---------- */
  var intentBtn = document.querySelector('[data-wa-intent]');
  function setIntent(label) {
    if (!intentBtn) return;
    intentBtn.setAttribute('href', waLink('Hola, quiero empezar con ' + label + '.'));
    intentBtn.setAttribute('target', '_blank');
    intentBtn.setAttribute('rel', 'noopener');
  }
  document.querySelectorAll('[data-intent]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('[data-intent]').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      chip.setAttribute('aria-pressed', 'true');
      setIntent(chip.getAttribute('data-intent'));
    });
  });
  var pressed = document.querySelector('[data-intent][aria-pressed="true"]');
  if (pressed) setIntent(pressed.getAttribute('data-intent'));

  /* ---------- Scroll suave ---------- */
  var lenis = null;
  if (!reduce && window.Lenis && gsap && ST) {
    lenis = new window.Lenis({ lerp: .09, wheelMultiplier: .95 });
    lenis.on('scroll', ST.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  window.Caliza.lenis = lenis;

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      if (lenis) lenis.scrollTo(target, { offset: -40, duration: 1.4 });
      else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Encabezado ---------- */
  var header = document.querySelector('.site-header');
  var hero = document.querySelector('.hero');
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    if (header) {
      var threshold = hero ? hero.offsetHeight - 90 : 10;
      header.classList.toggle('is-solid', y > threshold);
      var menuOpen = document.body.classList.contains('menu-open');
      header.classList.toggle('is-hidden', !menuOpen && y > 700 && y > lastY + 2);
      if (y < lastY - 2) header.classList.remove('is-hidden');
    }
    updateWa(y);
    lastY = y;
  }

  /* ---------- WhatsApp flotante ---------- */
  var wa = document.querySelector('.wa-float');
  var contact = document.getElementById('contacto');
  var contactVisible = false;
  var teased = false;
  if (wa && contact && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) { contactVisible = entries[0].isIntersecting; updateWa(window.scrollY); }, { threshold: .25 }).observe(contact);
  }
  function updateWa(y) {
    if (!wa) return;
    var start = hero ? hero.offsetHeight * .7 : 320;
    var show = y > start && !contactVisible && !document.body.classList.contains('drawer-open');
    wa.classList.toggle('is-visible', show);
    if (show && !teased) {
      teased = true;
      wa.classList.add('is-teasing');
      setTimeout(function () { wa.classList.remove('is-teasing'); }, 3200);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  var menu = document.getElementById('menu');
  var menuBtn = document.querySelector('.menu-btn');
  function openMenu() {
    if (!menu) return;
    menu.classList.add('is-open'); menu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    if (lenis) lenis.stop();
  }
  function closeMenu() {
    if (!menu || !menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open'); menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
  }
  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  var menuClose = document.querySelector('.menu-close');
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Transición entre páginas ---------- */
  var nativeTransitions = 'CSSViewTransitionRule' in window;
  document.querySelectorAll('a[href$=".html"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (nativeTransitions || reduce || e.metaKey || e.ctrlKey || a.target === '_blank') return;
      e.preventDefault();
      document.body.classList.add('is-leaving');
      setTimeout(function () { window.location.href = a.getAttribute('href'); }, 520);
    });
  });
  window.addEventListener('pageshow', function () { document.body.classList.remove('is-leaving'); });

  /* ---------- Cursor contextual y botones magnéticos ---------- */
  if (finePointer && !reduce && gsap) {
    root.classList.add('has-cursor');
    var cursor = document.querySelector('.cursor');
    if (cursor) {
      var label = cursor.querySelector('.cursor__label');
      var cx = gsap.quickTo(cursor, 'x', { duration: .45, ease: 'power3.out' });
      var cy = gsap.quickTo(cursor, 'y', { duration: .45, ease: 'power3.out' });
      window.addEventListener('mousemove', function (e) { cx(e.clientX); cy(e.clientY); });
      document.querySelectorAll('[data-cursor]').forEach(function (el) {
        el.addEventListener('mouseenter', function () { label.textContent = el.getAttribute('data-cursor'); cursor.classList.add('is-active'); });
        el.addEventListener('mouseleave', function () { cursor.classList.remove('is-active'); });
      });
    }
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      var mx = gsap.quickTo(el, 'x', { duration: .6, ease: 'power3.out' });
      var my = gsap.quickTo(el, 'y', { duration: .6, ease: 'power3.out' });
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * .22);
        my((e.clientY - r.top - r.height / 2) * .3);
      });
      el.addEventListener('mouseleave', function () { mx(0); my(0); });
    });
  }

  if (!gsap || !ST) return;

  /* ---------- Entrada del hero ---------- */
  if (page === 'home' && hero) {
    var heroImg = hero.querySelector('.hero__media img');
    var lines = hero.querySelectorAll('.line > span');
    var fades = hero.querySelectorAll('[data-hero-fade]');
    if (!reduce) {
      var seen = false;
      try { seen = sessionStorage.getItem('caliza_intro') === '1'; sessionStorage.setItem('caliza_intro', '1'); } catch (e) {}
      var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      if (!seen) {
        root.classList.add('js-intro');
        var intro = document.querySelector('.intro');
        tl.from(intro.querySelector('img'), { opacity: 0, scale: .7, duration: .7, ease: 'power3.out' })
          .to(intro.querySelector('img'), { opacity: 0, y: -12, duration: .35, ease: 'power2.in' }, '+=.15')
          .to(intro, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '-=.1')
          .add(function () { root.classList.remove('js-intro'); intro.style.transform = ''; });
      }
      tl.from(heroImg, { scale: 1.22, duration: 2.2, ease: 'expo.out' }, seen ? 0 : '-=.75')
        .from(lines, { yPercent: 108, duration: 1.3, stagger: .09 }, '<.15')
        .from(fades, { opacity: 0, y: 18, duration: 1.1, stagger: .12 }, '<.35');
    }
    gsap.to('[data-hero-media]', { yPercent: 16, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }

  if (reduce) return;

  /* ---------- Revelados ---------- */
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    gsap.from(el, { y: 34, opacity: .15, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });
  gsap.utils.toArray('[data-img-reveal]').forEach(function (el) {
    var img = el.querySelector('img');
    var t = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    t.fromTo(el, { clipPath: 'inset(12% 10% 12% 10%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.out' })
     .from(img, { scale: 1.25, duration: 2, ease: 'expo.out' }, 0);
  });

  /* ---------- Manifiesto: la frase se enciende palabra por palabra ---------- */
  document.querySelectorAll('[data-words]').forEach(function (p) {
    var words = p.textContent.trim().split(/\s+/);
    p.innerHTML = words.map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    var spans = p.querySelectorAll('.w');
    ST.create({
      trigger: p, start: 'top 78%', end: 'bottom 45%', scrub: true,
      onUpdate: function (self) {
        var n = Math.round(self.progress * spans.length);
        spans.forEach(function (s, i) { s.classList.toggle('is-on', i < n); });
      }
    });
  });

  var mm = gsap.matchMedia();

  /* ---------- Proyecto: el marco se abre a pantalla completa ---------- */
  var project = document.querySelector('.project');
  if (project) {
    mm.add('(min-width: 901px)', function () {
      var fadeEls = project.querySelectorAll('[data-project-fade]');
      gsap.set(fadeEls, { opacity: 0, y: 30 });
      var t = gsap.timeline({ scrollTrigger: { trigger: project, start: 'top top', end: 'bottom bottom', scrub: 1 } });
      t.to('[data-project-frame]', { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 1 })
       .to('[data-project-img]', { scale: 1, ease: 'power2.inOut', duration: 1 }, 0)
       .to(fadeEls, { opacity: 1, y: 0, stagger: .08, duration: .35 }, .7);
      return function () { gsap.set(fadeEls, { clearProps: 'all' }); };
    });
  }

  /* ---------- Colección: desplazamiento horizontal ---------- */
  var coll = document.querySelector('[data-collection]');
  if (coll) {
    mm.add('(min-width: 1024px)', function () {
      var track = coll.querySelector('[data-track]');
      var bar = coll.querySelector('[data-progress]');
      var distance = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      gsap.to(track, {
        x: function () { return -distance(); }, ease: 'none',
        scrollTrigger: {
          trigger: coll, start: 'center center', end: function () { return '+=' + distance(); },
          pin: true, scrub: 1, invalidateOnRefresh: true,
          onUpdate: function (self) { if (bar) bar.style.transform = 'scaleX(' + (.08 + self.progress * .92) + ')'; }
        }
      });
    });
  }

  /* ---------- Materiales: imagen que sigue al cursor ---------- */
  var follow = document.querySelector('[data-follow]');
  var list = document.querySelector('[data-materials]');
  if (follow && list && finePointer) {
    var imgs = follow.querySelectorAll('img');
    gsap.set(follow, { xPercent: -50, yPercent: -50, scale: .85 });
    var fx = gsap.quickTo(follow, 'x', { duration: .7, ease: 'power3.out' });
    var fy = gsap.quickTo(follow, 'y', { duration: .7, ease: 'power3.out' });
    var fr = gsap.quickTo(follow, 'rotation', { duration: .9, ease: 'power3.out' });
    var px = 0;
    list.addEventListener('mousemove', function (e) { fx(e.clientX); fy(e.clientY); fr(Math.max(-8, Math.min(8, (e.clientX - px) * .35))); px = e.clientX; });
    list.querySelectorAll('[data-mat]').forEach(function (a) {
      a.addEventListener('mouseenter', function () {
        var i = +a.getAttribute('data-mat');
        imgs.forEach(function (im, k) { im.classList.toggle('on', k === i); });
        follow.classList.add('on');
        gsap.to(follow, { scale: 1, duration: .6, ease: 'power3.out' });
      });
    });
    list.addEventListener('mouseleave', function () { follow.classList.remove('on'); gsap.to(follow, { scale: .85, duration: .5 }); });
  }

  /* ---------- Método: la línea avanza con el scroll ---------- */
  var rail = document.querySelector('[data-rail]');
  if (rail) {
    gsap.fromTo(rail, { scaleY: .04 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-steps]', start: 'top 70%', end: 'bottom 60%', scrub: true } });
  }

  window.addEventListener('load', function () { ST.refresh(); });
})();
