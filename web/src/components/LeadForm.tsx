'use client'
import { useState, useTransition } from 'react'
import { createLead } from '@/app/(site)/actions'
import { useCart } from './cart/CartProvider'
import { waLink } from '@/lib/whatsapp'
import { WaIcon } from './WaIcon'

const INTENTS = [
  { value: 'proyecto', label: 'Un proyecto', text: 'un proyecto' },
  { value: 'pieza', label: 'Una pieza', text: 'una pieza' },
  { value: 'cuidado', label: 'Cuidar una superficie', text: 'cuidar una superficie' },
  { value: 'orientacion', label: 'Aún no lo sé', text: 'una idea que aún no sé cómo resolver' },
]

export function LeadForm() {
  const { whatsapp, source } = useCart()
  const [intent, setIntent] = useState('proyecto')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)
  const [pending, start] = useTransition()

  function submit(channel: 'whatsapp' | 'videollamada', form: HTMLFormElement) {
    const fd = new FormData(form)
    const data = { name: String(fd.get('name') || ''), phone: String(fd.get('phone') || ''), city: String(fd.get('city') || ''), message: String(fd.get('message') || ''), intent, channel, utmSource: source }
    const it = INTENTS.find((i) => i.value === intent)!
    const win = channel === 'whatsapp' ? window.open('', '_blank') : null
    start(async () => {
      const res = await createLead(data)
      if (!res.ok) { win?.close(); setErrors(res.fields ?? {}); setMessage({ kind: 'error', text: res.error }); return }
      setErrors({})
      if (channel === 'whatsapp') {
        const href = waLink(whatsapp, `Hola, soy ${data.name}. Quiero empezar con ${it.text}${data.city ? ` en ${data.city}` : ''}.${data.message ? ' ' + data.message : ''}`, source)
        if (win) win.location.href = href; else window.location.href = href
        setMessage({ kind: 'ok', text: 'Listo. Te abrimos WhatsApp con tu mensaje.' })
      } else {
        setMessage({ kind: 'ok', text: 'Recibimos tu solicitud. Te escribimos por WhatsApp para agendar la videollamada.' })
      }
    })
  }

  return (
    <form className="lead-form closing__panel" onSubmit={(e) => { e.preventDefault(); submit('whatsapp', e.currentTarget) }} noValidate data-testid="lead-form">
      <span className="eyebrow muted">Empiezo con</span>
      <div className="chips" role="group" aria-label="¿Con qué empiezas?">
        {INTENTS.map((i) => (
          <button key={i.value} type="button" className="chip" aria-pressed={intent === i.value} onClick={() => setIntent(i.value)}>{i.label}</button>
        ))}
      </div>
      <div className="row">
        <label className="fld-l" htmlFor="lead-name" style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--veta)' }}>Nombre
          <input className="field" id="lead-name" name="name" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'lead-name-e' : undefined} />
          {errors.name && <span className="field-error" id="lead-name-e">{errors.name}</span>}
        </label>
        <label htmlFor="lead-phone" style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--veta)' }}>WhatsApp
          <input className="field" id="lead-phone" name="phone" autoComplete="tel" inputMode="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'lead-phone-e' : undefined} />
          {errors.phone && <span className="field-error" id="lead-phone-e">{errors.phone}</span>}
        </label>
      </div>
      <label htmlFor="lead-city" style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--veta)' }}>Ciudad (opcional)
        <input className="field" id="lead-city" name="city" autoComplete="address-level2" />
      </label>
      <label htmlFor="lead-message" style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--veta)' }}>Cuéntanos en una frase (opcional)
        <input className="field" id="lead-message" name="message" />
      </label>
      {message && <p className={message.kind === 'ok' ? 'success-note' : 'form-error'} role="status" data-testid={message.kind === 'ok' ? 'lead-success' : 'lead-error'}>{message.text}</p>}
      <button type="submit" className="btn btn--wa" disabled={pending} data-magnetic style={{ justifyContent: 'space-between' }}>
        <span style={{ display: 'inline-flex', gap: 10, alignItems: 'center' }}><WaIcon size={18} />Escribir por WhatsApp</span><span className="arrow">→</span>
      </button>
      <button type="button" className="btn btn--ghost" disabled={pending} style={{ justifyContent: 'space-between' }} onClick={(e) => submit('videollamada', e.currentTarget.form!)}>
        <span>Agendar videollamada</span><span className="arrow">→</span>
      </button>
    </form>
  )
}
