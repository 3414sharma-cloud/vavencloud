import './pipeline.css'
import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { pipeline, type PipelineStage } from './pipeline.data.ts'

/*
 * How it works ("From first call to fully covered"), flat and numbered like the hero: the five steps as an
 * index whose lines fill as the walkthrough moves on, then one wide card for the open step (what happens on
 * the left, what you get on the right). It plays by itself once scrolled to (the active line's animationend
 * moves it on), and holds on hover, keyboard focus, off screen, in a background tab or with the button.
 * Picking a step shows it at once. With reduced motion nothing plays by itself. Steps not on show are inert;
 * they share one cell, so the card keeps the height of the longest step.
 */

const STEP_MS = 6000
const pad = (n: number) => String(n).padStart(2, '0')

const step = (s: PipelineStage, i: number) => `
        <button type="button" role="tab" id="pipe-tab-${s.id}" aria-label="Step ${i + 1}: ${s.name}" aria-controls="pipe-panel-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-state="${i === 0 ? 'active' : 'todo'}" class="pipe-step">
          <span class="pipe-step-bar" aria-hidden="true"><i></i></span>
          <span class="pipe-step-num" aria-hidden="true">${pad(i + 1)}</span>
          <span class="pipe-step-name">${s.name}</span>
          <span class="pipe-step-when">${s.when}</span>
        </button>`

const panel = (s: PipelineStage, i: number) => `
          <div id="pipe-panel-${s.id}" role="tabpanel" aria-labelledby="pipe-tab-${s.id}" class="pipe-panel${i === 0 ? ' is-active' : ''}" ${i === 0 ? '' : 'inert'}>
            <div>
              <p class="pipe-kicker">Step ${pad(i + 1)} · ${s.when}</p>
              <h3 class="pipe-title">${s.title}</h3>
              <p class="pipe-text">${s.description}</p>
            </div>
            <div class="pipe-get">
              <p class="pipe-get-label">What you get</p>
              <ul>
                ${s.deliverables.map((d) => `<li><span aria-hidden="true">${icon('check', 'h-3 w-3')}</span>${d}</li>`).join('')}
              </ul>
            </div>
          </div>`

const html = () => `
<section id="how-it-works" class="band-mist border-t border-neutral-200 py-20 sm:py-28 dark:border-neutral-800">
  <div class="container-page">
    <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div class="max-w-4xl">
        ${sectionHeading({
          title: 'From first call to fully covered, <em>without a single surprise.</em>',
          description: 'Five clear steps. You always know what happens next, and who is on it.',
        })}
      </div>
      <a href="${routes.book}" class="btn-secondary shrink-0 self-start lg:self-auto">Book a free review ${icon('arrow-right', 'h-4 w-4')}</a>
    </div>

    <div id="pipeline" class="mt-14" style="--dur:${STEP_MS}ms">
      <div role="tablist" aria-label="The five steps" class="pipe-steps">
        ${pipeline.map(step).join('')}
      </div>

      <div class="pipe-card card">
        <div class="pipe-panels">
          ${pipeline.map(panel).join('')}
        </div>
        <div class="pipe-foot">
          <span class="pipe-count" data-pipe-count>Step 1 of ${pipeline.length}</span>
          <button type="button" class="pipe-toggle" data-pipe-toggle>
            <span data-icon-pause>${icon('pause', 'h-3 w-3', true)}</span><span data-icon-play hidden>${icon('play', 'h-3 w-3', true)}</span>
            <span data-pipe-toggle-text>Pause</span><span class="sr-only"> the walkthrough</span>
          </button>
        </div>
      </div>
    </div>
    <p class="mt-10 text-center text-lg font-medium text-neutral-950 dark:text-white">You get a fixed monthly price before any work starts. No hourly meter, no surprise invoices.</p>
  </div>
</section>`

function initPipeline(): void {
  const root = qs('#pipeline')
  const tabs = qsa<HTMLButtonElement>('[role="tab"]', root)
  const panels = qsa('[role="tabpanel"]', root)
  const count = qs('[data-pipe-count]', root)
  const toggle = qs<HTMLButtonElement>('[data-pipe-toggle]', root)
  let index = 0

  const show = (next: number, focusTab = false) => {
    index = (next + pipeline.length) % pipeline.length
    tabs.forEach((t, i) => {
      t.setAttribute('aria-selected', String(i === index))
      t.tabIndex = i === index ? 0 : -1
      t.dataset.state = i < index ? 'done' : i === index ? 'active' : 'todo'
    })
    panels.forEach((p, i) => {
      p.classList.toggle('is-active', i === index)
      p.inert = i !== index
    })
    count.textContent = `Step ${index + 1} of ${pipeline.length}`
    if (focusTab) tabs[index].focus()
  }

  tabs.forEach((t, i) => t.addEventListener('click', () => i !== index && show(i)))
  qs('[role="tablist"]', root).addEventListener('keydown', (e) => {
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: pipeline.length - 1 }
    if (!(e.key in keys)) return
    e.preventDefault()
    show(keys[e.key], true)
  })

  if (prefersReducedMotion()) {
    toggle.hidden = true
    return
  }

  // Moving on by itself: the active step's line is a CSS animation as long as the step's turn; when it ends, next
  root.addEventListener('animationend', (e) => {
    if (e.animationName === 'pipe-progress') show(index + 1)
  })

  const holds = new Set<string>()
  let userPaused = false
  const sync = () => {
    root.classList.toggle('is-paused', userPaused || holds.size > 0)
    qs('[data-pipe-toggle-text]', toggle).textContent = userPaused ? 'Play' : 'Pause'
    qs('[data-icon-pause]', toggle).hidden = userPaused
    qs('[data-icon-play]', toggle).hidden = !userPaused
  }
  const hold = (reason: string, on: boolean) => {
    if (on) holds.add(reason)
    else holds.delete(reason)
    sync()
  }
  toggle.addEventListener('click', () => {
    userPaused = !userPaused
    sync()
  })
  root.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && hold('hover', true))
  root.addEventListener('pointerleave', () => hold('hover', false))
  root.addEventListener('focusin', (e) => (e.target as Element).matches(':focus-visible') && hold('focus', true))
  root.addEventListener('focusout', (e) => !root.contains(e.relatedTarget as Node | null) && hold('focus', false))
  document.addEventListener('visibilitychange', () => hold('hidden', document.hidden))
  // Start only once the visitor actually scrolls to it, so they see it from step 1
  hold('offscreen', true)
  new IntersectionObserver(([entry]) => hold('offscreen', !entry.isIntersecting), { threshold: 0.35 }).observe(root)
}

export function pipelineSection(): Section {
  return { html: html(), init: initPipeline }
}
