import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { ProductCard } from '@/components/ProductCard'
import { Contact } from '@/components/sections/Contact'
import { mediaUrl, mediaAlt } from '@/components/media'
import { PUBLIC_PRODUCT, PUBLIC_MATERIAL } from '@/lib/publication'

export const revalidate = 60

const lines = [
  { id: 'crear', title: 'Crear', brand: 'Stone Design', image: '/option08-hero.webp', icon: '/brand/option08-stone.svg', href: '/stone', description: 'Proyectos en piedra natural a medida.', alt: 'Cocina mediterránea con isla en piedra natural' },
  { id: 'habitar', title: 'Habitar', brand: 'Living Design', image: '/option08-living.webp', icon: '/brand/option08-living.svg', href: '/design', description: 'Mobiliario, mesas y objetos que dan forma a la vida.', alt: 'Mesa escultórica de travertino en sala luminosa' },
  { id: 'preservar', title: 'Preservar', brand: 'Stone Care', image: '/option08-care.webp', icon: '/brand/option08-care.svg', href: '/care', description: 'Cuidado y restauración para que la belleza perdure.', alt: 'Cuidado artesanal de una superficie de piedra natural' },
]

export default async function HomePage() {
  const payload = await getPayloadClient()
  const [products, materials] = await Promise.all([
    payload.find({ collection: 'products', where: { ...PUBLIC_PRODUCT, line: { in: ['design', 'care'] } }, sort: ['-featured', 'order'], limit: 4, depth: 1 }),
    payload.find({ collection: 'materials', where: PUBLIC_MATERIAL, sort: 'order', limit: 4, depth: 1 }),
  ])

  return (
    <div className="o8-site">
      <p className="o8-visual-disclaimer">Imágenes ambientales conceptuales de referencia; catálogo y cotizaciones sujetos a confirmación.</p>
      <section className="o8-hero" aria-labelledby="o8-hero-heading">
        <img src="/option08-hero.webp" alt="Isla de piedra natural en una cocina mediterránea iluminada por el sol" fetchPriority="high" />
        <div className="o8-hero-copy">
          <span className="o8-overline">Piedra natural · Diseño de vida</span>
          <h1 id="o8-hero-heading">La materia<br />toma forma.</h1>
          <span className="o8-terracotta-rule" />
          <p>Diseño, vida y cuidado en piedra natural para espacios que perduran.</p>
          <Link href="/proyectos" className="o8-button">Explorar proyectos <span aria-hidden="true">→</span></Link>
        </div>
        <div className="o8-hero-caption">Arquitectura · Materia · Personas</div>
        <div className="o8-pagination" aria-hidden="true">01 <span /> 02 <span /> 03</div>
      </section>

      <section className="o8-pillars" aria-label="Las tres líneas de CALIZA GROUP">
        {lines.map((line) => (
          <Link key={line.id} className="o8-pillar" href={line.href} id={line.id}>
            <img src={line.image} alt={line.alt} loading="lazy" />
            <div className="o8-pillar-copy">
              <img className="o8-line-mark" src={line.icon} alt="" aria-hidden="true" />
              <div><h2>{line.title}</h2><span>{line.brand}</span><p>{line.description}</p></div>
              <b aria-hidden="true">→</b>
            </div>
          </Link>
        ))}
      </section>

      <section className="o8-section" id="coleccion">
        <div className="o8-section-heading"><h2>Productos destacados</h2><Link href="/design">Explorar colección <span aria-hidden="true">→</span></Link></div>
        {products.docs.length ? (
          <div className="o8-cms-product-grid">{products.docs.map((product) => <ProductCard key={product.id} p={product} />)}</div>
        ) : (
          <div className="caliza-editorial-empty"><h3>Una pieza comienza con una conversación.</h3><p>Estamos preparando las fichas verificadas de nuestras colecciones. Podemos orientarle sobre mesas, mobiliario y lavamanos según su espacio.</p><Link href="/design" className="o8-button">Explorar las familias <span aria-hidden="true">→</span></Link></div>
        )}
      </section>

      <section className="o8-section o8-materials" id="materiales">
        <div className="o8-section-heading"><h2>Materiales</h2><Link href="/materiales">Explorar materiales <span aria-hidden="true">→</span></Link></div>
        {materials.docs.length ? (
          <div className="o8-material-grid">{materials.docs.map((material) => (
            <Link href={`/materiales#${material.slug}`} key={material.id}>
              {mediaUrl(material.image, 'card') ? <img src={mediaUrl(material.image, 'card')!} alt={mediaAlt(material.image)} loading="lazy" /> : <span className="o8-material-placeholder" />}
              <strong>{material.name}</strong>
            </Link>
          ))}</div>
        ) : (
          <div className="caliza-editorial-empty"><h3>La elección de piedra merece atención.</h3><p>La disponibilidad y las fichas de materiales se verifican antes de mostrarlas. Conozca nuestro proceso de selección.</p><Link href="/materiales" className="o8-button">Cómo elegimos materiales <span aria-hidden="true">→</span></Link></div>
        )}
      </section>

      <section className="o8-feature" id="proyectos">
        <img src="/option08-hero.webp" alt="Arquitectura de piedra natural y luz mediterránea" loading="lazy" />
        <div><span className="o8-overline">Stone Design</span><h2>Espacios que perduran.</h2><p>Del material al detalle, concebimos proyectos que unen oficio, arquitectura y naturaleza.</p><Link className="o8-button" href="/stone">Iniciar proyecto <span aria-hidden="true">→</span></Link></div>
      </section>
      <section className="o8-feature o8-feature-care" id="cuidado">
        <img src="/option08-care.webp" alt="Cuidado manual de una superficie de travertino" loading="lazy" />
        <div><span className="o8-overline">Stone Care</span><h2>Cuidar también es diseñar.</h2><p>El valor de la piedra perdura cuando se conoce, protege y restaura con criterio.</p><Link className="o8-text-link" href="/care">Conocer servicios →</Link></div>
      </section>
      <section className="o8-section" id="inspiracion"><div className="o8-section-heading"><h2>Inspiración en movimiento</h2><Link href="/inspiracion">Visualizador Instagram y TikTok <span aria-hidden="true">→</span></Link></div><div className="o8-product-grid"><Link href="/inspiracion" className="o8-product"><img src="/option08-hero.webp" alt="Referencia conceptual de arquitectura en piedra" loading="lazy" /><div><strong>La materia</strong><span>Explorar publicaciones públicas</span><span aria-hidden="true">→</span></div></Link><Link href="/inspiracion" className="o8-product"><img src="/option08-care.webp" alt="Cuidado artesanal de piedra natural" loading="lazy" /><div><strong>El cuidado</strong><span>Instagram y TikTok en una sola experiencia</span><span aria-hidden="true">→</span></div></Link></div></section>
      <div className="o8-contact-wrap"><Contact title="Hablemos de su proyecto." text="Diseñamos con usted desde la idea hasta su realización. Cuéntenos qué desea crear, habitar o preservar." /></div>
    </div>
  )
}
