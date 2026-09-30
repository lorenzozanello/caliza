import type { Metadata } from 'next'
import '@/styles/tokens.css'
import '@/styles/site.css'
import { CartProvider } from '@/components/cart/CartProvider'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { Motion } from '@/components/Motion'
import { getSettings } from '@/lib/payload'
import { waLink } from '@/lib/whatsapp'
import { siteUrl } from '@/lib/payments'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: 'Caliza · Piedra natural hecha para tu espacio', template: '%s · Caliza' },
  description: 'Tres generaciones de marmoleros italianos. Espacios y piezas en piedra natural, diseñados y fabricados en Colombia.',
  openGraph: { siteName: 'Caliza', locale: 'es_CO', type: 'website' },
  icons: { icon: '/brand/symbol_dark.svg' },
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  const number = settings.whatsappNumber || '570000000000'
  return (
    <html lang="es-CO">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap" />
      </head>
      <body>
        <CartProvider whatsapp={number}>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter instagram={settings.instagramUrl} tiktok={settings.tiktokUrl} whatsappHref={waLink(number, 'Hola, quiero hablar con el estudio.')} />
          <WhatsAppFloat />
          <CartDrawer />
          <Motion />
        </CartProvider>
      </body>
    </html>
  )
}
