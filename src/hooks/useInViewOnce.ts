import { useEffect, useEffectEvent, useRef, type RefObject } from 'react'
import { prefersReducedMotion } from '@/lib/motion.ts'

interface Options {
  threshold?: number
  rootMargin?: string
  /**
   * With reduced motion (or no IntersectionObserver): `run` calls onEnter straight away, so the element shows
   * in its final state; `skip` does nothing, so it shows as it is.
   */
  reduced?: 'run' | 'skip'
}

/**
 * Calls `onEnter` once, the first time the element comes into view, and stops watching (also when the
 * component goes). `onEnter` may change the element directly: use that (not a className from state) for an
 * element reveal.ts also animates, so neither undoes the other's classes.
 */
export function useInViewOnce<T extends Element>(
  onEnter: (el: T) => void,
  { threshold, rootMargin, reduced = 'run' }: Options = {},
): RefObject<T | null> {
  const ref = useRef<T>(null)
  // Always the latest onEnter, without restarting the observer when it changes
  const enter = useEffectEvent(onEnter)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      if (reduced === 'run') enter(el)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        io.disconnect()
        enter(el)
      },
      { threshold, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, rootMargin, reduced])

  return ref
}
