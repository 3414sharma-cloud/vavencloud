import './one-team.css'
import type { Section } from '@/app/types.ts'
import { icon, type IconName } from '@/shared/ui/icons.ts'
import { portrait, type Look } from '@/shared/ui/portrait.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { engineers } from '@/modules/stats/stats.data.ts'

/**
 * "The answer: one team, every layer" (VavenCloud-Sample-Content.md).
 * Reuses the merge-lines design: three pillars flow into one promise, then the portal/dashboard table.
 */
/*
 * Each pillar has its own colour and opens with a small scene of that layer at work, continuing the
 * hero's example (checkout slow at 02:14, a missing database index). Scenes are illustrations: roles,
 * example names and an .example domain only, so they are hidden from screen readers.
 * Tailwind classes are written out in full so they are picked up by the build.
 */
interface Tone {
  panel: string
  chip: string
  dot: string
}

const tones: Record<'brand' | 'sage' | 'clay', Tone> = {
  brand: { panel: 'bg-brand-50 dark:bg-brand-950/40', chip: 'bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-300', dot: 'bg-brand-500' },
  sage: { panel: 'bg-sage-50 dark:bg-sage-950/40', chip: 'bg-sage-100 text-sage-700 dark:bg-sage-900/60 dark:text-sage-300', dot: 'bg-sage-500' },
  clay: { panel: 'bg-clay-50 dark:bg-clay-950/40', chip: 'bg-clay-100 text-clay-700 dark:bg-clay-900/60 dark:text-clay-300', dot: 'bg-clay-500' },
}

const surface = 'rounded-2xl bg-white shadow-sm ring-1 ring-neutral-950/5 dark:bg-neutral-950 dark:ring-white/10'
const row = (k: number, cls: string, body: string) => `<div class="ot-row ${cls}" style="--k:${k}">${body}</div>`
const status = (text: string) =>
  `<span class="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"><i class="h-1.5 w-1.5 rounded-full bg-emerald-500"></i>${text}</span>`
const sceneHeader = (t: Tone, ic: IconName, label: string, right = '') => `
  <div class="flex items-center justify-between gap-3">
    <p class="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
      <span class="inline-flex h-7 w-7 items-center justify-center rounded-lg ${t.chip}">${icon(ic, 'h-3.5 w-3.5')}</span>${label}
    </p>
    ${right}
  </div>`

/** Infrastructure: a small map of how it is wired. Traffic enters one load balancer, runs on servers in two regions, and lands in backed-up storage */
const infraScene = (t: Tone) => {
  const box = 'fill-white stroke-neutral-950/10 dark:fill-neutral-950 dark:stroke-white/10'
  const title = 'fill-neutral-900 font-semibold dark:fill-white'
  const meta = 'fill-neutral-500 font-mono'
  const server = (x: number, k: number, region: string, name: string) => `
    <g class="ot-row" style="--k:${k}">
      <rect x="${x}" y="84" width="112" height="52" rx="14" class="${box}"/>
      <text x="${x + 14}" y="107" font-size="10.5" class="${title}">${region}</text>
      <text x="${x + 14}" y="122" font-size="8.5" class="${meta}">${name}</text>
      <circle cx="${x + 96}" cy="100" r="3.2" class="ot-live fill-emerald-500"/>
    </g>`
  return `
  ${sceneHeader(t, 'server', 'Your infrastructure', status('All healthy'))}
  <svg viewBox="0 0 260 196" class="mt-3 h-auto w-full" fill="none">
    <g class="stroke-brand-400" stroke-width="1.6" stroke-linecap="round">
      <path class="ot-flow" d="M130 38C130 62 64 60 64 84"/>
      <path class="ot-flow" d="M130 38C130 62 196 60 196 84"/>
      <path class="ot-flow" d="M64 136C64 150 130 144 130 158"/>
      <path class="ot-flow" d="M196 136C196 150 130 144 130 158"/>
    </g>
    <g class="ot-row" style="--k:0">
      <rect x="70" y="6" width="120" height="32" rx="16" class="${box}"/>
      <text x="130" y="26" font-size="10.5" text-anchor="middle" class="${title}">Load balancer</text>
    </g>
    ${server(8, 1, 'United States', 'app-01 · 4 vCPU')}
    ${server(140, 2, 'Europe', 'app-02 · 4 vCPU')}
    <g class="ot-row" style="--k:3">
      <rect x="70" y="158" width="120" height="32" rx="16" class="${box}"/>
      <text x="130" y="178" font-size="10" text-anchor="middle" class="${title}">Storage + backups</text>
    </g>
  </svg>
  ${row(
    4,
    'mt-1 flex flex-wrap items-center gap-1.5 text-[11px]',
    `<span class="text-neutral-500">Already elsewhere?</span>${['AWS', 'Azure', 'Google Cloud'].map((c) => `<span class="rounded-full px-2 py-0.5 font-medium ${t.chip}">${c}</span>`).join('')}`,
  )}`
}

/** Engineers: who is on call this week, with a face and a name for every day */
const engineersScene = (t: Tone) => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const today = 3
  const on = engineers[today % engineers.length]
  const face = (look: Look, cls: string) => `<span class="block overflow-hidden rounded-full ${cls}">${portrait(look)}</span>`
  return `
  ${sceneHeader(t, 'support', 'On call now', `<span class="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"><i class="ot-live h-1.5 w-1.5 rounded-full bg-emerald-500"></i>Live</span>`)}
  ${row(
    0,
    `mt-3 p-3.5 ${surface}`,
    `<p class="text-[11px] font-medium text-neutral-500">On call this week</p>
     <div class="mt-3 grid grid-cols-7 gap-1.5">
       ${days
         .map(
           (d, i) => `<div class="ot-day text-center" style="--d:${i}">
         <span class="block text-[10px] ${i === today ? 'font-semibold text-emerald-700 dark:text-emerald-400' : 'text-neutral-400'}">${d}</span>
         ${face(engineers[i % engineers.length].look, `mx-auto mt-1 h-8 w-8 ${i === today ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-neutral-950' : 'opacity-80'}`)}
       </div>`,
         )
         .join('')}
     </div>`,
  )}
  ${row(
    1,
    'mt-3 flex items-center gap-3',
    `<span class="flex -space-x-2">${engineers.map((e) => face(e.look, 'h-9 w-9 ring-2 ring-sage-50 dark:ring-sage-950')).join('')}</span>
     <p class="text-xs leading-snug text-neutral-600 dark:text-neutral-400">Real people, in your chat.<br /><span class="font-medium text-neutral-900 dark:text-white">On call today: ${on.name}</span></p>`,
  )}
  ${row(
    2,
    'mt-3 flex items-end gap-2.5',
    `${face(on.look, 'h-7 w-7 shrink-0')}
     <div class="rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 shadow-sm ring-1 ring-neutral-950/5 dark:bg-neutral-950 dark:ring-white/10">
       <p class="text-[11px] text-neutral-500"><span class="font-mono">02:19</span> · ${on.name}</p>
       <p class="mt-0.5 text-sm text-neutral-800 dark:text-neutral-200">I’m on it. Looking at the database now.</p>
     </div>`,
  )}`
}

/** Developers: the fix as a pull request that goes live, and what it did to the slow page */
const devScene = (t: Tone) => {
  const steps = ['Written', 'Reviewed', 'Tested', 'Live']
  const bar = (label: string, value: string, width: string, color: string, k: number) => `
    <div class="flex items-center gap-2.5">
      <span class="w-11 shrink-0 text-[11px] text-neutral-500">${label}</span>
      <span class="h-2.5 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800"><span class="ot-bar block h-full origin-left rounded-full ${color}" style="width:${width};--b:${k}"></span></span>
      <span class="w-14 shrink-0 text-right font-mono text-[11px] text-neutral-700 dark:text-neutral-300">${value}</span>
    </div>`
  return `
  ${sceneHeader(t, 'code', 'Fix in your code', `<span class="rounded-full px-2 py-0.5 text-[11px] font-medium ${t.chip}">Merged</span>`)}
  ${row(
    0,
    `mt-3 p-3.5 ${surface}`,
    `<div class="flex items-start justify-between gap-3">
       <div class="min-w-0"><p class="truncate text-sm font-medium text-neutral-900 dark:text-white">Add index on orders.user_id</p><p class="font-mono text-[11px] text-neutral-500">fix/slow-checkout</p></div>
       <span class="font-mono text-[11px] text-neutral-400">#482</span>
     </div>
     <div class="relative mt-4">
       <span class="absolute top-3 right-[12.5%] left-[12.5%] h-0.5 -translate-y-1/2 rounded-full bg-neutral-200 dark:bg-neutral-800"><span class="ot-line block h-full origin-left rounded-full bg-emerald-500"></span></span>
       <div class="relative grid grid-cols-4">
         ${steps
           .map(
             (s, i) => `<div class="flex flex-col items-center gap-1.5">
           <span class="ot-step inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-white dark:ring-neutral-950" style="--s:${i}">${icon('check', 'h-3.5 w-3.5')}</span>
           <span class="text-[10px] text-neutral-600 dark:text-neutral-400">${s}</span>
         </div>`,
           )
           .join('')}
       </div>
     </div>`,
  )}
  ${row(
    1,
    `mt-3 p-3.5 ${surface}`,
    `<p class="text-[11px] font-medium text-neutral-500">Checkout response time</p>
     <div class="mt-2.5 space-y-2">
       ${bar('Before', '4,210 ms', '100%', 'bg-rose-400', 0)}
       ${bar('After', '180 ms', '6%', 'bg-emerald-500', 1)}
     </div>`,
  )}`
}

const pillars: { tone: Tone; scene: (t: Tone) => string; title: string; text: string }[] = [
  {
    tone: tones.brand,
    scene: infraScene,
    title: 'The infrastructure',
    text: 'Run your product on VavenCloud, our own cloud platform in US and European data centres, built for availability from day one. Already on AWS, Azure or Google Cloud? We can take ownership there too.',
  },
  {
    tone: tones.sage,
    scene: engineersScene,
    title: 'The engineers',
    text: 'Senior DevOps engineers who learn your product, set up your deployments and monitoring, and watch it 24 hours a day, 7 days a week. Real people with names, in your chat, not a ticket queue.',
  },
  {
    tone: tones.clay,
    scene: devScene,
    title: 'The developers',
    text: 'Behind them sits Vavensoft, the software company that has delivered 210+ products. When the problem is in the code, the people who fix it are already on your team.',
  },
]

const tools = [
  {
    name: 'Client portal',
    who: 'Every client',
    items: ['Talk to your engineers', 'Raise and track issues', 'Share files and access securely', 'Read reports and your growth roadmap'],
    line: 'Your direct line to the team that owns your product.',
  },
  {
    name: 'VavenCloud dashboard',
    who: 'Clients who run on VavenCloud infrastructure',
    items: ['See and manage your servers', 'Manage databases', 'View load balancers and networks', 'Check backups and snapshots'],
    line: 'Your infrastructure, visible and under control.',
  },
]

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

    <ol class="mt-14 grid gap-5 md:grid-cols-3" role="list">
      ${pillars
        .map(
          (p) => `
      <li class="ot-card card flex flex-col overflow-hidden p-2">
        <div class="ot-scene rounded-[1.25rem] p-4 ${p.tone.panel}" aria-hidden="true">${p.scene(p.tone)}</div>
        <div class="flex flex-1 flex-col px-5 pt-6 pb-5">
          <h3 class="text-xl font-semibold tracking-tight text-neutral-950 dark:text-white">${p.title}</h3>
          <p class="mt-3 leading-relaxed">${p.text}</p>
        </div>
      </li>`,
        )
        .join('')}
    </ol>

    <!-- The three layers flow into one promise (decorative, wide screens) -->
    <div class="one-team-merge relative hidden h-20 md:block" aria-hidden="true">
      <span class="one-team-drop" style="left:16.66%"></span>
      <span class="one-team-drop" style="left:50%"></span>
      <span class="one-team-drop" style="left:83.33%"></span>
      <span class="one-team-rail"></span>
      <span class="one-team-drop one-team-drop--center" style="left:50%"></span>
    </div>

    <p data-reveal class="mx-auto mt-10 max-w-4xl surface-brand rounded-3xl px-8 py-10 text-center text-2xl leading-snug font-semibold tracking-tight text-balance sm:text-3xl md:mt-0">
      If your product is down, we treat it as our problem until it’s back, whatever the cause.
    </p>

    <div class="access-overview mt-24" aria-labelledby="access-title">
      <p class="access-overview-label">Your workspace</p>
      <h3 id="access-title">Everything in one place,<br><span>whichever cloud you’re on.</span></h3>
      <ol class="access-list" aria-label="VavenCloud client access">
        ${tools
          .map(
            (tool, index) => `
            <li class="access-row" style="--access-step:${index}">
              <span class="access-number">${String(index + 1).padStart(2, '0')}</span>
              <div class="access-main">
                <p class="access-for">For: ${tool.who}</p>
                <h4>${tool.name}</h4>
              </div>
              <ul class="access-items">${tool.items.map((item) => `<li>${item}</li>`).join('')}</ul>
              <blockquote>“${tool.line}”</blockquote>
            </li>`,
          )
          .join('')}
      </ol>
    </div>
  </div>
</section>`,
    init() {
      // Each pillar's scene builds up row by row the first time the card is in view
      const cards = [...document.querySelectorAll('#one-team .ot-card')]
      const accessRows = [...document.querySelectorAll('#one-team .access-row')]
      const animated = [...cards, ...accessRows]
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        animated.forEach((element) => element.classList.add('is-in'))
        return
      }
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }),
        { threshold: 0.25 },
      )
      animated.forEach((element) => io.observe(element))
    },
  }
}
