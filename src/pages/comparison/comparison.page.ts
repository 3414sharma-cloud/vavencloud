import './comparison.css'
import { v5Nav } from '@/pages/v5/v5.shell.ts'
import { createPage } from '@/app/create-page.ts'
import { routes } from '@/app/routes.ts'
import type { Section } from '@/app/types.ts'
import { brandLogos } from '@/modules/track-record/brand-logos.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import {
  HOURS,
  aws,
  awsBusiness,
  awsEnterprise,
  azure,
  azureProfessionalDirect,
  azureStandard,
  hireAnnual,
  managedFacts,
  match,
  monthly,
  pricesCheckedOn,
  sizes,
  spendOptions,
  vavenManaged,
  type Kind,
} from './comparison.data.ts'

/*
 * The comparison page (/comparison/): AWS, Azure and VavenCloud side by side, in two tabs.
 *  1. Cloud servers: a row per server where you pick its size (vCPU and RAM) and how many; each cloud's monthly
 *     price and what you save with VavenCloud update as you change it, with the total underneath.
 *  2. Managed service: what each one charges to have someone on call at your monthly cloud bill, and what that
 *     covers. The numbers are in comparison.data.ts.
 */

const usd = (n: number, decimals = 2) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
const usd0 = (n: number) => usd(n, 0)

/** A cloud's logo (as in the logo strip under the hero), with its name for screen readers */
const provider = (name: 'AWS' | 'Azure') => {
  const l = brandLogos[name]
  if (!l) return name
  const [, , w, h] = l.viewBox.split(' ').map(Number)
  const height = l.wordmark ? 24 : 20
  return `<svg width="${Math.round((height * w) / h)}" height="${height}" viewBox="${l.viewBox}" fill="currentColor" aria-hidden="true">${l.body}</svg>${l.wordmark ? `<span class="sr-only">${name}</span>` : `<span>${name}</span>`}`
}
const vaven = '<span class="cp-vc">VavenCloud</span>'

const hero = (): Section => ({
  html: `
<section id="top" class="band-linen cp-hero -mt-18 border-b border-neutral-200 dark:border-neutral-800" aria-labelledby="comparison-title">
  <div class="container-page">
    <p class="cp-kicker">Price comparison</p>
    <h1 id="comparison-title" class="cp-title">AWS, Azure or VavenCloud: <em>what you’d actually pay.</em></h1>
    <p class="cp-lead">Choose your servers and see each cloud’s monthly price side by side. Then see what it costs to have someone on call to run them.</p>
  </div>
</section>`,
})

/* ---------- Tab 1: cloud servers ---------- */

interface Row {
  size: number
  qty: number
}

/** Where it starts: two small servers, a medium and a large */
const startRows = (): Row[] => [
  { size: 1, qty: 2 },
  { size: 2, qty: 1 },
  { size: 3, qty: 1 },
]
const MAX_ROWS = 8

const sizeOptions = (selected: number) =>
  sizes
    .map((s, i) => `<option value="${i}"${i === selected ? ' selected' : ''}>${s.vcpu} vCPU · ${s.ram} GB</option>`)
    .join('')
const qtyOptions = (selected: number) =>
  Array.from(
    { length: 10 },
    (_, i) => `<option value="${i + 1}"${i + 1 === selected ? ' selected' : ''}>× ${i + 1}</option>`,
  ).join('')

/** One row's prices (monthly, for its quantity) on each cloud */
function priced(row: Row, kind: Kind) {
  const size = sizes[row.size]
  const a = match(aws[kind], size)
  const z = match(azure[kind], size)
  return {
    size,
    a,
    z,
    aws: monthly(a) * row.qty,
    azure: monthly(z) * row.qty,
    vaven: size.monthly * row.qty,
  }
}

/** What you save by choosing VavenCloud over the cheaper of the two, as a cell */
function saving(cheaper: number, vaven: number, cheaperName: string) {
  const diff = cheaper - vaven
  if (Math.abs(diff) < 0.005) return `<span class="cp-price">Same</span><span class="cp-sub">as ${cheaperName}</span>`
  return diff > 0
    ? `<span class="cp-price cp-save">Save ${usd(diff)}</span><span class="cp-sub">${Math.round((diff / cheaper) * 100)}% less than ${cheaperName}</span>`
    : `<span class="cp-price cp-more">+${usd(-diff)}</span><span class="cp-sub">${Math.round((-diff / cheaper) * 100)}% more than ${cheaperName}</span>`
}

const cheaperOf = (a: number, z: number) => (a <= z ? { value: a, name: 'AWS' } : { value: z, name: 'Azure' })

function rowCells(row: Row, kind: Kind) {
  const p = priced(row, kind)
  const per = (n: number, unit: number) => (n > 1 ? `${n} × ${usd(unit)} · ` : '')
  const cheap = cheaperOf(p.aws, p.azure)
  return {
    aws: `<span class="cp-price">${usd(p.aws)}</span><span class="cp-sub">${per(row.qty, monthly(p.a))}${p.a.name} · ${p.a.vcpu} vCPU · ${p.a.ram} GB</span>`,
    azure: `<span class="cp-price">${usd(p.azure)}</span><span class="cp-sub">${per(row.qty, monthly(p.z))}${p.z.name} · ${p.z.vcpu} vCPU · ${p.z.ram} GB</span>`,
    vaven: `<span class="cp-price">${usd(p.vaven)}</span><span class="cp-sub">${per(row.qty, p.size.monthly)}${p.size.name} · ${p.size.vcpu} vCPU · ${p.size.ram} GB · ${p.size.disk}</span>`,
    save: saving(cheap.value, p.vaven, cheap.name),
  }
}

const serverRow = (row: Row, i: number, kind: Kind, removable: boolean) => {
  const c = rowCells(row, kind)
  return `
          <tr data-row="${i}">
            <th scope="row" class="cp-config">
              <div class="cp-controls">
                <label class="sr-only" for="cp-size-${i}">Server ${i + 1}: size</label>
                <select class="cp-select" id="cp-size-${i}" data-size>${sizeOptions(row.size)}</select>
                <label class="sr-only" for="cp-qty-${i}">Server ${i + 1}: how many</label>
                <select class="cp-select cp-select--qty" id="cp-qty-${i}" data-qty>${qtyOptions(row.qty)}</select>
                <button type="button" class="cp-remove" data-remove aria-label="Remove server ${i + 1}"${removable ? '' : ' hidden'}>${icon('x', 'h-4 w-4')}</button>
              </div>
            </th>
            <td data-label="AWS" data-cell="aws">${c.aws}</td>
            <td data-label="Azure" data-cell="azure">${c.azure}</td>
            <td data-label="VavenCloud" class="cp-us" data-cell="vaven">${c.vaven}</td>
            <td data-label="You save" data-cell="save">${c.save}</td>
          </tr>`
}

const totals = (rows: Row[], kind: Kind) => {
  const sum = rows.reduce(
    (t, r) => {
      const p = priced(r, kind)
      return { aws: t.aws + p.aws, azure: t.azure + p.azure, vaven: t.vaven + p.vaven }
    },
    { aws: 0, azure: 0, vaven: 0 },
  )
  return { ...sum, cheap: cheaperOf(sum.aws, sum.azure) }
}

const serversTable = (rows: Row[], kind: Kind) => {
  const t = totals(rows, kind)
  return `
      <div class="cp-table-wrap card">
        <table class="cp-table">
          <thead>
            <tr>
              <th scope="col" class="cp-corner">Your servers</th>
              <th scope="col" class="cp-head">${provider('AWS')}</th>
              <th scope="col" class="cp-head">${provider('Azure')}</th>
              <th scope="col" class="cp-head cp-us">${vaven}</th>
              <th scope="col" class="cp-head">You save</th>
            </tr>
          </thead>
          <tbody data-rows>${rows.map((r, i) => serverRow(r, i, kind, rows.length > 1)).join('')}
          </tbody>
          <tfoot>
            <tr data-total>
              <th scope="row">Total a month</th>
              <td data-label="AWS" data-total="aws"><span class="cp-price">${usd(t.aws)}</span></td>
              <td data-label="Azure" data-total="azure"><span class="cp-price">${usd(t.azure)}</span></td>
              <td data-label="VavenCloud" class="cp-us" data-total="vaven"><span class="cp-price">${usd(t.vaven)}</span></td>
              <td data-label="You save" data-total="save">${saving(t.cheap.value, t.vaven, t.cheap.name)}</td>
            </tr>
          </tfoot>
        </table>
      </div>`
}

/** The big numbers above the table: what each cloud costs for these servers, as bars, and the saving a year */
const summary = (rows: Row[], kind: Kind) => {
  const t = totals(rows, kind)
  const max = Math.max(t.aws, t.azure, t.vaven)
  const diff = t.cheap.value - t.vaven
  const bar = (label: string, value: number, us = false) => `
        <div class="cp-bar${us ? ' cp-bar--us' : ''}">
          <p class="cp-bar-label">${label}</p>
          <p class="cp-bar-value">${usd0(value)}<span> a month</span></p>
          <span class="cp-bar-track" aria-hidden="true"><i style="width:${((value / max) * 100).toFixed(1)}%"></i></span>
        </div>`
  const headline =
    diff > 0.005
      ? `With VavenCloud you’d pay <b>${usd0(diff)} less every month</b> than on ${t.cheap.name}, <b>${usd0(diff * 12)} a year</b>.`
      : diff < -0.005
        ? `For these servers ${t.cheap.name} comes out ${usd0(-diff)} a month cheaper on price alone. VavenCloud adds the people who run them.`
        : `For these servers the price is the same as ${t.cheap.name}.`
  return `
      <div class="cp-summary" data-summary>
        <p class="cp-headline">${headline}</p>
        <div class="cp-bars">
          ${bar('AWS', t.aws)}
          ${bar('Azure', t.azure)}
          ${bar('VavenCloud', t.vaven, true)}
        </div>
      </div>`
}

const serversPanel = () => `
    <div class="cp-panel-head">
      <p class="cp-panel-lead">Pick a size for each server and how many you run. Prices are per month, on demand.</p>
      <div class="cp-kinds" role="group" aria-label="Compare against">
        <button type="button" class="cp-kind" data-kind="steady" aria-pressed="true">Steady performance</button>
        <button type="button" class="cp-kind" data-kind="burst" aria-pressed="false">Burstable (cheapest)</button>
      </div>
    </div>
    <p class="cp-kind-note" data-kind-note>Compared with each cloud’s compute-optimised and general-purpose servers: full performance all the time, what a production server usually needs.</p>
    <div data-summary-slot>${summary(startRows(), 'steady')}</div>
    <div data-table-slot>${serversTable(startRows(), 'steady')}</div>
    <button type="button" class="cp-add" data-add>${icon('plus', 'h-4 w-4')}Add a server</button>`

const kindNotes: Record<Kind, string> = {
  steady:
    'Compared with each cloud’s compute-optimised and general-purpose servers: full performance all the time, what a production server usually needs.',
  burst:
    'Compared with each cloud’s cheapest family (AWS T3, Azure B-series): fine for light or spiky workloads, but they slow down under sustained load.',
}

/* ---------- Tab 2: managed service ---------- */

const MANAGED_DEFAULT = 2_500

const plan = (name: string, price: number, how: string, other?: number) =>
  `<span class="cp-plan">${name}</span><span class="cp-price">${usd0(price)}<small> a month</small></span><span class="cp-sub">${how}</span>${other === undefined ? '' : diffChip(price, other)}`

/** How far this plan is from VavenCloud's, as a small tag under the price */
const diffChip = (price: number, vavenPrice: number) => {
  const d = Math.round(price - vavenPrice)
  if (d === 0) return ''
  return d > 0
    ? `<span class="cp-chip cp-chip--good">VavenCloud ${usd0(d)} less</span>`
    : `<span class="cp-chip">VavenCloud ${usd0(-d)} more</span>`
}

function managedPrices(spend: number) {
  const entry = { aws: awsBusiness(spend), azure: azureStandard, vaven: vavenManaged.managed }
  const premium = { aws: awsEnterprise(spend), azure: azureProfessionalDirect, vaven: vavenManaged.partner }
  return {
    entry: {
      aws: plan(
        'Business Support+',
        entry.aws,
        entry.aws <= 29 ? 'The $29 minimum' : '9% of your bill, minimum $29',
        entry.vaven,
      ),
      azure: plan('Standard', entry.azure, 'A flat monthly fee', entry.vaven),
      vaven: plan('Managed', entry.vaven, 'From, fixed monthly fee'),
    },
    premium: {
      aws: plan(
        'Enterprise Support',
        premium.aws,
        premium.aws <= 5_000 ? 'The $5,000 minimum' : '10% of your bill, minimum $5,000',
        premium.vaven,
      ),
      azure: plan('Professional Direct', premium.azure, 'A flat monthly fee', premium.vaven),
      vaven: plan('Partner', premium.vaven, 'From, with a named lead engineer'),
    },
  }
}

const managedPanel = () => {
  const p = managedPrices(MANAGED_DEFAULT)
  return `
    <div class="cp-panel-head">
      <p class="cp-panel-lead">What each one charges to have someone on call, and what that actually covers.</p>
      <label class="cp-spend">
        <span>Your monthly cloud bill</span>
        <select class="cp-select" data-spend>${spendOptions.map((s) => `<option value="${s}"${s === MANAGED_DEFAULT ? ' selected' : ''}>${usd0(s)}</option>`).join('')}</select>
      </label>
    </div>
    <div class="cp-table-wrap card">
      <table class="cp-table cp-table--managed">
        <thead>
          <tr>
            <th scope="col" class="cp-corner"></th>
            <th scope="col" class="cp-head">${provider('AWS')}</th>
            <th scope="col" class="cp-head">${provider('Azure')}</th>
            <th scope="col" class="cp-head cp-us">${vaven}</th>
          </tr>
        </thead>
        <tbody>
          <tr data-plan="entry">
            <th scope="row">Entry plan, a month</th>
            <td data-label="AWS" data-cell="aws">${p.entry.aws}</td>
            <td data-label="Azure" data-cell="azure">${p.entry.azure}</td>
            <td data-label="VavenCloud" class="cp-us" data-cell="vaven">${p.entry.vaven}</td>
          </tr>
          <tr data-plan="premium">
            <th scope="row">Top plan, a month</th>
            <td data-label="AWS" data-cell="aws">${p.premium.aws}</td>
            <td data-label="Azure" data-cell="azure">${p.premium.azure}</td>
            <td data-label="VavenCloud" class="cp-us" data-cell="vaven">${p.premium.vaven}</td>
          </tr>
          ${managedFacts
            .map(
              (f) => `
          <tr>
            <th scope="row">${f.label}</th>
            <td data-label="AWS">${f.aws}</td>
            <td data-label="Azure">${f.azure}</td>
            <td data-label="VavenCloud" class="cp-us">${f.vaven}</td>
          </tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <p class="cp-hire"><b>For reference:</b> hiring one senior DevOps engineer in the US costs around ${usd0(hireAnnual)} a year, about ${usd0(hireAnnual / 12)} a month, and they still can’t fix your code at 3am on their own.</p>`
}

/* ---------- The page ---------- */

const tool = (): Section => ({
  html: `
<section id="compare" class="v2-section" aria-labelledby="compare-title">
  <div class="container-page">
    <div class="max-w-4xl">
      ${sectionHeading({
        id: 'compare-title',
        title: 'Same servers. <em>Same cover. Side by side.</em>',
        description: 'Change anything below and the prices update.',
      })}
    </div>
    <div class="cp-tabs" role="tablist" aria-label="What to compare">
      <button type="button" role="tab" id="cp-tab-servers" class="cp-tab" aria-selected="true" aria-controls="cp-panel-servers" data-tab="servers">Cloud servers</button>
      <button type="button" role="tab" id="cp-tab-managed" class="cp-tab" aria-selected="false" aria-controls="cp-panel-managed" data-tab="managed" tabindex="-1">Managed service</button>
    </div>
    <div role="tabpanel" id="cp-panel-servers" class="cp-panel" aria-labelledby="cp-tab-servers" data-panel="servers">${serversPanel()}
    </div>
    <div role="tabpanel" id="cp-panel-managed" class="cp-panel" aria-labelledby="cp-tab-managed" data-panel="managed" hidden>${managedPanel()}
    </div>
    <div class="cp-notes">
      <h2 class="cp-notes-title">How we compared</h2>
      <ul>
        <li><b>Servers.</b> AWS EC2 in US East (N. Virginia) and Azure virtual machines in East US, Linux, on demand, ${HOURS} hours a month. For each size we price the cheapest machine with at least that many vCPUs and that much RAM. AWS and Azure prices are for the server only: disk, bandwidth and backups cost extra there. VavenCloud’s price includes the SSD shown.</li>
        <li><b>Managed service.</b> AWS Business Support+ and Enterprise Support, and Azure Standard and Professional Direct, at their published prices. Their support plans give you help from the cloud’s engineers; they don’t run your product for you.</li>
        <li><b>VavenCloud.</b> Server prices are from <a href="https://vavencloud.com/pricing" target="_blank" rel="noopener">our price list<span class="sr-only"> (opens in a new tab)</span></a>. Managed plans are a fixed monthly fee agreed after a free review; the figures shown are starting points.</li>
        <li><b>Checked ${pricesCheckedOn}.</b> Cloud prices change, so check the calculators before you decide: <a href="https://calculator.aws/" target="_blank" rel="noopener">AWS<span class="sr-only"> (opens in a new tab)</span></a> · <a href="https://azure.microsoft.com/en-us/pricing/calculator/" target="_blank" rel="noopener">Azure<span class="sr-only"> (opens in a new tab)</span></a>.</li>
      </ul>
    </div>
  </div>
</section>`,
  init() {
    initTool(qs('#compare'))
  },
})

const cta = (): Section => ({
  html: `
<section id="talk" class="v2-section pt-0" aria-labelledby="talk-title">
  <div class="container-page">
    <div class="cp-cta surface-ink">
      <div>
        <h2 id="talk-title" class="cp-cta-title">Want the real number for your product?</h2>
        <p class="cp-cta-text">A free 45-minute production review with a senior engineer, not a salesperson. You keep the written roadmap either way.</p>
      </div>
      <a href="${routes.book}" class="btn-primary !px-7 !py-3.5 !text-base">Book a free production review ${icon('arrow-right', 'h-4 w-4')}</a>
    </div>
  </div>
</section>`,
})

/* ---------- Making it work ---------- */

function initTool(root: HTMLElement): void {
  /* Tabs: arrow keys move between them, and #managed in the address opens the second */
  const tabs = qsa<HTMLButtonElement>('[data-tab]', root)
  const panels = qsa('[data-panel]', root)
  const select = (name: string, focus = false) => {
    tabs.forEach((t) => {
      const on = t.dataset.tab === name
      t.setAttribute('aria-selected', String(on))
      t.tabIndex = on ? 0 : -1
      if (on && focus) t.focus()
    })
    panels.forEach((p) => (p.hidden = p.dataset.panel !== name))
    history.replaceState(null, '', name === 'managed' ? '#managed' : window.location.pathname)
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t.dataset.tab!))
    t.addEventListener('keydown', (e) => {
      const to =
        e.key === 'ArrowRight'
          ? i + 1
          : e.key === 'ArrowLeft'
            ? i - 1
            : e.key === 'Home'
              ? 0
              : e.key === 'End'
                ? tabs.length - 1
                : -1
      if (to < 0) return
      e.preventDefault()
      select(tabs[(to + tabs.length) % tabs.length].dataset.tab!, true)
    })
  })
  if (window.location.hash === '#managed') select('managed')

  /* Cloud servers: change a row's size or number and only its prices and the totals change */
  const servers = qs('[data-panel="servers"]', root)
  const rows = startRows()
  let kind: Kind = 'steady'

  const refreshRow = (tr: HTMLElement, i: number) => {
    const c = rowCells(rows[i], kind)
    qs('[data-cell="aws"]', tr).innerHTML = c.aws
    qs('[data-cell="azure"]', tr).innerHTML = c.azure
    qs('[data-cell="vaven"]', tr).innerHTML = c.vaven
    qs('[data-cell="save"]', tr).innerHTML = c.save
  }
  const refresh = () => {
    qsa('[data-row]', servers).forEach((tr, i) => refreshRow(tr, i))
    const t = totals(rows, kind)
    qs('[data-total="aws"]', servers).innerHTML = `<span class="cp-price">${usd(t.aws)}</span>`
    qs('[data-total="azure"]', servers).innerHTML = `<span class="cp-price">${usd(t.azure)}</span>`
    qs('[data-total="vaven"]', servers).innerHTML = `<span class="cp-price">${usd(t.vaven)}</span>`
    qs('[data-total="save"]', servers).innerHTML = saving(t.cheap.value, t.vaven, t.cheap.name)
    // The bars grow and shrink in place (they animate), the words change with them
    const next = document.createElement('div')
    next.innerHTML = summary(rows, kind)
    const now = qs('[data-summary]', servers)
    qs('.cp-headline', now).innerHTML = qs('.cp-headline', next).innerHTML
    qsa('.cp-bar', now).forEach((bar, i) => {
      const from = qsa('.cp-bar', next)[i]
      qs('.cp-bar-value', bar).innerHTML = qs('.cp-bar-value', from).innerHTML
      qs<HTMLElement>('.cp-bar-track i', bar).style.width = qs<HTMLElement>('.cp-bar-track i', from).style.width
    })
  }
  /** Adding or removing a server rebuilds the rows (the selects start from the state) */
  const rebuild = () => {
    qs('[data-rows]', servers).innerHTML = rows.map((r, i) => serverRow(r, i, kind, rows.length > 1)).join('')
    qs<HTMLButtonElement>('[data-add]', servers).disabled = rows.length >= MAX_ROWS
    refresh()
  }

  servers.addEventListener('change', (e) => {
    const el = e.target as HTMLSelectElement
    const tr = el.closest<HTMLElement>('[data-row]')
    if (!tr) return
    const i = Number(tr.dataset.row)
    if (el.matches('[data-size]')) rows[i].size = Number(el.value)
    if (el.matches('[data-qty]')) rows[i].qty = Number(el.value)
    refresh()
  })
  servers.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const remove = target.closest<HTMLElement>('[data-remove]')
    if (remove) {
      rows.splice(Number(remove.closest<HTMLElement>('[data-row]')!.dataset.row), 1)
      rebuild()
      return
    }
    if (target.closest('[data-add]') && rows.length < MAX_ROWS) {
      rows.push({ size: 1, qty: 1 })
      rebuild()
      qsa<HTMLSelectElement>('[data-size]', servers).at(-1)?.focus()
      return
    }
    const k = target.closest<HTMLButtonElement>('[data-kind]')
    if (k) {
      kind = k.dataset.kind as Kind
      qsa('[data-kind]', servers).forEach((b) => b.setAttribute('aria-pressed', String(b === k)))
      qs('[data-kind-note]', servers).textContent = kindNotes[kind]
      refresh()
    }
  })

  /* Managed service: the price rows follow your monthly cloud bill */
  const managed = qs('[data-panel="managed"]', root)
  qs<HTMLSelectElement>('[data-spend]', managed).addEventListener('change', (e) => {
    const p = managedPrices(Number((e.target as HTMLSelectElement).value))
    ;(['entry', 'premium'] as const).forEach((tier) => {
      const tr = qs(`[data-plan="${tier}"]`, managed)
      qs('[data-cell="aws"]', tr).innerHTML = p[tier].aws
      qs('[data-cell="azure"]', tr).innerHTML = p[tier].azure
      qs('[data-cell="vaven"]', tr).innerHTML = p[tier].vaven
    })
  })
}

createPage({
  nav: v5Nav,
  sections: [hero(), tool(), cta()],
})
