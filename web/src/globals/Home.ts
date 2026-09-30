import type { GlobalConfig } from 'payload'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Página de inicio',
  admin: { group: 'Contenido' },
  access: { read: () => true },
  fields: [
    {
      type: 'collapsible', label: 'Portada',
      fields: [
        { name: 'heroImage', label: 'Foto de portada', type: 'upload', relationTo: 'media', required: true },
        { name: 'heroEyebrow', label: 'Antetítulo', type: 'text', defaultValue: 'Tres generaciones de marmoleros italianos' },
        { name: 'heroLine1', label: 'Titular, línea 1', type: 'text', defaultValue: 'Piedra natural,' },
        { name: 'heroLine2', label: 'Titular, línea 2', type: 'text', defaultValue: 'hecha para' },
        { name: 'heroLine3', label: 'Titular, línea 3 (itálica)', type: 'text', defaultValue: 'tu espacio.' },
        { name: 'heroText', label: 'Texto', type: 'textarea', defaultValue: 'Diseñamos, fabricamos y cuidamos espacios y piezas en piedra, con madera, metal y el oficio de una familia.' },
      ],
    },
    { name: 'manifesto', label: 'Manifiesto', type: 'textarea', defaultValue: 'Somos marmoleros desde hace tres generaciones. La tercera diseña en Colombia: elegimos cada piedra, la interpretamos y la convertimos en espacios y piezas que duran.' },
    {
      type: 'collapsible', label: 'Stone · Design · Care',
      fields: [
        { name: 'stoneImage', label: 'Foto Stone', type: 'upload', relationTo: 'media', required: true },
        { name: 'designImage', label: 'Foto Design', type: 'upload', relationTo: 'media', required: true },
        { name: 'careImage', label: 'Foto Care', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      type: 'collapsible', label: 'Historia',
      fields: [
        { name: 'historyText', label: 'Texto', type: 'textarea', defaultValue: 'Aprender a leer una veta toma años. Ese saber pasó de mano en mano en nuestra familia y hoy, con la dirección creativa de Leonardo Zanello, se convierte en espacios y piezas contemporáneas.' },
        {
          name: 'generations', label: 'Generaciones', type: 'array', maxRows: 3,
          fields: [
            { name: 'name', label: 'Nombre', type: 'text', required: true },
            { name: 'note', label: 'Nota', type: 'text' },
          ],
        },
      ],
    },
    { name: 'careSectionImage', label: 'Foto sección Care', type: 'upload', relationTo: 'media' },
  ],
}
