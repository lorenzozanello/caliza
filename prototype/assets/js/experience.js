/* CALIZA GROUP — experiencia de revisión. Sin backend, checkout ni captura de datos. */
(() => {
  'use strict';

  const IMG = 'assets/img/';
  const main = document.getElementById('main');
  const feedback = document.getElementById('feedback');
  const officialWhatsApp = (document.querySelector('meta[name="caliza-whatsapp"]')?.content || '').replace(/\D/g, '');
  const directWhatsApp = /^[1-9]\d{7,14}$/.test(officialWhatsApp) && !/0{7,}/.test(officialWhatsApp);
  const campaignParams = new URLSearchParams(location.search || '');
  const campaignValue = (name) => (campaignParams.get(name) || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 48);
  const campaignRef = [campaignValue('utm_source'), campaignValue('utm_campaign')].filter(Boolean).join(' / ');
  const featuredLinks = (Array.isArray(window.CALIZA_FEATURED_SOCIAL) ? window.CALIZA_FEATURED_SOCIAL : []).slice(0, 8).map(parseSocialUrl).filter(Boolean);
  const profileLink = (name) => {
    const raw = document.querySelector(`meta[name="caliza-${name}"]`)?.content || '';
    try {
      const url = new URL(raw);
      if (url.protocol !== 'https:') return '';
      if (name === 'instagram' && ['instagram.com', 'www.instagram.com'].includes(url.hostname) && /^\/[a-zA-Z0-9._]+\/?$/.test(url.pathname)) return `https://www.instagram.com${url.pathname}`;
      if (name === 'tiktok' && ['tiktok.com', 'www.tiktok.com'].includes(url.hostname) && /^\/@[a-zA-Z0-9._-]+\/?$/.test(url.pathname)) return `https://www.tiktok.com${url.pathname}`;
    } catch { /* Sin perfil verificado. */ }
    return '';
  };
  const safeText = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const picture = (name, alt, cls = '') => `<img class="${cls}" src="${IMG}${name}" alt="${safeText(alt)}" loading="lazy" decoding="async">`;
  // Only curated QA assets; no private Drive URLs or arbitrary media paths.
  function realPhoto(key, alt, cls = '', priority = false) {
    // The Stone Care image is the actual IMG_1621 lavamanos project photograph;
    // never use an AI-generated bathroom as documentation of a delivered job.
    if (key === 'caliza-r6-118') {
      const photo = (Array.isArray(window.CALIZA_R6_ARCHIVE) ? window.CALIZA_R6_ARCHIVE : [])
        .find(x => x.id === key && x.kind === 'authentic_photo' && !x.duplicate &&
          x.src === 'editorial-r6/caliza-r6-118-1280.webp' &&
          x.src640 === 'editorial-r6/caliza-r6-118-640.webp');
      if (photo) {
        const sizes = priority ? '100vw' : '(max-width:700px) 100vw,33vw';
        return '<img class="' + cls + '" src="' + IMG + photo.src + '" srcset="' +
          IMG + photo.src640 + ' 360w,' + IMG + photo.src + ' 720w" sizes="' + sizes +
          '" width="720" height="1280" alt="' + safeText(alt) + '" loading="' +
          (priority ? 'eager' : 'lazy') + '" fetchpriority="' + (priority ? 'high' : 'auto') + '" decoding="async">';
      }
    }
    const m = window.CALIZA_REAL_ARCHIVE?.[key];
    if (!m || !/^approved\/[a-z0-9-]+-[0-9]+\.webp$/.test(m.src || '')) return '';
    const slug = m.src.match(/^approved\/([a-z0-9-]+)-[0-9]+\.webp$/)?.[1];
    const widths = (m.widths || []).filter(w => Number.isInteger(w) && w >= 320 && w <= 1600).sort((a,b) => a-b);
    if (!slug || !widths.length) return '';
    const width = widths.at(-1);
    const ratio = Number.isFinite(m.aspectRatio) && m.aspectRatio > .25 && m.aspectRatio < 4 ? m.aspectRatio : 1.5;
    const sizes = priority ? '100vw' : '(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw';
    const srcset = widths.map(w => IMG + 'approved/' + slug + '-' + w + '.webp ' + w + 'w').join(', ');
    return '<img class="' + cls + '" src="' + IMG + 'approved/' + slug + '-' + width + '.webp" srcset="' + srcset + '" sizes="' + sizes + '" width="' + width + '" height="' + Math.round(width / ratio) + '" alt="' + safeText(alt || m.alt || '') + '" loading="' + (priority ? 'eager' : 'lazy') + '" fetchpriority="' + (priority ? 'high' : 'auto') + '" decoding="async">';
  }
  const button = (url, label, cls = 'o8-button') => `<a class="${cls}" href="#${url}">${label} <span aria-hidden="true">→</span></a>`;
  const label = (text) => `<span class="o8-overline">${text}</span>`;
  const lineIcon = (name) => `<img class="brand-line-icon" src="${IMG}brand/symbol-${{ stone: 'stone-design', living: 'living-design', care: 'stone-care' }[name]}-primary.svg" alt="" aria-hidden="true" width="64" height="64">`;
  const disclaimer = ''; // Nota editorial discreta en el pie; etiquetas individuales en imágenes.
  // Prefer clean, source-faithful product crops. Never expose price-overlaid sale sheets.
  // Individually reviewed: other crops still show printed labels, historic prices
  // or incomplete object framing. Never expose those variants automatically.
  const cleanVisualWhitelist = new Set(['012','015','035','037','044','048','049','051','061','067','075','086','087','090'].map(n => 'caliza-r6-' + n));
  const r6CleanCatalog = new Map(
    (Array.isArray(window.CALIZA_R6_CATALOG) ? window.CALIZA_R6_CATALOG : [])
      .filter((r) => r && cleanVisualWhitelist.has(r.id) && /^caliza-r6-\d{3}$/.test(r.id || '') &&
        /^catalog-r6\/caliza-r6-\d{3}-clean-1280\.webp$/.test(r.src || '') &&
        /^catalog-r6\/caliza-r6-\d{3}-clean-640\.webp$/.test(r.src640 || ''))
      .map((r) => [r.id, r])
  );
  const r7CleanCatalog = new Map(
    (Array.isArray(window.CALIZA_R7_CATALOG) ? window.CALIZA_R7_CATALOG : [])
      .filter(r => r && /^caliza-r6-\d{3}$/.test(r.id || '') &&
        /^catalog-r7\/caliza-r6-\d{3}-r7-1280\.webp$/.test(r.src || '') &&
        /^catalog-r7\/caliza-r6-\d{3}-r7-640\.webp$/.test(r.src640 || '') &&
        ['SALE_SHEET_DETAIL','SALE_SHEET_PRODUCT_CROP'].includes(r.kind) &&
        r.review === 'NO_STOCK_PRICE_OR_SKU_CLAIMS')
      .map(r => [r.id,r])
  );
  const cleanCatalog = new Map([...r6CleanCatalog, ...r7CleanCatalog]);
  const r6Archive = Array.isArray(window.CALIZA_R6_ARCHIVE) ? window.CALIZA_R6_ARCHIVE.filter((r) => r && !r.duplicate &&
    /^editorial-r6\/caliza-r6-\d{3}-1280\.webp$/.test(r.src || '') && /^editorial-r6\/caliza-r6-\d{3}-640\.webp$/.test(r.src640 || '') &&
    !/IMG_5251|IMG_4778/i.test(r.original || '') &&
    (r.kind !== 'sale_sheet_reference' || cleanCatalog.has(r.id)))
    .map(r => r.kind === 'sale_sheet_reference' ? {...r, ...cleanCatalog.get(r.id), kind:'sale_sheet_reference', kindR7:cleanCatalog.get(r.id).kind} : r) : [];
  const r6Names = {cocinas:'Cocinas y superficies',lavamanos:'Lavamanos y baños','mesas-auxiliares':'Mesas auxiliares','mesas-comedor-piedra':'Mesas · base de piedra','mesas-comedor-hierro':'Mesas · base metálica','mesas-comedor-madera':'Mesas · base de madera','sillas-hogar':'Sillas para hogar','sillas-comerciales':'Sillas comerciales'};
  const r6Favorites = ['caliza-r6-128','caliza-r6-024','caliza-r6-116','caliza-r6-112','caliza-r6-135','caliza-r6-140'];
  function r6Cards(entries) {
    return '<div class="caliza-r6-grid">' + entries.map((entry) => {
      const ref = entry.kind === 'sale_sheet_reference';
      const title = r6Names[entry.group] || 'Archivo CALIZA';
      const label = ref ? (entry.kind === 'sale_sheet_reference' && entry.src?.startsWith('catalog-r7/') && entry.kindR7 === 'SALE_SHEET_DETAIL' ? 'Detalle de referencia · Modelo por confirmar' : 'Referencia comercial · Modelo por confirmar') : 'Fotografía auténtica · CALIZA';
      const alt = (ref ? 'Recorte de lámina comercial CALIZA: ' : 'Fotografía real CALIZA: ') + title;
      return '<article class="caliza-r6-card' + (ref ? ' caliza-r6-reference' : '') + '"><figure><img src="' + IMG + entry.src + '" srcset="' + IMG + entry.src640 + ' 640w, ' + IMG + entry.src + ' 1280w" sizes="(max-width:700px) 100vw,(max-width:1100px) 50vw,33vw" loading="lazy" decoding="async" alt="' + safeText(alt) + '"></figure><div><span>' + label + '</span><h3>' + safeText(title) + '</h3></div></article>';
    }).join('') + '</div>';
  }
  function r6FamilyGallery(slug) {
    const groups = slug === 'mesas-de-comedor' ? ['mesas-comedor-piedra','mesas-comedor-hierro','mesas-comedor-madera'] : slug === 'sillas-para-hogar' ? ['sillas-hogar'] : slug === 'sillas-comerciales' ? ['sillas-comerciales'] : slug === 'lavamanos' ? ['lavamanos'] : slug === 'mesas-auxiliares' ? ['mesas-auxiliares'] : [];
    const items = r6Archive.filter(r => groups.includes(r.group));
    return items.length ? '<section class="caliza-r6-section"><div class="caliza-r6-lead"><span class="o8-overline">Archivo de producto CALIZA</span><h2>Una familia, distintas expresiones.</h2><p>Fotografías de origen y referencias comerciales diferenciadas. Modelos, precios, materiales y disponibilidad siempre sujetos a confirmación del equipo.</p></div>' + r6Cards(items) + '</section>' : '';
  }
  function r6ArchivePage() {
    return pageIntro('CALIZA / Archivo editorial','Materia y oficio documentados.','Imágenes reales del archivo CALIZA y referencias de catálogos históricos, clasificadas sin inventar fichas comerciales.') + '<section class="caliza-r6-section">' + Object.keys(r6Names).map(group => {
      const items = r6Archive.filter(r => r.group === group);
      return items.length ? '<section class="caliza-r6-group"><div class="caliza-r6-lead"><span class="o8-overline">CALIZA · Archivo de origen</span><h2>' + safeText(r6Names[group]) + '</h2><p>' + (items[0].kind === 'sale_sheet_reference' ? 'Referencias históricas de catálogo, sin precios ni stock verificados.' : 'Fotografías auténticas de obra o producto, sin ficha técnica validada.') + '</p></div>' + r6Cards(items) + '</section>' : '';
    }).join('') + '</section>' + contactRibbon();
  }

  const getRoute = () => {
    const raw = (location.hash.startsWith('#/') ? location.hash.substring(1) : '/').split('?')[0].replace(/\/+$/, '') || '/';
    if (raw === '/tienda' || raw === '/living-design/carrito' || raw.startsWith('/living-design/pieza/')) return '/living-design/coleccion';
    return raw;
  };
  let wizard = { briefStep: 0, diagnosisStep: 0, brief: {}, diagnosis: {} };
  let activeEmbed = null;
  let socialFilter = 'todos';
  let toastTimer;

  // Datos de familias de CALIZA; sus imágenes siguen pendientes de aprobación.
  const families = (window.CALIZA_CATALOGO?.familias || []).map((f) => ({ ...f, name: f.nombre, category: f.categoria, description: f.descripcion || '' }));
  const MODO_SELECCION_ACTIVO = window.CALIZA_CATALOGO?.MODO_SELECCION_ACTIVO === true;

  function announce(message) {
    feedback.textContent = message;
    feedback.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { feedback.hidden = true; }, 4500);
  }
  function waUrl(message) {
    const body = `${message}${campaignRef ? `\nReferencia de campaña: ${campaignRef}` : ''}`;
    return `https://wa.me/${directWhatsApp ? officialWhatsApp : ''}?text=${encodeURIComponent(body)}`;
  }
  function waAction(message, text = 'Preparar en WhatsApp') {
    return `<a href="${safeText(waUrl(message))}" class="o8-button caliza-wa-action" target="_blank" rel="noopener noreferrer" data-marketing-cta="whatsapp">${safeText(text)} <span aria-hidden="true">↗</span></a>`;
  }
  function waHandoffNote() {
    return `<p class="caliza-channel-note">${directWhatsApp ? 'WhatsApp abrirá una conversación con el número oficial de CALIZA. Usted decide si envía el mensaje.' : 'No fue posible validar el número de WhatsApp. No comparta datos hasta confirmar el destinatario oficial.'}</p>`;
  }
  function routeMessage(route = getRoute()) {
    if (route.startsWith('/living-design') || route === '/tienda') return 'Hola, me interesa conocer las piezas de CALIZA LIVING DESIGN. Quisiera asesoría sobre materiales, medidas y cotización.';
    if (route.startsWith('/stone-care')) return 'Hola, necesito orientación de CALIZA STONE CARE para el cuidado de una superficie de piedra natural.';
    if (route.startsWith('/stone-design') || route === '/proyectos') return 'Hola, quiero conversar con CALIZA STONE DESIGN sobre un proyecto en piedra natural.';
    return 'Hola, quiero conocer los servicios de CALIZA GROUP y recibir asesoría.';
  }
  // Eventos locales sin PII ni red: un colector solo puede escucharlos después de consentimiento.
  function emitIntent(type) {
    const allowed = ['whatsapp_handoff','contact_ready','family_inquiry_ready','brief_ready','diagnosis_ready'];
    if (!allowed.includes(type) || typeof window.dispatchEvent !== 'function' || typeof window.CustomEvent !== 'function') return;
    window.dispatchEvent(new window.CustomEvent('caliza:intent', { detail: { type, route: getRoute() } }));
  }
  function syncConversionDock() {
    const link = document.getElementById('floating-whatsapp');
    if (!link) return;
    link.href = waUrl(routeMessage());
    link.setAttribute('aria-label', directWhatsApp ? 'Escribir al WhatsApp oficial de Caliza' : 'Abrir WhatsApp con un mensaje listo y seleccionar manualmente el contacto de Caliza');
    const text = document.getElementById('floating-wa-label');
    if (text) text.textContent = directWhatsApp ? 'Hablar con Caliza' : 'Compartir por WhatsApp';
    const note = document.getElementById('floating-wa-note');
    if (note) note.textContent = directWhatsApp ? 'Consulta comercial · respuesta por confirmar' : 'Seleccione el contacto oficial de Caliza';
  }
  function approvedPicture(imagenes, name) {
    const src = String(imagenes.ambiente || '');
    const alt = safeText(imagenes.alt || `Fotografía aprobada de ${name}`);
    const nameMatch = src.match(/^approved\/([a-z0-9-]+)-([0-9]+)\.webp$/);
    if (!nameMatch) return picture(src, alt);
    const slug = nameMatch[1];
    const widths = (Array.isArray(imagenes.widths) ? imagenes.widths : [])
      .filter((width) => Number.isInteger(width) && width >= 320 && width <= 2560)
      .sort((a, b) => a - b);
    if (!widths.length) return picture(src, alt);
    const sizes = '(max-width: 660px) 100vw, (max-width: 1200px) 50vw, 33vw';
    const srcset = (ext) => widths.map((w) => `${IMG}approved/${slug}-${w}.${ext} ${w}w`).join(', ');
    const fallbackWidth = widths.filter((w) => w <= 1600).at(-1) || widths.at(-1);
    const fallbackSrc = `approved/${slug}-${fallbackWidth}.webp`;
    return `<picture><source type="image/avif" srcset="${srcset('avif')}" sizes="${sizes}"><source type="image/webp" srcset="${srcset('webp')}" sizes="${sizes}"><img src="${IMG}${fallbackSrc}" alt="${alt}" loading="lazy" decoding="async" width="${fallbackWidth}" height="${Math.round(fallbackWidth * (Number.isFinite(imagenes.aspectRatio) && imagenes.aspectRatio > .25 && imagenes.aspectRatio < 4 ? 1 / imagenes.aspectRatio : .75))}"></picture>`;
  }
  const editorialFamilyImages = Object.freeze({
    'mesas-de-comedor':'comedor.jpg',
    'mesas-auxiliares':'editorial-mesas-auxiliares.webp',
    'sillas-para-hogar':'editorial-sillas-hogar.webp',
    'sillas-comerciales':'editorial-sillas-comerciales.webp',
    'lavamanos':'editorial-lavamanos.webp'
  });
  function familyVisual(item, detail = false) {
    if (item.imagenes?.ambiente) return approvedPicture(item.imagenes, item.name);
    const source = editorialFamilyImages[item.slug];
    if (!source) return `<div class="caliza-family-placeholder" role="img"><span>Imagen en revisión</span></div>`;
    return `<div class="caliza-editorial-family ${detail ? 'caliza-editorial-family-detail' : ''}" data-pendiente="fotografía comercial de ${safeText(item.name)}"><img src="${IMG}${source}" alt="Inspiración conceptual para ${safeText(item.name)}; no representa un modelo disponible" loading="lazy" decoding="async"><span class="caliza-editorial-flag">Imagen conceptual · No es un producto publicado</span></div>`;
  }
  function familyCard(item) {
  const media = familyVisual(item);
  const names = (item.subfamilias || []).map((x) => safeText(x.nombre)).join(' · ');
  return `<article class="caliza-family-card"><a class="caliza-family-media caliza-family-media-link" href="#/living-design/familia/${safeText(item.slug)}" aria-label="Explorar ${safeText(item.name)}">${media}</a><div class="caliza-family-content"><span class="o8-overline">Living Design / ${safeText(item.category)}</span><h3><a href="#/living-design/familia/${safeText(item.slug)}">${safeText(item.name)}</a></h3><p>${safeText(item.description)}</p><p class="caliza-family-sources">${names}</p><div class="caliza-family-action"><a class="caliza-family-details" href="#/living-design/familia/${safeText(item.slug)}">Explorar posibilidades <span aria-hidden="true">→</span></a>${waAction(item.whatsappTexto, 'Solicitar asesoría')}</div></div></article>`;
}
  function familyDetail(route) {
  const slug = route.split('/').pop();
  const item = families.find((f) => f.slug === slug);
  if (!item) return missing();
  const media = familyVisual(item, true);
  const subfamilias = (item.subfamilias || []).map((f) => `<li><span>${safeText(f.nombre)}</span><small>Posibilidad de diseño · sujeta a consulta</small></li>`).join('');
  const questions = (item.preguntas || []).map((v) => `<li>${safeText(v)}</li>`).join('');
  const options = (item.subfamilias || []).map((f) => `<option value="${safeText(f.nombre)}">${safeText(f.nombre)}</option>`).join('');
  return `${pageIntro('Living Design / Archivo de familias', safeText(item.name), safeText(item.description))}${subnav('/living-design/coleccion')}
    <section class="caliza-detail-layout">
      <div class="caliza-detail-visual">${media}<p>${item.imagenes?.ambiente ? 'Fotografía real de CALIZA. Disponibilidad, especificaciones y acabados sujetos a confirmación.' : 'Imagen conceptual de inspiración. La ficha individual se confirma con el equipo.'}</p></div>
      <div class="caliza-detail-content">${label('Diseño bajo consulta')}
        <h2>Una pieza, muchas posibilidades.</h2>
        <p>Esta familia forma parte de las líneas documentadas de CALIZA. Converse con nuestro equipo para explorar posibilidades de diseño, materiales, medidas, acabados y condiciones de una propuesta a medida.</p>
        <h3>Agrupaciones documentadas</h3><ul class="caliza-source-list">${subfamilias}</ul>
        <h3>Para orientar su consulta</h3><ul class="caliza-question-list">${questions}</ul>
        <a href="#/living-design/coleccion" class="o8-text-link">Volver a las colecciones →</a>
      </div>
    </section>
    ${r6FamilyGallery(item.slug)}
    <section class="caliza-detail-inquiry" aria-labelledby="family-inquiry-title">
      <div>${label('Asesoría a medida')}<h2 id="family-inquiry-title">Cuéntenos qué tiene en mente.</h2><p>Prepare una consulta sin inventar un pedido ni aceptar precios no confirmados.</p></div>
      <form id="family-inquiry-form" class="exp-contact-form">
        <input type="hidden" name="family" value="${safeText(item.nombre)}">
        <label for="family-subgroup">Tipo de pieza</label>
        <select id="family-subgroup" name="subgroup"><option value="">Solicito orientación</option>${options}</select>
        <label for="family-use">Uso previsto</label>
        <select id="family-use" name="use"><option value="">Por definir</option><option>Hogar</option><option>Proyecto comercial</option><option>Hospitalidad</option><option>Otro</option></select>
        <label for="family-city">Ciudad de destino</label><input id="family-city" name="city" maxlength="70" placeholder="Ciudad (opcional)" autocomplete="address-level2">
        <label for="family-detail">Medidas o preferencias</label><textarea id="family-detail" name="details" maxlength="700" rows="4" placeholder="Indique el espacio, dimensiones aproximadas o referencias sin información sensible."></textarea>
        <button class="o8-button" type="submit">Preparar consulta <span aria-hidden="true">→</span></button>
        <div id="family-inquiry-result" class="caliza-contact-result" tabindex="-1" aria-live="polite" hidden></div>
        <small>No se almacena ni envía esta información automáticamente. Usted decide si la comparte por WhatsApp.</small>
      </form>
    </section>`;
}
    function hero({ image, realKey, imageAlt = '', eyebrow, title, desc, cta, href, position = 'center' }) {
    return `<section class="exp-hero ${realKey ? "caliza-editorial-real-hero" : ""}">${realKey ? realPhoto(realKey, imageAlt, "caliza-real-hero", true) : `<img src="${IMG}${image}" alt="${safeText(imageAlt || "Ambientación conceptual")}" style="object-position:${position}" fetchpriority="high" decoding="async" width="1600" height="900">`}<div class="exp-hero-content">${label(eyebrow)}<h1>${title}</h1><span class="o8-terracotta-rule"></span><p>${desc}</p>${cta ? button(href, cta) : ''}</div><small class="exp-hero-corner">CALIZA GROUP / COLOMBIA</small></section>`;
  }
  function sectionHead(title, href, action = 'Ver todos') {
    return `<div class="o8-section-heading"><h2>${title}</h2>${href ? `<a href="#${href}">${action} <span aria-hidden="true">→</span></a>` : ''}</div>`;
  }
  function pageIntro(overline, title, desc) {
    return `<div class="exp-page-intro">${label(overline)}<h1>${title}</h1><p>${desc}</p><span class="o8-terracotta-rule"></span></div>`;
  }
  function subnav(current) {
    const nav = [
      ['/living-design', 'Habitar'], ['/living-design/coleccion', 'Colección'],
      ['/living-design/experiencia', 'Experiencia'], ['/contacto', 'Solicitar asesoría'],
    ];
    return `<nav class="exp-subnav" aria-label="Navegación Living Design">${nav.map(([href, text]) => `<a href="#${href}" ${href === current ? 'aria-current="page"' : ''}>${text}</a>`).join('')}</nav>`;
  }

  function home() {
    return `${hero({ image: 'option08-hero.webp', eyebrow: 'Piedra natural · Diseño de vida', title: 'La materia<br>toma forma.', desc: 'Diseño, vida y cuidado en piedra natural para espacios que perduran.', cta: 'Explorar proyectos', href: '/proyectos' })}
      <section class="o8-pillars" aria-label="Nuestras tres líneas">
        ${[
          ['stone', 'lavamanos.jpg', 'Crear', 'Stone Design', 'Proyectos en piedra natural a medida.', '/stone-design'],
          ['living', 'option08-living.webp', 'Habitar', 'Living Design', 'Mobiliario y objetos que dan forma a la vida.', '/living-design'],
          ['care', 'option08-care.webp', 'Preservar', 'Stone Care', 'Cuidado y restauración para que la belleza perdure.', '/stone-care'],
        ].map(([icon, image, name, brand, desc, href]) => `<a href="#${href}" class="o8-pillar">${picture(image, `Escena conceptual de ${brand}`)}<div class="o8-pillar-copy">${lineIcon(icon)}<div><h2>${name}</h2><span>${brand}</span><p>${desc}</p></div><b aria-hidden="true">→</b></div></a>`).join('')}
      </section>
      <section class="caliza-journeys" aria-labelledby="journeys-title"><div class="caliza-journeys-lead">${label('Su próximo paso')}<h2 id="journeys-title">¿Qué desea hacer?</h2><p>Un recorrido claro desde la inspiración hasta una conversación con el equipo.</p></div><div class="caliza-journey-links">
      <a href="#/stone-design/brief"><span>01 / Crear</span><strong>Planear un espacio en piedra</strong><small>Preparar un brief de proyecto <span aria-hidden="true">→</span></small></a>
      <a href="#/living-design/coleccion"><span>02 / Habitar</span><strong>Explorar una familia</strong><small>Explorar posibilidades y consultar <span aria-hidden="true">→</span></small></a>
      <a href="#/stone-care/diagnostico"><span>03 / Preservar</span><strong>Evaluar el cuidado</strong><small>Recibir orientación preliminar <span aria-hidden="true">→</span></small></a>
      </div></section>
      <section class="o8-section">${sectionHead('Familias para habitar', '/living-design/coleccion', 'Explorar familias')}<div class="caliza-family-grid caliza-family-grid-featured">${families.slice(0, 2).map(familyCard).join('')}</div></section>
      <section class="o8-section">${sectionHead('La expresión de la materia', '/materiales', 'Explorar materiales')}${materialPreview()}</section>
      <section class="exp-banner">${picture('proyecto.jpg', 'Detalle editorial de piedra en un ambiente arquitectónico')}<div>${label('Caliza Stone Design')}<h2>Espacios que perduran.</h2><p>Proyectos concebidos desde la materia y el oficio.</p>${button('/stone-design/brief', 'Iniciar proyecto')}</div></section>
      <section class="exp-banner exp-banner-care">${picture('option08-care.webp', 'Cuidado artesanal de piedra natural')}<div>${label('Caliza Stone Care')}<h2>Cuidar también es diseñar.</h2><p>Conozca cómo preservar la belleza de la piedra.</p>${button('/stone-care/diagnostico', 'Consultar cuidado')}</div></section>
      ${socialPreview()}
      ${contactRibbon()}${disclaimer}`;
  }

  const materials = [
    ['Piedra clara', 'm_textura.jpg', 'Texturas cálidas, porosidad y vetas singulares.'],
    ['Piedra veteada', 'm_piedra.jpg', 'Vetas naturales y contraste de la materia.'],
    ['Piedra oscura', 'piedra_macro.jpg', 'Profundidad y expresión mineral.'],
    ['Detalle de borde', 'detalle_borde.jpg', 'Perfiles y terminaciones por definir.'],
  ];
  function materialPreview() {
    return `<div class="exp-grid exp-grid-4 exp-material-preview">${materials.map(([name, image]) => `<a href="#/materiales">${picture(image, `Muestra fotográfica provisional: ${name}`)}<strong>${name}</strong></a>`).join('')}</div>`;
  }
  function contactRibbon() {
    return `<section class="o8-contact"><div>${label('Caliza Group')}<h2>Conversemos sobre su proyecto.</h2><p>Cuéntenos qué desea crear, habitar o preservar. Prepare su solicitud y decida cuándo compartirla.</p><div class="caliza-cta-pair">${button('/contacto', 'Preparar solicitud')}${waAction(routeMessage(), 'Consultar por WhatsApp')}</div>${waHandoffNote()}</div><span class="o8-contact-mark">Crear.<br>Habitar.<br>Preservar.</span></section>`;
  }

  function stone() {
    return `${hero({ image: 'proyecto.jpg', imageAlt: 'Ambientación editorial conceptual de Stone Design', eyebrow: 'Caliza Stone Design · Crear', title: 'Espacios<br>que perduran.', desc: 'Diseño y transformación de espacios a través de la piedra natural.', cta: 'Iniciar un proyecto', href: '/stone-design/brief' })}
      <section class="exp-copy-split"><div>${lineIcon('stone')}${label('Piedra · Arquitectura · Oficio')}<h2>De la idea a la materia.</h2></div><div><p>Concebimos proyectos en los que cada superficie, textura y encuentro construye una relación duradera entre las personas y el espacio.</p><p>Explore posibilidades en cubiertas, lavamanos, revestimientos, mesas y soluciones a medida.</p></div></section>
      <section class="o8-section">${sectionHead('Universo de proyectos', '/stone-design/proyectos', 'Ver galería')}<div class="exp-grid exp-grid-3">${[
        ['kitchen-island-a', 'Cocinas', 'Superficies para encuentros cotidianos.'], ['basin-main', 'Baños', 'Gestos de piedra y agua.'], ['kitchen-portrait-a', 'Espacios', 'Arquitectura y detalles a medida.']
      ].map(([image, title, desc]) => `<a class="exp-card" href="#/stone-design/proyectos">${realPhoto(image, `Fotografía auténtica de CALIZA para ${title}`) || picture(image, `Referencia editorial para ${title}`)}<div class="exp-card-info"><div><h3>${title}</h3><p>${desc}</p></div><span aria-hidden="true">↗</span></div></a>`).join('')}</div></section>
      <section class="exp-process">${label('Nuestro proceso')}<h2>Diseñamos con usted.</h2><div class="exp-grid exp-grid-4">${[
        ['Entender', 'Escuchamos lo que busca transformar, el uso del espacio y las referencias disponibles.'],
        ['Dar forma', 'Exploramos alternativas de materiales, superficies y diseño junto con usted.'],
        ['Materializar', 'Definimos el alcance técnico y los siguientes pasos antes de elaborar una propuesta.'],
        ['Cuidar', 'Orientamos sobre el mantenimiento de la superficie según sus características.'],
      ].map(([title, desc], i) => `<div><span>0${i + 1}</span><h3>${title}</h3><p>${desc}</p></div>`).join('')}</div></section>${contactRibbon()}${disclaimer}`;
  }
  function projects() {
  const areas = [
    ['Cocinas y superficies', 'kitchen-island-b', 'La biblioteca de CALIZA contiene fotografías de cocinas y superficies. Los casos individuales y sus créditos todavía se están identificando.'],
    ['Lavamanos y baños', 'basin-portrait', 'Hay documentación visual de lavamanos en el archivo de origen. La identificación de modelos, materiales y obras específicas está pendiente.'],
  ];
  return `${pageIntro('Stone Design / Proyectos', 'Espacios que toman forma.', 'Explore los ámbitos de aplicación documentados en el archivo de CALIZA. Los proyectos con autoría y datos técnicos se incorporarán cuando estén verificados.')}
    <section class="exp-page-pad">
      <div class="caliza-project-archive">
        ${areas.map(([title, image, description]) => `<article class="caliza-project-archive-card">${realPhoto(image, `Fotografía de archivo CALIZA: ${title}`) || picture(image, `Referencia editorial: ${title}`)}<div>${label('Archivo visual auténtico · CALIZA')}<h2>${title}</h2><p>${description}</p><a href="#/stone-design/brief" class="o8-text-link">Converse sobre un proyecto →</a></div></article>`).join('')}
      </div>
      <section class="caliza-project-capabilities" aria-labelledby="capability-title">${label('Otras aplicaciones') }
        <h2 id="capability-title">La materia, según su espacio.</h2>
        <p>El alcance de cada propuesta se define mediante una consulta técnica.</p>
        <div>${['Revestimientos y muros', 'Pisos y superficies', 'Piezas especiales', 'Proyectos comerciales'].map((name) => `<a href="#/stone-design/brief">${name}<span aria-hidden="true">→</span></a>`).join('')}</div>
      </section>
      <section class="caliza-r6-section"><div class="caliza-r6-lead">${label('Obras y detalles reales')}<h2>La piedra, sin artificios.</h2><p>Fotografías auténticas del archivo CALIZA. No atribuimos proyectos, fechas, ubicaciones ni materiales no confirmados.</p></div>${r6Cards(r6Favorites.map(id => r6Archive.find(r => r.id === id)).filter(Boolean).filter(r => r.group === 'cocinas' || r.group === 'lavamanos'))}<div class="caliza-r6-more"><a href="#/archivo">Explorar el archivo completo →</a></div></section>
      <div class="exp-cta-centered">${button('/stone-design/brief', 'Empezar un proyecto')}</div>
    </section>`;
}
  function living() {
    return `${hero({ image: 'option08-living.webp', imageAlt: 'Ambientación editorial conceptual de mobiliario en piedra', eyebrow: 'Caliza Living Design · Habitar', title: 'Piezas<br>para habitar.', desc: 'Mobiliario, mesas y objetos que dan forma a los espacios y a nuestra manera de vivir.', cta: 'Explorar colección', href: '/living-design/coleccion' })}${subnav('/living-design')}
      <section class="exp-copy-split"><div>${lineIcon('living')}<h2>La belleza de lo esencial.</h2></div><div><p>Cada pieza parte de una conversación entre geometría, material y oficio. Explore las familias documentadas en CALIZA y solicite una asesoría personalizada.</p><p>Las fotografías de referencia muestran piezas reales del archivo CALIZA. Modelos, medidas, precios y acabados requieren confirmación del equipo.</p></div></section>
      <section class="o8-section">${sectionHead('Familias documentadas', '/living-design/coleccion', 'Ver familias')}<div class="caliza-family-grid">${families.map(familyCard).join('')}</div></section>
      <section class="exp-pathways"><h2>Tres formas de hacerla suya.</h2><div class="exp-grid exp-grid-3">${[
        ['01', 'Explorar familias', 'Descubra posibilidades de diseño y materiales.'], ['02', 'Consultar una propuesta', 'Converse sobre modelos, medidas y acabados.'], ['03', 'Diseñar a medida', 'Comencemos por sus ideas.'],
      ].map(([n, title, desc]) => `<a href="#/living-design/experiencia"><span>${n}</span><h3>${title}</h3><p>${desc}</p><b aria-hidden="true">→</b></a>`).join('')}</div></section>${contactRibbon()}${disclaimer}`;
  }
  function collection() {
    const query = location.hash.split('?')[1] || '';
    const params = new URLSearchParams(query);
    const category = ['Todas', 'Mesas', 'Sillas', 'Lavamanos'].includes(params.get('categoria')) ? params.get('categoria') : 'Todas';
    const search = (params.get('q') || '').trim().slice(0, 80);
    const selection = families.filter((item) => (category === 'Todas' || item.category === category) && `${item.name} ${item.category} ${(item.subfamilias || []).map((v) => v.nombre).join(' ')}`.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es')));
    return `${pageIntro('Living Design / Colección', 'Objetos para vivir.', 'Explore las familias reales documentadas en el archivo de CALIZA. Las imágenes comerciales y especificaciones individuales se incorporarán tras su validación.')}${subnav('/living-design/coleccion')}
      <section class="exp-page-pad"><div class="caliza-shop-tools"><form id="collection-search-form" class="caliza-collection-search" role="search"><label for="collection-search">Buscar una familia</label><div><input id="collection-search" name="q" type="search" value="${safeText(search)}" placeholder="Ej. mesas, sillas, lavamanos" maxlength="80"><button type="submit" class="exp-outline">Buscar →</button></div></form><p><strong>${selection.length}</strong> familias de origen</p></div><div class="exp-toolbar"><div role="group" aria-label="Filtrar familias" class="exp-filters">${['Todas', 'Mesas', 'Sillas', 'Lavamanos'].map((cat) => `<button type="button" data-filter="${cat}" class="${category === cat ? 'selected' : ''}" aria-pressed="${category === cat}">${cat}</button>`).join('')}</div></div>
      ${selection.length ? `<div class="caliza-family-grid">${selection.map(familyCard).join('')}</div>` : `<div class="exp-empty"><h2>No encontramos familias con ese criterio.</h2><p>Pruebe otra búsqueda o explore todas las categorías.</p>${button('/living-design/coleccion', 'Ver todas las familias')}</div>`}<p class="exp-catalogue-warning">Las imágenes documentan familias y piezas de CALIZA; no acreditan existencias, especificaciones, precios ni disponibilidad. Confirme cada referencia con el equipo.</p></section>`;
  }
  function experience() {
    return `${pageIntro('Living Design / Experiencia', 'Habitar empieza con una idea.', 'Tres recorridos para explorar su próxima pieza con un equipo que escucha. Ningún recorrido implica compra o reserva en línea.')}${subnav('/living-design/experiencia')}
      <section class="exp-page-pad"><div class="exp-grid exp-grid-3 exp-choice-cards"><article>${label('01 · Inspirar')}<h2>Explorar familias.</h2><p>Conozca las familias de CALIZA y encuentre una dirección para su espacio.</p>${button('/living-design/coleccion', 'Ver colección')}</article><article>${label('02 · Conversar')}<h2>Consultar posibilidades.</h2><p>Cuéntenos qué familia, material o aplicación le interesa. El equipo confirmará opciones reales.</p>${button('/contacto', 'Solicitar asesoría')}</article><article>${label('03 · Personalizar')}<h2>Crear a su medida.</h2><p>Prepare un brief con las condiciones de su espacio y el concepto deseado.</p>${button('/stone-design/brief', 'Crear brief')}</article></div></section>`;
  }

  function care() {
    return `${hero({ image: 'option08-care.webp', imageAlt: 'Ambientación editorial conceptual del oficio de cuidado de superficies', eyebrow: 'Caliza Stone Care · Preservar', title: 'Cuidar también<br>es diseñar.', desc: 'Cuidado, protección y restauración para que la belleza de la piedra perdure.', cta: 'Iniciar diagnóstico', href: '/stone-care/diagnostico', position: '60% center' })}
      <section class="exp-copy-split"><div>${lineIcon('care')}<h2>Preservar es conocer la materia.</h2></div><div><p>Las superficies naturales merecen un cuidado consciente. Desde una rutina preventiva hasta la evaluación de una restauración, cada decisión parte de reconocer la piedra.</p><p>El diagnóstico digital es únicamente orientativo; no sustituye la inspección de un especialista.</p></div></section>
      <section class="o8-section">${sectionHead('Nuestros frentes de cuidado', '/stone-care/diagnostico', 'Explorar diagnóstico')}<div class="exp-grid exp-grid-3 exp-service-cards">${[
        ['Limpieza', 'Rutinas adaptadas a la naturaleza de la superficie.'],
        ['Protección', 'Evaluación de sellado y prevención.'],
        ['Restauración', 'Valoración técnica de manchas, desgaste y daño.'],
      ].map(([title, desc], i) => `<a href="#/stone-care/diagnostico"><span>0${i + 1}</span><h3>${title}</h3><p>${desc}</p><b aria-hidden="true">→</b></a>`).join('')}</div></section>
      <section class="exp-banner exp-banner-care">${picture('option08-care.webp', 'Persona limpiando piedra natural con herramienta manual')}<div>${label('Conozca su superficie')}<h2>El primer paso es observar.</h2><p>Cuéntenos qué tipo de piedra y síntoma desea evaluar.</p>${button('/stone-care/diagnostico', 'Empezar diagnóstico')}</div></section>${disclaimer}`;
  }
  function materialsPage() {
  return `${pageIntro('CALIZA / Exploración de materiales', 'La materia, antes de tomar forma.', 'Una selección de texturas y referencias de acabado para iniciar una conversación. No constituye una lista de piedras, placas ni existencias disponibles.')}
    <section class="exp-page-pad">
      <div class="caliza-materials-opening">
        <h2>Elija primero cómo desea sentir su espacio.</h2>
        <p>El catálogo maestro conserva las fichas de materiales pendientes de validación. Por eso, estas imágenes funcionan como referencias visuales de color, textura y detalles, no como identificaciones técnicas o comerciales de piedra.</p>
      </div>
      <div class="exp-grid exp-grid-4 exp-material-preview caliza-materials-gallery">
        ${materials.map(([name, image, desc]) => `<article>${picture(image, `Imagen editorial de textura: ${name}`)}<div>${label('Referencia de acabado')}<h3>${name}</h3><p>${desc}</p></div></article>`).join('')}
      </div>
      <section class="caliza-materials-next">${label('Converse con un especialista')}<h2>La selección depende del uso.</h2><p>El espacio, la exposición a humedad, el mantenimiento y el tipo de proyecto deben revisarse antes de confirmar materiales y acabados.</p>${button('/stone-design/brief', 'Consultar materiales')}</section>
    </section>`;
}
  function group() {
    return `${hero({ image: 'option08-living.webp', eyebrow: 'Grupo · Arquitectura · Diseño', title: 'Crear.<br>Habitar.<br>Preservar.', desc: 'Un ecosistema de marcas que dialogan con la piedra natural, el diseño y el bienestar.', cta: 'Conocer nuestras líneas', href: '/stone-design' })}
      <section class="exp-copy-split"><div>${label('Nuestra visión')}<h2>La materia conecta.</h2></div><div><p>CALIZA GROUP reúne tres perspectivas complementarias: transformar espacios, diseñar piezas y preservar superficies. La piedra es el punto de partida de una conversación con el tiempo.</p><p>Desde Colombia, una mirada contemporánea inspirada por la arquitectura, la naturaleza y el oficio.</p></div></section>
      <section class="exp-page-pad"><div class="exp-grid exp-grid-3 exp-brand-deck">${[
        ['stone', 'Crear', 'Stone Design', '/stone-design'], ['living', 'Habitar', 'Living Design', '/living-design'], ['care', 'Preservar', 'Stone Care', '/stone-care'],
      ].map(([icon, verb, brand, href]) => `<a href="#${href}">${lineIcon(icon)}<h2>${verb}</h2><h3>CALIZA ${brand}</h3><span>Explorar →</span></a>`).join('')}</div></section>${contactRibbon()}${disclaimer}`;
  }

  function wizardProgress(current) {
    return `<div class="exp-steps" aria-label="Progreso"><span ${current === 0 ? 'aria-current="step"' : ''}>01 · Contexto</span><span ${current === 1 ? 'aria-current="step"' : ''}>02 · Detalles</span><span ${current === 2 ? 'aria-current="step"' : ''}>03 · Resumen</span></div>`;
  }
  function brief() {
    const step = wizard.briefStep;
    let body;
    if (step === 0) body = `<h2>¿Qué desea crear?</h2><label for="brief-type">Tipo de proyecto</label><select id="brief-type" name="type"><option>Cocina o cubierta</option><option>Baño o lavamanos</option><option>Revestimientos</option><option>Objeto o mobiliario</option><option>Otro espacio</option></select><label for="brief-location">Ciudad o ubicación aproximada</label><input id="brief-location" name="location" placeholder="Ej. Barranquilla" maxlength="80" autocomplete="off"><p class="exp-hint">No ingrese direcciones ni datos personales en este prototipo.</p>`;
    else if (step === 1) body = `<h2>Cuéntenos sobre la materia.</h2><label for="brief-surface">Material de interés</label><select id="brief-surface" name="surface"><option>Piedra clara</option><option>Piedra veteada</option><option>Piedra oscura</option><option>Necesito asesoría</option></select><label for="brief-details">Idea y alcance</label><textarea id="brief-details" name="details" rows="5" maxlength="900" placeholder="Describa las medidas aproximadas, la pieza o el ambiente…"></textarea><p class="exp-hint">Evite incluir teléfonos, direcciones u otra información sensible.</p>`;
    else body = `<h2>Su brief está listo.</h2><div class="exp-summary"><p><strong>Proyecto:</strong> ${safeText(wizard.brief.type || 'Por definir')}</p><p><strong>Ciudad:</strong> ${safeText(wizard.brief.location || 'Sin definir')}</p><p><strong>Materia:</strong> ${safeText(wizard.brief.surface || 'Sin definir')}</p><p><strong>Idea:</strong> ${safeText(wizard.brief.details || 'Sin descripción')}</p></div><p>Revise el contenido antes de compartirlo. En esta versión no se envía a ningún servidor.</p><div class="caliza-summary-actions">${waAction(copyContent('brief'), 'Compartir brief')}<button type="button" class="exp-outline" data-copy="brief">Copiar brief</button></div>${waHandoffNote()}`;
    return `${pageIntro('Stone Design / Brief', 'Empecemos por su idea.', 'Un recorrido guiado que puede completar sin entregar datos personales ni realizar pagos.')}
      <section class="exp-wizard"><div class="exp-wizard-panel">${wizardProgress(step)}<form id="brief-form" data-wizard="brief">${body}<div class="exp-wizard-nav">${step > 0 ? '<button type="button" class="exp-outline" data-prev="brief">Anterior</button>' : '<span></span>'}${step < 2 ? '<button class="o8-button" type="submit">Continuar →</button>' : button('/stone-design', 'Volver a Stone Design', 'exp-outline')}</div></form></div><aside>${picture('option08-hero.webp', 'Referencia conceptual de arquitectura en piedra')}<p>La materia inspira. Cada proyecto real requiere revisión técnica, disponibilidad y propuesta específica.</p></aside></section>`;
  }
  function diagnosis() {
    const step = wizard.diagnosisStep;
    let body;
    if (step === 0) body = `<h2>¿Qué superficie desea cuidar?</h2><label for="diag-surface">Tipo de superficie</label><select id="diag-surface" name="surface"><option>Travertino</option><option>Mármol</option><option>Granito</option><option>Piedra sin identificar</option><option>Otra piedra natural</option></select><label for="diag-location">Dónde se encuentra</label><select id="diag-location" name="location"><option>Cocina</option><option>Baño</option><option>Piso</option><option>Mueble u objeto</option><option>Exterior</option></select>`;
    else if (step === 1) body = `<h2>¿Qué observa?</h2><label for="diag-symptom">Síntoma principal</label><select id="diag-symptom" name="symptom"><option>Mancha o cambio de color</option><option>Rayón o pérdida de brillo</option><option>Humedad o absorción</option><option>Rotura o fisura</option><option>Mantenimiento preventivo</option></select><label for="diag-urgency">Estado</label><select id="diag-urgency" name="urgency"><option>No parece avanzar</option><option>Está empeorando</option><option>Recién ocurrió</option></select>`;
    else body = `<h2>Orientación preliminar.</h2><div class="exp-summary"><p><strong>Superficie:</strong> ${safeText(wizard.diagnosis.surface || '')}</p><p><strong>Ubicación:</strong> ${safeText(wizard.diagnosis.location || '')}</p><p><strong>Síntoma:</strong> ${safeText(wizard.diagnosis.symptom || '')}</p><p><strong>Estado:</strong> ${safeText(wizard.diagnosis.urgency || '')}</p></div><p><strong>Primer cuidado:</strong> evite ácidos, abrasivos y productos sin comprobar su compatibilidad. Si hay fisuras, humedad activa o pérdida de material, no experimente: solicite una inspección profesional.</p><p>El resultado no diagnostica causas ni prescribe procedimientos específicos.</p><div class="caliza-summary-actions">${waAction(copyContent('diagnosis'), 'Compartir consulta')}<button type="button" class="exp-outline" data-copy="diagnosis">Copiar orientación</button></div>${waHandoffNote()}`;
    return `${pageIntro('Stone Care / Diagnóstico', 'Empecemos por observar.', 'Una guía de orientación, no un diagnóstico técnico definitivo.')}
      <section class="exp-wizard"><div class="exp-wizard-panel">${wizardProgress(step)}<form id="diagnosis-form" data-wizard="diagnosis">${body}<div class="exp-wizard-nav">${step > 0 ? '<button type="button" class="exp-outline" data-prev="diagnosis">Anterior</button>' : '<span></span>'}${step < 2 ? '<button class="o8-button" type="submit">Continuar →</button>' : button('/stone-care', 'Volver a Stone Care', 'exp-outline')}</div></form></div><aside>${picture('option08-care.webp', 'Cuidado manual conceptual de piedra natural')}<p>Si detecta daños estructurales o materiales sueltos, limite el uso de la superficie hasta contar con evaluación profesional.</p></aside></section>`;
  }
  function contact() {
    return `${pageIntro('Caliza Group / Contacto', 'Hablemos de su proyecto.', 'Prepare una consulta para Stone Design, Living Design o Stone Care. La consulta se prepara en su navegador y solo se comparte si usted decide abrir WhatsApp.')}
      <section class="exp-contact-layout"><div>${picture('option08-living.webp', 'Pieza de piedra natural en ambiente conceptual')}<p>Materia · Espacios · Personas</p><div class="caliza-contact-promise"><strong>Asesoría por línea</strong><span>Stone Design — proyectos en piedra</span><span>Living Design — piezas y colección</span><span>Stone Care — mantenimiento y recuperación</span></div></div><form id="contact-form" class="exp-contact-form"><h2>Cuéntenos su idea.</h2><p>Complete una solicitud que podrá revisar antes de enviarla personalmente por WhatsApp.</p><label for="contact-name">Nombre (opcional)</label><input id="contact-name" name="name" maxlength="80" autocomplete="name" placeholder="Cómo desea que le llamemos"><label for="contact-email">Correo electrónico (opcional)</label><input id="contact-email" name="email" type="email" maxlength="120" autocomplete="email" placeholder="nombre@ejemplo.com"><label for="contact-phone">Teléfono (opcional)</label><input id="contact-phone" name="phone" type="tel" maxlength="24" autocomplete="tel" placeholder="+57 ..."><label for="contact-line">Línea de interés</label><select id="contact-line" name="line"><option>Stone Design · Crear</option><option>Living Design · Habitar</option><option>Stone Care · Preservar</option><option>Consulta general</option></select><label for="contact-city">Ciudad</label><input id="contact-city" name="city" maxlength="70" placeholder="Ciudad (opcional)" autocomplete="off"><label for="contact-message">Mensaje</label><textarea id="contact-message" name="message" rows="5" maxlength="900" placeholder="¿Qué necesita? Sin información sensible."></textarea><button type="submit" class="o8-button exp-action">Preparar mensaje <span aria-hidden="true">→</span></button><p class="exp-hint">No se transmite ninguna información automáticamente. Al preparar la consulta podrá revisar el resumen y compartirlo de forma voluntaria.</p><div id="contact-result" class="caliza-contact-result" tabindex="-1" aria-live="polite" hidden></div></form></section>`;
  }

  // Los iframes solo se cargan tras un gesto explícito del visitante. No existe feed oficial sin autorización OAuth.
  function parseSocialUrl(raw) {
    let url;
    try { url = new URL(raw); } catch { return null; }
    if (url.protocol !== 'https:') return null;
    const host = url.hostname.toLowerCase();
    if (host === 'instagram.com' || host === 'www.instagram.com') {
      const match = url.pathname.match(/^\/(p|reel|tv)\/([a-zA-Z0-9_-]{5,30})(?:\/|$)/);
      if (match) return { platform: 'instagram', url: `https://www.instagram.com/${match[1]}/${match[2]}/`, id: match[2], embed: `https://www.instagram.com/${match[1]}/${match[2]}/embed/` };
    }
    if (host === 'tiktok.com' || host === 'www.tiktok.com') {
      const match = url.pathname.match(/^\/@([a-zA-Z0-9._-]+)\/video\/(\d{10,25})(?:\/|$)/);
      if (match) return { platform: 'tiktok', url: `https://www.tiktok.com/@${match[1]}/video/${match[2]}`, id: match[2], embed: `https://www.tiktok.com/embed/v2/${match[2]}` };
    }
    return null;
  }
  function savedSocialItems() {
    const seen = new Set();
    const all = featuredLinks.map((item) => ({ ...item, featured: true }));
    return all.filter((item) => {
      if (!item.platform || seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    }).map((item, index) => ({ ...item, index }));
  }
  function socialCards(items, compact = false) {
    return `<div class="exp-social-grid ${compact ? 'caliza-social-grid-preview' : ''}">${items.map((item) => `<article class="exp-social-card"><div><span>${item.platform === 'instagram' ? 'Instagram' : 'TikTok'} · Selección editorial</span><strong>${item.platform === 'instagram' ? 'Publicación' : 'Video'} ${item.index + 1}</strong><p>Contenido social seleccionado por CALIZA</p></div>${activeEmbed === item.url ? `<div class="exp-iframe-wrap"><iframe title="Publicación ${item.index + 1} de ${item.platform}" src="${item.embed}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture" sandbox="allow-scripts allow-same-origin allow-popups"></iframe></div>` : `<div class="exp-embed-placeholder"><span class="caliza-social-monogram" aria-hidden="true">${item.platform === 'instagram' ? 'IG' : 'TK'}</span><p>El contenido externo solo se carga si usted pulsa Visualizar.</p></div>`}<div class="exp-social-actions"><button type="button" data-view-social="${item.index}">${activeEmbed === item.url ? 'Ocultar' : 'Visualizar'}</button><a href="${item.url}" target="_blank" rel="noopener noreferrer">Abrir publicación ↗</a></div></article>`).join('')}</div>`;
  }
  function socialProfiles() {
    const profiles = [['instagram', 'Instagram', '@calizastonedesign'], ['tiktok', 'TikTok', '@calizastone']].map(([name, title, handle]) => ({ title, handle, url: profileLink(name) })).filter((entry) => entry.url);
    return `<div class="caliza-profile-links">${profiles.map(({ title, handle, url }) => `<a href="${safeText(url)}" target="_blank" rel="noopener noreferrer"><span>${safeText(title)}</span><strong>${safeText(handle)}</strong><small>Visitar perfil oficial ↗</small></a>`).join('')}</div>`;
  }

  // TikTok permite un embed oficial de perfil público sin OAuth. No se ejecuta ningún script
  // externo hasta que el visitante pulsa el botón (privacidad y rendimiento).
  function tiktokCreatorModule() {
    const url = profileLink('tiktok');
    if (!url) return '';
    return `<section class="caliza-social-live" aria-labelledby="caliza-tiktok-live-title">
      <div class="caliza-social-live-copy">${label('TikTok / @calizastone')}
        <h3 id="caliza-tiktok-live-title">Movimiento y oficio.</h3>
        <p>Consulte el perfil de CALIZA y, si TikTok permite su inserción, explore sus videos recientes aquí. La carga se activa solo cuando usted la solicita.</p>
        <button type="button" class="exp-outline" data-load-tiktok aria-controls="caliza-tiktok-widget" aria-expanded="false">Mostrar videos de TikTok →</button>
        <p class="exp-hint">Al visualizar, su navegador se conecta con TikTok. También puede <a href="${safeText(url)}" target="_blank" rel="noopener noreferrer">abrir el perfil oficial</a>.</p>
      </div>
      <div id="caliza-tiktok-widget" class="caliza-tiktok-widget" hidden>
        <blockquote class="tiktok-embed" cite="${safeText(url)}" data-unique-id="calizastone" data-embed-type="creator" data-embed-from="oembed">
          <section><a href="${safeText(url)}" target="_blank" rel="noopener noreferrer">@calizastone en TikTok</a></section>
        </blockquote>
        <p class="exp-hint">Si el reproductor no aparece, visite el perfil oficial de TikTok.</p>
      </div>
    </section>`;
  }
  function instagramLiveModule() {
  const url = profileLink('instagram');
  if (!url) return '';
  return `<section class="caliza-instagram-live" aria-labelledby="caliza-instagram-live-title">
    <div class="caliza-instagram-live-head">
      <div>${label('Instagram / @calizastonedesign')}
        <h3 id="caliza-instagram-live-title">La materia en imágenes.</h3>
        <p>Explore publicaciones recientes de la cuenta oficial. La galería se solicita a nuestro servidor únicamente cuando usted decide visualizarla.</p>
      </div>
      <div class="caliza-instagram-live-actions">
        <button type="button" class="exp-outline" data-load-instagram aria-controls="caliza-instagram-feed" aria-expanded="false">Ver publicaciones recientes →</button>
        <a href="${safeText(url)}" target="_blank" rel="noopener noreferrer">Abrir Instagram ↗</a>
      </div>
    </div>
    <div id="caliza-instagram-feed" class="caliza-instagram-feed" role="status" aria-live="polite" hidden></div>
    <p class="exp-hint">El acceso a medios recientes requiere una cuenta profesional conectada de forma segura. Si todavía no está vinculada, encontrará el enlace directo al perfil.</p>
  </section>`;
}
  async function loadInstagramFeed(button) {
  const region = document.getElementById('caliza-instagram-feed');
  if (!region || !region.hidden) return;
  region.hidden = false;
  region.textContent = 'Consultando publicaciones de CALIZA…';
  button.disabled = true;
  button.setAttribute('aria-expanded', 'true');
  try {
    const response = await window.fetch('/api/instagram-feed', { method: 'GET', credentials: 'same-origin', headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('not_connected');
    const payload = await response.json();
    if (!Array.isArray(payload.posts)) throw new Error('invalid_feed');
    const valid = payload.posts.slice(0, 9).filter((post) =>
      post && typeof post === 'object' &&
      /^https:\/\/www\.instagram\.com\/(p|reel)\/[a-zA-Z0-9_-]{5,30}\/?$/.test(post.url) &&
      /^https:\/\/(?:[a-zA-Z0-9-]+\.)*(?:cdninstagram\.com|fbcdn\.net|fbsbx\.com)\//.test(post.image || '')
    );
    region.innerHTML = valid.length
      ? `<div class="caliza-instagram-grid">${valid.map((post) => `<a href="${safeText(post.url)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir publicación de CALIZA en Instagram"><img src="${safeText(post.image)}" alt="${safeText(post.caption || 'Publicación reciente de CALIZA')}" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span>${post.type === 'VIDEO' ? 'Reel' : 'Publicación'} <span aria-hidden="true">↗</span></span></a>`).join('')}</div>`
      : '<p>Por ahora no hay publicaciones disponibles para mostrar. Puede explorar el perfil oficial de CALIZA en Instagram.</p>';
  } catch {
    region.textContent = 'La galería automática todavía no está disponible. Visite @calizastonedesign en Instagram para ver las publicaciones actuales.';
  } finally {
    button.textContent = 'Publicaciones consultadas';
  }
}
  function socialPreview() {
    const items = savedSocialItems().slice(0, 3);
    return `<section class="o8-section caliza-social-showcase" aria-labelledby="social-preview-title">
      ${sectionHead('Instagram y TikTok', '/inspiracion', 'Explorar redes')}
      <div class="caliza-social-showcase-intro"><div>${label('Inspiración en movimiento')}
        <h3 id="social-preview-title">De la materia a la conversación.</h3>
        <p>Diseño, piedra y oficio desde los perfiles oficiales de CALIZA. Descubra el contenido compartido por nuestro equipo.</p>
      </div><a href="#/inspiracion" class="o8-text-link">Explorar el universo social <span aria-hidden="true">→</span></a></div>
      ${socialProfiles()}
      ${instagramLiveModule()}
      ${tiktokCreatorModule()}
      ${items.length ? socialCards(items, true) : '<p class="caliza-social-status">La galería de publicaciones de Instagram se habilitará al conectar la cuenta profesional. Mientras tanto, consulte @calizastonedesign desde su enlace oficial.</p>'}
    </section>`;
  }
  function social() {
    const all = savedSocialItems();
    const visible = all.filter((item) => socialFilter === 'todos' || item.platform === socialFilter);
    return `${pageIntro('CALIZA / Redes y movimiento', 'Inspiración viva.', 'Conozca la comunidad de CALIZA en Instagram y TikTok. El visor editorial solo muestra publicaciones individuales seleccionadas por el equipo.')}
      <section class="exp-page-pad"><div class="exp-social-intro"><div>${label('CALIZA en movimiento')}<h2>La materia también se comparte.</h2><p>Contenido sobre diseño, superficies y cuidado. Siga los perfiles oficiales para conocer proyectos, novedades y experiencias de CALIZA.</p></div><div class="exp-social-example">${picture('option08-care.webp', 'Imagen conceptual editorial de cuidado de superficies')}</div></div>
      ${socialProfiles()}
      ${instagramLiveModule()}
      ${tiktokCreatorModule()}
      ${all.length ? `<div class="exp-toolbar caliza-social-toolbar"><p><strong>${all.length}</strong> publicaciones seleccionadas</p><div class="caliza-social-filters" role="group" aria-label="Filtrar publicaciones">${[['todos', 'Todos'], ['instagram', 'Instagram'], ['tiktok', 'TikTok']].map(([value, text]) => `<button type="button" class="${socialFilter === value ? 'selected' : ''}" data-social-filter="${value}" aria-pressed="${socialFilter === value}">${text}</button>`).join('')}</div></div>` : ''}
      ${visible.length ? socialCards(visible) : `<div class="exp-empty exp-social-empty"><h2>${all.length ? 'Sin publicaciones de esta red.' : 'Próximamente, selección editorial.'}</h2><p>Las publicaciones individuales aparecerán cuando sus enlaces y permisos hayan sido aprobados. Los perfiles de CALIZA ya están disponibles arriba.</p></div>`}
      <div class="exp-social-disclaimer">Los contenidos externos se cargan únicamente cuando el visitante lo solicita. No simulamos un feed automático ni mostramos publicaciones sin aprobación editorial.</div></section>`;
  }

  function missing() {
    return `${pageIntro('Caliza Group / 404', 'Esta ruta no existe.', 'La página solicitada no forma parte de la experiencia de revisión.')}
      <section class="exp-cta-centered">${button('/', 'Volver al inicio')}</section>`;
  }
  function currentPage(route) {
    if (route === '/') return home();
    if (route === '/stone-design') return stone();
    if (route === '/stone-design/proyectos' || route === '/proyectos') return projects();
    if (route === '/archivo') return r6ArchivePage();
    if (route === '/stone-design/brief') return brief();
    if (route === '/living-design') return living();
    if (route === '/living-design/coleccion' || route === '/tienda') return collection();
    if (route.startsWith('/living-design/familia/')) return familyDetail(route);
    // Enlaces guardados de fichas no autorizadas y carrito antiguo llegan a la colección consultiva.
    if (route.startsWith('/living-design/pieza/')) return collection();
    if (route === '/living-design/experiencia') return experience();
    if (route === '/living-design/carrito') return collection();
    if (route === '/stone-care') return care();
    if (route === '/stone-care/diagnostico') return diagnosis();
    if (route === '/materiales') return materialsPage();
    if (route === '/grupo') return group();
    if (route === '/contacto') return contact();
    if (route === '/inspiracion') return social();
    return missing();
  }
  let dockVisibilityObserver = null;
  function observeDock() {
    if (typeof IntersectionObserver === 'undefined' || !document.body) return;
    dockVisibilityObserver?.disconnect();
    const hero = main.querySelector('.exp-hero');
    const footer = document.querySelector('.o8-footer');
    const dock = document.querySelector('.caliza-conversion-dock');
    if (!dock) return;
    let heroVisible = false;
    let footerVisible = false;
    let collectionVisible = false;
    const collections = main.querySelector('.caliza-family-grid');
    dock.classList.remove('is-hidden');
    dockVisibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === footer) footerVisible = entry.isIntersecting;
        if (entry.target === collections) collectionVisible = entry.isIntersecting;
      });
      const mobile = window.matchMedia?.('(max-width: 660px)').matches;
      dock.classList.toggle('is-hidden', footerVisible || (!mobile && (heroVisible || collectionVisible)));
    }, { threshold: 0.15 });
    if (hero) dockVisibilityObserver.observe(hero);
    if (footer) dockVisibilityObserver.observe(footer);
    if (collections) dockVisibilityObserver.observe(collections);
  }
  const seoDescriptions = { '/': 'CALIZA GROUP: piedra natural, mobiliario y cuidado de superficies en Colombia.', '/stone-design': 'CALIZA Stone Design: soluciones en piedra natural y proyectos arquitectónicos bajo consulta.', '/living-design': 'CALIZA Living Design: familias de mobiliario contemporáneo bajo consulta.', '/living-design/coleccion': 'Explore las familias de mesas, sillas y lavamanos de CALIZA.', '/stone-care': 'CALIZA Stone Care: orientación para el mantenimiento y cuidado de piedra natural.', '/contacto': 'Comuníquese con CALIZA por WhatsApp y prepare una consulta personalizada.' };
  function render(scroll = true) {
    const paint = () => {
    const route = getRoute();
    const legacy = (location.hash || '').startsWith('#/tienda') || (location.hash || '').startsWith('#/living-design/carrito') || (location.hash || '').startsWith('#/living-design/pieza/');
    if (legacy && window.history?.replaceState) {
      const params = (location.hash.split('?')[1] || '');
      window.history.replaceState(null, '', '#/living-design/coleccion' + (params ? '?' + params : ''));
    }
    main.innerHTML = currentPage(route);
    const heading = main.querySelector('h1');
    const pageTitle = heading?.innerHTML?.replace(/<br\s*\/?\s*>/gi, ' ').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || heading?.textContent?.trim();
    const familyRoute = route.startsWith('/living-design/familia/') ? families.find((f) => route.endsWith('/' + f.slug)) : null;
    const titles = {
      '/': 'La materia toma forma.', '/stone-design': 'Stone Design · Espacios que perduran.',
      '/living-design': 'Living Design · Piezas para habitar.',
      '/living-design/coleccion': 'Colecciones · Living Design',
      '/stone-care': 'Stone Care · Cuidar también es diseñar.',
      '/contacto': 'Contacto · Hablemos de su proyecto'
    };
    document.title = `${familyRoute ? familyRoute.nombre + ' · Living Design' : titles[route] || pageTitle || 'CALIZA GROUP'} · CALIZA GROUP`;
    const description = familyRoute ? 'Explore ' + familyRoute.nombre + ' de CALIZA Living Design y prepare una consulta personalizada.' : seoDescriptions[route] || 'CALIZA GROUP · Piedra, diseño y cuidado.';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.content = description;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = document.title;
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.content = description;
    document.querySelectorAll('.o8-nav a').forEach((link) => link.setAttribute('aria-current', route === link.getAttribute('href')?.substring(1) ? 'page' : 'false'));
    syncConversionDock();
    observeDock();
    if (scroll) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const accessibleHeading = main.querySelector('h1');
      accessibleHeading?.setAttribute?.('tabindex', '-1');
      if (accessibleHeading?.focus) {
        accessibleHeading.focus({ preventScroll: true });
        // Ensure keyboard focus survives the anchor default action after a route change.
        window.requestAnimationFrame?.(() => {
          if (main.contains?.(accessibleHeading) && document.activeElement !== accessibleHeading && getRoute() === route) {
            accessibleHeading.focus({ preventScroll: true });
          }
        });
      } else main.focus({ preventScroll: true });
    }
    };
    // Navegación síncrona, sin capturas de toda la página. La animación root
    // superponía cabecera, contenido previo y footer en cambios de ruta.
    paint();
  }

  function copyText(text) {
    if (!navigator.clipboard?.writeText) return announce('La copia no está disponible aquí. Abra esta página por HTTPS.');
    navigator.clipboard.writeText(text).then(() => announce('Resumen copiado. No se envió ningún dato.'), () => announce('No se pudo copiar: revise los permisos del navegador.'));
  }
  function copyContent(kind) {
    if (kind === 'brief') return `CALIZA STONE DESIGN — brief\nProyecto: ${wizard.brief.type}\nCiudad: ${wizard.brief.location}\nMaterial: ${wizard.brief.surface}\nIdea: ${wizard.brief.details}`;
    return `CALIZA STONE CARE — orientación preliminar\nSuperficie: ${wizard.diagnosis.surface}\nLugar: ${wizard.diagnosis.location}\nSíntoma: ${wizard.diagnosis.symptom}\nEstado: ${wizard.diagnosis.urgency}\nEvitar ácidos y abrasivos. Solicitar evaluación especializada antes de intervenir.`;
  }

  document.addEventListener('click', (event) => {
    // Prevent hash anchors from reclaiming keyboard focus after the new page
    // has deliberately focused its H1. Do not intercept external links.
    const internalLink = event.target.closest?.('a[href^="#/"]');
    if (internalLink) {
      event.preventDefault?.();
      const requested = internalLink.getAttribute('href');
      if (requested && requested !== location.hash) location.hash = requested;
      else render();
      return;
    }
    if (event.target.closest('a[data-marketing-cta="whatsapp"]')) emitIntent('whatsapp_handoff');
    const target = event.target.closest('button');
    if (!target) return;
    if (target.dataset.loadInstagram !== undefined) { loadInstagramFeed(target); return; }
    if (target.dataset.loadTiktok !== undefined) {
      const widget = document.getElementById('caliza-tiktok-widget');
      if (!widget || !widget.hidden) return;
      widget.hidden = false;
      target.setAttribute('aria-expanded', 'true');
      target.disabled = true;
      const external = document.createElement('script');
      external.async = true;
      external.src = 'https://www.tiktok.com/embed.js';
      external.referrerPolicy = 'strict-origin-when-cross-origin';
      external.onerror = () => announce('El reproductor de TikTok no pudo cargarse. Puede visitar el perfil oficial.');
      widget.appendChild(external);
      return;
    }
    if (target.dataset.dismissQa !== undefined) { document.getElementById('qa-banner')?.remove(); return; }
    if (target.dataset.filter) {
      const cat = target.dataset.filter;
      const params = new URLSearchParams(location.hash.split('?')[1] || '');
      if (cat === 'Todas') params.delete('categoria');
      else params.set('categoria', cat);
      const qs = params.toString();
      location.hash = `/living-design/coleccion${qs ? '?' + qs : ''}`;
      render(false);
    }
    if (target.dataset.copy) copyText(copyContent(target.dataset.copy));
    if (target.dataset.prev) {
      wizard[target.dataset.prev === 'brief' ? 'briefStep' : 'diagnosisStep'] -= 1;
      render(false);
    }
    if (target.dataset.socialFilter) {
      socialFilter = target.dataset.socialFilter;
      activeEmbed = null;
      render(false);
    }
    if (target.dataset.viewSocial !== undefined) {
      const item = savedSocialItems()[Number(target.dataset.viewSocial)];
      if (item) { activeEmbed = activeEmbed === item.url ? null : item.url; render(false); }
    }
  });
  function handleFamilyInquiry(form) {
  const data = new FormData(form);
  const family = String(data.get('family') || '').trim();
  if (!families.some((f) => f.nombre === family)) return announce('Familia no reconocida. Regrese a las colecciones.');
  const lines = [
    'CALIZA LIVING DESIGN — solicitud de asesoría',
    'Familia: ' + family,
    'Tipo: ' + String(data.get('subgroup') || 'Solicito orientación').slice(0, 90),
    'Uso: ' + String(data.get('use') || 'Por definir').slice(0, 60),
    'Ciudad: ' + String(data.get('city') || 'Por definir').slice(0, 70),
    'Preferencias: ' + String(data.get('details') || 'Por definir').slice(0, 700),
  ];
  const summary = lines.join('\n');
  const result = document.getElementById('family-inquiry-result');
  if (!result) return;
  result.hidden = false;
  result.innerHTML = `<h3>Consulta lista para revisar.</h3><pre>${safeText(summary)}</pre><div class="caliza-summary-actions">${waAction(summary, 'Compartir con CALIZA')}</div>${waHandoffNote()}`;
  result.focus({ preventScroll: false });
  emitIntent('family_inquiry_ready');
  announce('Consulta preparada. Usted decide si desea compartirla.');
}
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    event.preventDefault();
    if (form.id === 'family-inquiry-form') return handleFamilyInquiry(form);
    if (form.id === 'collection-search-form') {
      const search = String(new FormData(form).get('q') || '').trim().slice(0, 80);
      const params = new URLSearchParams(location.hash.split('?')[1] || '');
      if (search) params.set('q', search);
      else params.delete('q');
      const qs = params.toString();
      location.hash = `/living-design/coleccion${qs ? '?' + qs : ''}`;
      render(false);
    }
    if (form.id === 'contact-form') {
      const data = new FormData(form);
      const message = String(data.get('message') || '').trim();
      if (!message) return announce('Describa su idea antes de preparar el mensaje.');
      const summary = `CALIZA GROUP — consulta\nNombre: ${String(data.get('name') || 'No indicado').slice(0, 80)}\nCorreo: ${String(data.get('email') || 'No indicado').slice(0, 120)}\nTeléfono: ${String(data.get('phone') || 'No indicado').slice(0, 24)}\nLínea: ${data.get('line')}\nCiudad: ${data.get('city') || 'Por definir'}\nMensaje: ${message}`;
      const result = document.getElementById('contact-result');
      result.hidden = false;
      result.innerHTML = `<h3>Su consulta está preparada.</h3><p>Revise la solicitud antes de abrir WhatsApp. No existe un envío automático.</p><pre>${safeText(summary)}</pre><div class="caliza-summary-actions">${waAction(summary, 'Compartir consulta')}<button class="exp-outline" type="button" data-copy-contact>Copiar mensaje</button></div>${waHandoffNote()}`;
      result.focus({ preventScroll: false });
      result.querySelector('[data-copy-contact]').addEventListener('click', () => copyText(summary));
      emitIntent('contact_ready');
      announce('Consulta preparada localmente. Usted decide si desea compartirla.');
    }
    if (form.dataset.wizard) {
      const kind = form.dataset.wizard;
      const data = Object.fromEntries(new FormData(form));
      if (kind === 'brief') { Object.assign(wizard.brief, data); wizard.briefStep = Math.min(2, wizard.briefStep + 1); if (wizard.briefStep === 2) emitIntent('brief_ready'); }
      else { Object.assign(wizard.diagnosis, data); wizard.diagnosisStep = Math.min(2, wizard.diagnosisStep + 1); if (wizard.diagnosisStep === 2) emitIntent('diagnosis_ready'); }
      render(false);
    }
  });
  const menu = document.getElementById('mobile-nav');
  const menuToggle = document.getElementById('menu-toggle');
  function setMenu(open, returnFocus = false) {
    menu.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body?.classList?.toggle('menu-open', open);
    if (open) menu.querySelector?.('a')?.focus?.();
    else if (returnFocus) menuToggle.focus?.();
  }
  menuToggle.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) { setMenu(false, true); }
  });
  // El enlace de salto conserva la URL del hash-router y mueve el foco al contenido.
  document.querySelector('.skip-link')?.addEventListener('click', (event) => {
    event.preventDefault();
    main.focus({ preventScroll: false });
  });
  window.addEventListener('hashchange', () => { activeEmbed = null; render(); });
  render(false);
})();
