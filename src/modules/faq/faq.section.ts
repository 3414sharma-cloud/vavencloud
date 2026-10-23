import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { faqs as defaultFaqs, type Faq } from './faq.data.ts'

/** FAQ accordion. Pass page-specific questions via `items` (e.g. a pricing FAQ). */
export function faqSection({ items = defaultFaqs }: { items?: Faq[] } = {}): Section {
  return {
    html: `
<section id="faq" class="bg-slate-50 py-24 sm:py-32">
  <div class="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
    <div class="reveal lg:sticky lg:top-28 lg:self-start">
      ${sectionHeading({
        eyebrow: 'FAQ',
        title: 'Frequently asked <span class="text-brand-600">questions</span>',
        description: "Everything you need to know about our services. Can't find an answer? Our team is happy to help.",
      })}
      <div class="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex items-center gap-4">
          <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">${icon('support', 'h-6 w-6')}</span>
          <div>
            <p class="font-semibold text-slate-900">Still have questions?</p>
            <p class="text-sm text-slate-500">We usually reply in under 10 minutes.</p>
          </div>
        </div>
        <a href="${routes.contact}" class="btn-primary mt-5 w-full">Talk to an expert</a>
      </div>
    </div>

    <div class="reveal space-y-4" style="transition-delay:100ms">
      ${items
        .map(
          (f, i) => `
      <details class="group rounded-2xl border border-slate-200 bg-white px-6 py-5 transition open:border-brand-200 open:shadow-lg open:shadow-brand-500/5" ${i === 0 ? 'open' : ''}>
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg text-left font-semibold text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500">
          ${f.q}
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition duration-300 group-open:rotate-45 group-open:bg-brand-600 group-open:text-white">${icon('plus', 'h-4 w-4')}</span>
        </summary>
        <p class="mt-4 pr-12 leading-relaxed text-slate-600">${f.a}</p>
      </details>`,
        )
        .join('')}
    </div>
  </div>
</section>`,
  }
}
