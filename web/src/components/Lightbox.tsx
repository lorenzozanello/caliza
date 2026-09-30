'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

type Item = { src: string; alt: string }
type LenisLike = { stop: () => void; start: () => void }

/** Visor de fotos: se abre con cualquier [data-zoom]; clic o toque sobre la foto acerca la veta y el puntero la recorre. */
export function Lightbox() {
  const [items, setItems] = useState<Item[]>([])
  const [index, setIndex] = useState(-1)
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')
  const dialog = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const open = index >= 0

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as HTMLElement).closest<HTMLElement>('[data-zoom]')
      if (!trigger) return
      e.preventDefault()
      const group = trigger.dataset.zoomGroup
      const all = Array.from(document.querySelectorAll<HTMLElement>(group ? `[data-zoom-group="${CSS.escape(group)}"]` : '[data-zoom]'))
      const unique = all.filter((el, i) => all.findIndex((o) => o.dataset.zoom === el.dataset.zoom) === i)
      opener.current = trigger
      setItems(unique.map((el) => ({ src: el.dataset.zoom!, alt: el.dataset.zoomAlt ?? '' })))
      setIndex(Math.max(0, unique.findIndex((el) => el.dataset.zoom === trigger.dataset.zoom)))
      setZoom(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const close = useCallback(() => { setIndex(-1); setZoom(false); opener.current?.focus() }, [])
  const go = useCallback((d: number) => { setZoom(false); setIndex((i) => (i + d + items.length) % items.length) }, [items.length])

  useEffect(() => {
    if (!open) return
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight' && items.length > 1) go(1)
      else if (e.key === 'ArrowLeft' && items.length > 1) go(-1)
      else if (e.key === 'Tab' && dialog.current) {
        const f = Array.from(dialog.current.querySelectorAll<HTMLElement>('button'))
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.documentElement.style.overflow = ''; lenis?.start() }
  }, [open, items.length, close, go])

  const pan = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setOrigin(`${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}% ${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`)
  }

  if (!open || !items[index]) return null
  const item = items[index]
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Visor de fotos" ref={dialog} data-testid="lightbox">
      <div className="lightbox__bar">
        <span className="small tnum" aria-live="polite">{items.length > 1 ? `${index + 1} / ${items.length}` : ''}</span>
        <button ref={closeBtn} type="button" className="icon-btn" onClick={close} aria-label="Cerrar visor">
          <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
        </button>
      </div>
      <button type="button" className={`lightbox__stage${zoom ? ' is-zoomed' : ''}`} onClick={(e) => { pan(e as unknown as React.PointerEvent<HTMLElement>); setZoom((z) => !z) }} onPointerMove={zoom ? pan : undefined} aria-label={zoom ? 'Alejar' : 'Acercar la veta'} aria-pressed={zoom}>
        <img key={item.src} src={item.src} alt={item.alt} style={{ transformOrigin: origin }} draggable={false} />
      </button>
      <div className="lightbox__foot">
        <span className="small lightbox__caption">{item.alt}</span>
        {items.length > 1 && (
          <div className="lightbox__nav">
            <button type="button" className="icon-btn" onClick={() => go(-1)} aria-label="Foto anterior">←</button>
            <button type="button" className="icon-btn" onClick={() => go(1)} aria-label="Foto siguiente">→</button>
          </div>
        )}
      </div>
    </div>
  )
}
