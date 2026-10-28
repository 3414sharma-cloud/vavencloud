import './problem.css'
import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'

/**
 * "The problem" (VavenCloud-Sample-Content.md). Apple-style statement whose words light up as the
 * visitor scrolls; the `strong` part ends in full black, the rest in grey. Then three stories the
 * founder has lived, and the cost of doing nothing.
 */
const statement: { text: string; strong?: boolean }[] = [
  { text: 'Your app has three vendors.' },
  { text: 'When it breaks, it has none.', strong: true },
]

const intro =
  'Your host keeps the server alive. Your DevOps freelancer set up the pipeline last year. Your developers wrote the code. When checkout fails at 2am, each of them can honestly say it isn’t their problem. So it becomes yours.'

/*
 * Each card opens with the moment the story describes, drawn as the real thing a founder would see:
 * the host's support reply, a message nobody can answer, a checklist stuck on "next sprint".
 * These are illustrations (roles and placeholders, no real people), so they are hidden from screen readers.
 */

/** 1 · The host's support ticket: everything green, still not their problem */
const hostTicket = () => `
  <div class="pc-scene">
    <div class="flex items-center justify-between gap-3">
      <p class="flex items-center gap-2 text-xs font-medium text-neutral-500">${icon('mail', 'h-3.5 w-3.5')}Hosting support · Ticket #20417</p>
      <span class="rounded-full bg-neutral-200/70 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">Closed</span>
    </div>
    <div class="pc-row mt-3 rounded-2xl rounded-tl-md bg-white p-3.5 text-sm leading-relaxed shadow-sm ring-1 ring-neutral-950/5 dark:bg-neutral-950 dark:ring-white/10" style="--k:0">
      <p class="text-neutral-800 dark:text-neutral-200">We’ve checked your server and it’s running normally.</p>
      <ul class="mt-2.5 space-y-1 font-mono text-[11px]">
        <li class="flex justify-between"><span class="text-neutral-500">CPU</span><span class="text-emerald-600 dark:text-emerald-400">12% · OK</span></li>
        <li class="flex justify-between"><span class="text-neutral-500">Memory</span><span class="text-emerald-600 dark:text-emerald-400">41% · OK</span></li>
        <li class="flex justify-between"><span class="text-neutral-500">Disk</span><span class="text-emerald-600 dark:text-emerald-400">OK</span></li>
      </ul>
      <p class="mt-2.5 text-xs text-neutral-500">Application issues are outside the scope of your plan.</p>
    </div>
    <p class="pc-row mt-3 flex items-center gap-2 text-xs font-medium text-rose-600 dark:text-rose-400" style="--k:1"><i class="pc-pulse h-1.5 w-1.5 rounded-full bg-rose-500"></i>Meanwhile: your checkout is still down</p>
  </div>`

/** 2 · Nobody can answer the one question that matters */
const lostKnowledge = () => `
  <div class="pc-scene">
    <p class="flex items-center gap-2 text-xs font-medium text-neutral-500">${icon('users', 'h-3.5 w-3.5')}#team · Today, 02:37</p>
    <div class="pc-row mt-3 flex gap-2.5" style="--k:0">
      <span class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-[11px] font-semibold text-white dark:bg-white dark:text-neutral-950">Y</span>
      <p class="rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-sm text-neutral-800 shadow-sm ring-1 ring-neutral-950/5 dark:bg-neutral-950 dark:text-neutral-200 dark:ring-white/10">Site is down. Who has the server login? Where are the backups?</p>
    </div>
    <ul class="pc-row mt-3 space-y-1.5 rounded-2xl border border-dashed border-neutral-300 p-3 font-mono text-[11px] dark:border-neutral-700" style="--k:1">
      <li class="flex justify-between gap-3"><span class="text-neutral-500">Last deploy</span><span class="text-neutral-700 dark:text-neutral-300">6 months ago · freelancer</span></li>
      <li class="flex justify-between gap-3"><span class="text-neutral-500">Server access</span><span class="text-amber-600 dark:text-amber-400">unknown</span></li>
      <li class="flex justify-between gap-3"><span class="text-neutral-500">Backups</span><span class="text-rose-600 dark:text-rose-400">not found</span></li>
    </ul>
    <p class="pc-row mt-3 flex items-center gap-1.5 text-xs text-neutral-400" style="--k:2"><span class="pc-typing"><i></i><i></i><i></i></span>No reply</p>
  </div>`

/** 3 · The hardening checklist that never got done */
const neverHardened = () => `
  <div class="pc-scene">
    <p class="flex items-center gap-2 text-xs font-medium text-neutral-500">${icon('grid', 'h-3.5 w-3.5')}Launch checklist</p>
    <ul class="mt-3 space-y-1.5 text-sm">
      ${[
        ['Ship the product', true],
        ['Monitoring and alerts', false],
        ['Tested backups', false],
        ['Security patches', false],
        ['Plan for traffic spikes', false],
      ]
        .map(
          ([label, done], k) => `
      <li class="pc-row flex items-center gap-2.5 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-neutral-950/5 dark:bg-neutral-950 dark:ring-white/10" style="--k:${k}">
        <span class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded ${done ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'border border-neutral-300 dark:border-neutral-700'}">${done ? icon('check', 'h-3 w-3') : ''}</span>
        <span class="flex-1 ${done ? 'text-neutral-400 line-through' : 'text-neutral-800 dark:text-neutral-200'}">${label}</span>
        ${done ? '' : '<span class="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">next sprint</span>'}
      </li>`,
        )
        .join('')}
    </ul>
  </div>`

const cards = [
  {
    scene: hostTicket,
    panel: 'bg-rose-50 dark:bg-rose-950/30',
    title: '“The server is fine.”',
    text: 'Your site is down, and your host’s support confirms the server is healthy. Your code, your config and your deployment are outside their scope. They said so in the small print.',
  },
  {
    scene: lostKnowledge,
    panel: 'bg-amber-50 dark:bg-amber-950/30',
    title: 'The person who knew has left.',
    text: 'The agency finished. The freelancer took a full-time job. Six months later something breaks, and nobody knows how the app is deployed, where the backups are, or whether there are any.',
  },
  {
    scene: neverHardened,
    panel: 'bg-orange-50 dark:bg-orange-950/30',
    title: 'Built fast. Never hardened.',
    text: 'Deadlines and AI tools ship products quickly. Monitoring, backups, security and scaling were always “next sprint”. Usually they arrive the week after the first serious outage.',
  },
]

const cost =
  'Every hour of downtime costs you sales, sign-ups and trust you don’t get back. Every night you spend debugging a server is a night you didn’t spend on customers, investors or your team. And every month without a plan is a month closer to the outage that makes the decision for you.'

const words = () =>
  statement
    .flatMap((part) => part.text.split(' ').map((w) => `<span class="problem-word" ${part.strong ? 'data-strong' : ''}>${w}</span>`))
    .join(' ')

export function problemSection(): Section {
  return {
    html: `
<section id="problem" class="py-24 sm:py-32" aria-labelledby="problem-title">
  <div class="container-page">
    <div class="max-w-4xl">
      <h2 id="problem-title" class="problem-text text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl lg:text-[4rem]">${words()}</h2>
      <p class="mt-8 max-w-3xl text-lg leading-relaxed sm:text-xl">${intro}</p>
    </div>

    <ul class="mt-14 grid gap-5 md:grid-cols-3" role="list">
      ${cards
        .map(
          (c, i) => `
      <li class="problem-card card flex flex-col overflow-hidden p-2" style="--i:${i}">
        <div class="rounded-[1.25rem] p-4 ${c.panel}" aria-hidden="true">${c.scene()}</div>
        <div class="flex flex-1 flex-col px-5 pt-6 pb-5">
          <h3 class="text-xl font-semibold tracking-tight text-neutral-950 dark:text-white">${c.title}</h3>
          <p class="mt-3 leading-relaxed">${c.text}</p>
        </div>
      </li>`,
        )
        .join('')}
    </ul>

    <div data-reveal class="mt-5 grid gap-6 rounded-3xl surface-ink p-7 sm:p-9 lg:grid-cols-[auto_1fr_auto] lg:items-center">
      <p class="text-sm font-semibold tracking-wide text-white uppercase">The cost of doing nothing</p>
      <p class="leading-relaxed">${cost}</p>
      <a href="${routes.oneTeam}" class="inline-flex items-center gap-2 font-semibold whitespace-nowrap text-white underline-offset-4 hover:underline">There's another way ${icon('arrow-right', 'h-4 w-4')}</a>
    </div>
  </div>
</section>`,
    init() {
      // Each card's little scene plays (rows appear one by one) the first time the card is in view
      const scenes = qsa('#problem .problem-card')
      if (prefersReducedMotion()) scenes.forEach((c) => c.classList.add('is-in'))
      else {
        const io = new IntersectionObserver(
          (entries) =>
            entries.forEach((e) => {
              if (!e.isIntersecting) return
              e.target.classList.add('is-in')
              io.unobserve(e.target)
            }),
          { threshold: 0.4 },
        )
        scenes.forEach((c) => io.observe(c))
      }

      const text = qs('#problem .problem-text')
      const items = qsa('.problem-word', text)
      const light = (count: number) => items.forEach((w, i) => w.classList.toggle('is-lit', i < count))

      if (prefersReducedMotion()) {
        light(items.length)
        return
      }

      // Starts lighting when the heading's top reaches 85% of the viewport, done when its bottom passes 60%
      let ticking = false
      const update = () => {
        ticking = false
        const rect = text.getBoundingClientRect()
        const vh = window.innerHeight
        const start = vh * 0.85
        const end = vh * 0.6 - rect.height
        const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1)
        light(Math.round(progress * items.length))
      }
      const onScroll = () => {
        if (ticking) return
        ticking = true
        requestAnimationFrame(update)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll)
      update()
    },
  }
}
