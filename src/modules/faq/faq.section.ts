import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { faqs as defaultFaqs, type Faq } from './faq.data.ts'

/** FAQ accordion (native <details>, so it works without JS). Pass page-specific questions via `items`. */
export function faqSection({ items = defaultFaqs }: { items?: Faq[] } = {}): Section {
  return {
    html: `
<section id="faq" class="border-t border-neutral-200 py-20 sm:py-28 dark:border-neutral-800">
  <div class="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
    <div class="lg:sticky lg:top-28 lg:self-start">
      ${sectionHeading({
        eyebrow: 'FAQ',
        title: 'Questions founders ask before they hand over production.',
        description: 'Something else on your mind? Ask it in your free review. You’ll get a straight answer from an engineer.',
      })}
      <a href="${routes.book}" class="btn-secondary mt-8">Book a free review</a>
    </div>

    <div class="border-t border-neutral-200 dark:border-neutral-800">
      ${items
        .map(
          (f) => `
      <details class="group border-b border-neutral-200 dark:border-neutral-800">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-medium text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-white">
          ${f.q}
          <span class="shrink-0 text-neutral-500">
            <span class="group-open:hidden">${icon('plus', 'h-4 w-4')}</span>
            <span class="hidden group-open:block">${icon('minus', 'h-4 w-4')}</span>
          </span>
        </summary>
        <p class="pb-5 pr-10 leading-relaxed">${f.a}</p>
      </details>`,
        )
        .join('')}
    </div>
  </div>
</section>`,
  }
}
