import { LeadForm } from '../LeadForm'

export function Contact({ title = 'Cuéntanos tu espacio.', text = 'Una conversación con el estudio, por WhatsApp o videollamada. No necesitas saber qué piedra quieres para empezar.', intent }: { title?: string; text?: string; intent?: 'proyecto' | 'pieza' | 'cuidado' | 'orientacion' }) {
  return (
    <section className="sec-s2 wrap bg-arena" id="contacto">
      <div className="grid" style={{ rowGap: 40, alignItems: 'start' }}>
        <div className="c-1-6">
          <h2 className="closing__title" data-reveal>{title}</h2>
          <p className="muted closing__text" data-reveal>{text}</p>
        </div>
        <div className="c-7-6"><LeadForm defaultIntent={intent} /></div>
      </div>
    </section>
  )
}
