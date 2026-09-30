import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { PageHero } from '@/components/sections/PageHero'
import { Method } from '@/components/sections/Method'
import { Contact } from '@/components/sections/Contact'
import { CareSymptoms } from '@/components/CareSymptoms'
import { ProductCard } from '@/components/ProductCard'
import { isProvisional, mediaAlt, mediaUrl } from '@/components/media'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Care · Mantenimiento y restauración de piedra',
  description: 'Mantenimiento, protección y restauración de superficies en piedra natural.',
}

export default async function CarePage() {
  const payload = await getPayloadClient()
  const [pages, home, products] = await Promise.all([
    payload.findGlobal({ slug: 'pages', depth: 1 }),
    payload.findGlobal({ slug: 'home', depth: 1 }),
    payload.find({ collection: 'products', where: { status: { equals: 'publicado' }, line: { equals: 'care' } }, sort: 'order', limit: 6, depth: 1 }),
  ])
  const c = pages.care ?? {}
  const side = home.careSectionImage || home.careImage
  return (
    <>
      <PageHero image={c.heroImage || home.careImage} eyebrow={c.eyebrow} title={c.title} titleItalic={c.titleItalic} intro={c.intro}>
        <div className="ctas"><Link href="#diagnostico" className="btn btn--light" data-magnetic>Contarnos qué le pasa <span className="arrow">→</span></Link></div>
      </PageHero>

      <section className="sec-s2 wrap" aria-label="Servicios">
        <div className="grid" style={{ rowGap: 40, alignItems: 'start' }}>
          <div className="c-1-4"><span className="eyebrow muted" data-reveal>Servicios</span></div>
          <ol className="c-5-8 services">
            {(c.services ?? []).map((s, i) => (
              <li key={s.id ?? s.title} data-reveal>
                <span className="services__num">{String(i + 1).padStart(2, '0')}</span>
                <h2 className="h3 services__title">{s.title}</h2>
                <p className="muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec-s2 wrap on-dark" id="diagnostico" aria-label="Diagnóstico">
        <div className="grid" style={{ rowGap: 40, alignItems: 'center' }}>
          <div className="c-1-6" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <span className="eyebrow" style={{ color: 'var(--claro-2)' }} data-reveal>Diagnóstico por WhatsApp</span>
            <h2 className="h2" data-reveal>¿Qué le pasa a tu superficie?</h2>
            <p className="muted" style={{ margin: 0, maxWidth: 460 }} data-reveal>Marca lo que ves. Te abrimos WhatsApp con el mensaje escrito; solo adjunta fotos con luz natural.</p>
            <CareSymptoms symptoms={(c.symptoms ?? []).map((s) => s.title)} />
          </div>
          {mediaUrl(side, 'card') && (
            <figure className="c-8-5 care__media" style={{ margin: 0 }} data-img-reveal>
              <img src={mediaUrl(side, 'card')!} alt={mediaAlt(side)} />
              {isProvisional(side) && <span className="tag" style={{ left: 16, top: 16 }}>Fotografía provisional</span>}
            </figure>
          )}
        </div>
      </section>

      <Method eyebrow="Cómo funciona" title="Del mensaje al brillo." steps={c.steps ?? undefined} tone="piedra" />

      {products.docs.length > 0 && (
        <section className="sec-s1 wrap bg-papel" aria-label="Servicios y productos Care">
          <div className="lines__head"><h2 className="h2" data-reveal>Para tu superficie.</h2></div>
          <div className="shop__grid">{products.docs.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        </section>
      )}

      <Contact title="Cuidemos tu piedra." text="Si prefieres, déjanos tus datos y te escribimos para revisar tu superficie." intent="cuidado" />
    </>
  )
}
