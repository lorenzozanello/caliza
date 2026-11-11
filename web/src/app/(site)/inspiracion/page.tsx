import type { Metadata } from 'next'
import { SocialViewer } from '@/components/SocialViewer'
import { getSettings } from '@/lib/payload'
import { officialSocialProfile } from '@/lib/official-channels'

export const metadata: Metadata = {
  title: 'Inspiración · Instagram y TikTok',
  description: 'Explora publicaciones públicas en el visor de inspiración de CALIZA GROUP.',
}

export default async function InspirationPage() {
  const settings = await getSettings()
  const approvedLinks = ((settings as typeof settings & { socialPostLinks?: { url: string; approved?: boolean }[] }).socialPostLinks ?? [])
    .filter((post) => post.approved)
    .map((post) => post.url)
  return (
    <div className="social-page page-top">
      <header className="social-page__intro wrap">
        <span className="eyebrow muted">CALIZA GROUP / Inspiración viva</span>
        <h1>La materia también se comparte.</h1>
        <p>Ideas, proyectos y superficies que inspiran. Conozca nuestros canales oficiales y explore las publicaciones seleccionadas por CALIZA.</p>
      </header>
      <div className="wrap"><SocialViewer links={approvedLinks} instagram={officialSocialProfile(settings.instagramUrl, 'instagram')} tiktok={officialSocialProfile(settings.tiktokUrl, 'tiktok')} /></div>
    </div>
  )
}
