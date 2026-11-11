/* Deterministic, dependency-free route and interaction checks for the public preview. */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const root = path.resolve(__dirname, '..')
const code = fs.readFileSync(path.join(root, 'assets/js/experience.js'), 'utf8')
const events = {}
const storage = new Map()
const heading = () => {
  const match = main.innerHTML.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)
  return match?.[1]?.replace(/<[^>]+>/g, ' ').trim() || ''
}
const main = { innerHTML: '', querySelector: () => ({ textContent: heading() }), focus() {} }
const feedback = { textContent: '', hidden: true }
const floatingLink = { href: '', attrs: {}, setAttribute(name, value) { this.attrs[name] = value } }
const floatingLabel = { textContent: '' }
const floatingNote = { textContent: '' }
let copiedContactHandler
const contactResult = { hidden: true, innerHTML: '', focus() {}, querySelector() { return { addEventListener(_type, handler) { copiedContactHandler = handler } } } }
const document = {
  getElementById(id) { return ({ main, feedback, 'floating-whatsapp': floatingLink, 'floating-wa-label': floatingLabel, 'floating-wa-note': floatingNote, 'contact-result': contactResult, 'menu-toggle': menuToggle, 'mobile-nav': menu })[id] },
  querySelector(selector) { return ({ 'meta[name="caliza-whatsapp"]': { content: '573025983218' }, 'meta[name="caliza-instagram"]': { content: 'https://www.instagram.com/calizastonedesign/' }, 'meta[name="caliza-tiktok"]': { content: 'https://www.tiktok.com/@calizastone' } })[selector] || null },
  querySelectorAll() { return [] },
  addEventListener(type, callback) { events[type] = callback },
  title: '',
}
const menuToggle = { attrs: {}, addEventListener(type, cb) { events.toggle = cb }, setAttribute(k, v) { this.attrs[k] = v } }
const menu = { hidden: true, addEventListener(type, cb) { events.menu = cb } }
const location = { hash: '#/' }
const localStorage = { getItem: (key) => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) }
const window = { addEventListener(type, cb) { events[type] = cb }, scrollTo() {} }
class FakeForm {}
class FakeFormData {
  constructor(form) { this.values = Object.entries(form.values || {}) }
  get(key) { return this.values.find((x) => x[0] === key)?.[1] || null }
  *[Symbol.iterator]() { yield* this.values }
}
const copied = []
const navigator = { clipboard: { writeText(text) { copied.push(text); return Promise.resolve() } } }
const context = vm.createContext({ document, window, location, localStorage, navigator, URL, URLSearchParams, FormData: FakeFormData, HTMLFormElement: FakeForm, setTimeout: () => 1, clearTimeout: () => {}, console })
vm.runInContext(fs.readFileSync(path.join(root, 'assets/data/catalogo.js'), 'utf8'), context)
vm.runInContext(code, context)

function visit(route) {
  location.hash = '#' + route
  events.hashchange()
  assert(heading(), `No H1 in ${route}`)
  assert(!heading().includes('Esta ruta no existe'), `Route not found: ${route}`)
  for (const [, src] of main.innerHTML.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
    assert(fs.existsSync(path.join(root, src)), `Missing asset ${src} in ${route}`)
  }
  return main.innerHTML
}
const routes = [
  '/', '/stone-design', '/stone-design/proyectos', '/stone-design/brief', '/living-design',
  '/living-design/coleccion', '/living-design/coleccion?categoria=Sillas', '/tienda',
  '/living-design/experiencia', '/living-design/carrito', '/living-design/pieza/mesa-rubi',
  '/stone-care', '/stone-care/diagnostico', '/materiales', '/grupo', '/proyectos', '/contacto', '/inspiracion',
]
const linkedRoutes = new Set()
for (const route of routes) {
  const page = visit(route)
  for (const [, href] of page.matchAll(/\bhref="#(\/[^"#]*)"/g)) linkedRoutes.add(href.split('?')[0])
}
for (const route of linkedRoutes) visit(route)
assert.match(visit('/'), /La materia/)
assert.match(visit('/'), /caliza-family-grid-featured/)
assert.doesNotMatch(visit('/'), /¿Qué te gustaría hacer?/)
assert.equal(document.title, 'La materia toma forma. · CALIZA GROUP')
assert.match(visit('/'), /caliza-journeys/)
assert.doesNotMatch(visit('/'), /caliza-social-showcase/)
assert.match(visit('/'), /@calizastonedesign/)
assert.match(floatingLink.href, /^https:\/\/wa\.me\/573025983218\?text=/)
assert.match(floatingLink.attrs['aria-label'], /WhatsApp oficial/)
visit('/tienda')
assert.match(decodeURIComponent(floatingLink.href), /CALIZA LIVING DESIGN/)
assert.match(visit('/materiales'), /Piedra clara/)
assert.doesNotMatch(visit('/materiales'), /Paleta de marca/)
assert.doesNotMatch(visit('/materiales'), /Marine Ink.*Piedra clara/s)
assert.match(visit('/inspiracion'), /Instagram y TikTok/)
assert.equal((visit('/living-design/coleccion').match(/caliza-family-card/g) || []).length, 5)
assert.match(visit('/tienda'), /Familias bajo consulta/)
assert.match(visit('/tienda?q=Mesas'), /Mesas de comedor/)
assert.equal((visit('/tienda?q=Mesas').match(/caliza-family-card/g) || []).length, 2)
assert.match(visit('/tienda?q=sin-resultado'), /No encontramos familias/)
assert.doesNotMatch(visit('/tienda'), /Mesa Rubi|Silla Aria|data-add-quote/)
assert.match(visit('/living-design/carrito'), /Fotografía por confirmar/)
assert.match(visit('/living-design/pieza/mesa-rubi'), /Familias bajo consulta/)
assert.match(visit('/tienda?categoria=Sillas'), /editorial-sillas-hogar\.webp/)
assert.match(visit('/tienda?categoria=Sillas'), /editorial-sillas-comerciales\.webp/)
assert.doesNotMatch(visit('/tienda?categoria=Sillas'), /option08-living\.webp/)
assert.equal((visit('/tienda').match(/data-pendiente=/g) || []).length, 5)
assert.equal((visit('/tienda').match(/Consultar esta familia/g) || []).length, 5)

function click(data) {
  events.click({ target: { closest(selector) { return selector === 'button' ? { dataset: data, hasAttribute(name) { return ({ 'data-cart-plus': 'cartPlus', 'data-cart-minus': 'cartMinus', 'data-cart-remove': 'cartRemove', 'data-clear-social': 'clearSocial' })[name] in data } } : null } } })
}
function submit(id, values, wizard) {
  const form = new FakeForm()
  form.id = id; form.values = values; form.dataset = wizard ? { wizard } : {}
  events.submit({ target: form, preventDefault() {} })
}
visit('/stone-design/brief')
submit('brief-form', { type: 'Baño o lavamanos', location: 'Barranquilla' }, 'brief')
submit('brief-form', { surface: 'Piedra clara', details: 'Una cubierta de 120 cm.' }, 'brief')
assert.match(main.innerHTML, /Tu brief está listo/)
click({ copy: 'brief' })
assert.match(copied.at(-1), /Una cubierta de 120 cm/)

visit('/stone-care/diagnostico')
submit('diagnosis-form', { surface: 'Travertino', location: 'Cocina' }, 'diagnosis')
submit('diagnosis-form', { symptom: 'Mancha o cambio de color', urgency: 'Recién ocurrió' }, 'diagnosis')
assert.match(main.innerHTML, /evita ácidos/i)

visit('/contacto')
submit('contact-form', { line: 'Stone Design · Crear', city: 'Cartagena', message: '<consulta de piedra>' })
assert.equal(contactResult.hidden, false)
assert.match(contactResult.innerHTML, /&lt;consulta de piedra&gt;/)
assert.doesNotMatch(contactResult.innerHTML, /<consulta de piedra>/)
assert.match(contactResult.innerHTML, /https:\/\/wa\.me\/573025983218\?text=/)
copiedContactHandler()
assert.match(copied.at(-1), /Cartagena/)

visit('/inspiracion')
assert.match(main.innerHTML, /@calizastonedesign/)
assert.match(main.innerHTML, /@calizastone/)
assert.match(main.innerHTML, /Próximamente, selección editorial/)
assert.doesNotMatch(main.innerHTML, /id="social-form"|data-clear-social/)

events.toggle()
assert.equal(menu.hidden, false)
events.menu({ target: { closest(selector) { return selector === 'a' ? {} : null } } })
assert.equal(menu.hidden, true)
assert.equal(menuToggle.attrs['aria-label'], 'Abrir menú')

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
for (const [, file] of html.matchAll(/(?:href|src)="(assets\/[^"#]+)"/g)) assert(fs.existsSync(path.join(root, file)), `Missing index asset ${file}`)
assert.match(html, /id="floating-whatsapp"/)
assert.match(html, /id="qa-banner"/)
assert.match(html, /data-dismiss-qa/)
assert.match(html, /rel="preload".*PlayfairDisplay/)
assert.match(html, /property="og:title"/)
assert.doesNotMatch(fs.readFileSync(path.join(root, 'assets/js/experience.js'), 'utf8'), /Tu próximo paso|¿Qué te gustaría hacer\?/)
assert.doesNotMatch(html, /Mi selección|id="cart-count"|caliza-selection-float|href="#\/living-design\/carrito"/)
assert.match(fs.readFileSync(path.join(root, 'checkout.html'), 'utf8'), /index\.html#\/living-design\/coleccion/)
assert.doesNotMatch(code, /data-add-quote|function cartPage|function product\(/)
assert.match(html, /meta name="caliza-whatsapp" content="573025983218"/)
assert.match(fs.readFileSync(path.join(root, 'assets/js/featured-social.js'), 'utf8'), /CALIZA_FEATURED_SOCIAL/)
assert.doesNotMatch(code, /8\.900\.000|4\.450\.000|data-pay|570000000000/)
console.log(`PASS: ${routes.length} routes incl. legacy aliases, five verified family placeholders, no fake cart/SKUs, official WhatsApp and profiles, safe contact form and wizards.`)

const tokenizedSheets = ['option08.css', 'experience.css', 'marketing.css']
for (const sheet of tokenizedSheets) {
  const css = fs.readFileSync(path.join(root, 'assets/css', sheet), 'utf8')
  assert.doesNotMatch(css, /#[0-9a-fA-F]{3,8}\b/, sheet + ' has color literals outside authority tokens')
  assert.doesNotMatch(css, /letter-spacing:\s*-\.\d+em/, sheet + ' has negative headline tracking')
  assert.doesNotMatch(css, /font-size:\s*(?:7|8|9|10)px/, sheet + ' has undersized text')
}
