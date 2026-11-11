import type { Metadata } from 'next'
import { SocialViewer } from '@/components/SocialViewer'

export const metadata: Metadata = {
  title: 'Inspiración · Instagram y TikTok',
  description: 'Explora publicaciones públicas en el visor de inspiración de CALIZA GROUP.',
}

export default function InspirationPage() {
  return (
    <div className="social-page page-top">
      <header className="social-page__intro wrap">
        <span className="eyebrow muted">CALIZA GROUP / Inspiración viva</span>
        <h1>La materia también se comparte.</h1>
        <p>Una ventana a la arquitectura, las piezas y el cuidado. Añade enlaces públicos de Instagram y TikTok para explorarlos en una experiencia editorial.</p>
      </header>
      <div className="wrap"><SocialViewer /></div>
    </div>
  )
}
