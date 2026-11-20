import { Icon } from '@/components/ui/Icon.tsx'
import { SectionHeading } from '@/components/ui/SectionHeading.tsx'
import { bandCard, bandIconBox, bandLead, bandTitle, darkBand } from '../dark-band.ts'
import { handover, startSteps } from './start.data.ts'
import { card, container, iconBox } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * How we start, just before the plans, all from the left like the chapters around it: the heading, then the
 * five steps from the first call to fully covered, joined by a wavy line through their numbers on a wide screen
 * (one under another on smaller ones, the number beside each), the last one filled in. Then what the handover
 * promises, so switching doesn't feel like a risk.
 *
 * It's one of the page's blue-grey chapters in light mode (dark-band.ts, with Behind): the light colours below
 * are that band's, and dark mode has its own.
 */

const mono = 'font-[ui-monospace,SFMono-Regular,Menlo,monospace]'

/** A step's number; the last one filled in with the brand's blue */
const dot = `relative inline-flex size-12 [grid-row:span_3] items-center justify-center rounded-full ${mono} text-[0.8rem] font-bold [box-shadow:var(--shadow-card)]`
const stepDot = `${dot} border border-[#bfd3e3] bg-[#f9fcff] text-[#2873a7] dark:border-brand-900 dark:bg-neutral-900 dark:text-brand-300`
const lastDot = `${dot} border-0 bg-[linear-gradient(145deg,#3996d2,#2873a7)] text-white dark:bg-[linear-gradient(180deg,var(--color-brand-500),var(--color-brand-600))]`

/**
 * The steps: from 1024px five across, joined by a wave (the page's own, --v5-wave) from the first number's
 * centre to the last's
 */
const steps = [
  'relative mt-14 grid gap-7 lg:grid-cols-5 lg:gap-0',
  "lg:before:absolute lg:before:top-[calc(1.5rem-3px)] lg:before:right-[calc(20%-1.5rem)] lg:before:left-6 lg:before:h-2 lg:before:content-['']",
  'lg:before:bg-neutral-300 dark:lg:before:bg-neutral-700',
  'lg:before:[mask-image:var(--v5-wave)] lg:before:[mask-size:24px_8px] lg:before:[mask-repeat:repeat-x]',
].join(' ')

export function Start() {
  return (
    <section
      id="start"
      className={`py-20 sm:py-26 border-t border-neutral-200 dark:border-neutral-800 ${darkBand}`}
      aria-labelledby="start-title"
    >
      <div className={container}>
        {/* A heading across the whole width */}
        <div>
          <SectionHeading
            id="start-title"
            title="From first call to fully covered <em>in about two weeks.</em>"
            description="Switching shouldn’t feel risky. We find the problems first, fix the urgent ones, and only then take responsibility."
            titleClassName={bandTitle}
            leadClassName={cn('max-w-none', bandLead)}
          />
        </div>
        <ol className={steps}>
          {startSteps.map((s, i) => (
            <li
              key={s.title}
              className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-[1.1rem] lg:block lg:pr-6"
              data-reveal=""
            >
              <span className={i === startSteps.length - 1 ? lastDot : stepDot} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p
                className={`mt-[0.15rem] ${mono} text-[0.66rem] tracking-[0.08em] text-[#5b748b] uppercase lg:mt-[1.1rem] dark:text-neutral-500`}
              >
                {s.when}
              </p>
              <h3 className="mt-[0.3rem] text-[1.05rem] font-[650] tracking-[-0.02em] text-[#1c344b] dark:text-white">
                {s.title}
              </h3>
              <p className="mt-[0.4rem] text-[0.9rem] leading-[1.55] text-[#4b6278] dark:text-inherit">{s.text}</p>
            </li>
          ))}
        </ol>
        <div
          data-reveal=""
          className={cn(
            card,
            bandCard,
            'mt-14 grid gap-[1.1rem] rounded-3xl px-6 py-[1.6rem] md:grid-cols-[auto_minmax(0,1fr)] md:gap-5 md:px-[1.9rem] md:py-7',
          )}
        >
          <span className={cn(iconBox, bandIconBox)}>
            <Icon name="shield" className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-[1.05rem] font-[650] text-[#1c344b] dark:text-white">What happens in the handover</h3>
            <ul className="mt-[0.9rem] grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {handover.map((h) => (
                <li key={h.title} className="text-[0.9rem] leading-[1.5] text-[#4b6278] dark:text-neutral-300">
                  <b className="mb-[0.15rem] block font-[650] text-[#1c344b] dark:text-white">{h.title}</b>
                  {h.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
