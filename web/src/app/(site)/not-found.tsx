import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="gateway">
      <span className="eyebrow muted">Página no encontrada</span>
      <h1 className="h2">Esta página no existe o cambió de lugar.</h1>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link className="btn" href="/">Volver al inicio</Link>
        <Link className="btn btn--ghost" href="/design">Ver la colección</Link>
      </div>
    </div>
  )
}
