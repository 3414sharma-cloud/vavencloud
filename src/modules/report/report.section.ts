import './report.css'
import type { Section } from '@/app/types.ts'
import { workspace } from '@/modules/one-team/one-team.data.ts'
import { qs } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { monthly, report, reportIntro } from './report.data.ts'

/*
 * The morning after. On the left the promise, then where you follow the work: the client portal and, on our
 * infrastructure, the VavenCloud dashboard. On the right an example incident report, laid at a slight angle on
 * a second sheet. The first time the report is seen its time bar runs from 02:14 to 02:41 (red to green) and a
 * RESOLVED stamp lands. The report is an example, not a real client.
 */

/** "Every client" → "For every client" */
const forWho = (who: string) => `For ${who[0].toLowerCase()}${who.slice(1)}`

/** The client portal and the dashboard, as two cards (same data as the landing page's "Your workspace") */
const toolCards = () => `
      <ul class="rp-tools">
        ${workspace
          .map(
            (t) => `
        <li class="rp-tool card">
          <div class="rp-tool-head"><span class="icon-box">${icon(t.icon, 'h-5 w-5')}</span><p class="rp-tool-name">${t.name}</p></div>
          <p class="rp-tool-who">${forWho(t.who)}</p>
          <p class="rp-tool-what">${t.what}</p>
        </li>`,
          )
          .join('')}
      </ul>`

/** What the monthly report covers, as a numbered list */
const monthlyList = () => `
      <p class="rp-monthly-label">Every month</p>
      <ol class="rp-monthly">
        ${monthly.map((m, i) => `<li><span aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${m}</li>`).join('')}
      </ol>`

const doc = () => `
    <figure class="rp-doc" data-report>
      <div class="rp-stack">
        <div class="rp-card card">
          <span class="rp-stamp border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400" aria-hidden="true">Resolved</span>
          <p class="rp-label">Incident report · Example</p>
          <h3 class="rp-title">${report.title}</h3>
          <div class="rp-time" aria-hidden="true">
            <span class="text-rose-600 dark:text-rose-400">${report.started}</span>
            <span class="rp-bar"><i></i></span>
            <span class="text-emerald-700 dark:text-emerald-400">${report.resolved}</span>
          </div>
          <dl class="rp-meta">
            ${report.meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
          </dl>
          <dl class="rp-rows">
            ${report.sections.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
          </dl>
        </div>
      </div>
      <figcaption class="rp-caption">An example report, not a real client.</figcaption>
    </figure>`

/**
 * `tools`: show the portal and dashboard cards under the promise. The landing page already shows them in its
 * one-team chapter just before, so there it lists what the monthly report covers instead.
 */
export function reportSection({ tools = true }: { tools?: boolean } = {}): Section {
  return {
    html: `
<section id="report" class="overflow-x-clip border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800">
  <div class="container-page grid items-center gap-14 lg:grid-cols-2">
    <div class="rp-head min-w-0">
      ${sectionHeading({
        eyebrow: '<span class="font-mono tabular-nums">09:00</span> · Report in your inbox',
        title: 'We don’t send you a ticket number. <em>We send you the fix.</em>',
        description: reportIntro,
      })}
      ${tools ? toolCards() : monthlyList()}
    </div>
    ${doc()}
  </div>
</section>`,
    init() {
      const figure = qs('#report [data-report]')
      if (prefersReducedMotion() || !('IntersectionObserver' in window)) return figure.classList.add('is-in')
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return
          io.disconnect()
          figure.classList.add('is-in')
        },
        { threshold: 0.35 },
      )
      io.observe(figure)
    },
  }
}
