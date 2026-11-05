import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { plans, type Plan } from '@/modules/pricing/plans.section.ts'
import { safety } from '@/pages/v2/v2.data.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { scope } from '../v5.data.ts'

/*
 * v4's plans: v2's plans chapter (plans.v2.ts, same markup and v2.css), with what the plan hours cover between
 * the plans and why it's safe to start: what's included, what's quoted first, and that nothing is billed without
 * approval. Plans from plans.section.ts, the reasons from v2.data.ts.
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

const list = (items: string[]) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`

const scopeCard = () => `
    <div class="v4-scope card">
      <div>
        <h3 class="v4-scope-title"><span class="v4-mark v4-mark--yes" aria-hidden="true">${icon('check', 'h-3 w-3')}</span>Included in your plan hours</h3>
        ${list(scope.included)}
      </div>
      <div>
        <h3 class="v4-scope-title"><span class="v4-mark v4-mark--quote" aria-hidden="true">$</span>Quoted separately, before we start</h3>
        ${list(scope.quoted)}
      </div>
      <p class="v4-scope-note"><b>${scope.note[0]}</b> ${scope.note[1]}</p>
    </div>`

export function plansV5(): Section {
  return {
    html: `
<section id="plans" class="v2-section border-t border-neutral-200 dark:border-neutral-800" aria-labelledby="plans-title">
  <div class="container-page">
    <div class="heading-wide max-w-6xl">
      ${sectionHeading({
        id: 'plans-title',
        title: 'Two ways to hand over production. <em>Both on call 24/7.</em>',
        description: 'Every plan includes your engineers, your client portal and round-the-clock cover, for one fixed monthly fee agreed after your free review. What changes is how much of your product we take on.',
      })}
    </div>
    <div class="v2-plans">
      ${plans.map(card).join('')}
    </div>
    ${scopeCard()}
    <ul class="v2-safety" aria-label="Why it’s safe to start">
      ${safety.map((s) => `<li><span class="v2-safety-icon" aria-hidden="true">${icon(s.icon, 'h-4 w-4')}</span><div><p class="v2-safety-title">${s.title}</p><p class="v2-safety-text">${s.text}</p></div></li>`).join('')}
    </ul>
  </div>
</section>`,
  }
}
