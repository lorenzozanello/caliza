import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { PageHero } from '@/components/sections/PageHero'
import { Contact } from '@/components/sections/Contact'
import { Zoomable } from '@/components/Zoomable'
import { isProvisional } from '@/components/media'
import { PUBLIC_MATERIAL } from '@/lib/publication'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Materiales · La piedra y sus aliados',
  description: 'Piedra natural, madera, metal y texturas: dónde conviene cada uno y cómo se cuida.',
}

const FAMILY_ORDER = { piedra: 0, madera: 1, metal: 2, textura: 3 } as const
const ROLE = { piedra: 'La protagonista', madera: 'Aliada', metal: 'Aliado', textura: 'Acabados' } as const

export default async function MaterialsPage() {
  const payload = await getPayloadClient()
  const [materials, pages] = await Promise.all([
    payload.find({ collection: 'materials', where: PUBLIC_MATERIAL, sort: 'order', limit: 50, depth: 1 }),
    payload.findGlobal({ slug: 'pages', depth: 1 }),
  ])
  // La piedra siempre va primero.
  const list = [...materials.docs].sort((a, b) => FAMILY_ORDER[a.family] - FAMILY_ORDER[b.family] || (a.order ?? 0) - (b.order ?? 0))
  const heroImage = list.find((m) => m.family === 'piedra')?.image ?? pages.stone?.heroImage
  return (
    <>
      <PageHero image={heroImage} eyebrow="Materiales" title="La piedra" titleItalic="y sus aliados." intro="La piedra natural es la protagonista. La madera, el metal y las texturas la acompañan cuando la pieza lo pide." />

      {list.length === 0 && <section className="wrap caliza-editorial-empty"><h2>Asesoría en selección de materiales.</h2><p>Las fichas, acabados y muestras disponibles se publicarán cuando estén validados por CALIZA. Podemos orientarle desde la aplicación, el uso cotidiano y el mantenimiento.</p></section>}
      <nav className="wrap material-index" aria-label="Materiales">
        {list.map((m) => <a key={m.id} href={`#${m.slug}`} className="chip">{m.name}</a>)}
      </nav>

      {list.map((m, i) => (
        <section key={m.id} id={m.slug ?? undefined} className={`material sec-s1 wrap${i % 2 ? ' material--flip' : ''}`} aria-labelledby={`mat-${m.id}`}>
          <Zoomable media={m.image} group="materiales" className="material__media" data-img-reveal>
            {isProvisional(m.image) && <span className="tag" style={{ left: 14, top: 14 }}>Fotografía provisional</span>}
          </Zoomable>
          <div className="material__text">
            <span className="eyebrow muted" data-reveal>{String(i + 1).padStart(2, '0')} · {ROLE[m.family]}</span>
            <h2 className="h2" id={`mat-${m.id}`} data-reveal>{m.name}</h2>
            {m.description && <p className="material__desc" data-reveal>{m.description}</p>}
            {(m.recommendedUses || m.cautions) && (
              <dl className="material__facts" data-reveal>
                {m.recommendedUses && <><dt>Dónde conviene</dt><dd>{m.recommendedUses}</dd></>}
                {m.cautions && <><dt>Con cuidado en</dt><dd>{m.cautions}</dd></>}
              </dl>
            )}
          </div>
        </section>
      ))}

      <Contact title="¿Qué piedra para tu espacio?" text="Cuéntanos dónde va y cómo se usa. Te recomendamos piedra y acabado con fotos reales de las placas disponibles." intent="orientacion" />
    </>
  )
}
