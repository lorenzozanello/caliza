import type { Where } from 'payload'

/**
 * No ficha de Drive está actualmente aprobada para publicación individual.
 * El CMS exige aprobación explícita, derechos de imagen y ausencia de datos de ejemplo.
 * Estos filtros se aplican también en Local API (que normalmente ignora access).
 */
export const PUBLIC_PRODUCT: Where = {
  and: [
    { sourceProductId: { exists: true } },
    { status: { equals: 'publicado' } },
    { publicationApproved: { equals: true } },
    { imageRightsConfirmed: { equals: true } },
    { isExample: { not_equals: true } },
  ],
}

export const PUBLIC_PROJECT: Where = {
  and: [
    { sourceProjectId: { exists: true } },
    { publicationApproved: { equals: true } },
    { imageRightsConfirmed: { equals: true } },
    { isExample: { not_equals: true } },
  ],
}

export const PUBLIC_MATERIAL: Where = { and: [{ sourceMaterialId: { exists: true } }, { publicationApproved: { equals: true } }] }
