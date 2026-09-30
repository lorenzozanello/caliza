'use client'
import { useState } from 'react'
import { useCart } from './cart/CartProvider'
import { waLink } from '@/lib/whatsapp'
import { WaIcon } from './WaIcon'

/** Diagnóstico rápido: el cliente marca qué le pasa a su superficie y abre WhatsApp con el mensaje escrito. */
export function CareSymptoms({ symptoms }: { symptoms: string[] }) {
  const { whatsapp, source } = useCart()
  const [picked, setPicked] = useState<string[]>([])
  const toggle = (s: string) => setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))
  const list = picked.map((s) => s.charAt(0).toLowerCase() + s.slice(1))
  const message = picked.length
    ? `Hola, mi superficie en piedra ${list.length > 1 ? list.slice(0, -1).join(', ') + ' y ' + list[list.length - 1] : list[0]}. Te envío fotos.`
    : 'Hola, quiero cuidar una superficie en piedra. Te envío fotos.'
  return (
    <div className="symptoms">
      <div className="chips" role="group" aria-label="Qué le pasa a tu superficie">
        {symptoms.map((s) => (
          <button key={s} type="button" className="chip" aria-pressed={picked.includes(s)} onClick={() => toggle(s)}>{s}</button>
        ))}
      </div>
      <p className="symptoms__preview" aria-live="polite" data-testid="care-message">“{message}”</p>
      <a className="btn btn--wa" href={waLink(whatsapp, message, source)} target="_blank" rel="noopener" data-testid="care-wa" data-magnetic>
        <WaIcon size={18} />Enviar fotos por WhatsApp
      </a>
    </div>
  )
}
