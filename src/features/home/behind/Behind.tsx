import { useState } from 'react'
import { Link } from 'react-router'
import { routes } from '@/app/routes.ts'
import { Icon } from '@/components/ui/Icon.tsx'
import { SectionHeading } from '@/components/ui/SectionHeading.tsx'
import { VideoPoster } from '@/components/ui/VideoPoster.tsx'
import { accountTeam, behindIntro, behindStats, teamIntro } from '@/features/shared/company.data.ts'
import { bandCard, bandIconBox, bandLead, bandTitle, darkBand } from '../dark-band.ts'
import { behindVideo, founders } from './behind.data.ts'
import { btnSecondary, card, container, iconBox } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * Who's behind it, in two halves on a wide screen. On the left who VavenCloud is and four numbers; on the right
 * the VavenCloud overview video, the two co-founders side by side, and a button that opens the rest of the team
 * (the engineers on your account, by role) across the whole width under both halves. One of the page's
 * blue-grey chapters (dark-band.ts): the light colours below are the band's.
 */

/** The overview video, with a small "Video" badge beside its caption */
const Video = () => (
  <figure>
    <VideoPoster
      id={behindVideo.id}
      title={behindVideo.title}
      label={`Play the video: ${behindVideo.caption}`}
      play={behindVideo.play}
      className="rounded-2xl"
      buttonProps={{ 'data-v4-play': '' }}
    />
    <figcaption className="mt-[0.8rem] flex flex-wrap items-center gap-x-[0.6rem] gap-y-[0.4rem] text-[0.86rem] text-[#4b6278] dark:text-neutral-400">
      <span className="inline-flex items-center gap-[0.4rem] rounded-full bg-brand-50 px-[0.7rem] py-1 text-[0.72rem] font-[650] text-brand-700 dark:bg-[color-mix(in_srgb,var(--color-brand-500)_18%,transparent)] dark:text-brand-300">
        <Icon name="play" className="h-2.5 w-2.5" filled />
        Video
      </span>
      {behindVideo.caption}
    </figcaption>
  </figure>
)

export function Behind() {
  const [teamOpen, setTeamOpen] = useState(false)
  return (
    <section
      id="behind"
      className={`py-20 sm:py-26 border-t border-neutral-200 dark:border-neutral-800 ${darkBand}`}
      aria-labelledby="behind-title"
    >
      {/* Two equal halves from 1024px: who we are on the left, the video and the people on the right */}
      <div className={cn(container, 'grid gap-12 lg:grid-cols-2 lg:[align-items:start] lg:gap-14')}>
        <div className="min-w-0">
          <SectionHeading
            id="behind-title"
            title="Built by engineers <em>who’ve done the 2am shift.</em>"
            description={behindIntro}
            titleClassName={cn('text-[length:clamp(2.4rem,4.2vw,3.6rem)]', bandTitle)}
            leadClassName={bandLead}
          />
          {/* Four numbers in a grid with hairlines between them, each number above its label */}
          <dl
            className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-[1.25rem] border border-[#cddde9] bg-[#cddde9] dark:border-neutral-800 dark:bg-neutral-800"
            data-reveal=""
          >
            {behindStats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col-reverse justify-end bg-[#f9fcff] p-[1.35rem] text-[#40566b] [box-shadow:0_10px_28px_rgb(42_78_111/5%)] dark:bg-neutral-900 dark:text-inherit dark:[box-shadow:none]"
              >
                <dt className="mt-2 text-[0.86rem] leading-[1.4] text-[#4b6278] dark:text-neutral-400">{s.label}</dt>
                <dd className="text-[2.1rem] leading-none font-[650] tracking-[-0.04em] text-[#1c344b] tabular-nums dark:text-white">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid min-w-0 gap-4">
          <Video />
          <ul className="grid gap-4 sm:grid-cols-2">
            {founders.map((p) => (
              <li key={p.name} data-reveal="" className={cn(card, bandCard, 'rounded-[1.4rem] p-[1.2rem]')}>
                <div className="flex items-center gap-[0.8rem]">
                  <span
                    className="inline-flex size-11 flex-none items-center justify-center rounded-full bg-[linear-gradient(160deg,var(--color-brand-500),var(--color-brand-800))] text-[0.92rem] font-bold text-white"
                    aria-hidden="true"
                  >
                    {p.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[1rem] font-[650] tracking-[-0.01em] text-[#1c344b] dark:text-white">{p.name}</p>
                    <p className="mt-[0.1rem] text-[0.78rem] leading-[1.35] font-semibold text-[#2873a7] dark:text-brand-400">
                      {p.role}
                    </p>
                  </div>
                </div>
                <p className="mt-[0.8rem] text-[0.86rem] leading-[1.6] text-[#4b6278] dark:text-inherit">{p.bio}</p>
              </li>
            ))}
          </ul>
          {/* The rest of the team opens under the button, and closes again */}
          <button
            type="button"
            className={cn(
              btnSecondary,
              'w-full [html:not(.dark)_&]:border-[#bfd3e3] [html:not(.dark)_&]:bg-[#f9fcff] [html:not(.dark)_&]:text-[#24577d] [html:not(.dark)_&:hover]:bg-[#deedf7] [&_svg]:transition-[transform] [&_svg]:duration-200 aria-expanded:[&_svg]:[transform:rotate(180deg)]',
            )}
            data-team-toggle=""
            aria-expanded={teamOpen}
            aria-controls="v4-team"
            onClick={() => setTeamOpen((open) => !open)}
          >
            <span data-team-label="">{teamOpen ? 'Hide the team' : 'Meet the rest of the team'}</span>{' '}
            <Icon name="chevron-down" className="h-4 w-4" />
          </button>
        </div>
        {/*
          The engineers it shows: a tinted panel across the whole section under both halves (pulled up to sit
          closer than the halves' own gap), the roles four across on a wide screen. Roles only, no invented names.
        */}
        <div
          id="v4-team"
          className="-mt-8 rounded-[1.4rem] border border-[#cddde9] bg-[#e2edf6] px-6 py-[1.4rem] [grid-column:1/-1] lg:-mt-10 dark:border-brand-900 dark:bg-brand-950"
          hidden={!teamOpen}
        >
          <p className="text-[0.88rem] leading-[1.6] text-[#4b6278] dark:text-neutral-300">{teamIntro}</p>
          <ul className="mt-4 grid gap-[0.85rem] sm:grid-cols-2 lg:grid-cols-4">
            {accountTeam.map((m) => (
              <li
                key={m.role}
                className="flex items-start gap-[0.7rem] text-[0.84rem] leading-[1.45] text-[#4b6278] dark:text-neutral-400"
              >
                <span className={cn(iconBox, 'size-8 rounded-[0.6rem] bg-white dark:bg-neutral-900', bandIconBox)}>
                  <Icon name={m.icon} className="h-4 w-4" />
                </span>
                <span>
                  <b className="block font-[650] text-[#1c344b] dark:text-white">{m.role}</b>
                  {m.focus}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-[1.1rem] text-right">
            <Link
              to={routes.team}
              className="inline-flex items-center gap-[0.4rem] text-[0.88rem] font-[650] text-[#24577d] underline decoration-[color-mix(in_srgb,currentColor_30%,transparent)] underline-offset-[0.25rem] dark:text-brand-300"
            >
              Meet the whole Vavensoft team <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
