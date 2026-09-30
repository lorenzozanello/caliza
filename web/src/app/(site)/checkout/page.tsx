import type { Metadata } from 'next'
import { CheckoutForm } from '@/components/CheckoutForm'
import { getSettings } from '@/lib/payload'

export const metadata: Metadata = { title: 'Pago', robots: { index: false } }
export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
  const settings = await getSettings()
  const cities = (settings.shippingCities ?? []).map((c) => ({ city: c.city, cost: c.cost }))
  return <CheckoutForm cities={cities} defaultCost={settings.defaultShippingCost ?? 0} />
}
