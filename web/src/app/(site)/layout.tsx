import type { Metadata } from 'next'
import '@/styles/tokens.css'
import '@/styles/site.css'
import '@/styles/option08.css'
import '@/styles/social.css'
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: 'CALIZA GROUP · La materia toma forma', template: '%s · CALIZA GROUP' },
  description: 'CALIZA GROUP: Stone Design, Living Design y Stone Care. Diseño, vida y cuidado en piedra natural para espacios que perduran.',
  openGraph: { siteName: 'CALIZA GROUP', locale: 'es_CO', type: 'website' },
  icons: { icon: '/brand/option08-stone.svg' },
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  const legal = await (await getPayloadClient()).find({ collection: 'legal', sort: 'title', limit: 10, depth: 0, select: { slug: true, title: true } })
  const number = settings.whatsappNumber || '570000000000'
  return (
    <html lang="es-CO">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Playfair+Display:wght@400;500;600&display=swap" />
      </head>
      <body>
        <CartProvider whatsapp={number}>
          <SiteHeader />
          <ViewTransition default="page"><main>{children}</main></ViewTransition>
          <SiteFooter instagram={settings.instagramUrl} tiktok={settings.tiktokUrl} whatsappHref={waLink(number, 'Hola, quiero hablar con el estudio.')} legal={legal.docs.map((d) => ({ slug: d.slug ?? '', title: d.title }))} />
          <WhatsAppFloat />
          <CartDrawer />
          <Lightbox />
          <Motion />
        </CartProvider>
      </body>
    </html>
  )
}
