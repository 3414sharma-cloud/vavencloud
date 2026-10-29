import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'

/**
 * Plans (VavenCloud-Sample-Content.md). No prices on purpose: a fixed monthly fee is agreed after
 * the free review. TODO: confirm response times and monthly code hours before launch.
 */
interface Plan {
  name: string
  popular?: boolean
  bestFor: string
  rows: { label: string; value: string }[]
}

const plans: Plan[] = [
  {
    name: 'Managed',
    bestFor: 'Live products with a small development team',
    rows: [
      { label: 'Price', value: 'Fixed monthly fee, agreed after your review' },
      { label: 'On call', value: '24/7, 7 days a week' },
      { label: 'Critical incident response', value: 'Within 1 hour, any time' },
      { label: 'Your engineers', value: 'A dedicated team in your portal and chat' },
      { label: 'Infrastructure', value: 'Designed, built and run by us' },
      { label: 'Deployments and monitoring', value: 'Set up and maintained' },
      { label: 'Fixes in your code', value: '4 hours every month' },
      { label: 'Reporting', value: 'Monthly report' },
    ],
  },
  {
    name: 'Partner',
    popular: true,
    bestFor: 'Products where every minute of downtime costs revenue',
    rows: [
      { label: 'Price', value: 'Fixed monthly fee, agreed after your review' },
      { label: 'On call', value: '24/7, 7 days a week' },
      { label: 'Critical incident response', value: 'Within 30 minutes, any time' },
      { label: 'Your engineers', value: 'A named lead engineer who knows your product inside out' },
      { label: 'Infrastructure', value: 'Designed, built, run and scaled ahead of growth' },
      { label: 'Deployments and monitoring', value: 'Set up and improved every quarter' },
      { label: 'Fixes in your code', value: '20 hours every month' },
      { label: 'Reporting', value: 'Monthly report and a quarterly growth review' },
    ],
  },
]

const planCard = (p: Plan) => `
  <article class="flex flex-col rounded-3xl p-7 sm:p-9 ${
    p.popular
      ? 'surface-ink'
      : 'card'
  }">
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-2xl font-semibold tracking-tight ${p.popular ? 'text-white' : 'text-neutral-950 dark:text-white'}">${p.name}</h3>
      ${p.popular ? '<span class="rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white">Most chosen</span>' : ''}
    </div>
    <p class="mt-2">Best for: ${p.bestFor.toLowerCase()}</p>
    <dl class="mt-8 flex-1 divide-y ${p.popular ? 'divide-white/10' : 'divide-neutral-200 dark:divide-neutral-800'}">
      ${p.rows
        .map(
          (r) => `
      <div class="grid gap-1 py-3.5 text-sm sm:grid-cols-[11rem_1fr] sm:gap-4">
        <dt class="${p.popular ? 'text-neutral-400' : 'text-neutral-500'}">${r.label}</dt>
        <dd class="font-medium ${p.popular ? 'text-white' : 'text-neutral-950 dark:text-white'}">${r.value}</dd>
      </div>`,
        )
        .join('')}
    </dl>
    <a href="${routes.book}" class="${p.popular ? 'btn-primary' : 'btn-secondary'} mt-8 w-full !py-3">
      Book a free review<span class="sr-only"> for the ${p.name} plan</span> ${icon('arrow-right', 'h-4 w-4')}
    </a>
  </article>`

const handover = ['Documentation', 'Access', 'Runbooks', 'A full backup', 'A handover call']

/** Exit promise: an editorial handover record, not another card. */
const exitPromise = () => `
    <section class="mx-auto mt-24 max-w-6xl border-t border-neutral-200 pt-10 sm:mt-32 sm:pt-14 dark:border-neutral-800" aria-labelledby="exit-title">
      <div class="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
          <p class="text-xs font-semibold tracking-[0.14em] text-brand-700 uppercase dark:text-brand-300">The exit promise</p>
          <h3 id="exit-title" class="mt-5 text-5xl leading-[0.94] font-semibold tracking-[-0.06em] text-neutral-950 sm:text-6xl dark:text-white">You’re never<br><span class="text-brand-600 dark:text-brand-400">locked in. Ever.</span></h3>
          <p class="mt-8 max-w-xl text-lg leading-relaxed">Your servers run standard Linux. Your databases are standard MySQL and PostgreSQL. If you ever decide to leave, we hand over everything.</p>
          <p class="mt-5 max-w-xl leading-relaxed text-neutral-500">We’d rather keep you by being good than by making it hard to go.</p>
        </div>
        <div class="lg:pt-12">
          <p class="text-xs font-semibold tracking-[0.14em] text-neutral-500 uppercase">If you leave, you get</p>
          <ol class="mt-5 border-t border-neutral-200 dark:border-neutral-800">
            ${handover
              .map(
                (item, index) => `
                <li class="flex items-center gap-4 border-b border-neutral-200 py-4 text-lg font-semibold tracking-tight text-neutral-950 dark:border-neutral-800 dark:text-white">
                  <span class="w-6 font-mono text-xs font-medium text-brand-600 dark:text-brand-400">${String(index + 1).padStart(2, '0')}</span>
                  <span>${item}</span>
                  ${icon('arrow-right', 'ml-auto h-4 w-4 text-neutral-400')}
                </li>`,
              )
              .join('')}
          </ol>
          <p class="mt-5 max-w-sm text-sm leading-relaxed text-neutral-500">With whoever takes over from us. No proprietary platform. No held-back credentials.</p>
        </div>
      </div>
    </section>`

export function plansSection(): Section {
  return {
    html: `
<section id="plans" class="band-linen border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800">
  <div class="container-page">
    <div class="mx-auto max-w-3xl text-center">
      ${sectionHeading({
        title: 'Two ways to hand over production. Both with one team, 24/7.',
        description: 'Every plan includes your engineers, your client portal and round-the-clock cover. What changes is how much of your product we take on.',
      })}
    </div>

    <div class="mx-auto mt-14 grid max-w-5xl gap-5 lg:grid-cols-2">
      ${plans.map(planCard).join('')}
    </div>

    <p class="mx-auto mt-8 max-w-2xl text-center text-sm text-neutral-500">
      Already on AWS, Azure or Google Cloud? Both plans are available on your own cloud account. We’ll talk it through in your review.
    </p>
    <p class="mx-auto mt-2 max-w-2xl text-center text-sm text-neutral-500">
      New features are quoted separately. Anything beyond your monthly hours is quoted before we start, and we never begin paid work without your written approval.
    </p>

    ${exitPromise()}
  </div>
</section>`,
  }
}
