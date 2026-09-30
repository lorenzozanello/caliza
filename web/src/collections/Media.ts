import { revalidateHooks } from '@/lib/revalidate'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  hooks: revalidateHooks,
  slug: 'media',
  labels: { singular: 'Imagen', plural: 'Imágenes' },
  admin: { group: 'Contenido' },
  access: { read: () => true },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumb', width: 480 },
      { name: 'card', width: 1200 },
      { name: 'hero', width: 2400 },
    ],
  },
  fields: [
    { name: 'alt', label: 'Texto alternativo', type: 'text', required: true, admin: { description: 'Describe lo que se ve. Ej.: "Mesa con cubierta de piedra y base en roble".' } },
    { name: 'studio', label: 'Fondo de estudio blanco', type: 'checkbox', defaultValue: false, admin: { description: 'Para fotos de producto sobre fondo blanco: el sitio las funde con el fondo de la tarjeta.' } },
    { name: 'provisional', label: 'Fotografía provisional', type: 'checkbox', defaultValue: false, admin: { description: 'Márcala si no es una foto real de Caliza. El sitio la etiqueta como provisional.' } },
  ],
}
