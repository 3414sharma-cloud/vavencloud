import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { layers } from '@/modules/one-team/one-team.data.ts'
import { night, steps } from '@/modules/ownership/ownership.data.ts'
import { pipeline } from '@/modules/pipeline/pipeline.data.ts'
import { qs } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'
import { owners } from '../v2.data.ts'
import { clock, nightCard, nightRow } from './night.ts'

/*
 * Chapter 2, the fix: the same night with VavenCloud (dark card, the answer to chapter 1's), the layer stack
 * (each layer of the product, who usually owns it, crossed out, and who does with us, all wrapped in one team),
 * then how we take over in five steps (#how-it-works, the footer's "How it works"). It ends on the promise
 * and the booking button. The first time the stack is seen it builds up (.is-in): plates slide in, the usual
 * owners are struck out, ours appear. Its markup is the end state, so without JS or with reduced motion it shows.
 */

function initStack(stack: HTMLElement): void {
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return
  stack.classList.add('is-armed')
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      io.disconnect()
      stack.classList.add('is-in')
    },
    { threshold: 0.4 },
  )
  io.observe(stack)
}

export function solutionV2(): Section {
  const rows = steps.map((s) => nightRow(s.vaven.clock ?? clock(s.at), s.vaven, 'vaven')).join('')
  return {
    html: `
<section id="solution" class="v2-section band-mist border-t border-neutral-200 dark:border-neutral-800" aria-labelledby="solution-title">
  <div class="container-page">
    <div class="max-w-4xl">
      <p class="v2-overline">The fix</p>
      <h2 id="solution-title" class="v2-title">One call. One team owns all of it.<span>Servers, deployments and code.</span></h2>
      <p class="v2-lead">The infrastructure your product runs on, the DevOps engineers who keep it healthy and the developers who can fix the code itself. Usually three companies. With us, one team, one chat, one responsibility.</p>
    </div>

    <div class="v2-split v2-split--fix">
      ${nightCard('vaven', 'The same night, with VavenCloud', { tone: 'fixed', text: `Fixed in ${night.fixed - night.start} min` }, rows)}
      <div class="st" data-stack>
        <p class="v2-label">What one team covers</p>
        <div class="st-team">
          <p class="st-badge">${icon('users', 'h-3.5 w-3.5')}One team · one chat · one fixed fee</p>
          <ol class="st-plates">
            ${layers
              .map(
                (l, i) => `
            <li class="st-plate" style="--i:${i}">
              <span class="st-icon" aria-hidden="true">${icon(l.icon, 'h-5 w-5')}</span>
              <div class="st-body">
                <p class="st-name">${l.name}</p>
                <p class="st-covers">${l.covers}</p>
              </div>
              <p class="st-owner">
                <s class="st-before"><span class="sr-only">Usually: </span>${owners[l.id].before}</s>
                <span class="st-now"><span class="sr-only">With VavenCloud: </span>${owners[l.id].now}</span>
              </p>
            </li>`,
              )
              .join('')}
          </ol>
        </div>
      </div>
    </div>

    <div id="how-it-works" class="v2-how">
      <p class="v2-label">How we take over</p>
      <ol class="v2-steps">
        ${pipeline.map((s, i) => `<li><span class="v2-step-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><p class="v2-step-name">${s.name}</p><p class="v2-step-when">${s.when}</p></li>`).join('')}
      </ol>
    </div>

    <div class="v2-promise">
      <p>If your product is down, we treat it as our problem until it’s back, whatever the cause.</p>
      <a href="${routes.book}" class="btn-primary !px-6 !py-3">Book a free production review ${icon('arrow-right', 'h-4 w-4')}</a>
    </div>
  </div>
</section>`,
    init: () => initStack(qs('#solution [data-stack]')),
  }
}
