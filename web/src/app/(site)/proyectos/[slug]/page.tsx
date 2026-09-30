import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { isProvisional, mediaAlt, mediaUrl } from '@/components/media'

export const revalidate = 60
type Params = Promise<{ slug: string }>

async function getProject(slug: string) {
  const payload = await getPayloadClient()
  const r = await payload.find({ collection: 'projects', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return r.docs[0]
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await getProject((await params).slug)
  return p ? { title: p.title, description: p.challenge ?? undefined } : {}
}

export default async function ProjectPage({ params }: { params: Params }) {
  const p = await getProject((await params).slug)
  if (!p) notFound()
  return (
    <>
      <section className="project-hero">
        <img src={mediaUrl(p.cover, 'hero') ?? ''} alt={mediaAlt(p.cover)} />
        {isProvisional(p.cover) && <span className="tag" style={{ left: 'var(--gutter)', top: 100 }}>Fotografía provisional</span>}
        <div className="project-hero__text">
          <span className="eyebrow">Proyecto · {p.line === 'stone' ? 'Caliza Stone' : p.line === 'design' ? 'Caliza Design' : 'Caliza Care'}</span>
          <h1 className="display" style={{ color: 'var(--claro)' }}>{p.title}</h1>
        </div>
      </section>
      <section className="sec-s1 wrap">
        <div className="grid" style={{ rowGap: 32 }}>
          <dl className="c-1-4 project-facts">
            {p.city && <><dt className="muted">Ciudad</dt><dd>{p.city}{p.isExample ? ' (ejemplo)' : ''}</dd></>}
            {p.year && <><dt className="muted">Año</dt><dd>{p.year}</dd></>}
            {p.space && <><dt className="muted">Espacio</dt><dd>{p.space}</dd></>}
            {p.materialsText && <><dt className="muted">Materiales</dt><dd>{p.materialsText}</dd></>}
          </dl>
          <div className="c-6-7" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {p.challenge && <div><h2 className="h3">El reto</h2><p className="muted">{p.challenge}</p></div>}
            {p.solution && <div><h2 className="h3">La solución</h2><p className="muted">{p.solution}</p></div>}
          </div>
        </div>
      </section>
      {(p.gallery?.length ?? 0) > 0 && (
        <section className="wrap" style={{ paddingBottom: 'var(--s1)' }}>
          <div className="project-gallery">{p.gallery!.map((g, i) => <img key={i} src={mediaUrl(g.image, 'card') ?? ''} alt={mediaAlt(g.image)} loading="lazy" />)}</div>
        </section>
      )}
      <section className="sec-s1 wrap bg-arena">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <h2 className="h2">¿Tienes un proyecto similar?</h2>
          <Link className="btn" href="/#contacto">Hablar con el estudio <span className="arrow">→</span></Link>
        </div>
      </section>
    </>
  )
}
