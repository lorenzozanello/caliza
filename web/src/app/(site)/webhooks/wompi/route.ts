import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { verifyWompiEvent, type WompiEvent } from '@/lib/payments/wompi'
import { applyPaymentResult } from '@/lib/payments/apply'

export async function POST(req: Request) {
  const secret = process.env.WOMPI_EVENTS_SECRET
  if (!secret) return NextResponse.json({ error: 'Webhook no configurado' }, { status: 503 })
  let body: WompiEvent
  try { body = (await req.json()) as WompiEvent } catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }
  if (!verifyWompiEvent(body, secret)) return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
  if (body.event !== 'transaction.updated' || !body.data.transaction) return NextResponse.json({ ok: true, ignored: true })
  const t = body.data.transaction as { id: string; reference: string; status: 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR' | 'PENDING'; amount_in_cents: number; payment_method_type?: string }
  const payload = await getPayloadClient()
  const res = await applyPaymentResult(payload, { reference: t.reference, transactionId: t.id, status: t.status, amount: Math.round(t.amount_in_cents / 100), provider: 'wompi', method: t.payment_method_type })
  return NextResponse.json({ ok: res.ok })
}
