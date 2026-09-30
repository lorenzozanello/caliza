/**
 * Carga contenido de ejemplo para desarrollo y pruebas: `npm run seed`.
 * Todo lo que crea queda marcado como ejemplo o fotografía provisional; no son datos reales de Caliza.
 * Borra productos, proyectos, materiales, pedidos, prospectos y medios existentes.
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '@payload-config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const IMG = path.resolve(dirname, '../../../prototype/assets/img')

const payload = await getPayload({ config })
const log = (m: string) => payload.logger.info(`[seed] ${m}`)

for (const collection of ['orders', 'leads', 'products', 'projects', 'materials', 'legal'] as const) {
  const res = await payload.delete({ collection, where: { id: { exists: true } }, overrideAccess: true })
  if (res.errors.length) throw new Error(`No se pudo limpiar ${collection}: ${res.errors.map((e) => e.message).join('; ')}`)
}

const media: Record<string, number> = {}
const photos: [string, string, boolean?][] = [
  ['hero', 'Sala con mesa de piedra natural bajo luz lateral'],
  ['proyecto', 'Cocina abierta con isla en piedra natural, gabinetes en madera y ventanales al jardín'],
  ['p1', 'Mesa con cubierta de piedra y base en roble', true],
  ['p3', 'Consola en roble con estructura de metal', true],
  ['lavamanos', 'Lavamanos tallado en piedra'],
  ['comedor', 'Mesa de comedor en piedra para ocho personas'],
  ['piedra_macro', 'Detalle de la veta de una piedra oscura'],
  ['detalle_borde', 'Detalle del borde pulido de una cubierta de piedra'],
  ['m_piedra', 'Piedra natural gris veteada'],
  ['m_madera', 'Madera de roble'],
  ['m_metal', 'Metal negro cepillado'],
  ['m_textura', 'Piedra con acabado texturizado'],
]
for (const [name, alt, studio] of photos) {
  // Las fotos se reutilizan por nombre de archivo: así sus URLs no cambian entre cargas y las páginas ya generadas siguen apuntando a archivos que existen.
  const data = { alt, provisional: true, studio: Boolean(studio) }
  const found = await payload.find({ collection: 'media', where: { filename: { equals: `${name}.jpg` } }, limit: 1, depth: 0 })
  const doc = found.docs[0]
    ? await payload.update({ collection: 'media', id: found.docs[0].id, data, overrideAccess: true })
    : await payload.create({ collection: 'media', data, filePath: path.join(IMG, `${name}.jpg`), overrideAccess: true })
  media[name] = doc.id as number
}
log(`${photos.length} fotos provisionales`)

const email = process.env.SEED_ADMIN_EMAIL || 'admin@caliza.co'
const password = process.env.SEED_ADMIN_PASSWORD || 'caliza-dev-2026'
const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
if (!existing.docs.length) await payload.create({ collection: 'users', data: { email, password, name: 'Equipo Caliza' } })
log(`usuario administrador ${email}`)

await payload.updateGlobal({
  slug: 'settings',
  data: {
    whatsappNumber: '570000000000',
    shippingCities: [
      { city: 'Barranquilla', cost: 0 },
      { city: 'Bogotá', cost: 450000 },
      { city: 'Medellín', cost: 450000 },
      { city: 'Cartagena', cost: 250000 },
      { city: 'Cali', cost: 500000 },
    ],
    defaultShippingCost: 0,
  },
})

await payload.updateGlobal({
  slug: 'home',
  data: {
    heroImage: media.hero,
    stoneImage: media.proyecto,
    designImage: media.p1,
    careImage: media.detalle_borde,
    careSectionImage: media.detalle_borde,
  },
})

const materials = [
  { name: 'Piedra', family: 'piedra', description: 'Mármol, travertino, cuarcita y más, seleccionados placa por placa.', image: media.m_piedra,
    recommendedUses: 'Cocinas, baños, pisos, muros, fachadas y piezas de mobiliario.',
    cautions: 'Los mármoles y travertinos son sensibles a ácidos como el limón o el vinagre: en cocinas conviene sellarlos o elegir cuarcita.' },
  { name: 'Madera', family: 'madera', description: 'Calidez y estructura en bases, muebles y gabinetes.', image: media.m_madera,
    recommendedUses: 'Bases de mesas, gabinetes y detalles interiores.', cautions: 'Exposición directa al sol o a la humedad constante.' },
  { name: 'Metal', family: 'metal', description: 'Precisión en estructuras, herrajes y detalles.', image: media.m_metal,
    recommendedUses: 'Estructuras, bases delgadas, herrajes y griferías.', cautions: 'Ambientes salinos sin el tratamiento adecuado.' },
  { name: 'Texturas', family: 'textura', description: 'Acabados apomazados, flameados y cepillados que se sienten con la mano.', image: media.m_textura,
    recommendedUses: 'Pisos exteriores, bordes de piscina y superficies que se tocan.', cautions: 'Zonas donde se necesita limpiar grasa con frecuencia: el poro abierto la retiene.' },
] as const
for (const [i, m] of materials.entries()) await payload.create({ collection: 'materials', data: { ...m, order: i } })

const project = await payload.create({
  collection: 'projects',
  data: {
    title: 'Casa Bosque', line: 'stone', city: 'Barranquilla', space: 'Cocina y comedor', materialsText: 'Piedra natural · roble · latón',
    challenge: 'Una cocina abierta al jardín que necesitaba una isla resistente al uso diario y en diálogo con la madera existente.',
    solution: 'Elegimos una placa de veta suave, casamos las vetas en la isla y la combinamos con gabinetes en roble y detalles en latón.',
    cover: media.proyecto, gallery: [{ image: media.detalle_borde }, { image: media.m_piedra }], featured: true, isExample: true,
  },
})

await payload.create({
  collection: 'projects',
  data: {
    title: 'Baño Travertino', line: 'stone', city: 'Cartagena', space: 'Baño principal', materialsText: 'Piedra natural · latón',
    challenge: 'Un baño pequeño que debía sentirse como una sola pieza de piedra, sin juntas que interrumpieran la lectura.',
    solution: 'Tallamos el lavamanos del mismo bloque que el muro y alineamos las vetas de piso a techo.',
    cover: media.lavamanos, gallery: [{ image: media.m_textura }, { image: media.piedra_macro }], isExample: true,
  },
})
await payload.create({
  collection: 'projects',
  data: {
    title: 'Comedor Sobremesa', line: 'design', city: 'Medellín', space: 'Comedor', materialsText: 'Piedra natural · roble',
    challenge: 'Una mesa para diez personas que no dominara un comedor de proporciones medianas.',
    solution: 'Una cubierta delgada de borde suave sobre dos bases en roble retiradas del perímetro.',
    cover: media.comedor, gallery: [{ image: media.p1 }, { image: media.detalle_borde }, { image: media.m_madera }], isExample: true,
  },
})

const stones = [
  { label: 'Gris veteado', swatch: media.m_piedra, priceDelta: 0, available: true },
  { label: 'Oscuro profundo', swatch: media.piedra_macro, priceDelta: 600000, available: true },
  { label: 'Arena texturizada', swatch: media.m_textura, priceDelta: 1200000, available: true },
]
const common = { status: 'publicado' as const, isExample: true, depositPercent: 50, leadTime: '6 a 8 semanas' }
const products = [
  {
    ...common, name: 'Mesa Estrato', line: 'design', category: 'mesa-comedor', saleMode: 'configurable', priceDisplay: 'desde', featured: true, order: 1, signed: true, requiresInstallation: true,
    shortDescription: 'Cubierta de piedra natural sobre base de roble macizo. Se fabrica a tu medida después de tu elección.',
    materialsText: 'Piedra natural · roble · 6 a 10 personas',
    images: [{ image: media.p1 }, { image: media.comedor }, { image: media.detalle_borde }],
    stoneOptions: stones,
    sizeOptions: [
      { label: '6 personas', dimensions: '180 × 90 × 75 cm', price: 7400000 },
      { label: '8 personas', dimensions: '220 × 100 × 75 cm', price: 8900000 },
      { label: '10 personas', dimensions: '260 × 110 × 75 cm', price: 10600000 },
    ],
    baseOptions: [{ label: 'Roble macizo', priceDelta: 0 }, { label: 'Metal negro', priceDelta: 350000 }],
    details: 'Cubierta de 2 cm con borde pulido. Peso aproximado de la cubierta: 90 a 140 kg según tamaño.',
    care: 'Limpia con paño húmedo y jabón neutro. Evita ácidos como limón o vinagre. Sellado recomendado cada año con Caliza Care.',
    relatedProjects: [project.id],
  },
  {
    ...common, name: 'Lavamanos Fuente', line: 'design', category: 'lavamanos', saleMode: 'configurable', priceDisplay: 'desde', order: 2, requiresInstallation: true,
    shortDescription: 'Lavamanos tallado en un solo bloque de piedra, con grifería en latón.',
    materialsText: 'Piedra natural · latón', basePrice: 3200000,
    images: [{ image: media.lavamanos }], stoneOptions: stones.slice(0, 2),
    baseOptions: [{ label: 'Sin grifería', priceDelta: 0 }, { label: 'Con grifería en latón', priceDelta: 780000 }],
    care: 'Seca después de usar para evitar marcas de agua dura.',
  },
  {
    ...common, name: 'Consola Umbral', line: 'design', category: 'consola', saleMode: 'inmediata', priceDisplay: 'fijo', basePrice: 4600000, stock: 2, order: 3, leadTime: 'Despacho en 5 días hábiles',
    shortDescription: 'Consola en roble con estructura de metal y cubierta en piedra. Lista para despacho.',
    materialsText: 'Roble · metal · cubierta en piedra', images: [{ image: media.p3 }],
    details: '140 × 38 × 80 cm.',
  },
  {
    ...common, name: 'Mesa Sobremesa', line: 'design', category: 'mesa-comedor', saleMode: 'pedido', priceDisplay: 'desde', order: 4, requiresInstallation: true,
    shortDescription: 'Mesa de comedor en piedra de líneas simples, para reunir a ocho o diez personas.',
    materialsText: 'Piedra natural · 8 a 10 personas', images: [{ image: media.comedor }],
    sizeOptions: [{ label: '8 personas', dimensions: '230 × 105 × 75 cm', price: 9800000 }, { label: '10 personas', dimensions: '270 × 110 × 75 cm', price: 11900000 }],
  },
  {
    ...common, name: 'Mantenimiento de superficies', line: 'care', category: 'cuidado', saleMode: 'cotizacion', priceDisplay: 'cotizar', order: 5,
    shortDescription: 'Limpieza profunda, pulido y sellado de superficies en piedra natural.',
    materialsText: 'Piedra natural', images: [{ image: media.detalle_borde }],
  },
]
for (const p of products) await payload.create({ collection: 'products', data: p as never })
log(`${products.length} productos de ejemplo y ${materials.length} materiales`)
await payload.updateGlobal({
  slug: 'pages',
  data: {
    stone: {
      heroImage: media.proyecto,
      spaces: [
        { title: 'Cocinas', text: 'Mesones, islas y salpicaderos con las vetas casadas.', image: media.proyecto },
        { title: 'Baños', text: 'Lavamanos, muros y duchas en una sola lectura de piedra.', image: media.lavamanos },
        { title: 'Pisos y escaleras', text: 'Superficies continuas, con el acabado que pide el uso.', image: media.m_piedra },
        { title: 'Muros y chimeneas', text: 'La piedra como protagonista del espacio.', image: media.piedra_macro },
        { title: 'Piscinas y exteriores', text: 'Acabados antideslizantes que resisten sol y agua.', image: media.m_textura },
        { title: 'Fachadas', text: 'Revestimientos que envejecen con dignidad.', image: media.hero },
      ],
    },
    care: { heroImage: media.detalle_borde },
    studio: { heroImage: media.piedra_macro },
  },
})

// Texto enriquecido de Lexical a partir de bloques simples.
const text = (t: string) => ({ type: 'text', text: t, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })
const block = ([kind, t]: [string, string]) =>
  kind === 'h'
    ? { type: 'heading', tag: 'h2', format: '', indent: 0, version: 1, direction: 'ltr', children: [text(t)] }
    : { type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, children: [text(t)] }
const rich = (blocks: [string, string][]) => ({ root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: blocks.map(block) } }) as never

const legal: { title: string; slug: string; body: [string, string][] }[] = [
  { title: 'Términos y condiciones', slug: 'terminos', body: [
    ['p', 'Estos términos regulan las compras hechas en este sitio. Son un borrador y deben ser revisados por un abogado antes de publicarse como definitivos.'],
    ['h', 'Piezas por encargo'],
    ['p', 'Las piezas bajo pedido y configurables se fabrican después de tu elección. Cada placa de piedra natural es única: la veta, el tono y las marcas naturales pueden variar respecto a las fotografías.'],
    ['h', 'Precios y pagos'],
    ['p', 'Los precios están en pesos colombianos e incluyen los impuestos aplicables. Puedes pagar el total o un anticipo para iniciar la fabricación y el saldo antes del despacho.'],
    ['h', 'Plazos'],
    ['p', 'Los plazos de fabricación son estimados y se confirman al elegir la placa. Te informamos cualquier cambio por WhatsApp.'],
  ] },
  { title: 'Tratamiento de datos personales', slug: 'datos-personales', body: [
    ['p', 'Borrador de política de tratamiento de datos conforme a la Ley 1581 de 2012. Debe ser revisado por un abogado antes de publicarse como definitivo.'],
    ['h', 'Qué datos recogemos'],
    ['p', 'Nombre, número de WhatsApp, correo, ciudad y dirección de entrega, y el origen de tu visita, solo para atender tu solicitud o tu pedido.'],
    ['h', 'Tus derechos'],
    ['p', 'Puedes conocer, actualizar, rectificar y pedir la supresión de tus datos escribiéndonos por WhatsApp.'],
  ] },
  { title: 'Envíos, cambios y garantía', slug: 'envios-y-garantia', body: [
    ['p', 'Borrador pendiente de revisión legal.'],
    ['h', 'Envíos e instalación'],
    ['p', 'Antes de despachar confirmamos piso, ascensor y accesos. El costo de envío e instalación depende de la ciudad y se muestra antes de pagar.'],
    ['h', 'Cambios'],
    ['p', 'Las piezas hechas a la medida no admiten cambio por gusto, porque se fabrican para tu espacio. Las piezas de entrega inmediata se revisan caso por caso.'],
  ] },
]
for (const l of legal) await payload.create({ collection: 'legal', data: { title: l.title, slug: l.slug, draft: true, body: rich(l.body) } })
log(`3 proyectos de ejemplo, páginas y ${legal.length} textos legales en borrador`)
process.exit(0)
