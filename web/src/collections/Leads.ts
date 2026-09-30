import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Solicitud', plural: 'Solicitudes' },
  admin: { useAsTitle: 'name', group: 'Ventas', defaultColumns: ['name', 'intent', 'channel', 'status', 'createdAt'] },
  access: { read: ({ req }) => Boolean(req.user), create: () => true, update: ({ req }) => Boolean(req.user), delete: ({ req }) => Boolean(req.user) },
  fields: [
    { name: 'name', label: 'Nombre', type: 'text', required: true },
    { name: 'phone', label: 'WhatsApp', type: 'text', required: true },
    { name: 'city', label: 'Ciudad', type: 'text' },
    {
      name: 'intent', label: 'Necesidad', type: 'select', required: true, defaultValue: 'proyecto',
      options: [
        { label: 'Un proyecto (Stone)', value: 'proyecto' },
        { label: 'Una pieza (Design)', value: 'pieza' },
        { label: 'Cuidar una superficie (Care)', value: 'cuidado' },
        { label: 'Aún no lo sé', value: 'orientacion' },
      ],
    },
    { name: 'channel', label: 'Cómo quiere hablar', type: 'select', defaultValue: 'whatsapp', options: [{ label: 'WhatsApp', value: 'whatsapp' }, { label: 'Videollamada', value: 'videollamada' }] },
    { name: 'message', label: 'Mensaje', type: 'textarea' },
    { name: 'utmSource', label: 'Origen', type: 'text' },
    { name: 'status', label: 'Estado', type: 'select', defaultValue: 'nuevo', options: [{ label: 'Nuevo', value: 'nuevo' }, { label: 'En conversación', value: 'conversacion' }, { label: 'Cotizado', value: 'cotizado' }, { label: 'Ganado', value: 'ganado' }, { label: 'Perdido', value: 'perdido' }] },
  ],
}
