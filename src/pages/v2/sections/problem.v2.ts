import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { intro, night, steps } from '@/modules/ownership/ownership.data.ts'
import { icon } from '@/shared/ui/icons.ts'
import { costs } from '../v2.data.ts'
import { clock, nightCard, nightRow } from './night.ts'

/*
 * Chapter 1, the problem: the messaging guide's problem line, what three vendors really cost, and the night
 * of an outage with three vendors (light card). It ends on one line to remember and the way to the fix.
 */

export function problemV2(): Section {
  const rows = steps.map((s) => nightRow(s.vendors.clock ?? clock(s.at), s.vendors, 'vendors')).join('')
  return {
    html: `
<section id="problem" class="v2-section" aria-labelledby="problem-title">
  <div class="container-page">
    <div class="v2-split">
      <div>
        <p class="v2-overline">The problem</p>
        <h2 id="problem-title" class="v2-title">Your app has three vendors.<span>When it breaks, it has none.</span></h2>
        <p class="v2-lead">${intro}</p>
        <p class="v2-label">What it costs you</p>
        <ul class="v2-costs">
          ${costs.map((c) => `<li><span class="v2-cost-icon" aria-hidden="true">${icon(c.icon, 'h-4 w-4')}</span>${c.text}</li>`).join('')}
        </ul>
      </div>
      ${nightCard('vendors', 'Tonight, with three vendors', { tone: 'down', text: `Down ${night.end - night.start} min and counting` }, rows)}
    </div>
    <p class="v2-takeaway">Three vendors. <strong>Nobody owns the outage.</strong> <a href="${routes.home}#solution">See the fix ${icon('arrow-right', 'h-4 w-4')}</a></p>
  </div>
</section>`,
  }
}
