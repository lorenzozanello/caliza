'use client'
import { useEffect, useLayoutEffect, useRef, useState, useTransition } from 'react'
import gsap from 'gsap'
import { useCart } from './cart/CartProvider'
import { describeSelection, unitPrice, type Selection } from '@/lib/pricing'
import { formatCOP } from '@/lib/format'
import { waLink } from '@/lib/whatsapp'
import { shippingQuote } from '@/app/(site)/actions'
import { WaIcon } from './WaIcon'

type Opt = { label: string; priceDelta: number; available?: boolean }
type ConfigProduct = {
  id: number; slug: string; name: string; saleMode: string; priceDisplay: string; basePrice: number; depositPercent: number
  leadTime: string; stock: number; image: string | null
  stoneOptions: Opt[]; sizeOptions: { label: string; dimensions: string; price: number }[]; baseOptions: Opt[]
}

function Segmented({ label, options, value, onChange, testid }: { label: string; options: string[]; value: number; onChange: (i: number) => void; testid: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const thumb = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    const place = () => {
      const on = ref.current?.querySelectorAll('button')[value] as HTMLElement | undefined
      if (on && thumb.current) { thumb.current.style.width = on.offsetWidth + 'px'; thumb.current.style.transform = `translateX(${on.offsetLeft}px)` }
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [value])
  return (
    <div className="segmented" role="group" aria-label={label} ref={ref} data-testid={testid}>
      <span className="segmented__thumb" ref={thumb} aria-hidden="true" />
      {options.map((o, i) => <button type="button" key={o} aria-pressed={i === value} onClick={() => onChange(i)}>{o}</button>)}
    </div>
  )
}

export function ProductConfigurator({ product: p, swatches }: { product: ConfigProduct; swatches: { label: string; swatch: string | null; detail: string | null }[] }) {
  const { add, setOpen, whatsapp, source } = useCart()
  const firstAvailable = Math.max(0, p.stoneOptions.findIndex((s) => s.available !== false))
  const [sel, setSel] = useState<Selection>({ stone: firstAvailable, size: p.sizeOptions.length > 1 ? 1 : 0, base: 0 })
  const [done, setDone] = useState(false)
  const [city, setCity] = useState('')
  const [cityMsg, setCityMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [, start] = useTransition()
  const priceRef = useRef<HTMLSpanElement>(null)
  const halfRef = useRef<HTMLElement>(null)
  const prev = useRef<number | null>(null)
  const price = unitPrice(p, sel)
  const quote = p.saleMode === 'cotizacion'
  const soldOut = p.saleMode === 'inmediata' && p.stock < 1

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const from = prev.current ?? price
    prev.current = price
    if (!priceRef.current || !halfRef.current) return
    if (reduce || from === price) { priceRef.current.textContent = formatCOP(price); halfRef.current.textContent = formatCOP((price * p.depositPercent) / 100); return }
    const o = { v: from }
    const tw = gsap.to(o, { v: price, duration: 0.9, ease: 'power3.out', onUpdate: () => {
      if (priceRef.current) priceRef.current.textContent = formatCOP(o.v)
      if (halfRef.current) halfRef.current.textContent = formatCOP((o.v * p.depositPercent) / 100)
    } })
    return () => { tw.kill() }
  }, [price, p.depositPercent])

  useEffect(() => {
    const img = document.querySelector('[data-stone-detail]') as HTMLImageElement | null
    const src = swatches[sel.stone ?? 0]?.detail
    if (!img || !src || img.getAttribute('src') === src) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { img.src = src; return }
    gsap.to(img, { opacity: 0, scale: 1.04, duration: 0.25, ease: 'power2.in', onComplete: () => {
      img.src = src
      gsap.fromTo(img, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' })
    } })
  }, [sel.stone, swatches])

  useEffect(() => {
    if (city.trim().length < 3) { setCityMsg(null); return }
    const t = setTimeout(() => start(async () => {
      const q = await shippingQuote(city)
      setCityMsg(q.known ? { ok: true, text: `Envío con instalación a ${city.trim()}: ${q.cost ? formatCOP(q.cost) : 'por confirmar'} · según acceso` } : { ok: false, text: 'Te confirmamos opciones de envío por WhatsApp' })
    }), 400)
    return () => clearTimeout(t)
  }, [city])

  const config = describeSelection(p, sel)
  const waHref = waLink(whatsapp, quote ? `Hola, quiero cotizar la ${p.name}.` : `Hola, me interesa la ${p.name}${config ? ` en ${config}` : ''}.`, source)

  function addToCart() {
    add({ productId: p.id, slug: p.slug, name: p.name, image: p.image, selection: sel, config, unitPrice: price, quantity: 1, deposit: p.saleMode === 'inmediata' ? 100 : p.depositPercent })
    setDone(true)
    setTimeout(() => setOpen(true), 650)
    setTimeout(() => setDone(false), 2400)
  }

  return (
    <>
      {!quote && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="price"><span className="price__value" ref={priceRef} data-testid="price">{formatCOP(price)}</span><span className="small muted">IVA incluido</span></div>
          {p.saleMode !== 'inmediata' && p.depositPercent < 100 && (
            <span className="small muted">O paga <strong ref={halfRef} style={{ color: 'var(--carbon)' }}>{formatCOP((price * p.depositPercent) / 100)}</strong> hoy y el resto antes del despacho.</span>
          )}
          {(p.saleMode === 'inmediata' || p.depositPercent >= 100) && <strong ref={halfRef} hidden />}
        </div>
      )}

      {p.stoneOptions.length > 0 && (
        <div className="opt-group">
          <div className="opt-group__head"><span style={{ fontWeight: 500 }}>Piedra</span><span className="muted" data-testid="stone-name">{p.stoneOptions[sel.stone ?? 0]?.label}</span></div>
          <div className="swatches" role="group" aria-label="Piedra">
            {p.stoneOptions.map((s, i) => (
              <button key={s.label} type="button" className="swatch" aria-pressed={i === sel.stone} aria-label={s.available === false ? `${s.label}, agotada` : s.label} disabled={s.available === false} onClick={() => setSel({ ...sel, stone: i })} style={s.available === false ? { opacity: 0.35 } : undefined}>
                {swatches[i]?.swatch ? <img src={swatches[i].swatch!} alt="" /> : <span style={{ display: 'block', width: '100%', height: '100%', background: 'var(--arena)' }} />}
              </button>
            ))}
          </div>
          <span className="small muted">Cada placa es única: la veta de tu pieza será distinta a la de la foto.</span>
        </div>
      )}

      {p.sizeOptions.length > 1 && (
        <div className="opt-group">
          <div className="opt-group__head"><span style={{ fontWeight: 500 }}>Tamaño</span><span className="muted tnum">{p.sizeOptions[sel.size ?? 0]?.dimensions}</span></div>
          <Segmented label="Tamaño" testid="size" options={p.sizeOptions.map((s) => s.label)} value={sel.size ?? 0} onChange={(i) => setSel({ ...sel, size: i })} />
        </div>
      )}
      {p.baseOptions.length > 1 && (
        <div className="opt-group">
          <div className="opt-group__head"><span style={{ fontWeight: 500 }}>Base</span></div>
          <Segmented label="Base" testid="base" options={p.baseOptions.map((s) => s.label)} value={sel.base ?? 0} onChange={(i) => setSel({ ...sel, base: i })} />
        </div>
      )}

      {p.saleMode === 'inmediata'
        ? <div className="lead"><span>Disponibilidad</span><strong style={{ fontWeight: 500 }}>{soldOut ? 'Agotada' : `${p.stock} ${p.stock === 1 ? 'unidad lista' : 'unidades listas'} para despacho`}</strong></div>
        : p.leadTime && <div className="lead"><span>Fabricación estimada</span><strong style={{ fontWeight: 500 }}>{p.leadTime}</strong></div>}

      <div className="pdp__ctas">
        {quote ? (
          <a className="btn btn--wa" href={waHref} target="_blank" rel="noopener"><WaIcon size={18} />Cotizar por WhatsApp</a>
        ) : (
          <>
            <button type="button" className={`btn add-btn${done ? ' is-done' : ''}`} onClick={addToCart} disabled={soldOut} data-testid="add-to-cart">
              <span className="label">{soldOut ? 'Agotada' : 'Agregar al carrito'}</span><span className="done" aria-hidden="true">Agregada ✓</span>
            </button>
            <a className="btn btn--ghost" href={waHref} target="_blank" rel="noopener" data-testid="wa-config"><WaIcon size={18} /><span>{soldOut ? 'Avísame cuando vuelva' : 'Consultar esta configuración'}</span></a>
          </>
        )}
      </div>

      <div className="ship">
        <label htmlFor="city">¿A qué ciudad la enviamos?</label>
        <input className="field" id="city" placeholder="Ej.: Barranquilla" autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} />
        <span className="ship__ok" aria-live="polite" style={{ color: cityMsg && !cityMsg.ok ? 'var(--veta)' : undefined }}>{cityMsg?.text}</span>
      </div>
    </>
  )
}
