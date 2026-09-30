import type { Media } from '@/payload-types'
import { isProvisional, mediaAlt, mediaUrl } from '../media'

type Props = {
  image?: Media | number | null
  eyebrow?: string | null
  title?: string | null
  titleItalic?: string | null
  intro?: string | null
  children?: React.ReactNode
}

/** Portada de página interior: misma coreografía que la home (máscara por línea, parallax), más baja. */
export function PageHero({ image, eyebrow, title, titleItalic, intro, children }: Props) {
  const src = mediaUrl(image, 'hero')
  return (
    <section className="hero hero--page" aria-label={eyebrow ?? undefined}>
      {src && <div className="hero__media" data-hero-media><img src={src} alt={mediaAlt(image)} fetchPriority="high" /></div>}
      <div className="hero__scrim" />
      {isProvisional(image) && <span className="tag">Fotografía provisional</span>}
      <div className="hero__content">
        <div className="hero__title">
          {eyebrow && <span className="eyebrow" data-hero-fade>{eyebrow}</span>}
          <h1 className="display">
            {title && <span className="line"><span>{title}</span></span>}
            {titleItalic && <span className="line"><span><em>{titleItalic}</em></span></span>}
          </h1>
        </div>
        <div className="hero__aside" data-hero-fade>
          {intro && <p>{intro}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}
