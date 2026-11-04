import type { Section } from '@/app/types.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { stages } from '../v4.data.ts'
import { stageArt } from './stage-art.v4.ts'

/*
 * Where are you today: the five moments founders come to us, in order from idea to "nobody owns it", each with
 * a small diagram of that moment (stage-art.v4.ts), the worry in their words and what we do about it, on
 * night-blue cards in both themes. Three then two on a wide screen, two on a tablet, one on a phone.
 */
export function stagesV4(): Section {
  return {
    html: `
<section id="stages" class="v2-section border-t border-neutral-200 dark:border-neutral-800" aria-labelledby="stages-title">
  <div class="container-page">
    <div class="max-w-5xl">
      ${sectionHeading({
        id: 'stages-title',
        eyebrow: 'Where are you today?',
        title: 'Wherever you are, <em>one team takes it from here.</em>',
        description: 'Founders come to us at five different moments. Find yours.',
      })}
    </div>
    <ol class="v4-stages">
      ${stages
        .map(
          (s, i) => `
      <li class="v4-stage surface-ink" data-reveal>
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
  }
}
