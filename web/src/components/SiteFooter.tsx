import Link from 'next/link'

export function SiteFooter({ instagram, tiktok, whatsappHref, legal = [] }: { instagram?: string | null; tiktok?: string | null; whatsappHref: string; legal?: { slug: string; title: string }[] }) {
  return (
    <footer className="site-footer">
      <div className="cols">
        <div className="c-1-4" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <img src="/brand/lockup_light.svg" alt="Caliza" style={{ height: 32, width: 'auto', alignSelf: 'flex-start' }} />
          <span className="small" style={{ color: 'var(--claro-2)' }}>Tradición italiana · Hecho en Colombia</span>
        </div>
        <div style={{ gridColumn: '6 / span 2' }}><h2 className="footer__title">Líneas</h2><ul><li><Link href="/stone">Stone</Link></li><li><Link href="/design">Design</Link></li><li><Link href="/care">Care</Link></li></ul></div>
        <div style={{ gridColumn: '8 / span 2' }}><h2 className="footer__title">Estudio</h2><ul><li><Link href="/proyectos">Proyectos</Link></li><li><Link href="/materiales">Materiales</Link></li><li><Link href="/estudio">Estudio</Link></li></ul></div>
        <div style={{ gridColumn: '10 / span 3' }}><h2 className="footer__title">Síguenos</h2><ul>
          {instagram && <li><a href={instagram} target="_blank" rel="noopener">Instagram</a></li>}
          {tiktok && <li><a href={tiktok} target="_blank" rel="noopener">TikTok</a></li>}
          <li><a href={whatsappHref} target="_blank" rel="noopener">WhatsApp</a></li>
        </ul></div>
      </div>
      <div className="legal">
        <span>© {new Date().getFullYear()} Caliza Group</span>
        {legal.length > 0 && <nav aria-label="Información legal" className="legal__links">{legal.map((l) => <Link key={l.slug} href={`/legal/${l.slug}`}>{l.title}</Link>)}</nav>}
      </div>
    </footer>
  )
}
