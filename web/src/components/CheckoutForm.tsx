'use client'
import Link from 'next/link'
import { useMemo, useState, useTransition } from 'react'
import { useCart } from './cart/CartProvider'
import { createOrder } from '@/app/(site)/actions'
import { formatCOP } from '@/lib/format'

const METHODS = [
  { id: 'Tarjeta', sub: 'Crédito o débito' },
  { id: 'PSE', sub: 'Débito bancario' },
  { id: 'Nequi', sub: 'Desde la app' },
  { id: 'Bancolombia', sub: 'Botón de pago' },
]

export function CheckoutForm({ cities, defaultCost }: { cities: { city: string; cost: number }[]; defaultCost: number }) {
  const { items, source } = useCart()
  const [plan, setPlan] = useState<'anticipo' | 'completo'>('anticipo')
  const [method, setMethod] = useState('Tarjeta')
  const [city, setCity] = useState(cities[0]?.city ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const [redirecting, setRedirecting] = useState(false)

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
  const shipping = cities.find((c) => c.city === city)?.cost ?? defaultCost
  const deposit = Math.max(0, ...items.map((i) => i.deposit ?? 50))
  const fullOnly = deposit >= 100
  const total = subtotal + shipping
  const today = plan === 'completo' || fullOnly ? total : Math.round((total * deposit) / 100)
  const known = useMemo(() => cities.some((c) => c.city === city) || defaultCost > 0, [cities, city, defaultCost])

  if (items.length === 0) {
    return (
      <div className="gateway">
        <h1 className="h2">Tu carrito está vacío.</h1>
        <p className="muted">Explora la colección y configura tu pieza.</p>
        <Link href="/design" className="btn">Ver la colección <span className="arrow">→</span></Link>
      </div>
    )
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const s = (k: string) => String(fd.get(k) ?? '')
    start(async () => {
      const res = await createOrder({
        items: items.map((i) => ({ productId: i.productId, selection: i.selection, quantity: i.quantity })),
        customer: { name: s('name'), phone: s('phone'), email: s('email') },
        shipping: { city, address: s('address'), propertyType: s('propertyType'), floor: s('floor'), elevator: fd.get('elevator') === 'on', narrowStairs: fd.get('stairs') === 'on', installation: fd.get('installation') === 'on' },
        plan,
        utmSource: source,
      })
      if (!res.ok) { setErrors(res.fields ?? {}); setError(res.error); window.scrollTo({ top: 0, behavior: 'smooth' }); return }
      // El carrito se vacía al llegar al pedido (ClearCart); vaciarlo aquí mostraría "carrito vacío" antes de salir.
      setRedirecting(true)
      window.location.href = res.redirectUrl
    })
  }

  const field = (id: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label htmlFor={`f-${id}`}>{label}
      <input className="field" id={`f-${id}`} name={id} aria-invalid={Boolean(errors[id])} aria-describedby={errors[id] ? `f-${id}-e` : undefined} {...props} />
      {errors[id] && <span className="field-error" id={`f-${id}-e`}>{errors[id]}</span>}
    </label>
  )

  return (
    <div className="checkout wrap">
      <div className="grid" style={{ rowGap: 24 }}>
        <div className="c-1-7">
          <div className="checkout__steps"><span className="done">✓ Carrito</span><span className="now">Entrega y pago</span><span className="muted">Confirmación</span></div>
          {error && <p className="form-error" role="alert" style={{ marginBottom: 24 }}>{error}</p>}
          <form id="checkout-form" onSubmit={onSubmit} noValidate data-testid="checkout-form">
            <fieldset>
              <legend>Tus datos</legend>
              <div className="fields">
                {field('name', 'Nombre completo', { autoComplete: 'name', required: true })}
                {field('phone', 'WhatsApp', { autoComplete: 'tel', inputMode: 'tel', required: true })}
                {field('email', 'Correo (opcional)', { autoComplete: 'email', type: 'email' })}
              </div>
            </fieldset>
            <fieldset>
              <legend>Entrega e instalación</legend>
              <div className="fields">
                <label htmlFor="f-city">Ciudad
                  <select className="field" id="f-city" value={city} onChange={(e) => setCity(e.target.value)}>
                    {cities.map((c) => <option key={c.city}>{c.city}</option>)}
                    <option value="Otra ciudad">Otra ciudad</option>
                  </select>
                  {errors.city && <span className="field-error">{errors.city}</span>}
                </label>
                {field('address', 'Dirección', { autoComplete: 'street-address', required: true })}
                <label htmlFor="f-propertyType">Tipo de inmueble<select className="field" id="f-propertyType" name="propertyType"><option>Apartamento</option><option>Casa</option><option>Local u oficina</option></select></label>
                {field('floor', 'Piso', { inputMode: 'numeric' })}
              </div>
              <div className="access">
                <strong style={{ fontWeight: 500 }}>Revisemos el acceso antes de despachar</strong>
                <div className="checks">
                  <label htmlFor="f-elevator"><input type="checkbox" id="f-elevator" name="elevator" defaultChecked />Hay ascensor</label>
                  <label htmlFor="f-stairs"><input type="checkbox" id="f-stairs" name="stairs" />Hay escaleras estrechas</label>
                  <label htmlFor="f-installation"><input type="checkbox" id="f-installation" name="installation" defaultChecked />Necesito instalación</label>
                </div>
                <span className="small muted">Si el acceso requiere algo especial, te escribimos antes de cobrarlo.</span>
              </div>
            </fieldset>
            <fieldset>
              <legend>Cómo quieres pagar</legend>
              <div className="choice-grid" role="group" aria-label="Plan de pago">
                <button type="button" className="choice" aria-pressed={plan === 'completo' || fullOnly} onClick={() => setPlan('completo')}><strong>Pago completo</strong><span>{fullOnly ? 'Las piezas de entrega inmediata se pagan completas.' : 'Pagas el total hoy.'}</span></button>
                {!fullOnly && <button type="button" className="choice" aria-pressed={plan === 'anticipo'} onClick={() => setPlan('anticipo')} data-testid="plan-anticipo"><strong>Anticipo {deposit}%</strong><span>{deposit}% hoy y el resto antes del despacho.</span></button>}
              </div>
              <div className="methods" role="group" aria-label="Método de pago">
                {METHODS.map((m) => <button type="button" key={m.id} className="choice" aria-pressed={method === m.id} onClick={() => setMethod(m.id)}><strong>{m.id}</strong><span>{m.sub}</span></button>)}
              </div>
              <p className="small muted" style={{ margin: '14px 0 0' }}>El pago se procesa en la pasarela segura. Caliza no guarda los datos de tu tarjeta.</p>
            </fieldset>
          </form>
        </div>
        <aside className="c-9-4">
          <div className="summary">
            <span className="eyebrow muted">Tu pedido</span>
            {items.map((it, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 14 }}>
                {it.image ? <img src={it.image} alt="" style={{ width: 80, height: 80, objectFit: 'cover', background: '#E9E3D8' }} /> : <span />}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}><span className="h3" style={{ fontSize: 22 }}>{it.name}</span><span className="small muted">{it.config}</span><span className="small tnum">{formatCOP(it.unitPrice)}</span></div>
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 15, borderTop: '1px solid var(--linea)', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span className="tnum">{formatCOP(subtotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Envío e instalación</span><span className="tnum">{known ? formatCOP(shipping) : 'Por confirmar'}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, borderTop: '1px solid var(--linea)', paddingTop: 12 }}><span>Total</span><span className="tnum" data-testid="total">{formatCOP(total)}</span></div>
            </div>
            <div className="summary__today"><span className="small">Hoy pagas</span><span className="v" data-testid="today">{formatCOP(today)}</span></div>
            <button type="submit" form="checkout-form" className={`btn pay-btn${pending || redirecting ? ' is-loading' : ''}`} disabled={pending || redirecting} data-testid="pay">
              <span className="spinner" aria-hidden="true" />{pending || redirecting ? 'Preparando el pago…' : `Pagar ${formatCOP(today)} con ${method}`}
            </button>
            <span className="small muted">Al pagar recibes confirmación y un enlace para seguir tu pedido.</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
