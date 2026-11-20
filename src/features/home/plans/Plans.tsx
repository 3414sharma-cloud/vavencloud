import { Link } from 'react-router'
import { Icon } from '@/components/ui/Icon.tsx'
import { SectionHeading } from '@/components/ui/SectionHeading.tsx'
import { Start } from '../start/Start.tsx'
import { comparison, everyPlan, plans, safety, sameCore, scope } from './plans.data.ts'
import { btnPrimary, btnSecondary, card, container, iconBox } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * The plans ("VavenCloud Plans: Essential, Managed, Partner"): the heading, the three plan cards (six bullets
 * each, so they line up), the line on what every plan shares, then the full comparison (what every plan includes,
 * and each plan row by row, in groups: a table from 768px, a fold-out card per plan on a phone), the safety
 * promises, the handover (Start), and what the plan hours cover.
 */

const mono = 'font-[ui-monospace,SFMono-Regular,Menlo,monospace]'

/** A check, as in front of every included item */
const Check = ({ className = '' }: { className?: string }) => (
  <Icon name="check" className={cn('size-3.5 flex-none text-brand-600 dark:text-brand-400', className)} />
)

function Pricing() {
  return (
    <div className="mt-10 sm:mt-14">
      <ul aria-label="Production support plans" className="grid gap-4 md:grid-cols-3">
        {plans.map((plan, i) => (
          <li key={plan.key} data-reveal="" className={cn(card, 'flex flex-col rounded-3xl p-6 sm:p-7')}>
            <div className="flex items-center justify-between gap-3">
              <span className={iconBox} aria-hidden="true">
                <Icon name={plan.icon} className="size-5" />
              </span>
              <span className={`${mono} text-[0.7rem] font-bold tracking-[0.08em] text-neutral-400`} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <h3 className="mt-6 text-[1.3rem] font-[650] tracking-[-0.02em] text-neutral-950 dark:text-white">
              {plan.name}
            </h3>
            {/* Two lines tall from 768px, so the prices line up across the cards */}
            <p className="mt-2 text-[0.95rem] leading-relaxed text-neutral-600 md:min-h-[3.1rem] dark:text-neutral-400">
              {plan.tagline}
            </p>
            <div className="mt-5 border-t border-dashed border-neutral-200 pt-5 dark:border-neutral-800">
              <p className="text-[1.35rem] font-semibold tracking-[-0.03em] text-brand-700 dark:text-brand-300">
                {plan.price}
              </p>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{plan.forWhom}</p>
            </div>
            <ul className="mt-5 grid gap-2.5 text-[0.92rem] leading-snug text-neutral-700 dark:text-neutral-300">
              {plan.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <Check className="mt-[0.2rem]" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-7">
              <Link
                to={plan.cta.href}
                className={cn(plan.key === 'essential' ? btnSecondary : btnPrimary, 'min-h-11 w-full px-5')}
              >
                {plan.cta.label} <Icon name="arrow-right" className="size-4" />
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <p className="mx-auto mt-6 max-w-2xl text-center text-[0.95rem] leading-relaxed text-neutral-600 dark:text-neutral-400">
        {sameCore}
      </p>

      <Comparison />
    </div>
  )
}

/** A plan's name with its icon */
const PlanName = ({ plan }: { plan: (typeof plans)[number] }) => (
  <span className="flex items-center gap-3">
    <span className={cn(iconBox, 'size-9 rounded-lg')} aria-hidden="true">
      <Icon name={plan.icon} className="size-4" />
    </span>
    <span className="text-[1.1rem] font-[650] tracking-[-0.02em] text-neutral-950 dark:text-white">{plan.name}</span>
  </span>
)

const groupLabel = 'text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400'

/** What every plan includes: the core that never moves behind a higher price */
function EveryPlan() {
  return (
    <div className="mt-8 rounded-2xl bg-brand-50/70 p-5 sm:p-6 dark:bg-brand-950/30">
      <h4 className={groupLabel}>Included on every plan</h4>
      <ul className="mt-4 grid gap-x-8 gap-y-3 text-[0.93rem] leading-snug text-neutral-700 sm:grid-cols-2 dark:text-neutral-300">
        {everyPlan.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <Check className="mt-[0.2rem]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

/*
 * The full comparison on a white card: what every plan includes, then each plan row by row. From 768px a table
 * with a heading row per group; on a phone a fold-out card per plan, its rows under the same group headings.
 */
function Comparison() {
  const col = 'border-l border-neutral-200 px-5 dark:border-neutral-800'
  return (
    <section
      aria-labelledby="plan-comparison-heading"
      data-reveal=""
      className="mt-8 rounded-[2rem] border border-neutral-200/80 bg-white p-5 [box-shadow:var(--shadow-card)] sm:p-8 lg:p-10 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <h3
        id="plan-comparison-heading"
        className="text-center text-[length:clamp(1.5rem,3vw,2.1rem)] font-[600] tracking-[-0.03em] text-neutral-950 dark:text-white"
      >
        Compare the plans
      </h3>

      <EveryPlan />

      {/* From 768px: the table */}
      <div className="mt-8 hidden overflow-hidden rounded-2xl border border-neutral-200 md:block dark:border-neutral-800">
        <table
          aria-labelledby="plan-comparison-heading"
          className="w-full table-fixed text-left text-[0.9rem] leading-relaxed"
        >
          <thead>
            <tr>
              <th
                scope="col"
                className="w-[22%] px-5 py-5 align-bottom text-sm font-medium text-neutral-500 dark:text-neutral-400"
              >
                <span className="sr-only">Feature</span>
              </th>
              {plans.map((plan) => (
                <th key={plan.key} scope="col" className={cn(col, 'py-5 font-normal')}>
                  <PlanName plan={plan} />
                </th>
              ))}
            </tr>
          </thead>
          {comparison.map(({ group, rows }) => (
            <tbody
              key={group}
              className="border-t border-neutral-200 text-neutral-700 dark:border-neutral-800 dark:text-neutral-300"
            >
              <tr className="bg-neutral-50 dark:bg-neutral-950/40">
                <th scope="colgroup" colSpan={plans.length + 1} className={cn(groupLabel, 'px-5 py-3')}>
                  {group}
                </th>
              </tr>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-neutral-200 dark:border-neutral-800">
                  <th scope="row" className="px-5 py-4 align-top font-[650] text-neutral-950 dark:text-white">
                    {row.label}
                  </th>
                  {plans.map((plan) => (
                    <td key={plan.key} className={cn(col, 'py-4 align-top')}>
                      {row.values[plan.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>

      {/* Under 768px: a fold-out card per plan */}
      <div className="mt-6 grid gap-3 md:hidden">
        {plans.map((plan) => (
          <details
            key={plan.key}
            className="group rounded-2xl border border-neutral-200 open:bg-neutral-50/60 dark:border-neutral-800 dark:open:bg-neutral-950/30"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden">
              <PlanName plan={plan} />
              <Icon
                name="chevron-down"
                className="size-4 flex-none text-neutral-500 transition-transform group-open:rotate-180"
              />
            </summary>
            <div className="px-4 pb-5">
              {comparison.map(({ group, rows }) => (
                <div key={group} className="mt-4 first:mt-0">
                  <h4 className={groupLabel}>{group}</h4>
                  <dl className="mt-2 grid gap-3 text-[0.92rem] leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {rows.map((row) => (
                      <div key={row.label} className="border-t border-neutral-200 pt-3 dark:border-neutral-800">
                        <dt className="font-[650] text-neutral-950 dark:text-white">{row.label}</dt>
                        <dd className="mt-0.5">{row.values[plan.key]}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

/** Why it's safe to start: three promises in one strip, split by hairlines */
function Safety() {
  return (
    <ul
      aria-label="Why it’s safe to start"
      data-reveal=""
      className="mt-5 grid divide-y divide-neutral-200 rounded-3xl border border-neutral-200 bg-white/60 md:grid-cols-3 md:divide-x md:divide-y-0 dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/40"
    >
      {safety.map((s) => (
        <li key={s.title} className="flex items-start gap-4 p-5 sm:p-6">
          <span className={cn(iconBox, 'size-11 rounded-full')} aria-hidden="true">
            <Icon name={s.icon} className="size-[1.1rem]" />
          </span>
          <div>
            <p className="font-[650] text-neutral-950 dark:text-white">{s.title}</p>
            <p className="mt-1 text-[0.9rem] leading-[1.55] text-neutral-600 dark:text-neutral-400">{s.text}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

/** A list of what's in or out: a check for included, a dash for quoted */
const List = ({ items, included }: { items: string[]; included: boolean }) => (
  <ul className="mt-5 grid gap-3 text-[0.93rem] leading-snug text-neutral-700 dark:text-neutral-300">
    {items.map((i) => (
      <li key={i} className="flex items-start gap-3">
        <span
          className={cn(
            'mt-[0.1rem] inline-flex size-[1.15rem] flex-none items-center justify-center rounded-full',
            included
              ? 'bg-brand-600 text-white dark:bg-brand-500'
              : 'border border-neutral-300 text-neutral-500 dark:border-neutral-700 dark:text-neutral-400',
          )}
          aria-hidden="true"
        >
          <Icon name={included ? 'check' : 'minus'} className="size-3" />
        </span>
        {i}
      </li>
    ))}
  </ul>
)

const scopeTitle =
  'flex items-center gap-3 text-[1.1rem] font-[650] tracking-[-0.01em] text-neutral-950 dark:text-white'

/** What the plan hours cover, what's quoted first, and that nothing is billed without approval */
function Scope() {
  return (
    <div data-reveal="" className={cn(card, 'mt-7 overflow-hidden rounded-3xl p-0 sm:mt-9')}>
      <div className="grid md:grid-cols-2">
        <div className="bg-brand-50/70 p-6 md:p-8 dark:bg-brand-950/30">
          <h3 className={scopeTitle}>
            <span className={cn(iconBox, 'size-9 rounded-lg')} aria-hidden="true">
              <Icon name="check" className="size-4" />
            </span>
            Included in your plan hours
          </h3>
          <List items={scope.included} included />
        </div>
        <div className="p-6 md:p-8">
          <h3 className={scopeTitle}>
            <span
              className="inline-flex size-9 flex-none items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-[0.95rem] font-bold text-neutral-600 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
              aria-hidden="true"
            >
              $
            </span>
            Quoted separately, before we start
          </h3>
          <List items={scope.quoted} included={false} />
        </div>
      </div>
      <div className="flex items-start gap-3 border-t border-neutral-200 px-6 py-5 md:px-8 dark:border-neutral-800">
        <Icon name="shield" className="mt-[0.15rem] size-[1.1rem] flex-none text-brand-600 dark:text-brand-400" />
        <p className="text-[0.92rem] leading-relaxed text-neutral-700 dark:text-neutral-300">
          <b className="text-neutral-950 dark:text-white">{scope.note[0]}</b> {scope.note[1]}
        </p>
      </div>
    </div>
  )
}

export function Plans() {
  return (
    <section
      id="plans"
      className="relative isolate overflow-hidden border-t border-neutral-200 py-16 sm:py-24 dark:border-neutral-800"
      aria-labelledby="plans-title"
    >
      {/* A soft petrol glow behind the heading */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_srgb,var(--color-brand-400)_16%,transparent),transparent_70%)] dark:bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_srgb,var(--color-brand-500)_12%,transparent),transparent_70%)]"
      />
      <div className={container}>
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            titleClassName="text-[length:clamp(2.1rem,4.7vw,3.75rem)] leading-[1.08] [&_em]:inline [&_em]:leading-none"
            leadClassName="mt-5"
            id="plans-title"
            title="Covered in two weeks, <em>without the risk.</em>"
            description="Start with a free 30-minute review and keep the written roadmap. Plans start at $100/month, and you can change plans anytime."
          />
        </div>
        <Pricing />
        <Safety />
        <Start />
        <Scope />
      </div>
    </section>
  )
}
