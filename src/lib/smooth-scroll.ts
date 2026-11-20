import Lenis from 'lenis'
import { prefersReducedMotion } from './motion.ts'

/*
 * Smooth (eased) scrolling for the whole page, using Lenis.
 * Lenis moves the real window scroll position every frame, so everything that already listens to
 * `scroll` (the header, scroll reveals, the pinned numbers story, the hero stage) keeps working.
 * Touch devices keep their own native momentum scrolling. Skipped entirely with reduced motion,
 * where the page scrolls natively and instantly.
 *
 * Links don't need anything from here: they go through the router, and useScrollOnNavigate (hooks/) calls
 * glideTo() once the page they lead to is on screen.
 */

let lenis: Lenis | null = null

/** Run every frame straight after the scroll position moves (onScrollFrame) */
const frameHooks = new Set<() => void>()

/**
 * Runs `hook` every frame, in the same frame and just after the smooth scroll has moved the page, so anything
 * drawn from the scroll position (e.g. the story's stacked cards) moves in step with it instead of a frame
 * behind, which reads as jitter. Without smooth scrolling (reduced motion) it falls back to `scroll` events.
 * Keep hooks cheap: return early when nothing they draw from has changed. Returns the function that stops it.
 */
export function onScrollFrame(hook: () => void): () => void {
  frameHooks.add(hook)
  if (!prefersReducedMotion()) return () => frameHooks.delete(hook)
  let pending = 0
  const run = () => {
    pending = 0
    hook()
  }
  const onScroll = () => (pending ||= requestAnimationFrame(run))
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => {
    frameHooks.delete(hook)
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(pending)
  }
}

/** Starts smooth scrolling for the app (once; not with reduced motion). Returns the function that stops it. */
export function startSmoothScroll(): () => void {
  if (lenis || prefersReducedMotion()) return () => {}

  lenis = new Lenis({
    lerp: 0.09, // how quickly the page catches up with the wheel: lower is silkier, higher is snappier
    wheelMultiplier: 1,
    smoothWheel: true,
    // A box that scrolls on its own (the chat on v5) takes the wheel while it can still move that way; once it
    // reaches its end the page carries on, smoothly, instead of the wheel getting stuck on the box
    allowNestedScroll: true,
  })

  let frameId = 0
  const frame = (time: number) => {
    lenis?.raf(time)
    frameHooks.forEach((hook) => hook())
    frameId = requestAnimationFrame(frame)
  }
  frameId = requestAnimationFrame(frame)
  const stopScrollbarWatch = cancelGlideOnScrollbarDrag()

  return () => {
    cancelAnimationFrame(frameId)
    stopScrollbarWatch()
    lenis?.destroy()
    lenis = null
  }
}

/**
 * Glides to a section (stopping below the sticky header, by the page's `scroll-padding-top`) or to the top (0),
 * skipping past the story's stacked cards on the way. `immediate` jumps instead. Without smooth scrolling it
 * jumps, as the browser does for a link to a section.
 */
export function glideTo(target: HTMLElement | 0, { duration = 1.4, immediate = false } = {}): void {
  if (!lenis) {
    if (target === 0) window.scrollTo({ top: 0, behavior: 'instant' })
    else target.scrollIntoView({ block: 'start', behavior: 'instant' })
    return
  }
  // The page may have just changed under it (another page opened): measure it again first, or Lenis keeps the
  // last page's height and stops short
  lenis.resize()
  if (immediate) {
    lenis.scrollTo(target, { immediate: true, force: true })
    return
  }
  if (target !== 0) skipPast(target.getBoundingClientRect().top + window.scrollY - scrollPadding())
  lenis.scrollTo(target, { duration })
}

/** Jumps straight to a vertical position (e.g. where the visitor was, going back to a page) */
export function jumpToY(y: number): void {
  if (!lenis) return window.scrollTo({ top: y, behavior: 'instant' })
  // Measured again first: going back, the page has only just been rebuilt (see glideTo)
  lenis.resize()
  lenis.scrollTo(y, { immediate: true, force: true })
}

/**
 * Grabbing the page's scrollbar mid-glide: the glide is cancelled on press, and again on every scroll while
 * dragging, so Lenis never pulls the page back against the drag. Not lenis.stop(): that adds .lenis-stopped,
 * whose `overflow: clip` (base.css) removes the scrollbar from under the cursor. Returns the function that stops it.
 */
function cancelGlideOnScrollbarDrag(): () => void {
  const cancel = () => lenis?.scrollTo(lenis.scroll, { immediate: true, force: true })
  const root = document.documentElement
  const onScrollbar = (e: PointerEvent) => e.clientX >= root.clientWidth || e.clientY >= root.clientHeight

  const release = () => {
    window.removeEventListener('pointerup', release)
    window.removeEventListener('scroll', cancel)
  }
  const press = (e: PointerEvent) => {
    if (!onScrollbar(e)) return
    cancel()
    window.addEventListener('pointerup', release)
    window.addEventListener('scroll', cancel, { passive: true })
  }
  window.addEventListener('pointerdown', press)
  return () => {
    window.removeEventListener('pointerdown', press)
    release()
  }
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
