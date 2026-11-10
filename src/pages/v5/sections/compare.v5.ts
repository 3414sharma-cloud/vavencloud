import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { compare, compareColumns, compareMeans } from '../v5.data.ts'

/*
 * Compare: the real choice (three vendors, one hire, or us), as one table on a mist band. A gap gets a rose
 * cross, VavenCloud's column a blue tick and a tinted background. On a phone each row stacks instead: the
 * question, then the three answers, each under its column's name (data-label), VavenCloud's last and tinted.
 */

const mark = (yes: boolean) =>
  `<span class="v4-mark v4-mark--${yes ? 'yes' : 'no'}" aria-hidden="true">${icon(yes ? 'check' : 'x', 'h-3 w-3')}</span>`

const cell = (text: string, no = false) => `<span class="v4-cell">${no ? mark(false) : ''}${text}</span>`

export function compareV5(): Section {
  const [vendors, hire, vaven] = compareColumns
  return {
    html: `
<section id="compare" class="v2-section band-mist border-t border-neutral-200 dark:border-neutral-800" aria-labelledby="compare-title">
  <div class="container-page">
    <div class="v4-wide-head">
      ${sectionHeading({
        id: 'compare-title',
        title: 'Three ways to run production. <em>Only one has an owner.</em>',
        description:
          'The real choice isn’t us or another agency. It’s keeping three vendors, hiring a DevOps engineer, or handing production to one team.',
      })}
    </div>
    <div class="v4-compare card" role="region" aria-labelledby="compare-title" tabindex="0">
      <table>
        <thead>
          <tr><td></td><th scope="col">${vendors}</th><th scope="col">${hire}</th><th scope="col" class="v4-us">${vaven}</th></tr>
        </thead>
        <tbody>
          ${compare
            .map(
              (r) => `
          <tr>
            <th scope="row">${r.label}</th>
            <td data-label="${vendors}">${cell(r.vendors.text, r.vendors.no)}</td>
            <td data-label="${hire}">${cell(r.hire.text, r.hire.no)}</td>
            <td data-label="${vaven}" class="v4-us"><span class="v4-cell">${mark(true)}${r.vaven}</span></td>
          </tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <p class="v4-means" data-reveal><b>What this means for you:</b> ${compareMeans}</p>
    <p class="mt-6" data-reveal><a href="${routes.comparison}" class="inline-flex items-center gap-2 font-semibold text-neutral-950 underline decoration-neutral-950/25 underline-offset-[0.3rem] hover:text-brand-700 dark:text-white dark:decoration-white/25 dark:hover:text-brand-300">See the AWS and Azure price comparison ${icon('arrow-right', 'h-4 w-4')}</a></p>
  </div>
</section>`,
  }
}
