import { qsa } from './dom.ts'

/**
 * Once an element has finished revealing, drop the reveal class and its stagger delay.
 * Otherwise `.reveal`'s transition (opacity/transform only, plus the inline delay) keeps overriding the
 * element's own Tailwind transition, which makes hover effects on revealed cards jump instead of ease.
 * Returns the function that cancels its fallback timer.
 */
function settle(el: HTMLElement): () => void {
  let done = false
  const finish = () => {
    if (done) return
    done = true
    el.classList.remove('reveal', 'is-visible')
    el.style.transitionDelay = ''
  }
  el.addEventListener('transitionend', (e) => e.target === el && e.propertyName === 'opacity' && finish())
  // Fallback for reduced motion (no transition runs) or an interrupted transition
  const timer = window.setTimeout(finish, 1600)
  return () => window.clearTimeout(timer)
}

/** What rises in on scroll in every section except the hero (which has its own entrance). */
/*
 * Never list anything that sits inside a scroll container (e.g. a <table> in an overflow-x-auto box):
 * moving it would overflow the box for a moment and flash a scrollbar. Reveal the box instead.
 */
// Cards that aren't an <article> carry data-reveal; a section's lead is the paragraph right after its title
const AUTO = ':is(h2, h2 + p, h3, h3 + p, article, figure, [role="region"], [data-reveal])'

/**
 * Tags headings, cards and tables below the hero with `.reveal` and a small stagger between
 * siblings, then runs `initReveal`. Skipped with reduced motion (content just shows).
 * Call once the page's sections are on screen (useAutoReveal does); returns the function that stops it.
 */
export function initAutoReveal(): () => void {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return () => {}
  // [data-no-reveal]: blocks that move their own content (e.g. the story's stacked cards, positioned every
  // frame from the scroll), where `.reveal`'s transform transition would drag behind every move
  const els = qsa(`#main > section:not(#top) ${AUTO}`).filter(
    (el) => !el.closest('.stats-panel, [data-done], [data-step], [data-no-reveal]'),
  )
  els.forEach((el) => {
    const siblings = el.parentElement ? [...el.parentElement.children].filter((c) => c.matches(AUTO)) : []
    const i = Math.min(Math.max(siblings.indexOf(el), 0), 4)
    el.classList.add('reveal')
    if (i) el.style.transitionDelay = `${i * 90}ms`
  })
  return initReveal()
}

/** Fades/slides in every `.reveal` element the first time it scrolls into view. Returns the function that stops it. */
export function initReveal(root: ParentNode = document): () => void {
  const els = qsa('.reveal', root)
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'))
    return () => {}
  }
  const timers: (() => void)[] = []
  const show = (el: HTMLElement) => {
    el.classList.add('is-visible')
    timers.push(settle(el))
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          show(el)
          observer.unobserve(el)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  )
  els.forEach((el) => observer.observe(el))

  // Anchor jumps can skip straight past elements (they never intersect): reveal anything already above the fold
  const pending = new Set(els)
  let frame = 0
  const sweep = () => {
    frame = 0
    // All the reads first, then all the writes, so the layout is worked out once a frame, not once per element
    const fold = window.innerHeight
    const due = [...pending].filter((el) => {
      if (el.classList.contains('is-visible')) {
        pending.delete(el)
        return false
      }
      return el.getBoundingClientRect().top < fold
    })
    due.forEach((el) => {
      show(el)
      observer.unobserve(el)
      pending.delete(el)
    })
    if (!pending.size) window.removeEventListener('scroll', onScroll)
  }
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(sweep)
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  return () => {
    observer.disconnect()
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(frame)
    timers.forEach((cancel) => cancel())
  }
}
