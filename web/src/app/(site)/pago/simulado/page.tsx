import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { paymentProvider } from '@/lib/payments'
import { simulatePayment } from '../../actions'
import { formatCOP } from '@/lib/format'

export const metadata: Metadata = { title: 'Pasarela de prueba', robots: { index: false } }
export const dynamic = 'force-dynamic'

export default async function SimulatedGateway({ searchParams }: { searchParams: Promise<{ ref?: string; t?: string }> }) {
  if (paymentProvider() !== 'simulated') notFound()
  const { ref = '', t = '' } = await searchParams
  const payload = await getPayloadClient()
  const found = await payload.find({ collection: 'orders', where: { accessToken: { equals: t } }, limit: 1, overrideAccess: true })
  const order = found.docs[0]
  if (!order) notFound()
  return (
    <div className="gateway">
      <span className="eyebrow muted">Pasarela de prueba</span>
      <h1 className="h2">Simular el pago</h1>
      <p className="muted" style={{ margin: 0 }}>Esta pantalla reemplaza a la pasarela real en desarrollo y pruebas. En producción el cliente paga en Wompi.</p>
      <div className="gateway__box">
        <div className="gateway__row"><span>Pedido</span><strong>{order.number}</strong></div>
        <div className="gateway__row"><span>Referencia</span><span className="tnum">{ref}</span></div>
        <div className="gateway__row"><span>Monto</span><strong className="tnum">{formatCOP(order.amountDueNow ?? order.total)}</strong></div>
      </div>
      <form action={simulatePayment} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input type="hidden" name="reference" value={ref} />
        <input type="hidden" name="token" value={t} />
        <button className="btn" name="outcome" value="approve" data-testid="approve">Aprobar pago</button>
        <button className="btn btn--ghost" name="outcome" value="decline" data-testid="decline">Rechazar pago</button>
      </form>
    </div>
  )
}
