import Link from 'next/link'

export function SiteFooter({ instagram, tiktok, whatsappHref }: { instagram?: string | null; tiktok?: string | null; whatsappHref: string }) {
  return (
    <footer className="site-footer">
      <div className="cols">
        <div className="c-1-4" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <img src="/brand/lockup_light.svg" alt="Caliza" style={{ height: 32, width: 'auto', alignSelf: 'flex-start' }} />
          <span className="small" style={{ color: 'var(--claro-2)' }}>Tradición italiana · Hecho en Colombia</span>
        </div>
        <div style={{ gridColumn: '6 / span 2' }}><h4>Líneas</h4><ul><li><Link href="/#lineas">Stone</Link></li><li><Link href="/design">Design</Link></li><li><Link href="/#care">Care</Link></li></ul></div>
        <div style={{ gridColumn: '8 / span 2' }}><h4>Estudio</h4><ul><li><Link href="/#proyecto">Proyectos</Link></li><li><Link href="/#materiales">Materiales</Link></li><li><Link href="/#contacto">Profesionales</Link></li></ul></div>
        <div style={{ gridColumn: '10 / span 3' }}><h4>Síguenos</h4><ul>
          {instagram && <li><a href={instagram} target="_blank" rel="noopener">Instagram</a></li>}
          {tiktok && <li><a href={tiktok} target="_blank" rel="noopener">TikTok</a></li>}
          <li><a href={whatsappHref} target="_blank" rel="noopener">WhatsApp</a></li>
        </ul></div>
      </div>
      <div className="legal"><span>Caliza Group</span><span>Tradición italiana · Hecho en Colombia</span></div>
    </footer>
  )
}
