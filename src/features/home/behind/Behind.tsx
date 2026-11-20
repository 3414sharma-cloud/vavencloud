import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { routes } from '@/app/routes.ts'
import { Icon } from '@/components/ui/Icon.tsx'
import { SectionHeading } from '@/components/ui/SectionHeading.tsx'
import { VideoPoster } from '@/components/ui/VideoPoster.tsx'
import { behindIntro, behindStats } from '@/features/shared/company.data.ts'
import { bandCard, bandLead, bandTitle, darkBand } from '../dark-band.ts'
import { behindVideo, founders } from './behind.data.ts'
import { btnSecondary, card, container } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * Who's behind it. On a wide screen two halves: on the left who VavenCloud is and the four numbers in a 2×2
 * grid, each under a short brand rule; on the right the overview video in a framed card. Under both, the two
 * co-founders side by side, then a link on the right to the team page. One of the page's blue-grey chapters
 * (dark-band.ts): the light colours below are the band's.
 */

/** The overview video in a framed card, with a small "Video" badge beside its caption */
const Video = () => (
  <figure data-reveal="" className={cn(card, bandCard, 'rounded-[1.75rem] p-3 sm:p-4')}>
    <VideoPoster
      id={behindVideo.id}
      title={behindVideo.title}
      label={`Play the video: ${behindVideo.caption}`}
      play={behindVideo.play}
      className="rounded-[1.25rem]"
      buttonProps={{ 'data-v4-play': '' }}
    />
    <figcaption className="mt-3 flex flex-wrap items-center gap-x-[0.6rem] gap-y-[0.4rem] px-1 pb-1 text-[0.86rem] text-[#4b6278] dark:text-neutral-400">
      <span className="inline-flex items-center gap-[0.4rem] rounded-full bg-brand-50 px-[0.7rem] py-1 text-[0.72rem] font-[650] text-brand-700 dark:bg-[color-mix(in_srgb,var(--color-brand-500)_18%,transparent)] dark:text-brand-300">
        <Icon name="play" className="h-2.5 w-2.5" filled />
        Video
      </span>
      {behindVideo.caption}
    </figcaption>
  </figure>
)

/** The four numbers, two by two, each under a short brand rule */
const Stats = () => (
  <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-7 sm:gap-x-10" data-reveal="">
    {behindStats.map((s) => (
      <div
        key={s.label}
        className="flex flex-col-reverse justify-end border-t border-[#cddde9] pt-4 relative before:absolute before:-top-px before:left-0 before:h-[2px] before:w-10 before:bg-brand-600 before:content-[''] dark:border-neutral-800 dark:before:bg-brand-400"
      >
        <dt className="mt-2 text-[0.86rem] leading-[1.4] text-[#4b6278] dark:text-neutral-400">{s.label}</dt>
        <dd className="text-[length:clamp(2rem,3.4vw,2.6rem)] leading-none font-[650] tracking-[-0.045em] text-[#1c344b] tabular-nums dark:text-white">
          {s.value}
        </dd>
      </div>
    ))}
  </dl>
)

export function Behind({ children }: { children: ReactNode }) {
  return (
    <section
      id="behind"
      className={`py-16 sm:py-24 border-t border-neutral-200 dark:border-neutral-800 ${darkBand}`}
      aria-labelledby="behind-title"
    >
      <div className={container}>
        {/* Two halves from 1024px: who we are and the numbers on the left, the video on the right */}
        <div className="grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center">
          <div className="min-w-0">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#cddde9] bg-[#f9fcff] px-3 py-1 text-xs font-semibold tracking-wider text-brand-700 uppercase dark:border-neutral-800 dark:bg-neutral-900 dark:text-brand-300">
              <span className="size-1.5 rounded-full bg-brand-500" aria-hidden="true" />
              Why founders trust us
            </p>
            <SectionHeading
              id="behind-title"
              title="Built by engineers <em>who’ve done the 2am shift.</em>"
              description={behindIntro}
              titleClassName={cn('text-[length:clamp(2.4rem,4.2vw,3.6rem)]', bandTitle)}
              leadClassName={cn('mt-6', bandLead)}
            />
            <Stats />
          </div>
          <div className="min-w-0">
            <Video />
          </div>
        </div>

        {/* The two co-founders side by side, the initials large on the left of each */}
        <ul className="mt-12 grid gap-4 sm:mt-16 md:grid-cols-2">
          {founders.map((p) => (
            <li key={p.name} data-reveal="" className={cn(card, bandCard, 'flex gap-5 rounded-[1.6rem] p-5 sm:p-6')}>
              <span
                className="inline-flex size-14 flex-none items-center justify-center rounded-2xl bg-[linear-gradient(160deg,var(--color-brand-500),var(--color-brand-800))] text-[1.05rem] font-bold text-white [box-shadow:inset_0_1px_0_rgb(255_255_255/0.25),0_10px_20px_-10px_var(--color-brand-700)]"
                aria-hidden="true"
              >
                {p.initials}
              </span>
              <div className="min-w-0">
                <p className="text-[1.08rem] font-[650] tracking-[-0.015em] text-[#1c344b] dark:text-white">{p.name}</p>
                <p className="mt-[0.15rem] text-[0.78rem] leading-[1.35] font-semibold text-[#2873a7] dark:text-brand-400">
                  {p.role}
                </p>
                <p className="mt-3 border-t border-[#e0eaf2] pt-3 text-[0.88rem] leading-[1.6] text-[#4b6278] dark:border-neutral-800 dark:text-inherit">
                  {p.bio}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* The rest of the team is on its own page: one link, on the right under the co-founders */}
        <div className="mt-5 flex justify-end">
          <Link
            to={routes.team}
            className={cn(
              btnSecondary,
              'min-h-11 [html:not(.dark)_&]:border-[#bfd3e3] [html:not(.dark)_&]:bg-[#f9fcff] [html:not(.dark)_&]:text-[#24577d] [html:not(.dark)_&:hover]:bg-[#deedf7]',
              '[&_svg]:transition-[transform] [&_svg]:duration-200 [&:hover_svg]:translate-x-[3px] motion-reduce:[&_svg]:transition-none',
            )}
          >
            Meet the whole Vavensoft team <Icon name="arrow-right" className="size-4" />
          </Link>
        </div>
      </div>
      {/* Add Jerry's approved incident story here, above the client testimonials. */}
      {children}
    </section>
  )
}
