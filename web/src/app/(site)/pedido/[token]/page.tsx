import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient, getSettings } from '@/lib/payload'
import { timelineState, ORDER_STAGES } from '@/lib/orders'
import { formatCOP } from '@/lib/format'
import { waLink } from '@/lib/whatsapp'
import { retryPayment } from '../../actions'
import { mediaUrl } from '@/components/media'
import { WaIcon } from '@/components/WaIcon'

export const metadata: Metadata = { title: 'Tu pedido', robots: { index: false } }
export const dynamic = 'force-dynamic'

export default async function OrderPage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ pago?: string }> }) {
  const { token } = await params
  const { pago } = await searchParams
  if (!token || token.length < 16) notFound()
  const payload = await getPayloadClient()
  const found = await payload.find({ collection: 'orders', where: { accessToken: { equals: token } }, limit: 1, depth: 1, overrideAccess: true })
  const order = found.docs[0]
  if (!order) notFound()
  const settings = await getSettings()
  const pending = order.status === 'pendiente_pago'
  const stage = ORDER_STAGES.find((s) => s.value === order.status)
  const steps = timelineState(order.status)
  const updates = [...(order.updates ?? [])].reverse()

  return (
    <div className="tracking">
      <div className="tracking__main">
        <span className="eyebrow" style={{ color: pending ? 'var(--veta)' : '#2F5D50' }} data-testid="order-stage">{stage?.client}</span>
        <h1 className="h2">{pending ? 'Tu pedido está reservado.' : order.status === 'entregado' ? 'Tu pieza ya está en casa.' : 'Tu pieza empieza hoy.'}</h1>
        <p className="muted" style={{ margin: 0, maxWidth: 540 }}>Pedido <strong style={{ color: 'var(--carbon)' }} data-testid="order-number">{order.number}</strong>. Guarda este enlace: aquí verás cada avance.</p>
        {pending && (
          <div className="form-error" role="status" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span>{pago === 'rechazado' ? 'El pago no se completó. Puedes intentarlo de nuevo con otro método.' : 'Aún no recibimos el pago de este pedido.'}</span>
            <form action={retryPayment}><input type="hidden" name="token" value={token} /><button className="btn">Pagar {formatCOP(order.amountDueNow ?? order.total)}</button></form>
          </div>
        )}
        <ol className="track" data-testid="timeline">
          {steps.map((s) => (
            <li key={s.label} className={s.state === 'done' ? 'done' : s.state === 'now' ? 'now' : ''}>
              <span className="dot" />
              <div><strong style={{ fontWeight: s.state === 'next' ? 400 : 500, color: s.state === 'next' ? 'var(--veta)' : undefined }}>{s.label}</strong>
                <div className="small muted">{s.label === 'Despacho' && order.shipping?.trackingNumber ? `${order.shipping.carrier ?? 'Transportadora'} · guía ${order.shipping.trackingNumber}` : s.note}</div>
                {s.label === 'Despacho' && order.shipping?.trackingUrl && <a className="link" href={order.shipping.trackingUrl} target="_blank" rel="noopener"><span className="u">Rastrear envío</span><span className="arrow">→</span></a>}
              </div>
            </li>
          ))}
        </ol>
        {updates.length > 0 && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h2 className="h3">Avances</h2>
            {updates.map((u, i) => (
              <div key={i} style={{ borderTop: '1px solid var(--linea)', paddingTop: 14 }}>
                <span className="small muted">{u.at ? new Date(u.at).toLocaleDateString('es-CO', { day: 'numeric', month: 'long' }) : ''}</span>
                <p style={{ margin: '4px 0 0' }}>{u.note}</p>
                {mediaUrl(u.photo, 'card') && <img className="update-photo" src={mediaUrl(u.photo, 'card')!} alt="" />}
              </div>
            ))}
          </section>
        )}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a className="btn btn--wa" href={waLink(settings.whatsappNumber || '', `Hola, tengo una pregunta sobre mi pedido ${order.number}.`)} target="_blank" rel="noopener"><WaIcon size={18} />Escribir sobre mi pedido</a>
          <Link className="btn btn--ghost" href="/">Volver a Caliza</Link>
        </div>
      </div>
      <aside className="tracking__aside">
        <div className="summary">
          <span className="eyebrow muted">Resumen</span>
          {order.items.map((it, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}><span className="h3" style={{ fontSize: 22 }}>{it.name}</span><span className="small muted">{it.config}</span><span className="small tnum">{formatCOP(it.unitPrice)}{(it.quantity ?? 1) > 1 ? ` × ${it.quantity}` : ''}</span></div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 15, borderTop: '1px solid var(--linea)', paddingTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total</span><span className="tnum">{formatCOP(order.total)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Pagado</span><span className="tnum" data-testid="amount-paid">{formatCOP(order.amountPaid ?? 0)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}><span>Saldo</span><span className="tnum">{formatCOP(Math.max(0, order.total - (order.amountPaid ?? 0)))}</span></div>
          </div>
          <span className="small muted">Entrega en {order.shipping.city}.</span>
        </div>
      </aside>
    </div>
  )
}
