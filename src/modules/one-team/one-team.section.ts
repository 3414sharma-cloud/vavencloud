import './one-team.css'
import type { Section } from '@/app/types.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { fee, layers, providers, workspace, type Cover, type LayerId, type Provider } from './one-team.data.ts'

/*
 * "The answer: one team, every layer" (VavenCloud-Sample-Content.md), flat and numbered like the hero:
 *  - Who owns what: pick a kind of provider and see which layers of the product it covers. The first time it
 *    is seen it steps through the others and stops on VavenCloud, every layer covered; any choice stops that.
 *  - One fixed monthly fee: one senior hire against a whole team, and which layers each can look after.
 *  - The promise, then the workspace (client portal and dashboard).
 */

const OURS = providers.length - 1
const money = (n: number) => Math.round(n).toLocaleString('en-US')
const num = (i: number) => String(i + 1).padStart(2, '0')

const overline = (text: string, id = '') => `<p class="ot-overline" ${id ? `id="${id}"` : ''}>${text}</p>`

/* ---------- Who owns what ---------- */

const providerTab = (p: Provider, i: number) => `
          <button type="button" role="tab" id="ot-tab-${p.id}" aria-controls="ot-panel" aria-selected="${i === OURS}" tabindex="${i === OURS ? 0 : -1}" class="ot-tab">
            <span class="ot-tab-num" aria-hidden="true">${num(i)}</span>${p.name}
          </button>`

/** ✓ covered, – partly, ✕ not covered: all three are drawn, the row's state shows one */
const mark = `<span class="ot-mark" aria-hidden="true">${icon('check', 'is-yes h-3.5 w-3.5')}${icon('minus', 'is-partly h-3.5 w-3.5')}${icon('x', 'is-no h-3.5 w-3.5')}</span>`

const coverRow = (l: (typeof layers)[number], c: Cover) => `
            <li class="ot-row" data-layer="${l.id}" data-state="${c.state}">
              ${mark}
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1.5">
                  <p class="ot-row-name">${l.name}</p>
                  <span class="ot-note" data-note>${c.note}</span>
                </div>
                <p class="ot-row-covers">${l.covers}</p>
                <p class="ot-row-by">${icon(l.icon, 'h-3.5 w-3.5 flex-none')}By ${l.by}</p>
              </div>
            </li>`

const compare = (p: Provider) => `
    <div class="ot-compare" data-provider="${p.id}" data-compare>
      <div>
        ${overline('Who owns what, when it breaks?', 'ot-title')}
        <div role="tablist" aria-labelledby="ot-title" aria-orientation="vertical" class="ot-tabs">
          ${providers.map(providerTab).join('')}
        </div>
        <p class="ot-hint">Pick one to see what it covers.</p>
      </div>

      <div id="ot-panel" role="tabpanel" aria-labelledby="ot-tab-${p.id}" class="ot-panel card">
        ${overline('What’s covered')}
        <h3 class="ot-panel-title">With <span data-fact="name">${p.name}</span></h3>
        <ol class="ot-rows">
          ${layers.map((l) => coverRow(l, p.layers[l.id])).join('')}
        </ol>
        <dl class="ot-facts">
          <div><dt>On call for your product</dt><dd data-fact="onCall">${p.onCall}</dd></div>
          <div><dt>How you pay</dt><dd data-fact="pay">${p.pay}</dd></div>
        </dl>
      </div>
    </div>`

/* ---------- One fixed monthly fee ---------- */

/** A layer as a small chip: ticked if this side covers it */
const chip = (id: LayerId, on: boolean) => {
  const l = layers.find((x) => x.id === id)!
  return `<li class="ot-chip ${on ? 'is-on' : 'is-off'}">${icon(on ? 'check' : 'x', 'h-3 w-3 flex-none')}${on ? '' : '<span class="sr-only">Not covered: </span>'}${l.short}</li>`
}

const person = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-5 w-5" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"></path></svg>`

const feeBlock = () => `
    <div class="ot-fee" data-fee>
      ${overline('One fixed monthly fee')}
      <div class="ot-fee-grid">
        <div class="ot-fee-side card">
          <span class="ot-fee-person">${person}</span>
          <p class="ot-fee-figure">~$<span data-fee-count>${money(fee.hire)}</span></p>
          <p class="ot-fee-text">${fee.hireText}</p>
          <ul class="ot-chips" aria-label="What one hire looks after">
            ${layers.map((l) => chip(l.id, fee.hireCovers.includes(l.id))).join('')}
          </ul>
        </div>
        <span class="ot-fee-vs" aria-hidden="true">vs</span>
        <div class="ot-fee-side ot-fee-side--team surface-ink rounded-3xl">
          <span class="ot-fee-faces" aria-hidden="true">${layers.map((l) => `<span>${icon(l.icon, 'h-4 w-4')}</span>`).join('')}</span>
          <p class="ot-fee-figure">A whole team</p>
          <p class="ot-fee-text">${fee.teamText}</p>
          <ul class="ot-chips" aria-label="What the team looks after">
            ${layers.map((l) => chip(l.id, true)).join('')}
          </ul>
        </div>
      </div>
      <p class="ot-fee-note">${fee.note} <strong>${fee.punch}</strong></p>
    </div>`

/* ---------- Your workspace ---------- */

const tools = () => `
    <div data-reveal class="mx-auto mt-24 max-w-6xl">
      <p class="text-xs font-semibold tracking-[0.14em] text-brand-700 uppercase dark:text-brand-300">Your workspace</p>
      <h3 class="mt-5 text-5xl leading-[0.9] font-semibold tracking-[-0.07em] text-neutral-950 sm:text-7xl lg:text-[5.5rem] dark:text-white">Everything in one place,<br><span class="text-neutral-400 dark:text-neutral-500">whichever cloud you’re on.</span></h3>
      <ol class="ot-tools">
        ${workspace
          .map(
            (t, i) => `
        <li class="ot-tool">
          <span class="ot-tool-num" aria-hidden="true">${num(i)}</span>
          <div>
            <p class="ot-tool-who">${t.who}</p>
            <h4 class="ot-tool-name">${icon(t.icon, 'h-5 w-5 flex-none')}${t.name}</h4>
            <p class="ot-tool-what">${t.what}</p>
          </div>
        </li>`,
          )
          .join('')}
      </ol>
    </div>`

function initCompare(root: HTMLElement): void {
  const tabs = qsa<HTMLButtonElement>('[role="tab"]', root)
  const panel = qs('#ot-panel', root)
  const timers: number[] = []
  let index = OURS

  const select = (i: number, focus = false) => {
    index = i
    const p = providers[i]
    root.dataset.provider = p.id
    tabs.forEach((t, k) => {
      t.setAttribute('aria-selected', String(k === i))
      t.tabIndex = k === i ? 0 : -1
    })
    if (focus) tabs[i].focus()
    panel.setAttribute('aria-labelledby', tabs[i].id)
    qsa('[data-layer]', root).forEach((row) => {
      const cover = p.layers[row.dataset.layer as LayerId]
      row.dataset.state = cover.state
      qs('[data-note]', row).textContent = cover.note
    })
    qs('[data-fact="name"]', root).textContent = p.name
    qs('[data-fact="onCall"]', root).textContent = p.onCall
    qs('[data-fact="pay"]', root).textContent = p.pay
  }

  // One panel height whichever provider is shown (on phones the notes wrap differently), so the page below
  // doesn't jump during the walkthrough. Transitions are off while each provider is measured.
  const settle = () => {
    const shown = index
    let tallest = 0
    root.classList.add('is-measuring')
    panel.style.minHeight = ''
    providers.forEach((_, i) => {
      select(i)
      tallest = Math.max(tallest, panel.offsetHeight)
    })
    select(shown)
    panel.style.minHeight = `${tallest}px`
    void panel.offsetHeight
    root.classList.remove('is-measuring')
  }
  settle()
  document.fonts?.ready.then(settle)
  // Only when the width changes: phones also resize as the address bar shows and hides
  let frame = 0
  let width = window.innerWidth
  window.addEventListener('resize', () => {
    if (window.innerWidth === width) return
    width = window.innerWidth
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(settle)
  })

  /** A visitor's own choice ends the walkthrough */
  const choose = (i: number, focus = false) => {
    timers.splice(0).forEach((t) => window.clearTimeout(t))
    select(i, focus)
  }
  tabs.forEach((t, i) => t.addEventListener('click', () => choose(i)))
  qs('[role="tablist"]', root).addEventListener('keydown', (e) => {
    const keys: Record<string, number> = { ArrowDown: index + 1, ArrowRight: index + 1, ArrowUp: index - 1, ArrowLeft: index - 1, Home: 0, End: OURS }
    if (!(e.key in keys)) return
    e.preventDefault()
    choose((keys[e.key] + providers.length) % providers.length, true)
  })

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return
  // The first time it is seen: step through the other providers, ending on VavenCloud
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      io.disconnect()
      providers.forEach((_, i) => timers.push(window.setTimeout(() => select(i), 400 + i * 1800)))
    },
    { threshold: 0.45 },
  )
  io.observe(root)
}

/** The hire's cost counts up once, when the fee is first seen */
function initFee(block: HTMLElement): void {
  const count = qs('[data-fee-count]', block)
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (now: number) => {
        const t = Math.min((now - t0) / 1400, 1)
        count.textContent = money(fee.hire * (1 - Math.pow(1 - t, 3)))
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    },
    { threshold: 0.5 },
  )
  io.observe(block)
}

export function oneTeamSection(): Section {
  return {
    html: `
<section id="one-team" class="band-linen border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800">
  <div class="container-page">
    <div class="mx-auto max-w-3xl text-center">
      ${sectionHeading({
        title: 'One team owns your production. Not just the server. All of it.',
        description:
          'VavenCloud brings together three things that usually come from three different companies: the infrastructure your product runs on, the DevOps engineers who keep it healthy, and the developers who can fix the code itself. Same team, same chat, same responsibility.',
      })}
    </div>

    ${compare(providers[OURS])}
    ${feeBlock()}

    <p data-reveal class="mx-auto mt-24 max-w-4xl surface-brand rounded-3xl px-8 py-10 text-center text-2xl leading-snug font-semibold tracking-tight text-balance sm:text-3xl">
      If your product is down, we treat it as our problem until it’s back, whatever the cause.
    </p>

    ${tools()}
  </div>
</section>`,
    init() {
      initCompare(qs('#one-team [data-compare]'))
      initFee(qs('#one-team [data-fee]'))
    },
  }
}
