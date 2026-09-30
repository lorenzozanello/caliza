import type { Metadata } from 'next'
import Link from 'next/link'
import type { Where } from 'payload'
import { getPayloadClient } from '@/lib/payload'
import { ProjectCard, LINE_NAME } from '@/components/sections/ProjectCard'
import { Contact } from '@/components/sections/Contact'

export const metadata: Metadata = {
  title: 'Proyectos',
  description: 'Espacios y piezas en piedra natural diseñados y fabricados por Caliza.',
}

const FILTERS = [{ value: '', label: 'Todos' }, { value: 'stone', label: 'Stone' }, { value: 'design', label: 'Design' }, { value: 'care', label: 'Care' }] as const

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ linea?: string }> }) {
  const { linea = '' } = await searchParams
  const line = linea in LINE_NAME ? (linea as keyof typeof LINE_NAME) : ''
  const payload = await getPayloadClient()
  const where: Where | undefined = line ? { line: { equals: line } } : undefined
  const projects = await payload.find({ collection: 'projects', where, sort: ['-featured', '-year', '-createdAt'], limit: 60, depth: 1 })
  const [first, ...rest] = projects.docs
  return (
    <>
      <section className="page-top wrap projects-head">
        <span className="crumbs"><Link href="/">Inicio</Link> / Proyectos</span>
        <h1 className="display projects-head__title">Proyectos<span className="projects-head__count tnum">{String(projects.totalDocs).padStart(2, '0')}</span></h1>
        <nav className="chips" aria-label="Filtrar por línea">
          {FILTERS.map((f) => (
            <Link key={f.value} href={f.value ? `/proyectos?linea=${f.value}` : '/proyectos'} className="chip" aria-current={line === f.value ? 'page' : undefined} scroll={false}>{f.label}</Link>
          ))}
        </nav>
      </section>

      <section className="wrap" style={{ paddingBottom: 'var(--s2)' }} aria-label="Lista de proyectos">
        {!first && <p className="empty">Aún no hay proyectos en esta línea.</p>}
        {first && <div className="projects-lead"><ProjectCard p={first} size="hero" priority /></div>}
        {rest.length > 0 && <div className="projects-grid projects-grid--stagger">{rest.map((p) => <ProjectCard key={p.id} p={p} />)}</div>}
        {projects.docs.some((p) => p.isExample) && <p className="note" style={{ marginTop: 32 }}>Proyectos de ejemplo · fotografías provisionales.</p>}
      </section>

      <Contact />
    </>
  )
}
