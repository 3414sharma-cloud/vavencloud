import '@/pages/v3/sections/story.v3.css'
import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { initTagline, problemHeading } from '@/pages/v2/sections/problem-heading.ts'
import type { CallerId, Line, Scene, SiteState } from '@/pages/v3/v3.data.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
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
 * v5: the whole night in one card, one screen tall (initNight): a six-step timeline, the caption, and the site,
 * the calls and the phone. It plays through by itself, scene after scene, once it's on screen, and stays on how
 * it ended; clicking a timeline step plays from that scene. No play button, no pausing, and no extra scrolling:
 * the page scrolls past it like any other section. (It replaced a stack of six cards, which took about eleven
 * screens of scrolling, and a pinned version that still took more than a screen.) The picture is hidden from
 * screen readers; a list tells the same story. With reduced motion nothing plays: the end shows, and the
 * timeline shows the end of each scene.
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

/** The last moment a scene shows: the end of its scene (just before the next scene's screen takes over) */
const endOf = (s: Timed) => (s === lastScene ? END : s.start + s.ms - 1)

/**
 * The night's timeline across the top of the card: one step per scene, with the time it starts and its name. The
 * line over the current step fills as the scene plays; the steps before it are full. Clicking a step goes
 * to that scene.
 */
const timelineRail = () => `
        <div class="st-scenes" role="group" aria-label="The night, scene by scene">
          ${timeline
            .map(
              (s, i) => `
          <button type="button" class="st-scene" data-goto="${i}" aria-label="Scene ${i + 1}: ${s.tab}">
            <span class="st-scene-bar" aria-hidden="true"><i></i></span>
            <span class="st-scene-name" aria-hidden="true"><span class="st-scene-num">${timeAt(s.start)}</span><span class="st-scene-label">${s.tab}</span></span>
          </button>`,
            )
            .join('')}
        </div>`

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
    <div class="st-pin">
      <div class="st-stage">
        <article class="st st-card" data-story data-scene="${timeline[0].id}" data-site="ok">${timelineRail()}
          ${narration()}
          <div class="st-body" aria-hidden="true">
            ${siteCard()}
            ${callList()}
            ${phone()}
          </div>
        </article>
      </div>
    </div>
    ${transcript()}
    ${payoffBand()}
  </div>
</section>`

/* ---------- Playing it: one card, the whole night, by itself ---------- */

/**
 * The night plays through once, scene after scene, by itself, as soon as the card comes into view, and stays on
 * how it ended. Nothing is pinned and nothing needs scrolling: the card is one screen tall and the page scrolls
 * past it as usual. The timeline across the top shows where the night is and, when you click a step, plays it from
 * that scene on. With reduced motion nothing plays: the card shows how the night ended, and a step shows how its
 * scene ended.
 */
function initNight(pin: HTMLElement): void {
  const root = qs('.st-card', pin)
  const timed = qsa('[data-from]', root).map((el) => ({
    el,
    from: Number(el.dataset.from),
    to: el.dataset.to === undefined ? Infinity : Number(el.dataset.to),
    on: false,
  }))
  const steps = qsa<HTMLButtonElement>('[data-goto]', root)
  const bars = steps.map((b) => qs('.st-scene-bar i', b))
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
  const last = timeline.length - 1

  let t = 0
  let scene = -1
  let frame = 0
  let lastTick = 0
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

  /** Which scene a moment is in */
  const sceneAt = (ms: number) =>
    Math.max(
      timeline.findLastIndex((s) => ms >= s.start),
      0,
    )

  /** The timeline: the current step marked, the ones before it full, the ones after it empty */
  const paintTimeline = (k: number) => {
    steps.forEach((b, i) => b.setAttribute('aria-current', String(i === k)))
    bars.forEach((bar, i) => (bar.style.transform = `scaleX(${i < k ? 1 : 0})`))
  }

  /** The night moves on to scene `k` */
  const enter = (k: number) => {
    scene = k
    root.dataset.scene = timeline[k].id
    paintTimeline(k)
    root.classList.remove('is-swap')
    void root.offsetWidth
    root.classList.add('is-swap') // the site, the calls and the phone settle in again (v5.css)
  }

  const tick = (now: number) => {
    // A frame's timestamp can be a little earlier than the moment it started: never run backwards
    t = Math.min(t + Math.max(now - lastTick, 0), END)
    lastTick = now
    render()
    const k = sceneAt(t)
    if (k !== scene) enter(k)
    const s = timeline[scene]
    bars[scene].style.transform = `scaleX(${Math.min((t - s.start) / s.ms, 1)})`
    if (t < END) frame = requestAnimationFrame(tick)
  }

  /** Play the night from a moment on, through to the end */
  const play = (from: number) => {
    cancelAnimationFrame(frame)
    root.classList.remove('is-paused')
    jump(from)
    enter(sceneAt(from))
    lastTick = performance.now()
    frame = requestAnimationFrame(tick)
  }

  // With reduced motion: nothing plays. The card shows how the night ended, and a step shows how its scene ended
  if (prefersReducedMotion()) {
    const showEnd = (k: number) => {
      scene = k
      root.dataset.scene = timeline[k].id
      paintTimeline(k)
      jump(endOf(timeline[k]))
      bars[k].style.transform = 'scaleX(1)'
    }
    steps.forEach((b, i) => b.addEventListener('click', () => showEnd(i)))
    showEnd(last)
    return
  }

  jump(0)
  paintTimeline(0)
  root.classList.add('is-paused') // the ringing and typing wait until the night starts
  steps.forEach((b, i) => b.addEventListener('click', () => play(timeline[i].start)))

  // The night starts the first time the card is well on screen
  const seen = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return
      seen.disconnect()
      play(0)
    },
    { rootMargin: '-30% 0px -30% 0px' },
  )
  seen.observe(root)
}

/* ---------- The phone mockup: laid out at one real size, zoomed to the room in its card ---------- */

/** The phone's own size in rem (v5.css, .st-card .st-phone): 18 wide, 37 tall, or as short as 30 when room is short */
const PHONE = { w: 16, h: 30, minH: 26 }

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
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const stacked = matchMedia('(max-width: 1023px)').matches // below 1024px: one column, the card grows to fit
    const gap = parseFloat(getComputedStyle(body).rowGap) || 0
    const roomH = body.clientHeight - (stacked ? siteEl.offsetHeight + gap : 0)
    const roomW = stacked ? body.clientWidth : body.clientWidth * 0.34
    if (stacked) {
      // The card is as tall as its content here, so the phone is sized to the width (up to 130%), at its full height
      phone.style.setProperty('--phone-h', String(PHONE.h))
      phone.style.setProperty('--phone-zoom', Math.min((roomW * 0.94) / (PHONE.w * rem), 1.3).toFixed(4))
      return
    }
    // As big as the width allows, then as tall as fits at that size, then smaller only if even 30rem won't fit
    let zoom = Math.min(roomW / (PHONE.w * rem), 1)
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
      fitPhones(qs('#problem .st-pin'))
      initNight(qs('#problem .st-pin'))
      initTagline()
    },
  }
}
