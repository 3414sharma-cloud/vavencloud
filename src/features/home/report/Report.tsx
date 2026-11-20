import type { CSSProperties } from 'react'
import { MotionConfig, motion } from 'motion/react'
import { inView, item, rise, slideIn, stagger } from '@/lib/scroll-motion.ts'
import { SectionHeading } from '@/components/ui/SectionHeading.tsx'
import { Icon } from '@/components/ui/Icon.tsx'
import { useInViewOnce } from '@/hooks/useInViewOnce.ts'
import { report, reportIntro, workspace } from './report.data.ts'
import { card, container, iconBox } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * The morning after. On the left the promise and where you follow the work, each tool with a one-line headline;
 * on the right the example report for the story's night, tilted a little on a second sheet (it straightens under
 * the pointer). Its time bar is split at the call (red before it, blue with us), and the first time the report
 * is seen the bar sweeps in and a RESOLVED stamp lands. It's an example (labelled so on the report itself), not a
 * real client.
 */

/** "02:53" → minutes since midnight */
const minutes = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

/** How much of the night went by before the call, as a share of the bar */
const lostShare = Math.round(
  ((minutes(report.called) - minutes(report.started)) / (minutes(report.resolved) - minutes(report.started))) * 100,
)

const mono = 'font-[ui-monospace,SFMono-Regular,Menlo,monospace]'

interface PairsProps {
  rows: string[][]
  row?: string
  term: string
  value: string
}

const Pairs = ({ rows, row, term, value }: PairsProps) =>
  rows.map(([k, v]) => (
    <div key={k} className={row}>
      <dt className={term}>{k}</dt>
      <dd className={value}>{v}</dd>
    </div>
  ))

/*
 * Scroll motion (lib/scroll-motion.ts): the heading rises in, the tool cards follow one after another, and the
 * report slides in from the right. Each plays once.
 */
const list = stagger()
const viewport = inView

/** The time bar's two parts, and the legend's dots: red before the call, blue with us */
const lost = 'bg-[rgb(244_63_94)] dark:bg-[rgb(251_113_133)]'
const fix = 'bg-brand-500 dark:bg-brand-400'

/**
 * The example report. The first time it's seen, the bar sweeps in and the RESOLVED stamp lands (.is-in, set on
 * the figure: reveal.ts animates this figure too, so a className from state would undo its classes). Until then
 * the bar is clipped to nothing and the stamp waits, large and invisible.
 */
function Doc() {
  const ref = useInViewOnce<HTMLElement>((el) => el.classList.add('is-in'), { threshold: 0.35 })
  return (
    <motion.figure
      ref={ref}
      data-report=""
      variants={slideIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {/* Tilted a little, on a second sheet behind it, tilted the other way */}
      <div
        className={[
          'relative isolate [transform:rotate(-1deg)] transition-[transform] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          'motion-reduce:[transition:none] [[data-report]:hover_&]:[transform:none]',
          "before:absolute before:inset-0 before:-z-1 before:rounded-3xl before:border before:border-neutral-200 before:bg-white before:content-['']",
          'before:[box-shadow:var(--shadow-card)] before:[transform:translate(0.8rem,0.9rem)_rotate(3deg)]',
          'dark:before:border-neutral-800 dark:before:bg-neutral-900 dark:before:[box-shadow:0_18px_40px_-24px_rgb(0_0_0/0.6)]',
        ].join(' ')}
      >
        <div className={cn(card, 'relative p-7 sm:p-9')}>
          <span
            className={[
              `absolute top-6 right-6 rounded-lg border-2 border-solid px-[0.7rem] py-[0.2rem] ${mono} text-[0.72rem] font-semibold tracking-[0.2em] uppercase`,
              'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400',
              '[transform:rotate(-6deg)] [transition:opacity_0.25s_ease_1.9s,transform_0.35s_cubic-bezier(0.34,1.56,0.64,1)_1.9s] motion-reduce:[transition:none]',
              '[[data-report]:not(.is-in)_&]:opacity-0 [[data-report]:not(.is-in)_&]:[transform:rotate(-6deg)_scale(1.6)]',
            ].join(' ')}
            aria-hidden="true"
          >
            Resolved
          </span>
          <p className={`pr-28 ${mono} text-[0.7rem] tracking-[0.08em] text-neutral-500 uppercase`}>
            Incident report · Example
          </p>
          <h3 className="mt-3 max-w-60 text-[1.85rem] leading-[1.1] font-[620] tracking-[-0.04em] text-neutral-950 dark:text-white">
            {report.title}
          </h3>
          <div
            className={`mt-6 flex items-center gap-3 ${mono} text-[0.75rem] font-medium tabular-nums`}
            aria-hidden="true"
          >
            <span className="text-rose-600 dark:text-rose-400">{report.started}</span>
            <span
              className={[
                'relative flex h-[0.35rem] flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800',
                '[clip-path:inset(0_0_0_0)] [transition:clip-path_1.6s_cubic-bezier(0.65,0,0.35,1)_0.3s] motion-reduce:[transition:none]!',
                '[[data-report]:not(.is-in)_&]:[clip-path:inset(0_100%_0_0)]',
              ].join(' ')}
              style={{ '--lost': `${lostShare}%` } as CSSProperties}
            >
              <span className={`w-(--lost) ${lost}`}></span>
              <span className={`flex-1 ${fix}`}></span>
            </span>
            <span className="text-emerald-700 dark:text-emerald-400">{report.resolved}</span>
          </div>
          <p
            className="mt-[0.6rem] flex flex-wrap gap-x-[1.1rem] gap-y-[0.35rem] text-[0.75rem] text-neutral-600 dark:text-neutral-400 [&>span]:inline-flex [&>span]:items-center [&>span]:gap-[0.4rem]"
            aria-hidden="true"
          >
            <span>
              <i className={`size-[0.45rem] rounded-full ${lost}`}></i>Before we were called
            </span>
            <span>
              <i className={`size-[0.45rem] rounded-full ${fix}`}></i>With VavenCloud
            </span>
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-y-neutral-200 py-4 text-[0.875rem] sm:grid-cols-4 dark:border-y-neutral-800">
            <Pairs
              rows={report.meta}
              term={`${mono} text-[0.62rem] tracking-[0.08em] text-neutral-500 uppercase`}
              value="mt-[0.15rem] font-semibold text-neutral-950 dark:text-white"
            />
          </dl>
          <dl className="mt-5 grid gap-4 text-[0.875rem]">
            <Pairs
              rows={report.sections}
              row="grid gap-1 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4"
              term="font-[650] text-neutral-950 dark:text-white"
              value="leading-[1.6] text-neutral-600 dark:text-neutral-400"
            />
          </dl>
        </div>
      </div>
    </motion.figure>
  )
}

export function Report() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id="report"
        data-no-reveal=""
        className="overflow-x-clip border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800"
      >
        <div className={cn(container, 'grid items-center gap-14 lg:grid-cols-2')}>
          {/* The title shares its half of the row with the report, so it runs a size down to keep to three lines */}
          <div className="min-w-0">
            <motion.div variants={rise} initial="hidden" whileInView="visible" viewport={viewport}>
              <SectionHeading
                title="We don’t send you a ticket number. <em>We send you the fix.</em>"
                description={reportIntro}
                titleClassName="text-[length:clamp(2.5rem,4vw,3.6rem)] [&_em]:inline"
              />
            </motion.div>
            <motion.ul
              className="mt-10 grid gap-4 sm:grid-cols-2"
              variants={list}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              {workspace.map((t) => (
                // Motion moves the <li>; the card inside keeps its own hover lift and transition
                <motion.li key={t.name} variants={item} className="flex">
                  <div className={cn(card, 'w-full px-[1.4rem] pt-[1.4rem] pb-6')}>
                    <div className="flex items-center gap-[0.85rem]">
                      <span className={iconBox}>
                        <Icon name={t.icon} className="h-5 w-5" />
                      </span>
                      <p className="text-[1.1rem] leading-[1.25] font-[650] tracking-[-0.02em] text-neutral-950 dark:text-white">
                        {t.name}
                      </p>
                    </div>
                    <p
                      className={`mt-4 ${mono} text-[0.68rem] leading-[1.5] tracking-[0.08em] text-neutral-500 uppercase`}
                    >
                      {t.who}
                    </p>
                    <p className="mt-2 text-[0.95rem] leading-[1.35] font-[650] text-neutral-950 dark:text-white">
                      {t.headline}
                    </p>
                    <p className="mt-2 text-[0.92rem] leading-[1.6] text-neutral-600 dark:text-neutral-400">{t.what}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>
          <Doc />
        </div>
      </section>
    </MotionConfig>
  )
}
