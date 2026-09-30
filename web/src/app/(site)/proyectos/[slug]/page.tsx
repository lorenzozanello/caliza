import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { isProvisional, mediaAlt, mediaUrl } from '@/components/media'
import { PageHero } from '@/components/sections/PageHero'
import { Contact } from '@/components/sections/Contact'
import { LINE_NAME } from '@/components/sections/ProjectCard'
import { Zoomable } from '@/components/Zoomable'

export const revalidate = 60
type Params = Promise<{ slug: string }>

async function getProject(slug: string) {
  const payload = await getPayloadClient()
  const r = await payload.find({ collection: 'projects', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return r.docs[0]
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await getProject((await params).slug)
  return p ? { title: p.title, description: p.challenge ?? undefined, openGraph: { images: mediaUrl(p.cover, 'card') ? [mediaUrl(p.cover, 'card')!] : undefined } } : {}
}

export default async function ProjectPage({ params }: { params: Params }) {
  const p = await getProject((await params).slug)
  if (!p) notFound()
  const payload = await getPayloadClient()
  const all = await payload.find({ collection: 'projects', sort: ['-featured', '-year', '-createdAt'], limit: 100, depth: 1 })
  const at = all.docs.findIndex((x) => x.id === p.id)
  const next = all.docs.length > 1 ? all.docs[(at + 1) % all.docs.length] : null
  const gallery = (p.gallery ?? []).map((g) => g.image)
  const [wide, ...grid] = gallery

  const facts = [
    ['Línea', `Caliza ${LINE_NAME[p.line]}`],
    ['Ciudad', p.city ? `${p.city}${p.isExample ? ' (ejemplo)' : ''}` : null],
    ['Año', p.year ? String(p.year) : null],
    ['Espacio', p.space],
    ['Materiales', p.materialsText],
  ].filter((f): f is [string, string] => Boolean(f[1]))

  return (
    <>
      <PageHero image={p.cover} eyebrow={`Proyecto · Caliza ${LINE_NAME[p.line]}`} title={p.title} />

      <section className="sec-s1 wrap">
        <dl className="case-facts" data-reveal>
          {facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
      </section>

      {p.challenge && (
        <section className="wrap" style={{ paddingBottom: 'var(--s2)' }}>
          <div className="grid">
            <div className="c-1-4 manifesto__side" data-reveal><span className="eyebrow muted">El reto</span></div>
            <p className="c-4-9 manifesto__text">{p.challenge}</p>
          </div>
        </section>
      )}

      {wide && (
        <Zoomable media={wide} size="hero" eager group="proyecto" className="case-wide" data-img-reveal>
          {isProvisional(wide) && <span className="tag" style={{ left: 'var(--gutter)', top: 16 }}>Fotografía provisional</span>}
        </Zoomable>
      )}

      {p.solution && (
        <section className="sec-s2 wrap">
          <div className="grid" style={{ rowGap: 24 }}>
            <div className="c-1-4 manifesto__side" data-reveal><span className="eyebrow muted">La solución</span></div>
            <p className="c-5-8 case-solution" data-reveal>{p.solution}</p>
          </div>
        </section>
      )}

      {grid.length > 0 && (
        <section className="wrap" style={{ paddingBottom: 'var(--s2)' }} aria-label="Galería">
          <div className="case-gallery">
            {grid.map((g, i) => <Zoomable key={i} media={g} group="proyecto" className="case-gallery__item" data-img-reveal />)}
          </div>
        </section>
      )}

      {next && (
        <Link href={`/proyectos/${next.slug}`} className="next-project on-dark" data-cursor="Siguiente">
          {mediaUrl(next.cover, 'hero') && <img src={mediaUrl(next.cover, 'hero')!} alt="" />}
          <span className="eyebrow">Siguiente proyecto</span>
          <span className="display next-project__title">{next.title}</span>
          <span className="link"><span className="u">Ver proyecto</span><span className="arrow">→</span></span>
        </Link>
      )}

      <Contact title="¿Tienes un proyecto similar?" intent="proyecto" />
    </>
  )
}
