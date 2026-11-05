import type { Section } from '@/app/types.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { layers, type Layer } from '../v5.data.ts'

/*
 * What we own, right after the problem: the five things one team takes off your plate, each with what it does
 * and what that means for you. Fixes in your code is the dark card, since no host or freelancer does it.
 * Two wide cards, then three, on a wide screen; two a row on a tablet (the dark one across); one on a phone.
 */

const card = (l: Layer) => `
      <article class="v4-own v4-own--${l.feature ? 'feature surface-ink' : `${l.size} card`}">
        <div class="v4-own-top"><span class="icon-box">${icon(l.icon, 'h-5 w-5')}</span>${l.feature ? '<span class="v4-own-tag">Our difference</span>' : ''}</div>
        <h3 class="v4-own-title">${l.title}</h3>
        <p class="v4-own-text">${l.text}</p>
        <ul class="v4-own-points">
          ${l.points.map((p) => `<li><span class="v4-tick" aria-hidden="true">${icon('check', 'h-3 w-3')}</span>${p}</li>`).join('')}
        </ul>
        <p class="v4-own-means"><b>For you:</b> ${l.forYou}</p>
      </article>`

export function ownV5(): Section {
  return {
    html: `
<section id="own" class="v2-section band-linen border-t border-neutral-200 dark:border-neutral-800" aria-labelledby="own-title">
  <div class="container-page">
    <div class="v4-wide-head">
      ${sectionHeading({
        id: 'own-title',
        title: 'One team. <em>Every layer. Every fix.</em>',
        description: 'Most founders run their product on three vendors. We replace all three with one named engineer, backed by a 24/7 operations team and Vavensoft’s developers. Whatever layer the problem sits in, it’s ours.',
      })}
    </div>
    <div class="v4-owns">
      ${layers.map(card).join('')}
    </div>
  </div>
</section>`,
  }
}
