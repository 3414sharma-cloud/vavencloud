import type { Cover } from './comparison.model.ts'

/*
 * The "follow the wires" board's Tailwind classes (WiresBoard.tsx), named by part. Its colours come from its
 * own variables (--cw-ink, --cw-yes, ...), set on the board for the light theme and again for the dark one, so
 * every part follows the theme through them. The classes that depend on the board's state (who does a task,
 * which platform is shown) are chosen in WiresBoard.tsx.
 *
 * Widths: `max-[801px]:` is "800px wide or less", as max-width: 800px was (Tailwind's max-[...] is "less than").
 */

/** The board, and its colours */
export const board = [
  '[--cw-ink:var(--color-neutral-950)] [--cw-muted:var(--color-neutral-500)] [--cw-line:var(--color-neutral-200)]',
  '[--cw-card:#fff] [--cw-bg:var(--color-neutral-50)]',
  '[--cw-yes:var(--color-brand-500)] [--cw-yes-bg:var(--color-brand-50)]',
  '[--cw-half:var(--color-amber-500)] [--cw-half-bg:var(--color-amber-50)]',
  '[--cw-you:var(--color-neutral-500)] [--cw-you-bg:var(--color-neutral-100)]',
  'dark:[--cw-ink:var(--color-neutral-100)] dark:[--cw-muted:var(--color-neutral-400)] dark:[--cw-line:var(--color-neutral-800)]',
  'dark:[--cw-card:var(--color-neutral-900)] dark:[--cw-bg:var(--color-neutral-950)]',
  'dark:[--cw-yes:var(--color-brand-300)] dark:[--cw-yes-bg:var(--color-brand-950)]',
  'dark:[--cw-half:var(--color-amber-400)] dark:[--cw-half-bg:color-mix(in_srgb,var(--color-amber-950)_60%,var(--color-neutral-900))]',
  'dark:[--cw-you:var(--color-neutral-400)] dark:[--cw-you-bg:var(--color-neutral-800)]',
  // A dotted grid behind it
  'bg-(--cw-bg) bg-[radial-gradient(var(--color-neutral-200)_0.8px,transparent_0.8px)] bg-size-[18px_18px]',
  'dark:bg-[radial-gradient(var(--color-neutral-800)_0.8px,transparent_0.8px)]',
  'overflow-hidden rounded-3xl border border-(--cw-line) p-9 text-(--cw-ink)',
  'max-[801px]:p-6 max-[521px]:rounded-[1.1rem] max-[521px]:p-[1.1rem]',
  // Reduced motion: nothing on the board moves
  'motion-reduce:[&_*]:[transition:none]!',
].join(' ')

/* ---------- The platform switch ---------- */

export const tabs = 'flex gap-1 rounded-full border border-(--cw-line) bg-(--cw-card) p-[0.3rem] max-[801px]:w-full'

export const tab = [
  'inline-flex min-h-10 cursor-pointer items-center gap-[0.35rem] rounded-full px-[0.95rem] py-[0.45rem] text-[0.85rem] text-(--cw-muted)',
  'transition-[background,color,box-shadow] duration-[250ms] hover:text-(--cw-ink)',
  'aria-pressed:bg-(--cw-yes-bg) aria-pressed:text-(--cw-ink) aria-pressed:[box-shadow:inset_0_0_0_1px_var(--color-brand-200)]',
  'dark:aria-pressed:[box-shadow:inset_0_0_0_1px_var(--color-brand-800)]',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
  '[&_svg]:max-h-[18px] [&_svg]:max-w-[56px] max-[521px]:[&_svg]:max-h-[15px] max-[521px]:[&_svg]:max-w-[44px]',
  'max-[801px]:flex-1 max-[801px]:justify-center max-[801px]:px-2',
].join(' ')

/** "VavenCloud" in a tab: the tab's own colour */
export const tabName = 'font-bold text-[0.85rem] text-inherit max-[521px]:text-[0.72rem]'

/* ---------- The diagram: tasks | wires | owners | wires | fees ---------- */

export const diagram = [
  'mt-8 overflow-x-auto px-[0.35rem] pt-2 pb-4 [scrollbar-color:var(--cw-line)_transparent] [scrollbar-width:thin]',
  'focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--cw-yes)',
].join(' ')

/** The owners and fees sit in two aligned rows beside the tasks */
export const stage = [
  'relative grid min-w-[700px] grid-rows-[1fr_1fr] items-center gap-y-6',
  'grid-cols-[minmax(0,1.35fr)_minmax(2.5rem,0.4fr)_minmax(0,0.85fr)_minmax(2.5rem,0.4fr)_minmax(0,1fr)]',
  'max-[801px]:grid-cols-[minmax(0,1.35fr)_2.5rem_minmax(0,0.85fr)_2.5rem_minmax(0,1fr)]',
].join(' ')

export const wires = 'pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible'

export const tasks = 'relative z-1 col-start-1 row-[1/3] grid gap-3'

/** Each task tinted by its own colour */
export const taskAccent: Record<string, string> = {
  server: '[--task-accent:#2589cb]',
  activity: '[--task-accent:#319d62]',
  zap: '[--task-accent:#e18a26]',
  rocket: '[--task-accent:#8661ca]',
  code: '[--task-accent:#168f92]',
}

export const task = [
  'relative flex min-h-18 items-center gap-3 rounded-[0.85rem] border border-(--cw-line) p-[0.9rem]',
  'bg-[color-mix(in_srgb,var(--task-accent,transparent)_10%,var(--cw-card))] [box-shadow:var(--shadow-card)]',
  'transition-[border-color] duration-[350ms] max-[801px]:gap-[0.55rem]',
].join(' ')

const taskIconBase =
  'flex h-[2.2rem] w-[2.2rem] flex-none items-center justify-center rounded-[0.6rem] transition-[background,color] duration-[350ms] max-[801px]:size-[1.85rem]'

/** A task's icon, coloured by who does it */
export const taskIcon: Record<Cover, string> = {
  yes: `${taskIconBase} bg-(--cw-yes-bg) text-(--cw-yes)`,
  half: `${taskIconBase} bg-(--cw-half-bg) text-amber-700 dark:text-amber-300`,
  you: `${taskIconBase} bg-(--cw-you-bg) text-(--cw-you)`,
}

export const taskText = 'grid min-w-0'
export const taskName = 'text-[0.88rem] font-semibold max-[801px]:text-[0.8rem]'
export const taskNote = 'mt-1 text-[0.72rem] leading-[1.5] text-(--cw-muted) max-[801px]:text-[0.68rem]'

/* ---------- Ports: where a wire plugs in ---------- */

const portBase =
  'absolute top-1/2 h-[0.7rem] w-[0.7rem] rounded-[50%] border-2 [transform:translateY(-50%)] transition-[border-color,background] duration-[350ms]'

/** On a task's right edge, filled with the colour of who does it */
export const taskPort: Record<Cover, string> = {
  yes: `${portBase} -right-[0.35rem] border-(--cw-yes) bg-(--cw-yes)`,
  half: `${portBase} -right-[0.35rem] border-(--cw-half) bg-(--cw-half)`,
  you: `${portBase} -right-[0.35rem] border-(--cw-you) bg-(--cw-you)`,
}

/** On an owner's or a fee's left edge: hollow, ringed in `border` */
export const inPort = (border: string) => `${portBase} -left-[0.35rem] bg-(--cw-card) ${border}`

/* ---------- The two owners: the platform, and your team ---------- */

export const dest = [
  'relative col-start-3 flex min-h-[9.5rem] flex-col items-center justify-center gap-[0.35rem] rounded-2xl border bg-(--cw-card) px-3 py-5 text-center',
  'transition-[border-color,box-shadow] duration-[400ms]',
].join(' ')

/** The platform's card: glowing when it does all five */
export const cloudCard = (all: boolean, alone: boolean) =>
  [
    dest,
    alone ? 'row-[1/3]' : 'row-start-1',
    all
      ? 'border-brand-300 [box-shadow:0_0_0_4px_color-mix(in_srgb,var(--color-brand-200)_40%,transparent),var(--shadow-card)] dark:border-brand-700 dark:[box-shadow:0_0_0_4px_color-mix(in_srgb,var(--color-brand-800)_45%,transparent)]'
      : 'border-(--cw-line) [box-shadow:var(--shadow-card)]',
  ].join(' ')

/** Your team's card: amber while it has work, faded when it has none */
export const teamCard = (busy: boolean) =>
  [
    dest,
    'row-start-2 [box-shadow:var(--shadow-card)]',
    busy ? 'border-amber-300 dark:border-amber-800' : 'border-(--cw-line) opacity-75',
  ].join(' ')

const destIconBase =
  'flex size-12 items-center justify-center rounded-[50%] transition-[background,color,box-shadow] duration-[400ms] max-[801px]:size-10 motion-reduce:[animation:none]!'

export const teamIcon = (busy: boolean) =>
  busy
    ? `${destIconBase} animate-cw-busy bg-(--cw-half-bg) text-amber-700 dark:text-amber-300`
    : `${destIconBase} bg-(--cw-you-bg) text-(--cw-you)`

export const destName = 'text-[0.95rem] font-semibold max-[801px]:text-[0.9rem]'
export const destNote = 'text-[0.72rem] text-(--cw-muted)'

/** The platform's own mark, in its colours */
export const providerLogo = (azure: boolean) =>
  [
    'flex min-h-14 w-full flex-wrap items-center justify-center gap-2 py-2 text-[0.95rem] font-[650]',
    azure ? 'text-[#0078d4] dark:text-[#3b9fe8]' : 'text-[#232f3e] dark:text-white',
  ].join(' ')
export const providerSvg = 'h-8 w-auto max-w-full shrink-0'
export const providerMark = 'h-7 text-brand-600'
export const providerName = 'font-bold text-[0.95rem] text-(--cw-ink)'

/* ---------- The fees ---------- */

export const costCard = (team: boolean, alone: boolean) =>
  [
    'relative z-1 col-start-5 grid min-h-[9.5rem] w-full min-w-0 items-center rounded-2xl border bg-(--cw-card) px-4 py-5 [box-shadow:var(--shadow-card)]',
    team ? 'row-start-2 border-(--cw-line)' : `border-brand-300 ${alone ? 'row-[1/3]' : 'row-start-1'}`,
  ].join(' ')
export const price = 'w-full text-center'
export const priceLabel = 'block text-[0.7rem] text-(--cw-muted)'
export const priceValue =
  'mt-2 block text-[length:clamp(1.3rem,2.3vw,2rem)] leading-[1.2] font-[650] tracking-[-0.04em] tabular-nums'
export const priceUnit = 'mt-[0.35rem] block text-[0.72rem] font-normal tracking-normal text-(--cw-muted)'
export const priceNote = 'mt-[0.65rem] text-[0.65rem] leading-[1.5] text-(--cw-muted)'

/* ---------- Your hours and rate, for the estimate ---------- */

export const assumptions = [
  'mt-6 grid grid-cols-[minmax(0,1fr)_repeat(2,minmax(0,12rem))] [align-items:end] gap-x-6 gap-y-4 rounded-2xl border border-(--cw-line) bg-(--cw-card) p-6',
  'max-[801px]:grid-cols-[repeat(2,minmax(0,1fr))] max-[801px]:p-5 max-[381px]:grid-cols-[minmax(0,1fr)]',
].join(' ')
export const assumptionsTitle = 'self-center text-[0.9rem] font-semibold max-[801px]:col-[1/-1]'
export const field = 'grid gap-2 text-[0.75rem] text-(--cw-muted)'
export const input = [
  'min-h-11 w-full rounded-lg border border-(--cw-line) bg-(--cw-bg) px-3 py-[0.65rem] text-(--cw-ink)',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--cw-yes)',
].join(' ')
export const assumptionsNote = 'col-[1/-1] text-[0.72rem] leading-[1.6] text-(--cw-muted)'

/* ---------- Wires, and the key to their colours ---------- */

type Kind = Cover | 'advice'

const wirePath = 'fill-none [stroke-linecap:round]'
export const wireBase = (kind: Kind) =>
  `${wirePath} stroke-(--cw-line) [stroke-width:5] ${kind === 'advice' ? 'opacity-0' : 'opacity-60'}`
const wireColour: Record<Kind, string> = {
  yes: 'stroke-(--cw-yes) [stroke-width:2.25]',
  half: 'stroke-(--cw-half) [stroke-width:2.25]',
  you: 'stroke-(--cw-you) [stroke-width:2.25]',
  // Advice only: a thin dashed wire to the platform
  advice: 'stroke-(--cw-half) [stroke-width:1.5] opacity-80 [stroke-dasharray:0.012_0.018]',
}
export const wireLine = (kind: Kind) => `${wirePath} ${wireColour[kind]}`
const packetColour: Record<Kind, string> = {
  yes: 'fill-(--cw-yes) text-(--cw-yes)',
  half: 'fill-(--cw-half) text-(--cw-half)',
  you: 'fill-(--cw-you) text-(--cw-you)',
  advice: '',
}
export const packet = (kind: Kind) => `[filter:drop-shadow(0_0_4px_currentColor)] ${packetColour[kind]}`

export const legend =
  'mt-6 flex flex-wrap gap-x-6 gap-y-3 text-[0.75rem] text-(--cw-muted) [&>span]:inline-flex [&>span]:items-center [&>span]:gap-[0.45rem]'
const legendLine = 'h-0 w-[1.4rem] rounded-xs border-t-[2.5px]'
export const legendKey: Record<Cover, string> = {
  yes: `${legendLine} text-(--cw-yes)`,
  half: `${legendLine} text-(--cw-half)`,
  you: `${legendLine} text-(--cw-you)`,
}
