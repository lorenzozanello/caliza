import test from 'node:test'
import assert from 'node:assert/strict'
import { buildRelease, compareRelease } from './lib.mjs'
import { REQUIRED_COLUMNS, SPREADSHEET_ID, TABS } from './contract.mjs'

const data = {
  '01_PRODUCTOS': { producto_id:'P-001',nombre_comercial:'Mesa prueba',marca:'CALIZA LIVING DESIGN',categoria:'Mesas',descripcion_corta_aprobada:'Mesa de piedra real verificada',modalidad_venta:'Bajo pedido',estado_catalogo:'Aprobado',slug_web:'mesa-prueba' },
  '02_VARIANTES': {sku:'SKU-001',producto_id:'P-001',material_principal_id:'MAT-001',estado:'Aprobado',nombre_variante:'Única'},
  '03_MATERIALES': {material_id:'MAT-001',nombre_comercial:'Piedra prueba',clase:'Piedra natural',estado:'Pendiente'},
  '04_PRECIOS': {sku:'SKU-001',moneda:'COP',precio_publico:2500000,impuestos_incluidos:'Sí',impuesto_porcentaje:19,anticipo_porcentaje:50,saldo_porcentaje:50,aprobado_por:'Comercial CALIZA',estado:'Aprobado'},
  '05_INVENTARIO': {sku:'SKU-001',tipo_disponibilidad:'Bajo pedido',plazo_produccion_dias:40,estado:'Aprobado'},
  '06_IMAGENES': {medio_id:'MED-001',producto_id:'P-001',derechos_publicacion_confirmados:'Sí',aprobado_web:'Sí',producto_real:'Sí',texto_alt:'Mesa de piedra sobre suelo claro',url_asset_publico_optimizado:'https://cdn.example.org/mesa.avif'},
  '10_CONTROL': {entidad:'PRODUCTO',registro_id:'P-001',aprobado_datos:'Sí',aprobado_fotos:'Sí',aprobado_precio:'Sí',aprobado_legal:'Sí',listo_publicar:'Sí'},
}

function snapshot(override={}) {
  const rows={...data,...override}
  const tabs=Object.fromEntries(TABS.map(t=>{
    const head=[...new Set([...REQUIRED_COLUMNS[t],...Object.keys(rows[t]??{})])]
    return [t,[head,...(rows[t]===null?[]:Array.isArray(rows[t])?rows[t]:rows[t]?[rows[t]]:[]).map(r=>head.map(h=>r[h]??''))]]
  }))
  return {spreadsheetId:SPREADSHEET_ID,tabs}
}

test('no publica sin aprobaciones comerciales y técnicas',()=>{
  const r=buildRelease(snapshot()); assert.equal(r.ok,false)
  assert.equal(r.release,null);assert.ok(r.report.errors.some(e=>e.code==='MATERIAL_MISSING'))
})
test('exporta únicamente datos públicos aprobados y deterministas',()=>{
  const material={...data['03_MATERIALES'],estado:'Aprobado',slug_web:'piedra-prueba'}
  const control=[data['10_CONTROL'],{...data['10_CONTROL'],entidad:'MATERIAL',registro_id:'MAT-001'}]
  const fixture=snapshot({'03_MATERIALES':material,'10_CONTROL':control})
  const one=buildRelease(fixture),two=buildRelease(fixture)
  assert.equal(one.ok,true);assert.deepEqual(one.release,two.release)
  assert.equal(one.release.products[0].variants[0].price.amount,2500000)
  assert.equal(one.release.materials.length,1)
  assert.equal(JSON.stringify(one.release).includes('proveedor'),false)
  assert.equal(JSON.stringify(one.release).includes('costo_embalaje'),false)
})
test('bloquea fotos privadas de Google Drive',()=>{
  const r=buildRelease(snapshot({'06_IMAGENES':{...data['06_IMAGENES'],url_asset_publico_optimizado:'https://drive.google.com/file/d/x/view'}}))
  assert.equal(r.ok,false);assert.ok(r.report.errors.some(e=>e.code==='IMAGE_PUBLIC_URL'))
})
test('bloquea productos sin control de aprobación individual',()=>{
  const r=buildRelease(snapshot({'10_CONTROL':null}))
  assert.equal(r.ok,false);assert.ok(r.report.errors.some(e=>e.code==='CONTROL_MISSING'))
})
test('detecta bajas que requieren aprobación separada',()=>{
  const diff=compareRelease({products:[{id:'P-2'}]}, {products:[{id:'P-1'}],materials:[],projects:[],care:[]})
  assert.deepEqual(diff.products.removed,['P-2'])
})
test('bloquea release vacío para evitar borrar catálogo',()=>{
  const r=buildRelease(snapshot(Object.fromEntries(Object.keys(data).map(k=>[k,null]))))
  assert.equal(r.ok,false);assert.ok(r.report.errors.some(e=>e.code==='EMPTY_RELEASE'))
})
test('rechaza cabeceras faltantes',()=>{
  const s=snapshot();s.tabs['01_PRODUCTOS']=[['producto_id'],['P-1']]
  const r=buildRelease(s);assert.equal(r.ok,false);assert.ok(r.report.errors.some(e=>e.code==='COLUMN_MISSING'))
})
