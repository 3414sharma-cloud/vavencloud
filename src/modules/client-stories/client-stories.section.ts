import './client-stories.css'
import type { Section } from '@/app/types.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'
import { personImage } from '@/shared/ui/portrait.ts'
import { clientStories, isSample, type ClientStory, type Metric } from './client-stories.data.ts'

/*
 * "Founding client stories": a swipeable slider of client cards.
 * - Native scroll-snap track, so touch, trackpad and keyboard scrolling all work without JS.
 * - JS adds previous/next, dots that double as an autoplay timer, pause, and the active-slide effects.
 * - Autoplay pauses on hover, focus, when off screen, in a hidden tab, or after the visitor presses pause.
 *   It is off entirely with reduced motion.
 */

const AUTOPLAY_MS = 6500

/* ---------- Markup ---------- */

const format = (m: Metric, n: number) =>
  `${m.prefix ?? ''}${n.toLocaleString('en-US', { minimumFractionDigits: m.decimals ?? 0, maximumFractionDigits: m.decimals ?? 0 })}${m.suffix ?? ''}`

const slide = (s: ClientStory, i: number, total: number) => `
  <div class="cs-slide" data-cs-slide role="group" aria-roledescription="slide" aria-label="${i + 1} of ${total}">
    <div class="cs-card flex w-full flex-col rounded-3xl border border-neutral-200/80 bg-white p-7 shadow-card dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
      <div class="flex items-start justify-between gap-3">
        <div class="cs-avatar relative h-16 w-16 shrink-0">
          <span class="cs-ring" aria-hidden="true"></span>
          <span class="cs-photo block h-full w-full overflow-hidden rounded-full">${personImage(s)}</span>
        </div>
        ${isSample ? '<span class="rounded-full border border-dashed border-neutral-300 px-2.5 py-0.5 text-[11px] font-medium text-neutral-500 dark:border-neutral-700">Sample story</span>' : ''}
      </div>

      <p class="mt-5 font-semibold text-neutral-950 dark:text-white">${s.name}</p>
      <p class="text-sm text-neutral-600 dark:text-neutral-400">${s.role}, ${s.company}</p>
      <p class="mt-0.5 text-xs text-neutral-500">${s.industry} · ${s.country}</p>

      <blockquote class="cs-quote mt-5 mb-6 text-lg leading-relaxed text-pretty text-neutral-950 dark:text-white">“${s.quote}”</blockquote>

      <div class="mt-auto border-t border-neutral-200 pt-5 dark:border-neutral-800">
        <p class="cs-metric text-4xl font-semibold tracking-tight text-brand-600 tabular-nums dark:text-brand-300">
          <span class="sr-only">${format(s.metric, s.metric.value)}</span><span aria-hidden="true" data-cs-metric="${i}">${format(s.metric, s.metric.value)}</span>
        </p>
        <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">${s.metric.label}</p>
      </div>
    </div>
  </div>`

const dot = (i: number, name: string) => `
  <button type="button" class="cs-dotbtn" data-cs-dot="${i}" aria-label="Show story ${i + 1}: ${name}">
    <span class="cs-dot"><span class="cs-dot-fill"></span></span>
  </button>`

const roundBtn =
  'inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-950 shadow-sm transition-[border-color,color,box-shadow] duration-200 hover:border-brand-400 hover:text-brand-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:border-brand-400 dark:hover:text-brand-300 dark:focus-visible:outline-brand-400'

const html = () => `
<section id="client-stories" class="border-t border-neutral-200 py-20 sm:py-28 dark:border-neutral-800" aria-labelledby="cs-title" data-autoplay="off">
  <div class="container-page">
    <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <div class="max-w-3xl">
        <h2 id="cs-title" class="section-title">Founding client stories</h2>
        <p class="section-lead mt-5">What the first founders to hand over production say about their first 90 days.</p>
      </div>
      <div class="flex items-center gap-3">
        <button type="button" class="${roundBtn}" data-cs-prev aria-label="Previous story">${icon('chevron-left', 'h-5 w-5')}</button>
        <button type="button" class="${roundBtn}" data-cs-next aria-label="Next story">${icon('chevron-right', 'h-5 w-5')}</button>
      </div>
    </div>
    ${
      isSample
        ? '<p class="mt-6 max-w-2xl rounded-2xl border border-dashed border-neutral-300 px-4 py-3 text-sm text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"><span class="font-medium text-neutral-950 dark:text-white">Sample stories.</span> The people, companies, quotes and numbers here are placeholders for layout. Replace them with real, approved stories before launch.</p>'
        : ''
    }
  </div>

  <div role="region" aria-roledescription="carousel" aria-label="Founding client stories" class="mt-8" data-cs-root>
    <div class="cs-track" data-cs-track tabindex="0" aria-label="Client stories. Use the left and right arrow keys to move between them.">
      ${clientStories.map((s, i) => slide(s, i, clientStories.length)).join('')}
    </div>

    <div class="container-page mt-2 flex items-center justify-center gap-4">
      <div class="flex items-center" role="group" aria-label="Choose a story">
        ${clientStories.map((s, i) => dot(i, s.name)).join('')}
      </div>
      <button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white" data-cs-toggle aria-label="Pause automatic sliding" hidden>
        <span data-cs-icon-pause>${icon('pause', 'h-4 w-4')}</span>
        <span data-cs-icon-play hidden>${icon('play', 'h-4 w-4', true)}</span>
      </button>
    </div>
  </div>
</section>`

/* ---------- Behaviour ---------- */

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
const frames = new WeakMap<Element, number>()

/** Counts a metric up from zero (restarts if it was already counting). */
function countUp(el: HTMLElement, m: Metric, reduced: boolean): void {
  if (reduced || m.value === 0) {
    el.textContent = format(m, m.value)
    return
  }
  cancelAnimationFrame(frames.get(el) ?? 0)
  const factor = 10 ** (m.decimals ?? 0)
  let begin = 0
  const step = (now: number) => {
    if (!begin) begin = now
    const t = (now - begin) / 1300
    el.textContent = format(m, Math.round(m.value * easeOutExpo(t) * factor) / factor)
    if (t < 1) frames.set(el, requestAnimationFrame(step))
  }
  frames.set(el, requestAnimationFrame(step))
}

function initClientStories(): void {
  const section = qs('#client-stories')
  const root = qs('[data-cs-root]', section)
  const track = qs('[data-cs-track]', root)
  const slides = qsa('[data-cs-slide]', track)
  const dots = qsa<HTMLButtonElement>('[data-cs-dot]', root)
  const toggle = qs<HTMLButtonElement>('[data-cs-toggle]', root)
  const reduced = prefersReducedMotion()
  const last = slides.length - 1

  let current = -1
  let lockUntil = 0 // ignore scroll-derived updates while a programmatic scroll is running
  let hovering = false
  let focused = false
  let inView = false
  let userPaused = false

  const padLeft = () => parseFloat(getComputedStyle(track).paddingLeft) || 0
  const maxScroll = () => track.scrollWidth - track.clientWidth
  const targetFor = (i: number) => Math.min(Math.max(slides[i].offsetLeft - padLeft(), 0), maxScroll())

  const syncPause = () => {
    const paused = hovering || focused || !inView || userPaused || document.hidden
    section.toggleAttribute('data-paused', paused)
  }

  const setActive = (i: number) => {
    if (i === current) return
    current = i
    slides.forEach((s, k) => s.toggleAttribute('data-active', k === i))
    dots.forEach((d, k) => (k === i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')))
    const metric = qs<HTMLElement>(`[data-cs-metric="${i}"]`, slides[i])
    countUp(metric, clientStories[i].metric, reduced)
  }

  const goTo = (index: number) => {
    const i = (index + slides.length) % slides.length
    setActive(i)
    lockUntil = performance.now() + 900
    track.scrollTo({ left: targetFor(i), behavior: reduced ? 'auto' : 'smooth' })
  }

  /* The visitor scrolls or swipes: the slide nearest the left edge becomes active */
  let ticking = false
  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      ticking = false
      if (performance.now() < lockUntil) return
      if (track.scrollLeft >= maxScroll() - 2) return setActive(last)
      let best = 0
      let bestDistance = Infinity
      slides.forEach((s, k) => {
        const distance = Math.abs(s.offsetLeft - padLeft() - track.scrollLeft)
        if (distance < bestDistance) {
          best = k
          bestDistance = distance
        }
      })
      setActive(best)
    })
  }
  track.addEventListener('scroll', onScroll, { passive: true })

  qs('[data-cs-prev]', section).addEventListener('click', () => goTo(current - 1))
  qs('[data-cs-next]', section).addEventListener('click', () => goTo(current + 1))
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)))
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      goTo(current + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goTo(current - 1)
    }
  })

  /* Autoplay: the active dot fills over AUTOPLAY_MS and moving on is triggered when the fill ends */
  section.style.setProperty('--cs-delay', `${AUTOPLAY_MS}ms`)
  if (!reduced) {
    section.dataset.autoplay = 'on'
    toggle.hidden = false
    root.addEventListener('animationend', (e) => {
      if (e.animationName === 'cs-fill') goTo(current + 1)
    })
    toggle.addEventListener('click', () => {
      userPaused = !userPaused
      toggle.setAttribute('aria-label', userPaused ? 'Resume automatic sliding' : 'Pause automatic sliding')
      qs('[data-cs-icon-pause]', toggle).hidden = userPaused
      qs('[data-cs-icon-play]', toggle).hidden = !userPaused
      syncPause()
    })
    root.addEventListener('pointerenter', () => ((hovering = true), syncPause()))
    root.addEventListener('pointerleave', () => ((hovering = false), syncPause()))
    root.addEventListener('focusin', () => ((focused = true), syncPause()))
    root.addEventListener('focusout', () => ((focused = false), syncPause()))
    document.addEventListener('visibilitychange', syncPause)
  }

  new IntersectionObserver(
    (entries) => {
      inView = entries[0].isIntersecting
      syncPause()
    },
    { threshold: 0.35 },
  ).observe(root)

  window.addEventListener('resize', () => track.scrollTo({ left: targetFor(Math.max(current, 0)), behavior: 'auto' }))
  syncPause()
  setActive(0)
}

export function clientStoriesSection(): Section {
  return { html: html(), init: initClientStories }
}
