import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { mediaUrl } from '@/components/media'
import { PageHero } from '@/components/sections/PageHero'
import { Method } from '@/components/sections/Method'
import { Contact } from '@/components/sections/Contact'
import { ProjectCard } from '@/components/sections/ProjectCard'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Stone · Proyectos en piedra natural',
  description: 'Cocinas, baños, pisos, muros, piscinas y fachadas en piedra natural, del diseño a la instalación.',
}

export default async function StonePage() {
  const payload = await getPayloadClient()
  const [pages, home, projects] = await Promise.all([
    payload.findGlobal({ slug: 'pages', depth: 1 }),
    payload.findGlobal({ slug: 'home', depth: 1 }),
    payload.find({ collection: 'projects', where: { line: { equals: 'stone' } }, sort: ['-featured', '-year'], limit: 4, depth: 1 }),
  ])
  const s = pages.stone ?? {}
  const spaces = s.spaces ?? []
  return (
    <>
      <PageHero image={s.heroImage || home.stoneImage} eyebrow={s.eyebrow} title={s.title} titleItalic={s.titleItalic} intro={s.intro}>
        <div className="ctas"><Link href="#contacto" className="btn btn--light" data-magnetic>Iniciar un proyecto <span className="arrow">→</span></Link></div>
      </PageHero>

      {s.manifesto && (
        <section className="sec-s2 wrap">
          <div className="grid">
            <div className="c-1-4 manifesto__side" data-reveal><span className="eyebrow muted">Caliza Stone</span></div>
            <p className="c-4-9 manifesto__text" data-words>{s.manifesto}</p>
          </div>
        </section>
      )}

      {spaces.length > 0 && (
        <section className="wrap" style={{ paddingBottom: 'var(--s2)' }} aria-label="Qué transformamos">
          <div className="lines__head"><h2 className="h2" data-reveal>Qué transformamos.</h2><p className="muted" data-reveal>Cada superficie pide una piedra, un corte y un acabado distintos.</p></div>
          <ul className="materials__list" data-materials>
            {spaces.map((sp, i) => (
              <li key={sp.id ?? sp.title}><a href="#contacto" data-mat={i}>
                {mediaUrl(sp.image, 'thumb') && <img className="mat-thumb" src={mediaUrl(sp.image, 'thumb')!} alt="" />}
                <span className="mname">{sp.title}</span><span className="mdesc">{sp.text}</span><span className="mrole">{String(i + 1).padStart(2, '0')}</span>
              </a></li>
            ))}
          </ul>
          <div className="mat-follow" aria-hidden="true" data-follow>
            {spaces.map((sp, i) => <img key={i} src={mediaUrl(sp.image, 'card') ?? ''} alt="" />)}
          </div>
        </section>
      )}

      <Method />

      {projects.docs.length > 0 && (
        <section className="sec-s2 wrap" aria-label="Proyectos Stone">
          <div className="lines__head"><h2 className="h2" data-reveal>Proyectos.</h2><Link href="/proyectos?linea=stone" className="link"><span className="u">Ver todos los proyectos</span><span className="arrow">→</span></Link></div>
          <div className="projects-grid">{projects.docs.map((p, i) => <ProjectCard key={p.id} p={p} size={i === 0 ? 'hero' : 'card'} />)}</div>
        </section>
      )}

      <Contact title="Empecemos por tu espacio." text="Cuéntanos qué quieres transformar. Con fotos y medidas aproximadas te proponemos piedras, acabados y un rango de inversión." intent="proyecto" />
    </>
  )
}
