import { revalidateHooks } from '@/lib/revalidate'
import type { CollectionConfig } from 'payload'
import { slugField } from '@/lib/fields'
import { PUBLIC_PROJECT } from '@/lib/publication'

export const Projects: CollectionConfig = {
  hooks: revalidateHooks,
  slug: 'projects',
  labels: { singular: 'Proyecto', plural: 'Proyectos' },
  admin: { useAsTitle: 'title', group: 'Catálogo', defaultColumns: ['title', 'line', 'city', 'featured'] },
  access: { read: ({ req }) => req.user ? true : PUBLIC_PROJECT },
  fields: [
    { name: 'title', label: 'Nombre del proyecto', type: 'text', required: true },
    slugField('title'),
    { name: 'sourceProjectId', label: 'ID aprobado del proyecto en Drive', type: 'text', unique: true },
    { name: 'publicationApproved', label: 'Proyecto aprobado para web', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'imageRightsConfirmed', label: 'Derechos de fotos confirmados', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'line', label: 'Línea', type: 'select', required: true, defaultValue: 'stone',
      options: [{ label: 'Stone', value: 'stone' }, { label: 'Design', value: 'design' }, { label: 'Care', value: 'care' }],
    },
    { name: 'city', label: 'Ciudad', type: 'text' },
    { name: 'year', label: 'Año', type: 'number' },
    { name: 'space', label: 'Espacio', type: 'text', admin: { description: 'Ej.: Cocina y comedor' } },
    { name: 'materialsText', label: 'Materiales', type: 'text', admin: { description: 'Piedra primero. Ej.: Piedra natural · roble · latón' } },
    { name: 'challenge', label: 'El reto', type: 'textarea' },
    { name: 'solution', label: 'La solución', type: 'textarea' },
    { name: 'cover', label: 'Foto principal', type: 'upload', relationTo: 'media', required: true },
    { name: 'gallery', label: 'Galería', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }] },
    { name: 'featured', label: 'Destacado en la home', type: 'checkbox', defaultValue: false },
    { name: 'isExample', label: 'Contenido de ejemplo', type: 'checkbox', defaultValue: false },
  ],
}
