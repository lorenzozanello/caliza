import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { PageHero } from '@/components/sections/PageHero'
import { Method } from '@/components/sections/Method'
import { Contact } from '@/components/sections/Contact'
import { isProvisional, mediaAlt, mediaUrl } from '@/components/media'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Estudio · Tres generaciones de marmoleros',
  description: 'Una familia de marmoleros italianos. La tercera generación diseña en Colombia, con la dirección creativa de Leonardo Zanello.',
}

export default async function StudioPage() {
  const payload = await getPayloadClient()
  const [pages, home] = await Promise.all([payload.findGlobal({ slug: 'pages', depth: 1 }), payload.findGlobal({ slug: 'home', depth: 1 })])
  const st = pages.studio ?? {}
  const paragraphs = (st.story ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  const generations = home.generations?.length ? home.generations : [{ name: 'Primera generación', note: 'Marmolero · Italia' }, { name: 'Segunda generación', note: 'El oficio continúa' }, { name: 'Leonardo Zanello', note: 'Dirección creativa · Colombia' }]
  const detail = home.careSectionImage
  return (
    <>
      <PageHero image={st.heroImage || home.stoneImage} eyebrow={st.eyebrow} title={st.title} titleItalic={st.titleItalic} intro={st.intro} />

      <section className="sec-s2 wrap">
        <div className="grid">
          <div className="c-1-4 manifesto__side" data-reveal>
            <img src="/brand/symbol_dark.svg" alt="" style={{ width: 36, height: 'auto' }} />
            <span className="eyebrow muted">Manifiesto</span>
          </div>
          <div className="c-4-9">
            <p className="manifesto__text" data-words>{home.manifesto}</p>
            <div className="signature" data-reveal><span style={{ width: 40, height: 1, background: 'currentColor' }} />Leonardo Zanello · Dirección creativa</div>
          </div>
        </div>
      </section>

      <section className="on-dark sec-s2 wrap" aria-label="Tres generaciones">
        <div className="grid" style={{ rowGap: 48 }}>
          <div className="c-1-6" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <span className="eyebrow" style={{ color: 'var(--claro-2)' }} data-reveal>Nuestra historia</span>
            <h2 className="h2" data-reveal>Del taller de marmoleros en Italia al estudio en Colombia.</h2>
            {paragraphs.map((p, i) => <p key={i} className="story__p" data-reveal>{p}</p>)}
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

      {(st.principles?.length ?? 0) > 0 && (
        <section className="sec-s2 wrap" aria-label="Lo que no cambia">
          <div className="grid" style={{ rowGap: 48, alignItems: 'start' }}>
            <div className="c-1-5" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <h2 className="h2" data-reveal>Lo que no cambia.</h2>
              {mediaUrl(detail, 'card') && (
                <figure className="principles__media" data-img-reveal>
                  <img src={mediaUrl(detail, 'card')!} alt={mediaAlt(detail)} />
                  {isProvisional(detail) && <span className="tag" style={{ left: 14, top: 14 }}>Fotografía provisional</span>}
                </figure>
              )}
            </div>
            <ol className="c-7-6 principles">
              {st.principles!.map((p, i) => (
                <li key={p.id ?? p.title} data-reveal>
                  <span className="eyebrow muted">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="h3">{p.title}</h3>
                  <p className="muted">{p.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <Method />
      <Contact />
    </>
  )
}
