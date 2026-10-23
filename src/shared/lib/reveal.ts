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
}
