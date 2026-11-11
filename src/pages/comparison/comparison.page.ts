import './comparison.css'
import { v5Nav } from '@/pages/v5/v5.shell.ts'
import { createPage } from '@/app/create-page.ts'
import { routes } from '@/app/routes.ts'
import type { Section } from '@/app/types.ts'
import { brandLogos } from '@/modules/track-record/brand-logos.ts'
import { qsa } from '@/shared/lib/dom.ts'
import { icon, type IconName } from '@/shared/ui/icons.ts'
import { logoMark } from '@/shared/ui/logo.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import {
  HOURS,
  aws,
  awsBusiness,
  azure,
  azureStandard,
  match,
  monthly,
  pricesCheckedOn,
  sizes,
  vavenManaged,
  type Kind,
} from './comparison.data.ts'

/*
 * The comparison page (/comparison/): AWS, Azure and VavenCloud side by side, in two tabs.
 * One after the other, no tabs:
 *  1. The servers: five fixed sizes, one of each; each cloud's monthly price and what you save with
 *     VavenCloud, with the total underneath.
 *  2. Someone to run them (#managed): each cloud's support plan beside VavenCloud's Managed plan, what it
 *     covers, and the month all in (the servers in part 1 plus the plan). The numbers are in comparison.data.ts.
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
    <p class="cp-lead">See what the same servers cost each month on AWS, Azure and VavenCloud, side by side. Then see what it costs to have someone on call to run them.</p>
  </div>
</section>`,
})

/* ---------- Tab 1: cloud servers ---------- */

interface Row {
  size: number
  qty: number
}

/** Where it starts: one of each size */
const startRows = (): Row[] => sizes.map((_, i) => ({ size: i, qty: 1 }))
/** Always compared against each cloud's steady-performance servers */
const KIND: Kind = 'steady'

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

/** What you save by choosing VavenCloud over the one it's measured against (Azure), as a cell */
function saving(cheaper: number, vaven: number, cheaperName: string) {
  const diff = cheaper - vaven
  if (Math.abs(diff) < 0.005) return `<span class="cp-price">Same</span><span class="cp-sub">as ${cheaperName}</span>`
  return diff > 0
    ? `<span class="cp-price cp-save">Save ${usd(diff)}</span><span class="cp-sub">${Math.round((diff / cheaper) * 100)}% less than ${cheaperName}</span>`
    : `<span class="cp-price cp-more">+${usd(-diff)}</span><span class="cp-sub">${Math.round((-diff / cheaper) * 100)}% more than ${cheaperName}</span>`
}

/** The saving is measured against Azure */
const cheaperOf = (_a: number, z: number) => ({ value: z, name: 'Azure' })

/** " (no 6 vCPU size on AWS)" when the nearest machine is bigger than the size asked for */
const noSize = (m: { vcpu: number }, wanted: number, cloud: string) =>
  m.vcpu > wanted ? ` (no ${wanted} vCPU size on ${cloud})` : ''

function rowCells(row: Row, kind: Kind) {
  const p = priced(row, kind)
  const per = (n: number, unit: number) => (n > 1 ? `${n} × ${usd(unit)} · ` : '')
  const cheap = cheaperOf(p.aws, p.azure)
  return {
    aws: `<span class="cp-price">${usd(p.aws)}</span><span class="cp-sub">${per(row.qty, monthly(p.a))}${p.a.name} · ${p.a.vcpu} vCPU · ${p.a.ram} GB${noSize(p.a, p.size.vcpu, 'AWS')}</span>`,
    azure: `<span class="cp-price">${usd(p.azure)}</span><span class="cp-sub">${per(row.qty, monthly(p.z))}${p.z.name} · ${p.z.vcpu} vCPU · ${p.z.ram} GB${noSize(p.z, p.size.vcpu, 'Azure')}</span>`,
    vaven: `<span class="cp-price">${usd(p.vaven)}</span><span class="cp-sub">${per(row.qty, p.size.monthly)}${p.size.name} · ${p.size.vcpu} vCPU · ${p.size.ram} GB · ${p.size.disk}</span>`,
    save: saving(cheap.value, p.vaven, cheap.name),
  }
}

const serverRow = (row: Row, i: number, kind: Kind) => {
  const c = rowCells(row, kind)
  return `
          <tr data-row="${i}">
            <th scope="row" class="cp-config">
              <span class="cp-fixed">${sizes[row.size].vcpu} vCPU · ${sizes[row.size].ram} GB<span class="cp-fixed-qty">× ${row.qty}</span></span>
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
          <tbody data-rows>${rows.map((r, i) => serverRow(r, i, kind)).join('')}
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
      </div>
      <p class="cp-kind-note">VavenCloud includes SSD storage in every plan. AWS and Azure charge separately for it.</p>`
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
      ? `With VavenCloud you’d pay <b>${usd(diff)} less every month</b> than on ${t.cheap.name}, <b>${usd(diff * 12)} a year</b>.`
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
    <p class="cp-kind-note">Prices are per month, on demand. Compared with each cloud’s compute-optimised and general-purpose servers: full performance all the time, what a production server usually needs.</p>
    <div data-summary-slot>${summary(startRows(), KIND)}</div>
    <div data-table-slot>${serversTable(startRows(), KIND)}</div>`

/* ---------- Part 2: someone to run them ---------- */

/* Part 2: explore who owns each task on each provider. */
type Cover = 'yes' | 'half' | 'you'
type Who = 'aws' | 'azure' | 'vaven'
interface Layer {
  icon: IconName
  name: string
  cover: Record<Who, [Cover, string]>
}

/** Bottom (what everything sits on) to top (your own code) */
const layers: Layer[] = [
  {
    icon: 'server',
    name: 'Servers',
    cover: {
      aws: ['yes', 'AWS keeps the hardware on'],
      azure: ['yes', 'Azure keeps the hardware on'],
      vaven: ['yes', 'On your cloud or ours'],
    },
  },
  {
    icon: 'activity',
    name: 'Watching for problems',
    cover: {
      aws: ['you', 'You set it up and watch it'],
      azure: ['you', 'You set it up and watch it'],
      vaven: ['yes', 'Watched by us, 24/7'],
    },
  },
  {
    icon: 'zap',
    name: 'Help when something breaks',
    cover: {
      aws: ['half', 'Advice within 30 min, you fix it'],
      azure: ['half', 'Advice within 1 hour, you fix it'],
      vaven: ['yes', 'Our engineer fixes it'],
    },
  },
  {
    icon: 'rocket',
    name: 'Putting updates live',
    cover: {
      aws: ['you', 'Your team runs them'],
      azure: ['you', 'Your team runs them'],
      vaven: ['yes', 'We handle your updates'],
    },
  },
  {
    icon: 'code',
    name: 'Fixes in your code',
    cover: {
      aws: ['you', 'Not covered'],
      azure: ['you', 'Not covered'],
      vaven: ['yes', 'Within your plan’s hours'],
    },
  },
]

const studioProviders: { who: Who; name: string; logo: string; plan: string }[] = [
  { who: 'aws', name: 'AWS', logo: provider('AWS'), plan: 'Business Support+' },
  { who: 'azure', name: 'Azure', logo: provider('Azure'), plan: 'Standard support' },
  { who: 'vaven', name: 'VavenCloud', logo: logoMark(24, 'studio-mark') + vaven, plan: 'Managed / starting price' },
]

const studioPrices = () => {
  const servers = totals(startRows(), KIND)
  const fee = { aws: awsBusiness(servers.aws), azure: azureStandard, vaven: vavenManaged.managed }
  return { servers, fee }
}

const studioView = (task: number, selected: Who, period: number) => {
  const layer = layers[task]
  const [state, note] = layer.cover[selected]
  const cloud = studioProviders.find(p => p.who === selected)!
  const { servers, fee } = studioPrices()
  const owner = state === 'yes' ? cloud.name : 'Your team'
  return `
    <div class="cx-scene" data-state="${state}">
      <div class="cx-scene-label"><span>FOLLOW THE WORK</span><span>0${task + 1} / 05</span></div>
      <div class="cx-network">
        <svg class="cx-wires" viewBox="0 0 600 260" preserveAspectRatio="none" aria-hidden="true"><path class="cx-wire-base" d="M90 130 H230 Q250 130 250 110 V75 Q250 55 275 55 H480 M250 110 V185 Q250 205 275 205 H480"/><path class="cx-wire-active" d="${state === 'yes' ? 'M90 130 H230 Q250 130 250 110 V75 Q250 55 275 55 H480' : 'M90 130 H230 Q250 130 250 150 V185 Q250 205 275 205 H480'}"/></svg>
        <div class="cx-source"><span class="cx-node-icon">${icon(layer.icon, 'h-6 w-6')}</span><strong>${layer.name}</strong><small>The work that needs doing</small></div>
        <div class="cx-destination cx-destination--cloud ${state === 'yes' ? 'is-active' : ''}"><span class="cx-node-icon">${icon('server', 'h-6 w-6')}</span><strong>${cloud.name}</strong><small>${state === 'yes' ? 'Handles this for you' : state === 'half' ? 'Gives you advice' : 'Not in this plan'}</small></div>
        <div class="cx-destination cx-destination--team ${state !== 'yes' ? 'is-active' : ''}"><span class="cx-node-icon">${icon('users', 'h-6 w-6')}</span><strong>Your team</strong><small>${state === 'yes' ? 'Can focus on your product' : 'Handles the work'}</small></div>
      </div>
      <div class="cx-answer"><span class="cx-answer-symbol">${icon(state === 'yes' ? 'check' : 'arrow-right', 'h-5 w-5')}</span><div><h5>${owner} takes it from here.</h5><p>${note}</p></div><span class="cx-answer-tag">${state === 'yes' ? 'Handled for you' : state === 'half' ? 'Advice + your team' : 'Your responsibility'}</span></div>
    </div>
    <div class="cx-price-strip"><div><span>${cloud.plan}</span><strong>${usd((servers[selected] + fee[selected]) * period)}<small> / ${period === 1 ? 'month' : 'year'}</small></strong></div><p>${usd(servers[selected] * period)} servers <b>+</b> ${usd(fee[selected] * period)} ${selected === 'vaven' ? 'management' : 'support'}</p></div>`
}

const managedPanel = () => `
  <div class="cx-studio">
    <header class="cx-intro"><div><span class="cx-eyebrow">THE OWNERSHIP EXPLORER</span><h4>Same task.<br><em>Different hands.</em></h4></div><p>Pick a task. Choose a cloud.<br>Follow the line to see who does the work.</p><span class="cx-intro-art" aria-hidden="true">?</span></header>
    <div class="cx-workspace">
      <nav class="cx-tasks" aria-label="Choose a task to compare"><span class="cx-control-label">01 / PICK A TASK</span>${layers.map((l, i) => `<button type="button" data-cx-task="${i}" aria-pressed="${i === 1}" aria-controls="cx-result"><span class="cx-task-number">0${i + 1}</span>${icon(l.icon, 'h-4 w-4')}<span>${l.name}</span>${icon('arrow-right', 'h-4 w-4')}</button>`).join('')}<p>Explore all five tasks to see what stays with you.</p></nav>
      <div class="cx-main"><div class="cx-toolbar"><div><span class="cx-control-label">02 / CHOOSE YOUR CLOUD</span><div class="cx-providers" role="group" aria-label="Cloud provider">${studioProviders.map(p => `<button type="button" data-cx-provider="${p.who}" aria-pressed="${p.who === 'vaven'}" aria-controls="cx-result">${p.logo}</button>`).join('')}</div></div><div class="cx-period" role="group" aria-label="Price period"><button type="button" data-cx-period="1" aria-pressed="true">Month</button><button type="button" data-cx-period="12" aria-pressed="false">Year</button></div></div>
      <div id="cx-result" aria-live="polite" aria-atomic="true">${studioView(1, 'vaven', 1)}</div></div>
    </div>
    <footer class="cx-footer"><span>${icon('check', 'h-4 w-4')}Same five servers in every comparison</span><p>AWS and Azure storage, bandwidth and backups cost extra. VavenCloud includes the SSD shown above; management is a starting price agreed after a free review.</p></footer>
  </div>`

function initStudio(): void {
  const studio = document.querySelector<HTMLElement>('.cx-studio')
  const result = studio?.querySelector<HTMLElement>('#cx-result')
  if (!studio || !result) return
  let task = 1
  let selected: Who = 'vaven'
  let period = 1
  const refresh = () => { result.innerHTML = studioView(task, selected, period) }
  qsa('[data-cx-task]', studio).forEach(button => button.addEventListener('click', () => {
    task = Number(button.dataset.cxTask)
    qsa('[data-cx-task]', studio).forEach(option => option.setAttribute('aria-pressed', String(option === button)))
    refresh()
  }))
  qsa('[data-cx-provider]', studio).forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.cxProvider as Who
    qsa('[data-cx-provider]', studio).forEach(option => option.setAttribute('aria-pressed', String(option === button)))
    refresh()
  }))
  qsa('[data-cx-period]', studio).forEach(button => button.addEventListener('click', () => {
    period = Number(button.dataset.cxPeriod)
    qsa('[data-cx-period]', studio).forEach(option => option.setAttribute('aria-pressed', String(option === button)))
    refresh()
  }))
}

/* ---------- The page ---------- */

/** The heading of each part: a number, a title and a line under it */
const partHead = (n: number, id: string, title: string, lead: string) => `
    <div class="cp-part-head">
      <span class="cp-part-n" aria-hidden="true">${n}</span>
      <div>
        <h3 id="${id}" class="cp-part-title">${title}</h3>
        <p class="cp-part-lead">${lead}</p>
      </div>
    </div>`

const tool = (): Section => ({
  init: () => initStudio(),
  html: `
<section id="compare" class="v2-section" aria-labelledby="compare-title">
  <div class="container-page">
    <div class="max-w-4xl">
      ${sectionHeading({
        id: 'compare-title',
        title: 'Compare the cost. <em>See who does the work.</em>',
        description: 'First the servers, then the people who run them, on AWS, Azure and VavenCloud.',
      })}
    </div>
    <section class="cp-part" aria-labelledby="cp-servers-title">${partHead(1, 'cp-servers-title', 'The servers', 'Five common sizes, one of each. What the same servers cost a month on each cloud.')}${serversPanel()}
    </section>
    <section id="managed" class="cp-part" aria-labelledby="cp-managed-title">${partHead(2, 'cp-managed-title', 'See who takes care of it', 'An interactive look at the work behind your monthly cost.')}${managedPanel()}
    </section>
    <div class="cp-notes">
      <h2 class="cp-notes-title">How we compared</h2>
      <ul>
        <li><b>Servers.</b> AWS prices are taken from the AWS console for EC2 in US East (Ohio). Azure prices are from Microsoft’s public pricing page for virtual machines in Central US. Both are Linux, on demand, ${HOURS} hours a month. For each size we price the cheapest machine with at least that many vCPUs and that much RAM. AWS and Azure prices are for the server only: disk, bandwidth and backups cost extra there. VavenCloud’s price includes the SSD shown.</li>
        <li><b>List prices.</b> These are AWS’s and Azure’s list prices. What you actually pay can vary by account, for example with discounts, reservations or credits.</li>
        <li><b>Managed service.</b> AWS Business Support+ and Azure Standard, at their published prices. AWS charges a share of your AWS bill, so its fee is worked out on the AWS server total above. Their support plans give you help from the cloud’s engineers; they don’t run your product for you.</li>
        <li><b>VavenCloud.</b> Server prices are our current monthly plans, with the SSD storage shown included. Managed plans are a fixed monthly fee agreed after a free review; the figures shown are starting points.</li>
        <li><b>Checked ${pricesCheckedOn}.</b> Cloud prices change, so check the calculators before you decide: <a href="https://calculator.aws/" target="_blank" rel="noopener">AWS<span class="sr-only"> (opens in a new tab)</span></a> · <a href="https://azure.microsoft.com/en-us/pricing/calculator/" target="_blank" rel="noopener">Azure<span class="sr-only"> (opens in a new tab)</span></a>.</li>
      </ul>
    </div>
  </div>
</section>`,
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

createPage({
  nav: v5Nav,
  sections: [hero(), tool(), cta()],
})
