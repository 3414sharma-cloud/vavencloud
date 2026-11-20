import { useEffect, type RefObject } from 'react'
import { qsa } from '@/lib/dom.ts'

/** The parts of a card whose colours change with the fill */
const PARTS = '[data-stage-part]'

/**
 * Where the pointer came in or left, so each card's night-blue fill grows from there and drains back to it
 * (Stages.tsx). Each part's colours change as the fill's edge passes it (--d): coming in, the parts nearest the
 * pointer first; going out, the farthest first, since the fill shrinks toward the pointer. While the pointer is
 * on the card a soft glow follows it (--gx, --gy). Works on every [data-stage] card inside `root`.
 */
export function useStageFill(root: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const el = root.current
    if (!el) return
    const off = new AbortController()
    const frames: number[] = []

    qsa('[data-stage]', el).forEach((card, n) => {
      const parts = qsa(PARTS, card)
      const at = (e: PointerEvent, filling: boolean) => {
        const r = card.getBoundingClientRect()
        const x = e.clientX - r.left
        const y = e.clientY - r.top
        card.style.setProperty('--mx', `${((x / r.width) * 100).toFixed(1)}%`)
        card.style.setProperty('--my', `${((y / r.height) * 100).toFixed(1)}%`)
        // Roughly the fill's reach over its run (1.1s in, 0.8s out, Stages.tsx), against the card's diagonal
        const diagonal = Math.hypot(r.width, r.height)
        parts.forEach((p) => {
          const b = p.getBoundingClientRect()
          const near = Math.hypot(b.left - r.left + b.width / 2 - x, b.top - r.top + b.height / 2 - y) / diagonal
          const d = filling ? 0.12 + near * 0.85 : Math.max(0.6 - near * 0.6, 0)
          p.style.setProperty('--d', `${d.toFixed(3)}s`)
        })
      }

      let last: PointerEvent | undefined
      const follow = () => {
        frames[n] = 0
        if (!last) return
        const r = card.getBoundingClientRect()
        card.style.setProperty('--gx', `${(((last.clientX - r.left) / r.width) * 100).toFixed(1)}%`)
        card.style.setProperty('--gy', `${(((last.clientY - r.top) / r.height) * 100).toFixed(1)}%`)
      }
      const listen = { signal: off.signal }
      card.addEventListener(
        'pointerenter',
        (e) => {
          at(e, true)
          last = e
          follow()
        },
        listen,
      )
      card.addEventListener(
        'pointermove',
        (e) => {
          last = e
          if (!frames[n]) frames[n] = requestAnimationFrame(follow)
        },
        listen,
      )
      card.addEventListener(
        'pointerleave',
        (e) => {
          at(e, false)
          last = undefined
        },
        listen,
      )
    })

    return () => {
      off.abort()
      frames.forEach((f) => cancelAnimationFrame(f))
    }
  }, [root])
}
