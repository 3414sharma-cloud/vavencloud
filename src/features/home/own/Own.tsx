import { Icon } from '@/components/ui/Icon.tsx'
import { SectionHeading } from '@/components/ui/SectionHeading.tsx'
import { layers, type Layer } from './own.data.ts'
import { bandLinen, card, container, iconBox, surfaceInk } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * What we own, right after the problem: the five things one team takes off your plate, each with what it does
 * and what that means for you. Fixes in your code is the dark card, since no host or freelancer does it.
 * Two wide cards, then three, on a wide screen; two a row on a tablet (the dark one across); one on a phone.
 */

/** Each card's place in the grid: from 1024px six columns (two wide cards, then three); from 768px two (the dark one across) */
const place = {
  wide: 'lg:[grid-column:span_3]',
  third: 'lg:[grid-column:span_2]',
  feature: 'md:[grid-column:1/-1] lg:[grid-column:span_2]',
}

function Card({ l }: { l: Layer }) {
  // The dark card has its own colours, the same in both themes
  const dark = Boolean(l.feature)
  return (
    <article
      className={cn(
        dark ? surfaceInk : card,
        'flex flex-col rounded-3xl px-6 pt-[1.6rem] pb-6',
        dark ? place.feature : place[l.size],
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            iconBox,
            // the same in both themes
            dark &&
              'border-[rgb(255_255_255/0.12)] bg-[rgb(255_255_255/0.08)] text-brand-300 dark:border-[rgb(255_255_255/0.12)] dark:bg-[rgb(255_255_255/0.08)] dark:text-brand-300',
          )}
        >
          <Icon name={l.icon} className="h-5 w-5" />
        </span>
        {dark && (
          <span className="rounded-full bg-brand-500 px-[0.65rem] py-[0.2rem] text-[0.66rem] font-bold tracking-[0.08em] text-white uppercase">
            Our difference
          </span>
        )}
      </div>
      <h3
        className={`mt-[1.1rem] text-[1.2rem] font-[650] tracking-[-0.02em] ${dark ? 'text-white' : 'text-neutral-950 dark:text-white'}`}
      >
        {l.title}
      </h3>
      <p className="mt-2 text-[0.95rem] leading-[1.6]">{l.text}</p>
      <ul
        className={`mt-[0.95rem] mb-5 grid gap-[0.45rem] text-[0.9rem] ${dark ? 'text-[color-mix(in_srgb,#fff_82%,transparent)]' : 'text-neutral-700 dark:text-neutral-300'}`}
      >
        {l.points.map((p) => (
          <li key={p} className="flex items-start gap-[0.55rem]">
            <span
              className={`mt-[0.15rem] inline-flex size-[1.05rem] flex-none items-center justify-center rounded-full ${dark ? 'bg-[rgb(255_255_255/0.1)] text-brand-300' : 'bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300'}`}
              aria-hidden="true"
            >
              <Icon name="check" className="h-3 w-3" />
            </span>
            {p}
          </li>
        ))}
      </ul>
      <p
        className={`mt-auto border-t pt-4 text-[0.87rem] ${dark ? 'border-t-[rgb(255_255_255/0.12)] text-inherit' : 'border-t-neutral-100 text-neutral-700 dark:border-t-neutral-800 dark:text-neutral-300'}`}
      >
        <b className={`font-[650] ${dark ? 'text-brand-300' : 'text-brand-600 dark:text-brand-400'}`}>For you:</b>{' '}
        {l.forYou}
      </p>
    </article>
  )
}

export function Own() {
  return (
    <section
      id="own"
      className={cn(bandLinen, 'py-20 sm:py-26 border-t border-neutral-200 dark:border-neutral-800')}
      aria-labelledby="own-title"
    >
      <div className={container}>
        {/* A heading across the whole width: the paragraph as wide as the cards under it */}
        <div>
          <SectionHeading
            id="own-title"
            title="One team owns every layer, <em>including your code.</em>"
            description="Most founders run their product on three vendors. We replace all three with one named engineer, backed by a 24/7 operations team and Vavensoft’s developers. Whatever layer the problem sits in, it’s ours."
            leadClassName="max-w-none"
          />
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
          {layers.map((l) => (
            <Card key={l.title} l={l} />
          ))}
        </div>
        <p className="mt-5 rounded-2xl border border-brand-200 bg-brand-50 px-5 py-4 text-center text-base font-semibold text-brand-900 sm:mt-6 sm:text-lg dark:border-brand-900 dark:bg-brand-950 dark:text-brand-100">
          One call. One team. We own the fix.
        </p>
      </div>
    </section>
  )
}
