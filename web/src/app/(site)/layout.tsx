import type { Metadata } from 'next'
import '@/styles/tokens.css'
import '@/styles/site.css'
import '@/styles/option08.css'
import '@/styles/social.css'
import '@/styles/identity.css'
import '@/styles/authority-tokens.css'
import '@/styles/marketing-v2.css'

// CMS-backed pages are request-rendered; a build must not depend on a local seed database.
export const dynamic = 'force-dynamic'
import { CartProvider } from '@/components/cart/CartProvider'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { Motion } from '@/components/Motion'
import { Lightbox } from '@/components/Lightbox'
import { ViewTransition } from 'react'
import { getPayloadClient } from '@/lib/payload'
import { getSettings } from '@/lib/payload'
import { waLink } from '@/lib/whatsapp'
import { siteUrl } from '@/lib/payments'
import { publicSiteApproved, commerceApproved } from '@/lib/launch-gates'
import { officialSocialProfile, officialWhatsApp } from '@/lib/official-channels'
import { PUBLIC_PRODUCT } from '@/lib/publication'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  robots: publicSiteApproved() ? { index: true, follow: true } : { index: false, follow: false, noarchive: true },
  title: { default: 'CALIZA GROUP · La materia toma forma', template: '%s · CALIZA GROUP' },
  description: 'CALIZA GROUP: Stone Design, Living Design y Stone Care. Diseño, vida y cuidado en piedra natural para espacios que perduran.',
  openGraph: { siteName: 'CALIZA GROUP', locale: 'es_CO', type: 'website' },
  icons: { icon: '/brand/caliza-group-primary.svg' },
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  const payload = await getPayloadClient()
  const [legal, published] = await Promise.all([
    payload.find({ collection: 'legal', sort: 'title', limit: 10, depth: 0, select: { slug: true, title: true } }),
    payload.find({ collection: 'products', where: { ...PUBLIC_PRODUCT, line: { in: ['design', 'care'] } }, limit: 1, depth: 0 }),
  ])
  const shoppingEnabled = commerceApproved() && published.totalDocs > 0
  const number = officialWhatsApp(settings.whatsappNumber)
  const instagram = officialSocialProfile(settings.instagramUrl, 'instagram')
  const tiktok = officialSocialProfile(settings.tiktokUrl, 'tiktok')
  return (
    <html lang="es-CO">
      <body>
        <CartProvider whatsapp={number}>
          <SiteHeader shoppingEnabled={shoppingEnabled} />
          <ViewTransition default="page"><main>{children}</main></ViewTransition>
          <SiteFooter instagram={instagram} tiktok={tiktok} whatsappHref={waLink(number, 'Hola, quiero hablar con CALIZA GROUP.')} legal={legal.docs.map((d) => ({ slug: d.slug ?? '', title: d.title }))} />
          <WhatsAppFloat />
          {shoppingEnabled && <CartDrawer />}
          <Lightbox />
          <Motion />
        </CartProvider>
      </body>
    </html>
  )
}
