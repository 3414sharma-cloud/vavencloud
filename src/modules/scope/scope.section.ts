import type { Section } from '@/app/types.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'

/** "What we own" and the exit promise (VavenCloud-Sample-Content.md). */
const layers = [
  { layer: 'Infrastructure', covers: 'Servers, network, storage, backups, hardware', managed: 'Included', partner: 'Included' },
  { layer: 'Platform', covers: 'Operating system, security patches, web servers, databases, SSL, firewalls, scaling', managed: 'Included', partner: 'Included' },
  { layer: 'Delivery', covers: 'Deployment pipelines, releases, rollbacks, environments', managed: 'Included', partner: 'Included' },
  { layer: 'Incidents', covers: 'Finding the cause of any outage, at any layer, and restoring service', managed: 'Included', partner: 'Included, with a written report' },
  { layer: 'Your code', covers: 'Bug fixes, dependency upgrades, performance tuning', managed: '4 hours a month', partner: '20 hours a month' },
  { layer: 'New features', covers: 'New functionality, redesigns, rewrites', managed: 'Quoted separately', partner: 'Quoted separately' },
]

const value = (v: string) =>
  v.startsWith('Included')
    ? `<span class="inline-flex items-start gap-1.5 font-medium text-neutral-950 dark:text-white">${icon('check', 'mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400')}${v}</span>`
    : `<span class="text-neutral-600 dark:text-neutral-400">${v}</span>`

const handover = ['Documentation', 'Access', 'Runbooks', 'A full backup', 'A handover call']

export function scopeSection(): Section {
  return {
    html: `
<section id="what-we-own" class="border-t border-neutral-200 bg-neutral-50 py-24 sm:py-32 dark:border-neutral-800 dark:bg-neutral-900/40">
  <div class="container-page">
    <div class="max-w-3xl">
      ${sectionHeading({
        eyebrow: 'What we own',
        title: 'Clear about what we take on. In writing.',
        description: 'Most managed hosting stops at the server and hides the limits in the small print. We publish ours.',
      })}
    </div>

    <div class="mt-12 overflow-x-auto overflow-y-hidden rounded-3xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950" tabindex="0" role="region" aria-label="What we own, by layer. Scrolls sideways on small screens">
      <table class="w-full min-w-[720px] border-collapse text-left text-sm">
        <caption class="sr-only">What each plan covers, layer by layer</caption>
        <thead>
          <tr class="text-neutral-500">
            <th scope="col" class="px-6 py-4 font-medium">Layer</th>
            <th scope="col" class="px-6 py-4 font-medium">What it covers</th>
            <th scope="col" class="px-6 py-4 font-medium">Managed</th>
            <th scope="col" class="px-6 py-4 font-medium">Partner</th>
          </tr>
        </thead>
        <tbody>
          ${layers
            .map(
              (l) => `
          <tr class="border-t border-neutral-200 align-top dark:border-neutral-800">
            <th scope="row" class="px-6 py-5 text-base font-semibold text-neutral-950 dark:text-white">${l.layer}</th>
            <td class="max-w-sm px-6 py-5 leading-relaxed">${l.covers}</td>
            <td class="px-6 py-5">${value(l.managed)}</td>
            <td class="px-6 py-5">${value(l.partner)}</td>
          </tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <p class="mt-6 text-sm text-neutral-500">Anything beyond your monthly hours is quoted before we start. We never begin paid work without your written approval.</p>

    <!-- Exit promise -->
    <div data-reveal class="mt-20 grid gap-10 rounded-3xl border border-neutral-200 bg-white p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center dark:border-neutral-800 dark:bg-neutral-950">
      <div>
        <h3 class="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl dark:text-white">You’re never locked in. Ever.</h3>
        <p class="mt-5 text-lg leading-relaxed">
          Your servers run standard Linux. Your databases are standard MySQL and PostgreSQL. If you ever decide to leave, we hand over everything.
          We’d rather keep you by being good than by making it hard to go.
        </p>
      </div>
      <div>
        <p class="text-sm font-medium text-neutral-500">If you leave, you get</p>
        <ul class="mt-4 flex flex-wrap gap-2.5">
          ${handover.map((h) => `<li class="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-950 dark:border-neutral-800 dark:text-white">${icon('check', 'h-4 w-4 text-emerald-600 dark:text-emerald-400')}${h}</li>`).join('')}
        </ul>
        <p class="mt-4 text-sm text-neutral-500">With whoever takes over from us.</p>
      </div>
    </div>
  </div>
</section>`,
  }
}
