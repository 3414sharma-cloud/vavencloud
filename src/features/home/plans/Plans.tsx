import { Link } from 'react-router'
import { routes } from '@/app/routes.ts'
import { Icon } from '@/components/ui/Icon.tsx'
import { SectionHeading } from '@/components/ui/SectionHeading.tsx'
import { Start } from '../start/Start.tsx'
import { comparisonFeatures, plans, safety, scope } from './plans.data.ts'
import type { IconName } from '@/components/ui/icons.ts'
import { btnPrimary, card, container, iconBox } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * The plans: the heading, the three plans as tall cards (numbered, the price large), then Managed and Partner
 * in a light comparison table (Partner's column highlighted; a card per plan on a phone), the safety promises as one strip,
 * the handover (Start), and what the plan hours cover.
 */

const comparedPlans = plans.flatMap(({ name, icon, comparison }) =>
  comparison ? [{ name, icon, ...comparison }] : [],
)
const maxCodeFixHours = Math.max(...comparedPlans.map((plan) => plan.codeFixHours))

const mono = 'font-[ui-monospace,SFMono-Regular,Menlo,monospace]'

function Pricing() {
  return (
    <div className="mt-10 sm:mt-14">
      <ul aria-label="Production support plans" className="grid gap-4 md:grid-cols-3">
        {plans.map((plan, i) => (
          <li key={plan.name} data-reveal="" className={cn(card, 'flex flex-col rounded-3xl p-6 sm:p-7')}>
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
            <p className="mt-2 text-[0.95rem] leading-relaxed text-neutral-600 dark:text-neutral-400">{plan.bestFor}</p>
            <div className="mt-auto pt-6">
              <p className="border-t border-dashed border-neutral-200 pt-5 text-[1.35rem] font-semibold tracking-[-0.03em] text-brand-700 dark:border-neutral-800 dark:text-brand-300">
                {plan.price}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <Comparison />
    </div>
  )
}

/** An icon for each comparison row */
const featureIcon: Record<(typeof comparisonFeatures)[number]['key'], IconName> = {
  engineering: 'users',
  infrastructure: 'server',
  reporting: 'activity',
}

/** The hours as a row of segments, one per hour, out of the largest plan's */
const HoursMeter = ({ hours }: { hours: number }) => (
  <div aria-hidden="true" className="mt-3 flex max-w-64 gap-[3px]">
    {Array.from({ length: maxCodeFixHours }, (_, h) => (
      <span
        key={h}
        className={cn(
          'h-2 flex-1 rounded-full',
          h < hours ? 'bg-brand-500 dark:bg-brand-400' : 'bg-neutral-200 dark:bg-neutral-800',
        )}
      />
    ))}
  </div>
)

/** A plan's name with its icon */
const PlanName = ({ plan, highlight }: { plan: (typeof comparedPlans)[number]; highlight: boolean }) => (
  <span className="flex items-center gap-3">
    <span
      className={cn(
        iconBox,
        'size-9 rounded-lg',
        highlight && 'border-transparent bg-brand-600 text-white dark:border-transparent dark:bg-brand-500 dark:text-white',
      )}
      aria-hidden="true"
    >
      <Icon name={plan.icon} className="size-4" />
    </span>
    <span className="text-[1.15rem] font-[650] tracking-[-0.02em] text-neutral-950 dark:text-white">{plan.name}</span>
  </span>
)

/*
 * Managed and Partner side by side on a white card. From 768px a table, the Partner column lifted with a brand
 * tint and a bar across its top; on a phone a card per plan, each row's label above its value.
 */
function Comparison() {
  const last = comparedPlans.length - 1
  /** The highlighted (last) column's cells */
  const col = (i: number) =>
    cn('border-l border-neutral-200 px-6 dark:border-neutral-800', i === last && 'bg-brand-50/70 dark:bg-brand-950/40')
  return (
    <section
      aria-labelledby="plan-comparison-heading"
      data-reveal=""
      className="mt-5 rounded-[2rem] border border-neutral-200/80 bg-white p-5 [box-shadow:var(--shadow-card)] sm:p-8 lg:p-10 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <h3
        id="plan-comparison-heading"
        className="text-center text-[length:clamp(1.5rem,3vw,2.1rem)] font-[600] tracking-[-0.03em] text-neutral-950 dark:text-white"
      >
        Compare Managed and Partner
      </h3>

      {/* From 768px: the table */}
      <div className="mt-8 hidden overflow-hidden rounded-2xl border border-neutral-200 md:block dark:border-neutral-800">
        <table aria-labelledby="plan-comparison-heading" className="w-full table-fixed text-left text-[0.93rem] leading-relaxed">
          <thead>
            <tr>
              <th scope="col" className="w-[30%] px-6 py-5 align-bottom text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Feature
              </th>
              {comparedPlans.map((plan, i) => (
                <th
                  key={plan.name}
                  scope="col"
                  className={cn(
                    col(i),
                    'relative py-5 font-normal',
                    i === last &&
                      "before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-brand-600 before:content-[''] dark:before:bg-brand-400",
                  )}
                >
                  <PlanName plan={plan} highlight={i === last} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 border-t border-neutral-200 text-neutral-700 dark:divide-neutral-800 dark:border-neutral-800 dark:text-neutral-300">
            <tr>
              <th scope="row" className="px-6 py-5 align-top font-[650] text-neutral-950 dark:text-white">
                <span className="flex items-center gap-2.5">
                  <Icon name="clock" className="size-4 flex-none text-brand-600 dark:text-brand-400" />
                  Monthly code fixes
                </span>
              </th>
              {comparedPlans.map(({ name, codeFixHours }, i) => (
                <td key={name} className={cn(col(i), 'py-5 align-top')}>
                  <span className="text-[1.9rem] leading-none font-[650] tracking-[-0.04em] text-neutral-950 tabular-nums dark:text-white">
                    {codeFixHours} hours
                  </span>
                  <HoursMeter hours={codeFixHours} />
                </td>
              ))}
            </tr>
            {comparisonFeatures.map(({ key, label }) => (
              <tr key={key}>
                <th scope="row" className="px-6 py-5 align-top font-[650] text-neutral-950 dark:text-white">
                  <span className="flex items-center gap-2.5">
                    <Icon name={featureIcon[key]} className="size-4 flex-none text-brand-600 dark:text-brand-400" />
                    {label}
                  </span>
                </th>
                {comparedPlans.map((plan, i) => (
                  <td key={plan.name} className={cn(col(i), 'py-5 align-top')}>
                    <span className="flex items-start gap-2.5">
                      <Icon name="check" className="mt-[0.3rem] size-3.5 flex-none text-brand-600 dark:text-brand-400" />
                      {plan.benefits[key]}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Under 768px: a card per plan */}
      <div className="mt-6 grid gap-4 md:hidden">
        {comparedPlans.map((plan, i) => (
          <article
            key={plan.name}
            className={cn(
              'overflow-hidden rounded-2xl border p-5',
              i === last
                ? 'border-brand-200 bg-brand-50/70 [box-shadow:inset_0_4px_0_var(--color-brand-600)] dark:border-brand-900 dark:bg-brand-950/40 dark:[box-shadow:inset_0_4px_0_var(--color-brand-400)]'
                : 'border-neutral-200 dark:border-neutral-800',
            )}
          >
            <h4>
              <PlanName plan={plan} highlight={i === last} />
            </h4>
            <dl className="mt-5 grid gap-4 text-[0.93rem] leading-relaxed text-neutral-700 dark:text-neutral-300">
              <div>
                <dt className="text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                  Monthly code fixes
                </dt>
                <dd className="mt-1.5">
                  <span className="text-[1.7rem] leading-none font-[650] tracking-[-0.04em] text-neutral-950 tabular-nums dark:text-white">
                    {plan.codeFixHours} hours
                  </span>
                  <HoursMeter hours={plan.codeFixHours} />
                </dd>
              </div>
              {comparisonFeatures.map(({ key, label }) => (
                <div key={key} className="border-t border-neutral-200 pt-4 dark:border-neutral-800">
                  <dt className="flex items-center gap-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                    <Icon name={featureIcon[key]} className="size-3.5 text-brand-600 dark:text-brand-400" />
                    {label}
                  </dt>
                  <dd className="mt-1.5">{plan.benefits[key]}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>

      <div className="mt-7 flex justify-center sm:mt-8">
        <Link to={routes.book} className={cn(btnPrimary, 'min-h-11 px-6')}>
          Book a free review <Icon name="arrow-right" className="size-4" />
        </Link>
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
