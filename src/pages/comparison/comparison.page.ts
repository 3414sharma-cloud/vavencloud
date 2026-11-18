import './comparison.css'
import { v5Nav } from '@/pages/v5/v5.shell.ts'
import { createPage } from '@/app/create-page.ts'
import { routes } from '@/app/routes.ts'
import type { Section } from '@/app/types.ts'
import { brandLogos } from '@/modules/track-record/brand-logos.ts'
import { qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
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
 *  1. The servers: five fixed sizes, each compared on its own (no total: nobody buys one of every size);
 *     each cloud's monthly price for one server and what you save with VavenCloud.
 *  2. Someone to run them (#managed): each cloud's support plan beside VavenCloud's Managed plan, what it
 *     covers, and the monthly support or management fee. The numbers are in comparison.data.ts.
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
<section id="top" class="dark v5-hero-dark cp-hero" aria-labelledby="comparison-title">
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
              <span class="cp-fixed">${sizes[row.size].vcpu} vCPU · ${sizes[row.size].ram} GB</span>
            </th>
            <td data-label="AWS" data-cell="aws">${c.aws}</td>
            <td data-label="Azure" data-cell="azure">${c.azure}</td>
            <td data-label="VavenCloud" class="cp-us" data-cell="vaven">${c.vaven}</td>
            <td data-label="You save" data-cell="save">${c.save}</td>
          </tr>`
}

/*
 * Nobody buys one of every size, so the table has no "total" row: each row is one server, compared on its own,
 * and the summary above it speaks per server too.
 */
const serversTable = (rows: Row[], kind: Kind) => {
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
        </table>
      </div>
      <p class="cp-kind-note">VavenCloud includes SSD storage in every plan. AWS and Azure charge separately for it.</p>`
}

/**
 * The big numbers above the table, per server (never a sum of all the sizes): the saving on the smallest and
 * the largest size against Azure, and the biggest percentage saved on any size.
 */
const summary = (rows: Row[], kind: Kind) => {
  const each = rows.map((r) => {
    const p = priced({ ...r, qty: 1 }, kind)
    const cheap = cheaperOf(p.aws, p.azure)
    return { size: p.size, name: cheap.name, diff: cheap.value - p.vaven, pct: ((cheap.value - p.vaven) / cheap.value) * 100 }
  })
  const first = each[0]
  const last = each[each.length - 1]
  const all = each.every((e) => e.diff > 0.005)
  const lo = Math.min(...each.map((e) => e.diff))
  const hi = Math.max(...each.map((e) => e.diff))
  const best = Math.round(Math.max(...each.map((e) => e.pct)))
  const headline = all
    ? `Every size costs less on VavenCloud: <b>${usd0(lo)} to ${usd0(hi)} less a month per server</b> than on ${first.name}.`
    : `Compare one server at a time: find the size you need and see what it costs on each cloud.`
  const stat = (label: string, value: string, unit: string, us = false) => `
        <div class="cp-bar${us ? ' cp-bar--us' : ''}">
          <p class="cp-bar-label">${label}</p>
          <p class="cp-bar-value">${value}<span> ${unit}</span></p>
        </div>`
  const sizeName = (e: (typeof each)[number]) => `${e.size.vcpu} vCPU · ${e.size.ram} GB server`
  return `
      <div class="cp-summary" data-summary>
        <p class="cp-headline">${headline}</p>
        <div class="cp-bars">
          ${stat(sizeName(first), first.diff > 0 ? `Save ${usd0(first.diff)}` : usd0(first.diff), 'a month')}
          ${stat(sizeName(last), last.diff > 0 ? `Save ${usd0(last.diff)}` : usd0(last.diff), 'a month')}
          ${stat('Any one server', `Up to ${best}%`, `less than ${first.name}`, true)}
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
      aws: ['you', 'Managed on your side'],
      azure: ['you', 'Managed on your side'],
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

/** The monthly support or management fee, for one server (AWS's share of a one-server bill is its $29 minimum) */
const studioPrices = () => {
  const largest = priced({ size: sizes.length - 1, qty: 1 }, KIND)
  return { aws: awsBusiness(largest.aws), azure: azureStandard, vaven: vavenManaged.managed }
}

const kindLabel: Record<Cover, string> = { yes: 'Handled for you', half: 'Advice only, you fix it', you: 'You do it' }

const managedPanel = () => `
  <div class="cw-board" data-cw data-who="aws">
    <div class="cw-top">
      <div>
        <span class="cw-eyebrow">FOLLOW THE WIRES</span>
        <h4 class="cw-title">Every task is wired <em>to someone.</em></h4>
        <p class="cw-lead">Pick a platform and watch where each job goes.</p>
      </div>
      <div class="cw-tabs" role="group" aria-label="Platform">${studioProviders.map((p) => `<button type="button" data-cw-who="${p.who}" aria-pressed="${p.who === 'aws'}">${p.logo}</button>`).join('')}</div>
    </div>
    <div class="cw-diagram" tabindex="0" role="region" aria-label="Task ownership and monthly costs">
    <div class="cw-stage" data-cw-stage>
      <ul class="cw-tasks">${layers
        .map(
          (l, r) => `
        <li class="cw-task" data-cw-task="${r}" data-task-icon="${l.icon}" data-state="${l.cover.aws[0]}">
          <span class="cw-task-icon">${icon(l.icon, 'h-4 w-4')}</span>
          <span class="cw-task-text"><strong>${l.name}</strong><small data-cw-note>${l.cover.aws[1]}</small></span>
          <span class="cw-port" data-cw-port aria-hidden="true"></span>
        </li>`,
        )
        .join('')}
      </ul>
      <svg class="cw-wires" data-cw-wires aria-hidden="true"></svg>
      <div class="cw-dests">
        <div class="cw-dest cw-dest--cloud" data-cw-cloud>
          <span class="cw-port" data-cw-port aria-hidden="true"></span>
          <span class="cw-provider-logo" data-cw-cloud-logo>${provider('AWS')}</span>
          <small data-cw-cloud-count></small>
        </div>
        <div class="cw-dest cw-dest--team" data-cw-team>
          <span class="cw-port" data-cw-port aria-hidden="true"></span>
          <span class="cw-dest-icon">${icon('users', 'h-5 w-5')}</span>
          <strong>Self-managed</strong>
          <small data-cw-team-count></small>
        </div>
      </div>
      <div class="cw-cost-card" data-cw-cost>
        <span class="cw-port" data-cw-port aria-hidden="true"></span>
        <div class="cw-price" data-cw-price></div>
      </div>
      <div class="cw-cost-card cw-team-cost-card" data-cw-team-cost>
        <span class="cw-port" data-cw-port aria-hidden="true"></span>
        <div class="cw-price" data-cw-team-price></div>
      </div>
    </div>
    </div>
    <div class="cw-team-assumptions">
      <span>Estimate your management time</span>
      <label>Hours / month <input type="number" min="0" max="10000" step="1" value="20" data-cw-hours /></label>
      <label>Hourly rate (USD) <input type="number" min="0" max="10000" step="1" value="50" data-cw-rate /></label>
      <p>Illustrative inputs, not a market quote. Adjust to your management workload and rate; this is not a 24/7 staffing estimate.</p>
    </div>
    <p class="sr-only" aria-live="polite" data-cw-sr></p>
    <div class="cw-legend" aria-hidden="true">
      <span data-kind="yes"><i></i>Handled for you</span>
      <span data-kind="half"><i></i>Advice only, you fix it</span>
      <span data-kind="you"><i></i>You do it</span>
    </div>
    <footer class="cw-footer"><span>${icon('check', 'h-4 w-4')}Monthly support and management fees</span><p>Server costs are shown separately above. AWS support is calculated from that AWS server bill; VavenCloud management is a starting price agreed after a free review.</p></footer>
  </div>`

/**
 * Wires run from each task to whoever does it: the platform, or your team. "Advice only" tasks get a
 * dashed wire to the platform and a solid one to your team. Wires are drawn from the real positions of
 * the ports, so they follow the layout at any width. Switching platform re-draws them with a draw-in
 * animation and packets flowing along each wire. Until someone clicks, the platforms cycle by themselves
 * while the board is on screen. Reduced motion: no draw-in, no packets, no cycling.
 */
function initManaged(): void {
  const board = document.querySelector<HTMLElement>('[data-cw]')
  const stage = board?.querySelector<HTMLElement>('[data-cw-stage]')
  const svg = board?.querySelector<SVGSVGElement>('[data-cw-wires]')
  if (!board || !stage || !svg) return

  const motion = !prefersReducedMotion()
  const tasks = qsa('[data-cw-task]', board)
  const cloud = board.querySelector<HTMLElement>('[data-cw-cloud]')!
  const team = board.querySelector<HTMLElement>('[data-cw-team]')!
  const cost = board.querySelector<HTMLElement>('[data-cw-cost]')!
  const tabs = qsa('[data-cw-who]', board)
  const order: Who[] = ['aws', 'azure', 'vaven']
  const teamCost = board.querySelector<HTMLElement>('[data-cw-team-cost]')!
  const hoursInput = board.querySelector<HTMLInputElement>('[data-cw-hours]')!
  const rateInput = board.querySelector<HTMLInputElement>('[data-cw-rate]')!
  let who: Who = 'aws'
  let cycle = 0
  let userPicked = false
  let visible = false

  const port = (el: Element, box: DOMRect) => {
    const r = el.querySelector('[data-cw-port]')!.getBoundingClientRect()
    return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top }
  }

  const draw = (animate: boolean) => {
    const box = stage.getBoundingClientRect()
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`)
    const to = { cloud: port(cloud, box), team: port(team, box) }
    svg.innerHTML = layers
      .map((l, r) => {
        const state = l.cover[who][0]
        const from = port(tasks[r], box)
        const lines: [keyof typeof to, string][] =
          state === 'yes'
            ? [['cloud', 'yes']]
            : state === 'half'
              ? [
                  ['cloud', 'advice'],
                  ['team', 'half'],
                ]
              : [['team', 'you']]
        return lines
          .map(([end, kind]) => {
            const b = to[end]
            const mx = from.x + (b.x - from.x) * 0.5
            const d = `M${from.x} ${from.y} C${mx} ${from.y} ${mx} ${b.y} ${b.x} ${b.y}`
            const start = r * 0.12
            const packet =
              motion && kind !== 'advice'
                ? `<circle class="cw-packet" r="3.5" visibility="hidden"><set attributeName="visibility" to="visible" begin="${start}s"/><animateMotion dur="${1.7 + r * 0.13}s" begin="${start}s" repeatCount="indefinite" path="${d}"/></circle>`
                : ''
            return `<g class="cw-wire" data-kind="${kind}" style="--r:${r}"><path class="cw-wire-base" d="${d}"/><path class="cw-wire-line" d="${d}" pathLength="1"/>${packet}</g>`
          })
          .join('')
      })
      .join('')
    const cloudBox = cloud.getBoundingClientRect()
    const fromCost = { x: cloudBox.right - box.left, y: cloudBox.top + cloudBox.height / 2 - box.top }
    const endCost = port(cost, box)
    const midCost = fromCost.x + (endCost.x - fromCost.x) / 2
    const costPath = `M${fromCost.x} ${fromCost.y} C${midCost} ${fromCost.y} ${midCost} ${endCost.y} ${endCost.x} ${endCost.y}`
    const pricePacket = (path: string) =>
      motion
        ? `<circle class="cw-packet" r="3.5" visibility="hidden"><set attributeName="visibility" to="visible" begin="0s"/><animateMotion dur="1.7s" begin="0s" repeatCount="indefinite" path="${path}"/></circle>`
        : ''
    svg.insertAdjacentHTML(
      'beforeend',
      `<g class="cw-wire cw-cost-wire" data-kind="yes" style="--r:10"><path class="cw-wire-base" d="${costPath}"/><path class="cw-wire-line" d="${costPath}" pathLength="1"/>${pricePacket(costPath)}</g>`,
    )
    if (who !== 'vaven') {
      const teamBox = team.getBoundingClientRect()
      const teamFrom = { x: teamBox.right - box.left, y: teamBox.top + teamBox.height / 2 - box.top }
      const teamEnd = port(teamCost, box)
      const teamMid = teamFrom.x + (teamEnd.x - teamFrom.x) / 2
      const teamPath = `M${teamFrom.x} ${teamFrom.y} C${teamMid} ${teamFrom.y} ${teamMid} ${teamEnd.y} ${teamEnd.x} ${teamEnd.y}`
      svg.insertAdjacentHTML(
        'beforeend',
        `<g class="cw-wire cw-cost-wire" data-kind="you" style="--r:10"><path class="cw-wire-base" d="${teamPath}"/><path class="cw-wire-line" d="${teamPath}" pathLength="1"/>${pricePacket(teamPath)}</g>`,
      )
    }
    if (!animate) board.classList.remove('is-drawing')
    else if (motion) {
      board.classList.remove('is-drawing')
      void board.offsetWidth // restart the draw-in
      board.classList.add('is-drawing')
    }
  }

  const select = (next: Who, animate = true) => {
    who = next
    const p = studioProviders.find((s) => s.who === who)!
    const handled = layers.filter((l) => l.cover[who][0] === 'yes').length
    const load = layers.length - handled
    team.hidden = who === 'vaven'
    teamCost.hidden = who === 'vaven'
    board.querySelector<HTMLElement>('.cw-team-assumptions')!.hidden = who === 'vaven'
    board.dataset.who = who
    tabs.forEach((t) => t.setAttribute('aria-pressed', String(t.dataset.cwWho === who)))
    tasks.forEach((t, r) => {
      const [state, note] = layers[r].cover[who]
      t.dataset.state = state
      t.querySelector('[data-cw-note]')!.textContent = note
      t.title = kindLabel[state]
    })
    board.querySelector('[data-cw-cloud-logo]')!.innerHTML = p.logo
    board.querySelector('[data-cw-cloud-count]')!.textContent = `Handles ${handled} of 5`
    board.querySelector('[data-cw-team-count]')!.textContent = load
      ? `${load} task${load > 1 ? 's' : ''} on your plate`
      : 'Free to build your product'
    cloud.dataset.load = String(handled)
    team.dataset.load = String(load)
    const fee = studioPrices()
    board.querySelector('[data-cw-price]')!.innerHTML =
      `<div><span>${p.plan}</span><strong>${usd(fee[who])}<small> / month</small></strong></div><p>${who === 'vaven' ? 'Management fee only' : 'Support fee only'}</p>`
    const hours = Math.max(0, Math.min(10000, Number(hoursInput.value) || 0))
    const rate = Math.max(0, Math.min(10000, Number(rateInput.value) || 0))
    const teamEstimate = load ? hours * rate : 0
    board.querySelector('[data-cw-team-price]')!.innerHTML =
      `<div><span>Estimated management cost</span><strong>${usd(teamEstimate)}<small> / month</small></strong></div><p>${load ? `${hours} hours &times; ${usd(rate)} / hour` : 'Covered tasks handled by VavenCloud'}</p><p>Support + management: ${who === 'vaven' ? 'from ' : ''}${usd(fee[who] + teamEstimate)} / month</p>`
    board.querySelector('[data-cw-sr]')!.textContent =
      `${p.name}: handles ${handled} of 5 tasks, ${load} left for you to manage. ${p.plan}: ${usd(fee[who])} per month, excluding servers.`
    draw(animate)
  }

  const stopCycle = () => {
    window.clearInterval(cycle)
    cycle = 0
  }
  const startCycle = () => {
    stopCycle()
    if (!motion || userPicked || !visible) return
    cycle = window.setInterval(() => select(order[(order.indexOf(who) + 1) % order.length]), 4800)
  }

  tabs.forEach((t) =>
    t.addEventListener('click', () => {
      userPicked = true
      stopCycle()
      select(t.dataset.cwWho as Who)
    }),
  )

  ;[hoursInput, rateInput].forEach((input) =>
    input.addEventListener('input', () => {
      userPicked = true
      stopCycle()
      select(who, false)
    }),
  )
  select('aws', false)
  new ResizeObserver(() => draw(false)).observe(stage)
  new IntersectionObserver(
    ([entry]) => {
      const wasVisible = visible
      visible = entry.isIntersecting
      if (visible && !wasVisible) {
        draw(true)
        startCycle()
      }
      if (!visible) stopCycle()
    },
    { threshold: 0.35 },
  ).observe(board)
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
  init: () => initManaged(),
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
    <section class="cp-part" aria-labelledby="cp-servers-title">${partHead(1, 'cp-servers-title', 'The servers', 'Five common sizes. What one server of each size costs a month on each cloud.')}${serversPanel()}
    </section>
    <section id="managed" class="cp-part" aria-labelledby="cp-managed-title">${partHead(2, 'cp-managed-title', 'See who takes care of it', 'An interactive look at the work covered by your monthly support or management fee.')}${managedPanel()}
    </section>
    <div class="cp-notes">
      <h2 class="cp-notes-title">How we compared</h2>
      <ul>
        <li><b>Servers.</b> AWS prices are taken from the AWS console for EC2 in US East (Ohio). Azure prices are from Microsoft’s public pricing page for virtual machines in Central US. Both are Linux, on demand, ${HOURS} hours a month. For each size we price the cheapest machine with at least that many vCPUs and that much RAM. AWS and Azure prices are for the server only: disk, bandwidth and backups cost extra there. VavenCloud’s price includes the SSD shown.</li>
        <li><b>List prices.</b> These are AWS’s and Azure’s list prices. What you actually pay can vary by account, for example with discounts, reservations or credits.</li>
        <li><b>Managed service.</b> AWS Business Support+ and Azure Standard, at their published prices. AWS charges the greater of $29 or a share of your AWS bill; for any one of the servers above, that’s the $29 minimum. Their support plans give you help from the cloud’s engineers; they don’t run your product for you.</li>
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
