'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from './cart/CartProvider'
import { waLink } from '@/lib/whatsapp'

const NAV = [
  { href: '/stone', label: 'Stone' },
  { href: '/design', label: 'Design' },
  { href: '/care', label: 'Care' },
  { href: '/proyectos', label: 'Proyectos' },
  { href: '/materiales', label: 'Materiales' },
  { href: '/estudio', label: 'Estudio' },
]

/** Páginas que abren con foto a pantalla completa: el encabezado empieza transparente. */
const HERO_PAGES = ['/', '/stone', '/care', '/materiales', '/estudio']

export function SiteHeader() {
  const pathname = usePathname()
  const overlay = HERO_PAGES.includes(pathname) || pathname.startsWith('/proyectos/')
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
          <img className="light" src="/brand/lockup_light.svg" alt="" />
          <img className="dark" src="/brand/lockup_dark.svg" alt="" />
        </Link>
        <nav aria-label="Principal">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={pathname === n.href || pathname.startsWith(n.href + '/') ? 'page' : undefined}>{n.label}</Link>
          ))}
        </nav>
        <div className="actions">
          <button className="icon-btn" aria-label={`Abrir carrito, ${items.length} productos`} onClick={() => setOpen(true)} data-testid="open-cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
            {items.length > 0 && <span className={`cart-count${bumping ? ' bump' : ''}`} data-testid="cart-count">{items.length}</span>}
          </button>
          <Link href="/#contacto" className="btn btn--ghost-light cta">Hablar con el estudio</Link>
          <button className="icon-btn menu-btn" aria-label="Abrir menú" aria-expanded={menu} aria-controls="menu" onClick={() => setMenu(true)}><span /><span /></button>
        </div>
      </header>
      <div className={`mobile-menu${menu ? ' is-open' : ''}`} id="menu" aria-hidden={!menu} inert={!menu}>
        <div className="top">
          <img src="/brand/lockup_light.svg" alt="Caliza" style={{ height: 24, width: 'auto' }} />
          <button className="icon-btn" aria-label="Cerrar menú" style={{ color: 'var(--claro)' }} onClick={() => setMenu(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
          </button>
        </div>
        <ul>
          {NAV.map((n) => <li key={n.href}><Link href={n.href} onClick={() => setMenu(false)} aria-current={pathname === n.href ? 'page' : undefined}>{n.label}</Link></li>)}
        </ul>
        <div className="bottom">
          <a className="btn btn--wa" href={waLink(whatsapp, 'Hola, quiero hablar con el estudio.', source)} target="_blank" rel="noopener">Escribir por WhatsApp</a>
          <span className="small" style={{ color: 'var(--claro-2)' }}>Tradición italiana · Hecho en Colombia</span>
        </div>
      </div>
    </>
  )
}
