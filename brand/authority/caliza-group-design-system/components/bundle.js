/* @ds-bundle: {"format":4,"namespace":"Caliza","components":[{"name":"Wordmark"},{"name":"BrandSymbol"},{"name":"SubBrandLockup"},{"name":"SectionTitle"},{"name":"Button"},{"name":"ImageCard"},{"name":"ArchFrame"},{"name":"NavBar"},{"name":"Hero"},{"name":"SampleTag"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function omit(o, keys) { var r = {}; for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k) && keys.indexOf(k) < 0) r[k] = o[k]; return r; }

  /* Geometry from the manual's "Geometría" construction sheet. */
  var SYMBOLS = {
    'stone-design': { vb: '-84 -60 124 144', w: 124, h: 144, label: 'Stone Design', d: [
      'M0 0 L0 40 A40 40 0 1 1 40 0 Z',
      'M0 -60 A60 60 0 0 0 0 60 L0 50 A50 50 0 0 1 0 -50 Z',
      'M-84 0 A84 84 0 0 0 0 84 L0 74 A74 74 0 0 1 -74 0 Z'] },
    'living-design': { vb: '0 0 92 116', w: 92, h: 116, label: 'Living Design', d: [
      'M0 116 L0 46 A46 46 0 0 1 92 46 L92 116 L72 116 L72 46 A26 26 0 0 0 20 46 L20 116 Z'] },
    'stone-care': { vb: '-100 -100 200 200', w: 200, h: 200, label: 'Stone Care', d: [
      'M0 -100 Q20 -20 100 0 Q20 20 0 100 Q-20 20 -100 0 Q-20 -20 0 -100 Z'] }
  };

  function BrandSymbol(p) {
    var s = SYMBOLS[p.brand] || SYMBOLS['stone-design'];
    var size = p.size || 48;
    var title = p.title === undefined ? 'Símbolo Caliza ' + s.label : p.title;
    return h('svg', {
      className: cx('cz-symbol', p.className), viewBox: s.vb, height: size, width: Math.round(size * s.w / s.h),
      role: title ? 'img' : undefined, 'aria-hidden': title ? undefined : true, 'aria-label': title || undefined, style: p.style
    }, s.d.map(function (d, i) { return h('path', { key: i, d: d, fill: 'currentColor' }); }));
  }

  function Wordmark(p) {
    var size = p.size || 56;
    var variant = p.variant || 'auto';
    return h('div', {
      className: cx('cz-wordmark', 'cz-wordmark--' + variant, p.className), role: 'img', 'aria-label': 'Caliza Group',
      style: Object.assign({ fontSize: size + 'px' }, p.style)
    },
      h('span', { className: 'cz-wordmark__line', 'aria-hidden': true }, 'CALIZA'),
      h('span', { className: 'cz-wordmark__line', 'aria-hidden': true }, 'GROUP'),
      p.rule === false ? null : h('span', { className: 'cz-wordmark__rule', 'aria-hidden': true }));
  }

  var DESCRIPTORS = { 'stone-design': 'STONE DESIGN', 'living-design': 'LIVING DESIGN', 'stone-care': 'STONE CARE' };
  function SubBrandLockup(p) {
    var brand = p.brand || 'stone-design';
    var size = p.size || 40;
    return h('div', {
      className: cx('cz-lockup', p.tone === 'inversa' && 'cz-lockup--inversa', p.className), role: 'img',
      'aria-label': 'Caliza ' + SYMBOLS[brand].label, style: Object.assign({ fontSize: size + 'px' }, p.style)
    },
      p.symbol === false ? null : h(BrandSymbol, { brand: brand, size: Math.round(size * 1.15), title: '', className: 'cz-lockup__symbol' }),
      h('span', { className: 'cz-lockup__name', 'aria-hidden': true }, 'CALIZA'),
      h('span', { className: 'cz-lockup__descriptor', 'aria-hidden': true }, DESCRIPTORS[brand]));
  }

  function SectionTitle(p) {
    var Tag = p.as || 'h2';
    return h('div', { className: cx('cz-section-title', p.className) },
      h(Tag, { className: 'cz-section-title__text' }, p.children),
      h('span', { className: 'cz-section-title__rule', 'aria-hidden': true }));
  }

  function Button(p) {
    var variant = p.variant || 'primary';
    var rest = omit(p, ['variant', 'className', 'children', 'href']);
    var cls = cx('cz-btn', 'cz-btn--' + variant, p.className);
    var kids = variant === 'link' ? [p.children, h('span', { key: 'a', className: 'cz-btn__arrow', 'aria-hidden': true }, '→')] : p.children;
    if (p.href) return h('a', Object.assign({ className: cls, href: p.href }, rest), kids);
    return h('button', Object.assign({ type: 'button', className: cls }, rest), kids);
  }

  function ImageCard(p) {
    return h('figure', { className: cx('cz-image-card', p.className), style: p.style },
      h('div', { className: 'cz-image-card__media', style: { aspectRatio: p.ratio || '16 / 9' } },
        h('img', { src: p.src, alt: p.alt || '', loading: 'lazy' })),
      h('figcaption', { className: 'cz-image-card__band' },
        h('span', { className: 'cz-image-card__title' }, p.title),
        p.subtitle ? h('span', { className: 'cz-image-card__subtitle' }, p.subtitle) : null));
  }

  function ArchFrame(p) {
    return h('div', {
      className: cx('cz-arch', p.className),
      style: Object.assign({ width: p.width ? p.width + 'px' : undefined, aspectRatio: p.ratio || '3 / 4' }, p.style)
    }, h('img', { src: p.src, alt: p.alt || '', loading: 'lazy' }));
  }

  function NavBar(p) {
    var links = p.links || [];
    return h('nav', { className: cx('cz-nav', p.className), 'aria-label': p.label || 'Principal' },
      h('a', { className: 'cz-nav__brand', href: p.homeHref || '#' }, h(Wordmark, { size: 18, rule: false })),
      h('ul', { className: 'cz-nav__links' }, links.map(function (l, i) {
        return h('li', { key: i }, h('a', { href: l.href || '#', className: cx('cz-nav__link', l.active && 'is-active'), 'aria-current': l.active ? 'page' : undefined }, l.label));
      })));
  }

  function Hero(p) {
    return h('section', { className: cx('cz-hero', p.className), style: Object.assign({ minHeight: (p.height || 480) + 'px' }, p.style) },
      h('img', { className: 'cz-hero__img', src: p.src, alt: p.alt || '' }),
      h('div', { className: 'cz-hero__scrim', 'aria-hidden': true }),
      h('div', { className: 'cz-hero__body' },
        p.kicker ? h('p', { className: 'cz-hero__kicker' }, p.kicker) : null,
        h('h1', { className: 'cz-hero__title' }, p.title),
        h('span', { className: 'cz-hero__rule', 'aria-hidden': true }),
        p.text ? h('p', { className: 'cz-hero__text' }, p.text) : null,
        p.cta ? h('div', { className: 'cz-hero__cta' }, h(Button, { variant: 'onimage', href: p.cta.href }, p.cta.label)) : null));
  }

  function SampleTag(p) {
    var brand = p.brand || 'stone-design';
    return h('article', { className: cx('cz-tag', p.className), style: p.style },
      h('span', { className: 'cz-tag__hole', 'aria-hidden': true }),
      h(SubBrandLockup, { brand: brand, size: 28 }),
      h('span', { className: 'cz-tag__rule', 'aria-hidden': true }),
      h('h3', { className: 'cz-tag__name' }, p.name),
      p.details ? h('dl', { className: 'cz-tag__details' }, p.details.map(function (d, i) {
        return h(React.Fragment, { key: i }, h('dt', null, d.label), h('dd', null, d.value));
      })) : null,
      p.code ? h('p', { className: 'cz-tag__code' }, p.code) : null);
  }

  var api = { Wordmark: Wordmark, BrandSymbol: BrandSymbol, SubBrandLockup: SubBrandLockup, SectionTitle: SectionTitle, Button: Button, ImageCard: ImageCard, ArchFrame: ArchFrame, NavBar: NavBar, Hero: Hero, SampleTag: SampleTag };
  window.Caliza = window.Caliza || {};
  Object.assign(window.Caliza, api);
})();
