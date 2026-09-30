import type { Metadata } from 'next'
import Link from 'next/link'
import type { Where } from 'payload'
import { getPayloadClient } from '@/lib/payload'
import { ProductCard } from '@/components/ProductCard'

export const metadata: Metadata = { title: 'Colección Design', description: 'Mesas, consolas, lavamanos y objetos en piedra natural, hechos por encargo o listos para entrega.' }
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
  const where: Where = { status: { equals: 'publicado' }, line: { in: ['design', 'care'] } }
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
          <span className="small muted"><Link href="/">Inicio</Link> / Design</span>
          <h1 className="h2" style={{ fontSize: 'clamp(44px,5.4vw,80px)' }}>Piezas para habitar</h1>
        </div>
        <span className="small muted" data-testid="product-count">{products.totalDocs} {products.totalDocs === 1 ? 'pieza' : 'piezas'}</span>
      </div>
      <div className="shop">
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
          {products.docs.length === 0 && <p className="empty">No hay piezas con estos filtros. <Link href="/design" className="link"><span className="u">Ver todas</span></Link></p>}
        </div>
      </div>
    </div>
  )
}
