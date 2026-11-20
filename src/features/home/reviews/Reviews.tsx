import { useRef } from 'react'
import { Icon } from '@/components/ui/Icon.tsx'
import { SectionHeading } from '@/components/ui/SectionHeading.tsx'
import { PlayButton, VideoPoster } from '@/components/ui/VideoPoster.tsx'
import { clientReviews, type Testimonial } from './reviews.data.ts'
import { useReviewsRow } from './useReviewsRow.ts'
import { bandMist, container } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * Client stories: only the clients' own words, on a light mist band, in one row of cards that scrolls sideways,
 * so it takes as many reviews as there are (reviews.data.ts). The row's scrolling, arrows, drag, pointer light
 * and underline sweep are useReviewsRow.ts.
 *  - A written review underlines one phrase in the client's own words.
 *  - A video review shows YouTube's thumbnail and only loads the player (youtube-nocookie) when it is played.
 *    A sample (no video yet) shows a poster marked "Sample" instead, and nothing to play.
 */

/* ---------- A card's parts ---------- */

const QuoteMark = () => (
  <svg
    className="h-[1.45rem] w-auto flex-none fill-brand-500 dark:fill-brand-400"
    viewBox="0 0 48 36"
    aria-hidden="true"
  >
    <path d="M0 36V22C0 9 7 1.5 19 0l2 5.5C14 7.5 11 12 11 17h8v19H0zm27 0V22C27 9 34 1.5 46 0l2 5.5C41 7.5 38 12 38 17h8v19H27z" />
  </svg>
)

/** "Mohammed Imtiaz Ali" → "MA" (letters only, so "[Client name]" → "CN") */
const initials = (name: string) => {
  const words = name.replace(/[^\p{L} ]/gu, '').split(' ')
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
}

/**
 * The underlined phrase: a soft brand band low behind the words, which sweeps in when its card comes into view
 * (data-state waiting → in, set by useReviewsRow), the cards arriving together in turn (--d)
 */
const highlight = [
  // bg-transparent: no browser yellow behind the <mark>, only the band drawn under the words
  'rounded-[0.2em] bg-transparent bg-no-repeat bg-[position:0_88%] bg-[length:100%_0.5em] font-semibold text-neutral-950 dark:text-white',
  'bg-[linear-gradient(color-mix(in_srgb,var(--color-brand-300)_45%,transparent),color-mix(in_srgb,var(--color-brand-300)_45%,transparent))]',
  'dark:bg-[linear-gradient(color-mix(in_srgb,var(--color-brand-400)_30%,transparent),color-mix(in_srgb,var(--color-brand-400)_30%,transparent))]',
  '[transition:background-size_0.9s_cubic-bezier(0.22,1,0.36,1)_calc(0.35s+var(--d,0)*0.22s)] motion-reduce:[transition:none]',
  '[[data-tm-card][data-state=waiting]_&]:bg-[length:0%_0.5em]',
].join(' ')

/** The client's words, with one phrase (the first match of `highlight`) underlined */
function Quote({ t }: { t: Testimonial }) {
  if (!t.quote) return null
  const at = t.highlight ? t.quote.indexOf(t.highlight) : -1
  return (
    <blockquote className="mt-[0.9rem] text-[0.9rem] leading-[1.6] text-neutral-700 dark:text-neutral-300">
      {at < 0 || !t.highlight ? (
        t.quote
      ) : (
        <>
          {t.quote.slice(0, at)}
          <mark className={highlight}>{t.highlight}</mark>
          {t.quote.slice(at + t.highlight.length)}
        </>
      )}
    </blockquote>
  )
}

const Topic = ({ t }: { t: Testimonial }) =>
  t.topic ? (
    <span className="rounded-full border border-neutral-200 px-[0.7rem] py-[0.2rem] text-[0.66rem] font-[650] whitespace-nowrap text-brand-700 dark:border-neutral-700 dark:text-brand-300">
      {t.topic}
    </span>
  ) : null

/** The client's initials, or their photo */
const avatar =
  'size-9 flex-none items-center justify-center rounded-full text-[0.78rem] font-bold tracking-[0.02em] text-white'

function Who({ t }: { t: Testimonial }) {
  return (
    <p className="mt-auto flex items-center gap-[0.7rem] border-t border-t-neutral-200 pt-[0.9rem] dark:border-t-neutral-800">
      {t.photo ? (
        <img
          className={`block ${avatar} bg-neutral-100 object-cover [box-shadow:0_0_0_2px_#fff,0_0_0_3px_var(--color-neutral-200),0_10px_22px_-12px_var(--color-neutral-900)] dark:bg-neutral-800 dark:[box-shadow:0_0_0_2px_var(--color-neutral-900),0_0_0_3px_var(--color-neutral-700),0_10px_22px_-12px_#000]`}
          src={t.photo}
          alt=""
          width="96"
          height="96"
          loading="lazy"
          draggable="false"
        />
      ) : (
        <span
          className={`inline-flex ${avatar} bg-[linear-gradient(135deg,var(--color-brand-400),var(--color-brand-600))] [box-shadow:0_10px_22px_-12px_var(--color-brand-600)]`}
          aria-hidden="true"
        >
          {initials(t.name)}
        </span>
      )}
      <span>
        <span className="block text-[0.9rem] font-[650] text-neutral-950 dark:text-white">{t.name}</span>
        <span className="block text-[0.76rem] text-neutral-500">VavenCloud client</span>
      </span>
    </p>
  )
}

/**
 * A card in the row. On a mouse it lifts under the pointer (not while the row is dragged), and a soft light follows
 * the pointer across it (--x, --y, from useReviewsRow). The part above the client's name keeps a gap under it.
 */
const card = [
  'relative flex flex-[0_0_min(20rem,86%)] snap-start flex-col overflow-hidden rounded-[1.25rem] p-[1.1rem]',
  'border border-[color-mix(in_srgb,var(--color-neutral-200)_80%,transparent)] bg-white [box-shadow:var(--shadow-card)]',
  'dark:border-neutral-800 dark:bg-neutral-900 dark:[box-shadow:0_1px_2px_rgb(0_0_0/0.3),0_18px_40px_-24px_rgb(0_0_0/0.6)]',
  '[transition:transform_0.4s_cubic-bezier(0.22,1,0.36,1),border-color_0.3s_ease,box-shadow_0.3s_ease] motion-reduce:[transition:none]',
  '[&>*]:relative [&>:nth-last-child(2)]:mb-[1.1rem]',
  "before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:[transition:opacity_0.4s_ease] before:content-['']",
  'before:bg-[radial-gradient(22rem_circle_at_var(--x,50%)_var(--y,0%),color-mix(in_srgb,var(--color-brand-400)_10%,transparent),transparent_70%)]',
  'motion-reduce:before:[transition:none]',
  '[@media(hover:hover)_and_(pointer:fine)]:[[data-tm-track]:not(.is-dragging)_&:hover]:border-brand-300',
  '[@media(hover:hover)_and_(pointer:fine)]:[[data-tm-track]:not(.is-dragging)_&:hover]:[box-shadow:var(--shadow-lift)]',
  '[@media(hover:hover)_and_(pointer:fine)]:[[data-tm-track]:not(.is-dragging)_&:hover]:[transform:translateY(-4px)]',
  'dark:[@media(hover:hover)_and_(pointer:fine)]:[[data-tm-track]:not(.is-dragging)_&:hover]:border-[color-mix(in_srgb,var(--color-brand-400)_45%,transparent)]',
  '[@media(hover:hover)_and_(pointer:fine)]:[&:hover]:before:opacity-100',
].join(' ')

function WrittenCard({ t }: { t: Testimonial }) {
  return (
    <li className={card} data-tm-card="">
      <div className="flex items-start justify-between gap-4">
        <QuoteMark />
        <Topic t={t} />
      </div>
      <Quote t={t} />
      <Who t={t} />
    </li>
  )
}

/** A video review: YouTube's thumbnail, which turns into the player when pressed; or, for a sample, a poster that says so */
function VideoCard({ t, index }: { t: Testimonial; index: number }) {
  return (
    <li className={card} data-tm-card="">
      {t.video ? (
        <VideoPoster
          id={t.video.id}
          title={t.video.title}
          label={`Play ${t.name}’s video review`}
          thumbnail="hqdefault"
          className="rounded-2xl"
          playSize="small"
          buttonProps={{ 'data-tm-play': index }}
        />
      ) : (
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-900 [box-shadow:0_16px_34px_-22px_rgb(0_0_0/0.55)]">
          <div
            className="relative block h-full w-full cursor-default bg-[radial-gradient(70%_90%_at_30%_20%,color-mix(in_srgb,var(--color-brand-400)_45%,transparent),transparent_70%),linear-gradient(135deg,var(--color-ink-800),var(--color-ink-950))] after:absolute after:inset-0 after:bg-[linear-gradient(180deg,transparent_40%,rgb(0_0_0/0.45))] after:content-['']"
            data-video-poster=""
          >
            <span className="absolute top-3 left-3 z-1 rounded-full border border-dashed border-[rgb(255_255_255/0.55)] px-[0.6rem] py-[0.15rem] text-[0.68rem] font-bold tracking-[0.1em] text-white uppercase">
              Sample
            </span>
            <PlayButton size="small" />
            <span className="absolute inset-x-0 bottom-[0.85rem] z-1 text-center text-[0.78rem] font-semibold text-[rgb(255_255_255/0.75)]">
              The client’s video goes here
            </span>
          </div>
        </div>
      )}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-[0.4rem] rounded-full bg-brand-50 px-[0.7rem] py-1 text-[0.72rem] font-[650] text-brand-700 dark:bg-[color-mix(in_srgb,var(--color-brand-500)_18%,transparent)] dark:text-brand-300">
          <Icon name="play" className="h-2.5 w-2.5" filled />
          Video review
        </span>
        <Topic t={t} />
      </div>
      <Quote t={t} />
      <Who t={t} />
    </li>
  )
}

/**
 * The row: it scrolls sideways (snapping to a card), its edges fade where there's more (.is-start / .is-end, set
 * by useReviewsRow), and while it glides or is dragged the snap is off
 */
const row = [
  '[--fade:3rem] -mx-4 mt-6 flex gap-4 overflow-x-auto overscroll-x-contain px-4 pt-3 pb-5 lg:gap-5',
  'snap-x snap-mandatory scroll-px-4 cursor-grab [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  '[mask-image:linear-gradient(to_right,transparent,#000_var(--fade),#000_calc(100%-var(--fade)),transparent)]',
  '[&.is-start]:[mask-image:linear-gradient(to_right,#000_calc(100%-var(--fade)),transparent)]',
  '[&.is-end]:[mask-image:linear-gradient(to_right,transparent,#000_var(--fade))] [&.is-start.is-end]:[mask-image:none]',
  'focus-visible:rounded-3xl focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-600',
  '[&.is-gliding]:snap-none [&.is-dragging]:cursor-grabbing [&.is-dragging]:snap-none [&.is-dragging]:select-none',
].join(' ')

const arrow = [
  'inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-800',
  '[transition:border-color_0.2s_ease,color_0.2s_ease,opacity_0.2s_ease] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white',
  '[&:hover:not(:disabled)]:border-brand-400 [&:hover:not(:disabled)]:text-brand-700 dark:[&:hover:not(:disabled)]:text-brand-300',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-default disabled:opacity-35',
].join(' ')

export function Reviews({ testimonials = clientReviews }: { testimonials?: Testimonial[] }) {
  const track = useRef<HTMLUListElement>(null)
  const controls = useRef<HTMLDivElement>(null)
  useReviewsRow(track, controls)
  return (
    <section
      id="clients"
      className={cn(bandMist, 'py-20 sm:py-26 border-t border-neutral-200 py-14! sm:py-18! dark:border-neutral-800')}
      aria-labelledby="clients-title"
    >
      <div className={container}>
        <div className="mx-auto max-w-5xl text-center">
          <SectionHeading
            id="clients-title"
            title="Don’t take our word for it. <em>Take theirs.</em>"
            titleClassName="text-[length:clamp(2rem,3.6vw,3.2rem)]"
          />
        </div>
        <ul
          ref={track}
          className={`${row} is-start`}
          data-tm-track=""
          tabIndex={0}
          aria-label="Client reviews. Scroll sideways for more."
        >
          {testimonials.map((t, i) =>
            t.video || t.sample ? <VideoCard key={i} t={t} index={i} /> : <WrittenCard key={i} t={t} />,
          )}
        </ul>
        {/* Where you are in the row (the thumb is as wide as the share on show), and the arrows */}
        <div ref={controls} className="mt-3 flex items-center gap-5" data-tm-controls="">
          <div
            className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800"
            aria-hidden="true"
          >
            <span className="absolute inset-y-0 left-0 rounded-[inherit] bg-brand-500" data-tm-thumb=""></span>
          </div>
          <div className="flex gap-2">
            <button type="button" className={arrow} data-tm-step="-1" aria-label="Previous reviews">
              <Icon name="chevron-left" className="h-5 w-5" />
            </button>
            <button type="button" className={arrow} data-tm-step="1" aria-label="Next reviews">
              <Icon name="chevron-right" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
