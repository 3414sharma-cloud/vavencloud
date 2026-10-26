import type { Section } from '@/app/types.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { features as defaultFeatures, type Feature } from './features.data.ts'

interface FeaturesOptions {
  features?: Feature[]
  heading?: { eyebrow: string; title: string; description: string }
}

const defaultHeading = {
  eyebrow: 'Why VavenCloud',
  title: 'A partner behind your product, not just a vendor',
  description: "Launch day shouldn't be scary. We're with you before, during and long after it.",
}

/** "Why VavenCloud": heading on the left, a plain grid of features on the right. */
export function featuresSection({ features = defaultFeatures, heading = defaultHeading }: FeaturesOptions = {}): Section {
  return {
    html: `
<section id="why-us" class="border-y border-neutral-200 bg-neutral-50 py-20 sm:py-28 dark:border-neutral-800 dark:bg-neutral-900/40">
  <div class="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
    <div class="lg:sticky lg:top-28 lg:self-start">
      ${sectionHeading(heading)}
    </div>
    <ul class="grid gap-x-10 gap-y-10 sm:grid-cols-2">
      ${features
        .map(
          (f) => `
      <li>
        <span class="icon-box bg-white dark:bg-neutral-950">${icon(f.icon, 'h-5 w-5')}</span>
        <h3 class="mt-4 font-semibold text-neutral-950 dark:text-white">${f.title}</h3>
        <p class="mt-2 leading-relaxed">${f.description}</p>
      </li>`,
        )
        .join('')}
    </ul>
  </div>
</section>`,
  }
}
