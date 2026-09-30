import type { Metadata } from 'next'
import { siteUrl } from '@/lib/payments'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { ProductConfigurator } from '@/components/ProductConfigurator'
import { ProductCard } from '@/components/ProductCard'
import { isProvisional, mediaAlt, mediaUrl } from '@/components/media'
import { LINE_LABEL, SALE_MODE_LABEL } from '@/lib/format'
import { minPrice } from '@/lib/pricing'

export const revalidate = 60
type Params = Promise<{ slug: string }>

async function getProduct(slug: string) {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'products', where: { slug: { equals: slug }, status: { equals: 'publicado' } }, limit: 1, depth: 1 })
  return res.docs[0]
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await getProduct((await params).slug)
  if (!p) return {}
  const img = mediaUrl(p.images?.[0]?.image, 'card')
  return { title: p.name, description: p.shortDescription, openGraph: { title: p.name, description: p.shortDescription, images: img ? [img] : [] } }
}

export default async function ProductPage({ params }: { params: Params }) {
  const p = await getProduct((await params).slug)
  if (!p) notFound()
  const payload = await getPayloadClient()
  const related = await payload.find({ collection: 'products', where: { status: { equals: 'publicado' }, id: { not_equals: p.id }, line: { in: ['design', 'care'] } }, sort: ['-featured', 'order'], limit: 3, depth: 1 })
  const images = (p.images ?? []).map((i) => i.image)
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.name, description: p.shortDescription,
    image: images.map((m) => mediaUrl(m, 'card')).filter(Boolean).map((u) => siteUrl() + u), brand: { '@type': 'Brand', name: 'Caliza' },
    offers: p.saleMode === 'cotizacion' ? undefined : { '@type': 'Offer', priceCurrency: 'COP', price: minPrice(p), availability: p.saleMode === 'inmediata' && !p.stock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock' },
  }
  const configImages = (p.stoneOptions ?? []).map((s) => ({ label: s.label, swatch: mediaUrl(s.swatch, 'thumb'), detail: mediaUrl(s.swatch, 'card') }))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pdp">
        <div className="pdp__layout">
          <div className="pdp__gallery">
            {images.map((m, i) => (
              <figure key={i} className={i === 0 ? 'wide' : 'half'} {...(i === 0 ? { 'data-img-reveal': true } : {})}>
                <img className={typeof m === 'object' && m?.studio ? 'studio' : ''} src={mediaUrl(m, i === 0 ? 'hero' : 'card') ?? ''} alt={mediaAlt(m)} data-gallery-index={i} />
                {i === 0 && isProvisional(m) && <span className="tag" style={{ left: 14, top: 14 }}>Fotografía provisional</span>}
              </figure>
            ))}
            {configImages.length > 0 && (
              <figure className="half"><img src={configImages[0].detail ?? ''} alt="Detalle de la piedra elegida" data-stone-detail /></figure>
            )}
          </div>
          <aside className="pdp__panel" aria-label="Configurar pieza">
            <div className="pdp__sticky">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span className="crumbs"><Link href="/">Inicio</Link> / <Link href="/design">Design</Link> / {p.name}</span>
                <span className="eyebrow muted">{LINE_LABEL[p.line]} · {SALE_MODE_LABEL[p.saleMode]}</span>
                <h1 className="h2">{p.name}</h1>
                <p className="muted" style={{ margin: 0, fontSize: 15 }}>{p.shortDescription}</p>
              </div>
              <ProductConfigurator
                product={{
                  id: p.id, slug: p.slug!, name: p.name, saleMode: p.saleMode, priceDisplay: p.priceDisplay ?? 'desde', basePrice: p.basePrice ?? 0,
                  depositPercent: p.depositPercent ?? 50, leadTime: p.leadTime ?? '', stock: p.stock ?? 0,
                  image: mediaUrl(images[0], 'thumb'),
                  stoneOptions: (p.stoneOptions ?? []).map((s) => ({ label: s.label, priceDelta: s.priceDelta ?? 0, available: s.available !== false })),
                  sizeOptions: (p.sizeOptions ?? []).map((s) => ({ label: s.label, dimensions: s.dimensions ?? '', price: s.price })),
                  baseOptions: (p.baseOptions ?? []).map((s) => ({ label: s.label, priceDelta: s.priceDelta ?? 0 })),
                }}
                swatches={configImages}
              />
              <div>
                {p.details && <details className="acc"><summary>Medidas y peso <i /></summary><p>{p.details}</p></details>}
                {p.care && <details className="acc"><summary>Materiales y cuidado · Caliza Care <i /></summary><p>{p.care}</p></details>}
                <details className="acc"><summary>Envío, instalación y pagos <i /></summary><p>Antes de despachar confirmamos piso, ascensor y accesos. {p.saleMode === 'inmediata' ? 'Pagas el total al comprar.' : `Pagas ${p.depositPercent ?? 50}% para iniciar y el resto antes del despacho, o el total de una vez.`}</p></details>
              </div>
              {p.isExample && <p className="note">Nombre, precios y medidas de ejemplo.</p>}
            </div>
          </aside>
        </div>

        {p.saleMode !== 'inmediata' && (
          <section className="on-dark sec-s1 wrap" style={{ marginTop: 'var(--s1)' }}>
            <div className="grid" style={{ rowGap: 36, alignItems: 'end' }}>
              <div className="c-1-4" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <span className="eyebrow" style={{ color: 'var(--claro-2)' }}>Hecha para ti</span>
                <h2 className="h2" style={{ color: 'var(--claro)' }}>Así avanza tu pieza.</h2>
              </div>
              <ol className="c-6-7 timeline">
                {['Anticipo', 'Elegimos tu placa', 'Fabricación con fotos', 'Saldo y despacho', 'Entrega e instalación'].map((t, i) => (
                  <li key={t} data-reveal><span className="small" style={{ color: 'var(--claro-2)' }}>0{i + 1}</span><span>{t}</span></li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {related.docs.length > 0 && (
          <section className="sec-s1 wrap">
            <div className="lines__head"><h2 className="h2">Combina con</h2><Link href="/design" className="link"><span className="u">Ver colección</span><span className="arrow">→</span></Link></div>
            <div className="shop__grid">{related.docs.map((r) => <ProductCard key={r.id} p={r} />)}</div>
          </section>
        )}
      </div>
    </>
  )
}
