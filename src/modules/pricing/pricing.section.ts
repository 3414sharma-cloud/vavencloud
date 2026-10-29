import './pricing.css'
import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { site } from '@/app/site.config.ts'
import { mountAntigravity } from '@/shared/effects/antigravity.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { isMobileViewport } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'
import { planGroups as defaultGroups, type ComparisonRow, type Plan, type PlanCategory, type PlanGroup } from './pricing.data.ts'

/** Grid layout per number of plans, so 1–3 plans stay centred instead of stretching edge to edge. */
const gridLayout: Record<number, string> = {
  1: 'mx-auto max-w-md',
  2: 'mx-auto max-w-4xl md:grid-cols-2',
  3: 'mx-auto max-w-6xl md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 xl:grid-cols-4',
  5: 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
}

const tabClass =
  'rounded-full px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 aria-selected:bg-white aria-selected:text-ink-950 aria-selected:shadow-lg aria-selected:shadow-brand-900/40'
const subTabClass =
  'rounded-full px-4 py-1.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 aria-selected:bg-brand-500 aria-selected:text-white aria-selected:shadow-md aria-selected:shadow-brand-500/30'

const tabs = (items: { id: string; label: string }[], activeId: string, kind: 'group' | 'category') =>
  items
    .map(
      (t) => `
    <button type="button" role="tab" id="tab-${t.id}" data-${kind}="${t.id}" aria-controls="plans-panel"
      aria-selected="${t.id === activeId}" tabindex="${t.id === activeId ? 0 : -1}"
      class="${kind === 'group' ? tabClass : subTabClass}">${t.label}</button>`,
    )
    .join('')

const comingSoonBadge = `<span class="rounded-full bg-ink-950 px-4 py-1.5 text-xs font-semibold tracking-wider text-white uppercase shadow-lg">Coming soon</span>`

function planCard(plan: Plan, index: number, showDescription: boolean): string {
  const { popular, comingSoon } = plan
  const cta = comingSoon
    ? `<a href="${routes.contact}" class="btn-secondary mt-6 w-full">Get notified<span class="sr-only"> about ${plan.name}</span></a>`
    : `<a href="${site.panelUrl}" target="_blank" rel="noopener noreferrer" class="${popular ? 'btn-primary' : 'btn-secondary'} mt-6 w-full">
        Choose plan<span class="sr-only"> ${plan.name} (opens in a new tab)</span> ${icon('arrow-right', 'h-4 w-4')}
      </a>`

  const features = `
    <ul class="space-y-3 text-sm ${comingSoon ? 'blur-[3px] select-none' : ''}">
      ${plan.features
        .map(
          (f) => `
      <li class="flex items-start gap-3 text-slate-600">
        <span class="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">${icon('check', 'h-3 w-3')}</span>${f}
      </li>`,
        )
        .join('')}
      ${(plan.missing ?? [])
        .map(
          (f) => `
      <li class="flex items-start gap-3 text-slate-400">
        <span class="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">${icon('minus', 'h-3 w-3')}</span><span><span class="sr-only">Not included: </span>${f}</span>
      </li>`,
        )
        .join('')}
    </ul>`

  return `
  <article class="plan-card group relative flex flex-col rounded-3xl border bg-white p-7 transition-[border-color,box-shadow,translate] duration-500 ease-smooth hover:-translate-y-1 ${
    popular
      ? 'border-brand-500 shadow-2xl shadow-brand-500/20 ring-1 ring-brand-500'
      : 'border-slate-200 shadow-sm hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10'
  }" style="animation-delay:${index * 70}ms">
    ${
      popular
        ? `<span class="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-linear-to-r from-brand-500 to-brand-600 px-3.5 py-1 text-xs font-semibold whitespace-nowrap text-white shadow-lg shadow-brand-500/30">${icon('sparkles', 'h-3.5 w-3.5')} Most popular</span>`
        : `<div class="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-brand-400 to-transparent opacity-0 transition group-hover:opacity-100" aria-hidden="true"></div>`
    }
    <h3 class="text-lg font-semibold text-slate-900">${plan.name}</h3>
    ${showDescription ? `<p class="mt-1.5 min-h-10 text-sm leading-relaxed text-slate-500">${plan.description ?? ''}</p>` : ''}

    <div class="mt-5 flex min-h-6 items-center gap-2 ${comingSoon ? 'blur-[2px]' : ''}">
      ${plan.oldPrice ? `<span class="text-sm text-slate-400 line-through"><span class="sr-only">Was </span>${plan.oldPrice}</span>` : ''}
      ${plan.discount ? `<span class="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">${plan.discount}</span>` : ''}
    </div>
    <p class="mt-2 flex items-baseline gap-1 text-slate-900">
      ${
        comingSoon
          ? `<span class="text-2xl font-bold tracking-tight">${plan.price}</span>`
          : `<span class="text-4xl font-extrabold tracking-tight">${plan.price}</span>${plan.period ? `<span class="text-sm font-medium text-slate-500">${plan.period}</span>` : ''}`
      }
    </p>

    ${cta}

    <div class="mt-7 border-t border-slate-100 pt-6">
      <p class="mb-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">What's included</p>
      ${
        comingSoon
          ? `<div class="relative">${features}<div class="absolute inset-0 flex items-center justify-center">${comingSoonBadge}</div></div>`
          : features
      }
    </div>
  </article>`
}

/* ---------- Compare all features ---------- */

function comparisonCell(value: string | boolean): string {
  if (value === true)
    return `<span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/30">${icon('check', 'h-3.5 w-3.5')}<span class="sr-only">Included</span></span>`
  if (value === false)
    return `<span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-300">${icon('minus', 'h-3.5 w-3.5')}<span class="sr-only">Not included</span></span>`
  if (value === '—') return `<span class="text-slate-300" aria-label="Not applicable">—</span>`
  return `<span class="font-semibold text-slate-800">${value}</span>`
}

const priceHtml = (p: Plan, size: 'lg' | 'md') =>
  p.comingSoon
    ? `<span class="text-base font-bold text-slate-900">${p.price}</span>`
    : `<span class="${size === 'lg' ? 'text-3xl' : 'text-2xl'} font-extrabold tracking-tight text-slate-900">${p.price}</span>${p.period ? `<span class="text-sm font-medium text-slate-500">${p.period}</span>` : ''}`

const compareCta = (p: Plan) =>
  p.comingSoon
    ? ''
    : `<a href="${site.panelUrl}" target="_blank" rel="noopener noreferrer" class="${p.popular ? 'btn-primary' : 'btn-secondary'} mt-4 w-full !px-4 !py-2 !text-xs">Choose plan<span class="sr-only"> ${p.name} (opens in a new tab)</span></a>`

const popularBadge = `<span class="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-brand-500 to-brand-600 px-2.5 py-0.5 text-[0.7rem] font-semibold whitespace-nowrap text-white shadow-md shadow-brand-500/30">${icon('sparkles', 'h-3 w-3')} Most popular</span>`

/** md+: a matrix with plan headers (price + CTA) and the popular plan's column tinted top to bottom. */
function comparisonMatrix({ label, plans, comparison }: PlanCategory): string {
  const popular = plans.findIndex((p) => p.popular)
  const last = comparison.length - 1
  const tint = (i: number) => (i === popular ? 'bg-brand-50/70' : '')

  return `
  <div class="hidden overflow-x-auto md:block">
    <table class="w-full border-separate border-spacing-0 text-sm" style="min-width:${180 + plans.length * 150}px">
      <caption class="sr-only">${label} plans compared</caption>
      <thead>
        <tr>
          <th scope="col" class="w-1/4 p-6 text-left align-bottom">
            <span class="block text-xs font-semibold tracking-wider text-slate-400 uppercase">Core benefits</span>
            <span class="mt-1 block text-lg font-bold text-slate-900">${label}</span>
          </th>
          ${plans
            .map(
              (p, i) => `
          <th scope="col" class="px-4 pt-10 pb-6 text-center align-bottom ${i === popular ? 'relative rounded-t-3xl bg-brand-50/70' : ''}">
            ${i === popular ? `<span class="absolute top-3 left-1/2 -translate-x-1/2">${popularBadge}</span>` : ''}
            <span class="block text-sm font-semibold text-slate-600">${p.name}</span>
            <span class="mt-2 flex items-baseline justify-center gap-0.5">${priceHtml(p, 'md')}</span>
            ${compareCta(p)}
          </th>`,
            )
            .join('')}
        </tr>
      </thead>
      <tbody>
        ${comparison
          .map(
            (r: ComparisonRow, ri) => `
        <tr class="group/row">
          <th scope="row" class="border-t border-slate-100 px-6 py-4 text-left font-medium text-slate-700 transition group-hover/row:text-slate-900">${r.feature}</th>
          ${r.values
            .map(
              (v, i) =>
                `<td class="border-t border-slate-100 px-4 py-4 text-center ${tint(i)} ${i === popular && ri === last ? 'rounded-b-3xl' : ''}">${comparisonCell(v)}</td>`,
            )
            .join('')}
        </tr>`,
          )
          .join('')}
      </tbody>
    </table>
  </div>`
}

/** < md: a plan switcher + one stacked list per plan, instead of a sideways-scrolling table. */
function comparisonStack({ label, plans, comparison }: PlanCategory): string {
  const selected = Math.max(0, plans.findIndex((p) => p.popular))
  return `
  <div class="md:hidden">
    ${
      plans.length > 1
        ? `<div role="tablist" aria-label="${label} plan" class="flex gap-1 overflow-x-auto rounded-full bg-slate-100 p-1">
      ${plans
        .map(
          (p, i) => `
      <button type="button" role="tab" data-compare-plan="${i}" aria-selected="${i === selected}"
        class="shrink-0 grow rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap text-slate-500 transition aria-selected:bg-white aria-selected:text-slate-900 aria-selected:shadow-sm">${p.name}</button>`,
        )
        .join('')}
    </div>`
        : ''
    }
    ${plans
      .map(
        (p, i) => `
    <div data-compare-col="${i}" role="tabpanel" ${i === selected ? '' : 'hidden'} class="mt-4">
      <div class="rounded-2xl p-5 ${p.popular ? 'bg-brand-50/70 ring-1 ring-brand-100' : 'bg-slate-50'}">
        <div class="flex items-center justify-between gap-3">
          <p class="font-semibold text-slate-900">${p.name}</p>
          ${p.popular ? popularBadge : ''}
        </div>
        <p class="mt-1 flex items-baseline gap-0.5">${priceHtml(p, 'lg')}</p>
        ${compareCta(p)}
      </div>
      <dl class="mt-2 divide-y divide-slate-100">
        ${comparison
          .map(
            (r) => `
        <div class="flex items-center justify-between gap-4 px-1 py-3.5 text-sm">
          <dt class="text-slate-600">${r.feature}</dt>
          <dd class="text-right">${comparisonCell(r.values[i])}</dd>
        </div>`,
          )
          .join('')}
      </dl>
    </div>`,
      )
      .join('')}
  </div>`
}

function comparisonTable(category: PlanCategory): string {
  const comingSoon = category.plans.every((p) => p.comingSoon)
  return `
  <div class="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-3 shadow-xl shadow-slate-900/5 sm:p-5">
    <div class="pointer-events-none absolute inset-x-12 top-0 h-px bg-linear-to-r from-transparent via-brand-400 to-transparent" aria-hidden="true"></div>
    <div class="${comingSoon ? 'blur-[3px] select-none' : ''}">
      ${comparisonMatrix(category)}
      ${comparisonStack(category)}
    </div>
    ${
      comingSoon
        ? `<div class="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/40">
        ${comingSoonBadge}
        <a href="${routes.contact}" class="btn-primary">Get notified ${icon('arrow-right', 'h-4 w-4')}</a>
      </div>`
        : ''
    }
  </div>`
}

const html = (groups: PlanGroup[]) => `
<section id="plans" class="relative bg-slate-50">
  <div data-nav="dark" class="relative isolate overflow-hidden bg-ink-950 pt-36 pb-44 sm:pt-40">
    <div class="pointer-events-none absolute -top-56 left-1/2 -z-10 h-[520px] w-[1000px] -translate-x-1/2 rounded-full bg-brand-600/30 blur-[140px]" aria-hidden="true"></div>
    <div class="pointer-events-none absolute -bottom-20 -left-32 -z-10 h-80 w-80 rounded-full bg-brand-400/15 blur-3xl" aria-hidden="true"></div>
    <!-- Antigravity particle field (WebGL2). Without WebGL2 the grid + glows above remain. -->
    <div id="pricing-antigravity" class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true"></div>
    <!-- Readability scrim: keeps the headline and tabs crisp when the ring passes behind them -->
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_45%_40%_at_50%_42%,rgb(7_14_33/0.7),transparent_75%)]" aria-hidden="true"></div>
    <!-- Same layered wave edge as the home hero, blending into the slate-50 plans area -->
    <svg class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 w-full text-slate-50 sm:h-32" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
      <path fill="currentColor" fill-opacity="0.25" d="M0,64 C180,112 360,24 600,56 C840,88 1020,136 1200,104 C1320,82 1390,60 1440,52 L1440,160 L0,160 Z" />
      <path fill="currentColor" fill-opacity="0.5" d="M0,100 C220,60 420,132 660,108 C900,84 1080,48 1260,80 C1350,96 1400,110 1440,104 L1440,160 L0,160 Z" />
      <path fill="currentColor" d="M0,128 C240,100 480,150 720,132 C960,114 1200,96 1440,124 L1440,160 L0,160 Z" />
    </svg>

    <div class="reveal mx-auto max-w-4xl px-6 text-center">
      <span class="eyebrow-dark">${icon('wallet', 'h-3.5 w-3.5')} Pricing</span>
      <h1 class="mt-6 text-4xl leading-[1.1] font-extrabold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
        Simple, affordable plans. <span class="gradient-text animate-shimmer">No hidden fees.</span>
      </h1>
      <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
        Choose the right plan for your website, app or cloud workload, with secure hosting, expert development and DevOps support.
      </p>

      <div role="tablist" aria-label="Product" class="mt-10 inline-flex max-w-full flex-wrap justify-center gap-1 rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur">
        ${tabs(groups, groups[0].id, 'group')}
      </div>
      <div class="mt-4 flex min-h-11 items-center justify-center">
        <div id="plans-subtabs" role="tablist" aria-label="Cloud service" class="inline-flex max-w-full flex-wrap justify-center gap-1 rounded-full border border-white/10 bg-ink-900/70 p-1"></div>
        <p id="plans-note" class="text-sm text-slate-500">All prices in USD.</p>
      </div>
    </div>
  </div>

  <!-- Small bottom padding: the next section (same bg) brings its own top spacing; the open comparison adds its own pb -->
  <div class="relative mx-auto -mt-28 max-w-7xl px-6 pb-8 sm:pb-10">
    <div id="plans-panel" role="tabpanel" tabindex="-1" class="focus:outline-none"></div>

    <div class="mt-14 flex flex-col items-center gap-3 text-center">
      <p class="text-sm text-slate-500">Not sure which plan fits? See every feature side by side.</p>
      <button id="plans-compare-toggle" type="button" class="btn-secondary !pr-3" aria-expanded="false" aria-controls="plans-compare">
        ${icon('grid', 'h-4 w-4 text-brand-600')}
        <span data-label>Compare all features</span>
        <span class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600">${icon('chevron-down', 'h-3.5 w-3.5 transition duration-300')}</span>
      </button>
    </div>
    <div id="plans-compare" inert>
      <div>
        <div class="px-1 pt-12 pb-10 sm:pb-14">
          <div class="mx-auto max-w-2xl text-center">
            <span class="eyebrow">Plan comparison</span>
            <h2 class="mt-4 text-2xl font-bold tracking-tight text-balance text-slate-900 sm:text-3xl">
              Experience more with <span class="text-brand-600">VavenCloud add-ons</span>
            </h2>
            <p class="mt-3 text-slate-600">Every feature and limit for each plan, in one place.</p>
          </div>
          <div id="plans-compare-table" class="mt-10"></div>
        </div>
      </div>
    </div>
  </div>
</section>`

/**
 * Tabbed plan picker: main tabs (Web Hosting / Cloud Services), sub-tabs for groups
 * with several categories, plan cards and a collapsible comparison table.
 * Supports deep links: /pricing/#compute or /pricing/#cloud-services opens that tab.
 */
function initPricing(groups: PlanGroup[]): void {
  const section = qs('#plans')
  const groupList = qs('[role="tablist"][aria-label="Product"]', section)
  const subTabs = qs('#plans-subtabs', section)
  const note = qs('#plans-note', section)
  const panel = qs('#plans-panel', section)
  const compare = qs('#plans-compare', section)
  const compareTable = qs('#plans-compare-table', section)
  const compareToggle = qs<HTMLButtonElement>('#plans-compare-toggle', section)

  let group = groups[0]
  let category = group.categories[0]

  const render = () => {
    qsa<HTMLButtonElement>('[data-group]', groupList).forEach((tab) => {
      const active = tab.dataset.group === group.id
      tab.setAttribute('aria-selected', String(active))
      tab.tabIndex = active ? 0 : -1
    })

    const hasSubTabs = group.categories.length > 1
    subTabs.hidden = !hasSubTabs
    note.hidden = hasSubTabs
    subTabs.innerHTML = hasSubTabs ? tabs(group.categories, category.id, 'category') : ''
    panel.setAttribute('aria-labelledby', `tab-${hasSubTabs ? category.id : group.id}`)

    const { plans } = category
    const showDescription = plans.some((p) => p.description)
    panel.innerHTML = `
      <div class="grid gap-6 pt-4 ${gridLayout[plans.length] ?? gridLayout[5]}">
        ${plans.map((p, i) => planCard(p, i, showDescription)).join('')}
      </div>`
    compareTable.innerHTML = comparisonTable(category)
  }

  const select = (groupId: string, categoryId?: string) => {
    group = groups.find((g) => g.id === groupId) ?? group
    category = group.categories.find((c) => c.id === categoryId) ?? group.categories[0]
    render()
  }

  /** Click + roving-tabindex arrow-key navigation (WAI-ARIA tabs pattern). */
  const wireTablist = (list: HTMLElement, attr: 'group' | 'category') => {
    list.addEventListener('click', (e) => {
      const tab = (e.target as HTMLElement).closest<HTMLButtonElement>(`[data-${attr}]`)
      if (!tab) return
      if (attr === 'group') select(tab.dataset.group!)
      else select(group.id, tab.dataset.category)
      qs<HTMLButtonElement>(`#tab-${tab.dataset[attr]}`, section).focus()
    })
    list.addEventListener('keydown', (e) => {
      const items = qsa<HTMLButtonElement>(`[data-${attr}]`, list)
      const current = items.indexOf(document.activeElement as HTMLButtonElement)
      if (current < 0) return
      const next = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: items.length - 1 }[e.key]
      if (next === undefined) return
      e.preventDefault()
      items[(next + items.length) % items.length].click()
    })
  }
  wireTablist(groupList, 'group')
  wireTablist(subTabs, 'category')

  // Mobile comparison: plan switcher (delegated, since the table re-renders on every tab change)
  compareTable.addEventListener('click', (e) => {
    const tab = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-compare-plan]')
    if (!tab) return
    const index = tab.dataset.comparePlan
    qsa<HTMLButtonElement>('[data-compare-plan]', compareTable).forEach((t) => t.setAttribute('aria-selected', String(t === tab)))
    qsa('[data-compare-col]', compareTable).forEach((col) => (col.hidden = col.dataset.compareCol !== index))
  })

  compareToggle.addEventListener('click', () => {
    const open = compareToggle.getAttribute('aria-expanded') !== 'true'
    compareToggle.setAttribute('aria-expanded', String(open))
    qs('[data-label]', compareToggle).textContent = open ? 'Hide all features' : 'Compare all features'
    qs('svg', compareToggle).classList.toggle('rotate-180', open)
    compare.classList.toggle('is-open', open)
    compare.inert = !open
  })

  // Deep link: match the hash against a group id or a category id (e.g. navbar → Hosting → Cloud Services).
  // Returns false for other hashes (#faq, #contact...) so they keep normal anchor behaviour.
  const openFromHash = () => {
    const hash = location.hash.slice(1)
    const match = groups.find((g) => g.id === hash) ?? groups.find((g) => g.categories.some((c) => c.id === hash))
    if (!match) return false
    select(match.id, hash)
    return true
  }
  if (!openFromHash()) render()
  // Same-page navbar clicks only change the hash, so re-select and bring the tabs into view
  window.addEventListener('hashchange', () => {
    if (openFromHash()) groupList.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

/** Brand-blue particle ring behind the pricing headline. Lighter on phones to save GPU/battery. */
function initParticles(): void {
  const mobile = isMobileViewport()
  mountAntigravity(qs('#pricing-antigravity'), {
    colors: ['#0f828d', '#8dd4dd', '#54b2bd', '#b8e8ee'], // brand-500, -300, -400, -200
    count: mobile ? 700 : 1400,
    magnetRadius: 10,
    ringRadius: 7,
    particleSize: 0.9,
    ambient: 0.2,
    opacity: 0.85,
    // Tabs live inside the hero, so clicking them shouldn't blast the particles away
    clickBurst: false,
    maxDevicePixelRatio: mobile ? 1.25 : 1.5,
  })
}

export function pricingSection({ groups = defaultGroups }: { groups?: PlanGroup[] } = {}): Section {
  return {
    html: html(groups),
    init() {
      initParticles()
      initPricing(groups)
    },
  }
}
