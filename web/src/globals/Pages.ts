import { revalidateSite } from '@/lib/revalidate'
import type { Field, GlobalConfig } from 'payload'

const hero = (defaults: { eyebrow: string; title: string; titleItalic: string; intro: string }): Field[] => [
  { name: 'heroImage', label: 'Foto de portada', type: 'upload', relationTo: 'media' },
  { name: 'eyebrow', label: 'Antetítulo', type: 'text', defaultValue: defaults.eyebrow },
  { name: 'title', label: 'Titular', type: 'text', defaultValue: defaults.title },
  { name: 'titleItalic', label: 'Titular, final en itálica', type: 'text', defaultValue: defaults.titleItalic },
  { name: 'intro', label: 'Texto de entrada', type: 'textarea', defaultValue: defaults.intro },
]

const items = (name: string, label: string, defaults: { title: string; text: string }[], withImage = false): Field => ({
  name, label, type: 'array', defaultValue: defaults,
  fields: [
    { name: 'title', label: 'Título', type: 'text', required: true },
    { name: 'text', label: 'Texto', type: 'textarea' },
    ...(withImage ? [{ name: 'image', label: 'Foto', type: 'upload', relationTo: 'media' } as Field] : []),
  ],
})

/** Contenido editable de las páginas de Stone, Care y Estudio. */
export const Pages: GlobalConfig = {
  slug: 'pages',
  label: 'Páginas',
  admin: { group: 'Contenido' },
  access: { read: () => true },
  hooks: { afterChange: [() => revalidateSite()] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'stone', label: 'Stone',
          fields: [
            ...hero({ eyebrow: 'Caliza Stone', title: 'La piedra que', titleItalic: 'transforma tu espacio.', intro: 'Diseñamos, fabricamos e instalamos superficies en piedra natural a la medida: desde la elección de la placa hasta el último borde pulido.' }),
            { name: 'manifesto', label: 'Frase principal', type: 'textarea', defaultValue: 'Un proyecto en piedra empieza antes de medir: empieza cuando elegimos la placa y decidimos dónde va a correr la veta.' },
            items('spaces', 'Qué transformamos', [
              { title: 'Cocinas', text: 'Mesones, islas y salpicaderos con las vetas casadas.' },
              { title: 'Baños', text: 'Lavamanos, muros y duchas en una sola lectura de piedra.' },
              { title: 'Pisos y escaleras', text: 'Superficies continuas, con el acabado que pide el uso.' },
              { title: 'Muros y chimeneas', text: 'La piedra como protagonista del espacio.' },
              { title: 'Piscinas y exteriores', text: 'Acabados antideslizantes que resisten sol y agua.' },
              { title: 'Fachadas', text: 'Revestimientos que envejecen con dignidad.' },
            ], true),
          ],
        },
        {
          name: 'care', label: 'Care',
          fields: [
            ...hero({ eyebrow: 'Caliza Care', title: 'Lo que dura,', titleItalic: 'también se cuida.', intro: 'Mantenimiento, protección y restauración de superficies en piedra natural, para que conserven su brillo, su tono y su veta.' }),
            items('services', 'Servicios', [
              { title: 'Mantenimiento periódico', text: 'Limpieza profunda y revisión de superficies y pisos.' },
              { title: 'Protección y sellado', text: 'Sellado para cocinas, baños y zonas de uso intenso.' },
              { title: 'Restauración', text: 'Recuperamos brillo, retiramos manchas y corregimos desgaste.' },
            ]),
            items('symptoms', 'Qué le pasa a tu superficie', [
              { title: 'Perdió el brillo', text: '' },
              { title: 'Tiene manchas', text: '' },
              { title: 'Está rayada', text: '' },
              { title: 'Tiene una grieta o un despique', text: '' },
              { title: 'Quiero protegerla', text: '' },
            ]),
            items('steps', 'Cómo funciona', [
              { title: 'Nos envías fotos', text: 'Por WhatsApp, con luz natural y un detalle de cerca.' },
              { title: 'Te proponemos el tratamiento', text: 'Qué hacer, cuánto toma y cuánto cuesta.' },
              { title: 'Lo hacemos en tu espacio', text: 'Protegemos todo alrededor antes de empezar.' },
              { title: 'Te dejamos un plan', text: 'Cómo limpiarla y cada cuánto volver a sellarla.' },
            ]),
          ],
        },
        {
          name: 'studio', label: 'Estudio',
          fields: [
            ...hero({ eyebrow: 'El estudio', title: 'Tres generaciones', titleItalic: 'leyendo la piedra.', intro: 'Una familia de marmoleros italianos. La tercera generación diseña en Colombia, con la dirección creativa de Leonardo Zanello.' }),
            { name: 'story', label: 'Historia (párrafos separados por una línea en blanco)', type: 'textarea', defaultValue: 'Aprender a leer una veta toma años. Ese saber pasó de mano en mano en nuestra familia: cómo elegir una placa, dónde cortarla, cómo casar las vetas para que una superficie se lea como una sola pieza.\n\nHoy ese oficio se encuentra con el diseño contemporáneo. Combinamos la piedra con madera, metal y texturas, y la llevamos a cocinas, baños, fachadas y piezas para habitar.' },
            items('principles', 'Lo que no cambia', [
              { title: 'La placa se elige antes que el diseño', text: 'Cada piedra es distinta. Por eso la elegimos antes de dibujar.' },
              { title: 'La veta manda', text: 'Cortamos y casamos las vetas para que la superficie se lea completa.' },
              { title: 'Hecho por encargo', text: 'Fabricamos después de tu elección, a la medida de tu espacio.' },
              { title: 'Lo que hacemos, lo cuidamos', text: 'Caliza Care acompaña cada superficie después de la entrega.' },
            ]),
          ],
        },
      ],
    },
  ],
}
