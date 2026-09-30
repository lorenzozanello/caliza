import 'server-only'
import { wompiCheckoutUrl } from './wompi'

export type PaymentProvider = 'simulated' | 'wompi'

export const paymentProvider = (): PaymentProvider => (process.env.PAYMENTS_PROVIDER === 'wompi' ? 'wompi' : 'simulated')

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

/** Referencia única por intento de pago: número de pedido + sufijo. */
export const paymentReference = (orderNumber: string, attempt: number) => `${orderNumber}-${attempt}`

export function paymentRedirect(order: { number: string; accessToken: string; customerEmail?: string | null; customerName?: string | null; customerPhone?: string | null }, amount: number, attempt: number) {
  const reference = paymentReference(order.number, attempt)
  const back = `${siteUrl()}/pedido/${order.accessToken}`
  if (paymentProvider() === 'wompi') {
    return wompiCheckoutUrl({ reference, amountInCents: Math.round(amount) * 100, redirectUrl: back, email: order.customerEmail, name: order.customerName, phone: order.customerPhone })
  }
  return `/pago/simulado?ref=${encodeURIComponent(reference)}&t=${encodeURIComponent(order.accessToken)}`
}
