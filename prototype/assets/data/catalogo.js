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

  // Clasificación documental exacta de 11_CATEGORIAS_FUENTE; los medios no equivalen a modelos ni SKU.
  const gruposDocumentados = {
    "mesas-de-comedor": {
      "subfamilias": [
        {
          "nombre": "Base de piedra",
          "origen": "CON BASE DE PIEDRA",
          "medios": 5
        },
        {
          "nombre": "Base de hierro",
          "origen": "CON BASE DE HIERRO",
          "medios": 5
        },
        {
          "nombre": "Base de madera",
          "origen": "CON BASE MADERA",
          "medios": 8
        }
      ],
      "imagenesFuente": 18,
      "videosFuente": 0,
      "preguntas": [
        "Dimensiones aproximadas del espacio",
        "Preferencia de base y material",
        "Ciudad de destino",
        "Uso residencial o comercial"
      ]
    },
    "mesas-auxiliares": {
      "subfamilias": [
        {
          "nombre": "Mesas auxiliares",
          "origen": "MESAS AUXILIARES",
          "medios": 9
        }
      ],
      "imagenesFuente": 9,
      "videosFuente": 0,
      "preguntas": [
        "Medida y altura aproximadas",
        "Espacio donde se utilizará",
        "Material o acabado de interés",
        "Ciudad de destino"
      ]
    },
    "sillas-para-hogar": {
      "subfamilias": [
        {
          "nombre": "Línea hogar",
          "origen": "LINEA HOGAR",
          "medios": 14
        }
      ],
      "imagenesFuente": 14,
      "videosFuente": 0,
      "preguntas": [
        "Cantidad aproximada",
        "Uso y espacio",
        "Preferencias de estilo y tapicería",
        "Ciudad de destino"
      ]
    },
    "sillas-comerciales": {
      "subfamilias": [
        {
          "nombre": "Línea comercial",
          "origen": "LINEA COMERCIAL",
          "medios": 5
        }
      ],
      "imagenesFuente": 5,
      "videosFuente": 0,
      "preguntas": [
        "Tipo de establecimiento",
        "Cantidad estimada",
        "Condiciones de uso",
        "Ciudad de destino"
      ]
    },
    "lavamanos": {
      "subfamilias": [
        {
          "nombre": "Lavamanos",
          "origen": "LAVAMANOS",
          "medios": 33
        }
      ],
      "imagenesFuente": 33,
      "videosFuente": 6,
      "preguntas": [
        "Tipo de baño o espacio",
        "Medida aproximada disponible",
        "Material deseado o por asesorar",
        "Ciudad de instalación"
      ]
    }
  };
  for (const f of familias) {
    const group = gruposDocumentados[f.slug];
    if (!group) continue;
    f.subfamilias = group.subfamilias;
    f.archivo = { imagenes: group.imagenesFuente, videos: group.videosFuente, tipo: 'Recursos de origen; NO son modelos ni unidades de stock' };
    f.preguntas = group.preguntas;
    f.estado = 'Familia bajo consulta';
  }
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
    family.imagenes.aspectRatio = typeof medio.aspectRatio === 'number' && medio.aspectRatio > .25 && medio.aspectRatio < 4 ? medio.aspectRatio : null;
  }
  const MODO_SELECCION_ACTIVO = familias.some((f) => f.piezas.length > 0);
  window.CALIZA_CATALOGO = Object.freeze({ familias: Object.freeze(familias), MODO_SELECCION_ACTIVO });
})();
