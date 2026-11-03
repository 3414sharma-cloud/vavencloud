import './ownership.css'
import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { intro, night, steps, type Moment, type Step } from './ownership.data.ts'

/*
 * "A typical production handoff": the messaging guide's problem line, then one night, one step per screen.
 * Once the section reaches the top, the stage holds still under the header and scrolling moves it through
 * the five steps; after the last one the page carries on. Each step is a scene: the time, then the same
 * moment with three vendors (light panel) and with VavenCloud (dark panel): who is involved, what happens,
 * their reply as a chat bubble, a stamped verdict and how long each side has been down.
 * The progress bar along the top jumps to a step. Steps not on screen only fade, so screen readers still
 * read the whole night. If a step can't fit on one screen (small phones), or without JavaScript, the steps
 * simply follow one another down the page.
 */

type Side = 'vendors' | 'vaven'

/** Header height plus the progress bar and breathing room: what a step must leave free to fit on one screen */
const CHROME = 72 + 90

const clock = (m: number) => `0${2 + Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`
const pad = (n: number) => String(n).padStart(2, '0')

/* Status colours as Tailwind classes, written out in full so they are picked up by the build */
const stampTone: Record<Side, string> = {
  vendors: 'border-rose-500 text-rose-600 dark:border-rose-400 dark:text-rose-400',
  vaven: 'border-emerald-400 text-emerald-300',
}

/** How long a side has been down at minute `m` (VavenCloud's stops at 02:41) */
const downtime = (s: Side, m: number) => {
  const { start, fixed, end } = night
  if (s === 'vaven' && m >= fixed) return `<p class="ow-down"><span class="ow-dot bg-emerald-400" aria-hidden="true"></span>Fixed in <b>${fixed - start} min</b></p>`
  const down = m === start ? '<b>just now</b>' : `<b>${m - start} min</b>${m >= end ? ' and counting' : ''}`
  return `<p class="ow-down"><span class="ow-dot ow-dot--live bg-rose-500" aria-hidden="true"></span>Down ${down}</p>`
}

const pane = (m: Moment, s: Side, at: number) => `
            <div class="ow-pane ow-pane--${s} ${s === 'vaven' ? 'surface-ink' : ''}">
              <div class="ow-pane-top">
                <p class="ow-pane-label">${s === 'vendors' ? 'With three vendors' : 'With VavenCloud'}</p>
                ${downtime(s, at)}
              </div>
              <p class="ow-who"><span class="ow-avatar" aria-hidden="true">${icon(m.icon, 'h-4.5 w-4.5')}</span><span class="ow-who-name">${m.who}</span>${m.clock ? `<time class="ow-who-time">${m.clock}</time>` : ''}</p>
              <p class="ow-action">${m.text}</p>
              ${m.reply ? `<p class="ow-bubble">${m.reply}</p>` : ''}
              ${m.verdict ? `<span class="ow-stamp ${stampTone[s]}">${m.verdict}</span>` : ''}
            </div>`

const slide = (st: Step, i: number) => `
        <div class="ow-slide" data-slide="${i}" role="group" aria-labelledby="ow-step-${i}">
          <div class="ow-slide-head">
            <time class="ow-time">${clock(st.at)}</time>
            <div>
              <p class="ow-count" aria-hidden="true">${pad(i + 1)} / ${pad(steps.length)}</p>
              <h3 id="ow-step-${i}" class="ow-label">${st.label}</h3>
            </div>
          </div>
          <div class="ow-split">
            ${pane(st.vendors, 'vendors', st.at)}
            ${pane(st.vaven, 'vaven', st.at)}
          </div>
        </div>`

const html = () => `
<section id="ownership" class="pt-24 pb-20 sm:pt-32 sm:pb-24" aria-labelledby="ownership-title">
  <div class="container-page">
    <div class="max-w-5xl">
      ${sectionHeading({
        id: 'ownership-title',
        eyebrow: 'A typical production handoff',
        title: 'Your app has three vendors. <em>When it breaks, it has none.</em>',
        description: intro,
      })}
    </div>
  </div>

  <div class="ow-track" data-story style="--steps:${steps.length}">
    <div class="ow-stage">
      <div class="container-page">
        <div class="ow-hud">
          <p class="ow-hud-label">Tonight</p>
          <ol class="ow-progress">
            ${steps.map((st, i) => `<li><button type="button" class="ow-seg" data-goto="${i}" aria-label="Step ${i + 1}: ${st.label}"><i aria-hidden="true"></i><span aria-hidden="true">${clock(st.at)}</span></button></li>`).join('')}
          </ol>
          <p class="ow-hint" aria-hidden="true">Scroll ${icon('chevron-down', 'h-3.5 w-3.5')}</p>
        </div>
        <div class="ow-slides">
          ${steps.map(slide).join('')}
        </div>
      </div>
    </div>
  </div>

  <div class="container-page">
    <p class="ow-close">The outage didn’t need three vendors. <strong>It needed one owner.</strong> <a href="${routes.oneTeam}">See how one team works ${icon('arrow-right', 'h-4 w-4')}</a></p>
  </div>
</section>`

function initStory(root: HTMLElement): void {
  const slides = qsa('[data-slide]', root)
  const segs = qsa<HTMLButtonElement>('[data-goto]', root)
  const stage = qs('.ow-stage', root)
  let pinned = false
  let current = -1

  const show = (i: number) => {
    if (i === current) return
    current = i
    root.dataset.step = String(i)
    slides.forEach((s, k) => (s.dataset.state = k < i ? 'past' : k === i ? 'active' : 'future'))
    segs.forEach((b, k) => {
      b.dataset.state = k < i ? 'past' : k === i ? 'active' : 'future'
      b.setAttribute('aria-current', String(k === i))
    })
  }

  /** How far the stage can travel while it holds still: the track's height less the stage's */
  const travel = () => root.offsetHeight - stage.offsetHeight

  const update = () => {
    if (!pinned) return
    const p = Math.min(Math.max(-root.getBoundingClientRect().top / travel(), 0), 0.9999)
    show(Math.floor(p * slides.length))
  }

  // Hold the stage only if every step fits on one screen under the header; otherwise the steps follow each other
  const layout = () => {
    root.classList.remove('is-pinned')
    pinned = slides.every((s) => s.offsetHeight <= window.innerHeight - CHROME)
    root.classList.toggle('is-pinned', pinned)
    if (pinned) {
      current = -1
      update()
    } else {
      slides.forEach((s) => delete s.dataset.state)
    }
  }

  segs.forEach((b, k) =>
    b.addEventListener('click', () => {
      const top = root.getBoundingClientRect().top + window.scrollY + ((k + 0.5) / slides.length) * travel()
      window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    }),
  )

  let ticking = false
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        update()
      })
    },
    { passive: true },
  )
  // Re-check when the window really changes size, not when a phone's address bar shows or hides
  let size = [window.innerWidth, window.innerHeight]
  window.addEventListener('resize', () => {
    const [w, h] = size
    if (window.innerWidth === w && Math.abs(window.innerHeight - h) < 150) return
    size = [window.innerWidth, window.innerHeight]
    layout()
  })
  layout()
  document.fonts?.ready.then(layout)
}

export function ownershipSection(): Section {
  return {
    html: html(),
    init: () => initStory(qs('#ownership [data-story]')),
  }
}
