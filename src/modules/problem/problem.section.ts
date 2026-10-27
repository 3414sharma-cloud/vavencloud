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

const cards = [
  {
    title: '“The server is fine.”',
    text: 'Your site is down, and your host’s support confirms the server is healthy. Your code, your config and your deployment are outside their scope. They said so in the small print.',
  },
  {
    title: 'The person who knew has left.',
    text: 'The agency finished. The freelancer took a full-time job. Six months later something breaks, and nobody knows how the app is deployed, where the backups are, or whether there are any.',
  },
  {
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
      <p class="eyebrow">The problem</p>
      <h2 id="problem-title" class="problem-text mt-6 text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl lg:text-[4rem]">${words()}</h2>
      <p class="mt-8 max-w-3xl text-lg leading-relaxed sm:text-xl">${intro}</p>
    </div>

    <ul class="mt-14 grid gap-5 md:grid-cols-3" role="list">
      ${cards
        .map(
          (c, i) => `
      <li class="problem-card card flex flex-col p-7" style="--i:${i}">
        <span class="font-mono text-sm text-neutral-400">0${i + 1}</span>
        <h3 class="mt-5 text-xl font-semibold tracking-tight text-neutral-950 dark:text-white">${c.title}</h3>
        <p class="mt-3 leading-relaxed">${c.text}</p>
      </li>`,
        )
        .join('')}
    </ul>

    <div data-reveal class="mt-5 grid gap-6 rounded-3xl bg-neutral-950 p-7 text-neutral-300 sm:p-9 lg:grid-cols-[auto_1fr_auto] lg:items-center dark:bg-neutral-900">
      <p class="text-sm font-semibold tracking-wide text-white uppercase">The cost of doing nothing</p>
      <p class="leading-relaxed">${cost}</p>
      <a href="${routes.oneTeam}" class="inline-flex items-center gap-2 font-semibold whitespace-nowrap text-white underline-offset-4 hover:underline">There's another way ${icon('arrow-right', 'h-4 w-4')}</a>
    </div>
  </div>
</section>`,
    init() {
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
