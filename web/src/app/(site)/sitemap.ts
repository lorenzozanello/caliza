import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { siteUrl } from '@/lib/payments'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const [products, projects] = await Promise.all([
    payload.find({ collection: 'products', where: { status: { equals: 'publicado' } }, limit: 500, depth: 0 }),
    payload.find({ collection: 'projects', limit: 500, depth: 0 }),
  ])
  const base = siteUrl()
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/design`, changeFrequency: 'weekly', priority: 0.9 },
    ...products.docs.map((p) => ({ url: `${base}/design/${p.slug}`, lastModified: p.updatedAt, priority: 0.8 })),
    ...projects.docs.map((p) => ({ url: `${base}/proyectos/${p.slug}`, lastModified: p.updatedAt, priority: 0.7 })),
  ]
}
