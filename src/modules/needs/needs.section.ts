import type { Section } from '@/app/types.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { initNeedsPicker, needsPicker } from './needs-picker.ts'

const perks = [
  'Matching services are highlighted',
  'The right plans open automatically',
  'Your contact form is pre-filled',
]

/** "Not sure where to start?" section that hosts the needs picker (it used to live in the hero). */
export function needsSection(): Section {
  return {
    html: `
<section id="find" class="border-y border-neutral-200 bg-neutral-50 py-20 sm:py-24 dark:border-neutral-800 dark:bg-neutral-900/40">
  <div class="container-page grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
    <div>
      ${sectionHeading({
        eyebrow: 'Not sure where to start?',
        title: 'Tell us where your product is today',
        description: "Pick the closest match and we'll show you the right setup and a starting price. The rest of the page adapts to your choice.",
      })}
      <ul class="mt-8 space-y-3 text-sm">
        ${perks.map((p) => `<li class="flex items-center gap-3"><span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">${icon('check', 'h-3.5 w-3.5')}</span>${p}</li>`).join('')}
      </ul>
    </div>
    ${needsPicker()}
  </div>
</section>`,
    init: initNeedsPicker,
  }
}
