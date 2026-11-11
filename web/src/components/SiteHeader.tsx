'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from './cart/CartProvider'
import { waLink } from '@/lib/whatsapp'
import { BrandMark } from './BrandMark'

const NAV = [
  { href: '/stone', label: 'Stone Design' },
  { href: '/design', label: 'Living Design' },
  { href: '/care', label: 'Stone Care' },
  { href: '/proyectos', label: 'Proyectos' },
  { href: '/materiales', label: 'Materiales' },
  { href: '/inspiracion', label: 'Inspiración' },
]

/** La identidad aprobada utiliza un encabezado claro también sobre el hero. */
const HERO_PAGES: string[] = []

export function SiteHeader({ shoppingEnabled = false }: { shoppingEnabled?: boolean }) {
  const pathname = usePathname()
  const overlay = HERO_PAGES.includes(pathname)
  const { items, setOpen, whatsapp, source, bump } = useCart()
  const [solid, setSolid] = useState(!overlay)
  const [hidden, setHidden] = useState(false)
  const [menu, setMenu] = useState(false)
  const [bumping, setBumping] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const hero = document.querySelector('.hero, .project-hero') as HTMLElement | null
      setSolid(!overlay || y > (hero ? hero.offsetHeight - 90 : 10))
      if (y > 700 && y > last + 2) setHidden(true)
      if (y < last - 2) setHidden(false)
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overlay, pathname])

  useEffect(() => { setMenu(false) }, [pathname])
  useEffect(() => {
    if (!bump) return
    setBumping(true)
    const t = setTimeout(() => setBumping(false), 600)
    return () => clearTimeout(t)
  }, [bump])

  const cls = ['site-header', solid ? 'is-solid' : '', hidden && !menu ? 'is-hidden' : ''].join(' ')
  return (
    <>
      <header className={cls}>
        <Link href="/" className="logo" aria-label="Caliza, inicio">
          <BrandMark decorative width={105} />
        </Link>
        <nav aria-label="Principal">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={pathname === n.href || pathname.startsWith(n.href + '/') ? 'page' : undefined}>{n.label}</Link>
          ))}
        </nav>
        <div className="actions">
          {shoppingEnabled && <button className="icon-btn" aria-label={`Abrir carrito, ${items.length} productos`} onClick={() => setOpen(true)} data-testid="open-cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
            {items.length > 0 && <span className={`cart-count${bumping ? ' bump' : ''}`} data-testid="cart-count">{items.length}</span>}
          </button>}
          <Link href="/#contacto" className="btn btn--ghost-light cta">Iniciar proyecto <span aria-hidden="true">→</span></Link>
          <button className="icon-btn menu-btn" aria-label="Abrir menú" aria-expanded={menu} aria-controls="menu" onClick={() => setMenu(true)}><span /><span /></button>
        </div>
      </header>
      <div className={`mobile-menu${menu ? ' is-open' : ''}`} id="menu" aria-hidden={!menu} inert={!menu}>
        <div className="top">
          <BrandMark variant="inverse" width={95} />
          <button className="icon-btn" aria-label="Cerrar menú" style={{ color: 'var(--claro)' }} onClick={() => setMenu(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
          </button>
        </div>
        <ul>
          {NAV.map((n) => <li key={n.href}><Link href={n.href} onClick={() => setMenu(false)} aria-current={pathname === n.href ? 'page' : undefined}>{n.label}</Link></li>)}
        </ul>
        <div className="bottom">
          {whatsapp && whatsapp.replace(/\D/g, '') !== '570000000000'
            ? <a className="btn btn--wa" href={waLink(whatsapp, 'Hola, quiero hablar con el estudio.', source)} target="_blank" rel="noopener">Escribir por WhatsApp</a>
            : <Link className="btn btn--ghost" href="/#contacto" onClick={() => setMenu(false)}>Iniciar proyecto</Link>}
          <span className="small" style={{ color: 'var(--claro-2)' }}>Crear. Habitar. Preservar. · Colombia al mundo</span>
        </div>
      </div>
    </>
  )
}
