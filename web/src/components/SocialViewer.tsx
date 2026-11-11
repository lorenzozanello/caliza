'use client'

import { useState } from 'react'
import { CALIZA_INSTAGRAM, CALIZA_TIKTOK } from '@/lib/official-channels'

type SocialPost = { url: string; platform: 'Instagram' | 'TikTok'; embed: string; id: string }
type Filter = 'Todas' | 'Instagram' | 'TikTok'

/** Only public, canonical individual posts; never arbitrary iframe sources. */
export function parseSocialPost(input: string): SocialPost | null {
  let url: URL
  try { url = new URL(input) } catch { return null }
  if (url.protocol !== 'https:') return null
  const host = url.hostname.toLowerCase()
  if (['instagram.com', 'www.instagram.com'].includes(host)) {
    const match = url.pathname.match(/^\/(p|reel|tv)\/([a-zA-Z0-9_-]{5,30})(?:\/|$)/)
    if (!match) return null
    const canonical = `https://www.instagram.com/${match[1]}/${match[2]}/`
    return { url: canonical, platform: 'Instagram', id: match[2], embed: `${canonical}embed/` }
  }
  if (['tiktok.com', 'www.tiktok.com'].includes(host)) {
    const match = url.pathname.match(/^\/@([a-zA-Z0-9._-]+)\/video\/(\d{10,25})(?:\/|$)/)
    if (!match) return null
    return { url: `https://www.tiktok.com/@${match[1]}/video/${match[2]}`, platform: 'TikTok', id: match[2], embed: `https://www.tiktok.com/embed/v2/${match[2]}` }
  }
  return null
}

/** Publication is editorial: visitors cannot insert or persist unapproved content. */
export function SocialViewer({ links = [], instagram = CALIZA_INSTAGRAM, tiktok = CALIZA_TIKTOK }: { links?: string[]; instagram?: string; tiktok?: string }) {
  const posts = links.map(parseSocialPost).filter((post): post is SocialPost => post !== null).filter((post, idx, all) => all.findIndex((x) => x.url === post.url) === idx).slice(0, 12)
  const [visible, setVisible] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('Todas')
  const filtered = posts.filter((post) => filter === 'Todas' || post.platform === filter)

  return (
    <div className="social-viewer social-viewer--public" data-testid="social-viewer">
      <div className="caliza-social-profile-grid" aria-label="Canales oficiales">
        <a href={instagram} target="_blank" rel="noopener noreferrer" className="caliza-social-profile">
          <span className="eyebrow">Instagram</span><strong>@calizastonedesign</strong><span>Proyectos, espacios y detalles del oficio ↗</span>
        </a>
        <a href={tiktok} target="_blank" rel="noopener noreferrer" className="caliza-social-profile">
          <span className="eyebrow">TikTok</span><strong>@calizastone</strong><span>La piedra en movimiento ↗</span>
        </a>
      </div>
      {posts.length > 0 ? <>
        <div className="social-viewer__heading">
          <span>{posts.length} {posts.length === 1 ? 'publicación seleccionada' : 'publicaciones seleccionadas'}</span>
          <div className="caliza-social-tabs" role="group" aria-label="Filtrar publicaciones">
            {(['Todas', 'Instagram', 'TikTok'] as const).map((option) => <button type="button" key={option} aria-pressed={filter === option} onClick={() => setFilter(option)}>{option}</button>)}
          </div>
        </div>
        <div className="social-viewer__grid">
          {filtered.map((post) => <article className="social-viewer__post" key={post.embed}>
            <div className="social-viewer__post-title"><span>{post.platform}</span><h2>Desde CALIZA</h2></div>
            {visible === post.embed
              ? <iframe src={post.embed} title={`Publicación seleccionada de ${post.platform}`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-popups" allow="encrypted-media; picture-in-picture" />
              : <div className="social-viewer__placeholder"><span>CALIZA</span><small>La publicación externa se carga solo cuando usted la solicita.</small></div>}
            <div className="social-viewer__actions">
              <button type="button" aria-pressed={visible === post.embed} onClick={() => setVisible(visible === post.embed ? null : post.embed)}>{visible === post.embed ? 'Ocultar' : 'Ver publicación'}</button>
              <a href={post.url} target="_blank" rel="noopener noreferrer">Abrir publicación ↗</a>
            </div>
          </article>)}
          {filtered.length === 0 && <p className="empty">Todavía no hay publicaciones seleccionadas para esta red.</p>}
        </div>
      </> : <div className="caliza-social-editorial-note"><h2>Una mirada a la materia.</h2><p>Las publicaciones destacadas se incorporarán cuando el equipo de CALIZA confirme su selección. Mientras tanto, puede explorar nuestros perfiles oficiales.</p></div>}
      <p className="social-viewer__disclaimer">El contenido de redes se carga únicamente tras su consentimiento. La disponibilidad de cada publicación depende de su plataforma de origen.</p>
    </div>
  )
}
