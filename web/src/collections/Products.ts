import { revalidateHooks } from '@/lib/revalidate'
import type { CollectionConfig } from 'payload'
import { slugField } from '@/lib/fields'

export const Products: CollectionConfig = {
  hooks: revalidateHooks,
  slug: 'products',
  labels: { singular: 'Producto', plural: 'Productos' },
  admin: {
    useAsTitle: 'name',
    group: 'Catálogo',
    defaultColumns: ['name', 'line', 'saleMode', 'basePrice', 'stock', 'status'],
    listSearchableFields: ['name', 'slug'],
  },
  access: {
    read: ({ req }) => (req.user ? true : { status: { equals: 'publicado' } }),
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Nombre', type: 'text', required: true },
        {
          name: 'status', label: 'Estado', type: 'select', required: true, defaultValue: 'borrador',
          options: [{ label: 'Borrador', value: 'borrador' }, { label: 'Publicado', value: 'publicado' }, { label: 'Archivado', value: 'archivado' }],
        },
      ],
    },
    slugField(),
    {
      type: 'row',
      fields: [
        {
          name: 'line', label: 'Línea', type: 'select', required: true, defaultValue: 'design',
          options: [{ label: 'Caliza Stone', value: 'stone' }, { label: 'Caliza Design', value: 'design' }, { label: 'Caliza Care', value: 'care' }],
        },
        {
          name: 'category', label: 'Tipo', type: 'select', required: true, defaultValue: 'mesa-comedor',
          options: [
            { label: 'Mesa de comedor', value: 'mesa-comedor' },
            { label: 'Mesa de centro', value: 'mesa-centro' },
            { label: 'Mesa auxiliar', value: 'mesa-auxiliar' },
            { label: 'Consola', value: 'consola' },
            { label: 'Lavamanos', value: 'lavamanos' },
            { label: 'Objeto', value: 'objeto' },
            { label: 'Cuidado', value: 'cuidado' },
            { label: 'Proyecto a medida', value: 'proyecto' },
          ],
        },
      ],
    },
    { name: 'shortDescription', label: 'Descripción corta', type: 'textarea', required: true },
    { name: 'materialsText', label: 'Materiales', type: 'text', required: true, admin: { description: 'Piedra primero. Ej.: Piedra natural · roble' } },
    { name: 'images', label: 'Fotos', type: 'array', minRows: 1, fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }] },
    {
      type: 'collapsible', label: 'Venta y precio',
      fields: [
        {
          name: 'saleMode', label: 'Modalidad de venta', type: 'select', required: true, defaultValue: 'pedido',
          options: [
            { label: 'Entrega inmediata', value: 'inmediata' },
            { label: 'Bajo pedido', value: 'pedido' },
            { label: 'Configurable', value: 'configurable' },
            { label: 'Solo cotización', value: 'cotizacion' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'basePrice', label: 'Precio base (COP)', type: 'number', min: 0, admin: { description: 'Se usa si no hay tamaños con precio propio.' } },
            {
              name: 'priceDisplay', label: 'Cómo se muestra el precio', type: 'select', defaultValue: 'desde',
              options: [{ label: 'Precio fijo', value: 'fijo' }, { label: 'Desde', value: 'desde' }, { label: 'Cotizar', value: 'cotizar' }],
            },
            { name: 'depositPercent', label: 'Anticipo (%)', type: 'number', defaultValue: 50, min: 0, max: 100 },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'leadTime', label: 'Plazo de fabricación', type: 'text', defaultValue: '6 a 8 semanas' },
            { name: 'stock', label: 'Unidades disponibles', type: 'number', min: 0, admin: { description: 'Solo para entrega inmediata.' } },
          ],
        },
      ],
    },
    {
      type: 'collapsible', label: 'Opciones configurables',
      fields: [
        {
          name: 'stoneOptions', label: 'Piedras', type: 'array',
          fields: [
            { name: 'label', label: 'Nombre', type: 'text', required: true },
            { name: 'swatch', label: 'Muestra', type: 'upload', relationTo: 'media' },
            { name: 'priceDelta', label: 'Diferencia de precio', type: 'number', defaultValue: 0 },
            { name: 'available', label: 'Disponible', type: 'checkbox', defaultValue: true },
          ],
        },
        {
          name: 'sizeOptions', label: 'Tamaños', type: 'array',
          fields: [
            { name: 'label', label: 'Nombre', type: 'text', required: true },
            { name: 'dimensions', label: 'Medidas', type: 'text' },
            { name: 'price', label: 'Precio (COP)', type: 'number', required: true, min: 0 },
          ],
        },
        {
          name: 'baseOptions', label: 'Bases', type: 'array',
          fields: [
            { name: 'label', label: 'Nombre', type: 'text', required: true },
            { name: 'priceDelta', label: 'Diferencia de precio', type: 'number', defaultValue: 0 },
          ],
        },
      ],
    },
    {
      type: 'collapsible', label: 'Detalles y envío',
      fields: [
        { name: 'details', label: 'Medidas y peso', type: 'textarea' },
        { name: 'care', label: 'Cuidado', type: 'textarea' },
        { name: 'requiresInstallation', label: 'Requiere instalación', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'signed', label: 'Pieza firmada por Leonardo Zanello', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'featured', label: 'Destacado en la home', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'order', label: 'Orden', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'isExample', label: 'Contenido de ejemplo', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'relatedProjects', label: 'Proyectos relacionados', type: 'relationship', relationTo: 'projects', hasMany: true },
  ],
}
