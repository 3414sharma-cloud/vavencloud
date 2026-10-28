import './stats.css'
import type { Section } from '@/app/types.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { personImage } from '@/shared/ui/portrait.ts'
import { engineers, stats, stories, type Engineer, type Stat, type StatId } from './stats.data.ts'

/*
 * "By the numbers" as a scroll story.
 * Desktop (lg+): the section is 4 screens tall with a sticky stage. Scrolling moves through one giant
 * number at a time; the step list on the left shows progress and jumps to a step on click.
 * Smaller screens: the same panels simply stack and reveal as they scroll into view.
 * All numbers are real text; illustrations are decorative (aria-hidden).
 */

const format = (s: Stat, n: number) =>
  `${s.prefix ?? ''}${n.toLocaleString('en-US', { minimumFractionDigits: s.decimals ?? 0, maximumFractionDigits: s.decimals ?? 0 })}${s.suffix ?? ''}`

/** Final value for screen readers, a counting copy for everyone else */
const value = (id: StatId) =>
  `<span class="sr-only">${format(stats[id], stats[id].value)}</span><span aria-hidden="true" data-count="${id}">${format(stats[id], stats[id].value)}</span>`

const pad = (n: number) => String(n).padStart(2, '0')

/* ---------- Illustrations ---------- */

const growthChart = () => `
  <svg class="h-auto w-64 xl:w-56" viewBox="0 0 220 120" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="stats-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3d69cc" stop-opacity="0.3" /><stop offset="1" stop-color="#3d69cc" stop-opacity="0" /></linearGradient>
    </defs>
    ${[24, 54, 84].map((y) => `<line x1="0" x2="220" y1="${y}" y2="${y}" class="stats-gridline" />`).join('')}
    <path class="stats-area" d="M0 106 C30 102 45 94 70 88 S110 72 130 64 S170 40 190 28 L208 18 V120 H0 Z" fill="url(#stats-area)" />
    <path class="stats-line" pathLength="1" d="M0 106 C30 102 45 94 70 88 S110 72 130 64 S170 40 190 28 L208 18" stroke="#3d69cc" stroke-width="3" stroke-linecap="round" />
    <circle class="stats-dot-halo" cx="208" cy="18" r="11" />
    <circle class="stats-dot" cx="208" cy="18" r="5" />
  </svg>`

const uptimeRing = () => `
  <svg class="h-40 w-40 xl:h-44 xl:w-44" viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <circle cx="50" cy="50" r="40" class="stats-ring-track" stroke-width="8" />
    <circle cx="50" cy="50" r="40" class="stats-ring" pathLength="100" stroke-width="8" stroke-linecap="round" transform="rotate(-90 50 50)" />
    <path class="stats-check" pathLength="1" d="M37 51l9 9 17-19" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`

const clock = () => `
  <svg class="h-40 w-40 xl:h-44 xl:w-44" viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <circle cx="50" cy="50" r="44" class="stats-clock-face" stroke-width="2" />
    ${Array.from({ length: 12 }, (_, i) => `<line x1="50" y1="10" x2="50" y2="${i % 3 === 0 ? 17 : 14}" class="stats-tick" stroke-width="${i % 3 === 0 ? 3 : 2}" stroke-linecap="round" transform="rotate(${i * 30} 50 50)" />`).join('')}
    <line x1="50" y1="50" x2="50" y2="28" class="stats-hand stats-hand--hour" stroke-width="4" stroke-linecap="round" />
    <line x1="50" y1="50" x2="50" y2="18" class="stats-hand stats-hand--minute" stroke-width="2.5" stroke-linecap="round" />
    <circle cx="50" cy="50" r="4" fill="#3d69cc" />
  </svg>`

/** Circular arrow drawing itself: clients coming back */
const returning = () => `
  <svg class="h-40 w-40 xl:h-44 xl:w-44" viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <circle cx="50" cy="50" r="38" class="stats-ring-track" stroke-width="8" />
    <path class="stats-line" pathLength="1" d="M50 12 A38 38 0 1 1 15.7 33.6" stroke="#3d69cc" stroke-width="8" stroke-linecap="round" />
    <path class="stats-check" pathLength="1" d="M6 22 L15.7 33.6 L28 27" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`
const art: Record<StatId, () => string> = { products: growthChart, years: clock, jobSuccess: uptimeRing, returning }

/* ---------- Markup ---------- */

const panel = (i: number) => {
  const { id, kicker } = stories[i]
  return `
  <li class="stats-panel" data-panel="${i}" ${i === 0 ? 'data-active' : ''}>
    <div class="stats-glass relative grid min-w-0 items-center gap-8 overflow-hidden rounded-3xl p-7 sm:p-10 xl:grid-cols-[minmax(0,1fr)_auto]">
      <div class="relative">
        <p class="inline-flex items-center gap-2 text-sm font-medium text-neutral-500">
          <span class="h-1.5 w-1.5 rounded-full bg-brand-500"></span>${kicker}
        </p>
        <p class="stats-big mt-3 text-6xl leading-none font-semibold tracking-tighter tabular-nums sm:text-7xl xl:text-[6.25rem]">${value(id)}</p>
        <p class="mt-5 text-xl font-semibold text-neutral-950 dark:text-white">${stats[id].label}</p>
        <p class="mt-2 max-w-sm leading-relaxed">${stats[id].note}</p>
      </div>
      <div class="stats-art relative flex justify-center xl:justify-end">${art[id]()}</div>
    </div>
  </li>`
}

const stepButton = (i: number) => `
  <li>
    <button type="button" class="stats-step group flex w-full items-center gap-4 rounded-lg py-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600" data-step="${i}" ${i === 0 ? 'aria-current="step"' : ''}>
      <span class="font-mono text-xs text-neutral-400">${pad(i + 1)}</span>
      <span class="flex-1">
        <span class="block text-sm font-medium text-neutral-500 transition-colors group-hover:text-neutral-800 group-aria-[current=step]:text-neutral-950 dark:group-hover:text-neutral-200 dark:group-aria-[current=step]:text-white">${stats[stories[i].id].label}</span>
        <span class="mt-2 block h-0.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <span class="stats-step-fill block h-full rounded-full"></span>
        </span>
      </span>
    </button>
  </li>`

const engineerCard = (e: Engineer) => `
  <li class="card group p-6">
    <div class="pt-avatar pt-avatar--hover h-16 w-16"><span class="pt-ring" aria-hidden="true"></span><span class="pt-photo">${personImage({ look: e.look, photo: e.photo, name: e.name })}</span></div>
    <p class="mt-5 font-semibold text-neutral-950 dark:text-white">${e.name}</p>
    <p class="mt-0.5 text-sm text-neutral-500">${e.speciality}</p>
    <p class="mt-3 text-sm leading-relaxed">${e.line}</p>
  </li>`

const html = () => `
<!-- lg:pt-24: the sticky stage below is exactly one screen tall, so on short laptops its content would touch the top line -->
<section id="proof" class="band-sky border-t border-neutral-200 lg:pt-24 dark:border-neutral-800" aria-labelledby="stats-title">
  <div id="stats-story" class="relative lg:h-[400vh]">
    <div class="relative overflow-hidden lg:sticky lg:top-18 lg:flex lg:h-[calc(100svh-4.5rem)] lg:items-center">
      <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div class="stats-dots absolute inset-0"></div>
      </div>

      <div class="container-page grid w-full gap-10 py-20 sm:py-24 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-center lg:gap-14 lg:py-0">
        <div>
          <h2 id="stats-title" class="section-title lg:!text-5xl lg:!text-wrap">Built by the team behind <span class="text-neutral-400 dark:text-neutral-500">210+ products.</span></h2>
          <p class="section-lead mt-4">VavenCloud is run by Vavensoft, the software company behind the numbers below.</p>
          <ol class="mt-10 hidden space-y-1 lg:block" aria-label="Numbers">
            ${stories.map((_, i) => stepButton(i)).join('')}
          </ol>
          <p class="mt-8 hidden items-center gap-2 text-xs text-neutral-500 lg:flex" data-stats-hint aria-hidden="true">
            <span class="stats-mouse"></span> Scroll to explore
          </p>
        </div>

        <ol class="stats-panels grid min-w-0 gap-5" role="list">
          ${stories.map((_, i) => panel(i)).join('')}
        </ol>
      </div>
    </div>
  </div>

  <div class="container-page pb-24 sm:pb-32 lg:pt-8">
    <h3 class="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-white">Meet your engineers</h3>
    <p class="mt-3 max-w-2xl">Real people with names, in your chat. These are the people who pick up when something breaks.</p>
    <ul class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" role="list">
      ${engineers.map(engineerCard).join('')}
    </ul>
  </div></section>`

/* ---------- Behaviour ---------- */

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
const frames = new WeakMap<Element, number>()

/** Counts one number up from zero (restarts if it was already counting). */
function countUp(el: HTMLElement, reduced: boolean): void {
  const s = stats[el.dataset.count as StatId]
  if (reduced) {
    el.textContent = format(s, s.value)
    return
  }
  cancelAnimationFrame(frames.get(el) ?? 0)
  const factor = 10 ** (s.decimals ?? 0)
  let begin = 0
  const step = (now: number) => {
    if (!begin) begin = now
    const t = (now - begin) / 1600
    el.textContent = format(s, Math.round(s.value * easeOutExpo(t) * factor) / factor)
    if (t < 1) frames.set(el, requestAnimationFrame(step))
  }
  frames.set(el, requestAnimationFrame(step))
}

function initStats(): void {
  const story = qs('#stats-story')
  const panels = qsa('[data-panel]', story)
  const steps = qsa<HTMLButtonElement>('[data-step]', story)
  const hint = qs('[data-stats-hint]', story)
  const reduced = prefersReducedMotion()
  const desktop = window.matchMedia('(min-width: 1024px)')
  let active = -1

  // Glass sheen follows the cursor
  qsa('.stats-glass', qs('#proof')).forEach((g) =>
    g.addEventListener('pointermove', (e) => {
      const r = g.getBoundingClientRect()
      g.style.setProperty('--mx', `${e.clientX - r.left}px`)
      g.style.setProperty('--my', `${e.clientY - r.top}px`)
    }),
  )

  const show = (panel: HTMLElement) => {
    panel.classList.add('is-shown')
    qsa('[data-count]', panel).forEach((el) => countUp(el, reduced))
  }

  /* Desktop: scroll position picks the step */
  const activate = (i: number) => {
    if (i === active) return
    active = i
    panels.forEach((p, k) => {
      const on = k === i
      p.toggleAttribute('data-active', on)
      p.classList.toggle('is-shown', false)
    })
    steps.forEach((b, k) => (k === i ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current')))
    // Let the panel become visible first, then replay its drawings
    requestAnimationFrame(() => show(panels[i]))
  }

  let ticking = false
  const update = () => {
    ticking = false
    if (!desktop.matches) return
    const total = story.offsetHeight - window.innerHeight
    const progress = Math.min(Math.max(-story.getBoundingClientRect().top / Math.max(total, 1), 0), 0.9999)
    const exact = progress * stories.length
    const i = Math.floor(exact)
    activate(i)
    steps.forEach((b, k) => b.style.setProperty('--p', String(k < i ? 1 : k === i ? exact - i : 0)))
    hint.style.opacity = progress > 0.05 ? '0' : '1'
  }
  const onScroll = () => {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(update)
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)

  steps.forEach((b, i) =>
    b.addEventListener('click', () => {
      const total = story.offsetHeight - window.innerHeight
      const top = story.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: top + (total * (i + 0.5)) / stories.length, behavior: reduced ? 'auto' : 'smooth' })
    }),
  )

  /* Smaller screens: stacked panels reveal (and count) once each */
  const onEnter = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting || desktop.matches) return
        onEnter.unobserve(e.target)
        show(e.target as HTMLElement)
      }),
    { threshold: 0.35 },
  )

  const setup = () => {
    active = -1
    if (desktop.matches) {
      update()
    } else {
      panels.forEach((p) => {
        p.removeAttribute('data-active')
        onEnter.observe(p)
      })
    }
  }
  desktop.addEventListener('change', setup)
  setup()

}

export function statsSection(): Section {
  return { html: html(), init: initStats }
}
