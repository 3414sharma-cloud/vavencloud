import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { icon } from '@/shared/ui/icons.ts'
import { particleLayer } from '@/shared/ui/particle-layer.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { services as defaultServices, stats as defaultStats, type Service } from './services.data.ts'

const serviceCard = (s: Service, i: number) => {
  const dark = s.featured
  return `
  <article ${dark ? 'data-nav="dark"' : ''} class="reveal group relative flex flex-col overflow-hidden rounded-3xl border p-8 transition duration-500 ease-smooth hover:-translate-y-1 ${
    dark
      ? 'border-white/10 bg-ink-950 text-white shadow-xl shadow-brand-900/20'
      : 'border-slate-200 bg-white shadow-sm hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10'
  } ${s.className ?? ''}" style="transition-delay:${i * 60}ms">
    ${
      dark
        ? `<div class="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-500/40 blur-3xl" aria-hidden="true"></div>
           <div class="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-brand-400/25 blur-3xl" aria-hidden="true"></div>
           ${particleLayer()}`
        : `<div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand-400 to-transparent opacity-0 transition group-hover:opacity-100" aria-hidden="true"></div>`
    }
    <div class="relative flex items-start justify-between gap-4">
      <span class="inline-flex h-12 w-12 items-center justify-center rounded-2xl ${
        dark ? 'bg-linear-to-br from-brand-400 to-brand-300 text-white shadow-lg shadow-brand-500/40' : 'bg-brand-50 text-brand-600 ring-1 ring-brand-100'
      }">${icon(s.icon, 'h-6 w-6')}</span>
      ${dark ? '<span class="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-brand-100">Most popular</span>' : ''}
    </div>
    <h3 class="relative mt-6 text-xl font-semibold ${dark ? 'text-white sm:text-2xl' : 'text-slate-900'}">${s.title}</h3>
    <p class="relative mt-3 leading-relaxed ${dark ? 'max-w-xl text-slate-300' : 'text-slate-600'}">${s.description}</p>
    <ul class="relative mt-6 flex flex-wrap gap-2">
      ${s.tags
        .map(
          (t) =>
            `<li class="rounded-full px-3 py-1 text-xs font-medium ${dark ? 'border border-white/10 bg-white/5 text-slate-200' : 'bg-slate-100 text-slate-600'}">${t}</li>`,
        )
        .join('')}
    </ul>
    <a href="${routes.contact}" class="relative mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-semibold ${dark ? 'text-brand-200' : 'text-brand-600'}">
      Learn more<span class="sr-only"> about ${s.title}</span> ${icon('arrow-right', 'h-4 w-4 transition group-hover:translate-x-1')}
    </a>
  </article>`
}

interface ServicesOptions {
  services?: Service[]
  stats?: { value: string; label: string }[]
  /** Hide the stats strip (e.g. on a page that already shows stats) */
  showStats?: boolean
}

export function servicesSection({ services = defaultServices, stats = defaultStats, showStats = true }: ServicesOptions = {}): Section {
  return {
    html: `
<section id="services" class="relative bg-slate-50 py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6">
    <div class="reveal mx-auto max-w-2xl text-center">
      ${sectionHeading({
        eyebrow: 'Our Services',
        title: 'Hosting &amp; cloud to <span class="text-brand-600">launch, run &amp; scale</span>',
        description:
          'From a single website to a fleet of cloud servers, VavenCloud gives you fast, secure infrastructure so you can focus on your business while we keep it running.',
      })}
    </div>

    <div class="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      ${services.map(serviceCard).join('')}
    </div>

    ${
      showStats
        ? `<dl class="reveal mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 lg:grid-cols-4">
      ${stats
        .map(
          (s) => `
      <div class="flex flex-col items-center gap-1 bg-white px-6 py-8 text-center">
        <dt class="order-2 text-sm text-slate-500">${s.label}</dt>
        <dd class="order-1 bg-linear-to-r from-brand-600 to-brand-400 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">${s.value}</dd>
      </div>`,
        )
        .join('')}
    </dl>`
        : ''
    }

    <div class="mt-12 text-center">
      <a href="${routes.contact}" class="btn-primary">View all services ${icon('arrow-right', 'h-4 w-4')}</a>
    </div>
  </div>
</section>`,
  }
}
