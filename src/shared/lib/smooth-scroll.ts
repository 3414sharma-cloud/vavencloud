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

/** Run every frame straight after the scroll position moves (onScrollFrame) */
const frameHooks: (() => void)[] = []

/**
 * Runs `hook` every frame, in the same frame and just after the smooth scroll has moved the page, so anything
 * drawn from the scroll position (e.g. the story's stacked cards) moves in step with it instead of a frame
 * behind, which reads as jitter. Without smooth scrolling (reduced motion) it falls back to `scroll` events.
 * Keep hooks cheap: return early when nothing they draw from has changed.
 */
export function onScrollFrame(hook: () => void): void {
  frameHooks.push(hook)
  if (prefersReducedMotion()) {
    let pending = 0
    const run = () => {
      pending = 0
      hook()
    }
    window.addEventListener('scroll', () => (pending ||= requestAnimationFrame(run)), { passive: true })
  }
}

export function initSmoothScroll(): void {
  if (lenis || prefersReducedMotion()) return

  lenis = new Lenis({
    lerp: 0.09, // how quickly the page catches up with the wheel: lower is silkier, higher is snappier
    wheelMultiplier: 1,
    smoothWheel: true,
    // A box that scrolls on its own (the chat on v5) takes the wheel while it can still move that way; once it
    // reaches its end the page carries on, smoothly, instead of the wheel getting stuck on the box
    allowNestedScroll: true,
  })

  const frame = (time: number) => {
    lenis?.raf(time)
    frameHooks.forEach((hook) => hook())
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
    if (hash !== '#top') skipPast(target.getBoundingClientRect().top + window.scrollY - scrollPadding())
    lenis?.scrollTo(hash === '#top' ? 0 : target, { duration: 1.4 })
    history.pushState(null, '', hash)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  })
}

const scrollPadding = () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0

/**
 * Before a glide to `to`: if the way there crosses a [data-scroll-skip] block (the story's stacked cards,
 * which would otherwise flash past one after another), jump straight past it so the glide only covers the
 * rest. Going down, it lands where the block has just left the top of the screen; going up, where its top
 * meets the top of the screen.
 */
function skipPast(to: number): void {
  if (!lenis) return
  const from = window.scrollY
  let jump: number | undefined
  document.querySelectorAll<HTMLElement>('[data-scroll-skip]').forEach((block) => {
    const box = block.getBoundingClientRect()
    const top = box.top + from
    const bottom = box.bottom + from
    // Down past the block's end, or up past its start: the far edge, unless the target is closer
    if (to > from && bottom > from && bottom < to) jump = Math.max(jump ?? from, bottom)
    if (to < from && top < from && top > to) jump = Math.min(jump ?? from, top)
  })
  if (jump !== undefined) lenis.scrollTo(jump, { immediate: true, force: true })
}

/** Scrolls the page to a vertical position, smoothly (skipping past the story's cards). Falls back to the browser's own scroll. */
export function scrollToY(y: number): void {
  skipPast(y)
  if (lenis) lenis.scrollTo(y, { duration: 1.3 })
  else window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}
