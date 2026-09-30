export const ORDER_STAGES = [
  { value: 'pendiente_pago', label: 'Pendiente de pago', client: 'Esperando tu pago' },
  { value: 'anticipo_pagado', label: 'Anticipo recibido', client: 'Anticipo recibido' },
  { value: 'pagado', label: 'Pago completo recibido', client: 'Pago recibido' },
  { value: 'seleccion_placa', label: 'Selección de placa', client: 'Elegimos tu placa' },
  { value: 'fabricacion', label: 'En fabricación', client: 'En fabricación' },
  { value: 'saldo_pendiente', label: 'Saldo pendiente', client: 'Control de calidad y saldo' },
  { value: 'despachado', label: 'Despachado', client: 'En camino' },
  { value: 'entregado', label: 'Entregado', client: 'Entregado e instalado' },
  { value: 'cancelado', label: 'Cancelado', client: 'Pedido cancelado' },
] as const

export type OrderStage = (typeof ORDER_STAGES)[number]['value']

/** Etapas que ve el cliente, en orden. */
export const CLIENT_TIMELINE: { key: OrderStage[]; label: string; note: string }[] = [
  { key: ['anticipo_pagado', 'pagado'], label: 'Pago recibido', note: 'Confirmamos tu pago.' },
  { key: ['seleccion_placa'], label: 'Elegimos tu placa', note: 'Te enviamos una foto de la placa seleccionada.' },
  { key: ['fabricacion'], label: 'Fabricación', note: 'Corte, pulido y ensamble. Te enviamos fotos del avance.' },
  { key: ['saldo_pendiente'], label: 'Control de calidad y saldo', note: 'Te enviamos el enlace de pago del saldo antes del despacho.' },
  { key: ['despachado'], label: 'Despacho', note: 'Transportadora y número de guía.' },
  { key: ['entregado'], label: 'Entrega e instalación', note: 'Con tu guía de cuidado Caliza Care.' },
]

const ORDER_INDEX: Record<string, number> = {
  pendiente_pago: -1, anticipo_pagado: 1, pagado: 1, seleccion_placa: 1, fabricacion: 2, saldo_pendiente: 3, despachado: 4, entregado: 5, cancelado: -1,
}

export function timelineState(status: string) {
  const current = ORDER_INDEX[status] ?? -1
  return CLIENT_TIMELINE.map((step, i) => ({ ...step, state: i < current ? 'done' : i === current ? (status === 'entregado' ? 'done' : 'now') : 'next' }))
}
