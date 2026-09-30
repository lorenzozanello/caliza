import type { Media } from '@/payload-types'

type Maybe = Media | number | string | null | undefined

export function mediaUrl(m: Maybe, size?: 'thumb' | 'card' | 'hero'): string | null {
  if (!m || typeof m !== 'object') return null
  const sized = size ? m.sizes?.[size]?.url : null
  return relative(sized || m.url || null)
}

/** Payload antepone serverURL; se sirve relativo para que funcione en cualquier dominio o puerto. */
const relative = (url: string | null) => (url ? url.replace(/^https?:\/\/[^/]+(?=\/api\/media\/)/, '') : null)

export const mediaAlt = (m: Maybe) => (m && typeof m === 'object' ? m.alt : '')
export const isProvisional = (m: Maybe) => Boolean(m && typeof m === 'object' && m.provisional)
