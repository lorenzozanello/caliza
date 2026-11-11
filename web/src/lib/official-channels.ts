/** Public channels confirmed by CALIZA GROUP on 11 November 2026. */
export const CALIZA_WHATSAPP = '573025983218'
export const CALIZA_INSTAGRAM = 'https://www.instagram.com/calizastonedesign/'
export const CALIZA_TIKTOK = 'https://www.tiktok.com/@calizastone'

export function officialWhatsApp(value?: string | null) {
  const candidate = (value ?? '').replace(/\D/g, '')
  // An old CMS value must not silently override the number confirmed by the owner.
  return candidate === CALIZA_WHATSAPP ? candidate : CALIZA_WHATSAPP
}

export function officialSocialProfile(value: string | null | undefined, platform: 'instagram' | 'tiktok') {
  const fallback = platform === 'instagram' ? CALIZA_INSTAGRAM : CALIZA_TIKTOK
  if (!value) return fallback
  try {
    const parsed = new URL(value)
    const host = parsed.hostname.toLowerCase()
    const valid = platform === 'instagram'
      ? ['instagram.com', 'www.instagram.com'].includes(host) && /^\/[\w.]+\/?$/.test(parsed.pathname)
      : ['tiktok.com', 'www.tiktok.com'].includes(host) && /^\/@[\w.-]+\/?$/.test(parsed.pathname)
    const canonical = `${parsed.origin}${parsed.pathname.replace(/\/?$/, '/')}`
    return parsed.protocol === 'https:' && valid && canonical === fallback ? canonical : fallback
  } catch { return fallback }
}
