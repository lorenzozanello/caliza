/* CALIZA GROUP — experiencia de revisión. Sin backend, checkout ni captura de datos. */
(() => {
  'use strict';

  const IMG = 'assets/img/';
  const main = document.getElementById('main');
  const feedback = document.getElementById('feedback');
  const CART_KEY = 'caliza-review-quote-v1';
  const SOCIAL_KEY = 'caliza-review-social-v1';
  const safeText = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const load = (key, fallback) => { try { const value = JSON.parse(localStorage.getItem(key)); return Array.isArray(value) ? value : fallback; } catch { return fallback; } };
  const store = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { announce('El navegador no permite guardar esta selección.'); } };
  const picture = (name, alt, cls = '') => `<img class="${cls}" src="${IMG}${name}" alt="${safeText(alt)}" loading="lazy">`;
  const button = (url, label, cls = 'o8-button') => `<a class="${cls}" href="#${url}">${label} <span aria-hidden="true">→</span></a>`;
  const label = (text) => `<span class="o8-overline">${text}</span>`;
  const lineIcon = (name) => `<img class="brand-line-icon" src="${IMG}option08-${name}.svg" alt="" aria-hidden="true">`;
  const disclaimer = `<p class="review-label">Imágenes de ambientación conceptuales. Fotografías, acabados y disponibilidad sujetos a validación comercial.</p>`;
  const getRoute = () => (location.hash.startsWith('#/') ? location.hash.substring(1) : '/').split('?')[0].replace(/\/+$/, '') || '/';
  let cart = load(CART_KEY, []).filter((x) => x && typeof x.slug === 'string' && Number.isInteger(x.qty) && x.qty > 0).slice(0, 50);
  let links = load(SOCIAL_KEY, []).filter((x) => x && (x.platform === 'instagram' || x.platform === 'tiktok') && typeof x.url === 'string' && parseSocialUrl(x.url)).slice(0, 8);
  let wizard = { briefStep: 0, diagnosisStep: 0, brief: {}, diagnosis: {} };
  let activeEmbed = null;
  let toastTimer;

  // Nombres encontrados en el prototipo histórico; ningún precio, referencia o stock se publica como aprobado.
  const catalogue = [
    ['mesa-rubi', 'Mesa Rubi', 'Mesas', 'option08-living.webp'],
    ['mesa-alma', 'Mesa Alma', 'Mesas', 'p1.jpg'],
    ['mesa-vera', 'Mesa Vera', 'Mesas', 'comedor.jpg'],
    ['mesa-victoria', 'Mesa Victoria', 'Mesas', 'option08-living.webp'],
    ['mesa-elena', 'Mesa Elena', 'Mesas', 'p1.jpg'],
    ['mesa-ella', 'Mesa Ella', 'Mesas', 'comedor.jpg'],
    ['mesa-lalik', 'Mesa Lalik', 'Mesas', 'option08-living.webp'],
    ['mesa-roma', 'Mesa Roma', 'Mesas', 'p1.jpg'],
    ['mesa-stella', 'Mesa Stella', 'Mesas', 'option08-living.webp'],
    ['silla-aria', 'Silla Aria', 'Sillas', 'comedor.jpg'],
    ['silla-lara', 'Silla Lara', 'Sillas', 'comedor.jpg'],
    ['silla-luna', 'Silla Luna', 'Sillas', 'comedor.jpg'],
    ['silla-zara', 'Silla Zara', 'Sillas', 'comedor.jpg'],
    ['silla-maya', 'Silla Maya', 'Sillas', 'comedor.jpg'],
    ['mesa-auxiliar', 'Mesa Auxiliar', 'Objetos', 'p3.jpg'],
    ['lavamanos-piedra', 'Lavamanos Piedra', 'Lavamanos', 'lavamanos.jpg'],
  ].map(([slug, name, category, image]) => ({ slug, name, category, image }));

  function announce(message) {
    feedback.textContent = message;
    feedback.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { feedback.hidden = true; }, 4500);
  }
  function tally() { document.getElementById('cart-count').textContent = String(cart.reduce((n, item) => n + item.qty, 0)); }
  function mediaCard(item) {
    return `<a href="#/living-design/pieza/${item.slug}" class="exp-card exp-product-card">${picture(item.image, `Imagen conceptual para explorar ${item.name}`)}<div class="exp-card-info"><div><h3>${item.name}</h3><p>${item.category} · Consultar disponibilidad</p></div><span aria-hidden="true">↗</span></div></a>`;
  }
  function hero({ image, eyebrow, title, desc, cta, href, position = 'center' }) {
    return `<section class="exp-hero"><img src="${IMG}${image}" alt="Ambientación conceptual con piedra natural" style="object-position:${position}" fetchpriority="high"><div class="exp-hero-content">${label(eyebrow)}<h1>${title}</h1><span class="o8-terracotta-rule"></span><p>${desc}</p>${cta ? button(href, cta) : ''}</div><small class="exp-hero-corner">CALIZA GROUP / COLOMBIA</small></section>`;
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
      ['/living-design/experiencia', 'Experiencia'], ['/living-design/carrito', 'Mi selección'],
    ];
    return `<nav class="exp-subnav" aria-label="Navegación Living Design">${nav.map(([href, text]) => `<a href="#${href}" ${href === current ? 'aria-current="page"' : ''}>${text}</a>`).join('')}</nav>`;
  }

  function home() {
    return `${hero({ image: 'option08-hero.webp', eyebrow: 'Piedra natural · Diseño de vida', title: 'La materia<br>toma forma.', desc: 'Diseño, vida y cuidado en piedra natural para espacios que perduran.', cta: 'Explorar proyectos', href: '/proyectos' })}
      <section class="o8-pillars" aria-label="Nuestras tres líneas">
        ${[
          ['stone', 'option08-hero.webp', 'Crear', 'Stone Design', 'Proyectos en piedra natural a medida.', '/stone-design'],
          ['living', 'option08-living.webp', 'Habitar', 'Living Design', 'Mobiliario y objetos que dan forma a la vida.', '/living-design'],
          ['care', 'option08-care.webp', 'Preservar', 'Stone Care', 'Cuidado y restauración para que la belleza perdure.', '/stone-care'],
        ].map(([icon, image, name, brand, desc, href]) => `<a href="#${href}" class="o8-pillar">${picture(image, `Escena conceptual de ${brand}`)}<div class="o8-pillar-copy">${lineIcon(icon)}<div><h2>${name}</h2><span>${brand}</span><p>${desc}</p></div><b aria-hidden="true">→</b></div></a>`).join('')}
      </section>
      <section class="o8-section">${sectionHead('Piezas para habitar', '/living-design/coleccion', 'Explorar colección')}<div class="exp-grid exp-grid-2">${mediaCard(catalogue[0])}${mediaCard(catalogue[15])}</div></section>
      <section class="o8-section">${sectionHead('La expresión de la materia', '/materiales', 'Explorar materiales')}${materialPreview()}</section>
      <section class="exp-banner">${picture('option08-hero.webp', 'Arquitectura mediterránea conceptual')}<div>${label('Caliza Stone Design')}<h2>Espacios que perduran.</h2><p>Proyectos concebidos desde la materia y el oficio.</p>${button('/stone-design/brief', 'Iniciar proyecto')}</div></section>
      <section class="exp-banner exp-banner-care">${picture('option08-care.webp', 'Cuidado artesanal de piedra natural')}<div>${label('Caliza Stone Care')}<h2>Cuidar también es diseñar.</h2><p>Conoce cómo preservar la belleza de la piedra.</p>${button('/stone-care/diagnostico', 'Consultar cuidado')}</div></section>
      <section class="o8-section">${sectionHead('Inspiración y movimiento', '/inspiracion', 'Explorar Instagram y TikTok')}<div class="exp-grid exp-grid-3"><div class="exp-editorial">${picture('option08-hero.webp', 'Proyecto conceptual de piedra natural')}<h3>La materia</h3><p>Arquitectura y oficio.</p></div><div class="exp-editorial">${picture('option08-living.webp', 'Ambiente conceptual Living Design')}<h3>La pieza</h3><p>Objetos para habitar.</p></div><div class="exp-editorial">${picture('option08-care.webp', 'Superficie en cuidado')}<h3>El cuidado</h3><p>Preservar lo esencial.</p></div></div></section>
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
    return `<section class="o8-contact"><div>${label('Caliza Group')}<h2>Hablemos de tu proyecto.</h2><p>Cuéntanos qué quieres crear, habitar o preservar. En esta revisión puedes preparar y copiar tu solicitud.</p>${button('/contacto', 'Preparar solicitud')}</div><span class="o8-contact-mark">Crear.<br>Habitar.<br>Preservar.</span></section>`;
  }

  function stone() {
    return `${hero({ image: 'option08-hero.webp', eyebrow: 'Caliza Stone Design · Crear', title: 'Espacios<br>que perduran.', desc: 'Diseño y transformación de espacios a través de la piedra natural.', cta: 'Iniciar un proyecto', href: '/stone-design/brief' })}
      <section class="exp-copy-split"><div>${lineIcon('stone')}${label('Piedra · Arquitectura · Oficio')}<h2>De la idea a la materia.</h2></div><div><p>Concebimos proyectos en los que cada superficie, textura y encuentro construye una relación duradera entre las personas y el espacio.</p><p>Explora posibilidades en cubiertas, lavamanos, revestimientos, mesas y soluciones a medida.</p></div></section>
      <section class="o8-section">${sectionHead('Universo de proyectos', '/stone-design/proyectos', 'Ver galería')}<div class="exp-grid exp-grid-3">${[
        ['option08-hero.webp', 'Cocinas', 'Superficies para encuentros cotidianos.'], ['lavamanos.jpg', 'Baños', 'Gestos de piedra y agua.'], ['proyecto.jpg', 'Espacios', 'Arquitectura y detalles a medida.']
      ].map(([image, title, desc]) => `<a class="exp-card" href="#/stone-design/proyectos">${picture(image, `Referencia conceptual para ${title}`)}<div class="exp-card-info"><div><h3>${title}</h3><p>${desc}</p></div><span aria-hidden="true">↗</span></div></a>`).join('')}</div></section>
      <section class="exp-process">${label('Nuestro proceso')}<h2>Diseñamos contigo</h2><div class="exp-grid exp-grid-4">${['Escuchamos la idea', 'Exploramos la materia', 'Diseñamos la solución', 'Planeamos su realización'].map((v, i) => `<div><span>0${i + 1}</span><h3>${v}</h3></div>`).join('')}</div></section>${contactRibbon()}${disclaimer}`;
  }
  function projects() {
    return `${pageIntro('Stone Design / Proyectos', 'Arquitectura y materia.', 'Una galería de direcciones creativas. Las imágenes mostradas no se presentan como obras ejecutadas por Caliza.')}
      <section class="exp-page-pad"><div class="exp-grid exp-grid-3">${[
        ['option08-hero.webp', 'Cocinas y superficies'], ['proyecto.jpg', 'Arquitectura y revestimientos'], ['lavamanos.jpg', 'Lavamanos y baños'], ['comedor.jpg', 'Mobiliario a medida'], ['detalle_borde.jpg', 'Detalles de oficio'], ['option08-living.webp', 'Interiorismo en piedra'],
      ].map(([image, title]) => `<article class="exp-project">${picture(image, `${title}: imagen de referencia sin atribución de obra`)}<h2>${title}</h2><p>Concepto visual para explorar con el equipo.</p></article>`).join('')}</div><div class="exp-cta-centered">${button('/stone-design/brief', 'Contar mi proyecto')}</div></section>${disclaimer}`;
  }
  function living() {
    return `${hero({ image: 'option08-living.webp', eyebrow: 'Caliza Living Design · Habitar', title: 'Piezas<br>para habitar.', desc: 'Mobiliario, mesas y objetos que dan forma a los espacios y a nuestra manera de vivir.', cta: 'Explorar colección', href: '/living-design/coleccion' })}${subnav('/living-design')}
      <section class="exp-copy-split"><div>${lineIcon('living')}<h2>La belleza de lo esencial.</h2></div><div><p>Cada pieza parte de una conversación entre geometría, material y oficio. Explora las familias y prepara tu selección para recibir una cotización.</p><p>Los nombres proceden del prototipo de trabajo; fichas, fotos y disponibilidad requieren ratificación de Caliza.</p></div></section>
      <section class="o8-section">${sectionHead('Colección editorial', '/living-design/coleccion', 'Ver las 16 referencias')}<div class="exp-grid exp-grid-3">${catalogue.slice(0, 3).map(mediaCard).join('')}</div></section>
      <section class="exp-pathways"><h2>Tres formas de hacerla tuya.</h2><div class="exp-grid exp-grid-3">${[
        ['01', 'Explorar una pieza', 'Selecciona las referencias que te interesan.'], ['02', 'Fabricar bajo pedido', 'Evalúa material, medidas y acabados.'], ['03', 'Diseñar a medida', 'Empecemos desde tus ideas.'],
      ].map(([n, title, desc]) => `<a href="#/living-design/experiencia"><span>${n}</span><h3>${title}</h3><p>${desc}</p><b aria-hidden="true">→</b></a>`).join('')}</div></section>${contactRibbon()}${disclaimer}`;
  }
  function collection() {
    const query = location.hash.split('?')[1] || '';
    const category = new URLSearchParams(query).get('categoria') || 'Todas';
    const selection = catalogue.filter((item) => category === 'Todas' || item.category === category);
    return `${pageIntro('Living Design / Colección', 'Objetos para vivir.', 'Explora las referencias del prototipo, filtra por familia y prepara una selección sin compromiso ni pago.')}${subnav('/living-design/coleccion')}
      <section class="exp-page-pad"><div class="exp-toolbar"><p><strong>${selection.length}</strong> referencias de diseño</p><div role="group" aria-label="Filtrar productos" class="exp-filters">${['Todas', 'Mesas', 'Sillas', 'Objetos', 'Lavamanos'].map((cat) => `<button type="button" data-filter="${cat}" class="${category === cat ? 'selected' : ''}" aria-pressed="${category === cat}">${cat}</button>`).join('')}</div></div>
      <div class="exp-grid exp-grid-4">${selection.map(mediaCard).join('')}</div><p class="exp-catalogue-warning">Sin precios publicados ni inventario confirmado. Las imágenes pueden representar una familia, no la pieza específica.</p></section>`;
  }
  function product(slug) {
    const item = catalogue.find((x) => x.slug === slug);
    if (!item) return missing();
    return `<nav class="exp-breadcrumb"><a href="#/">Inicio</a> / <a href="#/living-design/coleccion">Colección</a> / ${item.name}</nav>
      <section class="exp-product-detail"><div class="exp-product-photo">${picture(item.image, `Fotografía de referencia conceptual para ${item.name}`)}<span>Imagen conceptual / no es ficha técnica verificada</span></div>
      <div class="exp-product-config">${label(`Living Design · ${item.category}`)}<h1>${item.name}</h1><span class="o8-terracotta-rule"></span><p>Diseño de piedra natural sujeto a definición de material, dimensiones y acabados. La configuración se revisa con el equipo antes de cotizar.</p>
      <label for="material-selection">Material de interés</label><select id="material-selection"><option>Piedra clara</option><option>Piedra veteada</option><option>Piedra oscura</option><option>Por definir con Caliza</option></select>
      <label for="size-selection">Dimensión / aplicación</label><select id="size-selection"><option>A definir</option><option>Medida estándar por confirmar</option><option>Diseño a medida</option></select>
      <label for="quantity-selection">Cantidad</label><input id="quantity-selection" type="number" inputmode="numeric" min="1" max="20" value="1">
      <button type="button" class="o8-button exp-action" data-add-quote="${slug}">Agregar a mi selección <span aria-hidden="true">→</span></button><a class="o8-text-link" href="#/living-design/carrito">Ver mi selección para cotizar →</a>
      <div class="exp-spec"><details><summary>Materiales y acabados</summary><p>La veta, el espesor y la terminación dependen de la placa y del alcance ratificado.</p></details><details><summary>Fabricación y entrega</summary><p>Disponibilidad, plazos, logística e instalación se confirman en una propuesta individual.</p></details><details><summary>Precio y condiciones</summary><p>No se muestran precios de demostración como ofertas reales. La selección no constituye un pedido.</p></details></div></div></section>
      <section class="o8-section">${sectionHead('También te puede interesar', '/living-design/coleccion', 'Ver colección')}<div class="exp-grid exp-grid-3">${catalogue.filter((x) => x.slug !== slug).slice(0, 3).map(mediaCard).join('')}</div></section>${disclaimer}`;
  }
  function experience() {
    return `${pageIntro('Living Design / Experiencia', 'Habitar empieza con una idea.', 'Tres recorridos comerciales para acercarte a la pieza. En este prototipo todos terminan en solicitud de cotización, nunca en cobro.')}${subnav('/living-design/experiencia')}
      <section class="exp-page-pad"><div class="exp-grid exp-grid-3 exp-choice-cards"><article>${label('01 · Explorar')}<h2>Elegir una referencia.</h2><p>Revisa la colección y selecciona las piezas que te gustan.</p>${button('/living-design/coleccion', 'Ver colección')}</article><article>${label('02 · Fabricar')}<h2>Definir los detalles.</h2><p>Elige material, dimensiones aproximadas y acabados para conversar con el equipo.</p>${button('/living-design/coleccion', 'Configurar una pieza')}</article><article>${label('03 · Personalizar')}<h2>Crear a tu medida.</h2><p>Prepara un brief con las condiciones de tu espacio y el concepto deseado.</p>${button('/stone-design/brief', 'Crear brief')}</article></div></section>`;
  }
  function cartPage() {
    const entries = cart.map((entry, index) => ({ ...entry, index, item: catalogue.find((x) => x.slug === entry.slug) })).filter((x) => x.item);
    return `${pageIntro('Living Design / Selección', 'Tu selección de piezas.', 'Revisa los productos y copia un resumen para compartirlo con Caliza cuando el canal comercial esté habilitado.')}${subnav('/living-design/carrito')}
      <section class="exp-page-pad exp-cart">${entries.length ? `<div class="exp-cart-list">${entries.map(({ item, index, qty, material, size }) => `<div class="exp-cart-row">${picture(item.image, `Imagen de referencia ${item.name}`)}<div><h2>${item.name}</h2><p>${safeText(material)} · ${safeText(size)}</p><div class="exp-quantity"><button type="button" data-cart-minus="${index}" aria-label="Reducir cantidad de ${item.name}">−</button><span>${qty}</span><button type="button" data-cart-plus="${index}" aria-label="Aumentar cantidad de ${item.name}">+</button></div></div><button type="button" class="exp-remove" data-cart-remove="${index}">Quitar</button></div>`).join('')}</div>
      <aside class="exp-cart-summary"><h2>Resumen para cotizar</h2><p>${entries.length} referencia(s) · sin precios ni pedido confirmado</p><button class="o8-button exp-action" type="button" data-copy="cart">Copiar solicitud <span aria-hidden="true">↗</span></button><p>Solo se guarda en este navegador. No se transmiten datos a Caliza.</p>${button('/living-design/coleccion', 'Seguir explorando', 'o8-text-link')}</aside>` : `<div class="exp-empty"><h2>Tu selección está vacía.</h2><p>Explora el catálogo y añade referencias que quieras cotizar.</p>${button('/living-design/coleccion', 'Explorar colección')}</div>`}</section>`;
  }

  function care() {
    return `${hero({ image: 'option08-care.webp', eyebrow: 'Caliza Stone Care · Preservar', title: 'Cuidar también<br>es diseñar.', desc: 'Cuidado, protección y restauración para que la belleza de la piedra perdure.', cta: 'Iniciar diagnóstico', href: '/stone-care/diagnostico', position: '60% center' })}
      <section class="exp-copy-split"><div>${lineIcon('care')}<h2>Preservar es conocer la materia.</h2></div><div><p>Las superficies naturales merecen un cuidado consciente. Desde una rutina preventiva hasta la evaluación de una restauración, cada decisión parte de reconocer la piedra.</p><p>El diagnóstico digital es únicamente orientativo; no sustituye la inspección de un especialista.</p></div></section>
      <section class="o8-section">${sectionHead('Nuestros frentes de cuidado', '/stone-care/diagnostico', 'Explorar diagnóstico')}<div class="exp-grid exp-grid-3 exp-service-cards">${[
        ['Limpieza', 'Rutinas adaptadas a la naturaleza de la superficie.'],
        ['Protección', 'Evaluación de sellado y prevención.'],
        ['Restauración', 'Valoración técnica de manchas, desgaste y daño.'],
      ].map(([title, desc], i) => `<a href="#/stone-care/diagnostico"><span>0${i + 1}</span><h3>${title}</h3><p>${desc}</p><b aria-hidden="true">→</b></a>`).join('')}</div></section>
      <section class="exp-banner exp-banner-care">${picture('option08-care.webp', 'Persona limpiando piedra natural con herramienta manual')}<div>${label('Conoce tu superficie')}<h2>El primer paso es observar.</h2><p>Cuéntanos qué tipo de piedra y síntoma quieres evaluar.</p>${button('/stone-care/diagnostico', 'Empezar diagnóstico')}</div></section>${disclaimer}`;
  }
  function materialsPage() {
    return `${pageIntro('Caliza Group / Materiales', 'Cada piedra, una historia.', 'Texturas, vetas y tonos naturales. Estas muestras son referencias visuales, no un inventario de placas disponibles.')}
      <section class="exp-page-pad"><div class="exp-grid exp-grid-2 exp-material-details">${materials.map(([name, image, desc]) => `<article>${picture(image, `Textura de referencia ${name}`)}<div>${label('Biblioteca de materia')}<h2>${name}</h2><p>${desc}</p><a href="#/stone-design/brief" class="o8-text-link">Consultar este acabado →</a></div></article>`).join('')}</div></section>
      <section class="exp-process">${label('Identidad cromática')}<h2>Paleta de marca</h2><p>Los siguientes cuatro tonos corresponden a la identidad visual; no deben confundirse con piedras disponibles.</p><div class="exp-grid exp-grid-4 exp-brand-colors">${[
        ['Marine Ink', '#18343C'], ['Terracotta', '#AE7256'], ['Sand', '#CEB99B'], ['Limewash', '#F2EADC'],
      ].map(([name, color]) => `<div><span style="background:${color}"></span><strong>${name}</strong><small>${color}</small></div>`).join('')}</div></section>${contactRibbon()}`;
  }
  function group() {
    return `${hero({ image: 'option08-hero.webp', eyebrow: 'Grupo · Arquitectura · Diseño', title: 'Crear.<br>Habitar.<br>Preservar.', desc: 'Un ecosistema de marcas que dialogan con la piedra natural, el diseño y el bienestar.', cta: 'Conocer nuestras líneas', href: '/stone-design' })}
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
    if (step === 0) body = `<h2>¿Qué deseas crear?</h2><label for="brief-type">Tipo de proyecto</label><select id="brief-type" name="type"><option>Cocina o cubierta</option><option>Baño o lavamanos</option><option>Revestimientos</option><option>Objeto o mobiliario</option><option>Otro espacio</option></select><label for="brief-location">Ciudad o ubicación aproximada</label><input id="brief-location" name="location" placeholder="Ej. Barranquilla" maxlength="80" autocomplete="off"><p class="exp-hint">No ingreses direcciones ni datos personales en este prototipo.</p>`;
    else if (step === 1) body = `<h2>Cuéntanos de la materia.</h2><label for="brief-surface">Material de interés</label><select id="brief-surface" name="surface"><option>Piedra clara</option><option>Piedra veteada</option><option>Piedra oscura</option><option>Necesito asesoría</option></select><label for="brief-details">Idea y alcance</label><textarea id="brief-details" name="details" rows="5" maxlength="900" placeholder="Describe las medidas aproximadas, la pieza o el ambiente…"></textarea><p class="exp-hint">Evita incluir teléfonos, direcciones u otra información sensible.</p>`;
    else body = `<h2>Tu brief está listo.</h2><div class="exp-summary"><p><strong>Proyecto:</strong> ${safeText(wizard.brief.type || 'Por definir')}</p><p><strong>Ciudad:</strong> ${safeText(wizard.brief.location || 'Sin definir')}</p><p><strong>Materia:</strong> ${safeText(wizard.brief.surface || 'Sin definir')}</p><p><strong>Idea:</strong> ${safeText(wizard.brief.details || 'Sin descripción')}</p></div><p>Podrás copiar este resumen para compartirlo por un canal comercial verificado. En esta versión no se envía a ningún servidor.</p><button type="button" class="o8-button exp-action" data-copy="brief">Copiar brief <span aria-hidden="true">↗</span></button>`;
    return `${pageIntro('Stone Design / Brief', 'Empecemos por tu idea.', 'Un recorrido guiado que puedes completar sin entregar datos personales ni realizar pagos.')}
      <section class="exp-wizard"><div class="exp-wizard-panel">${wizardProgress(step)}<form id="brief-form" data-wizard="brief">${body}<div class="exp-wizard-nav">${step > 0 ? '<button type="button" class="exp-outline" data-prev="brief">Anterior</button>' : '<span></span>'}${step < 2 ? '<button class="o8-button" type="submit">Continuar →</button>' : button('/stone-design', 'Volver a Stone Design', 'exp-outline')}</div></form></div><aside>${picture('option08-hero.webp', 'Referencia conceptual de arquitectura en piedra')}<p>La materia inspira. Cada proyecto real requiere revisión técnica, disponibilidad y propuesta específica.</p></aside></section>`;
  }
  function diagnosis() {
    const step = wizard.diagnosisStep;
    let body;
    if (step === 0) body = `<h2>¿Qué superficie quieres cuidar?</h2><label for="diag-surface">Tipo de superficie</label><select id="diag-surface" name="surface"><option>Travertino</option><option>Mármol</option><option>Granito</option><option>Piedra sin identificar</option><option>Otra piedra natural</option></select><label for="diag-location">Dónde se encuentra</label><select id="diag-location" name="location"><option>Cocina</option><option>Baño</option><option>Piso</option><option>Mueble u objeto</option><option>Exterior</option></select>`;
    else if (step === 1) body = `<h2>¿Qué observas?</h2><label for="diag-symptom">Síntoma principal</label><select id="diag-symptom" name="symptom"><option>Mancha o cambio de color</option><option>Rayón o pérdida de brillo</option><option>Humedad o absorción</option><option>Rotura o fisura</option><option>Mantenimiento preventivo</option></select><label for="diag-urgency">Estado</label><select id="diag-urgency" name="urgency"><option>No parece avanzar</option><option>Está empeorando</option><option>Recién ocurrió</option></select>`;
    else body = `<h2>Orientación preliminar.</h2><div class="exp-summary"><p><strong>Superficie:</strong> ${safeText(wizard.diagnosis.surface || '')}</p><p><strong>Ubicación:</strong> ${safeText(wizard.diagnosis.location || '')}</p><p><strong>Síntoma:</strong> ${safeText(wizard.diagnosis.symptom || '')}</p><p><strong>Estado:</strong> ${safeText(wizard.diagnosis.urgency || '')}</p></div><p><strong>Primer cuidado:</strong> evita ácidos, abrasivos y productos sin comprobar su compatibilidad. Si hay fisuras, humedad activa o pérdida de material, no experimentes: solicita inspección profesional.</p><p>El resultado no diagnostica causas ni prescribe procedimientos específicos.</p><button type="button" class="o8-button exp-action" data-copy="diagnosis">Copiar orientación <span aria-hidden="true">↗</span></button>`;
    return `${pageIntro('Stone Care / Diagnóstico', 'Empecemos por observar.', 'Una guía de orientación, no un diagnóstico técnico definitivo.')}
      <section class="exp-wizard"><div class="exp-wizard-panel">${wizardProgress(step)}<form id="diagnosis-form" data-wizard="diagnosis">${body}<div class="exp-wizard-nav">${step > 0 ? '<button type="button" class="exp-outline" data-prev="diagnosis">Anterior</button>' : '<span></span>'}${step < 2 ? '<button class="o8-button" type="submit">Continuar →</button>' : button('/stone-care', 'Volver a Stone Care', 'exp-outline')}</div></form></div><aside>${picture('option08-care.webp', 'Cuidado manual conceptual de piedra natural')}<p>Si detectas daños estructurales o materiales sueltos, limita el uso de la superficie hasta contar con evaluación profesional.</p></aside></section>`;
  }
  function contact() {
    return `${pageIntro('Caliza Group / Contacto', 'Hablemos de tu proyecto.', 'Prepara una consulta para Stone Design, Living Design o Stone Care. Este prototipo no recoge ni envía información a Caliza.')}
      <section class="exp-contact-layout"><div>${picture('option08-living.webp', 'Pieza de piedra natural en ambiente conceptual')}<p>Materia · Espacios · Personas</p></div><form id="contact-form" class="exp-contact-form"><h2>Cuéntanos tu idea.</h2><label for="contact-line">Línea de interés</label><select id="contact-line" name="line"><option>Stone Design · Crear</option><option>Living Design · Habitar</option><option>Stone Care · Preservar</option><option>Consulta general</option></select><label for="contact-city">Ciudad</label><input id="contact-city" name="city" maxlength="70" placeholder="Ciudad (opcional)" autocomplete="off"><label for="contact-message">Mensaje</label><textarea id="contact-message" name="message" rows="5" maxlength="900" placeholder="¿Qué necesitas? Sin información sensible."></textarea><button type="submit" class="o8-button exp-action">Preparar mensaje <span aria-hidden="true">→</span></button><p class="exp-hint">El botón copia un resumen local para que lo compartas por el canal que Caliza confirme. No actúa como formulario de envío.</p></form></section>`;
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
  function social() {
    const normalized = links.map((l) => parseSocialUrl(l.url)).filter(Boolean);
    return `${pageIntro('CALIZA / Redes y movimiento', 'Inspiración viva.', 'Explora publicaciones públicas de Instagram y TikTok en un visor activado por ti. No se consulta ni se copia contenido de redes automáticamente.')}
      <section class="exp-page-pad"><div class="exp-social-intro"><div>${label('Social Studio')}<h2>La materia también se comparte.</h2><p>Introduce el enlace de una publicación pública o un video. En esta vista de revisión los enlaces se guardan únicamente en tu navegador.</p></div><div class="exp-social-example">${picture('option08-care.webp', 'Cuidado de superficies: contenido editorial de referencia')}</div></div>
      <form id="social-form" class="exp-social-form"><label for="social-url">Enlace público de Instagram o TikTok</label><div><input type="url" id="social-url" name="url" placeholder="https://www.instagram.com/reel/… o https://www.tiktok.com/@cuenta/video/…" required><button type="submit" class="o8-button">Añadir al visor →</button></div><p>Los contenidos de terceros solo se cargan al pulsar «Visualizar»; pueden requerir consentimiento de cookies o inicio de sesión en la red social.</p></form>
      <div class="exp-toolbar"><p><strong>${normalized.length}</strong> publicaciones guardadas en este dispositivo</p><button type="button" class="exp-outline" data-clear-social>Limpiar visor</button></div>
      ${normalized.length ? `<div class="exp-social-grid">${normalized.map((l, index) => `<article class="exp-social-card"><div><span>${l.platform === 'instagram' ? 'Instagram' : 'TikTok'}</span><strong>Publicación ${index + 1}</strong><p>Enlace público · ${safeText(l.id)}</p></div>${activeEmbed === l.url ? `<div class="exp-iframe-wrap"><iframe title="Publicación ${index + 1} de ${l.platform}" src="${l.embed}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture" sandbox="allow-scripts allow-same-origin allow-popups"></iframe></div>` : `<div class="exp-embed-placeholder">${lineIcon('stone')}<p>Contenido externo sin cargar.</p></div>`}<div class="exp-social-actions"><button type="button" data-view-social="${index}">${activeEmbed === l.url ? 'Ocultar' : 'Visualizar'}</button><a href="${l.url}" target="_blank" rel="noopener noreferrer">Abrir en la red ↗</a><button type="button" data-remove-social="${index}">Quitar</button></div></article>`).join('')}</div>` : `<div class="exp-empty exp-social-empty"><h2>Aún no hay publicaciones.</h2><p>Pega un enlace válido de una publicación de Instagram o video de TikTok para probar el visor.</p></div>`}
      <div class="exp-social-disclaimer"><strong>Para conectar el perfil oficial de Caliza:</strong> se requiere confirmar los usuarios autorizados, derechos de uso y la modalidad de integración permitida por cada plataforma. Esta herramienta demuestra el visualizador, no suplanta una integración a cuentas.</div></section>`;
  }

  function missing() {
    return `${pageIntro('Caliza Group / 404', 'Esta ruta no existe.', 'La página solicitada no forma parte de la experiencia de revisión.')}
      <section class="exp-cta-centered">${button('/', 'Volver al inicio')}</section>`;
  }
  function currentPage(route) {
    if (route === '/') return home();
    if (route === '/stone-design') return stone();
    if (route === '/stone-design/proyectos' || route === '/proyectos') return projects();
    if (route === '/stone-design/brief') return brief();
    if (route === '/living-design') return living();
    if (route === '/living-design/coleccion') return collection();
    if (route.startsWith('/living-design/pieza/')) return product(route.split('/').pop());
    if (route === '/living-design/experiencia') return experience();
    if (route === '/living-design/carrito') return cartPage();
    if (route === '/stone-care') return care();
    if (route === '/stone-care/diagnostico') return diagnosis();
    if (route === '/materiales') return materialsPage();
    if (route === '/grupo') return group();
    if (route === '/contacto') return contact();
    if (route === '/inspiracion') return social();
    return missing();
  }
  function render(scroll = true) {
    const route = getRoute();
    main.innerHTML = currentPage(route);
    document.title = `${main.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim() || 'CALIZA GROUP'} · CALIZA GROUP`;
    document.querySelectorAll('.o8-nav a').forEach((link) => link.setAttribute('aria-current', route === link.getAttribute('href')?.substring(1) ? 'page' : 'false'));
    tally();
    if (scroll) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      main.focus({ preventScroll: true });
    }
  }

  function copyText(text) {
    if (!navigator.clipboard?.writeText) return announce('La copia no está disponible aquí. Abre esta página por HTTPS.');
    navigator.clipboard.writeText(text).then(() => announce('Resumen copiado. No se envió ningún dato.'), () => announce('No se pudo copiar: revisa los permisos del navegador.'));
  }
  function copyContent(kind) {
    if (kind === 'cart') {
      const lines = cart.map((entry) => `${catalogue.find((x) => x.slug === entry.slug)?.name || entry.slug} — cantidad ${entry.qty}, material ${entry.material}, medida ${entry.size}`);
      return `CALIZA LIVING DESIGN — selección para cotización\n${lines.join('\n')}\nSin precio ni pedido confirmado.`;
    }
    if (kind === 'brief') return `CALIZA STONE DESIGN — brief\nProyecto: ${wizard.brief.type}\nCiudad: ${wizard.brief.location}\nMaterial: ${wizard.brief.surface}\nIdea: ${wizard.brief.details}`;
    return `CALIZA STONE CARE — orientación preliminar\nSuperficie: ${wizard.diagnosis.surface}\nLugar: ${wizard.diagnosis.location}\nSíntoma: ${wizard.diagnosis.symptom}\nEstado: ${wizard.diagnosis.urgency}\nEvitar ácidos y abrasivos. Solicitar evaluación especializada antes de intervenir.`;
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('button');
    if (!target) return;
    if (target.dataset.filter) {
      const cat = target.dataset.filter;
      location.hash = `/living-design/coleccion${cat === 'Todas' ? '' : `?categoria=${encodeURIComponent(cat)}`}`;
      render(false);
    }
    if (target.dataset.addQuote) {
      const slug = target.dataset.addQuote;
      if (!catalogue.some((p) => p.slug === slug)) return;
      const qty = Math.min(20, Math.max(1, Number.parseInt(document.getElementById('quantity-selection')?.value || '1', 10) || 1));
      const material = document.getElementById('material-selection')?.value || 'Por definir';
      const size = document.getElementById('size-selection')?.value || 'A definir';
      const existing = cart.find((x) => x.slug === slug && x.material === material && x.size === size);
      if (existing) existing.qty = Math.min(99, existing.qty + qty);
      else cart.push({ slug, qty, material, size });
      store(CART_KEY, cart); tally(); announce('Pieza añadida a la selección de cotización.');
    }
    const cartKey = target.dataset.cartPlus ?? target.dataset.cartMinus ?? target.dataset.cartRemove;
    if (cartKey !== undefined) {
      const item = cart[Number(cartKey)];
      if (!item) return;
      if (target.hasAttribute('data-cart-plus')) item.qty = Math.min(99, item.qty + 1);
      if (target.hasAttribute('data-cart-minus')) item.qty = Math.max(0, item.qty - 1);
      if (target.hasAttribute('data-cart-remove')) item.qty = 0;
      cart = cart.filter((x) => x.qty > 0);
      store(CART_KEY, cart); render(false);
    }
    if (target.dataset.copy) copyText(copyContent(target.dataset.copy));
    if (target.dataset.prev) {
      wizard[target.dataset.prev === 'brief' ? 'briefStep' : 'diagnosisStep'] -= 1;
      render(false);
    }
    if (target.hasAttribute('data-clear-social')) {
      links = []; activeEmbed = null; store(SOCIAL_KEY, links); render(false);
    }
    if (target.dataset.viewSocial !== undefined) {
      const item = parseSocialUrl(links[Number(target.dataset.viewSocial)]?.url || '');
      if (item) { activeEmbed = activeEmbed === item.url ? null : item.url; render(false); }
    }
    if (target.dataset.removeSocial !== undefined) {
      links.splice(Number(target.dataset.removeSocial), 1); activeEmbed = null; store(SOCIAL_KEY, links); render(false);
    }
  });
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    event.preventDefault();
    if (form.id === 'social-form') {
      const item = parseSocialUrl(new FormData(form).get('url'));
      if (!item) return announce('Usa un enlace HTTPS a un post o reel de Instagram o un video público de TikTok.');
      if (links.some((l) => parseSocialUrl(l.url)?.url === item.url)) return announce('Ese enlace ya está en el visor.');
      if (links.length >= 8) return announce('El visor de revisión admite máximo 8 enlaces. Elimina uno para continuar.');
      links.push({ url: item.url, platform: item.platform });
      store(SOCIAL_KEY, links); render(false); announce('Publicación añadida. Pulsa Visualizar para cargarla.');
    }
    if (form.id === 'contact-form') {
      const data = new FormData(form);
      const message = String(data.get('message') || '').trim();
      if (!message) return announce('Describe tu idea antes de preparar el mensaje.');
      copyText(`CALIZA GROUP — consulta\nLínea: ${data.get('line')}\nCiudad: ${data.get('city') || 'Por definir'}\nMensaje: ${message}\nConsulta preparada localmente; sin envío automático.`);
    }
    if (form.dataset.wizard) {
      const kind = form.dataset.wizard;
      const data = Object.fromEntries(new FormData(form));
      if (kind === 'brief') { Object.assign(wizard.brief, data); wizard.briefStep = Math.min(2, wizard.briefStep + 1); }
      else { Object.assign(wizard.diagnosis, data); wizard.diagnosisStep = Math.min(2, wizard.diagnosisStep + 1); }
      render(false);
    }
  });
  const menu = document.getElementById('mobile-nav');
  const menuToggle = document.getElementById('menu-toggle');
  menuToggle.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
    menuToggle.setAttribute('aria-expanded', String(!menu.hidden));
    menuToggle.setAttribute('aria-label', menu.hidden ? 'Abrir menú' : 'Cerrar menú');
  });
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) { menu.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); }
  });
  window.addEventListener('hashchange', () => { activeEmbed = null; render(); });
  render(false);
})();
