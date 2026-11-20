import { Link } from 'react-router'
import { routes } from '@/app/routes.ts'
import { site } from '@/app/site.config.ts'
import { Icon } from '@/components/ui/Icon.tsx'
import { SectionHeading } from '@/components/ui/SectionHeading.tsx'
import { VideoPoster } from '@/components/ui/VideoPoster.tsx'
import { accountTeam, behindIntro, behindStats, teamIntro } from '@/features/shared/company.data.ts'
import { founders, members, ways, type Founder, type Member } from './team.data.ts'
import { useLogoParticles } from './useLogoParticles.ts'
import { bandLinen, btnPrimary, card, container, iconBox, surfaceInk } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * The team page's sections (pages/TeamPage.tsx lays them out): who's behind VavenCloud and four numbers, the two
 * co-founders in full (Jerry's card led by his video), the engineers on your account by role, the team members
 * (team.data.ts) and how they work with you, then one call to action. Styled with Tailwind classes only.
 *
 * Widths: Tailwind's max-[N]: is "narrower than N", so max-[640px]: is "639px wide or less".
 */

/* ---------- The hero ---------- */

/** The marks in the stage's corners, under the header and above the progress line */
const corner = 'h-[14px] w-[14px] border-[rgb(255_255_255/0.25)]'
/** The small print on the stage: the form's number and the hint */
const stageText =
  'left-[32px] font-[ui-monospace,SFMono-Regular,Consolas,monospace] text-[11px] leading-[1.4] text-[#8b8f9a]'

/**
 * The hero: a full-screen black stage with the logo in particles (logo-particles.ts, started by
 * useLogoParticles): dots that form the "VAVENCLOUD" wordmark, then fly across into the "V" mark and back, in the
 * logo's colours, pushed aside by the pointer, gathered by a press and thrown out on release. Corner marks, the
 * form's number, a hint and a line that fills until the next form frame it. It is decorative (aria-hidden) and
 * always dark, like the landing page's hero, so the header turns dark over it (.v5-hero-dark). It pulls up under
 * the header (its height and its 1px border). Scrolling down, the dots pour out of it and its frame fades (--out,
 * 0 to 1, set by logo-particles.ts), while the intro slides up over it as a rounded sheet.
 */
export function HeroStage() {
  const stage = useLogoParticles<HTMLDivElement>()
  return (
    <section
      id="top"
      className="dark v5-hero-dark mt-[calc(-18*var(--spacing)-1px)] bg-[#07080b] scheme-dark"
      aria-hidden="true"
    >
      <div
        ref={stage}
        className={[
          // Full screen; phones still scroll (a scroll cancels the press)
          'relative h-svh min-h-[30rem] cursor-crosshair touch-pan-y select-none',
          // While the announcement bar shows above the header, the stage gives up its height so it still ends at
          // the bottom of the first screen (one line on wide screens, two on phones)
          '[body:has(#top-bar:not(.hidden))_&]:h-[calc(100svh-2.5rem)]',
          'max-[640px]:[body:has(#top-bar:not(.hidden))_&]:h-[calc(100svh-3.5rem)]',
          // The particles' canvas (added by logo-particles.ts), faded in once they're drawing
          '[&_canvas]:absolute [&_canvas]:inset-0 [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full [&_canvas]:opacity-0',
          '[&_canvas]:transition-opacity [&_canvas]:duration-[800ms] [&.is-ready_canvas]:opacity-100',
          // The frame, fading out as the hero scrolls away
          '[&>span]:pointer-events-none [&>span]:absolute [&>span]:z-1 [&>span]:opacity-[calc(1-var(--out,0)*2.5)]',
        ].join(' ')}
        data-logo-stage=""
      >
        <span className={`${corner} top-[5.5rem] left-[12px] border-t border-l`}></span>
        <span className={`${corner} top-[5.5rem] right-[12px] border-t border-r`}></span>
        <span className={`${corner} bottom-[calc(12px+2rem)] left-[12px] border-b border-l`}></span>
        <span className={`${corner} right-[12px] bottom-[calc(12px+2rem)] border-r border-b`}></span>
        <span className={`${stageText} top-[calc(5.5rem+10px)] tracking-[0.12em]`} data-form-label="">
          FORM / 01
        </span>
        <span
          className={`${stageText} bottom-[calc(34px+2rem)] max-w-[calc(100%-64px)] tracking-[0.04em] motion-reduce:hidden`}
        >
          move = repel · hold = gather · release = burst
        </span>
        <span className="right-[32px] bottom-[calc(24px+2rem)] left-[32px] h-px bg-[rgb(255_255_255/0.1)] motion-reduce:hidden">
          <i
            className="block h-full origin-left bg-[linear-gradient(90deg,var(--color-brand-600),var(--color-brand-300))] [transform:scaleX(0)]"
            data-form-progress=""
          ></i>
        </span>
      </div>
    </section>
  )
}

/* ---------- The intro: who's behind it and four numbers ---------- */

/**
 * A sheet that comes up over the hero's last 2rem, rounded at the top, so scrolling reads as the page sliding out
 * over the black stage; its lines rise in ([data-reveal], lib/reveal.ts)
 */
export function Intro() {
  return (
    <section
      id="intro"
      className={cn(
        bandLinen,
        'relative z-1 -mt-8 rounded-t-[2rem] border-b border-neutral-200 py-[4.5rem] [box-shadow:0_-24px_60px_-20px_rgb(0_0_0/0.55)] max-[640px]:rounded-t-3xl min-[900px]:py-24 dark:border-neutral-800',
      )}
      aria-labelledby="team-title"
    >
      <div className={container}>
        <p
          className="text-[0.78rem] font-[650] tracking-[0.14em] text-brand-700 uppercase dark:text-brand-300"
          data-reveal=""
        >
          The team behind VavenCloud
        </p>
        <h1
          id="team-title"
          className="mt-5 max-w-[62rem] text-[length:clamp(2.6rem,7vw,5.5rem)] leading-[0.98] font-[540] tracking-[-0.05em] text-balance text-neutral-950 dark:text-white"
          data-reveal=""
        >
          The people who own{' '}
          <em className="block font-['Instrument_Serif',Georgia,serif] text-[1.12em] font-normal tracking-[-0.02em] italic text-brand-600 dark:text-brand-400">
            your production.
          </em>
        </h1>
        <p
          className="mt-7 max-w-3xl text-[length:clamp(1.05rem,1.6vw,1.3rem)] leading-[1.6] text-neutral-600 dark:text-neutral-400"
          data-reveal=""
        >
          {behindIntro}
        </p>
        <dl
          className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-t-neutral-200 pt-8 min-[900px]:grid-cols-4 dark:border-t-neutral-800"
          data-reveal=""
        >
          {behindStats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-[0.35rem]">
              <dt className="text-[0.9rem] leading-[1.4] text-neutral-500">{s.label}</dt>
              <dd className="text-[length:clamp(2rem,4vw,3rem)] leading-none font-[650] tracking-[-0.04em] text-neutral-950 dark:text-white">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ---------- The co-founders ---------- */

/*
 * Only Jerry has a video so far, so each founder gets a full-width card instead of two uneven ones side by side:
 * with a video, the video on the left and the profile beside it; without one, the name and bio on the left and
 * the facts and focus on the right. Both use the same two columns, so the cards line up. A founder who gets a
 * video later (team.data.ts) moves to the video layout by himself.
 */
const columns = 'lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]'

/** The initials, the name and the role */
const ProfileHead = ({ f }: { f: Founder }) => (
  <div className="flex items-center gap-4">
    <span
      className="inline-flex size-14 flex-none items-center justify-center rounded-full bg-[linear-gradient(145deg,var(--color-brand-500),var(--color-brand-700))] text-[1.05rem] font-bold tracking-[0.02em] text-white [box-shadow:0_10px_24px_-14px_var(--color-brand-700)]"
      aria-hidden="true"
    >
      {f.initials}
    </span>
    <div className="min-w-0">
      <h3 className="text-[1.3rem] font-[650] tracking-[-0.025em] text-neutral-950 dark:text-white">{f.name}</h3>
      <p className="mt-[0.15rem] text-[0.88rem] font-semibold text-brand-700 dark:text-brand-300">{f.role}</p>
    </div>
  </div>
)

const Bio = ({ f }: { f: Founder }) => (
  <p className="mt-[1.1rem] leading-[1.65] text-neutral-600 dark:text-neutral-400">{f.bio}</p>
)

/** The facts, each with a tick, then the focus tags */
const Details = ({ f, className = '' }: { f: Founder; className?: string }) => (
  <div className={className}>
    <ul className="grid gap-[0.55rem] text-[0.93rem] text-neutral-800 dark:text-neutral-200">
      {f.facts.map((x) => (
        <li key={x} className="flex items-start gap-[0.6rem]">
          <span
            className="mt-[0.15rem] inline-flex size-[1.15rem] flex-none items-center justify-center rounded-full bg-brand-50 text-brand-700 dark:bg-[color-mix(in_srgb,var(--color-brand-500)_18%,transparent)] dark:text-brand-300"
            aria-hidden="true"
          >
            <Icon name="check" className="h-3 w-3" />
          </span>
          {x}
        </li>
      ))}
    </ul>
    <ul className="mt-5 flex flex-wrap gap-[0.45rem]" aria-label="Focus">
      {f.focus.map((x) => (
        <li
          key={x}
          className="rounded-full border border-neutral-200 px-3 py-[0.3rem] text-[0.78rem] font-semibold text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
        >
          {x}
        </li>
      ))}
    </ul>
  </div>
)

/** A founder with a video: the video, framed, on the left (on top on a phone); the profile beside it */
function VideoProfile({ f, v }: { f: Founder; v: NonNullable<Founder['video']> }) {
  return (
    <article className={cn(card, 'grid gap-2 p-3 sm:p-4 lg:items-center', columns)}>
      <figure className="min-w-0">
        <VideoPoster
          id={v.id}
          title={v.title}
          label={`Play the video: ${f.name}`}
          play={v.play}
          className="rounded-[1.25rem]"
          buttonProps={{ 'data-play': v.id, 'data-title': v.title }}
        />
        <figcaption className="mt-3 flex items-center gap-[0.6rem] px-1 text-[0.86rem] text-neutral-600 dark:text-neutral-400">
          <span className="inline-flex items-center gap-[0.4rem] rounded-full bg-brand-50 px-[0.7rem] py-1 text-[0.72rem] font-[650] text-brand-700 dark:bg-[color-mix(in_srgb,var(--color-brand-500)_18%,transparent)] dark:text-brand-300">
            <Icon name="play" className="h-2.5 w-2.5" filled />
            Video
          </span>
          Meet {f.name.split(' ')[0]}
        </figcaption>
      </figure>
      <div className="min-w-0 px-3 pt-5 pb-4 sm:px-4 lg:px-7 lg:py-6">
        <ProfileHead f={f} />
        <Bio f={f} />
        <Details f={f} className="mt-5 border-t border-t-neutral-200 pt-5 dark:border-t-neutral-800" />
      </div>
    </article>
  )
}

/** A founder without a video: name and bio on the left; facts and focus on the right, past a divider */
function Profile({ f }: { f: Founder }) {
  return (
    <article className={cn(card, 'grid gap-x-12 px-6 pt-[1.6rem] pb-7 sm:px-8 lg:py-8', columns)}>
      <div className="min-w-0">
        <ProfileHead f={f} />
        <Bio f={f} />
      </div>
      <Details
        f={f}
        className="mt-5 min-w-0 border-t border-t-neutral-200 pt-5 lg:mt-0 lg:border-t-0 lg:border-l lg:border-l-neutral-200 lg:pt-1 lg:pl-12 dark:border-neutral-800"
      />
    </article>
  )
}

export function Founders() {
  return (
    <section id="founders" className="py-20 sm:py-26" aria-labelledby="founders-title">
      <div className={container}>
        <div className="max-w-4xl">
          <SectionHeading
            id="founders-title"
            title="Two co-founders. <em>Both still on the work.</em>"
            description="Vavensoft and VavenCloud are run by the people who started them, and who still look at production systems every week."
          />
        </div>
        <div className="mt-12 grid gap-5">
          {founders.map((f) =>
            f.video ? <VideoProfile key={f.name} f={f} v={f.video} /> : <Profile key={f.name} f={f} />,
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------- The team gallery ---------- */

/*
 * No slider. Below 900px: a grid of cards, two across (three from 640px), each showing everything (on the
 * narrowest phones, the photo, tagline and role only). From 900px: rows of tall cards side by side (at most
 * five a row), where the one you point at (or tab to) grows and opens and the others in its row shrink and dim.
 * The cards' states hang on two attributes: data-gal-track (a row) and data-gal-item (a card).
 *
 * The photos are never shown in full colour: they're faded (desaturated, under a soft wash in the brand's dark
 * blue). On a device with a pointer they start more faded, and the one you point at (or tab to) fades a little
 * less. Touch screens can't hover, so they always show the lighter fade.
 */

/** Nothing in the gallery moves with reduced motion */
const still = 'motion-reduce:[transition:none]!'

const photoBox = [
  'relative aspect-square overflow-hidden min-[900px]:absolute min-[900px]:inset-0 min-[900px]:aspect-auto',
  'bg-[linear-gradient(160deg,var(--color-brand-50),color-mix(in_srgb,var(--color-brand-200)_70%,#fff))]',
  'dark:bg-[linear-gradient(160deg,var(--color-neutral-800),color-mix(in_srgb,var(--color-brand-900)_60%,var(--color-neutral-900)))]',
  // The wash over the photo
  "after:pointer-events-none after:absolute after:inset-0 after:opacity-80 after:content-['']",
  'after:transition-opacity after:duration-[600ms]',
  'after:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-brand-900)_22%,transparent),color-mix(in_srgb,var(--color-brand-950,var(--color-brand-900))_38%,transparent))]',
  // A card that isn't being pointed at or tabbed into, on a device with a pointer: a heavier wash
  '[@media(hover:hover)]:[[data-gal-item]:not(:hover,:focus-within)_&]:after:opacity-100',
  '[@media(hover:hover)]:[[data-gal-item]:not(:hover,:focus-within)_&]:after:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-brand-900)_34%,transparent),color-mix(in_srgb,var(--color-brand-950,var(--color-brand-900))_50%,transparent))]',
  still,
  'motion-reduce:after:[transition:none]!',
].join(' ')

const photo = [
  // An open card is wider than tall, so the square portrait is cropped top and bottom: keep the crop near the
  // top, where the face is
  'block w-full object-cover min-[900px]:object-[50%_18%]',
  '[filter:grayscale(0.7)_contrast(0.88)_brightness(0.96)] transition-[filter] duration-[600ms]',
  // ...and more faded
  '[@media(hover:hover)]:[[data-gal-item]:not(:hover,:focus-within)_&]:[filter:grayscale(0.95)_contrast(0.82)_brightness(0.92)]',
  still,
].join(' ')

/** A team member's photo; until there is one, a head and shoulders on the brand colour, kept at the card's foot */
const GalleryPhoto = ({ m }: { m: Member }) =>
  m.photo ? (
    <img
      src={m.photo}
      alt={m.role}
      width="800"
      height="800"
      loading="lazy"
      decoding="async"
      className={`${photo} h-full`}
      draggable="false"
    />
  ) : (
    <svg
      className={`${photo} absolute bottom-0 left-0 h-[74%] fill-[color-mix(in_srgb,var(--color-brand-500)_30%,transparent)] dark:fill-[color-mix(in_srgb,var(--color-brand-400)_22%,transparent)]`}
      viewBox="0 0 120 150"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      <circle cx="60" cy="58" r="24" />
      <path d="M14 150c3-30 22-46 46-46s43 16 46 46z" />
    </svg>
  )

/** The open card's name, role, tags and line: over the photo's foot from 900px, faded while a neighbour is open */
const info = [
  'px-4 pt-4 pb-5 max-[560px]:px-[0.8rem] max-[560px]:pt-3 max-[560px]:pb-[0.9rem]',
  'min-[900px]:absolute min-[900px]:inset-0 min-[900px]:flex min-[900px]:flex-col min-[900px]:justify-end min-[900px]:overflow-hidden min-[900px]:px-[1.4rem] min-[900px]:py-6',
  // Only as much shade as the text needs, low on the card, so the photo above stays clear
  'min-[900px]:bg-[linear-gradient(to_top,rgb(4_12_24/0.8)_0%,rgb(4_12_24/0.35)_28%,transparent_48%)]',
  'min-[900px]:transition-opacity min-[900px]:duration-500',
  'min-[900px]:[[data-gal-track]:has([data-gal-item]:is(:hover,:focus-within))_[data-gal-item]:not(:is(:hover,:focus-within))_&]:opacity-0',
  still,
].join(' ')

/** The tags and the line open under the role when the card does (the row grows from 0 to its own height) */
const more = [
  'max-[560px]:hidden min-[900px]:grid min-[900px]:grid-rows-[0fr] min-[900px]:opacity-0',
  'min-[900px]:[transition:grid-template-rows_0.6s_cubic-bezier(0.45,0,0.2,1),opacity_0.4s_ease]',
  'min-[900px]:[[data-gal-item]:is(:hover,:focus-within)_&]:grid-rows-[1fr] min-[900px]:[[data-gal-item]:is(:hover,:focus-within)_&]:opacity-100',
  'min-[900px]:[[data-gal-item]:is(:hover,:focus-within)_&]:[transition:grid-template-rows_0.6s_cubic-bezier(0.45,0,0.2,1)_0.15s,opacity_0.5s_ease_0.3s]',
  still,
].join(' ')

/**
 * One member, as a tall card: the photo fills it, the name and role sit over its foot, and on hover or focus
 * (or always, on a phone) the card opens to show their tags and a line about them.
 */
const GalleryItem = ({ m }: { m: Member }) => (
  <li
    className={`outline-none min-[900px]:min-w-0 min-[900px]:flex-[1_1_0] min-[900px]:cursor-pointer min-[900px]:p-[0.375rem] min-[900px]:transition-[flex-grow] min-[900px]:duration-[750ms] min-[900px]:ease-[cubic-bezier(0.45,0,0.2,1)] min-[900px]:[&:is(:hover,:focus-within)]:grow-5 ${still}`}
    tabIndex={0}
    data-gal-item=""
  >
    <div className="relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-neutral-200 bg-white [box-shadow:var(--shadow-card)] min-[900px]:rounded-[1.4rem] min-[900px]:[box-shadow:0_24px_50px_-32px_rgb(5_15_30/0.55)] dark:border-neutral-800 dark:bg-neutral-900 [[data-gal-item]:focus-visible_&]:outline-2 [[data-gal-item]:focus-visible_&]:outline-offset-2 [[data-gal-item]:focus-visible_&]:outline-brand-500">
      <div className={photoBox}>
        <GalleryPhoto m={m} />
      </div>
      <div className={info}>
        <p className="text-[1.1rem] font-[650] tracking-[-0.025em] text-neutral-950 max-[560px]:text-[0.95rem] max-[560px]:leading-[1.25] min-[900px]:min-w-44 min-[900px]:text-[length:clamp(1.1rem,1.8vw,1.6rem)] min-[900px]:leading-[1.15] min-[900px]:text-white dark:text-white">
          {m.tagline}
        </p>
        <p className="mt-[0.15rem] text-[0.85rem] font-semibold text-brand-700 max-[560px]:text-[0.75rem] min-[900px]:min-w-44 min-[900px]:text-[0.88rem] min-[900px]:text-brand-200 dark:text-brand-300 dark:min-[900px]:text-brand-200">
          {m.role}
        </p>
        <div className={more}>
          <div className="min-[900px]:min-h-0 min-[900px]:min-w-64 min-[900px]:overflow-hidden">
            <ul className="mt-[0.8rem] flex flex-wrap gap-[0.35rem]" aria-label="Works on">
              {m.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-neutral-200 px-[0.6rem] py-[0.2rem] text-[0.72rem] font-semibold text-neutral-600 min-[900px]:border-[rgb(255_255_255/0.4)] min-[900px]:text-white dark:border-neutral-700 dark:text-neutral-300 dark:min-[900px]:border-[rgb(255_255_255/0.4)] dark:min-[900px]:text-white"
                >
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-[0.8rem] text-[0.85rem] leading-[1.5] text-neutral-500 min-[900px]:text-[rgb(255_255_255/0.85)]">
              {m.line}
            </p>
          </div>
        </div>
      </div>
    </div>
  </li>
)

/** At most this many cards share a row on a wide screen */
const PER_ROW = 5

/** Splits the members into rows as even as possible (9 → 5 + 4, 7 → 4 + 3), the longer rows first */
const rows = (list: Member[]): Member[][] => {
  const count = Math.ceil(list.length / PER_ROW)
  const out: Member[][] = []
  for (let r = 0, from = 0; r < count; r++) {
    const size = Math.ceil((list.length - from) / (count - r))
    out.push(list.slice(from, from + size))
    from += size
  }
  return out
}

/**
 * The team as a gallery: on a wide screen, rows of tall cards; on smaller screens, a plain grid of cards (the
 * rows don't box anything there: their cards sit straight in the grid). Every card is always on the page.
 */
const Gallery = () => (
  <ul
    className="mt-6 grid grid-cols-2 gap-3 min-[640px]:grid-cols-3 min-[900px]:flex min-[900px]:flex-col min-[900px]:gap-0"
    role="list"
  >
    {rows(members).map((row, i) => (
      <li key={i} className="contents min-[900px]:block">
        <ul
          className={`contents min-[900px]:flex min-[900px]:h-[clamp(22rem,58vh,30rem)] ${still}`}
          role="list"
          data-gal-track=""
        >
          {row.map((m, j) => (
            <GalleryItem key={j} m={m} />
          ))}
        </ul>
      </li>
    ))}
  </ul>
)

/* ---------- The engineers, named members, how they work with you ---------- */

const subTitle = 'mt-16 text-[1.35rem] font-[650] tracking-[-0.02em] text-neutral-950 dark:text-white'

export function Engineers() {
  return (
    <section
      id="engineers"
      className="py-20 sm:py-26 border-t border-neutral-200 dark:border-neutral-800"
      aria-labelledby="engineers-title"
    >
      <div className={container}>
        <div className="grid gap-10 [align-items:start] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div className="max-w-[34rem]">
            <SectionHeading
              id="engineers-title"
              title="The engineers <em>on your account.</em>"
              description={teamIntro}
            />
          </div>
          <ul className="overflow-hidden border-t border-t-neutral-200 dark:border-t-neutral-800">
            {accountTeam.map((m, i) => (
              <li
                key={m.role}
                className="grid grid-cols-[1.5rem_auto_minmax(0,1fr)] gap-[0.85rem] border-b border-b-neutral-200 py-7 [align-items:start] lg:gap-5 lg:py-8 dark:border-b-neutral-800"
              >
                <span
                  className="pt-[0.7rem] text-[0.72rem] font-[650] text-brand-600 tabular-nums dark:text-brand-400"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={iconBox}>
                  <Icon name={m.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-[1.1rem] font-[650] tracking-[-0.02em] text-neutral-950 dark:text-white">
                    {m.role}
                  </h3>
                  <p className="mt-[0.4rem] max-w-[34rem] text-[0.95rem] leading-[1.65] text-neutral-600 dark:text-neutral-400">
                    {m.focus}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {members.length > 0 && (
          <>
            <h3 className={subTitle}>Meet some of the team</h3>
            <Gallery />
          </>
        )}
        <h3 className={subTitle}>How the team works with you</h3>
        <ul className="mt-7 grid gap-x-10 gap-y-7 md:grid-cols-2">
          {ways.map((w) => (
            <li key={w.title} className="flex items-start gap-4">
              <span className={cn(iconBox, 'flex-none')}>
                <Icon name={w.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="font-[650] text-neutral-950 dark:text-white">{w.title}</p>
                <p className="mt-[0.3rem] leading-[1.6] text-neutral-600 dark:text-neutral-400">{w.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- The call to action ---------- */

export function TeamCta() {
  return (
    <section id="talk" className="py-20 sm:py-26" aria-labelledby="talk-title">
      <div className={container}>
        <div
          className={cn(
            surfaceInk,
            'grid gap-7 rounded-[1.75rem] px-7 py-9 min-[900px]:grid-cols-[minmax(0,1fr)_auto] min-[900px]:items-center min-[900px]:gap-12 min-[900px]:px-[3.25rem] min-[900px]:py-12',
          )}
        >
          <div>
            <h2
              id="talk-title"
              className="text-[length:clamp(1.7rem,3.2vw,2.4rem)] leading-[1.1] font-[650] tracking-[-0.035em] text-white"
            >
              Talk to the people who’d run it.
            </h2>
            <p className="mt-[0.9rem] max-w-xl leading-[1.6]">
              A free 30-minute production review with a senior engineer, not a salesperson. You keep the written roadmap
              either way.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4">
            <Link to={routes.book} className={cn(btnPrimary, '!px-7 !py-3.5 !text-base')}>
              Book a free production review <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
            <a
              href={site.vavensoftUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-[0.45rem] font-semibold text-white underline underline-offset-4"
            >
              More about Vavensoft<span className="sr-only"> (opens in a new tab)</span>{' '}
              <Icon name="arrow-right" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
