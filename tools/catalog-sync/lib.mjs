import { approved, publicAssetUrl, REQUIRED_COLUMNS, SALES, TABS, validSlug, yes } from './contract.mjs'

function str(value) { return String(value ?? '').trim() }
function num(value) { const n = Number(value); return str(value) !== '' && Number.isFinite(n) ? n : null }
function fail(code, id, message) { return { code, id, message } }
function byId(rows, key) { return new Map(rows.filter(r => str(r[key])).map(r => [str(r[key]), r])) }

export function parseSnapshot(input) {
  if (!input || typeof input !== 'object' || !input.tabs) throw Error('Se requiere un objeto { tabs: { nombre: [cabecera, ...filas] } }.')
  const tables = {}
  const errors = []
  for (const tab of TABS) {
    const raw = input.tabs[tab]
    if (!Array.isArray(raw) || !Array.isArray(raw[0])) {
      errors.push(fail('TAB_MISSING', tab, `Falta la pestaña ${tab}`))
      tables[tab] = []
      continue
    }
    const head = raw[0].map(str)
    const missing = REQUIRED_COLUMNS[tab].filter(c => !head.includes(c))
    if (missing.length) errors.push(fail('COLUMN_MISSING', tab, `Columnas: ${missing.join(', ')}`))
    tables[tab] = raw.slice(1).filter(r => Array.isArray(r) && r.some(v => str(v))).map(r => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])))
  }
  return { tables, errors }
}

function approvedControl(controlRows, entity, id, errors) {
  const row = controlRows.find(r => str(r.entidad).toUpperCase() === entity && str(r.registro_id) === id)
  if (!row) { errors.push(fail('CONTROL_MISSING', id, `Falta 10_CONTROL para ${entity}`)); return false }
  for (const field of ['aprobado_datos', 'aprobado_fotos', 'aprobado_precio', 'aprobado_legal', 'listo_publicar']) {
    if (!yes(row[field])) { errors.push(fail('CONTROL_PENDING', id, `10_CONTROL.${field} no está aprobado`)); return false }
  }
  return true
}

function unique(rows, field, errors, tab) {
  const seen = new Set()
  for (const row of rows) {
    const id = str(row[field]); if (!id) continue
    if (seen.has(id)) errors.push(fail('DUPLICATE_ID', id, `${tab}.${field} duplicado`))
    seen.add(id)
  }
}

export function buildRelease(snapshot, options = {}) {
  const { tables, errors } = parseSnapshot(snapshot)
  if (errors.length) return { ok: false, release: null, report: { errors, ready: 0 } }

  const products = tables['01_PRODUCTOS']
  const variants = tables['02_VARIANTES']
  const materials = tables['03_MATERIALES']
  const prices = tables['04_PRECIOS']
  const inventory = tables['05_INVENTARIO']
  const media = tables['06_IMAGENES']
  const projects = tables['07_PROYECTOS']
  const care = tables['08_STONE_CARE']
  const controls = tables['10_CONTROL']
  for (const [rows, field, tab] of [[products, 'producto_id', 'PRODUCTOS'], [variants, 'sku', 'VARIANTES'], [materials, 'material_id', 'MATERIALES'], [prices, 'sku', 'PRECIOS'], [media, 'medio_id', 'IMAGENES'], [projects, 'proyecto_id', 'PROYECTOS']]) unique(rows, field, errors, tab)
  const mat = byId(materials, 'material_id')
  const price = byId(prices, 'sku')
  const stock = byId(inventory, 'sku')
  const publicProducts = []
  const publicMaterials = []
  const publicProjects = []
  const publicCare = []
  const slugSet = new Set()

  const assetsFor = (key, id) => media.filter(m => str(m[key]) === id && yes(m.derechos_publicacion_confirmados) && yes(m.aprobado_web))
  const imageList = (list, id) => {
    const result = []
    for (const m of list) {
      const url = str(m.url_asset_publico_optimizado)
      if (!publicAssetUrl(url)) errors.push(fail('IMAGE_PUBLIC_URL', id, `Medio ${m.medio_id} sin URL pública optimizada`))
      if (!str(m.texto_alt)) errors.push(fail('IMAGE_ALT', id, `Medio ${m.medio_id} sin texto alternativo`))
      if (publicAssetUrl(url) && str(m.texto_alt)) result.push({ id: str(m.medio_id), url, alt: str(m.texto_alt) })
    }
    return result.sort((a, b) => a.id.localeCompare(b.id))
  }
  const checkSlug = (slug, id) => {
    if (!validSlug(slug)) errors.push(fail('BAD_SLUG', id, 'slug_web obligatorio en minúsculas, sin espacios ni acentos'))
    if (slugSet.has(slug)) errors.push(fail('DUPLICATE_SLUG', id, `slug_web repetido: ${slug}`))
    slugSet.add(slug)
  }

  for (const p of products.filter(p => approved(p.estado_catalogo))) {
    const id = str(p.producto_id)
    if (!id || !str(p.nombre_comercial)) { errors.push(fail('PRODUCT_REQUIRED', id, 'Falta ID o nombre')); continue }
    const slug = str(p.slug_web); checkSlug(slug, id)
    const sale = SALES[str(p.modalidad_venta).toLowerCase()]
    if (!sale) errors.push(fail('SALE_MODE', id, 'Modalidad de venta no reconocida'))
    if (!['CALIZA LIVING DESIGN', 'CALIZA STONE DESIGN', 'CALIZA STONE CARE'].includes(str(p.marca))) errors.push(fail('BRAND', id, 'Marca incompatible con arquitectura CALIZA GROUP'))
    if (!str(p.descripcion_corta_aprobada)) errors.push(fail('DESCRIPTION', id, 'Falta descripción corta aprobada'))
    approvedControl(controls, 'PRODUCTO', id, errors)
    const sourcePhotos = assetsFor('producto_id', id)
    if (sourcePhotos.some(m => !yes(m.producto_real))) errors.push(fail('PRODUCT_PHOTO_NOT_REAL',id,'Medio de producto sin verificación de pieza real'))
    const photos = imageList(sourcePhotos, id)
    if (!photos.length) errors.push(fail('IMAGE_MISSING', id, 'Falta imagen con derechos, aprobación, URL pública y alt'))
    const vrows = variants.filter(v => str(v.producto_id) === id && approved(v.estado))
    if (sale !== 'cotizacion' && !vrows.length) errors.push(fail('VARIANT_MISSING', id, 'Producto vendible sin SKU aprobado'))
    const publicVariants = []
    for (const v of vrows) {
      const sku = str(v.sku)
      const material = mat.get(str(v.material_principal_id))
      if (!sku || !material || !approved(material.estado)) errors.push(fail('MATERIAL_MISSING', sku || id, 'SKU sin material principal aprobado'))
      let publicPrice = null
      if (sale !== 'cotizacion') {
        const pr = price.get(sku)
        if (!pr || !approved(pr.estado) || !str(pr.aprobado_por)) errors.push(fail('PRICE_NOT_APPROVED', sku, 'Precio faltante o sin aprobación'))
        else {
          const value = num(pr.precio_publico)
          const tax = num(pr.impuesto_porcentaje)
          const deposit = num(pr.anticipo_porcentaje)
          const balance = num(pr.saldo_porcentaje)
          if (str(pr.moneda) !== 'COP' || value === null || value < 0 || tax === null || tax < 0 || deposit === null || balance === null || deposit + balance !== 100 || !['Sí', 'No', 'Si'].includes(str(pr.impuestos_incluidos))) errors.push(fail('PRICE_INVALID', sku, 'Precio/impuestos/anticipo/saldo incompletos'))
          else publicPrice = { currency: 'COP', amount: value, includesTax: yes(pr.impuestos_incluidos), taxPercent: tax, depositPercent: deposit, balancePercent: balance }
        }
        const inv = stock.get(sku)
        if (!inv || !approved(inv.estado)) errors.push(fail('INVENTORY_NOT_APPROVED', sku, 'Inventario/plazo sin aprobación'))
        else if (sale === 'inmediata' && (num(inv.cantidad_stock) === null || num(inv.cantidad_stock) < 0)) errors.push(fail('STOCK_INVALID', sku, 'Entrega inmediata sin stock numérico'))
        else if (sale !== 'inmediata' && !(num(inv.plazo_produccion_dias) > 0)) errors.push(fail('LEADTIME_INVALID', sku, 'Fabricación sin plazo aprobado'))
      }
      publicVariants.push({ sku, label: str(v.nombre_variante), materialId: str(v.material_principal_id), dimensionsCm: { length: num(v.largo_cm), width: num(v.ancho_cm), height: num(v.alto_cm), diameter: num(v.diametro_cm) }, price: publicPrice, availableUnits: sale === 'inmediata' ? num(stock.get(sku)?.cantidad_stock) : null, leadTimeDays: sale !== 'inmediata' && sale !== 'cotizacion' ? num(stock.get(sku)?.plazo_produccion_dias) : null })
    }
    publicProducts.push({ id, slug, name: str(p.nombre_comercial), brand: str(p.marca), category: str(p.categoria), description: str(p.descripcion_corta_aprobada), saleMode: sale || null, featured: yes(p.destacado_home), images: photos, variants: publicVariants.sort((a,b)=>a.sku.localeCompare(b.sku)) })
  }

  for (const m of materials.filter(m=>approved(m.estado))) {
    const id=str(m.material_id);const slug=str(m.slug_web);checkSlug(slug,id)
    approvedControl(controls,'MATERIAL',id,errors)
    if(!str(m.nombre_comercial)||!str(m.clase)) errors.push(fail('MATERIAL_REQUIRED',id,'Falta nombre o clase'))
    const images=imageList(media.filter(x=>str(x.material_id_opcional)===id&&yes(x.derechos_publicacion_confirmados)&&yes(x.aprobado_web)),id)
    publicMaterials.push({id,slug,name:str(m.nombre_comercial),family:str(m.clase),color:str(m.color),maintenance:str(m.mantenimiento),images})
  }

  for (const p of projects.filter(p => approved(p.estado))) {
    const id = str(p.proyecto_id); const slug = str(p.slug_web); checkSlug(slug,id)
    approvedControl(controls, 'PROYECTO', id, errors)
    if (!yes(p.permiso_publicacion)) errors.push(fail('PROJECT_RIGHTS', id, 'Permiso de publicación pendiente'))
    const photos = imageList(assetsFor('proyecto_id_opcional', id), id)
    if (!photos.length) errors.push(fail('PROJECT_IMAGES', id, 'Falta imagen de proyecto aprobada'))
    if (!str(p.nombre_publico) || !str(p.descripcion)) errors.push(fail('PROJECT_COPY', id, 'Falta nombre o descripción aprobada'))
    publicProjects.push({ id, slug, name: str(p.nombre_publico), line: str(p.linea), category: str(p.tipologia), city: str(p.ciudad_publicable), description: str(p.descripcion), images: photos })
  }
  for (const c of care.filter(c => approved(c.estado))) {
    const id = str(c.care_id); const slug = str(c.slug_web); checkSlug(slug, id)
    approvedControl(controls, 'STONE_CARE', id, errors)
    if (!str(c.nombre) || !str(c.descripcion)) errors.push(fail('CARE_COPY', id, 'Falta nombre o descripción'))
    if (str(c.modalidad_precio).toLowerCase() === 'precio público' && num(c.precio_publico) === null) errors.push(fail('CARE_PRICE', id, 'Precio público sin valor'))
    publicCare.push({ id, slug, name: str(c.nombre), kind: str(c.tipo_oferta), description: str(c.descripcion), pricingMode: str(c.modalidad_precio), priceCOP: str(c.modalidad_precio).toLowerCase() === 'precio público' ? num(c.precio_publico) : null })
  }
  const ready = publicProducts.length + publicMaterials.length + publicProjects.length + publicCare.length
  if (!ready) errors.push(fail('EMPTY_RELEASE', 'release', 'No hay contenidos aprobados; no se debe vaciar la web'))
  const report = { ready, products: publicProducts.length, materials: publicMaterials.length, projects: publicProjects.length, care: publicCare.length, errors }
  if (errors.length) return { ok: false, release: null, report }
  const release = { version: 1, source: { spreadsheetId: options.spreadsheetId || '' }, products: publicProducts.sort((a,b)=>a.id.localeCompare(b.id)), materials: publicMaterials.sort((a,b)=>a.id.localeCompare(b.id)), projects: publicProjects.sort((a,b)=>a.id.localeCompare(b.id)), care: publicCare.sort((a,b)=>a.id.localeCompare(b.id)) }
  return { ok: true, release, report }
}

export function compareRelease(previous, next) {
  const diff = {}
  for (const key of ['products', 'materials', 'projects', 'care']) {
    const before = new Map((previous?.[key] ?? []).map(x => [x.id, JSON.stringify(x)]))
    const after = new Map((next?.[key] ?? []).map(x => [x.id, JSON.stringify(x)]))
    const removed = [...before.keys()].filter(id => !after.has(id))
    diff[key] = { added: [...after.keys()].filter(id => !before.has(id)), changed: [...after].filter(([id,v]) => before.has(id) && before.get(id)!==v).map(([id])=>id), removed }
  }
  return diff
}
