import Lenis from 'lenis'
import { prefersReducedMotion } from './motion.ts'

/*
 * Smooth (eased) scrolling for the whole page, using Lenis.
 * Lenis moves the real window scroll position every frame, so everything that already listens to
 * `scroll` (the header, scroll reveals, the pinned numbers story, the hero stage) keeps working.
 * Touch devices keep their own native momentum scrolling. Skipped entirely with reduced motion,
 * where the page scrolls natively and instantly.
 */

let lenis: Lenis | null = null

export function initSmoothScroll(): void {
  if (lenis || prefersReducedMotion()) return

  lenis = new Lenis({
    lerp: 0.09, // how quickly the page catches up with the wheel: lower is silkier, higher is snappier
    wheelMultiplier: 1,
    smoothWheel: true,
  })

  const frame = (time: number) => {
    lenis?.raf(time)
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)

  // In-page links glide to their target, stopping below the sticky header
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const link = (e.target as Element).closest<HTMLAnchorElement>('a[href*="#"]')
    if (!link || link.target) return
    // Links are written as "/#plans": same page, with a hash
    const url = new URL(link.href, window.location.href)
    if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return
    const hash = url.hash
    if (hash.length < 2) return
    const target = document.querySelector<HTMLElement>(hash)
    if (!target) return
    e.preventDefault()
    // Lenis already stops short by the page's `scroll-padding-top`, so the sticky header never covers the section
    lenis?.scrollTo(hash === '#top' ? 0 : target, { duration: 1.4 })
    history.pushState(null, '', hash)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  })
}

/** Scrolls the page to a vertical position, smoothly. Falls back to the browser's own scroll. */
export function scrollToY(y: number): void {
  if (lenis) lenis.scrollTo(y, { duration: 1.3 })
  else window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}
