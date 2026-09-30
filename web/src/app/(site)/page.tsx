import Link from 'next/link'
import type { Media, Project } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'
import { ProductCard } from '@/components/ProductCard'
import { LeadForm } from '@/components/LeadForm'
import { isProvisional, mediaAlt, mediaUrl } from '@/components/media'

export const revalidate = 60

export default async function HomePage() {
  const payload = await getPayloadClient()
  const [home, projects, products, materials] = await Promise.all([
    payload.findGlobal({ slug: 'home', depth: 1 }),
    payload.find({ collection: 'projects', where: { featured: { equals: true } }, limit: 1, depth: 1 }),
    payload.find({ collection: 'products', where: { status: { equals: 'publicado' }, line: { in: ['design', 'care'] } }, sort: ['-featured', 'order'], limit: 6, depth: 1 }),
    payload.find({ collection: 'materials', sort: 'order', limit: 8, depth: 1 }),
  ])
  const project = projects.docs[0] as Project | undefined
  const img = (m: Media | number | null | undefined, size: 'thumb' | 'card' | 'hero' = 'hero') => mediaUrl(m, size) ?? ''
  const generations = home.generations?.length ? home.generations : [{ name: 'Primera generación', note: 'Marmolero · Italia' }, { name: 'Segunda generación', note: 'El oficio continúa' }, { name: 'Leonardo Zanello', note: 'Dirección creativa · Colombia' }]

  return (
    <>
      <section className="hero" aria-label="Presentación">
        <div className="hero__media" data-hero-media><img src={img(home.heroImage)} alt={mediaAlt(home.heroImage)} fetchPriority="high" /></div>
        <div className="hero__scrim" />
        {isProvisional(home.heroImage) && <span className="tag">Fotografía provisional</span>}
        <div className="hero__content">
          <div className="hero__title">
            <span className="eyebrow" data-hero-fade>{home.heroEyebrow}</span>
            <h1 className="display">
              <span className="line"><span>{home.heroLine1}</span></span>
              <span className="line"><span>{home.heroLine2}</span></span>
              <span className="line"><span><em>{home.heroLine3}</em></span></span>
            </h1>
          </div>
          <div className="hero__aside" data-hero-fade>
            <p>{home.heroText}</p>
            <div className="ctas">
              <Link href="#proyecto" className="btn btn--light" data-magnetic>Ver proyectos <span className="arrow">→</span></Link>
              <Link href="/design" className="link" style={{ color: 'var(--claro)' }}><span className="u">Explorar piezas</span></Link>
            </div>
          </div>
        </div>
        <div className="scroll-cue" aria-hidden="true"><i />Desliza</div>
      </section>

      <section className="sec-s2 wrap" id="estudio">
        <div className="grid">
          <div className="c-1-4 manifesto__side" data-reveal>
            <img src="/brand/symbol_dark.svg" alt="" style={{ width: 36, height: 'auto' }} />
            <span className="eyebrow muted">El estudio</span>
          </div>
          <div className="c-4-9">
            <p className="manifesto__text" data-words>{home.manifesto}</p>
            <div className="signature" data-reveal><span style={{ width: 40, height: 1, background: 'currentColor' }} />Leonardo Zanello · Dirección creativa</div>
          </div>
        </div>
      </section>

      <section className="wrap" id="lineas" style={{ paddingBottom: 'var(--s2)' }}>
        <div className="lines__head">
          <h2 className="h2" data-reveal>Tres formas de trabajar la piedra.</h2>
          <p className="muted" data-reveal>Transformar el espacio, habitarlo y preservarlo. Puedes empezar por cualquiera.</p>
        </div>
        <div className="lines__row">
          {[
            { href: '#proyecto', cursor: 'Explorar Stone', image: home.stoneImage, line: 'Caliza Stone', n: 'I', name: 'Transformar', desc: 'Cocinas, baños, pisos, muros, piscinas y fachadas en piedra natural, del diseño a la instalación.', cta: 'Iniciar un proyecto' },
            { href: '/design', cursor: 'Ver piezas', image: home.designImage, line: 'Caliza Design', n: 'II', name: 'Habitar', desc: 'Mesas, consolas, lavamanos y objetos donde la piedra se encuentra con la madera y el metal.', cta: 'Ver la colección' },
            { href: '#care', cursor: 'Cuidar', image: home.careImage, line: 'Caliza Care', n: 'III', name: 'Preservar', desc: 'Mantenimiento, protección y restauración de superficies de piedra, para que duren otra generación.', cta: 'Cuidar una superficie' },
          ].map((p) => (
            <Link className="panel" href={p.href} data-cursor={p.cursor} key={p.name}>
              <img src={img(p.image, 'card')} alt={mediaAlt(p.image)} />
              <div className="panel__top"><span>{p.line}</span><span>{p.n}</span></div>
              <div className="panel__body">
                <span className="panel__name">{p.name}</span>
                <div className="panel__desc"><div><p>{p.desc}</p><span className="link"><span className="u">{p.cta}</span><span className="arrow">→</span></span></div></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {project && (
        <section className="project" id="proyecto" aria-label="Proyecto destacado">
          <div className="project__sticky">
            <Link href={`/proyectos/${project.slug}`} className="project__frame" data-project-frame data-cursor="Ver proyecto" aria-label={`Ver el proyecto ${project.title}`}>
              <img src={img(project.cover)} alt={mediaAlt(project.cover)} data-project-img />
            </Link>
            <span className="eyebrow project__label" data-project-fade>Proyecto destacado · {project.line === 'stone' ? 'Stone' : project.line === 'design' ? 'Design' : 'Care'}</span>
            <div className="project__caption" data-project-fade>
              <h2 className="h2">{project.title}</h2>
              <dl className="project__meta">
                {project.city && <><dt>Ciudad</dt><dd>{project.city}{project.isExample ? ' (ejemplo)' : ''}</dd></>}
                {project.space && <><dt>Espacio</dt><dd>{project.space}</dd></>}
                {project.materialsText && <><dt>Materiales</dt><dd>{project.materialsText}</dd></>}
              </dl>
              <Link href={`/proyectos/${project.slug}`} className="link"><span className="u">Ver proyecto</span><span className="arrow">→</span></Link>
            </div>
          </div>
        </section>
      )}

      <section className="collection sec-s2" id="coleccion">
        <div className="collection__head wrap">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span className="eyebrow muted" data-reveal>Caliza Design</span>
            <h2 className="h2" data-reveal>Piezas para habitar.</h2>
          </div>
          <p className="muted" style={{ maxWidth: 380, margin: 0 }} data-reveal>La piedra como protagonista, con madera y metal. Cada pieza se fabrica después de tu elección.</p>
        </div>
        <div data-collection>
          <div className="collection__track" data-track>
            {products.docs.map((p) => <ProductCard key={p.id} p={p} />)}
            <Link className="product-card product-card--custom" href="#contacto">
              <span className="eyebrow" style={{ color: 'var(--claro-2)' }}>A tu medida</span>
              <span className="h3" style={{ fontSize: 'clamp(28px,2.6vw,40px)' }}>¿Buscas una pieza que todavía no existe? La diseñamos contigo.</span>
              <span className="link"><span className="u">Contarnos tu idea</span><span className="arrow">→</span></span>
            </Link>
          </div>
          <div className="collection__progress" aria-hidden="true"><i data-progress /></div>
        </div>
        <div className="wrap" style={{ marginTop: 28 }}><Link href="/design" className="btn btn--ghost">Ver toda la colección <span className="arrow">→</span></Link></div>
      </section>

      <section className="on-dark sec-s2 wrap" aria-label="Nuestra historia">
        <div className="grid" style={{ rowGap: 48 }}>
          <div className="c-1-6" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <span className="eyebrow" style={{ color: 'var(--claro-2)' }} data-reveal>Nuestra historia</span>
            <h2 className="h2" style={{ color: 'var(--claro)' }} data-reveal>Del taller de marmoleros en Italia al estudio en Colombia.</h2>
            <p style={{ margin: 0, maxWidth: 500, color: '#DDD3C6' }} data-reveal>{home.historyText}</p>
          </div>
          <div className="c-7-6">
            <ol className="heritage__list">
              {generations.map((g, i) => (
                <li key={i} data-reveal><span className="heritage__num">{['I', 'II', 'III'][i]}</span><span className="heritage__name">{g.name}</span><span className="heritage__note">{g.note}</span></li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {materials.docs.length > 0 && (
        <section className="sec-s2 wrap" id="materiales">
          <div className="lines__head"><h2 className="h2" data-reveal>La piedra y sus aliados.</h2></div>
          <ul className="materials__list" data-materials>
            {materials.docs.map((m, i) => (
              <li key={m.id}><a href="#materiales" data-mat={i}>
                {mediaUrl(m.image, 'thumb') && <img className="mat-thumb" src={mediaUrl(m.image, 'thumb')!} alt="" />}
                <span className="mname">{m.name}</span><span className="mdesc">{m.description}</span>
                <span className="mrole">{m.family === 'piedra' ? 'La protagonista' : m.family === 'textura' ? 'Acabados' : 'Aliada'}</span>
              </a></li>
            ))}
          </ul>
          <div className="mat-follow" aria-hidden="true" data-follow>
            {materials.docs.map((m) => <img key={m.id} src={mediaUrl(m.image, 'card') ?? ''} alt="" />)}
          </div>
        </section>
      )}

      <section className="sec-s2 wrap bg-papel" aria-label="Cómo trabajamos">
        <div className="grid">
          <div className="c-1-4"><div className="method__sticky"><span className="eyebrow muted">Cómo trabajamos</span><h2 className="h2">Del criterio a la obra.</h2></div></div>
          <div className="c-6-7">
            <div className="method__steps" data-steps>
              <div className="method__rail"><i data-rail /></div>
              {[
                ['01', 'Seleccionar', 'Elegimos cada placa por su veta, su tono y su comportamiento antes de que exista tu proyecto.'],
                ['02', 'Interpretar', 'Leemos tu espacio y la piedra juntos: dónde cortar, cómo casar las vetas, qué acabado pide el uso.'],
                ['03', 'Transformar', 'Fabricamos a la medida, con madera y metal cuando la pieza lo pide, e instalamos.'],
                ['04', 'Cuidar', 'Caliza Care acompaña la vida de cada superficie con mantenimiento y restauración.'],
              ].map(([n, t, d], i) => (
                <div className="step" data-reveal key={n} style={i === 3 ? { paddingBottom: 0 } : undefined}><span className="step__num">{n}</span><h3 className="h3" style={{ fontSize: 'clamp(32px,3.2vw,48px)' }}>{t}</h3><p>{d}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sec-s2 wrap" id="care">
        <div className="grid" style={{ alignItems: 'center', rowGap: 36 }}>
          {home.careSectionImage && (
            <figure className="c-1-6 care__media" style={{ margin: 0 }} data-img-reveal>
              <img src={img(home.careSectionImage, 'card')} alt={mediaAlt(home.careSectionImage)} />
              {isProvisional(home.careSectionImage) && <span className="tag" style={{ left: 16, top: 16 }}>Fotografía provisional</span>}
            </figure>
          )}
          <div className="c-8-5">
            <span className="eyebrow muted" data-reveal>Caliza Care</span>
            <h2 className="h2" style={{ marginTop: 18 }} data-reveal>Lo que creamos también merece cuidado.</h2>
            <ul className="care__list" data-reveal>
              <li><span>Mantenimiento periódico</span><span className="muted">Superficies y pisos</span></li>
              <li><span>Protección y sellado</span><span className="muted">Cocinas y baños</span></li>
              <li><span>Restauración</span><span className="muted">Brillo, manchas, desgaste</span></li>
            </ul>
            <Link className="link" href="#contacto" data-reveal><span className="u">Cuéntanos qué le pasa a tu superficie</span><span className="arrow">→</span></Link>
          </div>
        </div>
      </section>

      <section className="sec-s2 wrap bg-arena" id="contacto">
        <div className="grid" style={{ rowGap: 40, alignItems: 'start' }}>
          <div className="c-1-6">
            <h2 className="closing__title" data-reveal>Cuéntanos tu espacio.</h2>
            <p className="muted" style={{ maxWidth: 460, margin: '24px 0 0' }} data-reveal>Una conversación con el estudio, por WhatsApp o videollamada. No necesitas saber qué piedra quieres para empezar.</p>
          </div>
          <div className="c-7-6"><LeadForm /></div>
        </div>
      </section>
    </>
  )
}
