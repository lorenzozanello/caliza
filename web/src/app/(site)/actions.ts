'use server'
import { redirect } from 'next/navigation'
import { getPayloadClient, getSettings } from '@/lib/payload'
import { describeSelection, isValidSelection, unitPrice, type Selection } from '@/lib/pricing'
import { paymentProvider, paymentRedirect } from '@/lib/payments'
import { applyPaymentResult } from '@/lib/payments/apply'

export type CheckoutInput = {
  items: { productId: number; selection: Selection; quantity: number }[]
  customer: { name: string; phone: string; email?: string }
  shipping: { city: string; address: string; propertyType?: string; floor?: string; elevator?: boolean; narrowStairs?: boolean; installation?: boolean }
  plan: 'completo' | 'anticipo'
  utmSource?: string | null
}

export type CheckoutResult = { ok: true; redirectUrl: string } | { ok: false; error: string; fields?: Record<string, string> }

const clean = (s: unknown, max = 200) => String(s ?? '').trim().slice(0, max)

export async function shippingQuote(city: string) {
  const settings = await getSettings()
  const match = settings.shippingCities?.find((c) => c.city.toLowerCase() === city.trim().toLowerCase())
  return match ? { cost: match.cost, known: true } : { cost: settings.defaultShippingCost ?? 0, known: false }
}

export async function createOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const fields: Record<string, string> = {}
  const name = clean(input.customer?.name, 120)
  const phone = clean(input.customer?.phone, 30)
  const email = clean(input.customer?.email, 120)
  const city = clean(input.shipping?.city, 80)
  const address = clean(input.shipping?.address, 200)
  if (name.length < 3) fields.name = 'Escribe tu nombre completo.'
  if (phone.replace(/\D/g, '').length < 10) fields.phone = 'Escribe un número de WhatsApp de 10 dígitos para poder confirmarte.'
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) fields.email = 'Revisa el correo: parece incompleto.'
  if (city.length < 2) fields.city = 'Elige la ciudad de entrega.'
  if (address.length < 5) fields.address = 'Escribe la dirección de entrega.'
  if (!Array.isArray(input.items) || input.items.length === 0) return { ok: false, error: 'Tu carrito está vacío.' }
  if (Object.keys(fields).length) return { ok: false, error: 'Revisa los datos marcados.', fields }

  const payload = await getPayloadClient()
  const lines = []
  let subtotal = 0
  let depositPercent = 0
  for (const it of input.items.slice(0, 20)) {
    const product = await payload.findByID({ collection: 'products', id: it.productId, depth: 0, overrideAccess: false }).catch(() => null)
    if (!product || product.status !== 'publicado') return { ok: false, error: 'Una de las piezas ya no está disponible. Revisa tu carrito.' }
    if (product.saleMode === 'cotizacion') return { ok: false, error: `${product.name} se cotiza directamente con el estudio.` }
    const selection = it.selection ?? {}
    if (!isValidSelection(product, selection)) return { ok: false, error: `La configuración de ${product.name} ya no está disponible.` }
    const quantity = Math.max(1, Math.min(10, Math.floor(it.quantity || 1)))
    if (product.saleMode === 'inmediata' && (product.stock ?? 0) < quantity) return { ok: false, error: `${product.name} está agotada.` }
    const price = unitPrice(product, selection)
    subtotal += price * quantity
    depositPercent = Math.max(depositPercent, product.saleMode === 'inmediata' ? 100 : (product.depositPercent ?? 50))
    lines.push({ product: product.id, name: product.name, config: describeSelection(product, selection), unitPrice: price, quantity })
  }
  const { cost: shippingCost } = await shippingQuote(city)
  const total = subtotal + shippingCost
  const plan = input.plan === 'completo' || depositPercent >= 100 ? 'completo' : 'anticipo'
  const amountDueNow = plan === 'completo' ? total : Math.round((total * depositPercent) / 100)

  const order = await payload.create({
    collection: 'orders',
    overrideAccess: true,
    data: {
      status: 'pendiente_pago',
      customerName: name,
      customerPhone: phone,
      customerEmail: email || undefined,
      shipping: {
        city, address,
        propertyType: clean(input.shipping.propertyType, 40),
        floor: clean(input.shipping.floor, 10),
        elevator: Boolean(input.shipping.elevator),
        narrowStairs: Boolean(input.shipping.narrowStairs),
        installation: Boolean(input.shipping.installation),
      },
      items: lines,
      subtotal, shippingCost, total,
      paymentPlan: plan,
      amountDueNow,
      amountPaid: 0,
      utmSource: clean(input.utmSource, 40) || undefined,
    },
  })
  const redirectUrl = paymentRedirect({ number: order.number!, accessToken: order.accessToken!, customerEmail: order.customerEmail, customerName: order.customerName, customerPhone: order.customerPhone }, amountDueNow, 1)
  return { ok: true, redirectUrl }
}

export async function simulatePayment(formData: FormData) {
  if (paymentProvider() !== 'simulated') throw new Error('El pago simulado está desactivado.')
  const reference = clean(formData.get('reference'), 60)
  const token = clean(formData.get('token'), 60)
  const outcome = formData.get('outcome') === 'approve' ? 'APPROVED' : 'DECLINED'
  const payload = await getPayloadClient()
  const found = await payload.find({ collection: 'orders', where: { accessToken: { equals: token } }, limit: 1, overrideAccess: true })
  const order = found.docs[0]
  if (!order || !reference.startsWith(order.number + '-')) throw new Error('Pedido no encontrado.')
  await applyPaymentResult(payload, { reference, transactionId: 'SIM-' + reference, status: outcome, amount: order.amountDueNow ?? order.total, provider: 'simulated', method: clean(formData.get('method'), 30) || 'Tarjeta' })
  redirect(`/pedido/${token}${outcome === 'APPROVED' ? '' : '?pago=rechazado'}`)
}

export async function retryPayment(formData: FormData) {
  const token = clean(formData.get('token'), 60)
  const payload = await getPayloadClient()
  const found = await payload.find({ collection: 'orders', where: { accessToken: { equals: token } }, limit: 1, overrideAccess: true })
  const order = found.docs[0]
  if (!order || order.status !== 'pendiente_pago') redirect(`/pedido/${token}`)
  const attempt = (order.payments?.length ?? 0) + 1
  redirect(paymentRedirect({ number: order.number!, accessToken: order.accessToken!, customerEmail: order.customerEmail, customerName: order.customerName, customerPhone: order.customerPhone }, order.amountDueNow ?? order.total, attempt))
}

export type LeadResult = { ok: true } | { ok: false; error: string; fields?: Record<string, string> }

export async function createLead(input: { name: string; phone: string; city?: string; intent: string; channel: string; message?: string; utmSource?: string | null }): Promise<LeadResult> {
  const fields: Record<string, string> = {}
  if (clean(input.name).length < 2) fields.name = 'Escribe tu nombre.'
  if (clean(input.phone).replace(/\D/g, '').length < 10) fields.phone = 'Escribe un número de 10 dígitos.'
  if (Object.keys(fields).length) return { ok: false, error: 'Revisa los datos marcados.', fields }
  const intents = ['proyecto', 'pieza', 'cuidado', 'orientacion'] as const
  const channels = ['whatsapp', 'videollamada'] as const
  const payload = await getPayloadClient()
  await payload.create({
    collection: 'leads', overrideAccess: true,
    data: {
      name: clean(input.name, 120), phone: clean(input.phone, 30), city: clean(input.city, 80) || undefined,
      intent: (intents as readonly string[]).includes(input.intent) ? (input.intent as (typeof intents)[number]) : 'orientacion',
      channel: (channels as readonly string[]).includes(input.channel) ? (input.channel as (typeof channels)[number]) : 'whatsapp',
      message: clean(input.message, 1000) || undefined, utmSource: clean(input.utmSource, 40) || undefined,
    },
  })
  return { ok: true }
}
