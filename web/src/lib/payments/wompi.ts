import { createHash, timingSafeEqual } from 'node:crypto'

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex')

/** Firma de integridad del checkout web de Wompi: SHA256(referencia + monto en centavos + moneda + secreto). */
export function integritySignature(reference: string, amountInCents: number, currency: string, secret: string) {
  return sha256(`${reference}${amountInCents}${currency}${secret}`)
}

export function wompiCheckoutUrl(opts: { reference: string; amountInCents: number; redirectUrl: string; email?: string | null; name?: string | null; phone?: string | null }) {
  const pub = process.env.WOMPI_PUBLIC_KEY
  const secret = process.env.WOMPI_INTEGRITY_SECRET
  if (!pub || !secret) throw new Error('Faltan WOMPI_PUBLIC_KEY o WOMPI_INTEGRITY_SECRET')
  const base = process.env.WOMPI_CHECKOUT_URL || 'https://checkout.wompi.co/p/'
  const params = new URLSearchParams({
    'public-key': pub,
    currency: 'COP',
    'amount-in-cents': String(opts.amountInCents),
    reference: opts.reference,
    'signature:integrity': integritySignature(opts.reference, opts.amountInCents, 'COP', secret),
    'redirect-url': opts.redirectUrl,
  })
  if (opts.email) params.set('customer-data:email', opts.email)
  if (opts.name) params.set('customer-data:full-name', opts.name)
  if (opts.phone) params.set('customer-data:phone-number', opts.phone.replace(/\D/g, ''))
  return `${base}?${params.toString()}`
}

type WompiEvent = {
  event: string
  data: { transaction?: Record<string, unknown> }
  signature?: { properties: string[]; checksum: string }
  timestamp?: number
}

const pick = (obj: Record<string, unknown>, path: string): unknown =>
  path.split('.').reduce<unknown>((acc, k) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[k] : undefined), obj)

/** Verifica un evento de Wompi: SHA256(valores de las propiedades firmadas + timestamp + secreto de eventos). */
export function verifyWompiEvent(body: WompiEvent, secret: string): boolean {
  if (!body.signature?.properties || !body.signature.checksum || body.timestamp === undefined) return false
  const values = body.signature.properties.map((p) => String(pick(body.data as Record<string, unknown>, p) ?? '')).join('')
  const expected = sha256(`${values}${body.timestamp}${secret}`)
  const a = Buffer.from(expected, 'hex')
  const b = Buffer.from(String(body.signature.checksum).toLowerCase(), 'hex')
  return a.length === b.length && timingSafeEqual(a, b)
}

export type { WompiEvent }
