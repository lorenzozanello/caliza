import type { CSSProperties } from 'react'

type BrandId = 'group' | 'stone-design' | 'living-design' | 'stone-care'
type Variant = 'primary' | 'inverse' | 'monochrome'

const dimensions = {
  group: { width: 330, height: 232, name: 'CALIZA GROUP' },
  'stone-design': { width: 260, height: 202, name: 'CALIZA STONE DESIGN' },
  'living-design': { width: 260, height: 202, name: 'CALIZA LIVING DESIGN' },
  'stone-care': { width: 260, height: 202, name: 'CALIZA STONE CARE' },
} as const

/** Single-source vector lockup. Never stretch, crop or reconstruct with CSS text. */
export function BrandMark({ brand = 'group', variant = 'primary', width = 104, decorative = false, className = '' }: {
  brand?: BrandId
  variant?: Variant
  width?: number
  decorative?: boolean
  className?: string
}) {
  const mark = dimensions[brand]
  return <img
    className={`caliza-brand-logo ${className}`.trim()}
    src={`/brand/caliza-${brand}-${variant}.svg`}
    alt={decorative ? '' : mark.name}
    aria-hidden={decorative ? true : undefined}
    width={mark.width}
    height={mark.height}
    data-caliza-mark={brand === 'group' ? 'group' : 'division'}
    style={{ '--caliza-mark-width': `${width}px` } as CSSProperties}
    decoding="async"
  />
}
