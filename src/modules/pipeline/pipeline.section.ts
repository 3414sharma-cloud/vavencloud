import './pipeline.css'
import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { pipeline, type PipelineStage } from './pipeline.data.ts'

const LINE_MS = 700
const HOLD_MS = 2800
const pad = (n: number) => String(n).padStart(2, '0')

const node = (s: PipelineStage, i: number) => `
  <button type="button" role="tab" id="pipeline-tab-${s.id}" aria-controls="pipeline-panel-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-state="${i === 0 ? 'active' : 'todo'}"
    class="group flex flex-col items-center gap-2 rounded-lg px-1 pb-2 text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600">
    <span class="pipeline-node relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-neutral-300 bg-white text-neutral-400 transition-colors duration-500 group-hover:border-neutral-500 sm:h-12 sm:w-12 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-500
      group-data-[state=active]:border-brand-600 group-data-[state=active]:text-brand-600 dark:group-data-[state=active]:border-brand-400 dark:group-data-[state=active]:text-brand-300
      group-data-[state=done]:border-brand-600 group-data-[state=done]:bg-brand-600 group-data-[state=done]:text-white dark:group-data-[state=done]:border-brand-500 dark:group-data-[state=done]:bg-brand-500">
      <span class="pipeline-ring absolute -inset-1.5 rounded-full border-2 border-brand-600/40 opacity-0 group-data-[state=active]:opacity-100 dark:border-brand-400/40" aria-hidden="true"></span>
      ${icon(s.icon, 'h-4 w-4 sm:h-5 sm:w-5')}
    </span>
    <span class="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">${pad(i + 1)}</span>
    <span class="hidden text-sm font-semibold text-neutral-500 transition-colors group-hover:text-neutral-800 group-aria-selected:text-neutral-950 sm:block dark:group-hover:text-neutral-200 dark:group-aria-selected:text-white">${s.name}</span>
    <span class="hidden text-xs text-neutral-500 md:block">${s.when}</span>
  </button>`

const panel = (s: PipelineStage, i: number) => `
  <div id="pipeline-panel-${s.id}" role="tabpanel" aria-labelledby="pipeline-tab-${s.id}" class="pipeline-panel" ${i === 0 ? '' : 'hidden'}>
    <div class="flex items-center gap-3">
      <span class="icon-box border-brand-200 bg-brand-50 text-brand-600 dark:border-brand-900 dark:bg-brand-950 dark:text-brand-300">${icon(s.icon, 'h-5 w-5')}</span>
      <p class="text-sm"><span class="font-semibold text-neutral-950 dark:text-white">Step ${pad(i + 1)} · ${s.name}</span><span class="block text-neutral-500">${s.when}</span></p>
    </div>
    <h3 class="mt-6 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">${s.title}</h3>
    <p class="mt-3 leading-relaxed">${s.description}</p>
    <ul class="mt-6 grid gap-2.5 text-sm">
      ${s.deliverables.map((d, k) => `<li class="pipeline-item flex items-center gap-2.5" style="--k:${k}">${icon('check', 'h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400')}${d}</li>`).join('')}
    </ul>
  </div>`

const html = () => `
<section id="how-it-works" class="band-sky relative overflow-hidden border-t border-neutral-200 py-20 sm:py-28 dark:border-neutral-800">
  <div class="pipeline-bg pointer-events-none absolute inset-0 -z-10" aria-hidden="true"></div>
  <div class="container-page">
    <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div class="max-w-2xl">
        ${sectionHeading({
          title: 'From first call to fully covered, without a single surprise.',
          description: 'Five clear steps. You always know what happens next, and who is on it.',
        })}
      </div>
      <a href="${routes.book}" class="btn-secondary self-start lg:self-auto">Book a free review ${icon('arrow-right', 'h-4 w-4')}</a>
    </div>

    <div id="pipeline" class="mt-14">
      <!-- Track: nodes sit in 5 equal columns, so the rail runs from the 1st to the 5th column centre (10% → 90%) -->
      <div class="relative">
        <div class="pipeline-rail absolute top-5 right-[10%] left-[10%] h-0.5 rounded-full sm:top-6" aria-hidden="true">
          <div class="pipeline-fill absolute inset-y-0 left-0 rounded-full bg-brand-600 dark:bg-brand-400" data-pipeline-fill style="width:0%">
            <span class="pipeline-packet"></span>
          </div>
        </div>
        <div role="tablist" aria-label="The five steps" class="relative grid grid-cols-5">
          ${pipeline.map(node).join('')}
        </div>
      </div>

      <div class="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div class="card p-6 sm:p-8">
          ${pipeline.map(panel).join('')}
        </div>

        <!-- Decorative console that "streams" the active stage; the panel on the left carries the content -->
        <div class="flex flex-col overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 text-neutral-300 shadow-xl shadow-neutral-950/10" aria-hidden="true">
          <div class="flex items-center gap-3 border-b border-neutral-800 px-4 py-3">
            <span class="flex gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-neutral-700"></span><span class="h-2.5 w-2.5 rounded-full bg-neutral-700"></span><span class="h-2.5 w-2.5 rounded-full bg-neutral-700"></span></span>
            <span class="font-mono text-xs text-neutral-500">vavencloud — your onboarding</span>
            <span class="ml-auto inline-flex items-center gap-1.5 rounded-full border border-neutral-800 px-2.5 py-0.5 text-[11px] font-medium" data-pipeline-status>
              <span class="pipeline-status-dot h-1.5 w-1.5 rounded-full bg-emerald-400"></span><span data-pipeline-status-text>Running</span>
            </span>
          </div>
          <ol class="flex-1 space-y-2 p-5 font-mono text-[13px] leading-relaxed sm:min-h-56" data-pipeline-log></ol>
          <div class="border-t border-neutral-800 px-5 py-3">
            <div class="flex items-center justify-between font-mono text-[11px] text-neutral-500">
              <span data-pipeline-step>Step 1/${pipeline.length}</span>
              <span data-pipeline-pct>0%</span>
            </div>
            <div class="mt-2 h-1 overflow-hidden rounded-full bg-neutral-800">
              <div class="pipeline-total h-full rounded-full bg-linear-to-r from-brand-500 to-sky-400" data-pipeline-total style="width:0%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-center gap-3 text-sm text-neutral-500">
        <button type="button" class="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-1.5 font-medium text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white" data-pipeline-toggle>
          <span data-icon-pause>${icon('pause', 'h-3.5 w-3.5')}</span><span data-icon-play class="hidden">${icon('play', 'h-3.5 w-3.5')}</span>
          <span data-pipeline-toggle-text>Pause walkthrough</span>
        </button>
      </div>
    </div>
    <p class="mt-10 text-center text-lg font-medium text-neutral-950 dark:text-white">You get a fixed monthly price before any work starts. No hourly meter, no surprise invoices.</p>
  </div>
</section>`

const logLine = (l: PipelineStage['log'][number]) => {
  const li = document.createElement('li')
  li.className = 'pipeline-line flex gap-2'
  const mark =
    l.kind === '$'
      ? '<span class="text-brand-300">$</span>'
      : l.kind === 'ok'
        ? '<span class="text-emerald-400">✓</span>'
        : '<span class="text-neutral-600">→</span>'
  const text = l.kind === '$' ? 'text-white' : l.kind === 'ok' ? 'text-emerald-300' : 'text-neutral-400'
  li.innerHTML = `${mark}<span class="${text}">${l.text}</span>`
  return li
}

/**
 * Auto-playing walkthrough: each stage streams its console lines, holds, then the rail fills to the
 * next node. Pauses on hover, keyboard focus, off-screen, hidden tab or via the button.
 * Picking a stage shows it instantly. With reduced motion nothing plays automatically.
 */
function initPipeline(): void {
  const root = qs('#pipeline')
  const tabs = qsa<HTMLButtonElement>('[role="tab"]', root)
  const panels = qsa('[role="tabpanel"]', root)
  const fill = qs('[data-pipeline-fill]', root)
  const log = qs('[data-pipeline-log]', root)
  const total = qs('[data-pipeline-total]', root)
  const step = qs('[data-pipeline-step]', root)
  const pct = qs('[data-pipeline-pct]', root)
  const status = qs('[data-pipeline-status]', root)
  const statusText = qs('[data-pipeline-status-text]', root)
  const toggle = qs<HTMLButtonElement>('[data-pipeline-toggle]', root)
  const reduced = prefersReducedMotion()
  const holds = new Set<string>()
  let userPaused = reduced
  let index = 0
  let line = 0
  let timer = 0

  const paused = () => userPaused || holds.size > 0

  const progress = () => {
    const lines = pipeline[index].log.length
    const value = ((index + line / lines) / pipeline.length) * 100
    total.style.width = `${value}%`
    pct.textContent = `${Math.round(value)}%`
  }

  const syncStatus = () => {
    const isPaused = paused()
    status.classList.toggle('is-paused', isPaused)
    statusText.textContent = reduced ? 'Ready' : isPaused ? 'Paused' : 'Running'
    qs('[data-pipeline-toggle-text]', toggle).textContent = userPaused ? 'Play walkthrough' : 'Pause walkthrough'
    qs('[data-icon-pause]', toggle).classList.toggle('hidden', userPaused)
    qs('[data-icon-play]', toggle).classList.toggle('hidden', !userPaused)
  }

  const appendLine = () => {
    log.appendChild(logLine(pipeline[index].log[line]))
    line += 1
    progress()
  }

  const schedule = () => {
    window.clearTimeout(timer)
    syncStatus()
    if (paused()) return
    const lines = pipeline[index].log.length
    if (line < lines) {
      timer = window.setTimeout(() => {
        appendLine()
        schedule()
      }, line === 0 ? 400 : LINE_MS)
    } else {
      timer = window.setTimeout(() => show((index + 1) % pipeline.length), HOLD_MS)
    }
  }

  function show(next: number, instant = false, focusTab = false) {
    index = next
    line = 0
    tabs.forEach((t, i) => {
      t.setAttribute('aria-selected', String(i === index))
      t.tabIndex = i === index ? 0 : -1
      t.dataset.state = i < index ? 'done' : i === index ? 'active' : 'todo'
    })
    panels.forEach((p, i) => (p.hidden = i !== index))
    if (focusTab) tabs[index].focus()
    fill.style.width = `${(index / (pipeline.length - 1)) * 100}%`
    step.textContent = `Step ${index + 1}/${pipeline.length} · ${pipeline[index].name}`
    log.replaceChildren()
    if (instant) while (line < pipeline[index].log.length) appendLine()
    progress()
    schedule()
  }

  tabs.forEach((t, i) => t.addEventListener('click', () => show(i, true)))
  qs('[role="tablist"]', root).addEventListener('keydown', (e) => {
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: pipeline.length - 1 }
    if (!(e.key in keys)) return
    e.preventDefault()
    show((keys[e.key] + pipeline.length) % pipeline.length, true, true)
  })

  if (reduced) {
    toggle.hidden = true
  } else {
    toggle.addEventListener('click', () => {
      userPaused = !userPaused
      schedule()
    })
  }

  const hold = (reason: string, on: boolean) => {
    if (on) holds.add(reason)
    else holds.delete(reason)
    schedule()
  }
  root.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && hold('hover', true))
  root.addEventListener('pointerleave', () => hold('hover', false))
  root.addEventListener('focusin', (e) => (e.target as Element).matches(':focus-visible') && hold('focus', true))
  root.addEventListener('focusout', (e) => !root.contains(e.relatedTarget as Node | null) && hold('focus', false))
  document.addEventListener('visibilitychange', () => hold('hidden', document.hidden))
  // Start only once the visitor actually scrolls to it, so they see it from stage 1
  holds.add('offscreen')
  new IntersectionObserver(([entry]) => hold('offscreen', !entry.isIntersecting), { threshold: 0.35 }).observe(root)

  show(0, reduced)
}

export function pipelineSection(): Section {
  return { html: html(), init: initPipeline }
}
