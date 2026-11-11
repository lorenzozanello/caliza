import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/payments'
import { publicSiteApproved } from '@/lib/launch-gates'

export default function robots(): MetadataRoute.Robots {
  if (!publicSiteApproved()) return { rules: [{ userAgent: '*', disallow: '/' }] }
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/checkout', '/pedido', '/pago'] }], sitemap: `${siteUrl()}/sitemap.xml` }
}
