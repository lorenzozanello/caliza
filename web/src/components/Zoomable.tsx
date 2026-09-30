import type { Media } from '@/payload-types'
import { mediaAlt, mediaUrl } from './media'

/** Imagen ampliable: abre el visor (Lightbox) con la versión grande y zoom sobre la veta. */
export function Zoomable({ media, size = 'card', group, className, imgClassName, eager = false, children, ...rest }: {
  media: Media | number | null | undefined; size?: 'card' | 'hero'; group: string; className?: string; imgClassName?: string; eager?: boolean; children?: React.ReactNode
} & React.HTMLAttributes<HTMLElement>) {
  const src = mediaUrl(media, size)
  if (!src) return null
  const alt = mediaAlt(media)
  return (
    <figure className={className} {...rest}>
      <button type="button" className="zoom-trigger" data-zoom={mediaUrl(media, 'hero') ?? src} data-zoom-group={group} data-zoom-alt={alt} data-cursor="Ampliar" aria-label={`Ampliar foto${alt ? `: ${alt}` : ''}`}>
        <img className={imgClassName} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} />
      </button>
      {children}
    </figure>
  )
}
