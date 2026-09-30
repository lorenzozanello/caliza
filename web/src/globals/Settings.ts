import { revalidateSite } from '@/lib/revalidate'
import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  hooks: { afterChange: [() => revalidateSite()] },
  slug: 'settings',
  label: 'Ajustes del sitio',
  admin: { group: 'Configuración' },
  access: { read: () => true },
  fields: [
    { name: 'whatsappNumber', label: 'Número de WhatsApp', type: 'text', required: true, defaultValue: '570000000000', admin: { description: 'Formato internacional sin "+". Ej.: 573001234567' } },
    { name: 'instagramUrl', label: 'Instagram', type: 'text' },
    { name: 'tiktokUrl', label: 'TikTok', type: 'text' },
    {
      name: 'shippingCities', label: 'Ciudades con envío', type: 'array',
      fields: [
        { name: 'city', label: 'Ciudad', type: 'text', required: true },
        { name: 'cost', label: 'Costo de envío e instalación (COP)', type: 'number', required: true, min: 0 },
      ],
    },
    { name: 'defaultShippingCost', label: 'Costo de envío para otras ciudades (COP)', type: 'number', defaultValue: 0, admin: { description: 'Se muestra como "por confirmar" si es 0.' } },
  ],
}
