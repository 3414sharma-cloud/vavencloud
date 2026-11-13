import './reviews.v2.css'
import type { Section } from '@/app/types.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { testimonials as v2Testimonials, type Testimonial } from '../v2.data.ts'

/** The reviews on show: v2's by default; a page can pass its own (v5 passes the clients' reviews with photos) */
let testimonials: Testimonial[] = v2Testimonials

/*
 * Chapter 3, client stories: only the clients' own words, on a light mist band, in one row of cards that
 * scrolls sideways, so it takes as many reviews as there are (v2.data.ts). Swipe, scroll sideways or drag it
 * with the mouse, or use the arrows; the bar under it shows where you are, and the edges fade where there's
 * more. Nothing moves by itself.
 *  - A written review underlines one phrase in the client's own words; the underline sweeps in when its card
 *    comes into view ([data-state] waiting → in, set by the script).
 *  - A video review shows YouTube's thumbnail and only loads the player (youtube-nocookie) when it is played.
 *    A sample (no video yet) shows a poster marked "Sample" instead, and nothing to play.
 *  - On a mouse, a soft light follows the pointer across the cards (--x, --y).
 */

const quoteMark = `<svg class="tm-mark" viewBox="0 0 48 36" aria-hidden="true"><path d="M0 36V22C0 9 7 1.5 19 0l2 5.5C14 7.5 11 12 11 17h8v19H0zm27 0V22C27 9 34 1.5 46 0l2 5.5C41 7.5 38 12 38 17h8v19H27z" /></svg>`

/** "Mohammed Imtiaz Ali" → "MA" (letters only, so "[Client name]" → "CN") */
const initials = (name: string) => {
  const words = name.replace(/[^\p{L} ]/gu, '').split(' ')
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
}

const quote = (t: Testimonial) => {
  if (!t.quote) return ''
  const text = t.highlight ? t.quote.replace(t.highlight, `<mark>${t.highlight}</mark>`) : t.quote
  return `<blockquote class="tm-quote">${text}</blockquote>`
}

const topic = (t: Testimonial) => (t.topic ? `<span class="tm-topic">${t.topic}</span>` : '')

const who = (t: Testimonial) => `
          <p class="tm-who">
            ${
              t.photo
                ? `<img class="tm-avatar tm-avatar--photo" src="${t.photo}" alt="" width="96" height="96" loading="lazy" draggable="false" />`
                : `<span class="tm-avatar" aria-hidden="true">${initials(t.name)}</span>`
            }
            <span><span class="tm-name">${t.name}</span><span class="tm-client">VavenCloud client</span></span>
          </p>`

const writtenCard = (t: Testimonial) => `
        <li class="tm-card" data-tm-card>
          <div class="flex items-start justify-between gap-4">
            ${quoteMark}
            ${topic(t)}
          </div>
          ${quote(t)}
          ${who(t)}
        </li>`

const playButton = `<span class="tm-play" aria-hidden="true">${icon('play', 'h-5 w-5 translate-x-0.5', true)}</span>`

/** YouTube's thumbnail, which loads the player when pressed; or, for a sample, a poster that says so */
const poster = (t: Testimonial, i: number) =>
  t.video
    ? `<button type="button" class="tm-poster" data-tm-play="${i}" aria-label="Play ${t.name}’s video review">
              <img src="https://i.ytimg.com/vi/${t.video.id}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" draggable="false" />
              ${playButton}
            </button>`
    : `<div class="tm-poster tm-poster--sample">
              <span class="tm-sample-tag">Sample</span>
              ${playButton}
              <span class="tm-sample-note">The client’s video goes here</span>
            </div>`

const videoCard = (t: Testimonial, i: number) => `
        <li class="tm-card tm-card--video" data-tm-card>
          <div class="tm-video">
            ${poster(t, i)}
          </div>
          <div class="mt-5 flex flex-wrap items-center justify-between gap-2">
            <span class="tm-badge">${icon('play', 'h-2.5 w-2.5', true)}Video review</span>
            ${topic(t)}
          </div>
          ${quote(t)}
          ${who(t)}
        </li>`

const html = () => `
<section id="clients" class="v2-section band-mist border-t border-neutral-200 dark:border-neutral-800" aria-labelledby="clients-title">
  <div class="container-page">
    <div class="mx-auto max-w-5xl text-center">
      ${sectionHeading({ id: 'clients-title', eyebrow: 'Client stories', title: 'Don’t take our word for it. <em>Take theirs.</em>' })}
    </div>
    <ul class="tm-track is-start" data-tm-track tabindex="0" aria-label="Client reviews. Scroll sideways for more.">
      ${testimonials.map((t, i) => (t.video || t.sample ? videoCard(t, i) : writtenCard(t))).join('')}
    </ul>
    <div class="tm-controls" data-tm-controls>
      <div class="tm-progress" aria-hidden="true"><span data-tm-thumb></span></div>
      <div class="flex gap-2">
        <button type="button" class="tm-arrow" data-tm-step="-1" aria-label="Previous reviews">${icon('chevron-left', 'h-5 w-5')}</button>
        <button type="button" class="tm-arrow" data-tm-step="1" aria-label="Next reviews">${icon('chevron-right', 'h-5 w-5')}</button>
      </div>
    </div>
  </div>
</section>`

/** The row: the bar, the arrows and the edge fades follow the scroll position; arrows move it a card at a time */
function initRow(track: HTMLElement, cards: HTMLElement[]): void {
  const controls = qs('[data-tm-controls]')
  const thumb = qs('[data-tm-thumb]', controls)
  const arrows = qsa<HTMLButtonElement>('[data-tm-step]', controls)

  const update = () => {
    const max = track.scrollWidth - track.clientWidth
    const atStart = track.scrollLeft <= 1
    const atEnd = track.scrollLeft >= max - 1
    controls.hidden = max <= 1
    track.classList.toggle('is-start', atStart)
    track.classList.toggle('is-end', atEnd)
    arrows[0].disabled = atStart
    arrows[1].disabled = atEnd
    // The thumb is as wide as the share on show, and slides along the rest
    const shown = track.clientWidth / track.scrollWidth
    const k = max > 0 ? track.scrollLeft / max : 0
    thumb.style.width = `${shown * 100}%`
    thumb.style.transform = `translateX(${((k * (1 - shown)) / shown) * 100}%)`
  }
  let ticking = false
  track.addEventListener('scroll', () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      ticking = false
      update()
    })
  })
  new ResizeObserver(update).observe(track)
  update()

  arrows.forEach((a) =>
    a.addEventListener('click', () => {
      const step = cards[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap)
      track.scrollBy({ left: Number(a.dataset.tmStep) * step, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    }),
  )

  // Drag with the mouse (touch and trackpads scroll it natively)
  let drag: { x: number; left: number; moved: boolean } | null = null
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button === 0) drag = { x: e.clientX, left: track.scrollLeft, moved: false }
  })
  window.addEventListener('pointermove', (e) => {
    if (!drag) return
    const dx = e.clientX - drag.x
    if (!drag.moved && Math.abs(dx) < 6) return
    if (!drag.moved) {
      drag.moved = true
      track.classList.add('is-dragging')
    }
    window.getSelection()?.removeAllRanges()
    track.scrollLeft = drag.left - dx
  })
  window.addEventListener('pointerup', () => {
    const moved = drag?.moved
    drag = null
    if (!moved) return
    // Snap back onto a card, and don't let the click that ends a drag play a video
    track.classList.remove('is-dragging')
    const swallow = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
    }
    track.addEventListener('click', swallow, { capture: true, once: true })
    window.setTimeout(() => track.removeEventListener('click', swallow, { capture: true }), 0)
  })
}

/** A video review: swap the thumbnail for YouTube's player, already playing */
function initVideos(track: HTMLElement): void {
  track.addEventListener('click', (e) => {
    const poster = (e.target as Element).closest<HTMLButtonElement>('[data-tm-play]')
    const video = poster && testimonials[Number(poster.dataset.tmPlay)].video
    if (!poster || !video) return
    const iframe = document.createElement('iframe')
    iframe.src = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1`
    iframe.title = video.title
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen'
    iframe.allowFullscreen = true
    iframe.className = 'tm-frame'
    poster.replaceWith(iframe)
    iframe.focus()
  })
}

function initTestimonials(): void {
  const track = qs('[data-tm-track]')
  const cards = qsa('[data-tm-card]', track)
  initRow(track, cards)
  initVideos(track)

  // The light under the pointer: each card knows where the pointer is, relative to itself
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    track.addEventListener('pointermove', (e) => {
      cards.forEach((c) => {
        const r = c.getBoundingClientRect()
        c.style.setProperty('--x', `${e.clientX - r.left}px`)
        c.style.setProperty('--y', `${e.clientY - r.top}px`)
      })
    })
  }

  // Each card's underline sweeps in once the card is on screen (sideways too), the ones arriving together in turn
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return
  cards.forEach((c) => (c.dataset.state = 'waiting'))
  const io = new IntersectionObserver(
    (entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .forEach((e, k) => {
          const card = e.target as HTMLElement
          card.style.setProperty('--d', String(k))
          card.dataset.state = 'in'
          io.unobserve(card)
        })
    },
    { threshold: 0.6 },
  )
  cards.forEach((c) => io.observe(c))
}

export function reviewsV2(list: Testimonial[] = v2Testimonials): Section {
  testimonials = list
  return { html: html(), init: initTestimonials }
}
