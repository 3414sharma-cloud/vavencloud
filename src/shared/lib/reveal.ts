import { qsa } from './dom.ts'

/**
 * Once an element has finished revealing, drop the reveal class and its stagger delay.
 * Otherwise `.reveal`'s transition (opacity/transform only, plus the inline delay) keeps overriding the
 * element's own Tailwind transition, which makes hover effects on revealed cards jump instead of ease.
 */
function settle(el: HTMLElement): void {
  let done = false
  const finish = () => {
    if (done) return
    done = true
    el.classList.remove('reveal', 'is-visible')
    el.style.transitionDelay = ''
  }
  el.addEventListener('transitionend', (e) => e.target === el && e.propertyName === 'opacity' && finish())
  // Fallback for reduced motion (no transition runs) or an interrupted transition
  window.setTimeout(finish, 1600)
}

/** What rises in on scroll in every section except the hero (which has its own entrance). */
/*
 * Never list anything that sits inside a scroll container (e.g. a <table> in an overflow-x-auto box):
 * moving it would overflow the box for a moment and flash a scrollbar. Reveal the box instead.
 */
const AUTO =
  ':is(.eyebrow, h2, h2 + p, h3, h3 + p, .section-lead, .card, article, figure, [role="region"], [data-reveal])'

/**
 * Tags headings, cards and tables below the hero with `.reveal` and a small stagger between
 * siblings, then runs `initReveal`. Skipped with reduced motion (content just shows).
 */
export function initAutoReveal(): void {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
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
  initReveal()
}

/** Fades/slides in every `.reveal` element the first time it scrolls into view. */
export function initReveal(root: ParentNode = document): void {
  const els = qsa('.reveal', root)
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'))
    return
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          el.classList.add('is-visible')
          settle(el)
          observer.unobserve(el)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  )
  els.forEach((el) => observer.observe(el))

  // Anchor jumps can skip straight past elements (they never intersect): reveal anything already above the fold
  const pending = new Set(els)
  let ticking = false
  const sweep = () => {
    ticking = false
    pending.forEach((el) => {
      if (el.classList.contains('is-visible')) pending.delete(el)
      else if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('is-visible')
        settle(el)
        observer.unobserve(el)
        pending.delete(el)
      }
    })
    if (!pending.size) window.removeEventListener('scroll', onScroll)
  }
  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(sweep)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
}
