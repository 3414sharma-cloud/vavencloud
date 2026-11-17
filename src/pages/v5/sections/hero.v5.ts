import '@/pages/home/sections/hero.css'
import type { Section } from '@/app/types.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'
import { heroSlides, type V5HeroSlide as HeroSlide } from '../v5.data.ts'

/*
 * v4's hero: the landing page's slider (hero.section.ts) with v4's slides (v5.data.ts), so their copy can change
 * here without touching the landing page, v2 or v3. Same markup, same hero.css, same behaviour:
 *
 * The hero: a slider of the three things we sell (24/7 DevOps support, managed cloud, cloud servers), centred,
 * with a numbered index underneath and two soft glows drifting behind. Each time a slide comes on (and on
 * load, for the first) it plays in: the title word by word, then the description, the
 * buttons and the note. The slider moves on by itself: the line over the active name fills to show how long
 * is left. It holds while a keyboard user is inside it or it is scrolled away. The names, the arrow keys and a swipe all change slide. With reduced motion nothing moves by
 * itself and the slides simply show. Slides not on show are inert, so only the visible one can be reached by
 * keyboard or screen reader.
 */

/** How long each slide stays before the next one, in ms. The first stays longer, so its title can play in. */
const DURATIONS = [9000, 8000, 8000]
const count = heroSlides.length

const newTab = '<span class="sr-only"> (opens in a new tab)</span>'

/** A title line split into words, so they can rise in one after another; `from` carries the count across lines */
const words = (text: string, from: number) =>
  text
    .split(' ')
    .map((w, k) => `<span class="hero-word" style="--w:${from + k}">${w}</span>`)
    .join(' ')

/** A slide: two-line title, description, the buttons and a reassuring note, all centred (v5: no eyebrow tag) */
const slide = (s: HeroSlide, i: number) => {
  const first = i === 0
  const tag = first ? 'h1' : 'h2'
  const lead = s.title[0].split(' ').length
  // The lines under the title start once its last word is on its way
  const after = lead + s.title[1].split(' ').length
  return `
      <div id="hero-slide-${i}" role="tabpanel" aria-roledescription="slide" aria-label="${i + 1} of ${count}: ${s.tab}" class="hero-slide${first ? ' is-active' : ''}${s.titleEm ? ' hero-slide--long-title' : ''}${s.longText ? ' hero-slide--long-text' : ''}" data-slide ${first ? '' : 'inert'} style="--after:${after}${s.titleEm ? `;--title-em:${s.titleEm}` : ''}">
        <${tag} ${first ? 'id="hero-title"' : ''} class="section-title hero-title"><span class="hero-title-line"><span>${words(s.title[0], 0)}</span></span><span class="hero-title-line"><em>${words(s.title[1], lead)}</em></span></${tag}>
        <p class="section-lead hero-description">${s.description}</p>
        <div class="hero-actions">
          <a href="${s.primary.href}" class="btn-primary !px-7 !py-3.5 !text-base">${s.primary.label} ${icon('arrow-right', 'h-4 w-4')}</a>
          <a href="${s.secondary.href}" ${s.secondary.external ? 'target="_blank" rel="noopener"' : ''} class="hero-link">${s.secondary.label}${s.secondary.external ? newTab : ''} ${icon('arrow-right', 'h-4 w-4')}</a>
        </div>
        ${s.reassurance ? `<p class="hero-reassurance">${s.reassurance}</p>` : ''}
      </div>`
}

/**
 * A fixed audio-style envelope with irregular peaks; the blue overlay tracks slide progress.
 */
const signalHeights = [5, 10, 16, 9, 22, 14, 7, 18, 11, 5]
const signalPath = signalHeights
  .map((height, i) => {
    const x = 6 + i * 7
    return `M${x} ${16 - height / 2}V${16 + height / 2}`
  })
  .join(' ')

const signalSvg = () => `
  <svg viewBox="0 0 75 32" fill="none" aria-hidden="true" focusable="false">
    <path class="hero-signal-line" d="${signalPath}" />
  </svg>`

/** One compact waveform above each slide label; only the active waveform fills. */
const tab = (s: HeroSlide, i: number) => `
            <button type="button" role="tab" id="hero-tab-${i}" aria-controls="hero-slide-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" class="hero-tab" style="--dur:${DURATIONS[i]}ms">
              <span class="hero-signal" aria-hidden="true">
                ${signalSvg()}
                <span class="hero-signal-fill">${signalSvg()}</span>
              </span>
              <span class="hero-tab-name"><span class="hero-tab-num" aria-hidden="true">0${i + 1}</span>${s.tab}</span>
            </button>`

const html = () => `
<section id="top" class="hero band-linen relative -mt-18 overflow-hidden border-b border-neutral-200 dark:border-neutral-800" aria-labelledby="hero-title">
  <div class="hero-glow" aria-hidden="true"><span></span><span></span></div>
  <div class="hero-noise" aria-hidden="true"></div>
  <div class="v5-spot" aria-hidden="true"></div>
  <div class="container-page relative pt-32 pb-14 sm:pt-40 sm:pb-20">
    <div class="hero-inner">
      <div data-carousel aria-roledescription="carousel" aria-label="What we do">
        <div class="hero-slides" data-slides>
          ${heroSlides.map(slide).join('')}
        </div>


        <div class="hero-nav hero-enter" style="--i:6">
          <div role="tablist" aria-label="Choose a slide" class="hero-tabs">
            ${heroSlides.map(tab).join('')}
          </div>

        </div>
      </div>
    </div>
  </div>
</section>`

function initSlider(root: HTMLElement): void {
  const slideEls = qsa('[data-slide]', root)
  const tabs = qsa<HTMLButtonElement>('[role="tab"]', root)
  let index = 0

  const go = (next: number, dir: 1 | -1, focusTab = false) => {
    next = (next + count) % count
    if (next === index) return
    const from = slideEls[index]
    const to = slideEls[next]
    // The new slide comes in from the side we're heading to; the old one leaves the other way
    root.style.setProperty('--out', `${-dir * 48}px`)
    to.style.transition = 'none'
    to.style.transform = `translateX(${dir * 48}px)`
    void to.offsetWidth
    to.style.removeProperty('transition')
    to.style.removeProperty('transform')
    from.classList.remove('is-active')
    from.inert = true
    to.classList.add('is-active')
    to.inert = false
    // The new active name's line starts filling by itself, as its CSS animation only applies while selected
    tabs.forEach((t, i) => {
      t.setAttribute('aria-selected', String(i === next))
      t.tabIndex = i === next ? 0 : -1
    })
    if (focusTab) tabs[next].focus()
    index = next
  }

  tabs.forEach((t, i) => t.addEventListener('click', () => go(i, i > index ? 1 : -1)))
  qs('[role="tablist"]', root).addEventListener('keydown', (e) => {
    const keys: Record<string, [number, 1 | -1]> = {
      ArrowRight: [index + 1, 1],
      ArrowLeft: [index - 1, -1],
      Home: [0, -1],
      End: [count - 1, 1],
    }
    if (!(e.key in keys)) return
    e.preventDefault()
    go(...keys[e.key], true)
  })

  // A sideways swipe on a touch screen changes slide; up and down still scroll the page
  const area = qs('[data-slides]', root)
  let touch: { x: number; y: number } | null = null
  area.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') touch = { x: e.clientX, y: e.clientY }
  })
  area.addEventListener('pointerup', (e) => {
    if (!touch) return
    const dx = e.clientX - touch.x
    const dy = e.clientY - touch.y
    touch = null
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1)
  })
  area.addEventListener('pointercancel', () => (touch = null))

  if (prefersReducedMotion()) {
    return
  }

  // The waveform's fill is also the slide timer; one completed fill advances to the next slide.
  root.addEventListener('animationend', (e) => {
    if (e.animationName === 'hero-wave-progress') go(index + 1, 1)
  })

  const holds = new Set<string>()
  const sync = () => {
    root.classList.toggle('is-paused', holds.size > 0)
  }
  const hold = (reason: string, on: boolean) => {
    if (on) holds.add(reason)
    else holds.delete(reason)
    sync()
  }
  root.addEventListener('focusin', (e) => (e.target as Element).matches(':focus-visible') && hold('focus', true))
  root.addEventListener('focusout', (e) => !root.contains(e.relatedTarget as Node | null) && hold('focus', false))
  // Only once it is wholly off screen, so a phone that starts with the slides half below the fold still plays
  new IntersectionObserver(([e]) => hold('offscreen', !e.isIntersecting)).observe(root)
}

/** A soft light that follows the mouse across the hero, eased (desktop mice only, not with reduced motion) */
function initSpotlight(hero: HTMLElement): void {
  if (prefersReducedMotion() || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
  const spot = qs('.v5-spot', hero)
  let x = 0.5
  let y = 0.4
  let tx = x
  let ty = y
  let frame = 0
  const step = () => {
    x += (tx - x) * 0.1
    y += (ty - y) * 0.1
    spot.style.setProperty('--sx', `${(x * 100).toFixed(2)}%`)
    spot.style.setProperty('--sy', `${(y * 100).toFixed(2)}%`)
    frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.0005 ? requestAnimationFrame(step) : 0
  }
  hero.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return
    const r = hero.getBoundingClientRect()
    tx = (e.clientX - r.left) / r.width
    ty = (e.clientY - r.top) / r.height
    hero.classList.add('is-lit')
    if (!frame) frame = requestAnimationFrame(step)
  })
  hero.addEventListener('pointerleave', () => hero.classList.remove('is-lit'))
}

export function heroV5(): Section {
  return {
    html: html(),
    init: () => {
      const hero = qs('#top')
      initSlider(qs('[data-carousel]', hero))
      initSpotlight(hero)
    },
  }
}
