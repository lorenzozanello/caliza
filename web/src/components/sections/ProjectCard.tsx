import Link from 'next/link'
import type { Project } from '@/payload-types'
import { isProvisional, mediaAlt, mediaUrl } from '../media'

export const LINE_NAME = { stone: 'Stone', design: 'Design', care: 'Care' } as const

export function ProjectCard({ p, size = 'card', priority = false }: { p: Project; size?: 'card' | 'hero'; priority?: boolean }) {
  return (
    <Link href={`/proyectos/${p.slug}`} className="project-card" data-cursor="Ver proyecto">
      <figure className="project-card__media" data-img-reveal>
        <img src={mediaUrl(p.cover, size) ?? ''} alt={mediaAlt(p.cover)} loading={priority ? 'eager' : 'lazy'} />
        {isProvisional(p.cover) && <span className="tag" style={{ left: 14, top: 14 }}>Fotografía provisional</span>}
      </figure>
      <div className="project-card__row">
        <span className="h3">{p.title}</span>
        <span className="eyebrow muted">{LINE_NAME[p.line]}</span>
      </div>
      <span className="small muted">{[p.space, p.city ? `${p.city}${p.isExample ? ' (ejemplo)' : ''}` : null].filter(Boolean).join(' · ')}</span>
    </Link>
  )
}
