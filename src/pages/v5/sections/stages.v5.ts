import type { Section } from '@/app/types.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { stages } from '../v5.data.ts'
import { stageArt } from './stage-art.v5.ts'

/*
 * Where are you today: the five moments founders come to us, in order from idea to "nobody owns it", each with
 * a small diagram of that moment (stage-art.v5.ts), the worry in their words and what we do about it. The cards
 * run along one row that scrolls round by itself, endlessly (the five are drawn twice, and the row slides the
 * width of one set, so it loops without a jump). Pointing at a card, or tabbing to one, stops the row and the
 * card pops up a little and turns night blue, its diagram's colours swapping with it (v5.css); let go and the row
 * carries on. With reduced motion the row doesn't move: it is one set of cards you scroll sideways.
 */

const card = (s: (typeof stages)[number], i: number, focusable: boolean) => `
        <li class="v4-stage"${focusable ? ' tabindex="0"' : ''}>
          <div class="v4-stage-art">${stageArt[s.id]}</div>
          <span class="v4-stage-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
          <h3 class="v4-stage-title">${s.title}</h3>
          <p class="v4-stage-worry">${s.worry}</p>
          <p class="v4-stage-answer"><b>What we do</b>${s.answer}</p>
        </li>`

export function stagesV5(): Section {
  return {
    html: `
<section id="stages" class="v2-section v4-stages-section border-t border-neutral-200 dark:border-neutral-800" aria-labelledby="stages-title">
  <div class="container-page">
    <div class="max-w-5xl">
      ${sectionHeading({
        id: 'stages-title',
        title: 'Wherever you are, <em>one team takes it from here.</em>',
        description: 'Founders come to us at five different moments. Find yours.',
      })}
    </div>
    <div class="v4-stage-marquee">
      <div class="v4-stage-track">
        <ol class="v4-stage-group">${stages.map((s, i) => card(s, i, true)).join('')}
        </ol>
      </div>
    </div>
  </div>
</section>`,
    init() {
      initStageFill()
      initMarquee()
    },
  }
}

/** The parts of a card whose colours change with the fill */
const PARTS = '.v4-stage-art, .v4-stage-n, .v4-stage-title, .v4-stage-worry, .v4-stage-answer'

/**
 * Where the pointer came in or left, so the card's night-blue fill grows from there and drains back to it
 * (v5.css). Each part's colours change as the fill's edge passes it (--d): coming in, the parts nearest the
 * pointer first; going out, the farthest first, since the fill shrinks toward the pointer. While the pointer is
 * on the card a soft glow follows it.
 */
function initStageFill(): void {
  qsa('#stages .v4-stage').forEach((card) => {
    const parts = qsa(PARTS, card)
    const at = (e: PointerEvent, filling: boolean) => {
      const r = card.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      card.style.setProperty('--mx', `${((x / r.width) * 100).toFixed(1)}%`)
      card.style.setProperty('--my', `${((y / r.height) * 100).toFixed(1)}%`)
      // Roughly the fill's reach over its run (1.1s in, 0.8s out, v5.css), against the card's diagonal
      const diagonal = Math.hypot(r.width, r.height)
      parts.forEach((p) => {
        const b = p.getBoundingClientRect()
        const near = Math.hypot(b.left - r.left + b.width / 2 - x, b.top - r.top + b.height / 2 - y) / diagonal
        const d = filling ? 0.12 + near * 0.85 : Math.max(0.6 - near * 0.6, 0)
        p.style.setProperty('--d', `${d.toFixed(3)}s`)
      })
    }

    let frame = 0
    let last: PointerEvent | undefined
    const follow = () => {
      frame = 0
      if (!last) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--gx', `${(((last.clientX - r.left) / r.width) * 100).toFixed(1)}%`)
      card.style.setProperty('--gy', `${(((last.clientY - r.top) / r.height) * 100).toFixed(1)}%`)
    }
    card.addEventListener('pointerenter', (e) => {
      at(e, true)
      last = e
      follow()
    })
    card.addEventListener('pointermove', (e) => {
      last = e
      if (!frame) frame = requestAnimationFrame(follow)
    })
    card.addEventListener('pointerleave', (e) => {
      at(e, false)
      last = undefined
    })
  })
}

/** How fast the row scrolls by itself, in pixels a millisecond (about 29 a second), leftwards */
const AUTO_SPEED = 0.029
/**
 * How the row slows down and speeds up, as the time (ms) its speed takes to change by about two thirds of the way
 * to where it's going. Slowing down (after a flick, or when you point at it) is friction: the faster it was
 * moving, the longer and farther it takes to stop, so a flick glides on and the slow drift just eases to a halt.
 * Getting back up to its own pace is quicker.
 */
const FRICTION = 900
const PICKUP = 600
/** The fastest it can be flicked, pixels a millisecond */
const MAX_SPEED = 4

/**
 * The row of cards, moved by script so you can take hold of it. On its own it slides left at AUTO_SPEED and loops
 * (the five cards are drawn twice, so it wraps after one set's width, with no jump). Click and drag, or swipe, and
 * it follows your pointer exactly, and when you let go it carries on at the speed you let go at, slowing down
 * by friction (FRICTION: a hard flick glides a long way) until it is back to its own pace, or stands still if the
 * mouse is over it. A sideways swipe on a trackpad or a horizontal wheel moves it too. It stands still while the
 * mouse is over it or a card has focus (a touch holds it for a moment after you let go), and a card you tab to is
 * slid into view. It only runs while it's on screen. With reduced motion this does nothing: the row is one set of
 * cards, scrolled by hand (v5.css).
 */
function initMarquee(): void {
  const root = qs('#stages .v4-stage-marquee')
  const track = qs('.v4-stage-track', root)
  const group = qs('.v4-stage-group', track)
  root.classList.add('is-js') // v5.css: the script moves the track now, not the CSS animation

  let offset = 0 // how far the row has slid left, between 0 (card 01 first) and the last card's end
  let dir = 1 // which way it drifts on its own: 1 leftwards (towards 05), -1 back towards 01
  let velocity = AUTO_SPEED
  let maxOffset = Math.max(group.offsetWidth - root.clientWidth, 0)
  let hovering = false
  let focused = false
  let dragging = false
  let holdUntil = 0
  let frame = 0
  let last = 0

  const apply = () => {
    offset = Math.min(Math.max(offset, 0), maxOffset)
    track.style.transform = `translate3d(${-offset}px, 0, 0)`
  }

  const tick = (now: number) => {
    const dt = Math.min(now - last, 64)
    last = now
    if (!dragging) {
      // Head for the pace it should have: its own, or standing still. Faster than that (or the other way) is
      // slowing down, which is friction; slower is speeding up.
      const target = hovering || focused || now < holdUntil ? 0 : dir * AUTO_SPEED
      const slowing = Math.abs(velocity) > Math.abs(target) || velocity * target < 0
      velocity += (target - velocity) * (1 - Math.exp(-dt / (slowing ? FRICTION : PICKUP)))
      offset += velocity * dt
      // At either end it turns round after a short rest and drifts back the other way
      if (offset >= maxOffset && dir > 0) {
        dir = -1
        velocity = 0
        holdUntil = now + 900
      } else if (offset <= 0 && dir < 0) {
        dir = 1
        velocity = 0
        holdUntil = now + 900
      }
    }
    apply()
    frame = requestAnimationFrame(tick)
  }
  const run = () => {
    if (frame) return
    last = performance.now()
    frame = requestAnimationFrame(tick)
  }
  const halt = () => {
    cancelAnimationFrame(frame)
    frame = 0
  }

  /* Dragging: the row follows the pointer, and keeps the speed you let go at */
  let pressed = false
  let startX = 0
  let startOffset = 0
  let samples: { t: number; x: number }[] = []

  root.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    pressed = true
    startX = e.clientX
    startOffset = offset
    samples = [{ t: e.timeStamp, x: e.clientX }]
  })
  root.addEventListener('pointermove', (e) => {
    if (!pressed) return
    if (!dragging && Math.abs(e.clientX - startX) > 5) {
      dragging = true
      velocity = 0
      root.classList.add('is-dragging')
      root.setPointerCapture(e.pointerId)
    }
    if (!dragging) return
    offset = startOffset - (e.clientX - startX)
    samples.push({ t: e.timeStamp, x: e.clientX })
    samples = samples.filter((s) => e.timeStamp - s.t < 120)
  })
  const release = (e: PointerEvent) => {
    if (!pressed) return
    pressed = false
    if (!dragging) return
    dragging = false
    root.classList.remove('is-dragging')
    if (root.hasPointerCapture(e.pointerId)) root.releasePointerCapture(e.pointerId)
    // The speed the pointer was moving at as it let go (pixels a millisecond; the row goes the other way). Only
    // the last 100ms counts, and if it had stopped moving before it let go there is nothing to carry on with.
    const recent = samples.filter((s) => e.timeStamp - s.t < 100)
    const first = recent[0]
    const lastSample = recent[recent.length - 1]
    const span = first && lastSample ? lastSample.t - first.t : 0
    const fresh = lastSample !== undefined && e.timeStamp - lastSample.t < 60
    velocity = span > 8 && fresh ? Math.max(Math.min(-(lastSample.x - first.x) / span, MAX_SPEED), -MAX_SPEED) : 0
    if (e.pointerType !== 'mouse') holdUntil = performance.now() + 1200
  }
  root.addEventListener('pointerup', release)
  root.addEventListener('pointercancel', release)

  /* Standing still while the mouse is over it, or a card has focus */
  root.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'mouse') hovering = true
  })
  root.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'mouse') hovering = false
  })
  root.addEventListener('focusin', (e) => {
    // Only keyboard focus: clicking a card focuses it too, and that shouldn't hold the row still
    if (!(e.target as HTMLElement).matches(':focus-visible')) return
    focused = true
    // The browser scrolls a clipped box to a focused card: undo that, and slide the row so the card is in view
    root.scrollLeft = 0
    const card = (e.target as HTMLElement).closest('.v4-stage')
    if (!card) return
    const box = root.getBoundingClientRect()
    const c = card.getBoundingClientRect()
    const margin = 24
    if (c.left < box.left + margin) offset += c.left - box.left - margin
    else if (c.right > box.right - margin) offset += c.right - box.right + margin
    apply()
  })
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget as Node | null)) focused = false
  })

  /* A sideways swipe on a trackpad, or a horizontal wheel */
  root.addEventListener(
    'wheel',
    (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      offset += e.deltaX
      velocity = 0
    },
    { passive: false },
  )

  // Re-measured when the window resizes or the cards change width (web fonts arriving, for one)
  const measure = new ResizeObserver(() => (maxOffset = Math.max(group.offsetWidth - root.clientWidth, 0)))
  measure.observe(root)
  measure.observe(group)
  // Only runs while it's on screen
  new IntersectionObserver(([e]) => (e.isIntersecting ? run() : halt())).observe(root)
}
