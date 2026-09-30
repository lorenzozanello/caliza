/** Cálculo de precio compartido entre la ficha (cliente) y el checkout (servidor). */
export type PricedProduct = {
  basePrice?: number | null
  stoneOptions?: { label: string; priceDelta?: number | null; available?: boolean | null }[] | null
  sizeOptions?: { label: string; dimensions?: string | null; price: number }[] | null
  baseOptions?: { label: string; priceDelta?: number | null }[] | null
}

export type Selection = { stone?: number; size?: number; base?: number }

export function unitPrice(p: PricedProduct, s: Selection): number {
  const size = p.sizeOptions?.[s.size ?? 0]
  const base = size ? size.price : p.basePrice ?? 0
  const stone = p.stoneOptions?.[s.stone ?? 0]?.priceDelta ?? 0
  const baseOpt = p.baseOptions?.[s.base ?? 0]?.priceDelta ?? 0
  return Math.max(0, base + stone + baseOpt)
}

export function minPrice(p: PricedProduct): number {
  const sizes = p.sizeOptions?.length ? Math.min(...p.sizeOptions.map((x) => x.price)) : p.basePrice ?? 0
  const stones = p.stoneOptions?.length ? Math.min(...p.stoneOptions.map((x) => x.priceDelta ?? 0)) : 0
  const bases = p.baseOptions?.length ? Math.min(...p.baseOptions.map((x) => x.priceDelta ?? 0)) : 0
  return Math.max(0, sizes + stones + bases)
}

export function describeSelection(p: PricedProduct, s: Selection): string {
  return [p.stoneOptions?.[s.stone ?? 0]?.label, p.sizeOptions?.[s.size ?? 0]?.label, p.baseOptions?.[s.base ?? 0]?.label]
    .filter(Boolean)
    .join(' · ')
}

export function isValidSelection(p: PricedProduct, s: Selection): boolean {
  const inRange = (i: number | undefined, arr?: unknown[] | null) => (arr?.length ? i !== undefined && i >= 0 && i < arr.length : true)
  if (!inRange(s.stone, p.stoneOptions) || !inRange(s.size, p.sizeOptions) || !inRange(s.base, p.baseOptions)) return false
  const stone = p.stoneOptions?.[s.stone ?? 0]
  return stone ? stone.available !== false : true
}
