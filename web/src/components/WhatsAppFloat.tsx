'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useCart } from './cart/CartProvider'
import { waLink } from '@/lib/whatsapp'
import { WaIcon } from './WaIcon'

export function WhatsAppFloat({ message = 'Hola, quiero hablar con el estudio.' }: { message?: string }) {
  const { whatsapp, source, open } = useCart()
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [teasing, setTeasing] = useState(false)

  useEffect(() => {
    let contactVisible = false
    let teased = false
    const contact = document.getElementById('contacto')
    const hero = document.querySelector('.hero') as HTMLElement | null
    const update = () => {
      const start = hero ? hero.offsetHeight * 0.7 : 240
      const show = window.scrollY > start && !contactVisible
      setVisible(show)
      if (show && !teased) { teased = true; setTeasing(true); setTimeout(() => setTeasing(false), 3200) }
    }
    const io = contact ? new IntersectionObserver((e) => { contactVisible = e[0].isIntersecting; update() }, { threshold: 0.25 }) : null
    if (contact && io) io.observe(contact)
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => { window.removeEventListener('scroll', update); io?.disconnect() }
  }, [pathname])

  if (pathname.startsWith('/checkout') || pathname.startsWith('/pago')) return null
  return (
    <a
      className={`wa-float${visible && !open ? ' is-visible' : ''}${teasing ? ' is-teasing' : ''}`}
      href={waLink(whatsapp, message, source)}
      target="_blank"
      rel="noopener"
      aria-label="Escribir a Caliza por WhatsApp"
      data-testid="wa-float"
    >
      <span className="wa-float__btn"><WaIcon size={30} color="#FFFFFF" /></span>
      <span className="wa-float__label">Escríbenos por WhatsApp</span>
    </a>
  )
}
