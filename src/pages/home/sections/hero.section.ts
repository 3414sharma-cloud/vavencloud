import './hero.css'
import type { Section } from '@/app/types.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'
import { hero, outage, trustStrip } from './hero.data.ts'

/*
 * Hero: a big centred headline, then a small interactive stage that PROVES the headline.
 * Visitors press "Break my app" (it also plays once by itself when scrolled into view) and watch:
 * the example app goes down → three vendors each say "not me" → one call → an engineer fixes it,
 * live, with a timer. Everything on the stage is an example (roles, an .example domain, no invented
 * customers). The visuals are hidden from screen readers; the button and a short status line are not.
 */

const BARS = 24
const HOT_FROM = 16
/** Fixed shape so the response-time chart looks the same on every load */
const shape = [0.42, 0.3, 0.5, 0.36, 0.46, 0.28, 0.4, 0.52, 0.34, 0.44, 0.3, 0.48, 0.38, 0.26, 0.5, 0.4, 0.6, 0.85, 1, 0.9, 0.75, 1, 0.8, 0.95]
const heightOf = (i: number, heat: number) => 14 + shape[i] * 26 + (i >= HOT_FROM ? heat * shape[i] * 52 : 0)

const toneDot = { alert: 'bg-rose-500', work: 'bg-amber-500', done: 'bg-emerald-500' }
const ms = (n: number) => `${Math.round(n).toLocaleString('en-US')}`

const pill = (forStates: string, text: string) => `<span class="hs-pill" data-for="${forStates}"><i class="hs-pill-dot"></i>${text}</span>`

const checkout = () => `
  <div class="hs-checkout flex flex-col rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
    <div class="flex items-center gap-2 border-b border-neutral-200 px-4 py-2.5 dark:border-neutral-800">
      <span class="flex gap-1.5"><i class="h-2.5 w-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700"></i><i class="h-2.5 w-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700"></i><i class="h-2.5 w-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700"></i></span>
      <span class="ml-2 truncate rounded-full bg-neutral-100 px-3 py-1 font-mono text-[11px] text-neutral-500 dark:bg-neutral-900">https://${outage.url}/checkout</span>
    </div>

    <div class="relative p-5">
      <span class="hs-toast hs-toast--bad">${icon('x', 'h-3.5 w-3.5')} Error 504</span>
      <span class="hs-toast hs-toast--good">${icon('check', 'h-3.5 w-3.5')} Fast again</span>
      <p class="text-sm font-semibold text-neutral-950 dark:text-white">Checkout</p>
      <div class="mt-4 space-y-3 text-sm">
        <div class="flex items-center justify-between gap-4"><span class="text-neutral-600 dark:text-neutral-400">Pro plan, annual</span><span class="font-medium text-neutral-950 tabular-nums dark:text-white">$240</span></div>
        <div class="flex items-center justify-between gap-4"><span class="text-neutral-600 dark:text-neutral-400">Extra seats × 3</span><span class="font-medium text-neutral-950 tabular-nums dark:text-white">$90</span></div>
        <div class="hs-skel h-2 w-2/3"></div>
      </div>
      <div class="hs-pay mt-5 rounded-full bg-linear-to-b from-brand-500 to-brand-600 py-2.5 text-center text-sm font-medium text-white shadow-[0_8px_18px_-8px_rgba(49,87,179,0.7)]">Pay $330</div>
    </div>

    <div class="border-t border-neutral-200 px-5 py-4 dark:border-neutral-800">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs text-neutral-500">Checkout response time</p>
          <p class="mt-0.5"><span class="hs-latency text-3xl font-semibold tracking-tight tabular-nums" data-latency>${ms(outage.baseLatency)}</span> <span class="text-sm text-neutral-500">ms</span></p>
        </div>
        ${pill('calm', 'Healthy')}${pill('down calling', 'Down')}${pill('fixing', 'Being fixed')}${pill('resolved', 'Fixed')}
      </div>
      <div class="mt-4 flex h-12 items-end gap-[3px]">
        ${Array.from({ length: BARS }, (_, i) => `<span class="hs-bar" style="--d:${i};height:${heightOf(i, 0)}%"></span>`).join('')}
      </div>
      <div class="mt-1.5 flex justify-between text-[11px] text-neutral-400"><span>Last 24 checks</span><span>Now</span></div>
    </div>
  </div>`

const calmScene = () => `
  <div class="hs-scene hs-scene--calm flex flex-col justify-center">
    <span class="hs-okring inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">${icon('check', 'h-6 w-6')}</span>
    <h3 class="mt-5 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">Your app is running fine.</h3>
    <p class="mt-2 max-w-sm leading-relaxed">That’s easy to say at noon. Press the button and see what happens at ${outage.clock} on a night when it isn’t.</p>
    <ul class="mt-6 flex flex-wrap gap-2 text-sm">
      ${['Monitoring on', 'Backup tonight at 02:00', 'Engineer on call'].map((c) => `<li class="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3.5 py-1.5 dark:border-neutral-800"><i class="h-1.5 w-1.5 rounded-full bg-emerald-500"></i>${c}</li>`).join('')}
    </ul>
  </div>`

const incidentScene = () => `
  <div class="hs-scene hs-scene--incident flex flex-col">
    <p class="text-xs font-medium tracking-wide uppercase" style="color: var(--hs-ink)">${outage.clock} · Checkout is down</p>
    <h3 class="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">Who do you call?</h3>
    <div class="hs-incident-body mt-5 flex-1">
      <ul class="space-y-2.5">
        ${outage.vendors
          .map(
            (v) => `
        <li class="hs-vendor flex items-center gap-3 rounded-2xl border border-neutral-200 px-3.5 py-3 dark:border-neutral-800">
          <span class="icon-box !h-9 !w-9 !rounded-xl">${icon(v.icon, 'h-4 w-4')}</span>
          <span class="min-w-0"><span class="block text-sm font-medium text-neutral-950 dark:text-white">${v.who}</span><span class="block truncate text-sm text-neutral-500">${v.says}</span></span>
        </li>`,
          )
          .join('')}
      </ul>
      <div class="hs-call surface-ink flex items-center gap-4 rounded-2xl p-4 text-white" data-call>
        <span class="hs-ring inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10"><i></i><i></i>${icon('phone', 'h-5 w-5')}</span>
        <span>
          <span class="block text-sm font-semibold"><span data-call-a>Calling VavenCloud…</span><span data-call-b>Connected</span></span>
          <span class="block text-sm opacity-70"><span data-call-a>One call. That’s all you have to do.</span><span data-call-b>Your on-call engineer picked up.</span></span>
        </span>
      </div>
    </div>
  </div>`

const fixScene = () => `
  <div class="hs-scene hs-scene--fix flex flex-col">
    <div class="flex flex-wrap items-baseline justify-between gap-x-4">
      <h3 class="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">One call. Handled.</h3>
      <p class="font-mono text-sm tabular-nums" style="color: var(--hs-ink)"><span data-since>0 min</span> since the alert</p>
    </div>
    <ol class="mt-5 space-y-1">
      ${outage.events
        .map(
          (e, k) => `
      <li class="hs-ev relative flex gap-4 py-2.5">
        <span class="hs-ev-dot relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-white dark:ring-neutral-950 ${toneDot[e.tone]}"></span>
        ${k > 0 ? '<span class="hs-typing"><i></i><i></i><i></i></span>' : ''}
        <div class="hs-ev-body min-w-0 flex-1">
          <p class="text-xs text-neutral-500"><span class="font-mono">${e.clock}</span> · ${e.who}</p>
          <p class="mt-0.5 text-sm text-neutral-800 dark:text-neutral-200">${e.text}</p>
        </div>
      </li>`,
        )
        .join('')}
    </ol>
    <p class="hs-result mt-auto flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
      ${icon('check', 'h-4 w-4 shrink-0')}Fixed in ${outage.fixedIn} minutes. A written incident report is in your portal.
    </p>
  </div>`

const stage = () => `
  <div class="hero-in mx-auto mt-14 max-w-5xl text-center sm:mt-16" style="--i:6">
    <p class="inline-flex items-center gap-2 text-sm font-medium text-neutral-500"><span class="h-px w-6 bg-neutral-300 dark:bg-neutral-700"></span>Don’t take our word for it. Break an app and watch.<span class="h-px w-6 bg-neutral-300 dark:bg-neutral-700"></span></p>
  </div>
  <div class="hs hero-stage mx-auto mt-5 max-w-5xl rounded-[2rem] bg-neutral-100 p-2 sm:p-3 dark:bg-neutral-900" data-state="calm" role="group" aria-label="Interactive example: an outage, fixed with one call">
    <p class="sr-only" role="status" aria-live="polite" data-sr></p>
    <div class="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgb(10_16_32/0.05),0_30px_60px_-28px_rgb(30_58_138/0.4)] dark:border-neutral-800 dark:bg-neutral-950">
      <div class="flex items-center justify-between gap-4 border-b border-neutral-200 px-5 py-3 dark:border-neutral-800">
        <p class="flex items-center gap-2 text-sm font-semibold text-neutral-950 dark:text-white" aria-hidden="true">
          <span class="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-linear-to-b from-brand-500 to-brand-700 text-white">${icon('cloud', 'h-3.5 w-3.5')}</span>
          VavenCloud <span class="font-normal text-neutral-400">/ live example</span>
        </p>
        <button type="button" class="btn-primary hs-invite !px-5 !py-2.5" data-demo-btn>
          <span data-for="calm" class="items-center gap-2">${icon('zap', 'h-4 w-4')}Break my app</span>
          <span data-for="down calling fixing" class="items-center gap-2">Playing…</span>
          <span data-for="resolved" class="items-center gap-2">${icon('play', 'h-4 w-4')}Replay</span>
        </button>
      </div>
      <div class="grid md:grid-cols-[0.92fr_1.08fr]" aria-hidden="true">
        <div class="border-b border-neutral-200 bg-neutral-50 p-4 sm:p-5 md:border-r md:border-b-0 dark:border-neutral-800 dark:bg-neutral-900/50">${checkout()}</div>
        <div class="hs-scenes grid min-h-[27rem] p-5 sm:p-7">${calmScene()}${incidentScene()}${fixScene()}</div>
      </div>
    </div>
  </div>`

const hl = hero.headline
const headlineText = `${hl.before} ${hl.broken} ${hl.between} ${hl.call}${hl.after} ${hl.highlight}`

const html = () => `
<section id="top" class="hero band-blue relative -mt-18 overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
  <div class="container-page pt-36 pb-16 sm:pt-44 sm:pb-20">
    <div class="text-center">
      <p class="hero-in text-sm font-medium text-neutral-500" style="--i:0">${hero.eyebrow}</p>
      <h1 class="hl hero-in mx-auto mt-6 max-w-6xl text-[2.75rem] leading-[1.02] font-semibold tracking-[-0.04em] text-balance text-neutral-950 sm:text-7xl lg:text-[4.75rem] dark:text-white" style="--i:1" data-phase="intact" aria-label="${headlineText}">
        <span aria-hidden="true">${hl.before} <span class="hl-word" data-hl-word>${[...hl.broken].map((ch) => `<span class="hl-letter">${ch}</span>`).join('')}</span> ${hl.between} <span class="hl-call"><span class="hl-phone">${icon('phone', 'h-[0.5em] w-[0.5em]')}</span>${hl.call}</span>${hl.after} <span class="relative inline-block whitespace-nowrap text-brand-600 dark:text-brand-400">${hl.highlight}<svg class="hero-underline pointer-events-none absolute -bottom-[0.12em] left-0 h-[0.28em] w-full" viewBox="0 0 300 20" preserveAspectRatio="none" fill="none" aria-hidden="true"><path pathLength="1" d="M3 14 C 60 5, 140 4, 297 9" stroke="currentColor" stroke-width="5" stroke-linecap="round" /></svg></span></span>
      </h1>
      <p class="hero-in mx-auto mt-7 max-w-3xl text-lg leading-relaxed sm:text-xl" style="--i:2">${hero.description}</p>
      <div class="hero-in mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6" style="--i:3">
        <a href="${hero.primary.href}" class="btn-primary w-full !px-8 !py-3.5 !text-base sm:w-auto">${hero.primary.label} ${icon('arrow-right', 'h-4 w-4')}</a>
        <a href="${hero.secondary.href}" class="inline-flex items-center justify-center gap-1.5 rounded-full py-3 text-base font-semibold text-neutral-950 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-white">${hero.secondary.label} ${icon('arrow-right', 'h-4 w-4')}</a>
      </div>
      <p class="hero-in mx-auto mt-5 max-w-xl text-sm leading-relaxed text-neutral-500" style="--i:4">${hero.reassurance}</p>
    </div>

    <ul class="hero-in mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-200 sm:grid-cols-4 dark:border-neutral-800 dark:bg-neutral-800" style="--i:5" aria-label="Track record">
      ${trustStrip.map((t) => `<li class="bg-white px-4 py-4 text-center dark:bg-neutral-950"><p class="text-lg font-semibold tracking-tight text-neutral-950 tabular-nums dark:text-white"><span class="sr-only">${t.value}</span><span aria-hidden="true" data-count-to="${t.value}">${t.value}</span></p><p class="mt-0.5 text-xs text-neutral-500">${t.label}</p></li>`).join('')}
    </ul>

    ${stage()}
  </div>
</section>`

/* ---------- The "break my app" demo ---------- */

const status: Record<string, string> = {
  calm: 'Example: your app is running normally.',
  down: 'Example: your app just went down. Checkout is failing.',
  calling: 'You make one call to VavenCloud.',
  fixing: 'The on-call engineer is working on it.',
  resolved: `Fixed in ${outage.fixedIn} minutes. A written incident report is in the portal.`,
}

function initDemo(): void {
  const root = qs('.hs')
  const btn = qs<HTMLButtonElement>('[data-demo-btn]', root)
  const sr = qs('[data-sr]', root)
  const latencyEl = qs('[data-latency]', root)
  const sinceEl = qs('[data-since]', root)
  const call = qs('[data-call]', root)
  const bars = qsa('.hs-bar', root)
  const vendors = qsa('.hs-vendor', root)
  const events = qsa('.hs-ev', root)
  const reduced = prefersReducedMotion()
  const timers: number[] = []
  const frames = new Map<Element, number>()
  let latency: number = outage.baseLatency
  let minutes = 0

  const at = (delay: number, fn: () => void) => timers.push(window.setTimeout(fn, delay))
  const stopAll = () => {
    timers.splice(0).forEach((t) => window.clearTimeout(t))
    frames.forEach((f) => cancelAnimationFrame(f))
    frames.clear()
  }

  const setState = (s: string) => {
    root.dataset.state = s
    btn.disabled = !(s === 'calm' || s === 'resolved')
    sr.textContent = status[s]
  }

  /** Eases a number from `from` to `to` and writes it with `fmt`. */
  const tween = (el: Element, from: number, to: number, duration: number, fmt: (n: number) => string) => {
    cancelAnimationFrame(frames.get(el) ?? 0)
    const t0 = performance.now()
    const step = (now: number) => {
      const t = Math.min((now - t0) / Math.max(duration, 1), 1)
      el.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - t, 3)))
      if (t < 1) frames.set(el, requestAnimationFrame(step))
    }
    frames.set(el, requestAnimationFrame(step))
  }

  const paintBar = (i: number, heat: number) => {
    bars[i].style.height = `${heightOf(i, heat)}%`
    bars[i].classList.toggle('hs-bar--hot', i >= HOT_FROM && heat > 0.3)
  }
  /** Recent bars rise (or fall) one after another, like a live chart */
  const heatTo = (heat: number) => bars.forEach((_, i) => i >= HOT_FROM && at((i - HOT_FROM) * 70, () => paintBar(i, heat)))

  const reset = () => {
    stopAll()
    vendors.forEach((v) => v.classList.remove('is-in'))
    events.forEach((e) => e.classList.remove('is-in', 'is-typing'))
    call.classList.remove('is-connected')
    latency = outage.baseLatency
    minutes = 0
    latencyEl.textContent = ms(latency)
    sinceEl.textContent = '0 min'
    bars.forEach((_, i) => paintBar(i, 0))
    setState('calm')
  }

  const showEvent = (k: number, delay: number) => {
    const e = outage.events[k]
    if (k > 0) at(delay - 900, () => events[k].classList.add('is-typing'))
    at(delay, () => {
      events[k].classList.remove('is-typing')
      events[k].classList.add('is-in')
      tween(sinceEl, minutes, e.minute, 900, (n) => `${Math.round(n)} min`)
      minutes = e.minute
      if (e.latency !== latency) tween(latencyEl, latency, e.latency, 1100, ms)
      latency = e.latency
      heatTo(e.heat)
    })
  }

  const play = () => {
    reset()
    setState('down')
    tween(latencyEl, latency, 4210, 900, ms)
    latency = 4210
    heatTo(1)
    vendors.forEach((v, i) => at(500 + i * 800, () => v.classList.add('is-in')))
    at(3500, () => setState('calling'))
    at(4800, () => call.classList.add('is-connected'))
    at(5900, () => {
      setState('fixing')
      const times = [300, 2300, 4700, 7000]
      times.forEach((t, k) => showEvent(k, t))
      at(times[times.length - 1] + 800, () => setState('resolved'))
    })
  }

  btn.addEventListener('click', play)

  // Plays once by itself the first time the stage is seen, so the headline is proven in front of the visitor
  if (!reduced) {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        at(1100, play)
      },
      { threshold: 0.5 },
    )
    io.observe(root)
  }
  reset()
}

/** Trust strip numbers count up once ("210+", "12+ years", "100%"; "24/7" stays as it is). */
function initCounters(): void {
  if (prefersReducedMotion()) return
  qsa('[data-count-to]', qs('#top')).forEach((el, i) => {
    const text = el.dataset.countTo ?? ''
    const match = /^(\d+)/.exec(text)
    // "24/7" is a schedule, not an amount: counting it up would read "22/7" on the way
    if (!match || text.slice(match[1].length).startsWith('/')) return
    const target = Number(match[1])
    const rest = text.slice(match[1].length)
    const start = performance.now() + 500 + i * 120
    const tick = (now: number) => {
      const t = Math.min(Math.max((now - start) / 1400, 0), 1)
      el.textContent = `${Math.round(target * (1 - Math.pow(1 - t, 3)))}${rest}`
      if (t < 1) requestAnimationFrame(tick)
    }
    el.textContent = `0${rest}`
    requestAnimationFrame(tick)
  })
}

/**
 * The headline acts out its own meaning, driven by [data-phase] on the <h1>:
 *   intact → broken (letters of "breaks" scatter, rose) → called ("one call" fills and rings)
 *   → fixed (letters spring back, "We fix the rest." gets underlined)
 * It plays once on load. A mouse pushes the letters of "breaks" around, and clicking the word replays it.
 * The visual copy is aria-hidden; the <h1> carries the full sentence as its accessible name.
 * With reduced motion it simply shows the final state.
 */
function initHeadline(): void {
  const h = qs('.hl')
  const word = qs('[data-hl-word]', h)
  const letters = qsa('.hl-letter', word)
  const reduced = prefersReducedMotion()
  if (reduced) {
    h.dataset.phase = 'fixed'
    word.style.cursor = 'default'
    return
  }

  const k = window.matchMedia('(max-width: 640px)').matches ? 0.55 : 1
  // Fixed offsets (x px, y px, rotation deg) so the break looks the same on every visit
  const scatter = [[-54, -36, -26], [40, -48, 18], [-26, 42, -32], [60, 24, 28], [-46, -20, -12], [32, 50, 34], [-62, 30, -20]]
  letters.forEach((l, i) => {
    const [x, y, r] = scatter[i % scatter.length]
    l.style.setProperty('--sx', `${x * k}px`)
    l.style.setProperty('--sy', `${y * k}px`)
    l.style.setProperty('--sr', `${r}deg`)
  })

  const timers: number[] = []
  const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))
  let busy = true

  const play = (delay: number) => {
    timers.splice(0).forEach((t) => window.clearTimeout(t))
    busy = true
    at(delay, () => (h.dataset.phase = 'broken'))
    at(delay + 1100, () => (h.dataset.phase = 'called'))
    at(delay + 2100, () => {
      h.style.setProperty('--hl-t', '0.9s')
      h.style.setProperty('--hl-e', 'cubic-bezier(0.34, 1.56, 0.64, 1)')
      h.dataset.phase = 'fixed'
    })
    at(delay + 3200, () => {
      h.style.removeProperty('--hl-t')
      h.style.removeProperty('--hl-e')
      busy = false
    })
  }
  play(1500)
  word.addEventListener('click', () => !busy && play(0))

  // Mouse: letters of "breaks" are pushed away from the cursor and spring back when it leaves.
  // Resting positions are measured once (relative to the h1), because a letter's own rect moves with its offset.
  let rest: { x: number; y: number }[] = []
  const measure = () => {
    const base = h.getBoundingClientRect()
    rest = letters.map((l) => {
      const r = l.getBoundingClientRect()
      return { x: r.left + r.width / 2 - base.left, y: r.top + r.height / 2 - base.top }
    })
  }
  measure()
  window.addEventListener('resize', () => {
    if (h.dataset.phase === 'intact' || h.dataset.phase === 'fixed') measure()
  })

  const RADIUS = 130
  let frame = 0
  let pointer: { x: number; y: number } | null = null
  const push = () => {
    frame = 0
    const base = h.getBoundingClientRect()
    letters.forEach((l, i) => {
      let dx = 0
      let dy = 0
      if (pointer && !busy && rest[i]) {
        const ox = base.left + rest[i].x - pointer.x
        const oy = base.top + rest[i].y - pointer.y
        const d = Math.hypot(ox, oy)
        if (d < RADIUS && d > 0.5) {
          const s = Math.pow(1 - d / RADIUS, 1.4) * 46 * k
          dx = (ox / d) * s
          dy = (oy / d) * s
        }
      }
      l.style.setProperty('--px', `${dx}px`)
      l.style.setProperty('--py', `${dy}px`)
    })
  }
  const queue = () => {
    if (!frame) frame = requestAnimationFrame(push)
  }
  h.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return
    pointer = { x: e.clientX, y: e.clientY }
    queue()
  })
  h.addEventListener('pointerleave', () => {
    pointer = null
    queue()
  })
}

/**
 * Scroll-linked entrance for the example stage. As it climbs into the screen it grows from a smaller,
 * slightly tilted-back card to full size; as it leaves at the top it shrinks again. Scrolling back
 * plays the same thing in reverse. The target comes from the stage's position; the displayed value
 * eases towards it each frame, so the motion stays smooth even with a notched mouse wheel.
 * With reduced motion the stage is left alone.
 */
function initStageScroll(): void {
  if (prefersReducedMotion()) return
  const stage = qs('.hero-stage')
  const small = window.matchMedia('(max-width: 640px)')
  const clamp = (n: number) => Math.min(Math.max(n, 0), 1)
  const ease = (t: number) => 1 - Math.pow(1 - t, 3)

  const target = () => {
    const r = stage.getBoundingClientRect()
    const vh = window.innerHeight
    return {
      enter: clamp((vh - r.top) / (vh * 0.7)), // 0 while it is below the screen, 1 once it sits in the upper half
      leave: clamp((vh * 0.08 - r.top) / (vh * 0.7)), // 0 until its top passes the top of the screen
    }
  }

  let current = target()
  let goal = current
  let running = false

  const paint = () => {
    const from = small.matches ? 0.9 : 0.78
    const tilt = small.matches ? 6 : 14
    const grow = ease(current.enter)
    const scale = from + (1 - from) * grow - 0.12 * ease(current.leave)
    const rotate = tilt * (1 - grow)
    stage.style.transform = `perspective(1400px) rotateX(${rotate.toFixed(2)}deg) scale(${scale.toFixed(4)})`
  }

  const step = () => {
    current = {
      enter: current.enter + (goal.enter - current.enter) * 0.14,
      leave: current.leave + (goal.leave - current.leave) * 0.14,
    }
    paint()
    const settled = Math.abs(goal.enter - current.enter) < 0.001 && Math.abs(goal.leave - current.leave) < 0.001
    if (settled) {
      current = goal
      paint()
      running = false
    } else requestAnimationFrame(step)
  }

  const onScroll = () => {
    goal = target()
    if (!running) {
      running = true
      requestAnimationFrame(step)
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  paint()
}

export function heroSection(): Section {
  return {
    html: html(),
    init() {
      initStageScroll()
      initHeadline()
      initDemo()
      initCounters()
    },
  }
}
