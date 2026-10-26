import './hero.css'
import type { Section } from '@/app/types.ts'
import { mountGradientWaves, type GradientWavesOptions } from '@/shared/effects/gradient-waves.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { isMobileViewport, prefersReducedMotion } from '@/shared/lib/motion.ts'
import { getTheme, onThemeChange } from '@/shared/lib/theme.ts'
import { icon } from '@/shared/ui/icons.ts'
import { HERO_INTERVAL_MS, heroHighlights, heroSlides, type HeroSlide } from './hero.data.ts'

/* No display utility here: each button sets its own (prev/next are hidden on phones, swipe is used there) */
const controlButton =
  'h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white/70 text-neutral-700 backdrop-blur transition-colors hover:border-neutral-950 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-neutral-700 dark:bg-neutral-950/70 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white'

/** Wraps each word so the headline can rise in word by word. `start` continues the count across parts. */
const words = (text: string, start: number, extra = '') =>
  text
    .split(' ')
    .map((w, k) => `<span class="hero-word ${extra}" style="--w:${start + k}">${w}</span>`)
    .join(' ')

const slide = (s: HeroSlide, i: number, total: number) => {
  const heading = i === 0 ? 'h1' : 'h2'
  const titleCount = s.title.split(' ').length
  const highlightCount = s.highlight.split(' ').length
  return `
  <div id="hero-slide-${s.id}" class="hero-slide" role="tabpanel" aria-roledescription="slide" aria-label="${i + 1} of ${total}: ${s.tab}" data-slide ${i === 0 ? 'data-active' : 'inert'}>
    <div class="mx-auto max-w-4xl text-center">
      <p class="hero-in inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 py-1 pr-3.5 pl-1 text-sm font-medium text-neutral-700 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-300" style="--i:0">
        <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">${icon(s.icon, 'h-3.5 w-3.5')}</span>
        ${s.eyebrow}
      </p>
      <${heading} class="mx-auto mt-6 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-neutral-950 sm:text-6xl lg:text-7xl dark:text-white">
        ${words(s.title, 0)} ${words(s.highlight, titleCount, 'hero-highlight')}${s.titleEnd ? ` ${words(s.titleEnd, titleCount + highlightCount)}` : ''}
      </${heading}>
      <p class="hero-in mx-auto mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl" style="--i:5">${s.description}</p>
      <div class="hero-in mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row" style="--i:6">
        <a href="${s.primary.href}" class="btn-primary w-full !px-7 !py-3 !text-base sm:w-auto">${s.primary.label} ${icon('arrow-right', 'h-4 w-4')}</a>
        <a href="${s.secondary.href}" class="btn-secondary w-full !px-7 !py-3 !text-base sm:w-auto">${s.secondary.label}</a>
      </div>
    </div>
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

/*
 * "Built by anyone": tools and AI builders on glass chips, circling the headline on two rings that turn
 * in opposite directions. Each chip counter-rotates so its label stays upright. Wide screens only.
 */
const rings = [
  { radius: 470, dur: 90, reverse: false, tools: ['WordPress', 'Node.js', 'Laravel', 'Docker', 'React', 'Python', 'PostgreSQL'] },
  { radius: 600, dur: 130, reverse: true, tools: ['Cursor', 'Lovable', 'Bolt', 'v0', 'Replit', 'Next.js', 'Django', 'Vue', 'Redis'] },
]
const AI_TOOLS = new Set(['Cursor', 'Lovable', 'Bolt', 'v0', 'Replit'])

const chip = (name: string, angle: number, radius: number) => `
  <span class="hero-chip" style="--a:${angle}deg;--r:${radius}px">
    <span class="hero-chip-inner">
      ${icon(AI_TOOLS.has(name) ? 'sparkles' : 'code', 'h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400')}${name}
    </span>
  </span>`

const orbits = `
  <div class="hero-orbits absolute top-1/2 left-1/2 hidden h-[1300px] w-[1300px] -translate-x-1/2 -translate-y-1/2 lg:block">
    ${rings
      .map(
        (r) => `
    <div class="hero-ring ${r.reverse ? 'hero-ring--reverse' : ''}" style="--r:${r.radius}px;--dur:${r.dur}s">
      ${r.tools.map((t, k) => chip(t, (360 / r.tools.length) * k + (r.reverse ? 18 : 0), r.radius)).join('')}
    </div>`,
      )
      .join('')}
  </div>`

const html = () => `
<section id="top" class="hero relative isolate -mt-18 overflow-hidden border-b border-neutral-200 dark:border-neutral-800" style="--hero-accent:${heroSlides[0].accent};--hero-interval:${HERO_INTERVAL_MS}ms">
  <!-- Animated background: WebGL brand waves rising from the bottom, accent glow, orbit rings -->
  <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
    <div class="hero-orb hero-orb--a"></div>
    <div class="hero-spot absolute inset-0"></div>
    <div class="hero-glow absolute top-1/2 left-1/2 h-[620px] w-[min(1000px,140vw)] -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
    ${orbits}
    <div id="hero-waves" class="hero-waves absolute inset-x-0 bottom-0 h-[62%]"></div>
    <div class="hero-waves-fallback absolute inset-x-0 bottom-0 h-1/2"></div>
  </div>

  <div id="hero-slider" class="container-page relative flex min-h-[100svh] flex-col justify-center pt-38 pb-20 sm:pt-42 sm:pb-24" role="region" aria-roledescription="carousel" aria-label="What VavenCloud does">
    <div class="hero-track grid" data-hero-track aria-live="off">
      ${heroSlides.map((s, i) => slide(s, i, heroSlides.length)).join('')}
    </div>

    <!-- Frosted bar keeps the controls readable over the waves -->
    <div class="hero-dock mx-auto mt-16 flex w-full max-w-5xl flex-col items-center gap-5 rounded-[2rem] px-4 py-4 sm:mt-24 sm:px-6 sm:py-5">
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
function initSlider(onSlide?: (index: number) => void): void {
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
    onSlide?.(index)

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

/** Waves colours per theme. Light mode draws tinted waves on white; dark mode glows. */
const wavesTheme = (accent: string): GradientWavesOptions =>
  getTheme() === 'dark'
    ? { lightMode: false, horizonColor: '#3157b3', waveColor: accent, crestColor: '#dde7f8', brightness: 1.35, opacity: 1, sheen: 0.5 }
    : { lightMode: true, horizonColor: '#bfd1f2', waveColor: accent, crestColor: '#ffffff', brightness: 1.15, opacity: 0.9, sheen: 0.6 }

/**
 * WebGL wave field (shared/effects/gradient-waves.ts). Returns null without WebGL2, in which case the
 * CSS fallback gradient stays visible. The wave colour follows the active slide's accent.
 */
function initWaves(): ((index: number) => void) | undefined {
  const host = qs('#hero-waves')
  let accent = heroSlides[0].accent
  const waves = mountGradientWaves(host, {
    ...wavesTheme(accent),
    speed: 0.3,
    amplitude: 2.6,
    tilt: 68,
    relief: 1,
    lightAngle: 115,
    grain: 0.08,
    mouseInteraction: true,
    parallaxStrength: 0.6,
    swellOnClick: true,
    // Performance: soft shapes, so a lower render resolution looks the same
    dpr: isMobileViewport() ? 0.75 : 1,
    quality: 'low',
    maxFps: 30,
  })
  if (!waves) return undefined
  qs('#top').classList.add('has-waves')
  onThemeChange(() => waves.update(wavesTheme(accent)))
  return (index) => {
    accent = heroSlides[index].accent
    waves.update({ waveColor: accent })
  }
}

/** Soft light that follows the cursor across the hero (mouse only). */
function initSpotlight(): void {
  const hero = qs('#top')
  let frame = 0
  hero.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      const r = hero.getBoundingClientRect()
      hero.style.setProperty('--sx', `${e.clientX - r.left}px`)
      hero.style.setProperty('--sy', `${e.clientY - r.top}px`)
      hero.classList.add('has-spot')
    })
  })
  hero.addEventListener('pointerleave', () => hero.classList.remove('has-spot'))
}

export function heroSection(): Section {
  return {
    html: html(),
    init() {
      initSlider(initWaves())
      initSpotlight()
    },
  }
}
