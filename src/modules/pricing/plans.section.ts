import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { site } from '@/app/site.config.ts'
import type { PlanTabId } from '@/modules/needs/needs.data.ts'
import { onNeedChange } from '@/modules/needs/needs.store.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { planGroups, type Plan, type PlanCategory } from './pricing.data.ts'

/** Features listed per card; the rest is summarised as "+ N more". */
const MAX_FEATURES = 6

function findCategory(id: PlanTabId): PlanCategory {
  const category = planGroups.flatMap((g) => g.categories).find((c) => c.id === id)
  if (!category) throw new Error(`Plan category not found: ${id}`)
  return category
}

// Grid classes are written out in full so Tailwind can find them.
const tabs: { id: PlanTabId; label: string; grid: string }[] = [
  { id: 'web-hosting', label: 'Web Hosting', grid: 'md:grid-cols-3' },
  { id: 'compute', label: 'Cloud Servers (VPS)', grid: 'sm:grid-cols-2 lg:grid-cols-5' },
]

const planCard = (p: Plan) => {
  const shown = p.features.slice(0, MAX_FEATURES)
  const more = p.features.length - shown.length
  return `
  <article class="card flex flex-col p-6 ${p.popular ? 'border-brand-600 ring-1 ring-brand-600 dark:border-brand-400 dark:ring-brand-400' : ''}">
    <div class="flex items-center justify-between gap-3">
      <h3 class="font-semibold text-neutral-950 dark:text-white">${p.name}</h3>
      ${p.popular ? '<span class="rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-medium text-white dark:bg-brand-500">Popular</span>' : ''}
    </div>
    ${p.description ? `<p class="mt-2 text-sm">${p.description}</p>` : ''}
    <p class="mt-5 flex items-baseline gap-1">
      <span class="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white">${p.price}</span>
      ${p.period ? `<span class="text-sm text-neutral-500">${p.period}</span>` : ''}
    </p>
    ${
      p.oldPrice
        ? `<p class="mt-1 text-xs text-neutral-500"><s>${p.oldPrice}</s><span class="sr-only"> regular price</span>${p.discount ? ` · ${p.discount}` : ''}</p>`
        : ''
    }
    <ul class="mt-6 flex-1 space-y-2.5 text-sm">
      ${shown.map((f) => `<li class="flex gap-2">${icon('check', 'mt-0.5 h-4 w-4 shrink-0 text-neutral-950 dark:text-white')}${f}</li>`).join('')}
      ${more > 0 ? `<li class="pl-6 text-neutral-500">+ ${more} more</li>` : ''}
    </ul>
    <a href="${site.panelUrl}" target="_blank" rel="noopener noreferrer" class="${p.popular ? 'btn-primary' : 'btn-secondary'} mt-6 w-full">
      Choose ${p.name}<span class="sr-only"> (opens in a new tab)</span>
    </a>
  </article>`
}

export function plansSection(): Section {
  return {
    html: `
<section id="plans" class="py-20 sm:py-28">
  <div class="container-page">
    <div class="mx-auto max-w-2xl text-center">
      ${sectionHeading({
        eyebrow: 'Plans',
        title: 'Pick a home for your product',
        description: 'Clear prices, no hidden fees. Start small and grow when your product does.',
      })}
    </div>

    <div class="mt-10 flex justify-center">
      <div role="tablist" aria-label="Plan type" class="inline-flex rounded-full border border-neutral-200 p-1 dark:border-neutral-800">
        ${tabs
          .map(
            (t, i) => `
        <button type="button" role="tab" id="plans-tab-${t.id}" aria-controls="plans-panel-${t.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-tab="${t.id}"
          class="rounded-full px-5 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 aria-selected:bg-neutral-950 aria-selected:text-white dark:text-neutral-400 dark:hover:text-white dark:aria-selected:bg-white dark:aria-selected:text-neutral-950">${t.label}</button>`,
          )
          .join('')}
      </div>
    </div>

    ${tabs
      .map(
        (t, i) => `
    <div role="tabpanel" id="plans-panel-${t.id}" aria-labelledby="plans-tab-${t.id}" tabindex="0" class="mt-10 grid gap-5 ${t.grid} focus-visible:outline-none" ${i === 0 ? '' : 'hidden'}>
      ${findCategory(t.id).plans.map(planCard).join('')}
    </div>`,
      )
      .join('')}

    <p class="mt-8 text-center text-sm text-neutral-500">
      Prices in USD, billed monthly. Need something custom?
      <a href="${routes.contact}" class="font-medium text-neutral-950 underline underline-offset-4 dark:text-white">Talk to our team</a>.
    </p>

    <!-- Development as a quiet extra, after the main plans (docs/messaging.md → "Where development goes") -->
    <aside class="mx-auto mt-14 flex max-w-3xl flex-col gap-5 rounded-3xl border border-dashed border-neutral-300 p-6 sm:flex-row sm:items-center sm:p-7 dark:border-neutral-700" aria-labelledby="extra-hands-title">
      <span class="icon-box">${icon('code', 'h-5 w-5')}</span>
      <div class="flex-1">
        <h3 id="extra-hands-title" class="font-semibold text-neutral-950 dark:text-white">Need extra hands?</h3>
        <p class="mt-1 text-sm leading-relaxed">Need a fix or a new feature? Our engineers can help, on your code and at your pace.</p>
      </div>
      <a href="${routes.contact}" class="btn-secondary shrink-0">Ask our engineers</a>
    </aside>
  </div>
</section>`,
    init() {
      const section = qs('#plans')
      const tabButtons = qsa<HTMLButtonElement>('[role="tab"]', section)

      const select = (id: string, focus = false) => {
        tabButtons.forEach((b) => {
          const active = b.dataset.tab === id
          b.setAttribute('aria-selected', String(active))
          b.tabIndex = active ? 0 : -1
          qs(`#${b.getAttribute('aria-controls')}`, section).hidden = !active
          if (active && focus) b.focus()
        })
      }

      tabButtons.forEach((b, i) => {
        b.addEventListener('click', () => select(b.dataset.tab!))
        // Arrow keys move between tabs (WAI-ARIA tabs pattern)
        b.addEventListener('keydown', (e) => {
          const last = tabButtons.length - 1
          const next = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[e.key]
          if (next === undefined) return
          e.preventDefault()
          select(tabButtons[next].dataset.tab!, true)
        })
      })

      // Follow the visitor's choice in the hero picker
      onNeedChange((need) => {
        if (need?.planTab) select(need.planTab)
      })
    },
  }
}
