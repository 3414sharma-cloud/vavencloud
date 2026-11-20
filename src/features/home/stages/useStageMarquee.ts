import { useEffect, type RefObject } from 'react'
import { qs, qsa } from '@/lib/dom.ts'

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
/** How quickly a wheel step glides in, ms to cover about two thirds of it (lower is snappier) */
const WHEEL_EASE = 90
/** The fastest it can be flicked, pixels a millisecond */
const MAX_SPEED = 4

/**
 * The row of stage cards (`root` is the row's frame), moved by script so you can take hold of it. On its own
 * it drifts left at AUTO_SPEED, and at either end it turns round after a short rest. Click and drag, or swipe,
 * and it follows your pointer exactly, and when you let go it carries on at the speed you let go at, slowing
 * down by friction (a hard flick glides a long way) until it is back to its own pace, or stands still if the
 * mouse is over it. A sideways swipe on a trackpad or a horizontal wheel moves it too. It stands still while the
 * mouse is over it or a card has keyboard focus (a touch holds it for a moment after you let go), and a card you
 * tab to is slid into view. It only runs while it's on screen. While it runs the frame has .is-js (grab cursor),
 * and .is-dragging while held (Stages.tsx styles both).
 */
export function useStageMarquee(rootRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const track = qs('[data-stage-track]', root)
    const group = qs('[data-stage-group]', track)
    const off = new AbortController()
    const listen = { signal: off.signal }
    root.classList.add('is-js') // the script moves the track now: Stages.tsx shows the grab cursor

    let offset = 0 // how far the row has slid left, between 0 (card 01 first) and the last card's end
    let dir = 1 // which way it drifts on its own: 1 leftwards (towards 05), -1 back towards 01
    let velocity = AUTO_SPEED
    /** How far the row can slide: until card 05's end reaches the inner edge (inside the room kept for the pop) */
    const room = () => {
      const s = getComputedStyle(root)
      return root.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight)
    }
    let maxOffset = Math.max(group.offsetWidth - room(), 0)
    let hovering = false
    let focused = false
    let dragging = false
    let holdUntil = 0
    let frame = 0
    let last = 0
    let wheelLeft = 0 // how much of the wheel's scrolling is still to glide in, pixels (+ leftwards)

    const edgeCards = qsa<HTMLElement>('[data-stage]', group)
    const fadeEdges = () => {
      const bounds = root.getBoundingClientRect()
      const fade = bounds.width * (bounds.width < 640 ? 0.02 : 0.04)
      edgeCards.forEach((card) => {
        const left = card.getBoundingClientRect().left - bounds.left
        card.style.setProperty(
          '--stage-edge-mask',
          `linear-gradient(90deg, rgb(0 0 0 / 35%) ${-left}px, #000 ${fade - left}px, #000 ${bounds.width - fade - left}px, rgb(0 0 0 / 35%) ${bounds.width - left}px)`,
        )
      })
    }
    root.addEventListener('scroll', fadeEdges, { passive: true, signal: off.signal })
    const apply = () => {
      offset = Math.min(Math.max(offset, 0), maxOffset)
      track.style.transform = `translate3d(${-offset}px, 0, 0)`
      fadeEdges()
    }

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64)
      last = now
      if (wheelLeft) {
        // A wheel step glides in, like the page's own smooth scroll, instead of jumping the whole step at once
        const step = Math.abs(wheelLeft) < 0.5 ? wheelLeft : wheelLeft * (1 - Math.exp(-dt / WHEEL_EASE))
        offset += step
        wheelLeft -= step
        // At either end there is nowhere left to go
        if ((offset <= 0 && wheelLeft < 0) || (offset >= maxOffset && wheelLeft > 0)) wheelLeft = 0
      } else if (!dragging) {
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

    root.addEventListener(
      'pointerdown',
      (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return
        pressed = true
        startX = e.clientX
        startOffset = offset
        samples = [{ t: e.timeStamp, x: e.clientX }]
      },
      listen,
    )
    root.addEventListener(
      'pointermove',
      (e) => {
        if (!pressed) return
        if (!dragging && Math.abs(e.clientX - startX) > 5) {
          dragging = true
          velocity = 0
          wheelLeft = 0
          root.classList.add('is-dragging')
          root.setPointerCapture(e.pointerId)
        }
        if (!dragging) return
        offset = startOffset - (e.clientX - startX)
        samples.push({ t: e.timeStamp, x: e.clientX })
        samples = samples.filter((s) => e.timeStamp - s.t < 120)
      },
      listen,
    )
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
      velocity =
        first && lastSample && span > 8 && fresh
          ? Math.max(Math.min(-(lastSample.x - first.x) / span, MAX_SPEED), -MAX_SPEED)
          : 0
      if (e.pointerType !== 'mouse') holdUntil = performance.now() + 1200
    }
    root.addEventListener('pointerup', release, listen)
    root.addEventListener('pointercancel', release, listen)

    /* Standing still while the mouse is over it, or a card has focus */
    root.addEventListener(
      'pointerenter',
      (e) => {
        if (e.pointerType === 'mouse') hovering = true
      },
      listen,
    )
    root.addEventListener(
      'pointerleave',
      (e) => {
        if (e.pointerType === 'mouse') hovering = false
      },
      listen,
    )
    root.addEventListener(
      'focusin',
      (e) => {
        // Only keyboard focus: clicking a card focuses it too, and that shouldn't hold the row still
        if (!(e.target as HTMLElement).matches(':focus-visible')) return
        focused = true
        // The browser scrolls a clipped box to a focused card: undo that, and slide the row so the card is in view
        root.scrollLeft = 0
        const card = (e.target as HTMLElement).closest('[data-stage]')
        if (!card) return
        const box = root.getBoundingClientRect()
        const c = card.getBoundingClientRect()
        const margin = 24
        if (c.left < box.left + margin) offset += c.left - box.left - margin
        else if (c.right > box.right - margin) offset += c.right - box.right + margin
        apply()
      },
      listen,
    )
    root.addEventListener(
      'focusout',
      (e) => {
        if (!root.contains(e.relatedTarget as Node | null)) focused = false
      },
      listen,
    )

    /* A sideways swipe on a trackpad, a horizontal wheel, or Shift + the wheel; glided in by tick() */
    root.addEventListener(
      'wheel',
      (e) => {
        // Shift + wheel is sideways scrolling, though some browsers still report it as deltaY
        const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX
        const dy = e.shiftKey ? 0 : e.deltaY
        if (Math.abs(dx) <= Math.abs(dy)) return
        e.preventDefault()
        e.stopPropagation() // not the page's smooth scroll as well
        const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? root.clientWidth : 1 // lines or pages, in pixels
        wheelLeft += dx * unit
        velocity = 0
      },
      { passive: false, signal: off.signal },
    )

    // Re-measured when the window resizes or the cards change width (web fonts arriving, for one)
    const measure = new ResizeObserver(() => (maxOffset = Math.max(group.offsetWidth - room(), 0)))
    measure.observe(root)
    measure.observe(group)
    // Only runs while it's on screen
    const io = new IntersectionObserver(([e]) => (e?.isIntersecting ? run() : halt()))
    io.observe(root)

    return () => {
      off.abort()
      measure.disconnect()
      io.disconnect()
      halt()
      root.classList.remove('is-js', 'is-dragging')
      track.style.removeProperty('transform')
    }
  }, [rootRef])
}
