import './problem.css'
import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'

/**
 * Apple-style statement right after the hero. The words light up one by one as the visitor scrolls;
 * the `strong` part ends in full black, the rest in grey. The text is a normal paragraph for
 * screen readers (one span per word, real spaces between them).
 */
const statement: { text: string; strong?: boolean }[] = [
  { text: 'Most hosting stops at the server.' },
  { text: 'Whether your app actually works is left to you.', strong: true },
  { text: 'That gap is where launches stall, weekends disappear and customers leave.' },
]

const words = () =>
  statement
    .flatMap((part) => part.text.split(' ').map((w) => `<span class="problem-word" ${part.strong ? 'data-strong' : ''}>${w}</span>`))
    .join(' ')

export function problemSection(): Section {
  return {
    html: `
<section id="problem" class="py-24 sm:py-32 lg:py-40" aria-labelledby="problem-label">
  <div class="container-page">
    <div class="max-w-4xl">
      <p id="problem-label" class="text-sm font-semibold text-neutral-500">The problem</p>
      <p class="problem-text mt-4 text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl lg:text-[3.5rem]">${words()}</p>
      <a href="${routes.process}" class="problem-cta mt-10 inline-flex items-center gap-2 text-lg font-semibold text-brand-600 underline-offset-4 hover:underline dark:text-brand-400">
        We close that gap ${icon('arrow-right', 'h-4 w-4')}
      </a>
    </div>
  </div>
</section>`,
    init() {
      const text = qs('#problem .problem-text')
      const items = qsa('.problem-word', text)
      const cta = qs('#problem .problem-cta')
      const light = (count: number) => {
        items.forEach((w, i) => w.classList.toggle('is-lit', i < count))
        cta.classList.toggle('is-lit', count >= items.length)
      }

      if (prefersReducedMotion()) {
        light(items.length)
        return
      }

      // Starts lighting when the paragraph's top reaches 85% of the viewport, done when its bottom passes 72%
      let ticking = false
      const update = () => {
        ticking = false
        const rect = text.getBoundingClientRect()
        const vh = window.innerHeight
        const start = vh * 0.85
        const end = vh * 0.72 - rect.height
        const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1)
        light(Math.round(progress * items.length))
      }
      const onScroll = () => {
        if (ticking) return
        ticking = true
        requestAnimationFrame(update)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll)
      update()
    },
  }
}
