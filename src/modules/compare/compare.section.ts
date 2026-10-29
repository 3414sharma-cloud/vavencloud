import './compare.css'
import type { Section } from '@/app/types.ts'
import { icon } from '@/shared/ui/icons.ts'

/** Generic provider categories only. No competitors are named. */
const partialOwnership = [
  {
    number: '01',
    provider: 'Cloud host',
    owns: 'The server.',
    stops: 'Application code, deployments and recovery sit outside the plan.',
  },
  {
    number: '02',
    provider: 'DevOps agency',
    owns: 'The pipeline.',
    stops: 'They may not know the product, the latest code or what changed after handover.',
  },
  {
    number: '03',
    provider: 'Outsourced IT support',
    owns: 'A support contract.',
    stops: 'Product incidents are billed by the hour and code fixes need a separate team.',
  },
] as const

const ownership = ['Servers', 'Deployments', 'Monitoring', 'Code', 'Recovery']

export function compareSection(): Section {
  return {
    html: `
<section id="compare" class="compare-section py-24 sm:py-32" aria-labelledby="compare-title">
  <div class="container-page">
    <div class="compare-intro">
      <p class="compare-overline">Production ownership</p>
      <h2 id="compare-title">Others own a piece<br>of your product.<br><em>We own the outcome.</em></h2>
      <p>You do not need another provider to manage. You need one team that can follow a problem across every layer until the product is working again.</p>
    </div>

    <div class="compare-story">
      <ol class="compare-partials" aria-label="Where partial ownership stops">
        ${partialOwnership
          .map(
            (item) => `
            <li class="compare-partial">
              <span class="compare-number">${item.number}</span>
              <div>
                <p class="compare-provider">${item.provider}</p>
                <h3>${item.owns}</h3>
                <p class="compare-stops"><span>Stops at</span>${item.stops}</p>
              </div>
            </li>`,
          )
          .join('')}
      </ol>

      <aside class="compare-outcome" aria-labelledby="outcome-title">
        <div class="compare-outcome-rule" aria-hidden="true"></div>
        <p class="compare-overline">VavenCloud</p>
        <h3 id="outcome-title">One team.<br><span>One call.</span><br>One outcome.</h3>
        <p>We take responsibility for the whole production system, not just the part that happens to be convenient.</p>
        <ul aria-label="What VavenCloud owns">
          ${ownership.map((item) => `<li>${icon('check', 'h-4 w-4')} ${item}</li>`).join('')}
        </ul>
        <p class="compare-price-note">One fixed monthly fee, agreed after your review.</p>
      </aside>
    </div>

    <p class="compare-close">A senior DevOps engineer cannot fix your code alone at 3am. A host cannot own your deployment. <strong>Production ownership means the team responsible can solve the whole problem.</strong></p>
  </div>
</section>`,
  }
}
