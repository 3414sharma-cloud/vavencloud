import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { qs } from '@/shared/lib/dom.ts'
import { icon } from '@/shared/ui/icons.ts'
import { emergency } from '../v2.data.ts'

/*
 * Phones only: a bar at the foot of the screen with the booking button and the emergency line, so the next
 * step is never more than a tap away however far down the story a visitor is. It shows once the hero's
 * button has scrolled away and goes again at the booking form (where it would only repeat it).
 */
export function stickyCtaV2(): Section {
  return {
    html: `
<div class="v2-sticky" data-sticky-cta aria-hidden="true" inert>
  <a href="${routes.book}" class="btn-primary flex-1 !py-3">Book a free review ${icon('arrow-right', 'h-4 w-4')}</a>
  <a href="${emergency.href}" class="v2-sticky-call" aria-label="Site down right now? Call ${emergency.label}">${icon('phone', 'h-5 w-5')}</a>
</div>`,
    init() {
      const bar = qs<HTMLElement>('[data-sticky-cta]')
      const hero = qs('#top')
      const book = qs('#book')
      let ticking = false
      const update = () => {
        ticking = false
        const show = hero.getBoundingClientRect().bottom < 0 && book.getBoundingClientRect().top > window.innerHeight
        bar.classList.toggle('is-shown', show)
        bar.inert = !show
        bar.setAttribute('aria-hidden', String(!show))
      }
      window.addEventListener(
        'scroll',
        () => {
          if (ticking) return
          ticking = true
          requestAnimationFrame(update)
        },
        { passive: true },
      )
      update()
    },
  }
}
