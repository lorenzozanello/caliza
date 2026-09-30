import type { CollectionConfig } from 'payload'
import { revalidateHooks } from '@/lib/revalidate'
import { slugField } from '@/lib/fields'

export const Legal: CollectionConfig = {
  slug: 'legal',
  labels: { singular: 'Página legal', plural: 'Páginas legales' },
  admin: { useAsTitle: 'title', group: 'Contenido', defaultColumns: ['title', 'slug', 'updatedAt'] },
  access: { read: () => true },
  hooks: revalidateHooks,
  fields: [
    { name: 'title', label: 'Título', type: 'text', required: true },
    slugField('title'),
    { name: 'draft', label: 'Borrador pendiente de revisión legal', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar', description: 'Mientras esté marcado, la página muestra un aviso de borrador.' } },
    { name: 'body', label: 'Contenido', type: 'richText', required: true },
  ],
}
