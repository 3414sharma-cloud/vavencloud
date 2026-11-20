/*
 * The site's shared Tailwind class lists: the page width, the buttons, cards, icon boxes, form fields and the
 * section surfaces. Combine them with your own classes through cn() (lib/cn.ts), so yours win:
 * `cn(card, 'rounded-[1.4rem] p-5')`. The logo's are in Logo.tsx.
 */

/*
 * Section headings (SectionHeading.tsx), in the hero's type, so every section reads alike: the title (an <em> in
 * it goes on its own line, in the serif italic and the brand colour, like the hero's second line), then the lead.
 */
export const sectionTitle = [
  'text-[length:clamp(2.5rem,5.4vw,5.1rem)] leading-[0.98] font-[540] tracking-[-0.05em] text-balance text-neutral-950 dark:text-white',
  // the font as an arbitrary property: tailwind-merge would take font-['…'] for a weight and drop it for font-normal
  "[&_em]:block [&_em]:[font-family:'Instrument_Serif',Georgia,serif] [&_em]:text-[1.12em] [&_em]:leading-[0.95] [&_em]:font-normal [&_em]:tracking-[-0.02em] [&_em]:italic",
  '[&_em]:text-brand-600 dark:[&_em]:text-brand-400',
].join(' ')
/** The paragraph under a title; centred under a centred heading */
export const sectionLead =
  'max-w-[38rem] text-[1.04rem] leading-[1.65] text-pretty text-neutral-600 sm:text-[1.12rem] dark:text-neutral-400 [.text-center_&]:mx-auto'

/** The page's content column */
export const container = 'mx-auto w-full max-w-6xl px-6'

const button =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:focus-visible:outline-brand-400'

/** Petrol button with a lit top edge and a soft coloured glow, like a real pressable control */
export const btnPrimary = [
  button,
  'bg-linear-to-b from-brand-500 to-brand-600 text-white transition-[box-shadow,filter,transform] duration-200',
  'hover:brightness-110 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60',
  '[box-shadow:inset_0_1px_0_rgb(255_255_255/0.28),0_1px_2px_color-mix(in_srgb,var(--color-brand-950)_35%,transparent),0_10px_22px_-10px_color-mix(in_srgb,var(--color-brand-600)_75%,transparent)]',
  '[&:hover:not(:disabled)]:[box-shadow:inset_0_1px_0_rgb(255_255_255/0.32),0_1px_2px_color-mix(in_srgb,var(--color-brand-950)_35%,transparent),0_14px_28px_-10px_color-mix(in_srgb,var(--color-brand-600)_90%,transparent)]',
].join(' ')

/** White outlined button */
export const btnSecondary = [
  button,
  'border border-neutral-300 bg-white text-neutral-950 shadow-sm transition-[border-color,color,box-shadow] duration-200',
  'hover:border-brand-400 hover:text-brand-700 hover:shadow-md',
  'dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:border-brand-400 dark:hover:text-brand-300',
].join(' ')

/**
 * White card on the paper background with a soft, warm shadow instead of a flat outline. It lifts a little
 * under the pointer. The transition and the lift are !important, as they were in the old stylesheet, where
 * they came after (and outranked) the scroll reveal's and every card's own; reduced motion still cuts the
 * transition short.
 */
export const card = [
  'rounded-3xl border border-neutral-200/80 bg-white [box-shadow:var(--shadow-card)]',
  'dark:border-neutral-800 dark:bg-neutral-900 dark:[box-shadow:0_1px_2px_rgb(0_0_0/0.3),0_18px_40px_-24px_rgb(0_0_0/0.6)]',
  '[transition:border-color_0.2s_ease,transform_0.3s_cubic-bezier(0.22,1,0.36,1),box-shadow_0.3s_ease]! motion-reduce:[transition-duration:0.01ms]!',
  'hover:[transform:translateY(-3px)]! hover:[box-shadow:var(--shadow-lift)]!',
].join(' ')

/** The small rounded square an icon sits in */
export const iconBox =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-brand-600 dark:border-brand-900 dark:bg-brand-950/60 dark:text-brand-300'

/** A form field (input, textarea, the role picker's button) */
export const field =
  'mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 shadow-sm transition-colors placeholder:text-neutral-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-brand-400 dark:focus:ring-brand-400/20'

/* ---------- Section surfaces: tinted bands so the page is not one flat sheet ---------- */

/** Light grey band that fades into the white page */
export const bandLinen = [
  'bg-[linear-gradient(180deg,var(--color-linen)_0%,color-mix(in_oklab,var(--color-linen)_45%,var(--color-paper))_38%,var(--color-paper)_100%)]',
  'dark:bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-neutral-900)_70%,var(--color-neutral-950))_0%,color-mix(in_oklab,var(--color-neutral-900)_30%,var(--color-neutral-950))_45%,var(--color-neutral-950)_100%)]',
].join(' ')

/** Cool petrol mist, for the "how" and "proof" sections */
export const bandMist = [
  'bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-brand-50)_70%,var(--color-neutral-100))_0%,color-mix(in_oklab,var(--color-brand-50)_35%,var(--color-paper))_45%,var(--color-paper)_100%)]',
  'dark:bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-neutral-900)_60%,var(--color-neutral-950))_0%,color-mix(in_oklab,var(--color-neutral-900)_25%,var(--color-neutral-950))_50%,var(--color-neutral-950)_100%)]',
].join(' ')

/**
 * Near-black brand block (petrol or night blue) with a lit corner, wherever the page needs a dark block. In dark
 * mode it's charcoal with only a faint petrol glow in the corner.
 */
export const surfaceInk = [
  'bg-ink-900 text-ink-text',
  'bg-[radial-gradient(120%_140%_at_0%_0%,color-mix(in_srgb,var(--color-brand-400)_30%,transparent)_0%,transparent_55%),linear-gradient(160deg,var(--color-ink-800)_0%,var(--color-ink-900)_60%,var(--color-ink-950)_100%)]',
  '[box-shadow:inset_0_1px_0_rgb(255_255_255/0.1),0_28px_56px_-30px_color-mix(in_srgb,var(--color-ink-900)_75%,transparent)]',
  'dark:text-neutral-300',
  'dark:bg-[radial-gradient(120%_140%_at_0%_0%,color-mix(in_srgb,var(--color-brand-500)_18%,transparent)_0%,transparent_55%),linear-gradient(160deg,var(--color-ink-800)_0%,var(--color-ink-900)_60%,color-mix(in_oklab,var(--color-ink-900)_50%,var(--color-ink-950))_100%)]',
  'dark:[box-shadow:inset_0_1px_0_rgb(255_255_255/0.08),0_28px_56px_-30px_rgb(0_0_0/0.8)]',
].join(' ')
