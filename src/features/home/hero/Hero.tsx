import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { Icon } from '@/components/ui/Icon.tsx'
import { DURATIONS, heroSlides, ownershipHighlights, type HeroSlide } from './hero.data.ts'
import { useHeroSlider } from './useHeroSlider.ts'
import { btnPrimary, container } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * The hero: a slider of the three ways we work (one call fixes it, stay on your cloud, run on ours), centred,
 * with a numbered index underneath and two soft glows drifting behind. Each slide plays in as it comes on: the
 * title word by word, then the description, the buttons and the note. What moves it is useHeroSlider.ts.
 *
 * It's always dark (the section's own .dark class), so inside it the dark colours are the colours. It pulls up
 * under the header (its height and its 1px border), and the header turns dark over it (.v5-hero-dark).
 * Widths: Tailwind's max-[N]: is "narrower than N", so max-[768px]: is "767px wide or less".
 */

const count = heroSlides.length

const vars = (v: Record<string, string | number>) => v as CSSProperties

/**
 * A slide's lines play in once it's the one on show, each a beat after the one before it (--after: once the
 * title's last word is on its way); not with reduced motion
 */
const riseDelays = {
  description: '[animation-delay:calc(0.5s+var(--after)*55ms)]',
  actions: '[animation-delay:calc(0.6s+var(--after)*55ms)]',
  highlight: '[animation-delay:calc(0.7s+var(--after)*55ms+var(--chip-index)*75ms)]',
  reassurance: '[animation-delay:calc(0.7s+var(--after)*55ms)]',
  firstReassurance: '[animation-delay:calc(0.95s+var(--after)*55ms)]',
}

/** A title line split into words, so they can rise in one after another; `from` carries the count across lines */
const Words = ({ text, from, active }: { text: string; from: number; active: boolean }) =>
  text.split(' ').flatMap((w, k) => [
    ...(k ? [' '] : []),
    <span
      key={k}
      className={`inline-block ${active ? 'animate-hero-word-in [animation-delay:calc(0.3s+var(--w)*55ms)] motion-reduce:[animation:none]' : ''}`}
      style={vars({ '--w': from + k })}
    >
      {w}
    </span>,
  ])

interface SlideProps {
  s: HeroSlide
  i: number
  active: boolean
  slideRef: (el: HTMLDivElement | null) => void
}

/**
 * A slide: two-line title, description, the buttons and a reassuring note, all centred. All three sit in the same
 * grid cell; the one on show fades in from the side it's heading to (--out, set by useHeroSlider), the others are
 * hidden and blurred. A slide with long copy takes the hero's full width from 768px.
 */
const slide =
  'w-full max-w-[62rem] self-center justify-self-center text-center [grid-area:1/1] max-[768px]:[align-self:start]'
const slideShown =
  'visible opacity-100 [filter:none] [transform:none] [transition:opacity_0.28s_ease_0s,filter_0.28s_ease_0s,transform_0.6s_cubic-bezier(0.22,1,0.36,1)_0s,visibility_0s_linear_0s] motion-reduce:[transition:none]'
const slideHidden =
  'invisible opacity-0 [filter:blur(6px)] [transform:translateX(var(--out,-32px))] [transition:opacity_0.28s_ease,filter_0.28s_ease,transform_0.6s_cubic-bezier(0.22,1,0.36,1),visibility_0s_linear_0.6s] motion-reduce:[transition:none]'

/**
 * The title, in the section titles' type (its second line's own classes are on its <em>); a size down on a
 * phone; a long title sized so each half keeps to one line (--title-em)
 */
const title = [
  'mt-3 text-[length:clamp(2.5rem,5.4vw,5.1rem)] leading-[0.98] font-[540] tracking-[-0.05em] text-balance text-white',
  'max-[768px]:mt-2 max-[768px]:text-[length:clamp(2rem,8.6vw,2.5rem)]',
].join(' ')
/** The paragraph under it, in the section leads' type: 1rem below 768px, then 1.12rem */
const heroLead =
  'mx-auto mt-5 max-w-[38rem] text-[1rem] leading-[1.65] text-pretty text-neutral-400 min-[768px]:text-[1.12rem] max-[768px]:mt-[1.125rem]'
const longTitle = 'md:text-[length:min(calc((min(100vw,72rem)-3rem)/var(--title-em)),5.4vw,5.1rem)]'
const titleLine = 'block px-[0.04em] pt-[0.04em] pb-[0.1em] text-balance'

/** The buttons' arrows nudge right under the pointer; the main button's arrow sits in a soft circle */
const actions =
  'mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 max-[768px]:mt-5 [&_svg]:[transition:transform_0.2s_ease] [&_a:hover_svg]:[transform:translateX(3px)]'
const primary = cn(
  btnPrimary,
  'gap-3 !px-7 !py-3.5 !text-base active:[transform:scale(0.97)]',
  '[&_svg]:box-content [&_svg]:rounded-full [&_svg]:bg-[rgb(255_255_255/0.18)] [&_svg]:p-2',
  '[&_svg]:[transition:transform_0.3s_cubic-bezier(0.22,1,0.36,1),background-color_0.3s_ease] [&:hover_svg]:bg-[rgb(255_255_255/0.28)]',
)
/** The secondary link: a faint line under it, a full one drawn across under the pointer */
const link = [
  'inline-flex items-center gap-[0.4rem] pb-[0.2rem] text-[0.94rem] font-[650] text-white no-underline',
  'bg-[image:linear-gradient(currentColor,currentColor),linear-gradient(color-mix(in_srgb,currentColor_22%,transparent),color-mix(in_srgb,currentColor_22%,transparent))]',
  'bg-[position:0_100%,0_100%] bg-[length:0%_1px,100%_1px] bg-no-repeat [&:hover]:bg-[length:100%_1px,100%_1px]',
  '[transition:background-size_0.35s_cubic-bezier(0.22,1,0.36,1)]',
].join(' ')

function Slide({ s, i, active, slideRef }: SlideProps) {
  const first = i === 0
  const Tag = first ? 'h1' : 'h2'
  const lead = s.title[0].split(' ').length
  // The lines under the title start once its last word is on its way
  const after = lead + s.title[1].split(' ').length
  return (
    <div
      ref={slideRef}
      id={`hero-slide-${i}`}
      role="tabpanel"
      aria-roledescription="slide"
      aria-label={`${i + 1} of ${count}: ${s.tab}`}
      className={`${slide} ${active ? slideShown : slideHidden} ${s.titleEm || s.longText ? 'md:max-w-none' : ''}`}
      data-slide=""
      inert={!active}
      style={vars(s.titleEm ? { '--after': after, '--title-em': s.titleEm } : { '--after': after })}
    >
      <p className="text-xs font-semibold tracking-widest text-brand-300 uppercase sm:text-sm">{s.eyebrow}</p>
      <Tag id={first ? 'hero-title' : undefined} className={`${title} ${s.titleEm ? longTitle : ''}`}>
        <span className={titleLine}>
          <span className="block">
            <Words text={s.title[0]} from={0} active={active} />
          </span>
        </span>
        <span className={titleLine}>
          <em className="block font-['Instrument_Serif',Georgia,serif] text-[1.12em] leading-[0.95] font-normal tracking-[-0.02em] text-brand-400 italic">
            <Words text={s.title[1]} from={lead} active={active} />
          </em>
        </span>
      </Tag>
      <p
        className={`${heroLead} ${s.longText ? 'lg:max-w-none lg:text-[length:min(1.12rem,calc((100vw-3rem)/63.5))] lg:text-balance' : ''} ${active ? `animate-hero-rise ${riseDelays.description} motion-reduce:[animation:none]` : ''}`}
      >
        {s.description}
      </p>
      <div
        className={`${actions} ${active ? `animate-hero-rise ${riseDelays.actions} motion-reduce:[animation:none]` : ''}`}
      >
        <Link to={s.primary.href} className={primary}>
          {s.primary.label} <Icon name="arrow-right" className="h-4 w-4" />
        </Link>
        {s.secondary.external ? (
          <a href={s.secondary.href} target="_blank" rel="noopener" className={link}>
            {s.secondary.label}
            <span className="sr-only"> (opens in a new tab)</span> <Icon name="arrow-right" className="h-4 w-4" />
          </a>
        ) : (
          <Link to={s.secondary.href} className={link}>
            {s.secondary.label} <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        )}
      </div>
      {first && (
        <ul aria-label="What we own" className="mt-4 flex flex-wrap justify-center gap-1.5 sm:mt-5 sm:gap-2">
          {ownershipHighlights.map((highlight, index) => (
            <li
              key={highlight}
              className={cn(
                'rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-medium text-neutral-200',
                active && `animate-hero-rise ${riseDelays.highlight} motion-reduce:[animation:none]`,
              )}
              style={vars({ '--chip-index': index })}
            >
              {highlight}
            </li>
          ))}
        </ul>
      )}
      {s.reassurance && (
        <p
          className={cn(
            'mx-auto mt-3 max-w-[34rem] text-[0.82rem] leading-[1.5] text-neutral-400',
            active &&
              `animate-hero-rise ${first ? riseDelays.firstReassurance : riseDelays.reassurance} motion-reduce:[animation:none]`,
          )}
        >
          {s.reassurance}
        </p>
      )}
    </div>
  )
}

/** A fixed audio-style envelope with irregular peaks; the blue overlay tracks slide progress. */
const signalHeights = [5, 10, 16, 9, 22, 14, 7, 18, 11, 5]
const signalPath = signalHeights
  .map((height, i) => {
    const x = 6 + i * 7
    return `M${x} ${16 - height / 2}V${16 + height / 2}`
  })
  .join(' ')

const Signal = ({ stroke }: { stroke: string }) => (
  <svg
    viewBox="0 0 75 32"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className="block h-full w-full overflow-visible"
  >
    <path className={`${stroke} [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:4]`} d={signalPath} />
  </svg>
)

interface TabProps {
  s: HeroSlide
  i: number
  selected: boolean
  tabRef: (el: HTMLButtonElement | null) => void
  onSelect: () => void
}

/**
 * One compact waveform above each slide's name; only the selected one fills, over the slide's time (--dur), and
 * that animation ending is what moves the slider on. It holds while the slider is paused (.is-paused). With
 * reduced motion the selected one is simply full.
 */
const fill = [
  'absolute inset-0 [clip-path:inset(-20%_100%_-20%_0)]',
  '[[aria-selected=true]_&]:[animation:hero-wave-progress_var(--dur,8s)_linear_forwards]',
  '[[data-carousel].is-paused_[aria-selected=true]_&]:[animation-play-state:paused]',
  'motion-reduce:[[aria-selected=true]_&]:[animation:none] motion-reduce:[[aria-selected=true]_&]:[clip-path:inset(-20%_0_-20%_0)]',
].join(' ')

function Tab({ s, i, selected, tabRef, onSelect }: TabProps) {
  return (
    <button
      ref={tabRef}
      type="button"
      role="tab"
      id={`hero-tab-${i}`}
      aria-controls={`hero-slide-${i}`}
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      className="relative block min-h-18 min-w-0 cursor-pointer rounded-lg border-0 bg-transparent px-0 py-1 text-center text-[0.875rem] leading-[1.35] font-semibold text-neutral-400 [transition:color_0.25s_ease] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 max-[521px]:text-[0.72rem] aria-selected:text-brand-300 [&:hover]:text-brand-300"
      style={vars({ '--dur': `${DURATIONS[i]}ms` })}
      onClick={onSelect}
    >
      <span className="relative mx-auto mb-[0.6rem] block h-6 w-15" aria-hidden="true">
        <Signal stroke="stroke-neutral-700" />
        <span className={fill}>
          <Signal stroke="stroke-brand-400" />
        </span>
      </span>
      <span className="flex items-baseline justify-center gap-2 max-[640px]:flex-col max-[521px]:gap-[0.3rem]">
        <span
          className="flex-none font-[ui-monospace,SFMono-Regular,Menlo,monospace] text-[0.65rem] font-medium text-neutral-400 [transition:color_0.3s_ease] [[aria-selected=true]_&]:text-brand-300"
          aria-hidden="true"
        >
          0{i + 1}
        </span>
        {s.tab}
      </span>
    </button>
  )
}

/** The two soft glows drifting behind the slides (still with reduced motion) */
const glow = 'absolute top-1/2 left-1/2 rounded-[50%] motion-reduce:[animation:none]'

export function Hero() {
  const slider = useHeroSlider(count)
  return (
    <section
      id="top"
      className={[
        'dark v5-hero-dark relative isolate overflow-hidden text-neutral-300 scheme-dark',
        // Pulled up under the header; no border at its foot: the logo strip comes up over it as a sheet
        'mt-[calc(-18*var(--spacing)-1px)] bg-neutral-950',
        'bg-[image:radial-gradient(80%_80%_at_50%_0%,color-mix(in_srgb,var(--color-brand-800)_30%,transparent),transparent_68%),linear-gradient(180deg,var(--color-neutral-950),color-mix(in_oklab,var(--color-neutral-950)_84%,var(--color-brand-950)))]',
      ].join(' ')}
      aria-labelledby="hero-title"
    >
      <div className="pointer-events-none absolute inset-0 -z-2 overflow-hidden" aria-hidden="true">
        <span
          className={`${glow} h-[44rem] w-[44rem] animate-hero-drift-a bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-brand-700)_34%,transparent),transparent_66%)]`}
        ></span>
        <span
          className={`${glow} h-[36rem] w-[36rem] animate-hero-drift-b bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-brand-500)_16%,transparent),transparent_66%)]`}
        ></span>
      </div>
      {/* A fine dot grain, faded out toward the edges */}
      <div
        className="pointer-events-none absolute inset-0 -z-1 bg-[radial-gradient(color-mix(in_srgb,var(--color-neutral-950)_10%,transparent)_0.55px,transparent_0.55px)] bg-size-[7px_7px] opacity-[0.13] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,black,transparent_85%)]"
        aria-hidden="true"
      ></div>
      <div className={cn(container, 'relative pt-24 pb-14 md:pt-[clamp(7rem,14vh,9rem)] md:pb-18')}>
        <div>
          <div {...slider.carouselProps} data-carousel="" aria-roledescription="carousel" aria-label="What we do">
            <div className="grid touch-pan-y" data-slides="" {...slider.slidesProps}>
              {heroSlides.map((s, i) => (
                <Slide key={i} s={s} i={i} active={i === slider.index} slideRef={slider.slideRef(i)} />
              ))}
            </div>
            <div
              className="mx-auto mt-7 flex max-w-[50rem] animate-hero-rise items-start gap-6 [animation-delay:calc(var(--i,0)*110ms)] max-[768px]:mt-5 max-[640px]:gap-4 motion-reduce:[animation:none]"
              style={vars({ '--i': 6 })}
            >
              <div
                role="tablist"
                aria-label="Choose a slide"
                className="grid min-w-0 flex-1 grid-cols-3 gap-6 [align-items:start] max-[521px]:gap-[0.65rem]"
                {...slider.tablistProps}
              >
                {heroSlides.map((s, i) => (
                  <Tab
                    key={i}
                    s={s}
                    i={i}
                    selected={i === slider.index}
                    tabRef={slider.tabRef(i)}
                    onSelect={() => slider.select(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
