import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuario', plural: 'Usuarios' },
  auth: true,
  admin: { useAsTitle: 'email', group: 'Configuración' },
  fields: [
    { name: 'name', label: 'Nombre', type: 'text' },
  ],
}
