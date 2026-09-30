'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { useCart } from './CartProvider'
import { formatCOP } from '@/lib/format'

export function CartDrawer() {
  const { items, remove, open, setOpen } = useCart()
  const total = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)

  useEffect(() => {
    document.body.classList.toggle('drawer-open', open)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  return (
    <>
      <div className="drawer-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      <aside className="drawer" aria-label="Carrito" aria-hidden={!open} inert={!open}>
        <div className="drawer__head">
          <span className="h3">Tu carrito</span>
          <button className="icon-btn" aria-label="Cerrar carrito" onClick={() => setOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
          </button>
        </div>
        <div className="drawer__items" data-testid="cart-items">
          {items.length === 0 && <p className="muted">Tu carrito está vacío.</p>}
          {items.map((it, i) => (
            <div className="drawer__item" key={i}>
              {it.image ? <img src={it.image} alt="" /> : <span style={{ width: 88, height: 88, background: 'var(--arena)' }} />}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span className="h3" style={{ fontSize: 22 }}>{it.name}</span>
                {it.config && <span className="small muted">{it.config}</span>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <span className="tnum">{formatCOP(it.unitPrice)}{it.quantity > 1 ? ` × ${it.quantity}` : ''}</span>
                  <button className="link" onClick={() => remove(i)} style={{ border: 0, background: 'none', padding: 0, fontSize: 13 }}><span className="u">Quitar</span></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="drawer__foot">
          <div className="drawer__row"><span>Subtotal</span><span className="tnum" data-testid="cart-subtotal">{formatCOP(total)}</span></div>
          <span className="small muted">El envío se calcula según la ciudad y el acceso.</span>
          {items.length > 0 ? (
            <Link className="btn" href="/checkout" onClick={() => setOpen(false)}>Ir a pagar <span className="arrow">→</span></Link>
          ) : (
            <Link className="btn btn--ghost" href="/design" onClick={() => setOpen(false)}>Ver la colección</Link>
          )}
        </div>
      </aside>
    </>
  )
}
