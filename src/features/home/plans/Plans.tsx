import { Link } from 'react-router'
import { routes } from '@/app/routes.ts'
import { Icon } from '@/components/ui/Icon.tsx'
import { SectionHeading } from '@/components/ui/SectionHeading.tsx'
import { plans, safety, scope, type Plan } from './plans.data.ts'
import { btnPrimary, btnSecondary, card, container, surfaceInk } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * The plans, then what the plan hours cover and why it's safe to start: what's included, what's quoted first,
 * and that nothing is billed without approval. The popular plan is the dark card (surfaceInk), in its own
 * colours in both themes.
 */

/** Rows that are the same on both plans are said once in the intro instead */
const shared = ['Price', 'On call']

function Card({ p }: { p: Plan }) {
  return (
    <article className={cn(p.popular ? surfaceInk : card, 'flex flex-col rounded-3xl p-7 sm:p-8')}>
      <div className="flex items-center justify-between gap-3">
        <h3
          className={`text-[1.5rem] font-[650] tracking-[-0.03em] ${p.popular ? 'text-white' : 'text-neutral-950 dark:text-white'}`}
        >
          {p.name}
        </h3>
        {p.popular && (
          <span className="rounded-full bg-brand-500 px-[0.7rem] py-[0.2rem] text-[0.72rem] font-[650] text-white">
            Most chosen
          </span>
        )}
      </div>
      <p
        className={`mt-[0.4rem] text-[0.92rem] ${p.popular ? 'text-(--color-ink-text)' : 'text-neutral-600 dark:text-neutral-400'}`}
      >
        Best for {p.bestFor.charAt(0).toLowerCase()}
        {p.bestFor.slice(1)}
      </p>
      <dl className="mt-5 mb-6 grid text-[0.9rem]">
        {p.rows
          .filter((r) => !shared.includes(r.label))
          .map((r) => (
            <div
              key={r.label}
              className={`grid gap-x-4 gap-y-[0.15rem] border-t py-3 sm:grid-cols-[11rem_minmax(0,1fr)] ${p.popular ? 'border-t-[rgb(255_255_255/0.1)]' : 'border-t-neutral-200 dark:border-t-neutral-800'}`}
            >
              <dt className={p.popular ? 'text-(--color-ink-text)' : 'text-neutral-500'}>{r.label}</dt>
              <dd className={`font-semibold ${p.popular ? 'text-white' : 'text-neutral-950 dark:text-white'}`}>
                {r.value}
              </dd>
            </div>
          ))}
      </dl>
      <Link to={routes.book} className={cn(p.popular ? btnPrimary : btnSecondary, 'mt-auto w-full !py-3')}>
        Book a free review<span className="sr-only"> for the {p.name} plan</span>{' '}
        <Icon name="arrow-right" className="h-4 w-4" />
      </Link>
    </article>
  )
}

/** A list of what's in or out, each with a small dot */
const List = ({ items }: { items: string[] }) => (
  <ul className="mt-[0.9rem] grid gap-[0.55rem] text-[0.92rem] text-neutral-700 dark:text-neutral-300">
    {items.map((i) => (
      <li
        key={i}
        className="flex gap-[0.65rem] before:mt-[0.55rem] before:size-[0.35rem] before:flex-none before:rounded-full before:bg-neutral-400 before:content-['']"
      >
        {i}
      </li>
    ))}
  </ul>
)

const scopeTitle = 'flex items-center gap-[0.6rem] text-[1.05rem] font-[650] text-neutral-950 dark:text-white'
const mark = 'inline-flex size-[1.1rem] flex-none items-center justify-center rounded-full text-[0.68rem] font-bold'

/** What the plan hours cover, what's quoted first, and that nothing is billed without approval */
function Scope() {
  return (
    <div data-reveal="" className={cn(card, 'mt-5 grid gap-7 rounded-3xl px-6 py-7 md:grid-cols-2 md:p-[1.9rem]')}>
      <div>
        <h3 className={scopeTitle}>
          <span
            className={`${mark} bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300`}
            aria-hidden="true"
          >
            <Icon name="check" className="h-3 w-3" />
          </span>
          Included in your plan hours
        </h3>
        <List items={scope.included} />
      </div>
      <div>
        <h3 className={scopeTitle}>
          <span
            className={`${mark} bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300`}
            aria-hidden="true"
          >
            $
          </span>
          Quoted separately, before we start
        </h3>
        <List items={scope.quoted} />
      </div>
      <p className="border-t border-t-neutral-100 pt-[1.1rem] text-[0.9rem] text-neutral-700 md:[grid-column:1/-1] dark:border-t-neutral-800 dark:text-neutral-300">
        <b className="text-neutral-950 dark:text-white">{scope.note[0]}</b> {scope.note[1]}
      </p>
    </div>
  )
}

export function Plans() {
  return (
    <section
      id="plans"
      className="py-20 sm:py-26 border-t border-neutral-200 dark:border-neutral-800"
      aria-labelledby="plans-title"
    >
      <div className={container}>
        <div className="max-w-6xl">
          <SectionHeading
            wide
            id="plans-title"
            title="Two ways to hand over production. <em>Both on call 24/7.</em>"
            description="Every plan includes your engineers, your client portal and round-the-clock cover, for one fixed monthly fee agreed after your free review. What changes is how much of your product we take on."
          />
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {plans.map((p) => (
            <Card key={p.name} p={p} />
          ))}
        </div>
        <Scope />
        <ul className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Why it’s safe to start">
          {safety.map((s) => (
            <li key={s.title} className="flex items-start gap-[0.8rem]">
              <span
                className="inline-flex size-[2.2rem] flex-none items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                aria-hidden="true"
              >
                <Icon name={s.icon} className="h-4 w-4" />
              </span>
              <div>
                <p className="font-[650] text-neutral-950 dark:text-white">{s.title}</p>
                <p className="mt-[0.15rem] text-[0.9rem] leading-[1.5] text-neutral-600 dark:text-neutral-400">
                  {s.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
