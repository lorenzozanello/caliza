'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

/** Coreografía de movimiento del sitio (ver brand/movimiento.md). Se desactiva con prefers-reduced-motion. */
export function Motion() {
  const pathname = usePathname()

  // Scroll suave y cursor: una vez por sesión de página
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis
    return () => { gsap.ticker.remove(tick); lenis.destroy() }
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    gsap.registerPlugin(ScrollTrigger)
    const cleanups: (() => void)[] = []
    const ctx = gsap.context(() => {
      const hero = document.querySelector('.hero') as HTMLElement | null
      if (hero && !reduce) {
        const img = hero.querySelector('.hero__media img')
        gsap.timeline({ defaults: { ease: 'power4.out' } })
          .from(img, { scale: 1.22, duration: 2.2, ease: 'expo.out' })
          .from(hero.querySelectorAll('.line > span'), { yPercent: 108, duration: 1.3, stagger: 0.09 }, '<.15')
          .from(hero.querySelectorAll('[data-hero-fade]'), { opacity: 0, y: 18, duration: 1.1, stagger: 0.12 }, '<.35')
        gsap.to('[data-hero-media]', { yPercent: 16, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
      }
      if (reduce) return

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, { y: 34, opacity: 0.15, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
      })
      gsap.utils.toArray<HTMLElement>('[data-img-reveal]').forEach((el) => {
        const t = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
        t.fromTo(el, { clipPath: 'inset(12% 10% 12% 10%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.out' })
        const img = el.querySelector('img')
        if (img) t.from(img, { scale: 1.25, duration: 2, ease: 'expo.out' }, 0)
      })
      document.querySelectorAll<HTMLElement>('[data-words]').forEach((p) => {
        if (!p.dataset.split) {
          p.innerHTML = (p.textContent || '').trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ')
          p.dataset.split = '1'
        }
        const spans = p.querySelectorAll('.w')
        ScrollTrigger.create({ trigger: p, start: 'top 78%', end: 'bottom 45%', scrub: true, onUpdate: (self) => {
          const n = Math.round(self.progress * spans.length)
          spans.forEach((s, i) => s.classList.toggle('is-on', i < n))
        } })
      })

      const mm = gsap.matchMedia()
      cleanups.push(() => mm.revert())
      const project = document.querySelector('.project')
      if (project) {
        mm.add('(min-width: 901px)', () => {
          const fade = project.querySelectorAll('[data-project-fade]')
          gsap.set(fade, { opacity: 0, y: 30 })
          gsap.timeline({ scrollTrigger: { trigger: project, start: 'top top', end: 'bottom bottom', scrub: 1 } })
            .to('[data-project-frame]', { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 1 })
            .to('[data-project-img]', { scale: 1, ease: 'power2.inOut', duration: 1 }, 0)
            .to(fade, { opacity: 1, y: 0, stagger: 0.08, duration: 0.35 }, 0.7)
        })
      }
      const coll = document.querySelector('[data-collection]')
      if (coll) {
        mm.add('(min-width: 1024px)', () => {
          const track = coll.querySelector('[data-track]') as HTMLElement
          const bar = coll.querySelector('[data-progress]') as HTMLElement | null
          const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
          if (distance() < 40) return
          gsap.to(track, { x: () => -distance(), ease: 'none', scrollTrigger: {
            trigger: coll, start: 'center center', end: () => '+=' + distance(), pin: true, scrub: 1, invalidateOnRefresh: true,
            onUpdate: (self) => { if (bar) bar.style.transform = `scaleX(${0.08 + self.progress * 0.92})` },
          } })
        })
      }
      const rail = document.querySelector('[data-rail]')
      if (rail) gsap.fromTo(rail, { scaleY: 0.04 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-steps]', start: 'top 70%', end: 'bottom 60%', scrub: true } })

      const follow = document.querySelector('[data-follow]') as HTMLElement | null
      const list = document.querySelector('[data-materials]') as HTMLElement | null
      if (follow && list && fine) {
        const imgs = follow.querySelectorAll('img')
        gsap.set(follow, { xPercent: -50, yPercent: -50, scale: 0.85 })
        const fx = gsap.quickTo(follow, 'x', { duration: 0.7, ease: 'power3.out' })
        const fy = gsap.quickTo(follow, 'y', { duration: 0.7, ease: 'power3.out' })
        const fr = gsap.quickTo(follow, 'rotation', { duration: 0.9, ease: 'power3.out' })
        let px = 0
        const move = (e: MouseEvent) => { fx(e.clientX); fy(e.clientY); fr(Math.max(-8, Math.min(8, (e.clientX - px) * 0.35))); px = e.clientX }
        const leave = () => { follow.classList.remove('on'); gsap.to(follow, { scale: 0.85, duration: 0.5 }) }
        list.addEventListener('mousemove', move)
        list.addEventListener('mouseleave', leave)
        list.querySelectorAll<HTMLElement>('[data-mat]').forEach((a) => {
          const enter = () => {
            const i = Number(a.dataset.mat)
            imgs.forEach((im, k) => im.classList.toggle('on', k === i))
            follow.classList.add('on')
            gsap.to(follow, { scale: 1, duration: 0.6, ease: 'power3.out' })
          }
          a.addEventListener('mouseenter', enter)
          cleanups.push(() => a.removeEventListener('mouseenter', enter))
        })
        cleanups.push(() => { list.removeEventListener('mousemove', move); list.removeEventListener('mouseleave', leave) })
      }
    })

    // Cursor contextual y botones magnéticos
    if (fine && !reduce) {
      const cursor = document.querySelector('.cursor') as HTMLElement | null
      document.documentElement.classList.add('has-cursor')
      if (cursor) {
        const label = cursor.querySelector('.cursor__label') as HTMLElement
        const cx = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3.out' })
        const cy = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3.out' })
        const move = (e: MouseEvent) => { cx(e.clientX); cy(e.clientY) }
        window.addEventListener('mousemove', move)
        cleanups.push(() => window.removeEventListener('mousemove', move))
        document.querySelectorAll<HTMLElement>('[data-cursor]').forEach((el) => {
          const on = () => { label.textContent = el.dataset.cursor || ''; cursor.classList.add('is-active') }
          const off = () => cursor.classList.remove('is-active')
          el.addEventListener('mouseenter', on)
          el.addEventListener('mouseleave', off)
          cleanups.push(() => { el.removeEventListener('mouseenter', on); el.removeEventListener('mouseleave', off); off() })
        })
      }
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
        const mx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
        const my = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
        const move = (e: MouseEvent) => { const r = el.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * 0.22); my((e.clientY - r.top - r.height / 2) * 0.3) }
        const leave = () => { mx(0); my(0) }
        el.addEventListener('mousemove', move)
        el.addEventListener('mouseleave', leave)
        cleanups.push(() => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave) })
      })
    }

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t = setTimeout(refresh, 400)
    return () => { clearTimeout(t); window.removeEventListener('load', refresh); cleanups.forEach((c) => c()); ctx.revert() }
  }, [pathname])

  return <div className="cursor" aria-hidden="true"><span className="cursor__dot" /><span className="cursor__label" /></div>
}
