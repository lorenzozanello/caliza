'use client'
import { usePathname } from 'next/navigation'
import { useCart } from './cart/CartProvider'
import { waLink } from '@/lib/whatsapp'
import { WaIcon } from './WaIcon'

export function WhatsAppFloat({ message = 'Hola, quiero recibir asesoría de CALIZA GROUP.' }: { message?: string }) {
  const { whatsapp, source, open } = useCart()
  const pathname = usePathname()
  const contextual = pathname.startsWith('/design')
    ? 'Hola, quisiera asesoría sobre una pieza de CALIZA LIVING DESIGN.'
    : pathname.startsWith('/care')
      ? 'Hola, quisiera orientación para el cuidado de una superficie con CALIZA STONE CARE.'
      : pathname.startsWith('/stone') || pathname.startsWith('/proyectos')
        ? 'Hola, quisiera hablar de un proyecto con CALIZA STONE DESIGN.'
        : message

  // Nunca abrir un canal de atención ficticio en una vista de tienda.
  if (!whatsapp || whatsapp.replace(/\D/g, '') === '570000000000' || pathname.startsWith('/checkout') || pathname.startsWith('/pago')) return null
  return (
    <a
      className={`wa-float${!open ? ' is-visible' : ''}`}
      href={waLink(whatsapp, contextual, source)}
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
