const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

/** $ 8.900.000 */
export const formatCOP = (v: number) => cop.format(Math.round(v)).replace(/ /g, ' ')

export const SALE_MODE_LABEL: Record<string, string> = {
  inmediata: 'Entrega inmediata',
  pedido: 'Bajo pedido',
  configurable: 'Configurable',
  cotizacion: 'Pieza por cotización',
}

export const LINE_LABEL: Record<string, string> = { stone: 'Caliza Stone', design: 'Caliza Design', care: 'Caliza Care' }
