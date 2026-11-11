import type { MetadataRoute } from 'next'

// Catalogue and legal records are CMS-backed and can change independently of builds.
export const dynamic = 'force-dynamic'
import { getPayloadClient } from '@/lib/payload'
import { siteUrl } from '@/lib/payments'
import { PUBLIC_PRODUCT, PUBLIC_PROJECT } from '@/lib/publication'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const [products, projects, legal] = await Promise.all([
    payload.find({ collection: 'products', where: PUBLIC_PRODUCT, limit: 500, depth: 0 }),
    payload.find({ collection: 'projects', where: PUBLIC_PROJECT, limit: 500, depth: 0 }),
    payload.find({ collection: 'legal', where: { draft: { not_equals: true } }, limit: 50, depth: 0 }),
  ])
  const base = siteUrl()
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/design`, changeFrequency: 'weekly', priority: 0.9 },
    ...['/stone', '/care', '/proyectos', '/materiales', '/estudio', '/inspiracion'].map((path) => ({ url: `${base}${path}`, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...products.docs.map((p) => ({ url: `${base}/design/${p.slug}`, lastModified: p.updatedAt, priority: 0.8 })),
    ...projects.docs.map((p) => ({ url: `${base}/proyectos/${p.slug}`, lastModified: p.updatedAt, priority: 0.7 })),
    ...legal.docs.map((l) => ({ url: `${base}/legal/${l.slug}`, lastModified: l.updatedAt, priority: 0.2 })),
  ]
}
