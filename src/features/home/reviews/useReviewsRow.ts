import { useEffect, type RefObject } from 'react'
import { qs, qsa } from '@/lib/dom.ts'
import { prefersReducedMotion } from '@/lib/motion.ts'

/*
 * The row of client reviews (Reviews.tsx): one row of cards that scrolls sideways. Swipe, scroll sideways or drag
 * it with the mouse, or use the arrows; the bar under it shows where you are, and the edges fade where there's
 * more. Nothing moves by itself.
 *  - The bar, the arrows and the edge fades follow the scroll position; arrows move it a card at a time.
 *  - Each written card's underline sweeps in when the card comes into view ([data-state] waiting → in).
 *  - On a mouse, a soft light follows the pointer across the cards (--x, --y).
 * It runs over every scroll frame, so it writes to the row directly rather than through React state.
 */

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
function glider(track: HTMLElement, cards: HTMLElement[]) {
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

/** `trackRef`: the row ([data-tm-card] cards inside); `controlsRef`: the bar ([data-tm-thumb]) and the arrows ([data-tm-step]) */
export function useReviewsRow(
  trackRef: RefObject<HTMLElement | null>,
  controlsRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const track = trackRef.current
    const controls = controlsRef.current
    if (!track || !controls) return
    const cards = qsa('[data-tm-card]', track)
    const thumb = qs('[data-tm-thumb]', controls)
    const arrows = qsa<HTMLButtonElement>('[data-tm-step]', controls)
    const off = new AbortController()
    const listen = { signal: off.signal }
    let frame = 0

    const update = () => {
      const max = track.scrollWidth - track.clientWidth
      const atStart = track.scrollLeft <= 1
      const atEnd = track.scrollLeft >= max - 1
      controls.hidden = max <= 1
      track.classList.toggle('is-start', atStart)
      track.classList.toggle('is-end', atEnd)
      arrows.forEach((a, i) => (a.disabled = i === 0 ? atStart : atEnd))
      // The thumb is as wide as the share on show, and slides along the rest
      const shown = track.clientWidth / track.scrollWidth
      const k = max > 0 ? track.scrollLeft / max : 0
      thumb.style.width = `${shown * 100}%`
      thumb.style.transform = `translateX(${((k * (1 - shown)) / shown) * 100}%)`
    }
    track.addEventListener(
      'scroll',
      () => {
        if (frame) return
        frame = requestAnimationFrame(() => {
          frame = 0
          update()
        })
      },
      listen,
    )
    const resize = new ResizeObserver(update)
    resize.observe(track)
    update()

    const glide = glider(track, cards)

    arrows.forEach((a) =>
      a.addEventListener(
        'click',
        () => {
          const step = (cards[0]?.offsetWidth ?? 0) + parseFloat(getComputedStyle(track).columnGap)
          glide.to(glide.nearest(glide.at() + Number(a.dataset.tmStep) * step))
        },
        listen,
      ),
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
      { passive: false, signal: off.signal },
    )

    // Drag with the mouse (touch scrolls it natively); let go and it carries on at that speed, then settles on a card
    let drag: { x: number; left: number; moved: boolean; samples: { t: number; x: number }[] } | null = null
    track.addEventListener(
      'pointerdown',
      (e) => {
        glide.stop()
        if (e.pointerType === 'mouse' && e.button === 0)
          drag = { x: e.clientX, left: track.scrollLeft, moved: false, samples: [{ t: e.timeStamp, x: e.clientX }] }
      },
      listen,
    )
    window.addEventListener(
      'pointermove',
      (e) => {
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
      },
      listen,
    )
    window.addEventListener(
      'pointerup',
      (e) => {
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
        glide.fling(first && end && span > 8 && fresh ? -(end.x - first.x) / span : 0)
        // Don't let the click that ends a drag play a video
        const swallow = (e: Event) => {
          e.preventDefault()
          e.stopPropagation()
        }
        track.addEventListener('click', swallow, { capture: true, once: true })
        window.setTimeout(() => track.removeEventListener('click', swallow, { capture: true }), 0)
      },
      listen,
    )

    // The light under the pointer: each card knows where the pointer is, relative to itself
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      track.addEventListener(
        'pointermove',
        (e) => {
          cards.forEach((c) => {
            const r = c.getBoundingClientRect()
            c.style.setProperty('--x', `${e.clientX - r.left}px`)
            c.style.setProperty('--y', `${e.clientY - r.top}px`)
          })
        },
        listen,
      )
    }

    // Each card's underline sweeps in once the card is on screen (sideways too), the ones arriving together in turn
    let io: IntersectionObserver | undefined
    if (!prefersReducedMotion() && 'IntersectionObserver' in window) {
      cards.forEach((c) => (c.dataset.state = 'waiting'))
      const observer = new IntersectionObserver(
        (entries) => {
          entries
            .filter((e) => e.isIntersecting)
            .forEach((e, k) => {
              const card = e.target as HTMLElement
              card.style.setProperty('--d', String(k))
              card.dataset.state = 'in'
              observer.unobserve(card)
            })
        },
        { threshold: 0.6 },
      )
      cards.forEach((c) => observer.observe(c))
      io = observer
    }

    return () => {
      off.abort()
      resize.disconnect()
      io?.disconnect()
      glide.stop()
      cancelAnimationFrame(frame)
    }
  }, [trackRef, controlsRef])
}
