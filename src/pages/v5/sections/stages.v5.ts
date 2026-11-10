import type { Section } from '@/app/types.ts'
import { qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { stages } from '../v5.data.ts'
import { stageArt } from './stage-art.v5.ts'

/*
 * Where are you today: the five moments founders come to us, in order from idea to "nobody owns it", each with
 * a small diagram of that moment (stage-art.v5.ts), the worry in their words and what we do about it, on
 * cards that rest light (the page's own card colour in dark mode) and turn night blue on hover or focus, the
 * diagrams' colours swapping with them (v5.css). Three then two on a wide screen, two on a tablet, one on a phone.
 */
export function stagesV5(): Section {
  return {
    html: `
<section id="stages" class="v2-section border-t border-neutral-200 dark:border-neutral-800" aria-labelledby="stages-title">
  <div class="container-page">
    <div class="max-w-5xl">
      ${sectionHeading({
        id: 'stages-title',
        title: 'Wherever you are, <em>one team takes it from here.</em>',
        description: 'Founders come to us at five different moments. Find yours.',
      })}
    </div>
    <ol class="v4-stages">
      ${stages
        .map(
          (s, i) => `
      <li class="v4-stage" data-reveal>
        <div class="v4-stage-art">${stageArt[s.id]}</div>
        <span class="v4-stage-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <h3 class="v4-stage-title">${s.title}</h3>
        <p class="v4-stage-worry">${s.worry}</p>
        <p class="v4-stage-answer"><b>What we do</b>${s.answer}</p>
      </li>`,
        )
        .join('')}
    </ol>
  </div>
</section>`,
    init: initStageFill,
  }
}

/** The parts of a card whose colours change with the fill */
const PARTS = '.v4-stage-art, .v4-stage-n, .v4-stage-title, .v4-stage-worry, .v4-stage-answer'

/**
 * Where the pointer came in or left, so the card's night-blue fill grows from there and drains back to it
 * (v5.css). Each part's colours change as the fill's edge passes it (--d): coming in, the parts nearest the
 * pointer first; going out, the farthest first, since the fill shrinks toward the pointer.
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

    // While on the card: the glow follows the pointer and the card leans toward it (at most 3 degrees)
    let frame = 0
    let last: PointerEvent | undefined
    const follow = () => {
      frame = 0
      if (!last) return
      const r = card.getBoundingClientRect()
      const fx = (last.clientX - r.left) / r.width
      const fy = (last.clientY - r.top) / r.height
      card.style.setProperty('--gx', `${(fx * 100).toFixed(1)}%`)
      card.style.setProperty('--gy', `${(fy * 100).toFixed(1)}%`)
      if (tilt) {
        card.style.setProperty('--tx', `${((fx - 0.5) * 6).toFixed(2)}deg`)
        card.style.setProperty('--ty', `${((0.5 - fy) * 6).toFixed(2)}deg`)
      }
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
      card.style.removeProperty('--tx')
      card.style.removeProperty('--ty')
    })
  })
}

/** No leaning for people who'd rather not have motion, or on touch screens */
const tilt = !prefersReducedMotion() && matchMedia('(hover: hover)').matches
