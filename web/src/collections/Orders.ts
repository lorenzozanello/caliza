import type { CollectionConfig } from 'payload'
import { randomBytes } from 'node:crypto'
import { ORDER_STAGES } from '@/lib/orders'

const isAdmin = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Pedido', plural: 'Pedidos' },
  admin: { useAsTitle: 'number', group: 'Ventas', defaultColumns: ['number', 'status', 'customerName', 'total', 'createdAt'] },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          if (!data.number) data.number = 'C-' + String(Date.now()).slice(-6)
          if (!data.accessToken) data.accessToken = randomBytes(18).toString('base64url')
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'number', label: 'Número', type: 'text', unique: true, index: true, admin: { readOnly: true } },
        { name: 'status', label: 'Etapa', type: 'select', required: true, defaultValue: 'pendiente_pago', options: ORDER_STAGES.map((s) => ({ label: s.label, value: s.value })) },
      ],
    },
    { name: 'accessToken', label: 'Código de seguimiento', type: 'text', index: true, admin: { readOnly: true, description: 'Forma el enlace privado del cliente: /pedido/<código>.' } },
    {
      type: 'collapsible', label: 'Cliente',
      fields: [
        { type: 'row', fields: [
          { name: 'customerName', label: 'Nombre', type: 'text', required: true },
          { name: 'customerPhone', label: 'WhatsApp', type: 'text', required: true },
          { name: 'customerEmail', label: 'Correo', type: 'email' },
        ] },
      ],
    },
    {
      name: 'shipping', label: 'Entrega', type: 'group',
      fields: [
        { type: 'row', fields: [
          { name: 'city', label: 'Ciudad', type: 'text', required: true },
          { name: 'address', label: 'Dirección', type: 'text', required: true },
        ] },
        { type: 'row', fields: [
          { name: 'propertyType', label: 'Inmueble', type: 'text' },
          { name: 'floor', label: 'Piso', type: 'text' },
        ] },
        { type: 'row', fields: [
          { name: 'elevator', label: 'Ascensor', type: 'checkbox' },
          { name: 'narrowStairs', label: 'Escaleras estrechas', type: 'checkbox' },
          { name: 'installation', label: 'Instalación', type: 'checkbox' },
        ] },
        { name: 'carrier', label: 'Transportadora', type: 'text' },
        { name: 'trackingNumber', label: 'Número de guía', type: 'text' },
        { name: 'trackingUrl', label: 'Enlace de rastreo', type: 'text' },
      ],
    },
    {
      name: 'items', label: 'Productos', type: 'array', required: true, minRows: 1,
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products' },
        { name: 'name', label: 'Nombre', type: 'text', required: true },
        { name: 'config', label: 'Configuración', type: 'text' },
        { name: 'unitPrice', label: 'Precio', type: 'number', required: true },
        { name: 'quantity', label: 'Cantidad', type: 'number', required: true, defaultValue: 1 },
      ],
    },
    { type: 'row', fields: [
      { name: 'subtotal', label: 'Subtotal', type: 'number', required: true },
      { name: 'shippingCost', label: 'Envío', type: 'number', defaultValue: 0 },
      { name: 'total', label: 'Total', type: 'number', required: true },
    ] },
    { type: 'row', fields: [
      { name: 'paymentPlan', label: 'Plan de pago', type: 'select', defaultValue: 'anticipo', options: [{ label: 'Pago completo', value: 'completo' }, { label: 'Anticipo', value: 'anticipo' }] },
      { name: 'amountDueNow', label: 'A pagar ahora', type: 'number' },
      { name: 'amountPaid', label: 'Pagado', type: 'number', defaultValue: 0 },
    ] },
    {
      name: 'payments', label: 'Pagos', type: 'array',
      fields: [
        { name: 'provider', type: 'text' },
        { name: 'reference', type: 'text' },
        { name: 'transactionId', type: 'text' },
        { name: 'amount', type: 'number' },
        { name: 'method', type: 'text' },
        { name: 'status', type: 'select', options: ['PENDING', 'APPROVED', 'DECLINED', 'VOIDED', 'ERROR'] },
        { name: 'at', type: 'date' },
      ],
    },
    {
      name: 'updates', label: 'Avances para el cliente', type: 'array',
      admin: { description: 'Cada avance aparece en la página de seguimiento del cliente.' },
      fields: [
        { name: 'note', label: 'Nota', type: 'text', required: true },
        { name: 'photo', label: 'Foto', type: 'upload', relationTo: 'media' },
        { name: 'at', label: 'Fecha', type: 'date', defaultValue: () => new Date().toISOString() },
      ],
    },
    { name: 'utmSource', label: 'Origen de la visita', type: 'text', admin: { position: 'sidebar' } },
  ],
}
