import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 300
type Params = Promise<{ slug: string }>

async function getDoc(slug: string) {
  const payload = await getPayloadClient()
  const r = await payload.find({ collection: 'legal', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  return r.docs[0]
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const doc = await getDoc((await params).slug)
  return doc ? { title: doc.title, robots: doc.draft ? { index: false } : undefined } : {}
}

export default async function LegalPage({ params }: { params: Params }) {
  const doc = await getDoc((await params).slug)
  if (!doc) notFound()
  return (
    <article className="legal-page page-top wrap">
      <header className="legal-page__head">
        <span className="eyebrow muted">Información legal</span>
        <h1 className="h2">{doc.title}</h1>
        <span className="small muted">Actualizado el {new Date(doc.updatedAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        {doc.draft && <p className="form-error" role="note">Borrador pendiente de revisión legal. No es un texto definitivo.</p>}
      </header>
      <div className="legal-page__body"><RichText data={doc.body} /></div>
    </article>
  )
}
