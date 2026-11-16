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

  const glide = initGlide(track, cards)

  arrows.forEach((a) =>
    a.addEventListener('click', () => {
      const step = cards[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap)
      glide.to(glide.nearest(glide.at() + Number(a.dataset.tmStep) * step))
    }),
  )

  // A sideways wheel, Shift + the wheel, or a sideways trackpad swipe: glided in, then onto a card
  track.addEventListener(
    'wheel',
    (e) => {
      if (prefersReducedMotion()) return
      const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX
      const dy = e.shiftKey ? 0 : e.deltaY
      if (Math.abs(dx) <= Math.abs(dy)) return
      e.preventDefault()
      e.stopPropagation() // not the page's smooth scroll as well
      const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? track.clientWidth : 1 // lines or pages, in pixels
      glide.wheel(dx * unit)
    },
    { passive: false },
  )

  // Drag with the mouse (touch scrolls it natively); let go and it carries on at that speed, then settles on a card
  let drag: { x: number; left: number; moved: boolean; samples: { t: number; x: number }[] } | null = null
  track.addEventListener('pointerdown', (e) => {
    glide.stop()
    if (e.pointerType === 'mouse' && e.button === 0)
      drag = { x: e.clientX, left: track.scrollLeft, moved: false, samples: [{ t: e.timeStamp, x: e.clientX }] }
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
    drag.samples.push({ t: e.timeStamp, x: e.clientX })
    drag.samples = drag.samples.filter((s) => e.timeStamp - s.t < 120)
  })
  window.addEventListener('pointerup', (e) => {
    const moved = drag?.moved
    const samples = drag?.samples ?? []
    drag = null
    if (!moved) return
    track.classList.remove('is-dragging')
    // The speed the pointer was moving at as it let go (the last 100ms; nothing if it had stopped first)
    const recent = samples.filter((s) => e.timeStamp - s.t < 100)
    const first = recent[0]
    const end = recent[recent.length - 1]
    const span = first && end ? end.t - first.t : 0
    const fresh = end !== undefined && e.timeStamp - end.t < 60
    glide.fling(span > 8 && fresh ? -(end.x - first.x) / span : 0)
    // Don't let the click that ends a drag play a video
    const swallow = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
    }
    track.addEventListener('click', swallow, { capture: true, once: true })
    window.setTimeout(() => track.removeEventListener('click', swallow, { capture: true }), 0)
  })
}

/** A flick slows down by friction: ms for its speed to drop by about two thirds (higher glides farther) */
const FRICTION = 325
/** Easing onto a target (a card, or where the wheel has sent it): ms to cover about two thirds of the way */
const EASE = 110
/** The fastest it can be flicked, pixels a millisecond */
const MAX_SPEED = 5

/**
 * Moves the row smoothly by script: a flick that slows down by friction, or an ease towards a target, and in both
 * cases it ends by easing onto the nearest card. While it moves, the CSS snap is off (.is-gliding), since the
 * browser's own snap would jump it; it lands exactly on a card, so turning the snap back on doesn't move it.
 * With reduced motion every move is instant.
 */
function initGlide(track: HTMLElement, cards: HTMLElement[]) {
  let pos = 0 // where the row is, unrounded (scrollLeft rounds)
  let velocity = 0 // pixels a millisecond, while flung
  let target: number | null = null
  let lastWheel = 0
  let frame = 0
  let last = 0

  const max = () => track.scrollWidth - track.clientWidth
  const clamp = (x: number) => Math.min(Math.max(x, 0), max())
  const at = () => (frame ? (target ?? pos) : track.scrollLeft)

  /** The card start closest to x, as a scroll position (cards snap to their start, inside the padding) */
  const nearest = (x: number) => {
    const pad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0
    const origin = track.getBoundingClientRect().left - track.scrollLeft
    let best = clamp(x)
    let gap = Infinity
    for (const c of cards) {
      const snap = clamp(c.getBoundingClientRect().left - origin - pad)
      if (Math.abs(snap - x) < gap) {
        gap = Math.abs(snap - x)
        best = snap
      }
    }
    return best
  }

  const stop = () => {
    cancelAnimationFrame(frame)
    frame = 0
    velocity = 0
    target = null
    track.classList.remove('is-gliding')
  }

  const tick = (now: number) => {
    const dt = Math.min(now - last, 64)
    last = now
    if (velocity) {
      pos = clamp(pos + velocity * dt)
      velocity *= Math.exp(-dt / FRICTION)
      // Slow enough, or at an end: settle onto the nearest card
      if (Math.abs(velocity) < 0.15 || pos <= 0 || pos >= max()) {
        velocity = 0
        target = nearest(pos)
      }
    } else if (target !== null) {
      pos += (target - pos) * (1 - Math.exp(-dt / EASE))
      if (Math.abs(target - pos) < 0.5) {
        pos = target
        // The wheel sends it anywhere; once the wheel has gone quiet, finish on a card
        const settled = nearest(pos)
        if (Math.abs(settled - pos) > 0.5) {
          if (now - lastWheel > 140) target = settled
        } else {
          track.scrollLeft = pos
          stop()
          return
        }
      }
    }
    track.scrollLeft = pos
    frame = requestAnimationFrame(tick)
  }

  const run = () => {
    track.classList.add('is-gliding')
    if (frame) return
    pos = track.scrollLeft
    last = performance.now()
    frame = requestAnimationFrame(tick)
  }

  return {
    at,
    nearest,
    stop,
    /** Ease to x */
    to(x: number) {
      if (prefersReducedMotion()) return void (track.scrollLeft = clamp(x))
      run()
      velocity = 0
      target = clamp(x)
    },
    /** Carry on at this speed (pixels a millisecond, + further along), slowing down, then onto a card */
    fling(speed: number) {
      if (prefersReducedMotion()) return void (track.scrollLeft = nearest(track.scrollLeft))
      run()
      target = null
      velocity = Math.max(Math.min(speed, MAX_SPEED), -MAX_SPEED)
      if (!velocity) target = nearest(pos)
    },
    /** Move by dx, eased, adding to where it's already heading */
    wheel(dx: number) {
      const from = at()
      run()
      velocity = 0
      lastWheel = performance.now()
      target = clamp(from + dx)
    },
  }
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
