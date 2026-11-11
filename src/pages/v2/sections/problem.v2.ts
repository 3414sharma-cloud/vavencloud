import './problem.v2.css'
import type { Section } from '@/app/types.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'
import { downAt, fixSteps, vavenCall, vendorCalls, type Call } from '../v2.data.ts'
import { initTagline, problemHeading } from './problem-heading.ts'

/*
 * Chapter 1, the problem, played as a live example (the live landing page's "Who do you call?", in v2's
 * design). Checkout breaks at 02:14 and you start calling. A string runs from your phone to each supplier in
 * turn, while the ones you haven't tried yet wait, faded. Each call goes nowhere, so its string turns red and
 * is cut with a ✗. Then you call VavenCloud: the string holds, with a ✓, the engineer's messages appear on its
 * card, and checkout comes back. A clock, a "down for" counter and a bar of where the time went (calling
 * suppliers, then fixing) run the whole time. The heading (problem-heading.ts) gives the answer up front.
 *
 * It plays once when it comes into view, and "Replay" plays it again. The strings are drawn in an SVG laid
 * over the cards and measured again whenever the layout changes: across from the phone on wide screens, down
 * the left side on narrow ones. State lives in data attributes (problem.v2.css): [data-phase] on the example
 * (ready → calling → fixing → done) and [data-state] on each call. The picture is hidden from screen readers;
 * a list tells the same story. With reduced motion it shows the end straight away.
 */

type Phase = 'ready' | 'calling' | 'fixing' | 'done'

const calls: Call[] = [...vendorCalls, vavenCall]
const fixedAt = fixSteps[fixSteps.length - 1].at
const lost = vavenCall.dial - downAt
const fixMinutes = fixedAt - vavenCall.dial
const total = fixedAt - downAt

/** Minutes past 02:00 as a clock time: 14 → "02:14", 80 → "03:20" */
const clockTime = (min: number) => {
  const m = Math.round(min)
  return `${String(2 + Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}
const callee = (c: Call) => c.name.replace(/^Your /, 'your ')

/** The VavenCloud mark (the logo's V) */
const mark = (size: number) => `<img src="/favicon.png" alt="" width="${size}" height="${size}" class="pc-mark" />`

/** Texts that share one spot, each shown in the phases it names, so the box never changes size */
const byPhase = (texts: [string, string][]) =>
  texts.map(([phases, text]) => `<span class="[grid-area:1/1]" data-when="${phases}">${text}</span>`).join('')

const appCard = () => `
      <div class="pc-app" data-app>
        <div class="flex items-center justify-between gap-3">
          <span class="pc-url">yourapp.com/checkout</span>
          <span class="pc-app-chip">${byPhase([
            ['ready calling', '● Down'],
            ['fixing', 'Engineer on it'],
            ['done', '● Fixed'],
          ])}</span>
        </div>
        <p class="pc-app-name">Checkout</p>
        <p class="pc-app-status">${byPhase([
          ['ready calling', 'Error 504 · customers can’t pay'],
          ['fixing', 'An engineer is fixing it'],
          ['done', 'Fast again · customers can pay'],
        ])}</p>
        <div class="pc-app-time">
          <p class="pc-small">Down for</p>
          <p class="pc-app-down" data-down>0 min</p>
          <div class="pc-bar"><span class="pc-bar-lost" data-bar-lost></span><span class="pc-bar-fix" data-bar-fix></span></div>
          <div class="pc-legend">
            <span><i class="pc-dot-lost"></i><span><span data-lost>0</span> min calling suppliers</span></span>
            <span class="pc-legend-fix"><i class="pc-dot-fix"></i><span><span data-fix>0</span> min to fix</span></span>
          </div>
        </div>
        <div class="pc-dialer" data-anchor>
          <span class="pc-dialer-icon">${icon('phone', 'h-4 w-4')}</span><span class="truncate" data-dialer>Who do you call?</span>
        </div>
      </div>`

/** The engineer's messages on VavenCloud's card, each opening up after a moment of typing */
const fixThread = () => `
            <ol>
              ${fixSteps
                .map(
                  (s, i) => `
              <li class="pc-fix-step" data-fix-step>
                <div class="min-h-0 overflow-hidden">
                  <div class="grid pt-2">
                    <span class="pc-fix-typing [grid-area:1/1]"><i></i><i></i><i></i></span>
                    <p class="pc-fix-text [grid-area:1/1]"><span class="pc-fix-time">${clockTime(s.at)}</span><span class="${i === fixSteps.length - 1 ? 'pc-fix-done' : 'pc-fix-msg'}">${s.text}</span></p>
                  </div>
                </div>
              </li>`,
                )
                .join('')}
            </ol>`

const contact = (c: Call) => {
  const vaven = c === vavenCall
  const vendor = vendorCalls.find((v) => v.id === c.id)
  return `
        <li class="pc-contact${vaven ? ' pc-contact--vaven' : ''}" data-contact="${c.id}" data-state="idle">
          <span class="pc-contact-icon">${vendor ? icon(vendor.icon, 'h-4.5 w-4.5') : mark(28)}</span>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <span class="pc-contact-name">${c.name}</span>
              <span class="pc-contact-chip">
                <span class="pc-chip-calling">Calling…</span>
                <span class="pc-chip-verdict">${icon(vaven ? 'check' : 'x', 'h-3 w-3')}${c.verdict}</span>
              </span>
            </div>
            <p class="pc-contact-role">${c.role}</p>
            <p class="pc-contact-reply">${c.reply}</p>
            ${vaven ? fixThread() : ''}
          </div>
        </li>`
}

const stage = () => `
  <div class="pc" data-calls data-phase="ready">
    <div class="pc-window">
      <div class="pc-body" data-calls-body aria-hidden="true">
        <svg class="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          ${calls.map((c) => `<g data-wire="${c.id}" data-state="idle"><path class="pc-wire-guide"></path><path class="pc-wire"></path><path class="pc-wire-flow"></path></g>`).join('')}
        </svg>
        ${appCard()}
        <div class="hidden lg:block"></div>
        <ol class="pc-list" data-calls-list>
          ${calls.map(contact).join('')}
        </ol>
        ${calls.map((c) => `<span class="pc-wire-badge" data-badge="${c.id}" data-state="idle">${icon(c === vavenCall ? 'check' : 'x', 'h-3.5 w-3.5')}</span>`).join('')}
      </div>

      <div class="pc-foot">
        <p class="pc-summary" aria-hidden="true">${byPhase([
          ['ready calling', `${clockTime(downAt)} · Checkout is down. Who do you call?`],
          ['fixing', 'One call, answered. An engineer is fixing it now.'],
          [
            'done',
            `${lost} minutes on three calls that went nowhere. One call to VavenCloud: fixed ${fixMinutes} minutes later, with a written report in your portal.`,
          ],
        ])}</p>
        <div class="pc-controls">
          <span class="pc-clock" aria-hidden="true">Tonight <b data-clock>${clockTime(downAt)}</b></span>
          <button type="button" class="btn-primary pc-play" data-calls-btn>${icon('play', 'h-3.5 w-3.5', true)}<span data-calls-label>Play</span><span class="sr-only"> the example</span></button>
        </div>
      </div>
    </div>
  </div>
  <ol class="sr-only">
    <li>At ${clockTime(downAt)} checkout goes down.</li>
    ${calls.map((c) => `<li>You call ${callee(c)}. ${c.reply} ${c.verdict}.</li>`).join('')}
    ${fixSteps.map((s) => `<li>${clockTime(s.at)}: ${s.text}</li>`).join('')}
    <li>${lost} minutes went on three calls that went nowhere. One call to VavenCloud, and checkout was fixed ${fixMinutes} minutes later.</li>
  </ol>`

const html = () => `
<section id="problem" class="v2-section" aria-labelledby="problem-title">
  <div class="container-page">
    ${problemHeading()}
    ${stage()}
  </div>
</section>`

function initCalls(): void {
  const root = qs('[data-calls]')
  const body = qs('[data-calls-body]', root)
  const btn = qs<HTMLButtonElement>('[data-calls-btn]', root)
  const label = qs('[data-calls-label]', btn)
  const clock = qs('[data-clock]', root)
  const down = qs('[data-down]', root)
  const barLost = qs('[data-bar-lost]', root)
  const barFix = qs('[data-bar-fix]', root)
  const lostEl = qs('[data-lost]', root)
  const fixEl = qs('[data-fix]', root)
  const dialer = qs('[data-dialer]', root)
  const anchor = qs('[data-anchor]', root)
  const app = qs('[data-app]', root)
  const fixRows = qsa('[data-fix-step]', root)
  const wide = window.matchMedia('(min-width: 1024px)')
  const parts = calls.map((c) => ({
    call: c,
    card: qs(`[data-contact="${c.id}"]`, root),
    wire: qs<SVGGElement>(`[data-wire="${c.id}"]`, root),
    paths: qsa<SVGPathElement>('path', qs(`[data-wire="${c.id}"]`, root)),
    badge: qs(`[data-badge="${c.id}"]`, root),
  }))
  const vaven = parts.length - 1

  /** Each string: from the phone to the card's left edge. --len is its length, --cut where the ✗ or ✓ sits. */
  const layout = () => {
    const box = body.getBoundingClientRect()
    const a = anchor.getBoundingClientRect()
    const appBox = app.getBoundingClientRect()
    parts.forEach(({ card, wire, paths, badge }) => {
      const r = card.getBoundingClientRect()
      const ex = r.left - box.left
      const ey = r.top + r.height / 2 - box.top
      let d: string
      if (wide.matches) {
        const sx = a.right - box.left
        const sy = a.top + a.height / 2 - box.top
        const bend = (ex - sx) / 2
        d = `M ${sx} ${sy} C ${sx + bend} ${sy}, ${ex - bend} ${ey}, ${ex} ${ey}`
      } else {
        // Down the left side from the bottom of the app card, then in to the card
        const x = appBox.left - box.left + 18
        d = `M ${x} ${appBox.bottom - box.top} V ${ey - 12} Q ${x} ${ey} ${x + 12} ${ey} H ${ex}`
      }
      paths.forEach((p) => p.setAttribute('d', d))
      const len = paths[0].getTotalLength()
      const cut = wide.matches ? len / 2 : len - 16
      const point = paths[0].getPointAtLength(cut)
      wire.style.setProperty('--len', `${len}px`)
      wire.style.setProperty('--cut', `${cut}px`)
      badge.style.left = `${point.x}px`
      badge.style.top = `${point.y}px`
    })
  }
  layout()
  // VavenCloud's card grows as the engineer's messages come in, so the cards move: follow them
  const ro = new ResizeObserver(layout)
  ro.observe(body)
  ro.observe(qs('[data-calls-list]', root))
  void document.fonts?.ready.then(layout)

  const setPhase = (phase: Phase) => (root.dataset.phase = phase)
  const setState = (i: number, state: 'idle' | 'calling' | 'failed' | 'connected') => {
    const p = parts[i]
    p.card.dataset.state = state
    p.wire.dataset.state = state
    p.badge.dataset.state = state
  }

  // The clock, the "down for" counter and the bar of where the time went all move together
  let minute = downAt
  let frame = 0
  const showMinute = (m: number) => {
    minute = m
    const calling = Math.max(Math.min(m, vavenCall.dial) - downAt, 0)
    const fixing = Math.max(m - vavenCall.dial, 0)
    clock.textContent = clockTime(m)
    down.textContent = `${Math.round(m - downAt)} min`
    barLost.style.width = `${(calling / total) * 100}%`
    barFix.style.width = `${(fixing / total) * 100}%`
    lostEl.textContent = String(Math.round(calling))
    fixEl.textContent = String(Math.round(fixing))
  }
  const runClock = (to: number, ms: number) => {
    cancelAnimationFrame(frame)
    const from = minute
    const t0 = performance.now()
    const step = (now: number) => {
      // A frame can be stamped a little before t0: never run the clock backwards
      const k = Math.min(Math.max((now - t0) / ms, 0), 1)
      showMinute(from + (to - from) * k)
      if (k < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
  }

  const timers: number[] = []
  const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))
  let started = false

  const reset = () => {
    timers.splice(0).forEach((t) => window.clearTimeout(t))
    cancelAnimationFrame(frame)
    // Jump back without playing every transition in reverse
    root.classList.add('is-resetting')
    parts.forEach((_, i) => setState(i, 'idle'))
    fixRows.forEach((row) => delete row.dataset.stepState)
    void root.offsetWidth
    root.classList.remove('is-resetting')
    setPhase('ready')
    showMinute(downAt)
    dialer.textContent = 'Who do you call?'
  }

  /** Ring someone: the string draws out and the clock runs while it rings */
  const ring = (i: number, ms: number) => {
    setState(i, 'calling')
    dialer.textContent = `Calling ${callee(parts[i].call)}…`
    runClock(parts[i].call.end, ms)
  }

  const answered = () => {
    setState(vaven, 'connected')
    setPhase('fixing')
    dialer.textContent = `Connected to ${vavenCall.name}`
  }

  const end = () => {
    setPhase('done')
    btn.disabled = false
    label.textContent = 'Replay'
  }

  const play = () => {
    started = true
    reset()
    setPhase('calling')
    btn.disabled = true
    label.textContent = 'Playing…'
    let t = 400
    vendorCalls.forEach((_, i) => {
      at(t, () => ring(i, 2000))
      at(t + 2000, () => setState(i, 'failed'))
      t += 2450
    })
    at(t, () => ring(vaven, 1100))
    at(t + 1100, answered)
    t += 1700
    // The engineer types, then each message lands; the clock runs on to the fix
    fixRows.forEach((row, k) => {
      at(t, () => {
        row.dataset.stepState = 'typing'
        runClock(fixSteps[k].at, 1600)
      })
      at(t + 1600, () => (row.dataset.stepState = 'in'))
      t += 2100
    })
    at(t - 400, end)
  }

  if (prefersReducedMotion()) {
    parts.forEach((_, i) => setState(i, i === vaven ? 'connected' : 'failed'))
    fixRows.forEach((row) => (row.dataset.stepState = 'in'))
    answered()
    showMinute(fixedAt)
    end()
    btn.hidden = true
    return
  }

  btn.addEventListener('click', play)
  const io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      if (!started) at(500, play)
    },
    { threshold: 0.45 },
  )
  io.observe(root)
}

export function problemV2(): Section {
  return {
    html: html(),
    init: () => {
      initCalls()
      initTagline()
    },
  }
}
