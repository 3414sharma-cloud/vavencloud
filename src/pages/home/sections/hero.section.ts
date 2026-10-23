import './hero.css'
import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { mountGradientWaves } from '@/shared/effects/gradient-waves.ts'
import { qs } from '@/shared/lib/dom.ts'
import { isMobileViewport, prefersReducedMotion } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'
import { heroHighlights, heroWords } from './hero.data.ts'
import { logoCloud } from './logo-cloud.ts'

const avatars = [
  { initials: 'AR', bg: 'bg-brand-500' },
  { initials: 'JK', bg: 'bg-brand-400' },
  { initials: 'ML', bg: 'bg-brand-600' },
  { initials: 'SP', bg: 'bg-brand-400' },
]

const html = () => `
<section id="top" data-nav="dark" class="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink-950 pt-32 pb-44 sm:pt-36">
  <!-- Background: WebGL gradient waves (brand palette), soft glow, readability scrim -->
  <div id="hero-waves" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true"></div>
  <div class="pointer-events-none absolute -top-56 left-1/2 -z-10 h-[560px] w-[1000px] -translate-x-1/2 rounded-full bg-brand-600/25 blur-[140px]" aria-hidden="true"></div>
  <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_45%_at_50%_45%,rgb(7_14_33/0.75),transparent_75%)]" aria-hidden="true"></div>
  <!-- Bottom blend: layered curved waves in the Services color (slate-50) instead of a straight edge -->
  <div class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-b from-transparent to-slate-50/15" aria-hidden="true"></div>
  <!-- Navbar colour zone: the solid light part of the wave edge counts as a light background -->
  <div data-nav="light" class="pointer-events-none absolute inset-x-0 bottom-0 h-10 sm:h-14 lg:h-16" aria-hidden="true"></div>
  <svg class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 w-full text-slate-50 sm:h-32 lg:h-40" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
    <path fill="currentColor" fill-opacity="0.25" d="M0,64 C180,112 360,24 600,56 C840,88 1020,136 1200,104 C1320,82 1390,60 1440,52 L1440,160 L0,160 Z" />
    <path fill="currentColor" fill-opacity="0.5" d="M0,100 C220,60 420,132 660,108 C900,84 1080,48 1260,80 C1350,96 1400,110 1440,104 L1440,160 L0,160 Z" />
    <path fill="currentColor" d="M0,128 C240,100 480,150 720,132 C960,114 1200,96 1440,124 L1440,160 L0,160 Z" />
  </svg>

  <div class="relative mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-6 text-center">
    <div class="reveal">
      <a href="${routes.services}" class="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pr-4 pl-1 text-sm text-slate-300 shadow-lg shadow-brand-900/30 backdrop-blur transition hover:border-brand-400/40 hover:bg-white/10">
        <span class="rounded-full bg-linear-to-r from-brand-500 to-brand-400 px-2.5 py-0.5 text-xs font-semibold text-white">New</span>
        Auto-scaling cloud servers now live
        ${icon('arrow-right', 'h-4 w-4 transition group-hover:translate-x-0.5')}
      </a>

      <h1 class="mx-auto mt-8 max-w-4xl text-4xl leading-[1.1] font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
        <!-- Screen readers / SEO get one stable sentence; the animated version is visual only -->
        <span class="sr-only">Web hosting and cloud services designed to scale with your business.</span>
        <span aria-hidden="true">
          <span class="block text-balance">Power your business with</span>
          <span class="block whitespace-nowrap">
            <span id="hero-rotator" class="rotator-word gradient-text animate-shimmer pb-[0.12em]">${heroWords[0]}</span>
          </span>
          <span class="block">designed to scale.</span>
        </span>
      </h1>

      <p class="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
        From fast, secure website hosting to scalable cloud servers, CDN, backups and business email, VavenCloud runs the infrastructure your business grows on, with experts on call 24/7.
      </p>

      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a href="${routes.contact}" class="btn-primary w-full !px-8 !py-3.5 !text-base sm:w-auto">Get Started ${icon('arrow-right', 'h-4 w-4')}</a>
        <a href="${routes.services}" class="btn-ghost w-full !px-8 !py-3.5 !text-base sm:w-auto">Explore Services</a>
      </div>

      <ul class="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-3">
        ${heroHighlights
          .map(
            (h) => `
        <li class="flex items-center gap-2 text-sm text-slate-300">
          <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-300">${icon('check', 'h-3 w-3')}</span>${h}
        </li>`,
          )
          .join('')}
      </ul>

      <div class="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <div class="flex -space-x-2">
          ${avatars
            .map(
              (a) =>
                `<span class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink-950 text-xs font-bold text-white ${a.bg}">${a.initials}</span>`,
            )
            .join('')}
        </div>
        <div class="text-center sm:text-left">
          <div class="flex justify-center text-brand-400 sm:justify-start">${icon('star', 'h-4 w-4', true).repeat(5)}</div>
          <p class="text-xs text-slate-400">Rated 4.9/5 by 2,000+ businesses</p>
        </div>
      </div>
    </div>
  </div>

  ${logoCloud()}
</section>`

/** WebGL wave background. If WebGL2 is unavailable it returns null and the plain ink background + glow remain. */
function initWaves() {
  mountGradientWaves(qs('#hero-waves'), {
    horizonColor: '#2a4791', // brand-700 – haze toward the horizon + shadow tint
    waveColor: '#3d69cc', // brand-500 – main wave body
    crestColor: '#bfd1f2', // brand-200 – crest highlights
    speed: 0.35,
    amplitude: 2.5,
    relief: 1,
    lightAngle: 120,
    sheen: 0.25,
    brightness: 0.95,
    opacity: 0.9,
    grain: 0.15,
    mouseInteraction: true,
    swellOnClick: true,
    // Performance: the waves are soft, so a lower render resolution is visually near-identical
    dpr: isMobileViewport() ? 0.75 : 1,
    quality: 'low', // 56 ray-march steps instead of 84
    maxFps: 30,
  })
}

/** Cycles the product word with a blur/slide transition. Paused while the tab is hidden or the hero is off-screen. */
function initRotator() {
  if (prefersReducedMotion()) return
  const hero = qs('#top')
  const rotator = qs('#hero-rotator', hero)
  let index = 0
  setInterval(() => {
    if (document.hidden || window.scrollY > hero.offsetHeight) return
    rotator.classList.add('is-out')
    window.setTimeout(() => {
      index = (index + 1) % heroWords.length
      rotator.textContent = heroWords[index]
      // Jump to the "below" position without animating, then animate up into place
      rotator.classList.replace('is-out', 'is-enter')
      void rotator.offsetWidth
      rotator.classList.remove('is-enter')
    }, 450)
  }, 2800)
}

export function heroSection(): Section {
  return {
    html: html(),
    init() {
      initWaves()
      initRotator()
    },
  }
}
