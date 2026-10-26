import './hero.css'
import type { Section } from '@/app/types.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'
import { HERO_INTERVAL_MS, heroHighlights, heroSlides, type HeroFloat, type HeroSlide } from './hero.data.ts'

/* No display utility here: each button sets its own (prev/next are hidden on phones, swipe is used there) */
const controlButton =
  'h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white/70 text-neutral-700 backdrop-blur transition-colors hover:border-neutral-950 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-neutral-700 dark:bg-neutral-950/70 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white'

/* Small "live" card floating beside the headline (wide screens only, decorative) */
const floatCard = (f: HeroFloat, position: string, i: number) => `
  <div class="hero-in absolute hidden xl:block ${position}" style="--i:${i}" aria-hidden="true">
    <div class="hero-bob flex w-60 items-center gap-3 rounded-xl border border-neutral-200 bg-white/85 p-3.5 text-left shadow-lg shadow-neutral-950/5 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/85 dark:shadow-black/30">
      <span class="icon-box !h-10 !w-10 border-brand-200 bg-brand-50 text-brand-600 dark:border-brand-900 dark:bg-brand-950 dark:text-brand-300">${icon(f.icon, 'h-5 w-5')}</span>
      <span class="min-w-0">
        <span class="block text-xs text-neutral-500">${f.label}</span>
        <span class="block truncate text-base font-semibold text-neutral-950 dark:text-white">${f.value}</span>
        <span class="mt-0.5 flex items-center gap-1.5 text-[11px] text-neutral-500">
          <span class="relative flex h-1.5 w-1.5"><span class="hero-ping absolute inset-0 rounded-full bg-emerald-500"></span><span class="relative h-1.5 w-1.5 rounded-full bg-emerald-500"></span></span>
          ${f.note}
        </span>
      </span>
    </div>
  </div>`

const slide = (s: HeroSlide, i: number, total: number) => {
  const heading = i === 0 ? 'h1' : 'h2'
  return `
  <div id="hero-slide-${s.id}" class="hero-slide" role="tabpanel" aria-roledescription="slide" aria-label="${i + 1} of ${total}: ${s.tab}" data-slide ${i === 0 ? 'data-active' : 'inert'}>
    <div class="mx-auto max-w-4xl text-center">
      <p class="hero-in inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 py-1 pr-3.5 pl-1 text-sm font-medium text-neutral-700 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-300" style="--i:0">
        <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">${icon(s.icon, 'h-3.5 w-3.5')}</span>
        ${s.eyebrow}
      </p>
      <${heading} class="hero-in mx-auto mt-6 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-neutral-950 sm:text-6xl lg:text-7xl dark:text-white" style="--i:1">
        ${s.title} <span class="hero-highlight">${s.highlight}</span>${s.titleEnd ? ` ${s.titleEnd}` : ''}
      </${heading}>
      <p class="hero-in mx-auto mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl" style="--i:2">${s.description}</p>
      <div class="hero-in mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row" style="--i:3">
        <a href="${s.primary.href}" class="btn-primary w-full !px-7 !py-3 !text-base sm:w-auto">${s.primary.label} ${icon('arrow-right', 'h-4 w-4')}</a>
        <a href="${s.secondary.href}" class="btn-secondary w-full !px-7 !py-3 !text-base sm:w-auto">${s.secondary.label}</a>
      </div>
    </div>
    ${floatCard(s.floats[0], '-top-14 left-0', 4)}
    ${floatCard(s.floats[1], '-bottom-16 right-0', 5)}
  </div>`
}

const tab = (s: HeroSlide, i: number) => `
  <button type="button" role="tab" id="hero-tab-${s.id}" aria-controls="hero-slide-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"
    class="group flex min-h-11 min-w-0 flex-col justify-center gap-2.5 rounded-md py-2 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600">
    <span class="sr-only items-center gap-2 text-sm font-medium text-neutral-500 transition-colors group-hover:text-neutral-800 group-aria-selected:text-neutral-950 sm:not-sr-only sm:flex dark:group-hover:text-neutral-200 dark:group-aria-selected:text-white">
      ${icon(s.icon, 'h-4 w-4 shrink-0')}<span class="truncate">${s.tab}</span>
    </span>
    <span class="relative block h-0.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
      <span class="hero-progress absolute inset-0 rounded-full bg-neutral-950 dark:bg-white"></span>
    </span>
  </button>`

/* Decorative orbit rings with travelling dots, centred behind the text */
const orbits = `
  <svg class="hero-orbits absolute top-1/2 left-1/2 h-[1100px] w-[1100px] -translate-x-1/2 -translate-y-1/2 text-neutral-300 dark:text-neutral-800" viewBox="0 0 1100 1100" fill="none">
    <g class="hero-orbit" style="--dur:70s">
      <circle cx="550" cy="550" r="300" stroke="currentColor" />
      <circle cx="550" cy="250" r="4" class="hero-orbit-dot" />
    </g>
    <g class="hero-orbit hero-orbit--reverse" style="--dur:100s">
      <circle cx="550" cy="550" r="420" stroke="currentColor" stroke-dasharray="2 8" />
      <circle cx="130" cy="550" r="5" class="hero-orbit-dot" />
      <circle cx="970" cy="550" r="3" class="hero-orbit-dot" />
    </g>
    <g class="hero-orbit" style="--dur:140s">
      <circle cx="550" cy="550" r="540" stroke="currentColor" />
      <circle cx="550" cy="1090" r="4" class="hero-orbit-dot" />
    </g>
  </svg>`

const html = () => `
<section id="top" class="hero relative isolate overflow-hidden border-b border-neutral-200 dark:border-neutral-800" style="--hero-accent:${heroSlides[0].accent};--hero-interval:${HERO_INTERVAL_MS}ms">
  <!-- Animated background: grid with data "beams", accent glow, drifting orbs, orbit rings -->
  <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
    <div class="hero-grid absolute inset-0"></div>
    <span class="hero-beam hero-beam--x" style="top:192px;--delay:0s"></span>
    <span class="hero-beam hero-beam--x" style="top:576px;--delay:3.5s"></span>
    <span class="hero-beam hero-beam--y hidden lg:block" style="left:256px;--delay:1.5s"></span>
    <span class="hero-beam hero-beam--y hidden lg:block" style="left:1216px;--delay:5s"></span>
    <div class="hero-orb hero-orb--a"></div>
    <div class="hero-orb hero-orb--b"></div>
    <div class="hero-glow absolute top-1/2 left-1/2 h-[620px] w-[min(1000px,140vw)] -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
    ${orbits}
    <div class="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-white dark:to-neutral-950"></div>
  </div>

  <div id="hero-slider" class="container-page relative flex min-h-[calc(100svh-4rem)] flex-col justify-center py-20 sm:py-24" role="region" aria-roledescription="carousel" aria-label="What VavenCloud does">
    <div class="hero-track grid" data-hero-track aria-live="off">
      ${heroSlides.map((s, i) => slide(s, i, heroSlides.length)).join('')}
    </div>

    <div class="mt-16 flex flex-col items-center gap-6 sm:mt-24">
      <div class="flex w-full max-w-3xl items-center gap-3 sm:gap-5">
        <button type="button" class="${controlButton} hidden shrink-0 sm:inline-flex" data-hero-prev aria-label="Previous slide">${icon('chevron-left', 'h-4 w-4')}</button>
        <div role="tablist" aria-label="Choose a service" class="grid min-w-0 flex-1 grid-cols-4 gap-2 sm:gap-4">
          ${heroSlides.map(tab).join('')}
        </div>
        <button type="button" class="${controlButton} hidden shrink-0 sm:inline-flex" data-hero-next aria-label="Next slide">${icon('chevron-right', 'h-4 w-4')}</button>
        <button type="button" class="${controlButton} inline-flex shrink-0" data-hero-toggle aria-label="Pause slideshow">
          <span data-icon-pause>${icon('pause', 'h-4 w-4')}</span>
          <span data-icon-play class="hidden">${icon('play', 'h-4 w-4')}</span>
        </button>
      </div>

      <ul class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
        ${heroHighlights.map((h) => `<li class="flex items-center gap-2">${icon('check', 'h-4 w-4 text-brand-600 dark:text-brand-400')}${h}</li>`).join('')}
      </ul>
    </div>
  </div>
</section>`

/**
 * Auto-rotating hero slider (APG "tabbed carousel" pattern).
 * The tab progress bar is a CSS animation; its `animationend` advances the slide, so pausing is just
 * `animation-play-state: paused` and the timer resumes exactly where it stopped.
 * Pauses on hover, keyboard focus, when off-screen, when the tab is hidden, or via the pause button.
 * With reduced motion there is no autoplay at all.
 */
function initSlider(): void {
  const hero = qs('#top')
  const slider = qs('#hero-slider', hero)
  const track = qs('[data-hero-track]', slider)
  const slides = qsa('[data-slide]', slider)
  const tabs = qsa<HTMLButtonElement>('[role="tab"]', slider)
  const bars = tabs.map((t) => qs('.hero-progress', t))
  const toggle = qs<HTMLButtonElement>('[data-hero-toggle]', slider)
  const reduced = prefersReducedMotion()
  const holds = new Set<'hover' | 'focus' | 'offscreen' | 'hidden'>()
  let index = 0
  let userPaused = false

  const autoplay = () => !reduced && !userPaused

  const sync = () => {
    slider.toggleAttribute('data-paused', userPaused || holds.size > 0)
    // Announce slide changes only when the visitor is driving the slider
    track.setAttribute('aria-live', autoplay() ? 'off' : 'polite')
    toggle.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow')
    qs('[data-icon-pause]', toggle).classList.toggle('hidden', userPaused)
    qs('[data-icon-play]', toggle).classList.toggle('hidden', !userPaused)
  }

  const go = (next: number, focusTab = false) => {
    index = (next + slides.length) % slides.length
    slides.forEach((s, i) => {
      const active = i === index
      s.toggleAttribute('data-active', active)
      s.inert = !active
    })
    tabs.forEach((t, i) => {
      t.setAttribute('aria-selected', String(i === index))
      t.tabIndex = i === index ? 0 : -1
    })
    if (focusTab) tabs[index].focus()
    hero.style.setProperty('--hero-accent', heroSlides[index].accent)

    // Restart the progress animation on the new tab
    bars.forEach((b) => b.classList.remove('is-running'))
    if (!reduced) {
      void bars[index].offsetWidth
      bars[index].classList.add('is-running')
    }
  }

  bars.forEach((bar, i) =>
    bar.addEventListener('animationend', (e) => {
      if (e.animationName === 'hero-progress' && i === index && autoplay()) go(index + 1)
    }),
  )

  tabs.forEach((t, i) => t.addEventListener('click', () => go(i)))
  qs('[role="tablist"]', slider).addEventListener('keydown', (e) => {
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: slides.length - 1 }
    if (!(e.key in keys)) return
    e.preventDefault()
    go(keys[e.key], true)
  })
  qs('[data-hero-prev]', slider).addEventListener('click', () => go(index - 1))
  qs('[data-hero-next]', slider).addEventListener('click', () => go(index + 1))

  if (reduced) {
    // No autoplay: hide the play/pause control and show the active bar as full
    toggle.hidden = true
    slider.classList.add('is-static')
  } else {
    toggle.addEventListener('click', () => {
      userPaused = !userPaused
      sync()
    })
  }

  // Swipe on touch screens
  let start: { x: number; y: number } | null = null
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') start = { x: e.clientX, y: e.clientY }
  })
  track.addEventListener('pointerup', (e) => {
    if (!start) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    start = null
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1))
  })

  const hold = (reason: Parameters<typeof holds.add>[0], on: boolean) => {
    if (on) holds.add(reason)
    else holds.delete(reason)
    sync()
  }
  slider.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && hold('hover', true))
  slider.addEventListener('pointerleave', () => hold('hover', false))
  // Keyboard focus only, so a mouse click on a tab doesn't freeze the slider
  slider.addEventListener('focusin', (e) => (e.target as Element).matches(':focus-visible') && hold('focus', true))
  slider.addEventListener('focusout', (e) => !slider.contains(e.relatedTarget as Node | null) && hold('focus', false))
  document.addEventListener('visibilitychange', () => hold('hidden', document.hidden))
  new IntersectionObserver(([entry]) => hold('offscreen', !entry.isIntersecting), { threshold: 0.15 }).observe(hero)

  go(0)
  sync()
}

export function heroSection(): Section {
  return { html: html(), init: initSlider }
}
