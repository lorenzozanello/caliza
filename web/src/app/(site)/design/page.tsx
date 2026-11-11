import type { Metadata } from 'next'
import Link from 'next/link'
import type { Where } from 'payload'
import { getPayloadClient } from '@/lib/payload'
import { ProductCard } from '@/components/ProductCard'
import { PUBLIC_PRODUCT } from '@/lib/publication'
import { Contact } from '@/components/sections/Contact'
import { FamilyConsultation } from '@/components/FamilyConsultation'

export const metadata: Metadata = { title: 'Living Design · Piezas para habitar', description: 'Conozca las familias de Living Design y consulte modelos, materiales y acabados. Solo se publican fichas comerciales verificadas.' }
export const revalidate = 60

const TYPES = [
  { value: '', label: 'Todas' },
  { value: 'mesa-comedor', label: 'Mesas de comedor' },
  { value: 'mesa-centro', label: 'Mesas de centro' },
  { value: 'mesa-auxiliar', label: 'Mesas auxiliares' },
  { value: 'consola', label: 'Consolas' },
  { value: 'lavamanos', label: 'Lavamanos' },
  { value: 'objeto', label: 'Objetos' },
  { value: 'cuidado', label: 'Cuidado' },
]
const MODES = [
  { value: '', label: 'Todas' },
  { value: 'inmediata', label: 'Entrega inmediata' },
  { value: 'pedido', label: 'Bajo pedido' },
  { value: 'configurable', label: 'Configurable' },
]

type SP = Promise<{ tipo?: string; disponibilidad?: string }>

export default async function ShopPage({ searchParams }: { searchParams: SP }) {
  const { tipo = '', disponibilidad = '' } = await searchParams
  const where: Where = { ...PUBLIC_PRODUCT, line: { in: ['design', 'care'] } }
  if (TYPES.some((t) => t.value === tipo && t.value)) where.category = { equals: tipo }
  if (MODES.some((m) => m.value === disponibilidad && m.value)) where.saleMode = { equals: disponibilidad }
  const payload = await getPayloadClient()
  const products = await payload.find({ collection: 'products', where, sort: ['-featured', 'order'], limit: 60, depth: 1 })
  const href = (k: string, v: string) => {
    const p = new URLSearchParams()
    const next = { tipo, disponibilidad, [k]: v }
    Object.entries(next).forEach(([a, b]) => b && p.set(a, b))
    const s = p.toString()
    return s ? `/design?${s}` : '/design'
  }
  return (
    <div className="page-top">
      <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', paddingBottom: 36 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="small muted"><Link href="/">Inicio</Link> / Living Design</span>
          <h1 className="h2" style={{ fontSize: 'clamp(44px,5.4vw,80px)' }}>Piezas para habitar</h1>
        </div>
        <span className="small muted" data-testid="product-count">{products.totalDocs ? `${products.totalDocs} ${products.totalDocs === 1 ? 'pieza verificada' : 'piezas verificadas'}` : 'Familias bajo consulta'}</span>
      </div>
      {products.totalDocs || tipo || disponibilidad ? <div className="shop">
        <aside className="shop__filters" aria-label="Filtros">
          <div className="filter-group"><span className="eyebrow muted" style={{ marginBottom: 6 }}>Tipo</span>
            {TYPES.map((t) => <Link key={t.value || 'all'} href={href('tipo', t.value)} aria-current={tipo === t.value}>{t.label}</Link>)}
          </div>
          <div className="filter-group"><span className="eyebrow muted" style={{ marginBottom: 6 }}>Disponibilidad</span>
            {MODES.map((m) => <Link key={m.value || 'all'} href={href('disponibilidad', m.value)} aria-current={disponibilidad === m.value}>{m.label}</Link>)}
          </div>
        </aside>
        <div className="shop__grid">
          {products.docs.map((p) => <ProductCard key={p.id} p={p} />)}
          {products.docs.length === 0 && <div className="caliza-editorial-empty"><h2>Sin piezas para estos filtros.</h2><p>Aún no hay fichas comerciales verificadas que coincidan con la selección.</p><Link href="/design" className="link"><span className="u">Explorar familias disponibles para consulta</span></Link></div>}
        </div>
      </div> : <div className="wrap"><FamilyConsultation /></div>}
      <Contact title="Encontremos la pieza adecuada." text="Cuéntenos qué busca y qué espacio desea transformar. Le orientaremos sobre materiales, dimensiones y opciones de fabricación." intent="pieza" />
    </div>
  )
}
