import '@/pages/v3/sections/story.v3.css'
import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { initTagline, problemHeading } from '@/pages/v2/sections/problem-heading.ts'
import type { CallerId, Line, Scene, SiteState } from '@/pages/v3/v3.data.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { onScrollFrame } from '@/shared/lib/smooth-scroll.ts'
import { icon } from '@/shared/ui/icons.ts'
import { logoMark } from '@/shared/ui/logo.ts'
import { callers, loopNote, payoff, scenes, site } from '../v5.data.ts'

/*
 * v4's problem: v3's story (story.v3.ts, same markup and story.v3.css) playing v4's script (v5.data.ts), then
 * what the night cost, in one dark band with the booking button. Its own copy, so the script can change here
 * without touching v3.
 *
 * The problem told as a story: the site goes down, you call your
 * hosting provider, the DevOps freelancer and your developers, each passes it on, then one call to VavenCloud
 * fixes it. A narration line runs above; a phone shows the night (the alerts, then each call as it's said); the
 * site's status and how long it has been down sit beside it, with the list of who you called and what they
 * said. The index underneath jumps to a scene; the button at its end pauses, plays and replays.
 *
 * Everything is placed on one timeline (ms from the start). Rendering a moment `t` sets data-on on every
 * [data-from] element whose time has come and whose data-to hasn't, and data-scene and data-site on the
 * stage; story.v3.css does the rest, so playing, pausing, jumping and replaying are all just "show t".
 *
 * v5: instead of one stage that changes in place, every scene is its own card (sceneCard), and the cards stack
 * over one another as you scroll (sticky, v5.css). Each card renders the same markup but only plays its own
 * slice of the timeline, then holds on how that scene ended, so the stack reads as the night, step by step.
 * Each card plays by itself once it's scrolled to, with no button and no pausing, through to how its scene
 * ended, and stays there. (v3's index and play button below are v3's; the cards have neither.) The picture is hidden
 * from screen readers; a list tells the same story. With reduced motion nothing plays by itself: the end
 * shows, and the index shows the end of each scene.
 */

/** How long "them" is seen typing before each message */
const TYPING = 1000

type Timed = Scene & { start: number }
const timeline = scenes.reduce<Timed[]>((list, s) => {
  const prev = list.at(-1)
  return [...list, { ...s, start: prev ? prev.start + prev.ms : 0 }]
}, [])
const lastScene = timeline[timeline.length - 1]
const END = lastScene.start + lastScene.ms

/* ---------- The clock: minutes past 02:00 at any moment ---------- */

const keys = timeline.flatMap((s) => s.clock.map(([ms, m]): [number, number] => [s.start + ms, m]))

/** Straight lines between the keys; two keys at one moment make the clock jump (the time between calls) */
const minuteAt = (t: number) => {
  let minute = keys[0][1]
  for (let i = 0; i < keys.length; i++) {
    const [ms, m] = keys[i]
    if (t < ms) {
      const [pms, pm] = keys[i - 1] ?? keys[i]
      return ms === pms ? m : pm + ((t - pms) / (ms - pms)) * (m - pm)
    }
    minute = m
  }
  return minute
}

/** 74 → "03:14", or "3:14" as a phone shows it */
const clockTime = (minutes: number, short = false) => {
  const m = Math.floor(minutes)
  const h = 2 + Math.floor(m / 60)
  return `${short ? h : String(h).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}
const timeAt = (t: number) => clockTime(minuteAt(t))

/* ---------- The moments everything hangs on ---------- */

const siteChanges: [number, SiteState][] = [
  [0, 'ok'],
  ...timeline.flatMap((s) => (s.site ?? []).map((c): [number, SiteState] => [s.start + c.at, c.state])),
]
const siteAt = (t: number) => siteChanges.filter(([ms]) => t >= ms).at(-1)![1]
const minuteOf = (state: SiteState) => Math.floor(minuteAt(siteChanges.find(([, s]) => s === state)![0]))

interface Call {
  id: CallerId
  dial: number
  answered?: number
  missed?: number
  connected?: string
  verdict: number
}

const calls: Call[] = timeline.flatMap((s) => {
  if (!s.call || s.screen === 'lock') return []
  const id = s.screen
  const ends = timeline.filter((x) => x.screen === id && x.verdict !== undefined).at(-1)!
  const abs = (ms?: number) => (ms === undefined ? undefined : s.start + ms)
  return [
    {
      id,
      dial: s.start,
      answered: abs(s.call.answered),
      missed: abs(s.call.missed),
      connected: s.call.connected,
      verdict: ends.start + ends.verdict!,
    },
  ]
})
const callOf = (id: CallerId) => calls.find((c) => c.id === id)!

const crashMinute = minuteOf('down')
const upMinute = minuteOf('up')
const callMinute = Math.floor(minuteAt(callOf('vaven').dial))

/** Each screen shows from the first scene that uses it to the end of its last */
const screens = [...new Set(timeline.map((s) => s.screen))].map((id) => {
  const own = timeline.filter((s) => s.screen === id)
  const last = own.at(-1)!
  return { id, from: own[0].start, to: last === lastScene ? undefined : last.start + last.ms, scenes: own }
})

/** Shown from `from` until `to` (or for good) */
const when = (from: number, to?: number) =>
  `data-from="${Math.round(from)}"${to === undefined ? '' : ` data-to="${Math.round(to)}"`}`
const pad = (n: number) => String(n).padStart(2, '0')
const fill = (text: string, t: number) => text.replace('{time}', timeAt(t))

const mark = (size: number) => logoMark(size, 'st-mark')
const avatar = (id: CallerId, size: string) => (id === 'vaven' ? mark(24) : icon(callers[id].icon!, size))

/** Texts that share one spot, one per state of the site */
const bySite = (key: 'chip' | 'code' | 'text') =>
  (Object.keys(site.states) as SiteState[]).map((s) => `<span data-when="${s}">${site.states[s][key]}</span>`).join('')

/* ---------- The narration ---------- */

const captions = timeline.flatMap((s) => s.captions.map((c) => ({ at: s.start + c.at, text: c.text, tone: s.tone })))

const narration = () => `
      <div class="st-caption" aria-hidden="true">
        ${captions
          .map(
            (c, i) => `
        <p class="st-line" data-tone="${c.tone}" ${when(c.at, captions[i + 1]?.at)}><span class="st-line-time">${timeAt(c.at)}</span><span class="st-line-text">${c.text}</span></p>`,
          )
          .join('')}
      </div>`

/* ---------- The site ---------- */

const siteCard = () => `
        <div class="st-site">
          <div class="st-browser">
            <span class="st-dots"><i></i><i></i><i></i></span>
            <span class="st-url">${site.url}</span>
            <span class="st-site-chip">${bySite('chip')}</span>
          </div>
          <div class="st-site-main">
            <p class="st-code">${bySite('code')}</p>
            <p class="st-code-text">${bySite('text')}</p>
          </div>
          <dl class="st-stats">
            <div><dt>Down for</dt><dd data-down>0 min</dd></div>
            <div><dt>Failed checkouts</dt><dd data-failed>0</dd></div>
          </dl>
          <div class="st-bar"><span class="st-bar-lost" data-bar-lost></span><span class="st-bar-fix" data-bar-fix></span></div>
          <p class="st-legend">
            <span><i class="st-dot-lost"></i><b data-lost>0</b> min on calls that went nowhere</span>
            <span><i class="st-dot-fix"></i><b data-fix>0</b> min to fix</span>
          </p>
        </div>`

/* ---------- Who you called ---------- */

const loopIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 flex-none" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.64-6.36L21 8"/><path d="M21 3v5h-5"/></svg>`
const loopAt = timeline.filter((s) => s.loop !== undefined).map((s) => s.start + s.loop!)[0]

const logRow = (c: Call) => {
  const who = callers[c.id]
  const good = c.id === 'vaven'
  const said = good ? c.answered! : c.verdict
  const chips: [string, string, number, number?][] = [
    ['ring', `${icon('phone', 'h-3 w-3')}Calling…`, c.dial, c.answered ?? c.missed ?? c.verdict],
    ...(c.answered !== undefined
      ? [['live', good ? 'On it' : 'On the line', c.answered, c.verdict] as [string, string, number, number]]
      : []),
    ...(c.missed !== undefined ? [['off', 'No answer', c.missed, c.verdict] as [string, string, number, number]] : []),
    [good ? 'good' : 'bad', `${icon(good ? 'check' : 'x', 'h-3 w-3')}${who.verdict}`, c.verdict],
  ]
  return `
            <li class="st-row" ${when(c.dial)}>
              <span class="st-row-live" ${when(c.dial, c.verdict)}></span>
              <span class="st-row-icon${good ? ' st-row-icon--vaven' : ''}">${avatar(c.id, 'h-4.5 w-4.5')}</span>
              <span class="st-row-who">
                <span class="st-row-name">${who.name}</span>
                <span class="st-row-sub"><span ${when(0, said)}>${who.role}</span><span class="st-row-said" data-tone="${good ? 'good' : 'bad'}" ${when(said)}>${who.excuse}</span></span>
              </span>
              <span class="st-chips">${chips.map(([tone, text, from, to]) => `<span class="st-chip" data-tone="${tone}" ${when(from, to)}>${text}</span>`).join('')}</span>
            </li>`
}

const callList = () => `
        <div class="st-log">
          <p class="st-log-label">Who you called</p>
          <ol class="st-rows">
            ${calls
              .filter((c) => c.id !== 'vaven')
              .map(logRow)
              .join('')}
            ${item(loopAt, undefined, `<p class="st-loop">${loopIcon}${loopNote}</p>`)}
            ${logRow(callOf('vaven'))}
          </ol>
        </div>`

/* ---------- The phone ---------- */

/** A message, someone typing or a note, opening up as it arrives so the earlier ones move up */
const item = (from: number, to: number | undefined, inner: string, side = '') =>
  `<li class="st-item ${side}" ${when(from, to)}><div class="st-item-clip"><div class="st-item-pad">${inner}</div></div></li>`

const line = (l: Line, start: number, good: boolean) => {
  const at = start + l.at
  if ('you' in l) return item(at, undefined, `<p class="st-msg st-msg--you">${l.you}</p>`, 'st-item--you')
  if ('note' in l) return item(at, undefined, `<p class="st-note">${fill(l.note, at)}</p>`, 'st-item--note')
  const time = l.time ? `<span class="st-msg-time">${timeAt(at)}</span>` : ''
  return (
    item(at - TYPING, at, '<span class="st-typing"><i></i><i></i><i></i></span>') +
    item(at, undefined, `<p class="st-msg st-msg--them${good ? ' st-msg--good' : ''}">${time}${l.them}</p>`)
  )
}

const lockScreen = (from: number, to: number | undefined, own: Timed[]) => {
  const alerts = own.flatMap((s) => (s.alerts ?? []).map((a) => ({ ...a, at: s.start + a.at })))
  return `
            <div class="st-screen st-lock" ${when(from, to)}>
              <p class="st-lock-day">Tonight</p>
              <p class="st-lock-time" data-clock>${clockTime(keys[0][1], true)}</p>
              <ol class="st-alerts">
                ${[...alerts]
                  .reverse()
                  .map((a) =>
                    item(
                      a.at,
                      undefined,
                      `<div class="st-alert"><span class="st-alert-icon" data-tone="${a.tone}">${icon(a.icon, 'h-4 w-4')}</span><div class="min-w-0"><p class="st-alert-app">${a.app}<span>now</span></p><p class="st-alert-title">${a.title}</p><p class="st-alert-text">${a.text}</p></div></div>`,
                    ),
                  )
                  .join('')}
              </ol>
            </div>`
}

const callScreen = (c: Call, from: number, to: number | undefined, own: Timed[]) => {
  const who = callers[c.id]
  const good = c.id === 'vaven'
  const statuses: [string, string, number, number?][] = [
    ['ring', 'Calling…', c.dial, c.answered ?? c.missed ?? c.verdict],
    ...(c.answered !== undefined
      ? [
          ['live', c.connected ?? 'Connected', c.answered, good ? undefined : c.verdict] as [
            string,
            string,
            number,
            number?,
          ],
        ]
      : []),
    ...(c.missed !== undefined ? [['off', 'No answer', c.missed] as [string, string, number]] : []),
    ...(c.answered !== undefined && !good ? [['off', 'Call ended', c.verdict] as [string, string, number]] : []),
  ]
  return `
            <div class="st-screen st-call${good ? ' st-call--vaven' : ''}" ${when(from, to)}>
              <div class="st-call-head">
                <span class="st-avatar">${avatar(c.id, 'h-6 w-6')}</span>
                <p class="st-call-name">${who.name}</p>
                <p class="st-call-role">${who.role}</p>
                <p class="st-status">${statuses.map(([tone, text, f, t]) => `<span data-tone="${tone}" ${when(f, t)}>${text}</span>`).join('')}</p>
              </div>
              <ol class="st-thread">
                ${own.flatMap((s) => (s.lines ?? []).map((l) => line(l, s.start, s.tone === 'good'))).join('')}
              </ol>
              <span class="st-stamp" data-tone="${good ? 'good' : 'bad'}" ${when(c.verdict)}>${who.verdict}</span>
              <div class="st-call-foot"><span class="st-hangup" ${when(c.dial, c.missed ?? c.verdict)}>${icon('phone', 'h-5 w-5')}</span></div>
            </div>`
}

const phone = () => `
        <div class="st-phone">
          <div class="st-glass">
            <span class="st-alarm"></span>
            <div class="st-statusbar">
              <span data-clock>${clockTime(keys[0][1], true)}</span>
              <span class="st-island"></span>
              <span class="st-sys"><i></i><i></i><i></i><b></b></span>
            </div>
            <div class="st-screens">
              ${screens.map((s) => (s.id === 'lock' ? lockScreen(s.from, s.to, s.scenes) : callScreen(callOf(s.id), s.from, s.to, s.scenes))).join('')}
            </div>
            <span class="st-home"></span>
          </div>
        </div>`

/* ---------- The index of scenes, and the story for screen readers ---------- */

/** The last moment a scene's card shows: the end of its scene (just before the next scene's screen takes over) */
const endOf = (s: Timed) => (s === lastScene ? END : s.start + s.ms - 1)

/**
 * One scene as its own card: its number and name, its narration, then the site, the calls and the phone as they
 * stand in that scene. The cards stick one over another as you scroll; each plays its own scene when it arrives
 * and then holds on how that scene ended.
 */
const sceneCard = (s: Timed, i: number) => `
      <article class="st st-card" style="--i:${i}" data-story data-start="${s.start}" data-end="${endOf(s)}" data-scene="${s.id}" data-site="ok">
        <span class="st-card-shade" aria-hidden="true"></span>
        <div class="st-card-head">
          <p class="st-card-tag" aria-hidden="true"><span class="st-card-num">${pad(i + 1)}<span>/${pad(timeline.length)}</span></span>${s.tab}</p>
        </div>
        ${narration()}
        <div class="st-body" aria-hidden="true">
          ${siteCard()}
          ${callList()}
          ${phone()}
        </div>
      </article>`

const said = (l: Line, s: Timed) => {
  if ('you' in l) return `You: “${l.you}”`
  if ('note' in l) return `${fill(l.note, s.start + l.at)}.`
  return `${callers[s.screen as CallerId].name}: “${l.them}”`
}

const transcript = () => `
  <ol class="sr-only">
    ${timeline
      .map((s) => {
        const parts = [
          ...s.captions.map((c) => `${timeAt(s.start + c.at)}. ${c.text}`),
          ...(s.alerts ?? []).map((a) => `${a.app}: ${a.title}. ${a.text}.`),
          ...(s.lines ?? []).map((l) => said(l, s)),
          ...(s.verdict !== undefined && s.screen !== 'lock' ? [`${callers[s.screen].verdict}.`] : []),
        ]
        return `<li>${parts.join(' ')}</li>`
      })
      .join('')}
  </ol>`

/* ---------- What the night cost: the minutes come from the story's own clock ---------- */

const payoffBand = () => `
    <div class="v4-payoff surface-ink" data-reveal>
      <div>
        <p class="v4-payoff-big"><span class="v4-payoff-lost">${callMinute - crashMinute} minutes</span> chasing vendors.<br /><span class="v4-payoff-fix">${upMinute - callMinute} minutes</span> to fix.</p>
        <p class="v4-payoff-text">${payoff.text}</p>
      </div>
      <div class="v4-payoff-cta">
        <p class="v4-payoff-q">${payoff.question}</p>
        <a href="${routes.book}" class="btn-primary !px-7 !py-3.5 !text-base">Book a free production review ${icon('arrow-right', 'h-4 w-4')}</a>
        <p class="v4-payoff-note">${payoff.note}</p>
      </div>
    </div>`

const html = () => `
<section id="problem" class="v2-section v4-story" aria-labelledby="problem-title">
  <div class="container-page">
    <div class="v4-problem-head">${problemHeading()}</div>
    <div class="st-stack" data-scroll-skip data-no-reveal>
      <div class="st-stage">
        ${timeline.map(sceneCard).join('')}
      </div>
      <div class="st-stack-hold" aria-hidden="true"></div>
    </div>
    ${transcript()}
    ${payoffBand()}
  </div>
</section>`

/* ---------- Playing it ---------- */

function initStory(root: HTMLElement): void {
  /** This card's part of the night: from the start of its scene to how it ended */
  const from = Number(root.dataset.start)
  const stop = Number(root.dataset.end)
  const timed = qsa('[data-from]', root).map((el) => ({
    el,
    from: Number(el.dataset.from),
    to: el.dataset.to === undefined ? Infinity : Number(el.dataset.to),
    on: false,
  }))
  const clocks = qsa('[data-clock]', root)
  const out = {
    down: qs('[data-down]', root),
    failed: qs('[data-failed]', root),
    lost: qs('[data-lost]', root),
    fix: qs('[data-fix]', root),
    barLost: qs('[data-bar-lost]', root),
    barFix: qs('[data-bar-fix]', root),
  }
  const total = upMinute - crashMinute

  let t = from
  const shown = { site: '', minute: -1 }

  const render = () => {
    const state = siteAt(t)
    if (state !== shown.site) root.dataset.site = shown.site = state
    timed.forEach((x) => {
      const on = t >= x.from && t < x.to
      if (on === x.on) return
      x.on = on
      x.el.toggleAttribute('data-on', on)
    })
    const m = Math.floor(minuteAt(t))
    if (m === shown.minute) return
    shown.minute = m
    clocks.forEach((c) => (c.textContent = clockTime(m, true)))
    const down = Math.max(Math.min(m, upMinute) - crashMinute, 0)
    const lost = Math.max(Math.min(m, callMinute) - crashMinute, 0)
    const fix = Math.max(Math.min(m, upMinute) - callMinute, 0)
    out.down.textContent = `${down} min`
    out.failed.textContent = String(down * site.failedPerMinute)
    out.lost.textContent = String(lost)
    out.fix.textContent = String(fix)
    out.barLost.style.width = `${(lost / total) * 100}%`
    out.barFix.style.width = `${(fix / total) * 100}%`
  }

  /** Show a moment straight away, without playing every change in between */
  const jump = (to: number) => {
    t = to
    root.classList.add('is-jumping')
    render()
    void root.offsetWidth
    root.classList.remove('is-jumping')
  }

  let started = false
  let last = 0

  const tick = (now: number) => {
    // A frame's timestamp can be a little earlier than the moment it started: never run backwards
    t = Math.min(t + Math.max(now - last, 0), stop)
    last = now
    render()
    if (t < stop) requestAnimationFrame(tick)
  }

  /** Plays the card's scene once, through to its end; nothing pauses it */
  const play = () => {
    if (started) return
    started = true
    root.classList.remove('is-paused')
    last = performance.now()
    requestAnimationFrame(tick)
  }

  // With reduced motion each card simply shows how its scene ended
  if (prefersReducedMotion()) {
    jump(stop)
    return
  }

  // Waiting below the screen: the loops (ringing, typing) hold still until the card arrives
  jump(from)
  root.classList.add('is-paused')
  // Plays the first time the card reaches the middle of the screen, and keeps playing to the end of its scene
  const seen = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return
      play()
      seen.disconnect()
    },
    { rootMargin: '-30% 0px -30% 0px' },
  )
  seen.observe(root)
}

/* ---------- The stack: pinned, each card glides up over the last, slower than the scroll ---------- */

/** How the stack paces itself, in screen heights of scrolling */
const PACE = {
  /** a card's slide from below the screen to its place: about half the scroll's speed */
  slide: 1.6,
  /** the pause on each card once it has landed, before the next one starts */
  pause: 0.45,
  /** the hold once the last card has landed, before the stack moves on with the page */
  hold: 0.5,
}

/**
 * The stage (.st-stage) is pinned to the screen for the whole stack, which is made tall enough for each card's
 * slide and pause (PACE). Each card after the first slides up from below the screen to its resting place,
 * easing in and out, at about half the speed of the scroll; then the stack rests for a moment before the next.
 * As a card lands it grows from 92% to full size; the cards it covers sink back (3.5% for each card on top,
 * from their top edge so their peeking edges stay put) and their shade darkens. After the last card the stack
 * holds and eases back by 5% before it scrolls on with the page.
 *
 * Kept cheap, since it runs every frame: it runs in the smooth scroll's own frame (onScrollFrame), so nothing
 * lags the scroll; it does nothing unless the scroll or the window has changed and the stack is near the
 * screen; sizes are read once (and when the page's size changes); and it writes each card's transform and its
 * shade's opacity directly, only when they change. With reduced motion none of this runs: the cards simply
 * stick one after another as you scroll (v5.css).
 */
function initStack(stack: HTMLElement): void {
  const cards = qsa('.st-card', stack)
  if (cards.length < 2 || prefersReducedMotion()) return
  stack.classList.add('is-pinned')
  const shades = cards.map((c) => qs('.st-card-shade', c))
  const shown = cards.map(() => ({ transform: '', shade: '', hidden: false }))
  const last = cards.length - 1
  let rests: number[] = [] // each card's resting top, from the top of the screen
  let stackTop = 0
  let vh = 0
  let lastY = NaN
  let dirty = true

  /** Read once, and again whenever the page's size changes: never in the middle of a frame */
  const measure = () => {
    vh = window.innerHeight
    rests = cards.map((c) => parseFloat(getComputedStyle(c).top))
    // Tall enough for every slide and pause, the hold, and the screen the stage itself fills
    stack.style.height = `${Math.round(vh * (last * (PACE.slide + PACE.pause) + PACE.hold + 1))}px`
    stackTop = stack.getBoundingClientRect().top + window.scrollY
  }

  const smooth = (x: number) => x * x * (3 - 2 * x) // ease in and out

  const update = () => {
    const y = window.scrollY
    if (y === lastY && !dirty) return
    lastY = y
    if (dirty) measure()
    dirty = false
    const s = (y - stackTop) / vh // how far into the pinned stack, in screen heights
    if (s < -2 || s > last * (PACE.slide + PACE.pause) + PACE.hold + 2) return

    // How far each card has come in: 0 waiting below the screen, 1 at its place (the first one is there already)
    const step = PACE.slide + PACE.pause
    const came = cards.map((_, i) =>
      i === 0 ? 1 : Math.min(Math.max((s - (i - 1) * step - PACE.pause) / PACE.slide, 0), 1),
    )
    const held = Math.min(Math.max((s - last * step) / PACE.hold, 0), 1)
    const settle = 1 - 0.05 * smooth(held)

    let covering = 0 // how much the cards after this one cover it, adding up from the front
    for (let i = last; i >= 0; i--) {
      const e = came[i]
      const glide = smooth(e)
      const below = (1 - glide) * (vh - rests[i] + 24) // from just under the screen's foot to its place
      const arrive = 1 - (1 - e) * (1 - e)
      const scale = (0.92 + 0.08 * arrive) * (1 - 0.035 * covering) * settle
      const transform = `translate3d(0, ${below.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`
      const shade = (Math.min(covering, 2) * 0.07).toFixed(3)
      const hidden = e === 0 // still waiting below the screen: not drawn at all
      if (transform !== shown[i].transform) cards[i].style.transform = shown[i].transform = transform
      if (shade !== shown[i].shade) shades[i].style.opacity = shown[i].shade = shade
      if (hidden !== shown[i].hidden) cards[i].style.visibility = (shown[i].hidden = hidden) ? 'hidden' : ''
      covering += glide
    }
  }

  // The page's size changing (the window, fonts or images loading above) moves the stack: measure again
  new ResizeObserver(() => (dirty = true)).observe(document.body)
  onScrollFrame(update)
  update()
}

/* ---------- The phone mockup: laid out at one real size, zoomed to the room in its card ---------- */

/** The phone's own size in rem (v5.css, .st-card .st-phone): 18 wide, 37 tall, or as short as 30 when room is short */
const PHONE = { w: 18, h: 37, minH: 30 }

/**
 * Sizes each card's phone to the room its card has: the body's height beside the site and the calls on wide
 * screens, the height left under the browser bar on narrow ones. The zoom (--phone-zoom) scales the whole
 * phone as one, frame, text and bubbles together, never more than 15% over its own size. Where the room is
 * short, the phone first gets a little shorter (--phone-h, down to 30rem) before it shrinks, so its text
 * stays readable on short laptop screens and phones.
 */
function fitPhones(stack: HTMLElement): void {
  const fit = (body: HTMLElement) => {
    const phone = qs('.st-phone', body)
    const siteEl = qs('.st-site', body)
    const log = qs('.st-log', body)
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const stacked = log.offsetHeight === 0 // below 1024px: just the browser bar above the phone
    const gap = parseFloat(getComputedStyle(body).rowGap) || 0
    const roomH = body.clientHeight - (stacked ? siteEl.offsetHeight + gap : 0)
    const roomW = stacked ? body.clientWidth : body.clientWidth * 0.34
    // As big as the width allows, then as tall as fits at that size, then smaller only if even 30rem won't fit
    let zoom = Math.min(roomW / (PHONE.w * rem), 1.15)
    const h = Math.min(Math.max(roomH / zoom / rem, PHONE.minH), PHONE.h)
    zoom = Math.max(Math.min(zoom, roomH / (h * rem)), 0.4)
    phone.style.setProperty('--phone-h', h.toFixed(3))
    phone.style.setProperty('--phone-zoom', zoom.toFixed(4))
  }
  const bodies = qsa('.st-body', stack)
  const observer = new ResizeObserver((entries) => entries.forEach((e) => fit(e.target as HTMLElement)))
  bodies.forEach((b) => {
    fit(b)
    observer.observe(b)
  })
}

export function storyV5(): Section {
  return {
    html: html(),
    init: () => {
      qsa('#problem [data-story]').forEach(initStory)
      fitPhones(qs('#problem .st-stack'))
      initStack(qs('#problem .st-stack'))
      initTagline()
    },
  }
}
