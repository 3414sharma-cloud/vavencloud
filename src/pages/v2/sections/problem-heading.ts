import { qs } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { problemIntro } from '../v2.data.ts'

/*
 * The problem's heading, shared by v2 (problem.v2.ts) and v3 (story.v3.ts): "Who do you call?" and what you
 * get ("Three vendors. Three answers." then "Zero fixes."), the night in a paragraph under it, all in one
 * column across the page. The beats wrap one per line where the screen is narrow. Its styles are .v2-tagline
 * in v2.css.
 */

/** A dry brush stroke under "Zero fixes.": the filter roughens its edges and leaves gaps where the bristles ran dry */
const brush = `<svg class="v2-brush" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <filter id="v2-brush-dry" filterUnits="userSpaceOnUse" x="-20" y="-20" width="440" height="80" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="7" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="7" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.014 0.5" numOctaves="2" seed="3" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  5 0 0 0 -1.05" result="streaks" />
          <feComposite in="rough" in2="streaks" operator="in" />
        </filter>
        <path d="M10 23 C 100 16, 230 14, 390 18" pathLength="1" filter="url(#v2-brush-dry)" />
      </svg>`

export const problemHeading = () => `
    <div class="max-w-5xl">
      <p class="eyebrow">Who do you call?</p>
      <h2 id="problem-title" class="section-title v2-tagline mt-6" data-tagline><span style="--i:0">Three vendors.</span> <span style="--i:1">Three answers.</span><br /><strong style="--i:2">Zero fixes.${brush}</strong></h2>
      <p class="section-lead mt-7">${problemIntro}</p>
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
