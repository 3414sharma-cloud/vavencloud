import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router'
import { routes } from '@/app/routes.ts'
import { Icon } from '@/components/ui/Icon.tsx'
import { LogoMark } from '@/components/ui/Logo.tsx'
import { ProblemHeading } from './ProblemHeading.tsx'
import { callers, loopNote, payoff, site, type CallerId, type Line, type SiteState } from './story.data.ts'
import {
  callMinute,
  callOf,
  calls,
  captions,
  clockTime,
  crashMinute,
  keys,
  loopAt,
  screens,
  timeAt,
  timeline,
  TYPING,
  upMinute,
  type Call,
  type Timed,
} from './story.timeline.ts'
import { useStoryPlayer } from './useStoryPlayer.ts'
import { btnPrimary, container, surfaceInk } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * The problem, told as a story, then what the night cost in one dark band with the booking button. The site goes
 * down, you call your hosting provider, the DevOps freelancer and your developers, each passes it on, then one
 * call to VavenCloud fixes it. A narration line runs above; a phone shows the night (the alerts, then each call
 * as it's said); the site's status and how long it has been down sit beside it, with the list of who you called
 * and what they said. The index underneath jumps to a scene; the button at its end pauses, plays and replays.
 * The picture is hidden from screen readers; a list tells the same story.
 *
 * Every element that comes and goes carries its moment on the timeline as data-from / data-to; the player
 * (useStoryPlayer.ts) sets data-on on it (the data-on: classes below), and data-scene and data-site on the stage
 * ([data-story]). Its colours are the stage's own --st-* set, for each theme. The script is in story.data.ts.
 * Widths: Tailwind's max-[N]: is "narrower than N", so max-[640px]: is "639px wide or less".
 */

/** Shown from `from` until `to` (or for good) */
const when = (from: number, to?: number) => ({
  'data-from': String(Math.round(from)),
  ...(to === undefined ? {} : { 'data-to': String(Math.round(to)) }),
})
const pad = (n: number) => String(n).padStart(2, '0')
const fill = (text: string, t: number) => text.replace('{time}', timeAt(t))

const mono = 'font-[ui-monospace,SFMono-Regular,Menlo,monospace]'

const Avatar = ({ id, size, mark = '' }: { id: CallerId; size: string; mark?: string }) =>
  id === 'vaven' ? (
    <LogoMark size={24} className={`flex-none object-contain ${mark}`} />
  ) : (
    <Icon name={callers[id].icon!} className={size} />
  )

/** Texts that share one spot, one per state of the site (the stage shows the one for its data-site) */
const BySite = ({ k }: { k: 'chip' | 'code' | 'text' }) =>
  (Object.keys(site.states) as SiteState[]).map((s) => (
    <span key={s} data-when={s}>
      {site.states[s][k]}
    </span>
  ))

/* ---------- The stage ---------- */

const stage = [
  // Its colours, light then dark
  '[--st-surface:#fff] [--st-mist:var(--color-neutral-100)] [--st-line:var(--color-neutral-200)] [--st-muted:var(--color-neutral-500)]',
  '[--st-slate:var(--color-neutral-700)] [--st-ink:var(--color-neutral-950)] [--st-accent:var(--color-brand-600)] [--st-accent-tint:var(--color-brand-50)]',
  '[--st-bad:rgb(190_18_60)] [--st-bad-tint:rgb(255_228_230)] [--st-good:rgb(4_120_87)] [--st-good-tint:rgb(209_250_229)]',
  'dark:[--st-surface:var(--color-neutral-900)] dark:[--st-mist:var(--color-neutral-800)] dark:[--st-line:var(--color-neutral-800)] dark:[--st-muted:var(--color-neutral-400)]',
  'dark:[--st-slate:var(--color-neutral-300)] dark:[--st-ink:#fff] dark:[--st-accent:var(--color-brand-400)]',
  'dark:[--st-accent-tint:color-mix(in_srgb,var(--color-brand-500)_14%,var(--color-neutral-900))]',
  'dark:[--st-bad:rgb(251_113_133)] dark:[--st-bad-tint:rgb(244_63_94/0.14)] dark:[--st-good:rgb(110_231_183)] dark:[--st-good-tint:rgb(16_185_129/0.16)]',
  'mt-12 max-[640px]:mt-10',
  // Jumping to a moment shows it at once; pausing holds every animation
  '[&.is-jumping_*]:[transition:none]! [&.is-paused_*]:[animation-play-state:paused]!',
  // The texts that share a spot: only the one for the site's state shows
  '[&_[data-when]]:invisible [&_[data-when]]:[grid-area:1/1]',
  '[&[data-site=ok]_[data-when=ok]]:visible [&[data-site=down]_[data-when=down]]:visible',
  '[&[data-site=fixing]_[data-when=fixing]]:visible [&[data-site=up]_[data-when=up]]:visible',
  // Reduced motion: nothing animates, and every change is near instant
  'motion-reduce:[&_*]:[animation:none]! motion-reduce:[&_*]:[transition-duration:0.01s]!',
  // (the pseudo-elements in the selector, not before:/after:, which would give every one of them a box)
  'motion-reduce:[&_*::before]:[animation:none]! motion-reduce:[&_*::before]:[transition-duration:0.01s]!',
  'motion-reduce:[&_*::after]:[animation:none]! motion-reduce:[&_*::after]:[transition-duration:0.01s]!',
].join(' ')

/* ---------- The narration ---------- */

const line = [
  'flex [grid-area:1/1] items-baseline gap-[0.9rem] max-[640px]:flex-col max-[640px]:gap-2',
  'opacity-0 [filter:blur(6px)] [transform:translateY(0.45em)] [transition:opacity_0.45s_ease,filter_0.45s_ease,transform_0.6s_cubic-bezier(0.22,1,0.36,1)]',
  'data-on:opacity-100 data-on:[filter:none] data-on:[transform:none]',
].join(' ')
/** The time beside a line, coloured by the scene: trouble, help on the way, fixed */
const lineTime = [
  `flex-none rounded-full bg-(--st-bad-tint) px-[0.6rem] py-[0.2rem] ${mono} text-[0.78rem] font-semibold text-(--st-bad) tabular-nums`,
  '[[data-tone=accent]>&]:bg-(--st-accent-tint) [[data-tone=accent]>&]:text-(--st-accent)',
  '[[data-tone=good]>&]:bg-(--st-good-tint) [[data-tone=good]>&]:text-(--st-good)',
].join(' ')

const Narration = () => (
  <div className="grid" aria-hidden="true">
    {captions.map((c, i) => (
      <p key={i} className={line} data-tone={c.tone} {...when(c.at, captions[i + 1]?.at)}>
        <span className={lineTime}>{timeAt(c.at)}</span>
        <span className="text-[length:clamp(1.15rem,1.9vw,1.5rem)] leading-[1.2] font-[620] tracking-[-0.035em] text-balance text-(--st-ink) max-[640px]:text-[1.15rem]">
          {c.text}
        </span>
      </p>
    ))}
  </div>
)

/* ---------- The site ---------- */

/** The site's card: red and shaken while it's down, a green pulse when it's back */
const siteCard = [
  'overflow-hidden rounded-[1.2rem] border border-(--st-line) bg-(--st-surface) [box-shadow:var(--shadow-card)] [grid-area:site]',
  '[transition:border-color_0.4s_ease,box-shadow_0.4s_ease]',
  "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:[align-items:end] lg:[grid-template-areas:'browser_browser'_'main_stats'_'bar_bar'_'legend_legend']",
  '[[data-story][data-site=down]_&]:border-[color-mix(in_srgb,var(--st-bad)_40%,var(--st-line))]',
  '[[data-story][data-site=down]_&]:[box-shadow:0_0_0_4px_color-mix(in_srgb,var(--st-bad)_9%,transparent),var(--shadow-card)]',
  '[[data-story][data-site=down]_&]:[animation:st-shake_0.5s_ease_1]',
  '[[data-story][data-site=up]_&]:border-[color-mix(in_srgb,var(--st-good)_40%,var(--st-line))] [[data-story][data-site=up]_&]:[animation:st-up_1.4s_ease-out_1]',
].join(' ')
/** The site's state beside its address: green, red, or blue and blinking while an engineer is on it */
const siteChip = [
  "inline-grid flex-none rounded-full px-[0.65rem] py-[0.15rem] text-[0.72rem] font-[650] [transition:background-color_0.4s_ease,color_0.4s_ease] [&>span]:before:content-['●_']",
  '[[data-story]:is([data-site=ok],[data-site=up])_&]:bg-(--st-good-tint) [[data-story]:is([data-site=ok],[data-site=up])_&]:text-(--st-good)',
  '[[data-story][data-site=down]_&]:bg-(--st-bad-tint) [[data-story][data-site=down]_&]:text-(--st-bad)',
  '[[data-story][data-site=fixing]_&]:bg-(--st-accent-tint) [[data-story][data-site=fixing]_&]:text-(--st-accent) [[data-story][data-site=fixing]_&]:[animation:st-blink_1.4s_ease-in-out_infinite]',
].join(' ')
/** The status code: green, or red (glitching while the site is down) */
const statusCode = [
  `grid ${mono} text-[length:clamp(2.75rem,4.5vw,3.4rem)] leading-[0.9] font-semibold tracking-[-0.05em] tabular-nums [transition:color_0.4s_ease]`,
  '[[data-story]:is([data-site=ok],[data-site=up])_&]:text-(--st-good) [[data-story]:is([data-site=down],[data-site=fixing])_&]:text-(--st-bad)',
  '[[data-story][data-site=down]_&]:[animation:st-glitch_3.2s_steps(1)_infinite]',
].join(' ')
const statTerm = 'text-[0.68rem] font-bold tracking-[0.1em] text-(--st-muted) uppercase'
const statValue =
  'mt-[0.2rem] text-[1.6rem] font-[620] tracking-[-0.04em] text-(--st-ink) tabular-nums max-[640px]:text-[1.35rem]'

const SiteCard = () => (
  <div className={siteCard}>
    <div className="flex items-center gap-3 border-b border-b-(--st-line) bg-[color-mix(in_srgb,var(--st-mist)_55%,var(--st-surface))] px-[0.85rem] py-[0.6rem] lg:[grid-area:browser]">
      <span className="flex flex-none gap-[0.3rem] max-[640px]:hidden [&>i]:size-[0.55rem] [&>i]:rounded-full [&>i]:bg-(--st-line)">
        <i></i>
        <i></i>
        <i></i>
      </span>
      <span
        className={`min-w-0 flex-1 overflow-hidden rounded-full border border-(--st-line) bg-(--st-surface) px-3 py-[0.2rem] ${mono} text-[0.72rem] text-ellipsis whitespace-nowrap text-(--st-muted)`}
      >
        {site.url}
      </span>
      <span className={siteChip}>
        <BySite k="chip" />
      </span>
    </div>
    <div className="px-[1.3rem] pt-[1.1rem] pb-0 lg:[grid-area:main]">
      <p className={statusCode}>
        <BySite k="code" />
      </p>
      <p className="mt-[0.6rem] grid text-[0.95rem] font-[550] text-(--st-slate)">
        <BySite k="text" />
      </p>
    </div>
    <dl className="grid grid-cols-2 gap-4 px-[1.3rem] pt-4 pb-0 max-[640px]:[align-items:end] lg:[grid-area:stats]">
      <div>
        <dt className={statTerm}>Down for</dt>
        <dd className={`${statValue} [[data-story][data-site=down]_&]:text-(--st-bad)`} data-down="">
          0 min
        </dd>
      </div>
      <div>
        <dt className={statTerm}>Failed checkouts</dt>
        <dd className={statValue} data-failed="">
          0
        </dd>
      </div>
    </dl>
    {/* The night so far: red for the minutes on calls that went nowhere, blue for the fix */}
    <div className="mx-[1.3rem] mt-[0.85rem] mb-0 flex h-2 overflow-hidden rounded-full bg-(--st-mist) lg:[grid-area:bar]">
      <span className="bg-[rgb(244_63_94)] [transition:width_0.35s_ease]" data-bar-lost=""></span>
      <span className="bg-brand-500 [transition:width_0.35s_ease]" data-bar-fix=""></span>
    </div>
    <p className="flex flex-wrap gap-x-5 gap-y-[0.35rem] px-[1.3rem] pt-2 pb-[0.95rem] text-[0.78rem] text-(--st-muted) lg:[grid-area:legend] [&>span]:inline-flex [&>span]:items-center [&>span]:gap-[0.4rem] [&_b]:font-[650] [&_b]:text-(--st-ink) [&_b]:tabular-nums">
      <span>
        <i className="size-2 rounded-full bg-[rgb(244_63_94)]"></i>
        <b data-lost="">0</b> min on calls that went nowhere
      </span>
      <span>
        <i className="size-2 rounded-full bg-brand-500"></i>
        <b data-fix="">0</b> min to fix
      </span>
    </p>
  </div>
)

/* ---------- Who you called ---------- */

/** The loop's arrow spins once as the note arrives */
const LoopIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 flex-none [[data-item][data-on]_&]:[animation:st-spin_1.2s_cubic-bezier(0.22,1,0.36,1)_1]"
    aria-hidden="true"
  >
    <path d="M21 12a9 9 0 1 1-2.64-6.36L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
)

type Chip = [tone: string, content: ReactNode, from: number, to?: number]

/** A call on the list: faint until it's made, outlined while it's live; on a phone the chips go under the name */
const row = [
  'relative grid grid-cols-[2.3rem_minmax(0,1fr)_auto] items-center gap-x-3 rounded-[0.9rem] px-[0.6rem] py-[0.35rem]',
  'opacity-40 [transition:opacity_0.4s_ease] data-on:opacity-100 [&>:not([data-row-live])]:relative',
  'max-[640px]:grid-cols-[2.3rem_minmax(0,1fr)] max-[640px]:[align-items:start]',
].join(' ')
const rowLive =
  'absolute inset-0 rounded-[inherit] border-[1.5px] border-[color-mix(in_srgb,var(--st-accent)_55%,transparent)] bg-(--st-accent-tint) opacity-0 [transition:opacity_0.35s_ease] data-on:opacity-100'
/** The role, then (in the same spot) what they said: red for a brush-off, blue for us */
const rowSub =
  '[grid-area:1/1] text-(--st-muted) opacity-0 [transition:opacity_0.35s_ease] data-on:opacity-100 data-[tone=bad]:font-semibold data-[tone=bad]:text-(--st-bad) data-[tone=good]:font-semibold data-[tone=good]:text-(--st-accent)'
/** A call's chips, one at a time in the same spot: calling, on the line or no answer, then the verdict */
const chip = [
  'inline-flex [grid-area:1/1] items-center gap-[0.3rem] rounded-full px-[0.6rem] py-[0.15rem] text-[0.72rem] font-[650] whitespace-nowrap',
  'opacity-0 [transform:scale(0.85)] [transition:opacity_0.25s_ease,transform_0.4s_cubic-bezier(0.34,1.56,0.64,1)] data-on:opacity-100 data-on:[transform:none]',
  'data-[tone=ring]:bg-(--st-mist) data-[tone=ring]:text-(--st-slate) data-[tone=ring]:[&_svg]:[animation:st-wiggle_0.9s_ease-in-out_infinite]',
  'data-[tone=live]:bg-(--st-accent-tint) data-[tone=live]:text-(--st-accent) data-[tone=off]:bg-(--st-mist) data-[tone=off]:text-(--st-muted)',
  'data-[tone=bad]:bg-(--st-bad-tint) data-[tone=bad]:text-(--st-bad) data-[tone=good]:bg-(--st-good-tint) data-[tone=good]:text-(--st-good)',
].join(' ')

function LogRow({ c }: { c: Call }) {
  const who = callers[c.id]
  const good = c.id === 'vaven'
  const said = good ? c.answered! : c.verdict
  const chips: Chip[] = [
    [
      'ring',
      <>
        <Icon name="phone" className="h-3 w-3" />
        Calling…
      </>,
      c.dial,
      c.answered ?? c.missed ?? c.verdict,
    ],
    ...(c.answered !== undefined ? [['live', good ? 'On it' : 'On the line', c.answered, c.verdict] as Chip] : []),
    ...(c.missed !== undefined ? [['off', 'No answer', c.missed, c.verdict] as Chip] : []),
    [
      good ? 'good' : 'bad',
      <>
        <Icon name={good ? 'check' : 'x'} className="h-3 w-3" />
        {who.verdict}
      </>,
      c.verdict,
    ],
  ]
  return (
    <li className={row} {...when(c.dial)}>
      <span className={rowLive} data-row-live="" {...when(c.dial, c.verdict)}></span>
      <span
        className={`inline-flex size-[2.3rem] items-center justify-center rounded-full text-(--st-slate) ${good ? 'border border-(--st-line) bg-white' : 'bg-(--st-mist)'}`}
      >
        <Avatar id={c.id} size="h-4.5 w-4.5" />
      </span>
      <span className="min-w-0">
        <span className="block text-[0.9rem] font-[650] text-(--st-ink)">{who.name}</span>
        <span className="mt-[0.05rem] grid text-[0.8rem]">
          <span className={rowSub} {...when(0, said)}>
            {who.role}
          </span>
          <span className={rowSub} data-tone={good ? 'good' : 'bad'} {...when(said)}>
            {who.excuse}
          </span>
        </span>
      </span>
      <span className="inline-grid justify-items-end max-[640px]:mt-[0.35rem] max-[640px]:justify-items-start max-[640px]:[grid-column:2]">
        {chips.map(([tone, content, from, to], i) => (
          <span key={i} className={chip} data-tone={tone} {...when(from, to)}>
            {content}
          </span>
        ))}
      </span>
    </li>
  )
}

const CallList = () => (
  <div className="rounded-[1.2rem] border border-(--st-line) bg-(--st-surface) px-3 pt-[0.8rem] pb-[0.65rem] [box-shadow:var(--shadow-card)] [grid-area:log] lg:[align-self:stretch]">
    <p className="px-2 text-[0.68rem] font-bold tracking-[0.1em] text-(--st-muted) uppercase">Who you called</p>
    <ol className="mt-[0.4rem] grid gap-[0.15rem]">
      {calls
        .filter((c) => c.id !== 'vaven')
        .map((c) => (
          <LogRow key={c.id} c={c} />
        ))}
      <Item from={loopAt} where="log">
        <p className="mx-[0.1rem] my-[0.15rem] flex w-full items-center gap-[0.55rem] rounded-[0.8rem] border border-dashed border-[color-mix(in_srgb,var(--st-bad)_50%,transparent)] bg-[color-mix(in_srgb,var(--st-bad-tint)_45%,transparent)] px-3 py-2 text-[0.8rem] leading-[1.35] font-semibold text-(--st-bad)">
          <LoopIcon />
          {loopNote}
        </p>
      </Item>
      <LogRow c={callOf('vaven')} />
    </ol>
  </div>
)

/* ---------- The phone ---------- */

/**
 * A message, someone typing, a note, an alert or the loop note, opening up as it arrives so the earlier ones move
 * up (its row grows from nothing). Yours rise from the right; alerts drop in from above; on the list of calls it
 * stays open below 1280px.
 */
const itemBase =
  'grid grid-rows-[0fr] opacity-0 [transition:grid-template-rows_0.4s_cubic-bezier(0.22,1,0.36,1),opacity_0.35s_ease,transform_0.45s_cubic-bezier(0.22,1,0.36,1)] data-on:grid-rows-[1fr] data-on:opacity-100 data-on:[transform:none]'
const itemFrom = {
  them: '[transform:translateY(10px)_scale(0.96)] origin-bottom-left',
  you: '[transform:translateY(10px)_scale(0.96)] origin-bottom-right',
  alerts: '[transform:translateY(-10px)_scale(0.96)] origin-top',
  log: '[transform:translateY(10px)_scale(0.96)] origin-bottom-left max-[1280px]:grid-rows-[1fr]',
}

const Item = ({
  from,
  to,
  where = 'them',
  children,
}: {
  from: number
  to?: number
  where?: keyof typeof itemFrom
  children: ReactNode
}) => (
  <li className={`${itemBase} ${itemFrom[where]}`} data-item="" {...when(from, to)}>
    <div className="min-h-0 overflow-hidden">
      <div className={where === 'alerts' ? 'flex pt-0 pb-[0.45rem]' : 'flex pt-[0.45rem]'}>{children}</div>
    </div>
  </li>
)

const msg = 'max-w-[86%] rounded-[1.1rem] px-3 py-2 text-[0.82rem] leading-[1.4]'

function LineItems({ l, start, vaven, good }: { l: Line; start: number; vaven: boolean; good: boolean }) {
  const at = start + l.at
  if ('you' in l)
    return (
      <Item from={at} where="you">
        <p className={`${msg} ml-auto rounded-br-[0.35rem] bg-brand-500`}>{l.you}</p>
      </Item>
    )
  if ('note' in l)
    return (
      <Item from={at}>
        <p className="mx-auto rounded-full bg-[rgb(255_255_255/0.08)] px-[0.65rem] py-[0.15rem] text-[0.68rem] font-semibold text-[rgb(255_255_255/0.62)]">
          {fill(l.note, at)}
        </p>
      </Item>
    )
  // Their messages: grey; on our call blue, and green for the fix
  const them = vaven
    ? good
      ? 'bg-[rgb(16_185_129/0.3)]'
      : 'bg-[color-mix(in_srgb,var(--color-brand-400)_30%,rgb(255_255_255/0.06))]'
    : 'bg-[rgb(255_255_255/0.13)]'
  return (
    <>
      <Item from={at - TYPING} to={at}>
        <span className="inline-flex gap-1 rounded-[1.1rem] rounded-bl-[0.35rem] bg-[rgb(255_255_255/0.13)] px-[0.8rem] py-[0.65rem]">
          <i className="size-[0.38rem] rounded-full bg-white opacity-35 [animation:st-dot_1.1s_ease-in-out_infinite]"></i>
          <i className="size-[0.38rem] rounded-full bg-white opacity-35 [animation:st-dot_1.1s_ease-in-out_0.15s_infinite]"></i>
          <i className="size-[0.38rem] rounded-full bg-white opacity-35 [animation:st-dot_1.1s_ease-in-out_0.3s_infinite]"></i>
        </span>
      </Item>
      <Item from={at}>
        <p className={`${msg} rounded-bl-[0.35rem] ${them}`}>
          {l.time && (
            <span className={`mb-[0.1rem] block ${mono} text-[0.66rem] text-[rgb(255_255_255/0.62)]`}>
              {timeAt(at)}
            </span>
          )}
          {l.them}
        </p>
      </Item>
    </>
  )
}

/** One of the phone's screens: they share one spot, the one on show fading and settling in */
const screen =
  'relative flex [grid-area:1/1] min-h-0 flex-col invisible opacity-0 [transform:scale(0.96)] [transition:opacity_0.45s_ease,transform_0.55s_cubic-bezier(0.22,1,0.36,1),visibility_0s_linear_0.55s] data-on:visible data-on:opacity-100 data-on:[transform:none] data-on:[transition-delay:0s]'
const alertIcon =
  'inline-flex size-[1.9rem] flex-none items-center justify-center rounded-lg text-white data-[tone=bad]:bg-[rgb(225_29_72)] data-[tone=warn]:bg-[rgb(217_119_6)] data-[tone=brand]:bg-brand-500'

function LockScreen({ from, to, own }: { from: number; to?: number; own: Timed[] }) {
  const alerts = own.flatMap((s) => (s.alerts ?? []).map((a) => ({ ...a, at: s.start + a.at })))
  return (
    <div className={`${screen} px-[0.8rem] pt-6 pb-[0.8rem] text-center`} {...when(from, to)}>
      <p className="text-[0.82rem] font-semibold text-[rgb(255_255_255/0.75)]">Tonight</p>
      <p className="text-[4.2rem] leading-none font-semibold tracking-[-0.045em] tabular-nums" data-clock="">
        {clockTime(keys[0][1], true)}
      </p>
      <ol className="mt-5">
        {[...alerts].reverse().map((a, i) => (
          <Item key={i} from={a.at} where="alerts">
            <div className="flex w-full gap-[0.65rem] rounded-[1.05rem] bg-[rgb(255_255_255/0.13)] px-3 py-[0.65rem] text-left [backdrop-filter:blur(12px)]">
              <span className={alertIcon} data-tone={a.tone}>
                <Icon name={a.icon} className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="flex justify-between gap-2 text-[0.64rem] font-[650] tracking-[0.05em] text-[rgb(255_255_255/0.62)] uppercase [&>span]:font-medium [&>span]:tracking-normal [&>span]:normal-case">
                  {a.app}
                  <span>now</span>
                </p>
                <p className="mt-[0.1rem] text-[0.84rem] font-[650]">{a.title}</p>
                <p className="text-[0.78rem] leading-[1.35] text-[rgb(255_255_255/0.78)]">{a.text}</p>
              </div>
            </div>
          </Item>
        ))}
      </ol>
    </div>
  )
}

type Status = [tone: string, text: string, from: number, to?: number]

/** The caller's picture: while it rings, two ripples spread out of it in turn */
const callAvatar = [
  'relative inline-flex size-12 items-center justify-center rounded-full',
  "before:absolute before:inset-0 before:rounded-[inherit] before:border-[1.5px] before:border-[rgb(255_255_255/0.45)] before:opacity-0 before:content-['']",
  "after:absolute after:inset-0 after:rounded-[inherit] after:border-[1.5px] after:border-[rgb(255_255_255/0.45)] after:opacity-0 after:content-['']",
  '[[data-call]:has([data-status]_[data-tone=ring][data-on])_&]:before:[animation:st-ripple_1.6s_ease-out_infinite]',
  '[[data-call]:has([data-status]_[data-tone=ring][data-on])_&]:after:[animation:st-ripple_1.6s_ease-out_0.8s_infinite]',
].join(' ')
/** The call's status, one at a time in the same spot: calling, connected (with a green dot), no answer, ended */
const callStatus = [
  'inline-flex [grid-area:1/1] items-center justify-center gap-[0.35rem] opacity-0 [transition:opacity_0.3s_ease] data-on:opacity-100',
  'data-[tone=ring]:text-[rgb(255_255_255/0.8)] data-[tone=off]:text-[rgb(255_255_255/0.5)] data-[tone=live]:text-[rgb(110_231_183)]',
  "data-[tone=live]:before:size-[0.4rem] data-[tone=live]:before:rounded-full data-[tone=live]:before:bg-current data-[tone=live]:before:content-['']",
].join(' ')
/** The verdict, stamped over the call when it's over (the messages under it fade back) */
const stamp = [
  `absolute top-[55%] left-1/2 z-2 rounded-[0.6rem] border-[2.5px] border-solid bg-[rgb(7_12_20/0.82)] px-4 py-[0.45rem] ${mono} text-[0.85rem] font-bold tracking-[0.12em] whitespace-nowrap uppercase`,
  'opacity-0 [transform:translate(-50%,-50%)_rotate(-8deg)_scale(1.8)] [backdrop-filter:blur(6px)] [transition:opacity_0.25s_ease,transform_0.45s_cubic-bezier(0.34,1.56,0.64,1)]',
  'data-on:opacity-100 data-on:[transform:translate(-50%,-50%)_rotate(-8deg)]',
  'data-[tone=bad]:border-[rgb(251_113_133)] data-[tone=bad]:text-[rgb(253_164_175)] data-[tone=good]:border-[rgb(52_211_153)] data-[tone=good]:text-[rgb(110_231_183)]',
].join(' ')

function CallScreen({ c, from, to, own }: { c: Call; from: number; to?: number; own: Timed[] }) {
  const who = callers[c.id]
  const good = c.id === 'vaven'
  const statuses: Status[] = [
    ['ring', 'Calling…', c.dial, c.answered ?? c.missed ?? c.verdict],
    ...(c.answered !== undefined
      ? [['live', c.connected ?? 'Connected', c.answered, good ? undefined : c.verdict] as Status]
      : []),
    ...(c.missed !== undefined ? [['off', 'No answer', c.missed] as Status] : []),
    ...(c.answered !== undefined && !good ? [['off', 'Call ended', c.verdict] as Status] : []),
  ]
  return (
    <div className={`${screen} px-[0.85rem] pt-[0.9rem] pb-[0.6rem]`} data-call="" {...when(from, to)}>
      <div className="flex flex-col items-center text-center">
        <span className={`${callAvatar} ${good ? 'bg-white' : 'bg-[rgb(255_255_255/0.13)]'}`}>
          <Avatar id={c.id} size="h-6 w-6" mark="size-[1.9rem]" />
        </span>
        <p className="mt-[0.6rem] text-[1.08rem] font-[650] tracking-[-0.02em]">{who.name}</p>
        <p className="text-[0.74rem] text-[rgb(255_255_255/0.55)]">{who.role}</p>
        <p className="mt-[0.4rem] grid text-[0.76rem] font-[650]" data-status="">
          {statuses.map(([tone, text, f, t], i) => (
            <span key={i} className={callStatus} data-tone={tone} {...when(f, t)}>
              {text}
            </span>
          ))}
        </p>
      </div>
      <ol className="mt-[0.6rem] flex min-h-0 flex-1 flex-col justify-end overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_2.25rem)] [transition:opacity_0.4s_ease] [[data-call]:has([data-stamp][data-on])_&]:opacity-[0.35]">
        {own.flatMap((s) =>
          (s.lines ?? []).map((l, i) => (
            <Fragment key={`${s.id}-${i}`}>
              <LineItems l={l} start={s.start} vaven={good} good={s.tone === 'good'} />
            </Fragment>
          )),
        )}
      </ol>
      <span className={stamp} data-stamp="" data-tone={good ? 'good' : 'bad'} {...when(c.verdict)}>
        {who.verdict}
      </span>
      <div className="flex justify-center pt-3">
        <span
          className="inline-flex size-[2.8rem] items-center justify-center rounded-full bg-[rgb(239_68_68)] opacity-0 [transform:scale(0.8)] [transition:opacity_0.3s_ease,transform_0.3s_ease] data-on:opacity-100 data-on:[transform:none] [&_svg]:[transform:rotate(135deg)]"
          {...when(c.dial, c.missed ?? c.verdict)}
        >
          <Icon name="phone" className="h-5 w-5" />
        </span>
      </div>
    </div>
  )
}

/** The phone's signal bars and battery */
const SystemIcons = () => (
  <span className="flex items-end gap-[0.12rem]">
    <i className="h-[0.35rem] w-[0.2rem] rounded-[1px] bg-white"></i>
    <i className="h-2 w-[0.2rem] rounded-[1px] bg-white"></i>
    <i className="h-[0.65rem] w-[0.2rem] rounded-[1px] bg-white"></i>
    <b className="relative ml-[0.3rem] h-[0.6rem] w-[1.15rem] rounded-[0.2rem] border border-[rgb(255_255_255/0.55)] after:absolute after:inset-[1px_40%_1px_1px] after:rounded-[1px] after:bg-white after:content-['']"></b>
  </span>
)

const Phone = () => (
  <div className="w-full max-w-68 justify-self-center rounded-[2.6rem] bg-[#05080d] p-2 [box-shadow:inset_0_0_0_1px_rgb(255_255_255/0.1),0_0_0_1px_color-mix(in_srgb,var(--st-line)_70%,transparent),0_40px_70px_-40px_rgb(5_15_30/0.7)] [grid-area:phone] [align-self:start]">
    <div className="relative isolate flex h-[36rem] flex-col overflow-hidden rounded-[2.15rem] bg-[radial-gradient(130%_60%_at_50%_-10%,color-mix(in_srgb,var(--color-brand-500)_38%,transparent),transparent_70%),linear-gradient(180deg,#0f1d30_0%,#070c14_100%)] text-white max-[640px]:h-[33rem] lg:h-[33rem]">
      {/* A red glow that pulses while the site is down, before the first call */}
      <span className="absolute inset-0 -z-1 bg-[radial-gradient(90%_55%_at_50%_30%,rgb(244_63_94/0.32),transparent_70%)] opacity-0 [transition:opacity_0.6s_ease] [[data-story][data-scene=crash][data-site=down]_&]:opacity-100 [[data-story][data-scene=crash][data-site=down]_&]:[animation:st-pulse_2s_ease-in-out_infinite]"></span>
      <div className="flex items-center justify-between px-[1.4rem] pt-[0.8rem] pb-0 text-[0.78rem] font-[650] tabular-nums">
        <span data-clock="">{clockTime(keys[0][1], true)}</span>
        <span className="h-[1.45rem] w-22 rounded-full bg-black"></span>
        <SystemIcons />
      </div>
      <div className="relative grid min-h-0 flex-1">
        {screens.map((s) =>
          s.id === 'lock' ? (
            <LockScreen key={s.id} from={s.from} to={s.to} own={s.scenes} />
          ) : (
            <CallScreen key={s.id} c={callOf(s.id)} from={s.from} to={s.to} own={s.scenes} />
          ),
        )}
      </div>
      <span className="mx-auto mt-[0.35rem] mb-2 block h-[0.3rem] w-28 rounded-full bg-[rgb(255_255_255/0.5)]"></span>
    </div>
  </div>
)

/* ---------- The index of scenes, and the story for screen readers ---------- */

const said = (l: Line, s: Timed) => {
  if ('you' in l) return `You: “${l.you}”`
  if ('note' in l) return `${fill(l.note, s.start + l.at)}.`
  return `${callers[s.screen as CallerId].name}: “${l.them}”`
}

const Transcript = () => (
  <ol className="sr-only">
    {timeline.map((s) => {
      const parts = [
        ...s.captions.map((c) => `${timeAt(s.start + c.at)}. ${c.text}`),
        ...(s.alerts ?? []).map((a) => `${a.app}: ${a.title}. ${a.text}.`),
        ...(s.lines ?? []).map((l) => said(l, s)),
        ...(s.verdict !== undefined && s.screen !== 'lock' ? [`${callers[s.screen].verdict}.`] : []),
      ]
      return <li key={s.id}>{parts.join(' ')}</li>
    })}
  </ol>
)

/** A scene in the index: its bar fills as it plays (a wave, drifting while it's the current one) */
const scene =
  'min-w-0 cursor-pointer text-left text-[0.8rem] leading-[1.3] font-semibold text-(--st-muted) [transition:color_0.3s_ease] aria-[current=true]:text-(--st-ink) focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(--st-accent) [&:hover]:text-(--st-ink)'
const sceneBar =
  'mb-[0.65rem] block h-2 overflow-hidden rounded-none bg-(--st-line) [mask-image:var(--v5-wave)] [mask-size:24px_8px] [mask-repeat:repeat-x] [[aria-current=true]>&]:[animation:v5-wave-drift_1.6s_linear_infinite]'

/* ---------- What the night cost: the minutes come from the story's own clock ---------- */

const Payoff = () => (
  <div
    className={cn(
      surfaceInk,
      'mt-10 grid items-center gap-7 rounded-3xl px-6 py-7 md:grid-cols-[minmax(0,1fr)_auto] md:gap-8 md:px-9 md:py-8',
    )}
    data-reveal=""
  >
    <div>
      <p className="text-[length:clamp(1.6rem,3vw,2.5rem)] leading-[1.08] font-[650] tracking-[-0.04em] text-balance text-white">
        <span className="text-[rgb(253_164_175)]">{callMinute - crashMinute} minutes</span> chasing vendors.
        <br />
        <span className="text-brand-300">{upMinute - callMinute} minutes</span> to fix.
      </p>
      <p className="mt-[0.7rem] text-[0.95rem] leading-[1.6]">{payoff.text}</p>
    </div>
    <div className="flex flex-col items-center gap-3 text-center">
      <p className="font-[650] text-white">{payoff.question}</p>
      <Link to={routes.book} className={cn(btnPrimary, 'w-full !px-7 !py-3.5 !text-base md:w-auto')}>
        Book a free 30-minute production review <Icon name="arrow-right" className="h-4 w-4" />
      </Link>
      <p className="text-[0.8rem] opacity-75">{payoff.note}</p>
    </div>
  </div>
)

export function Story() {
  const stageRef = useStoryPlayer<HTMLDivElement>()
  return (
    <section id="problem" className="py-20 sm:py-26" aria-labelledby="problem-title">
      <div className={container}>
        {/* The heading across the whole width, a size down (ProblemHeading.tsx) */}
        <div>
          <ProblemHeading />
          <p className="mt-4 text-sm font-semibold text-neutral-500 dark:text-neutral-400">Illustrative example</p>
        </div>
        <div ref={stageRef} className={stage} data-story="" data-scene={timeline[0].id} data-site="ok">
          <Narration />
          {/* The phone on top on a phone; from 1024px the site and the calls on the left, the phone on the right */}
          <div
            className="mt-5 grid gap-4 [grid-template-areas:'phone'_'site'_'log'] lg:mt-7 lg:grid-cols-[minmax(0,1fr)_17rem] lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-4 lg:[grid-template-areas:'site_phone'_'log_phone']"
            aria-hidden="true"
          >
            <SiteCard />
            <CallList />
            <Phone />
          </div>
          <div className="mt-7 flex items-center gap-5 max-[640px]:mt-5 max-[640px]:gap-3">
            <div
              className="grid min-w-0 flex-1 grid-cols-6 gap-[0.85rem] max-[640px]:gap-2"
              role="group"
              aria-label="Scenes"
            >
              {timeline.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  className={scene}
                  data-goto={i}
                  aria-label={`Scene ${i + 1}: ${s.tab}`}
                >
                  <span className={sceneBar} data-scene-bar="" aria-hidden="true">
                    <i className="block h-full origin-left bg-(--st-accent) [transform:scaleX(0)]"></i>
                  </span>
                  <span className="flex items-baseline gap-[0.45rem]" aria-hidden="true">
                    <span
                      className={`flex-none ${mono} text-[0.68rem] font-medium [[aria-current=true]_&]:text-(--st-accent)`}
                    >
                      {pad(i + 1)}
                    </span>
                    <span className="max-[640px]:hidden">{s.tab}</span>
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="inline-flex min-h-9 flex-none cursor-pointer items-center gap-[0.45rem] rounded-full border border-(--st-line) bg-(--st-surface) px-[0.95rem] text-[0.82rem] font-[650] text-(--st-ink) [transition:border-color_0.2s_ease] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(--st-accent) [&:hover]:border-(--st-accent)"
              data-control=""
            >
              <span data-icon="pause" hidden>
                <Icon name="pause" className="h-3 w-3" filled />
              </span>
              <span data-icon="play">
                <Icon name="play" className="h-3 w-3" filled />
              </span>{' '}
              <span data-control-label="">Play</span>
              <span className="sr-only"> the story</span>
            </button>
          </div>
        </div>
        <Transcript />
        <Payoff />
      </div>
    </section>
  )
}
