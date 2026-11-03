import './story.v3.css'
import type { Section } from '@/app/types.ts'
import { initTagline, problemHeading } from '@/pages/v2/sections/problem-heading.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'
import { logoMark } from '@/shared/ui/logo.ts'
import { callers, loopNote, scenes, site, type CallerId, type Line, type Scene, type SiteState } from '../v3.data.ts'

/*
 * Chapter 1 on v3, the problem told as a story (v3.data.ts has the script): the site goes down, you call your
 * hosting provider, the DevOps freelancer and your developers, each passes it on, then one call to VavenCloud
 * fixes it. A narration line runs above; a phone shows the night (the alerts, then each call as it's said); the
 * site's status and how long it has been down sit beside it, with the list of who you called and what they
 * said. The index underneath jumps to a scene; the button at its end pauses, plays and replays.
 *
 * Everything is placed on one timeline (ms from the start). Rendering a moment `t` sets data-on on every
 * [data-from] element whose time has come and whose data-to hasn't, and data-scene and data-site on the
 * stage; story.v3.css does the rest, so playing, pausing, jumping and replaying are all just "show t".
 * It plays once it's scrolled to and holds while off screen or in a background tab. The picture is hidden
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

const siteChanges: [number, SiteState][] = [[0, 'ok'], ...timeline.flatMap((s) => (s.site ?? []).map((c): [number, SiteState] => [s.start + c.at, c.state]))]
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
  return [{ id, dial: s.start, answered: abs(s.call.answered), missed: abs(s.call.missed), connected: s.call.connected, verdict: ends.start + ends.verdict! }]
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
const when = (from: number, to?: number) => `data-from="${Math.round(from)}"${to === undefined ? '' : ` data-to="${Math.round(to)}"`}`
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
    ...(c.answered !== undefined ? [['live', good ? 'On it' : 'On the line', c.answered, c.verdict] as [string, string, number, number]] : []),
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
            ${calls.filter((c) => c.id !== 'vaven').map(logRow).join('')}
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
    ...(c.answered !== undefined ? [['live', c.connected ?? 'Connected', c.answered, good ? undefined : c.verdict] as [string, string, number, number?]] : []),
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

const sceneTab = (s: Timed, i: number) => `
        <button type="button" class="st-scene" data-goto="${i}" aria-label="Scene ${i + 1}: ${s.tab}">
          <span class="st-scene-bar" aria-hidden="true"><i></i></span>
          <span class="st-scene-name" aria-hidden="true"><span class="st-scene-num">${pad(i + 1)}</span><span class="st-scene-label">${s.tab}</span></span>
        </button>`

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

const html = () => `
<section id="problem" class="v2-section" aria-labelledby="problem-title">
  <div class="container-page">
    ${problemHeading()}
    <div class="st" data-story data-scene="${timeline[0].id}" data-site="ok">
      <div class="st-window">
        ${narration()}
        <div class="st-body" aria-hidden="true">
          ${siteCard()}
          ${callList()}
          ${phone()}
        </div>
        <div class="st-foot">
          <div class="st-scenes" role="group" aria-label="Scenes">
            ${timeline.map(sceneTab).join('')}
          </div>
          <button type="button" class="st-control" data-control>
            <span data-icon="pause" hidden>${icon('pause', 'h-3 w-3', true)}</span><span data-icon="play">${icon('play', 'h-3 w-3', true)}</span>
            <span data-control-label>Play</span><span class="sr-only"> the story</span>
          </button>
        </div>
      </div>
    </div>
    ${transcript()}
  </div>
</section>`

/* ---------- Playing it ---------- */

function initStory(root: HTMLElement): void {
  const timed = qsa('[data-from]', root).map((el) => ({
    el,
    from: Number(el.dataset.from),
    to: el.dataset.to === undefined ? Infinity : Number(el.dataset.to),
    on: false,
  }))
  const tabs = qsa<HTMLButtonElement>('[data-goto]', root)
  const bars = tabs.map((b) => qs('.st-scene-bar i', b))
  const control = qs<HTMLButtonElement>('[data-control]', root)
  const controlLabel = qs('[data-control-label]', control)
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

  let t = 0
  const shown = { scene: -1, site: '', minute: -1 }

  const render = () => {
    const k = Math.max(
      timeline.findLastIndex((s) => t >= s.start),
      0,
    )
    if (k !== shown.scene) {
      shown.scene = k
      root.dataset.scene = timeline[k].id
      tabs.forEach((b, i) => b.setAttribute('aria-current', String(i === k)))
    }
    const state = siteAt(t)
    if (state !== shown.site) root.dataset.site = shown.site = state
    timed.forEach((x) => {
      const on = t >= x.from && t < x.to
      if (on === x.on) return
      x.on = on
      x.el.toggleAttribute('data-on', on)
    })
    bars.forEach((b, i) => {
      const s = timeline[i]
      b.style.transform = `scaleX(${Math.min(Math.max((t - s.start) / s.ms, 0), 1)})`
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

  let state: 'ready' | 'playing' | 'paused' | 'ended' = 'ready'
  const holds = new Set<string>()
  let frame = 0
  let last = 0

  const sync = () => {
    const playing = state === 'playing'
    root.classList.toggle('is-paused', !playing || holds.size > 0)
    controlLabel.textContent = playing ? 'Pause' : state === 'ended' ? 'Replay' : 'Play'
    qs('[data-icon="pause"]', control).hidden = !playing
    qs('[data-icon="play"]', control).hidden = playing
  }

  const tick = (now: number) => {
    // A frame's timestamp can be a little earlier than the moment play was pressed: never run backwards
    t = Math.min(t + Math.max(now - last, 0), END)
    last = now
    render()
    if (t >= END) {
      state = 'ended'
      sync()
      return
    }
    frame = requestAnimationFrame(tick)
  }

  /** Runs the clock while playing and nothing holds it */
  const run = () => {
    cancelAnimationFrame(frame)
    sync()
    if (state !== 'playing' || holds.size > 0) return
    last = performance.now()
    frame = requestAnimationFrame(tick)
  }
  const play = () => {
    if (state === 'ended') jump(0)
    state = 'playing'
    run()
  }
  const hold = (reason: string, on: boolean) => {
    if (on) holds.add(reason)
    else holds.delete(reason)
    run()
  }

  if (prefersReducedMotion()) {
    control.hidden = true
    jump(END)
    tabs.forEach((b, i) => b.addEventListener('click', () => jump(i === tabs.length - 1 ? END : timeline[i].start + timeline[i].ms - 1)))
    return
  }

  render()
  control.addEventListener('click', () => {
    if (state === 'playing') {
      state = 'paused'
      run()
    } else play()
  })
  tabs.forEach((b, i) =>
    b.addEventListener('click', () => {
      jump(timeline[i].start)
      state = 'playing'
      run()
    }),
  )
  document.addEventListener('visibilitychange', () => hold('hidden', document.hidden))
  // Plays the first time it reaches the middle of the screen; holds whenever it's out of view
  new IntersectionObserver(
    ([e]) => {
      hold('offscreen', !e.isIntersecting)
      if (e.isIntersecting && state === 'ready') play()
    },
    { rootMargin: '-30% 0px -30% 0px' },
  ).observe(root)
}

export function storyV3(): Section {
  return {
    html: html(),
    init: () => {
      initStory(qs('#problem [data-story]'))
      initTagline()
    },
  }
}
