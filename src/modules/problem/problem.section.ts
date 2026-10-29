import './problem.css'
import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'

/**
 * Recognition-stage scrollytelling section. The copy describes a representative
 * incident without presenting it as a real customer story.
 */
const statement: { text: string; strong?: boolean }[] = [
  { text: 'The work your product needs' },
  { text: 'does not happen by accident.', strong: true },
]

const intro =
  'A live product needs monitoring, tested recovery, regular security work and a plan for growth. These jobs are easy to defer when everything is working. They become urgent when it is not.'

const stages = [
  {
    time: 'Launch day',
    label: 'The decision',
    title: 'The product ships. The production work waits.',
    text: 'Monitoring, tested recovery and security work move to “next sprint”. The deadline is met, but the system is not yet ready for a serious incident.',
    tone: 'warning',
    terminal: 'HARDENING_DEFERRED',
    detail: '4 ITEMS · NEXT SPRINT',
  },
  {
    time: 'Month 3',
    label: 'The quiet gap',
    title: 'Nothing breaks, so nothing gets checked.',
    text: 'No alert tests. No restore drill. No review of the security patches waiting to be applied. The risk stays invisible because the product is still up.',
    tone: 'muted',
    terminal: 'READINESS_UNVERIFIED',
    detail: 'LAST REVIEW · NOT RECORDED',
  },
  {
    time: '02:37',
    label: 'The outage',
    title: 'Customers find the problem first.',
    text: 'Checkout is unavailable. Sales stop. Without monitoring that has been tested, a customer report becomes the first alert.',
    tone: 'danger',
    terminal: 'CHECKOUT_UNAVAILABLE',
    detail: 'HTTP 503 · /checkout',
  },
  {
    time: '03:12',
    label: 'Recovery attempt',
    title: 'A backup is not a plan until it is restored.',
    text: 'Recovery is slower when no one has tested the backup, documented the process or practised the decision under pressure.',
    tone: 'danger',
    terminal: 'RECOVERY_UNTESTED',
    detail: 'RESTORE DRILL · NEVER RUN',
  },
  {
    time: 'Afterwards',
    label: 'The real cause',
    title: 'Everything marked “next sprint” became tonight’s emergency.',
    text: 'The outage did not start when checkout failed. It started when the work that keeps a live product safe and recoverable was left unowned.',
    tone: 'muted',
    terminal: 'PRODUCTION_NOT_HARDENED',
    detail: 'INCIDENT STATUS · UNRESOLVED',
  },
] as const

const deferredWork = ['Monitoring + alerts', 'Tested backups', 'Security patches', 'Traffic plan']

const cost =
  'Every hour of downtime costs you sales, sign-ups and trust you don’t get back. Every night you spend debugging a server is a night you didn’t spend on customers, investors or your team.'

const words = () =>
  statement
    .flatMap((part) => part.text.split(' ').map((word) => `<span class="problem-word" ${part.strong ? 'data-strong' : ''}>${word}</span>`))
    .join(' ')

const storySteps = () =>
  stages
    .map(
      (stage, index) => `
      <li class="outage-step${index === 0 ? ' is-active' : ''}" data-stage="${index}">
        <div class="outage-step-marker" aria-hidden="true">
          <span>${String(index + 1).padStart(2, '0')}</span>
        </div>
        <div class="outage-step-card">
          <div class="flex items-center justify-between gap-4">
            <p class="text-xs font-semibold tracking-[0.12em] text-neutral-500 uppercase">${stage.label}</p>
            <time class="font-mono text-xs text-neutral-400">${stage.time}</time>
          </div>
          <h3 class="mt-4 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">${stage.title}</h3>
          <p class="mt-4 max-w-xl leading-relaxed text-neutral-600 dark:text-neutral-400">${stage.text}</p>
          ${
            index === stages.length - 1
              ? `<ul class="outage-deferred" aria-label="Deferred production work">
                  ${deferredWork.map((item) => `<li><span aria-hidden="true"></span>${item}<b>next sprint</b></li>`).join('')}
                </ul>`
              : ''
          }
        </div>
      </li>`,
    )
    .join('')

const terminalRows = () =>
  stages
    .map(
      (stage, index) => `
      <li class="terminal-row" data-row="${index}" data-tone="${stage.tone}">
        <span class="terminal-time">${stage.time === 'Launch day' ? '—' : stage.time}</span>
        <span class="terminal-signal"><i></i>${stage.terminal}</span>
        <span class="terminal-detail">${stage.detail}</span>
      </li>`,
    )
    .join('')

export function problemSection(): Section {
  return {
    html: `
<section id="problem" class="py-24 sm:py-32" aria-labelledby="problem-title">
  <div class="container-page">
    <div class="max-w-4xl">
      <h2 id="problem-title" class="problem-text text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl lg:text-[4rem]">${words()}</h2>
      <p class="mt-8 max-w-3xl text-lg leading-relaxed sm:text-xl">${intro}</p>
    </div>

    <div class="outage-story mt-20">
      <ol class="outage-steps" aria-label="A typical production outage, step by step">
        ${storySteps()}
      </ol>

      <div class="outage-console-wrap" aria-hidden="true">
        <div class="outage-console" data-stage="0">
          <div class="terminal-titlebar">
            <div class="terminal-lights"><i></i><i></i><i></i></div>
            <span>production / incident-20417</span>
            <span class="terminal-live"><i></i>LIVE</span>
          </div>
          <div class="terminal-screen">
            <div class="terminal-heading">
              <div>
                <p class="terminal-kicker">PRODUCTION READINESS RECORD</p>
                <p class="terminal-code">READINESS-01</p>
              </div>
              <div class="terminal-clock">
                <span>ELAPSED</span>
                <strong data-elapsed>00:00</strong>
              </div>
            </div>

            <ul class="terminal-log">${terminalRows()}</ul>

            <div class="terminal-owner">
              <span>READINESS STATUS</span>
              <strong data-owner>NOT VERIFIED</strong>
              <i class="terminal-cursor"></i>
            </div>
          </div>
          <div class="terminal-footer">
            <span><i></i> production</span>
            <span>production · readiness</span>
          </div>
        </div>
      </div>
    </div>

    <div class="outage-verdict">
      <p class="outage-verdict-label">Built fast. Never hardened.</p>
      <p>Production work does not disappear when it is deferred. It waits for the worst possible time.</p>
    </div>

    <div data-reveal class="mt-5 grid gap-6 rounded-3xl surface-ink p-7 sm:p-9 lg:grid-cols-[auto_1fr_auto] lg:items-center">
      <p class="text-sm font-semibold tracking-wide text-white uppercase">The cost of doing nothing</p>
      <p class="leading-relaxed">${cost}</p>
      <a href="${routes.oneTeam}" class="inline-flex items-center gap-2 font-semibold whitespace-nowrap text-white underline-offset-4 hover:underline">There's another way ${icon('arrow-right', 'h-4 w-4')}</a>
    </div>
  </div>
</section>`,
    init() {
      const steps = qsa<HTMLElement>('#problem .outage-step')
      const consoleElement = qs<HTMLElement>('#problem .outage-console')
      const elapsed = qs<HTMLElement>('[data-elapsed]', consoleElement)
      const owner = qs<HTMLElement>('[data-owner]', consoleElement)

      const activateStage = (index: number) => {
        steps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === index))
        consoleElement.dataset.stage = String(index)
        elapsed.textContent = ['00:00', '00:02', '00:07', '00:35', '6 MONTHS'][index] ?? '00:00'
        owner.textContent = index === stages.length - 1 ? 'NOT HARDENED' : 'NOT VERIFIED'
      }

      if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
        steps.forEach((step) => step.classList.add('is-visible'))
      } else {
        const stepObserver = new IntersectionObserver(
          (entries) => {
            const visible = entries
              .filter((entry) => entry.isIntersecting)
              .sort((a, b) => Math.abs(a.boundingClientRect.top - window.innerHeight * 0.45) - Math.abs(b.boundingClientRect.top - window.innerHeight * 0.45))
            if (!visible[0]) return
            const step = visible[0].target as HTMLElement
            activateStage(Number(step.dataset.stage))
            step.classList.add('is-visible')
          },
          { rootMargin: '-28% 0px -40% 0px', threshold: 0 },
        )
        steps.forEach((step) => stepObserver.observe(step))
      }

      const text = qs('#problem .problem-text')
      const items = qsa('.problem-word', text)
      const light = (count: number) => items.forEach((word, index) => word.classList.toggle('is-lit', index < count))

      if (prefersReducedMotion()) {
        light(items.length)
        return
      }

      let ticking = false
      const update = () => {
        ticking = false
        const rect = text.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const start = viewportHeight * 0.85
        const end = viewportHeight * 0.6 - rect.height
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
