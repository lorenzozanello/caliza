import type { Field } from 'payload'

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const slugField = (from = 'name'): Field => ({
  name: 'slug',
  label: 'URL',
  type: 'text',
  unique: true,
  index: true,
  admin: { position: 'sidebar', description: 'Se genera desde el nombre si lo dejas vacío.' },
  hooks: {
    beforeValidate: [({ value, data }) => (value ? slugify(String(value)) : data?.[from] ? slugify(String(data[from])) : value)],
  },
})
