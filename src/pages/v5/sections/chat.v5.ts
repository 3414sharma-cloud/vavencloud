import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { initTagline, problemHeading } from '@/pages/v2/sections/problem-heading.ts'
import type { CallerId, Line, Scene } from '@/pages/v3/v3.data.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'
import { logoMark } from '@/shared/ui/logo.ts'
import { callers, loopNote, payoff, scenes } from '../v5.data.ts'

/*
 * The problem as a chat (replaces the phone-and-timeline story in story.v5.ts on this page).
 * Left: the night's six steps (time, what happened, how long it took) and a running total of how long the site
 * has been down, minutes lost chasing vendors and minutes to fix. Right: one chat window of fixed height where
 * the night plays out message by message, scrolling itself to the newest. The step being played is lit on the
 * left; clicking a step jumps the chat to it. Without script or with reduced motion the whole chat shows and
 * the totals show the end of the night. The copy is the same script as before (v5.data.ts).
 */

/** 14 → "02:14" (minutes past 02:00) */
const clock = (m: number) => `${String(2 + Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
const startMinute = (s: Scene) => s.clock[0][1]
const endMinute = (s: Scene) => s.clock[s.clock.length - 1][1]

const byId = (id: string) => scenes.find((s) => s.id === id)!
const crash = byId('crash')
const vaven = byId('vaven')
const fixed = byId('fixed')
const crashMin = startMinute(crash)
const callMin = startMinute(vaven)
const upMin = endMinute(fixed)

/** The steps, in order, with the minute each starts and how many minutes it took */
const steps = scenes.map((s, i) => {
  const next = scenes[i + 1]
  return { scene: s, start: startMinute(s), took: (next ? startMinute(next) : endMinute(s)) - startMinute(s) }
})

let step = 0
/** One row of the thread, tagged with the step it belongs to */
const row = (cls: string, inner: string) => `<li class="ch-item ${cls}" data-step="${step}">${inner}</li>`

const avatar = (id: CallerId) =>
  `<span class="ch-avatar${id === 'vaven' ? ' ch-avatar--vaven' : ''}">${id === 'vaven' ? logoMark(20, 'ch-mark') : icon(callers[id].icon!, 'h-4 w-4')}</span>`

const message = (l: Line, good: boolean) => {
  if ('you' in l) return row('ch-you', `<p class="ch-bubble ch-bubble--you">${l.you}</p>`)
  if ('note' in l) return row('ch-note', `<p>${l.note.replace(' {time}', '')}</p>`)
  return row('ch-them', `<p class="ch-bubble${good ? ' ch-bubble--good' : ''}">${l.them}</p>`)
}

const verdict = (id: CallerId) => {
  const good = id === 'vaven'
  return row(
    'ch-verdict',
    `<span class="ch-pill" data-tone="${good ? 'good' : 'bad'}">${icon(good ? 'check' : 'x', 'h-3.5 w-3.5')}${callers[id].verdict}</span>`,
  )
}

const callHead = (id: CallerId, minute: number) =>
  row(
    `ch-call${id === 'vaven' ? ' ch-call--vaven' : ''}`,
    `${avatar(id)}<span class="ch-call-who"><b>${callers[id].name}</b><span>${callers[id].role}</span></span><time class="ch-time">${clock(minute)}</time>`,
  )

/** The rows of one step */
const stepRows = (s: Scene) => {
  if (s.id === 'crash')
    return (s.alerts ?? [])
      .map((a) =>
        row(
          'ch-alert',
          `<span class="ch-alert-icon" data-tone="${a.tone}">${icon(a.icon, 'h-4 w-4')}</span><span class="min-w-0"><b>${a.app}</b> · ${a.title}<span class="ch-alert-text">${a.text}</span></span>`,
        ),
      )
      .join('')
  if (s.id === 'fixed') return (s.lines ?? []).map((l) => message(l, true)).join('') + verdict('vaven')
  const id = s.screen as CallerId
  const good = id === 'vaven'
  return (
    callHead(id, startMinute(s)) +
    (s.lines ?? []).map((l) => message(l, good)).join('') +
    (good ? '' : verdict(id)) +
    (s.loop !== undefined ? row('ch-loop', `<p>${loopNote}</p>`) : '')
  )
}

const thread = () =>
  steps
    .map((x, i) => {
      step = i
      return stepRows(x.scene)
    })
    .join('')

/** What each step says beside its name: minutes lost on a vendor, or the fix */
const stepNote = (x: (typeof steps)[number]) => {
  const id = x.scene.id
  if (id === 'crash') return { tone: 'bad', text: 'Site down' }
  if (id === 'fixed') return { tone: 'good', text: `Back up at ${clock(upMin)}` }
  if (id === 'vaven') return { tone: 'good', text: `${x.took} min, found it` }
  return { tone: 'bad', text: `${x.took} min, no fix` }
}

const rail = () => `
      <div class="ch-side">
        <ol class="ch-steps" aria-label="The night, step by step">
          ${steps
            .map((x, i) => {
              const note = stepNote(x)
              return `
          <li><button type="button" class="ch-step" data-goto="${i}">
            <span class="ch-step-dot" aria-hidden="true"></span>
            <span class="ch-step-time">${clock(x.start)}</span>
            <span class="ch-step-name">${x.scene.tab}</span>
            <span class="ch-step-note" data-tone="${note.tone}">${note.text}</span>
          </button></li>`
            })
            .join('')}
        </ol>
        <dl class="ch-totals">
          <div><dt>Site down for</dt><dd><b data-total-down>${upMin - crashMin}</b> min</dd></div>
          <div data-tone="bad"><dt>Lost chasing vendors</dt><dd><b data-total-lost>${callMin - crashMin}</b> min</dd></div>
          <div data-tone="good"><dt>To fix, after one call</dt><dd><b data-total-fix>${upMin - callMin}</b> min</dd></div>
        </dl>
      </div>`

const chatWindow = () => `
      <div class="ch-window">
        <div class="ch-bar">
          <span class="ch-dot"></span>
          <span class="ch-bar-title">Tonight · <span data-now>${clock(crashMin)}</span></span>
          <span class="ch-bar-status">yourapp.com/checkout is down</span>
        </div>
        <ol class="ch-thread">${thread()}
        </ol>
      </div>`

const payoffBand = () => `
    <div class="v4-payoff surface-ink" data-reveal>
      <div>
        <p class="v4-payoff-big"><span class="v4-payoff-lost">${callMin - crashMin} minutes</span> chasing vendors.<br /><span class="v4-payoff-fix">${upMin - callMin} minutes</span> to fix.</p>
        <p class="v4-payoff-text">${payoff.text}</p>
      </div>
      <div class="v4-payoff-cta">
        <p class="v4-payoff-q">${payoff.question}</p>
        <a href="${routes.book}" class="btn-primary !px-7 !py-3.5 !text-base">Book a free production review ${icon('arrow-right', 'h-4 w-4')}</a>
        <p class="v4-payoff-note">${payoff.note}</p>
      </div>
    </div>`

/** How long each row waits before the next one arrives (ms) */
const PACE = 650

/**
 * The night plays the first time the chat is well on screen: rows arrive one by one at the foot of the window
 * and the thread scrolls to them. The step they belong to lights up on the left (the ones before it are done)
 * and the totals count up to that step. Clicking a step shows everything before it at once and plays on from
 * there. Rows not yet arrived take no room.
 */
function initChat(): void {
  const root = qs('#problem .ch-layout')
  const list = qs('.ch-thread', root)
  const rows = qsa('.ch-item', list)
  const buttons = qsa<HTMLButtonElement>('[data-goto]', root)
  const now = qs('[data-now]', root)
  const out = {
    down: qs('[data-total-down]', root),
    lost: qs('[data-total-lost]', root),
    fix: qs('[data-total-fix]', root),
  }

  /*
   * The line joining the step dots, and the blue fill along it (v5.css, .ch-steps::before and ::after). The
   * line runs from the first dot's centre to the last's; the fill reaches the current step's dot and then on
   * toward the next one as that step's messages arrive (`frac`, 0 to 1).
   */
  const strip = qs('.ch-steps', root)
  const dots = buttons.map((b) => qs('.ch-step-dot', b))
  const centre = (el: HTMLElement) => {
    const r = el.getBoundingClientRect()
    return r.top + r.height / 2 - strip.getBoundingClientRect().top
  }
  let at = { k: 0, frac: 0 }
  const paintLine = () => {
    const ys = dots.map(centre)
    const top = ys[0]
    const last = ys[ys.length - 1]
    const k = Math.min(at.k, ys.length - 1)
    const to = k >= ys.length - 1 ? last : ys[k] + (ys[k + 1] - ys[k]) * at.frac
    strip.style.setProperty('--line-top', `${top}px`)
    const d = dots[0].getBoundingClientRect()
    strip.style.setProperty('--line-x', `${d.left + d.width / 2 - strip.getBoundingClientRect().left - 1}px`)
    strip.style.setProperty('--line-h', `${last - top}px`)
    strip.style.setProperty('--fill-h', `${Math.max(to - top, 0)}px`)
  }
  new ResizeObserver(paintLine).observe(strip)
  const progress = (k: number, frac: number) => {
    at = { k, frac }
    paintLine()
  }

  /** Light step k and show the totals as they stand at its end */
  const mark = (k: number) => {
    buttons.forEach((b, i) => {
      b.toggleAttribute('data-current', i === k)
      b.toggleAttribute('data-done', i < k)
      if (i === k) b.setAttribute('aria-current', 'step')
      else b.removeAttribute('aria-current')
    })
    // Phones and tablets: the steps are a row of chips; keep the current one in view (sideways only)
    if (strip.scrollWidth > strip.clientWidth) {
      const chip = buttons[k].parentElement!
      strip.scrollTo({ left: chip.offsetLeft - 16, behavior: 'smooth' })
    }
    const s = steps[k]
    const m = s.start + s.took
    now.textContent = clock(s.start)
    out.down.textContent = String(Math.min(m, upMin) - crashMin)
    out.lost.textContent = String(Math.min(m, callMin) - crashMin)
    out.fix.textContent = String(Math.max(Math.min(m, upMin) - callMin, 0))
  }

  if (prefersReducedMotion()) {
    mark(steps.length - 1)
    progress(steps.length - 1, 1)
    buttons.forEach((b, i) =>
      b.addEventListener('click', () => {
        const first = rows.find((r) => Number(r.dataset.step) === i)
        if (first) list.scrollTo({ top: first.offsetTop - list.offsetTop - 12 })
      }),
    )
    return
  }

  root.classList.add('is-waiting')
  mark(0)
  progress(0, 0)
  let i = 0
  let timer = 0

  /*
   * Following the newest message: every frame the thread eases a little of the way to its foot, so a new
   * message (and the height it adds) is glided to, never jumped to. Scrolling up to read stops the follow;
   * coming back down to the foot picks it up again.
   */
  let follow = true
  let frame = 0
  let pos = 0 // where the glide last put the thread; the reader scrolling up moves it above this
  const bottom = () => list.scrollHeight - list.clientHeight
  const set = (top: number) => {
    pos = top
    list.scrollTop = top
  }
  const glide = () => {
    frame = 0
    if (!follow) return
    const gap = bottom() - pos
    if (gap < 0.5) {
      set(bottom())
      if (i < rows.length) frame = requestAnimationFrame(glide) // keep going while messages still arrive
      return
    }
    set(pos + Math.max(gap * 0.1, 0.6))
    frame = requestAnimationFrame(glide)
  }
  const startGlide = () => {
    if (!frame) frame = requestAnimationFrame(glide)
  }
  /*
   * The reader takes over the moment they reach for it (wheel up, a finger on it, a key), before the browser's
   * own scroll has moved anything: setting scrollTop every frame would otherwise cancel their scroll as it starts.
   * Back at the foot, the follow picks up again.
   */
  const release = () => (follow = false)
  const resumeIfAtFoot = () => {
    if (follow || bottom() - list.scrollTop >= 24) return
    follow = true
    pos = list.scrollTop
    startGlide()
  }
  list.addEventListener('wheel', (e) => e.deltaY < 0 && release(), { passive: true })
  list.addEventListener('touchstart', release, { passive: true })
  list.addEventListener('touchend', () => setTimeout(resumeIfAtFoot, 400), { passive: true })
  list.addEventListener('keydown', release)
  list.addEventListener('scroll', () => {
    if (follow && list.scrollTop < pos - 6) release()
    else resumeIfAtFoot()
  })

  const next = () => {
    const r = rows[i++]
    if (!r) return
    r.classList.add('is-shown')
    const k = Number(r.dataset.step)
    mark(k)
    // The fill creeps toward the next step as this one's messages arrive
    const own = rows.filter((x) => Number(x.dataset.step) === k)
    progress(k, (own.indexOf(r) + 1) / own.length)
    startGlide()
    timer = window.setTimeout(next, r.classList.contains('ch-call') ? PACE * 0.6 : PACE)
  }

  /** Jump to step k: everything before it shown at once, then play on from its first row */
  const goto = (k: number) => {
    clearTimeout(timer)
    started = true
    seen.disconnect()
    const first = rows.findIndex((r) => Number(r.dataset.step) === k)
    rows.forEach((r, j) => {
      r.classList.toggle('is-shown', j < first)
      r.classList.toggle('is-instant', j < first) // rows from here on play in again
    })
    i = first
    set(bottom())
    follow = true
    next()
  }
  buttons.forEach((b, k) => b.addEventListener('click', () => goto(k)))

  // Starts once, either when the chat comes on screen or when a step is clicked first
  let started = false
  const seen = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting || started) return
      started = true
      seen.disconnect()
      next()
    },
    { rootMargin: '0px 0px -30% 0px' },
  )
  seen.observe(root)
}

export function chatV5(): Section {
  return {
    html: `
<section id="problem" class="v2-section v4-story" aria-labelledby="problem-title">
  <div class="container-page">
    <div class="v4-problem-head">${problemHeading()}</div>
    <div class="ch-layout">${rail()}${chatWindow()}
    </div>
    ${payoffBand()}
  </div>
</section>`,
    init: () => {
      initChat()
      initTagline()
    },
  }
}
