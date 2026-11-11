import { revalidateHooks } from '@/lib/revalidate'
import type { CollectionConfig } from 'payload'
import { slugField } from '@/lib/fields'
import { PUBLIC_MATERIAL } from '@/lib/publication'

export const Materials: CollectionConfig = {
  hooks: revalidateHooks,
  slug: 'materials',
  labels: { singular: 'Material', plural: 'Materiales' },
  admin: { useAsTitle: 'name', group: 'Catálogo', defaultColumns: ['name', 'family', 'order'] },
  access: { read: ({ req }) => req.user ? true : PUBLIC_MATERIAL },
  defaultSort: 'order',
  fields: [
    { name: 'name', label: 'Nombre', type: 'text', required: true },
    slugField(),
    { name: 'sourceMaterialId', label: 'ID de material en el catálogo maestro', type: 'text', unique: true },
    { name: 'publicationApproved', label: 'Material y foto aprobados para web', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'family', label: 'Familia', type: 'select', required: true, defaultValue: 'piedra',
      options: [
        { label: 'Piedra', value: 'piedra' },
        { label: 'Madera', value: 'madera' },
        { label: 'Metal', value: 'metal' },
        { label: 'Textura / acabado', value: 'textura' },
      ],
    },
    { name: 'description', label: 'Descripción', type: 'textarea' },
    { name: 'recommendedUses', label: 'Dónde conviene', type: 'text' },
    { name: 'cautions', label: 'Con cuidado en', type: 'text' },
    { name: 'image', label: 'Imagen', type: 'upload', relationTo: 'media' },
    { name: 'order', label: 'Orden', type: 'number', defaultValue: 0 },
  ],
}
