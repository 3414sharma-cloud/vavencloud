import './one-team.css'
import type { Section } from '@/app/types.ts'
import { icon, type IconName } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'

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

const tones: Record<'sky' | 'emerald' | 'violet', Tone> = {
  sky: { panel: 'bg-sky-50 dark:bg-sky-950/40', chip: 'bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300', dot: 'bg-sky-500' },
  emerald: { panel: 'bg-emerald-50 dark:bg-emerald-950/40', chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300', dot: 'bg-emerald-500' },
  violet: { panel: 'bg-violet-50 dark:bg-violet-950/40', chip: 'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300', dot: 'bg-violet-500' },
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

/** Infrastructure: your servers in two regions, healthy, plus the clouds we also take over */
const infraScene = (t: Tone) => `
  ${sceneHeader(t, 'server', 'Your servers', status('All healthy'))}
  <div class="mt-3 divide-y divide-neutral-100 ${surface} dark:divide-neutral-800">
    ${[
      ['United States', 'app-01 · 4 vCPU'],
      ['Europe', 'app-02 · 4 vCPU'],
      ['Load balancer', '2 of 2 nodes healthy'],
    ]
      .map(
        ([region, meta], k) =>
          row(
            k,
            'flex items-center justify-between gap-3 px-3.5 py-2.5',
            `<span class="min-w-0"><span class="block text-sm font-medium text-neutral-900 dark:text-white">${region}</span><span class="block font-mono text-[11px] text-neutral-500">${meta}</span></span>${status('Running')}`,
          ),
      )
      .join('')}
  </div>
  ${row(
    3,
    'mt-3 flex flex-wrap items-center gap-1.5 text-[11px]',
    `<span class="text-neutral-500">Already elsewhere?</span>${['AWS', 'Azure', 'Google Cloud'].map((c) => `<span class="rounded-full px-2 py-0.5 font-medium ${t.chip}">${c}</span>`).join('')}`,
  )}`

/** Engineers: someone is covering every hour, and replies like a person */
const engineersScene = (t: Tone) => `
  ${sceneHeader(t, 'support', 'On call now', `<span class="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"><i class="ot-live h-1.5 w-1.5 rounded-full bg-emerald-500"></i>Live</span>`)}
  ${row(
    0,
    `mt-3 p-3.5 ${surface}`,
    `<div class="flex h-6 items-stretch gap-[2px]">${Array.from({ length: 24 }, (_, h) => `<span class="ot-hour flex-1 rounded-[3px] ${t.dot}" style="--h:${h}"></span>`).join('')}</div>
     <div class="mt-1.5 flex justify-between font-mono text-[10px] text-neutral-400"><span>00:00</span><span>12:00</span><span>24:00</span></div>
     <p class="mt-2 text-xs text-neutral-600 dark:text-neutral-400">Covered every hour, 7 days a week</p>`,
  )}
  ${row(
    1,
    'mt-3 flex gap-2.5',
    `<span class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${t.chip}">${icon('users', 'h-3.5 w-3.5')}</span>
     <div class="rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 shadow-sm ring-1 ring-neutral-950/5 dark:bg-neutral-950 dark:ring-white/10">
       <p class="text-[11px] text-neutral-500"><span class="font-mono">02:19</span> · On-call engineer</p>
       <p class="mt-0.5 text-sm text-neutral-800 dark:text-neutral-200">I’m on it. Looking at the database now.</p>
     </div>`,
  )}`

/** Developers: the fix itself, in the code, reviewed and shipped */
const devScene = (t: Tone) => `
  ${sceneHeader(t, 'code', 'Fix in your code', `<span class="rounded-full px-2 py-0.5 text-[11px] font-medium ${t.chip}">Merged</span>`)}
  ${row(
    0,
    `mt-3 overflow-hidden ${surface}`,
    `<div class="flex items-center justify-between border-b border-neutral-100 px-3.5 py-2 font-mono text-[11px] dark:border-neutral-800">
       <span class="text-neutral-600 dark:text-neutral-400">db/migrations/add_orders_index.sql</span><span><span class="text-emerald-600 dark:text-emerald-400">+2</span> <span class="text-rose-500">−0</span></span>
     </div>
     <pre class="overflow-hidden px-3.5 py-2.5 font-mono text-[11px] leading-[1.7]"><code><span class="block text-neutral-400">  -- orders lookups were scanning every row</span><span class="block -mx-3.5 bg-emerald-50 px-3.5 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">+ CREATE INDEX idx_orders_user</span><span class="block -mx-3.5 bg-emerald-50 px-3.5 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">+   ON orders (user_id);</span></code></pre>`,
  )}
  ${row(
    1,
    'mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-600 dark:text-neutral-400',
    `<span class="inline-flex items-center gap-1">${icon('check', 'h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400')}Reviewed</span><span class="inline-flex items-center gap-1">${icon('check', 'h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400')}Tested on staging</span><span class="inline-flex items-center gap-1">${icon('check', 'h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400')}Live at 02:41</span>`,
  )}`

const pillars: { tone: Tone; scene: (t: Tone) => string; title: string; text: string }[] = [
  {
    tone: tones.sky,
    scene: infraScene,
    title: 'The infrastructure',
    text: 'Run your product on VavenCloud, our own cloud platform in US and European data centres, built for availability from day one. Already on AWS, Azure or Google Cloud? We can take ownership there too.',
  },
  {
    tone: tones.emerald,
    scene: engineersScene,
    title: 'The engineers',
    text: 'Senior DevOps engineers who learn your product, set up your deployments and monitoring, and watch it 24 hours a day, 7 days a week. Real people with names, in your chat, not a ticket queue.',
  },
  {
    tone: tones.violet,
    scene: devScene,
    title: 'The developers',
    text: 'Behind them sits Vavensoft, the software company that has delivered 210+ products. When the problem is in the code, the people who fix it are already on your team.',
  },
]

const tools = [
  {
    name: 'Client portal',
    who: 'Every client',
    what: 'Talk to your engineers, raise and track issues, share files and access securely, see monthly reports and your growth roadmap.',
    line: 'Your direct line to the team that owns your product.',
  },
  {
    name: 'VavenCloud dashboard',
    who: 'Clients who run on VavenCloud infrastructure',
    what: 'See and manage your servers, databases, load balancers, networks and backups.',
    line: 'Your infrastructure, visible and under control.',
  },
]

export function oneTeamSection(): Section {
  return {
    html: `
<section id="one-team" class="band-blue border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800">
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

    <div class="mt-24">
      <h3 class="text-center text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-white">Everything in one place, whichever cloud you’re on.</h3>
      <div class="mt-10 grid gap-5 md:grid-cols-2">
        ${tools
          .map(
            (t) => `
        <article class="card flex flex-col p-7">
          <p class="text-xs font-medium tracking-wide text-neutral-500 uppercase">For: ${t.who}</p>
          <h4 class="mt-2 text-xl font-semibold text-neutral-950 dark:text-white">${t.name}</h4>
          <p class="mt-3 leading-relaxed">${t.what}</p>
          <p class="mt-auto pt-6 font-medium text-neutral-950 dark:text-white">“${t.line}”</p>
        </article>`,
          )
          .join('')}
      </div>
    </div>
  </div>
</section>`,
    init() {
      // Each pillar's scene builds up row by row the first time the card is in view
      const cards = [...document.querySelectorAll('#one-team .ot-card')]
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        cards.forEach((c) => c.classList.add('is-in'))
        return
      }
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }),
        { threshold: 0.4 },
      )
      cards.forEach((c) => io.observe(c))
    },
  }
}
