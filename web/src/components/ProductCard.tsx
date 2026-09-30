import Link from 'next/link'
import type { Product } from '@/payload-types'
import { formatCOP, SALE_MODE_LABEL } from '@/lib/format'
import { minPrice } from '@/lib/pricing'
import { mediaAlt, mediaUrl } from './media'

export function priceLabel(p: Product) {
  if (p.priceDisplay === 'cotizar' || p.saleMode === 'cotizacion') return 'Cotizar'
  const v = minPrice(p)
  return p.priceDisplay === 'fijo' ? formatCOP(v) : `Desde ${formatCOP(v)}`
}

export function badgeLabel(p: Product) {
  if (p.signed) return 'Pieza firmada · L. Zanello'
  if (p.saleMode === 'inmediata') return p.stock ? `Entrega inmediata · ${p.stock} ${p.stock === 1 ? 'unidad' : 'unidades'}` : 'Agotado'
  return SALE_MODE_LABEL[p.saleMode] ?? ''
}

export function ProductCard({ p, className = '' }: { p: Product; className?: string }) {
  const img = p.images?.[0]?.image
  const studio = typeof img === 'object' && Boolean(img?.studio)
  return (
    <Link className={`product-card ${className}`} href={`/design/${p.slug}`} data-cursor={p.saleMode === 'inmediata' ? 'Comprar' : 'Configurar'} data-testid="product-card">
      <div className="product-card__media">
        <span className={`product-card__badge${p.saleMode === 'inmediata' ? ' product-card__badge--dark' : ''}`}>{badgeLabel(p)}</span>
        {mediaUrl(img, 'card') && <img className={studio ? 'studio' : ''} src={mediaUrl(img, 'card')!} alt={mediaAlt(img)} loading="lazy" />}
        <span className="product-card__quick">{p.saleMode === 'inmediata' ? 'Ver y comprar' : 'Configurar pieza'}</span>
      </div>
      <div className="product-card__row"><span className="product-card__name">{p.name}</span><span className="tnum">{priceLabel(p)}</span></div>
      <span className="small muted">{p.materialsText}</span>
    </Link>
  )
}
