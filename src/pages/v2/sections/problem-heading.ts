import { intro } from '@/modules/ownership/ownership.data.ts'
import { qs } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'

/*
 * The problem's heading, shared by v2 (problem.v2.ts) and v3 (story.v3.ts): "Who do you call?" and the answer
 * up front ("One platform. One team." then "One call."), the intro under it, all in one column across the
 * page. The beats wrap one per line where the screen is narrow. Its styles are .v2-tagline in v2.css.
 */

export const problemHeading = () => `
    <div class="max-w-5xl">
      <p class="eyebrow">Who do you call?</p>
      <h2 id="problem-title" class="section-title v2-tagline mt-6" data-tagline><span style="--i:0">One platform.</span> <span style="--i:1">One team.</span><br /><strong style="--i:2">One call.</strong></h2>
      <p class="section-lead mt-7">${intro}</p>
    </div>`

/** The title: its three beats wait out of sight, then rise in one by one as it comes into view */
export function initTagline(): void {
  const tagline = qs('[data-tagline]')
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return
  tagline.dataset.state = 'waiting'
  const io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      tagline.dataset.state = 'in'
    },
    { threshold: 0.6 },
  )
  io.observe(tagline)
}
