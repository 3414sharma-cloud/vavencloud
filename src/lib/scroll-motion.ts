import type { Variants } from 'motion/react'

/*
 * Shared scroll-in animations for Motion (ex Framer Motion). Use with initial="hidden", whileInView="visible"
 * and viewport={inView}. Wrap the section in <MotionConfig reducedMotion="user"> and give it data-no-reveal, so
 * reveal.ts leaves it to Motion. Don't put a Motion transform on an element whose own CSS transitions transform
 * (the shared `card`): wrap it instead, or every frame lags behind.
 */

export const ease = [0.22, 1, 0.36, 1] as const

/** Plays once, when a quarter of the element is on screen */
export const inView = { once: true, amount: 0.25 }

/** Fades and rises in, un-blurring: headings and short blocks */
export const rise: Variants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease } },
}

/** A parent that plays its children one after another */
export const stagger = (each = 0.12, delay = 0.15): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: each, delayChildren: delay } },
})

/** A card in a staggered list: rises and grows a little */
export const item: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease } },
}

/** Opacity only: for things inside a scroll box, where any movement could flash a scrollbar */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease } },
}

/** Slides in from the right, straightening up */
export const slideIn: Variants = {
  hidden: { opacity: 0, x: 80, rotate: 3 },
  visible: { opacity: 1, x: 0, rotate: 0, transition: { duration: 1.1, ease, delay: 0.2 } },
}
