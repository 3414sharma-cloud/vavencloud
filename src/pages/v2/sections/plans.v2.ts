import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { plans, type Plan } from '@/modules/pricing/plans.section.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { safety } from '../v2.data.ts'

/*
 * Chapter 4, plans: the two plans, shorter than the landing page's (what both share is said once, above them),
 * then why saying yes is safe, right where the decision is made. Plans from plans.section.ts.
 */

/** Rows that are the same on both plans are said once in the intro instead */
const shared = ['Price', 'On call']

const card = (p: Plan) => `
      <article class="v2-plan ${p.popular ? 'v2-plan--popular surface-ink' : 'card'}">
        <div class="flex items-center justify-between gap-3">
          <h3 class="v2-plan-name">${p.name}</h3>
          ${p.popular ? '<span class="v2-plan-badge">Most chosen</span>' : ''}
        </div>
        <p class="v2-plan-for">Best for ${p.bestFor.charAt(0).toLowerCase()}${p.bestFor.slice(1)}</p>
        <dl class="v2-plan-rows">
          ${p.rows
            .filter((r) => !shared.includes(r.label))
            .map((r) => `<div><dt>${r.label}</dt><dd>${r.value}</dd></div>`)
            .join('')}
        </dl>
        <a href="${routes.book}" class="${p.popular ? 'btn-primary' : 'btn-secondary'} mt-auto w-full !py-3">Book a free review<span class="sr-only"> for the ${p.name} plan</span> ${icon('arrow-right', 'h-4 w-4')}</a>
      </article>`

export function plansV2(): Section {
  return {
    html: `
<section id="plans" class="v2-section border-t border-neutral-200 dark:border-neutral-800" aria-labelledby="plans-title">
  <div class="container-page">
    <div class="max-w-5xl">
      ${sectionHeading({
        id: 'plans-title',
        eyebrow: 'Plans',
        title: 'Two ways to hand over production. <em>Both on call 24/7.</em>',
        description: 'Every plan includes your engineers, your client portal and round-the-clock cover, for one fixed monthly fee agreed after your free review. What changes is how much of your product we take on.',
      })}
    </div>
    <div class="v2-plans">
      ${plans.map(card).join('')}
    </div>
    <ul class="v2-safety" aria-label="Why it’s safe to start">
      ${safety.map((s) => `<li><span class="v2-safety-icon" aria-hidden="true">${icon(s.icon, 'h-4 w-4')}</span><div><p class="v2-safety-title">${s.title}</p><p class="v2-safety-text">${s.text}</p></div></li>`).join('')}
    </ul>
  </div>
</section>`,
  }
}
