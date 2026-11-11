'use client'

import { useEffect, useState } from 'react'

type SocialPost = { url: string; platform: 'Instagram' | 'TikTok'; embed: string; id: string }
const STORAGE = 'caliza-social-viewer-v1'

/** Deliberately accepts individual public posts only. No arbitrary URLs or auto-fetch. */
export function parseSocialPost(input: string): SocialPost | null {
  let url: URL
  try { url = new URL(input) } catch { return null }
  if (url.protocol !== 'https:') return null
  const hostname = url.hostname.toLowerCase()
  if (hostname === 'instagram.com' || hostname === 'www.instagram.com') {
    const match = url.pathname.match(/^\/(p|reel|tv)\/([a-zA-Z0-9_-]{5,30})(?:\/|$)/)
    if (!match) return null
    const canonical = `https://www.instagram.com/${match[1]}/${match[2]}/`
    return { url: canonical, platform: 'Instagram', id: match[2], embed: `${canonical}embed/` }
  }
  if (hostname === 'tiktok.com' || hostname === 'www.tiktok.com') {
    const match = url.pathname.match(/^\/@([a-zA-Z0-9._-]+)\/video\/(\d{10,25})(?:\/|$)/)
    if (!match) return null
    return { url: `https://www.tiktok.com/@${match[1]}/video/${match[2]}`, platform: 'TikTok', id: match[2], embed: `https://www.tiktok.com/embed/v2/${match[2]}` }
  }
  return null
}

export function SocialViewer() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [value, setValue] = useState('')
  const [visible, setVisible] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(STORAGE) || '[]')
      if (Array.isArray(saved)) setPosts(saved.filter((x): x is SocialPost => typeof x?.url === 'string').map((x) => parseSocialPost(x.url)).filter((x): x is SocialPost => x !== null).slice(0, 8))
    } catch { /* Browsers with blocked storage still support in-memory viewing. */ }
    setReady(true)
  }, [])

  function save(next: SocialPost[]) {
    setPosts(next)
    try { localStorage.setItem(STORAGE, JSON.stringify(next.map(({ url }) => ({ url })))) } catch { /* Session still usable. */ }
  }

  function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const item = parseSocialPost(value.trim())
    if (!item) { setMessage('Introduce una publicación HTTPS de Instagram o un video público de TikTok.'); return }
    if (posts.some((p) => p.url === item.url || p.embed === item.embed)) { setMessage('Ese enlace ya se encuentra en el visor.'); return }
    if (posts.length >= 8) { setMessage('El visor admite hasta ocho publicaciones. Elimina alguna antes de continuar.'); return }
    save([...posts, item]); setValue(''); setMessage('Enlace guardado localmente. Pulsa Visualizar para cargar contenido externo.')
  }

  return (
    <div className="social-viewer" data-testid="social-viewer">
      <form onSubmit={add} className="social-viewer__form">
        <label htmlFor="social-post-url">Enlace público de una publicación</label>
        <div><input id="social-post-url" type="url" value={value} onChange={(e) => setValue(e.target.value)} placeholder="https://www.instagram.com/reel/…" required />
          <button type="submit">Añadir al visor <span aria-hidden="true">→</span></button></div>
        <p>Los contenidos de terceros solo se cargan cuando pulsas «Visualizar». Pueden requerir cookies o inicio de sesión en su plataforma.</p>
        <p role="status" aria-live="polite">{message}</p>
      </form>
      <div className="social-viewer__heading"><span>{ready ? posts.length : '…'} publicaciones guardadas en este navegador</span><button type="button" onClick={() => { save([]); setVisible(null); setMessage('Visor limpiado.') }} disabled={!posts.length}>Limpiar visor</button></div>
      <div className="social-viewer__grid">
        {posts.map((post) => (
          <article className="social-viewer__post" key={post.embed}>
            <div className="social-viewer__post-title"><span>{post.platform}</span><h2>Publicación {post.id.slice(0, 8)}</h2></div>
            {visible === post.embed ? <iframe src={post.embed} title={`Publicación de ${post.platform}`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-popups" allow="encrypted-media; picture-in-picture" /> : <div className="social-viewer__placeholder"><span>CALIZA</span><small>Contenido externo sin cargar</small></div>}
            <div className="social-viewer__actions">
              <button type="button" onClick={() => setVisible(visible === post.embed ? null : post.embed)}>{visible === post.embed ? 'Ocultar' : 'Visualizar'}</button>
              <a href={post.url} target="_blank" rel="noopener noreferrer">Abrir en la red ↗</a>
              <button type="button" onClick={() => { save(posts.filter((p) => p.embed !== post.embed)); if (visible === post.embed) setVisible(null) }}>Quitar</button>
            </div>
          </article>
        ))}
        {ready && posts.length === 0 && <div className="social-viewer__empty"><h2>Aún no hay publicaciones.</h2><p>Pega un enlace válido para probar el visualizador. No se consultan cuentas ni se publican medios automáticamente.</p></div>}
      </div>
      <p className="social-viewer__disclaimer">Para mostrar el feed oficial de Caliza harán falta los enlaces verificados, permisos y la integración autorizada para cada plataforma. Este visor no es un agregador automático de Instagram ni TikTok.</p>
    </div>
  )
}
