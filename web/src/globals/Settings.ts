import { revalidateSite } from '@/lib/revalidate'
import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  hooks: { afterChange: [() => revalidateSite()] },
  slug: 'settings',
  label: 'Ajustes del sitio',
  admin: { group: 'Configuración' },
  access: { read: () => true },
  fields: [
    { name: 'whatsappNumber', label: 'Número de WhatsApp', type: 'text', required: true, defaultValue: '573025983218', admin: { description: 'Contacto oficial confirmado: +57 302 598 3218. Formato internacional sin +.' } },
    { name: 'instagramUrl', label: 'Instagram', type: 'text', defaultValue: 'https://www.instagram.com/calizastonedesign/' },
    { name: 'tiktokUrl', label: 'TikTok', type: 'text', defaultValue: 'https://www.tiktok.com/@calizastone' },
    { name: 'socialPostLinks', label: 'Publicaciones autorizadas para mostrar', type: 'array', admin: { description: 'Curaduría editorial. Solo enlaces públicos de publicaciones de cuentas oficiales, con autorización confirmada. No pegues enlaces a Drive ni tokens.' }, fields: [
      { name: 'url', label: 'Enlace público de la publicación', type: 'text', required: true },
      { name: 'approved', label: 'Aprobada para web', type: 'checkbox', defaultValue: false },
    ] },
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
