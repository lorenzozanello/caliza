/* Catálogo editorial CALIZA: fuente única para el prototipo estático; no implica inventario. */
(function () {
  'use strict';
  const familias = [
    { slug: 'mesas-de-comedor', nombre: 'Mesas de comedor', categoria: 'Mesas', linea: 'living-design', descripcion: 'Alternativas de diseño y materiales para una pieza de encuentro. Modelos y acabados por confirmar.', imagenes: { ambiente: null, detalle: null }, whatsappTexto: 'Hola, deseo conocer la familia Mesas de comedor de CALIZA.', piezas: [] },
    { slug: 'mesas-auxiliares', nombre: 'Mesas auxiliares', categoria: 'Mesas', linea: 'living-design', descripcion: 'Piezas de apoyo y acento para ambientes residenciales y de encuentro, bajo consulta.', imagenes: { ambiente: null, detalle: null }, whatsappTexto: 'Hola, deseo conocer la familia Mesas auxiliares de CALIZA.', piezas: [] },
    { slug: 'sillas-para-hogar', nombre: 'Sillas para hogar', categoria: 'Sillas', linea: 'living-design', descripcion: 'Asientos para espacios residenciales. Modelos, tapizados y acabados por confirmar.', imagenes: { ambiente: null, detalle: null }, whatsappTexto: 'Hola, deseo conocer la familia Sillas para hogar de CALIZA.', piezas: [] },
    { slug: 'sillas-comerciales', nombre: 'Sillas comerciales', categoria: 'Sillas', linea: 'living-design', descripcion: 'Opciones para proyectos comerciales y de hospitalidad, sujetas a consulta técnica.', imagenes: { ambiente: null, detalle: null }, whatsappTexto: 'Hola, deseo conocer la familia Sillas comerciales de CALIZA.', piezas: [] },
    { slug: 'lavamanos', nombre: 'Lavamanos', categoria: 'Lavamanos', linea: 'living-design', descripcion: 'Posibilidades de diseño para baño en piedra natural, con medidas y materiales por confirmar.', imagenes: { ambiente: null, detalle: null }, whatsappTexto: 'Hola, deseo conocer la familia Lavamanos de CALIZA.', piezas: [] },
  ];

  // Únicamente activos autorizados por el pipeline de publicación; si no existen, se muestra placeholder.
  // El catálogo maestro conserva los nombres y campos de aprobación, nunca los precios históricos impresos.
  const approved = window.CALIZA_APPROVED_MEDIA || {};
  for (const family of familias) {
    const medio = approved[family.slug];
    if (!medio || !/^approved\/[a-z0-9-]+(?:-[0-9]+)?\.webp$/.test(medio.src || '') || !medio.alt || !/^CAL-MED-\d{4}$/.test(medio.medio_id || '')) continue;
    family.imagenes.ambiente = medio.src;
    family.imagenes.alt = medio.alt;
    family.imagenes.medio_id = medio.medio_id;
    family.imagenes.widths = Array.isArray(medio.widths) ? medio.widths : [];
  }
  const MODO_SELECCION_ACTIVO = familias.some((f) => f.piezas.length > 0);
  window.CALIZA_CATALOGO = Object.freeze({ familias: Object.freeze(familias), MODO_SELECCION_ACTIVO });
})();
