// CALIZA GROUP: public-content contract. Never add private cost or supplier fields here.
export const SPREADSHEET_ID = '1ibSKxlHH2uPfRwxaiQcrocMWgkDX4qjvw-g_TGkqk4g'

export const TABS = [
  '01_PRODUCTOS', '02_VARIANTES', '03_MATERIALES', '04_PRECIOS',
  '05_INVENTARIO', '06_IMAGENES', '07_PROYECTOS', '08_STONE_CARE',
  '09_LOGISTICA', '10_CONTROL',
]

export const REQUIRED_COLUMNS = {
  '01_PRODUCTOS': ['producto_id', 'nombre_comercial', 'marca', 'modalidad_venta', 'estado_catalogo', 'slug_web'],
  '02_VARIANTES': ['sku', 'producto_id', 'material_principal_id', 'estado'],
  '03_MATERIALES': ['material_id', 'nombre_comercial', 'estado', 'slug_web'],
  '04_PRECIOS': ['sku', 'moneda', 'precio_publico', 'impuestos_incluidos', 'impuesto_porcentaje', 'anticipo_porcentaje', 'saldo_porcentaje', 'aprobado_por', 'estado'],
  '05_INVENTARIO': ['sku', 'tipo_disponibilidad', 'estado'],
  '06_IMAGENES': ['medio_id', 'producto_id', 'proyecto_id_opcional', 'derechos_publicacion_confirmados', 'aprobado_web', 'texto_alt', 'url_asset_publico_optimizado'],
  '07_PROYECTOS': ['proyecto_id', 'nombre_publico', 'descripcion', 'permiso_publicacion', 'estado', 'slug_web'],
  '08_STONE_CARE': ['care_id', 'tipo_oferta', 'nombre', 'descripcion', 'estado', 'slug_web'],
  '09_LOGISTICA': ['regla_id', 'estado'],
  '10_CONTROL': ['entidad', 'registro_id', 'aprobado_datos', 'aprobado_fotos', 'aprobado_precio', 'aprobado_legal', 'listo_publicar'],
}

export const SALES = {
  'entrega inmediata': 'inmediata',
  'bajo pedido': 'pedido',
  'configurable': 'configurable',
  'solo cotización': 'cotizacion',
  'solo cotizacion': 'cotizacion',
}

export function approved(value) {
  return String(value ?? '').trim().toLowerCase() === 'aprobado'
}

export function yes(value) {
  return ['sí', 'si', 'true'].includes(String(value ?? '').trim().toLowerCase()) || value === true
}

export function validSlug(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value ?? ''))
}

export function publicAssetUrl(value) {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !['drive.google.com', 'docs.google.com', 'localhost'].includes(url.hostname)
  } catch {
    return false
  }
}
