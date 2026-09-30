const SOURCES: Record<string, string> = { instagram: 'Instagram', ig: 'Instagram', tiktok: 'TikTok', facebook: 'Facebook', fb: 'Facebook', google: 'Google' }

export function originLabel(src?: string | null) {
  if (!src) return 'la web'
  return SOURCES[src.toLowerCase()] ?? src
}

/** Enlace a WhatsApp con mensaje prellenado y origen de la visita. */
export function waLink(number: string, message: string, source?: string | null) {
  const text = `${message} (Los vi en ${originLabel(source)}.)`
  return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
}
