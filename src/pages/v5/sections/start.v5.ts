import type { Section } from '@/app/types.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { handover, startSteps } from '../v5.data.ts'

/*
 * How we start, just before the plans, all from the left like the chapters around it: the heading, then the
 * five steps from the first call to fully covered, joined by a dotted line through their numbers on a wide
 * screen (one under another on smaller ones, the number beside each), the last one filled in. Then what the
 * handover promises, so switching doesn't feel like a risk.
 */
export function startV5(): Section {
  return {
    html: `
<section id="start" class="v2-section band-linen border-t border-neutral-200 dark:border-neutral-800" aria-labelledby="start-title">
  <div class="container-page">
    <div class="v4-wide-head">
      ${sectionHeading({
        id: 'start-title',
        title: 'From first call to fully covered <em>in about two weeks.</em>',
        description: 'Switching shouldn’t feel risky. We find the problems first, fix the urgent ones, and only then take responsibility.',
      })}
    </div>
    <ol class="v4-steps">
      ${startSteps
        .map(
          (s, i) => `
      <li class="v4-step" data-reveal>
        <span class="v4-step-dot" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <p class="v4-step-when">${s.when}</p>
        <h3 class="v4-step-title">${s.title}</h3>
        <p class="v4-step-text">${s.text}</p>
      </li>`,
        )
        .join('')}
    </ol>
    <div class="v4-handover card">
      <span class="icon-box">${icon('shield', 'h-5 w-5')}</span>
      <div class="min-w-0">
        <h3 class="v4-handover-title">What happens in the handover</h3>
        <ul class="v4-handover-list">
          ${handover.map((h) => `<li><b>${h.title}</b>${h.text}</li>`).join('')}
        </ul>
      </div>
    </div>
  </div>
</section>`,
  }
}
