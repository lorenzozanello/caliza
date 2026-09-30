import 'server-only'
import type { Payload } from 'payload'

/** Registra el resultado de un pago y avanza la etapa del pedido. Idempotente por transactionId. */
export async function applyPaymentResult(payload: Payload, input: { reference: string; transactionId: string; status: 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR' | 'PENDING'; amount: number; provider: string; method?: string }) {
  const number = input.reference.replace(/-\d+$/, '')
  const found = await payload.find({ collection: 'orders', where: { number: { equals: number } }, limit: 1, overrideAccess: true })
  const order = found.docs[0]
  if (!order) return { ok: false as const, reason: 'pedido no encontrado' }
  const payments = order.payments ?? []
  if (payments.some((p) => p.transactionId === input.transactionId && p.status === input.status)) return { ok: true as const, order, duplicate: true }

  const nextPayments = [...payments, { provider: input.provider, reference: input.reference, transactionId: input.transactionId, amount: input.amount, method: input.method, status: input.status, at: new Date().toISOString() }]
  let amountPaid = order.amountPaid ?? 0
  let status = order.status
  if (input.status === 'APPROVED') {
    amountPaid += input.amount
    if (order.status === 'pendiente_pago') status = amountPaid >= order.total ? 'pagado' : 'anticipo_pagado'
  }
  // Al confirmarse el primer pago se descuentan las unidades de las piezas de entrega inmediata.
  if (order.status === 'pendiente_pago' && status !== 'pendiente_pago') {
    for (const item of order.items ?? []) {
      const id = typeof item.product === 'object' ? item.product?.id : item.product
      if (!id) continue
      const product = await payload.findByID({ collection: 'products', id, depth: 0, overrideAccess: true }).catch(() => null)
      if (product?.saleMode === 'inmediata') {
        await payload.update({ collection: 'products', id, data: { stock: Math.max(0, (product.stock ?? 0) - (item.quantity ?? 1)) }, overrideAccess: true })
      }
    }
  }
  const updated = await payload.update({ collection: 'orders', id: order.id, data: { payments: nextPayments, amountPaid, status }, overrideAccess: true })
  return { ok: true as const, order: updated }
}
