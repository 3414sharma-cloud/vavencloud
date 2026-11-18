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

  cancelGlideOnScrollbarDrag()

  /*
   * Every link on this site scrolls smoothly:
   *  - to a section on this page ("/#plans" while on "/"): glides there, stopping below the sticky header;
   *  - to this same page without a section (e.g. "About VavenCloud" while on /team/): glides back to the top
   *    instead of reloading;
   *  - to a section on another page ("/#plans" from /comparison/): opens that page at the top, then
   *    glides down to the section (the section's id is handed over in sessionStorage, see glideAfterRoute).
   */
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const link = (e.target as Element).closest<HTMLAnchorElement>('a[href]')
    if (!link || link.target || link.hasAttribute('download')) return
    const url = new URL(link.href, window.location.href)
    if (url.origin !== window.location.origin) return
    const hash = url.hash.length > 1 ? url.hash : ''

    if (url.pathname !== window.location.pathname) {
      if (!hash) return // a page without a section: the browser opens it at the top as usual
      e.preventDefault()
      try {
        sessionStorage.setItem(GLIDE_KEY, hash)
      } catch {
        window.location.href = url.href // no storage: let the browser jump there
        return
      }
      window.location.href = url.pathname + url.search
      return
    }

    const target = hash ? document.querySelector<HTMLElement>(hash) : null
    if (hash && !target) return
    e.preventDefault()
    if (!target || hash === '#top') {
      lenis?.scrollTo(0, { duration: 1.4 })
      if (!hash && url.search === window.location.search) return
      history.pushState(null, '', hash || url.pathname + url.search)
      return
    }
    // Lenis already stops short by the page's `scroll-padding-top`, so the sticky header never covers the section
    skipPast(target.getBoundingClientRect().top + window.scrollY - scrollPadding())
    lenis?.scrollTo(target, { duration: 1.4 })
    history.pushState(null, '', hash)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  })

  glideAfterRoute()
}

/** sessionStorage key holding the section ("#plans") a link from another page asked for */
const GLIDE_KEY = 'vc-glide-to'

/**
 * Arriving from a link to a section on this page (see the click handler above): starts at the top, then,
 * once the page has laid out, glides down to that section and puts its #hash in the address bar.
 */
function glideAfterRoute(): void {
  let hash: string | null = null
  try {
    hash = sessionStorage.getItem(GLIDE_KEY)
    sessionStorage.removeItem(GLIDE_KEY)
  } catch {
    return
  }
  if (!hash) return
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  lenis?.scrollTo(0, { immediate: true, force: true })
  const go = () =>
    window.setTimeout(() => {
      const target = document.querySelector<HTMLElement>(hash!)
      if (!target || !lenis) return
      skipPast(target.getBoundingClientRect().top + window.scrollY - scrollPadding())
      lenis.scrollTo(target, { duration: 1.6 })
      history.replaceState(null, '', hash!)
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    }, 250)
  if (document.readyState === 'complete') go()
  else window.addEventListener('load', go, { once: true })
}

/**
 * Grabbing the page's scrollbar mid-glide: the glide is cancelled on press, and again on every scroll while
 * dragging, so Lenis never pulls the page back against the drag. Not lenis.stop(): that adds .lenis-stopped,
 * whose `overflow: clip` (base.css) removes the scrollbar from under the cursor.
 */
function cancelGlideOnScrollbarDrag(): void {
  const cancel = () => lenis?.scrollTo(lenis.scroll, { immediate: true, force: true })
  const root = document.documentElement
  const onScrollbar = (e: PointerEvent) => e.clientX >= root.clientWidth || e.clientY >= root.clientHeight

  const release = () => {
    window.removeEventListener('pointerup', release)
    window.removeEventListener('scroll', cancel)
  }

  window.addEventListener('pointerdown', (e) => {
    if (!onScrollbar(e)) return
    cancel()
    window.addEventListener('pointerup', release)
    window.addEventListener('scroll', cancel, { passive: true })
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
