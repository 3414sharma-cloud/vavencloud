import type { Section } from '@/app/types.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { features, regions } from './features.data.ts'

/** "The platform" and "Regions" (VavenCloud-Sample-Content.md): heading on the left, tiles on the right. */
export function featuresSection(): Section {
  return {
    html: `
<section id="platform" class="border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800">
  <div class="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
    <div class="lg:sticky lg:top-28 lg:self-start">
      ${sectionHeading({
        eyebrow: 'The platform',
        title: 'A real cloud, built for products that can’t go down.',
        description: 'When you run on VavenCloud, your product sits on infrastructure we operate ourselves, from the virtualisation layer to your dashboard. No reselling, no black boxes.',
      })}
      <p class="mt-8 rounded-2xl border border-neutral-200 p-5 text-sm leading-relaxed dark:border-neutral-800">
        <span class="font-semibold text-neutral-950 dark:text-white">Open standards.</span>
        Standard Linux, MySQL, PostgreSQL and HAProxy. Nothing proprietary, nothing to unlearn if you leave.
      </p>
    </div>

    <div>
      <ul class="grid gap-5 sm:grid-cols-2" role="list">
        ${features
          .map(
            (f) => `
        <li class="card p-6">
          <span class="icon-box">${icon(f.icon, 'h-5 w-5')}</span>
          <h3 class="mt-5 font-semibold text-neutral-950 dark:text-white">${f.title}</h3>
          <p class="mt-2 leading-relaxed">${f.description}</p>
        </li>`,
          )
          .join('')}
      </ul>

      <div data-reveal class="mt-5 rounded-3xl bg-neutral-950 p-7 text-neutral-300 sm:p-9 dark:bg-neutral-900">
        <h3 class="text-2xl font-semibold tracking-tight text-white">Your data stays where your customers are.</h3>
        <p class="mt-3 leading-relaxed">Choose the United States or Europe. Your servers, databases and backups stay in the region you pick.</p>
        <ul class="mt-6 grid gap-3 sm:grid-cols-2" role="list">
          ${regions
            .map(
              (r) => `
          <li class="flex items-center gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            ${icon('map-pin', 'h-5 w-5 text-brand-300')}
            <span><span class="block font-semibold text-white">${r.name}</span><span class="text-sm text-neutral-400">Partner data centre in ${r.city}</span></span>
          </li>`,
            )
            .join('')}
        </ul>
      </div>
    </div>
  </div>
</section>`,
  }
}
