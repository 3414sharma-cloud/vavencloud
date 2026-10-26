import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { onNeedChange, setNeed } from '@/modules/needs/needs.store.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { services as defaultServices, type Service } from './services.data.ts'

/* Cards marked data-match="true" (recommended for the visitor's choice) get a blue outline and a badge. */
const serviceCard = (s: Service) => `
  <article data-service data-needs="${s.needs.join(' ')}" data-match="false" class="group card flex flex-col p-6 transition-colors hover:border-neutral-400 data-[match=true]:border-brand-600 dark:hover:border-neutral-600 dark:data-[match=true]:border-brand-400">
    <div class="flex items-start justify-between gap-4">
      <span class="icon-box">${icon(s.icon, 'h-5 w-5')}</span>
      <span class="hidden rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 group-data-[match=true]:inline-flex dark:bg-brand-950 dark:text-brand-300">Recommended</span>
    </div>
    <h3 class="mt-5 text-lg font-semibold text-neutral-950 dark:text-white">${s.title}</h3>
    <p class="mt-2 leading-relaxed">${s.description}</p>
    <ul class="mt-5 flex flex-wrap gap-2">
      ${s.tags.map((t) => `<li class="rounded-md border border-neutral-200 px-2 py-0.5 text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">${t}</li>`).join('')}
    </ul>
    <a href="${routes.contact}" class="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-neutral-950 underline-offset-4 hover:underline dark:text-white">
      Talk to us<span class="sr-only"> about ${s.title}</span> ${icon('arrow-right', 'h-4 w-4')}
    </a>
  </article>`

interface ServicesOptions {
  services?: Service[]
}

export function servicesSection({ services = defaultServices }: ServicesOptions = {}): Section {
  return {
    html: `
<section id="services" class="py-20 sm:py-28">
  <div class="container-page">
    <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div class="max-w-2xl">
        ${sectionHeading({
          eyebrow: 'Platform',
          title: 'Everything your product needs to run',
          description: 'Hosting, servers, deployment and a team on call. One platform behind your app.',
        })}
      </div>
      <p id="services-pref" class="hidden text-sm" aria-live="polite">
        Highlighted for <span data-need-label class="font-semibold text-neutral-950 dark:text-white"></span>
        · <button type="button" data-need-clear class="font-medium underline underline-offset-4 hover:text-neutral-950 dark:hover:text-white">Show all equally</button>
      </p>
    </div>

    <div class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      ${services.map(serviceCard).join('')}
    </div>
  </div>
</section>`,
    init() {
      const section = qs('#services')
      const cards = qsa('[data-service]', section)
      const pref = qs('#services-pref', section)
      qs('[data-need-clear]', pref).addEventListener('click', () => setNeed(null))

      onNeedChange((need) => {
        cards.forEach((card) => {
          card.dataset.match = String(!!need && (card.dataset.needs ?? '').split(' ').includes(need.id))
        })
        pref.classList.toggle('hidden', !need)
        qs('[data-need-label]', pref).textContent = need ? `"${need.label.toLowerCase()}"` : ''
      })
    },
  }
}
