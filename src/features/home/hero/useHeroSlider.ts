import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type AnimationEvent,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { flushSync } from 'react-dom'
import { prefersReducedMotion } from '@/lib/motion.ts'

/*
 * The hero's slider. Each time a slide comes on (and on load, for the first) it plays in (Hero.tsx). The slider
 * moves on by itself: the waveform over the active name fills to show how long is left, and one completed fill
 * advances to the next slide. It holds while a keyboard user is inside it or it is scrolled away. The names, the
 * arrow keys and a swipe all change slide. With reduced motion nothing moves by itself and the slides simply
 * show. Slides not on show are inert, so only the visible one can be reached by keyboard or screen reader.
 */

const KEYS: Record<string, (index: number, count: number) => [number, 1 | -1]> = {
  ArrowRight: (i) => [i + 1, 1],
  ArrowLeft: (i) => [i - 1, -1],
  Home: () => [0, -1],
  End: (_, count) => [count - 1, 1],
}

export function useHeroSlider(count: number) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  // Read once, as the page opens (a change of setting applies from the next visit)
  const [reduced] = useState(prefersReducedMotion)
  const current = useRef(0)
  const carousel = useRef<HTMLDivElement>(null)
  const slides = useRef<(HTMLDivElement | null)[]>([])
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const holds = useRef(new Set<string>())
  const touch = useRef<{ x: number; y: number } | null>(null)

  const go = (target: number, dir: 1 | -1, focusTab = false) => {
    const next = (target + count) % count
    if (next === current.current) return
    const root = carousel.current
    const to = slides.current[next]
    if (!root || !to) return
    // The new slide comes in from the side we're heading to; the old one leaves the other way. It's put on that
    // side before it becomes active (in the same frame), so its transition runs from there.
    root.style.setProperty('--out', `${-dir * 48}px`)
    to.style.transition = 'none'
    to.style.transform = `translateX(${dir * 48}px)`
    void to.offsetWidth
    to.style.removeProperty('transition')
    to.style.removeProperty('transform')
    current.current = next
    flushSync(() => setIndex(next))
    if (focusTab) tabs.current[next]?.focus()
  }

  /** What holds the timer: keyboard focus inside it, or being off screen */
  const hold = (reason: string, on: boolean) => {
    if (on) holds.current.add(reason)
    else holds.current.delete(reason)
    setPaused(holds.current.size > 0)
  }
  const holdOffscreen = useEffectEvent((on: boolean) => hold('offscreen', on))

  // Held while it's wholly off screen, so a phone that starts with the slides half below the fold still plays
  useEffect(() => {
    const root = carousel.current
    if (reduced || !root) return
    const io = new IntersectionObserver(([e]) => holdOffscreen(!e?.isIntersecting))
    io.observe(root)
    return () => io.disconnect()
  }, [reduced])

  return {
    index,
    /** Choose a slide by its name */
    select: (i: number) => go(i, i > current.current ? 1 : -1),
    slideRef: (i: number) => (el: HTMLDivElement | null) => void (slides.current[i] = el),
    tabRef: (i: number) => (el: HTMLButtonElement | null) => void (tabs.current[i] = el),
    carouselProps: {
      ref: carousel,
      className: paused ? 'is-paused' : undefined,
      // The waveform's fill is also the slide timer
      onAnimationEnd: (e: AnimationEvent) => {
        if (!reduced && e.animationName === 'hero-wave-progress') go(current.current + 1, 1)
      },
      onFocus: (e: FocusEvent) => {
        if (!reduced && e.target.matches(':focus-visible')) hold('focus', true)
      },
      onBlur: (e: FocusEvent) => {
        if (!reduced && !e.currentTarget.contains(e.relatedTarget as Node | null)) hold('focus', false)
      },
    },
    /** A sideways swipe on a touch screen changes slide; up and down still scroll the page */
    slidesProps: {
      onPointerDown: (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') touch.current = { x: e.clientX, y: e.clientY }
      },
      onPointerUp: (e: PointerEvent) => {
        const start = touch.current
        if (!start) return
        touch.current = null
        const dx = e.clientX - start.x
        const dy = e.clientY - start.y
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(current.current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1)
      },
      onPointerCancel: () => void (touch.current = null),
    },
    tablistProps: {
      onKeyDown: (e: KeyboardEvent) => {
        const key = KEYS[e.key]
        if (!key) return
        e.preventDefault()
        go(...key(current.current, count), true)
      },
    },
  }
}
