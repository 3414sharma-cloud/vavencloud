import '@/modules/report/report.css'
import type { Section } from '@/app/types.ts'
import { qs } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { report, reportIntro, workspace } from '../v4.data.ts'

/*
 * v4's morning after: the report chapter (report.section.ts, same markup and report.css) with v4's copy. On the
 * left the promise and where you follow the work, each tool with a one-line headline; on the right the example
 * report for the story's night. Its time bar is split at the call (red before it, blue with us), and the first
 * time the report is seen the bar sweeps in and a RESOLVED stamp lands. An example, not a real client.
 */

/** "02:53" → minutes since midnight */
const minutes = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

/** How much of the night went by before the call, as a share of the bar */
const lostShare = Math.round(((minutes(report.called) - minutes(report.started)) / (minutes(report.resolved) - minutes(report.started))) * 100)

const toolCards = () => `
      <ul class="rp-tools">
        ${workspace
          .map(
            (t) => `
        <li class="rp-tool card">
          <div class="rp-tool-head"><span class="icon-box">${icon(t.icon, 'h-5 w-5')}</span><p class="rp-tool-name">${t.name}</p></div>
          <p class="rp-tool-who">${t.who}</p>
          <p class="v4-rp-headline">${t.headline}</p>
          <p class="rp-tool-what">${t.what}</p>
        </li>`,
          )
          .join('')}
      </ul>`

const doc = () => `
    <figure class="rp-doc" data-report>
      <div class="rp-stack">
        <div class="rp-card card">
          <span class="rp-stamp border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400" aria-hidden="true">Resolved</span>
          <p class="rp-label">Incident report · Example</p>
          <h3 class="rp-title">${report.title}</h3>
          <div class="rp-time" aria-hidden="true">
            <span class="text-rose-600 dark:text-rose-400">${report.started}</span>
            <span class="rp-bar v4-rp-bar" style="--lost:${lostShare}%"><span class="v4-rp-lost"></span><span class="v4-rp-fix"></span></span>
            <span class="text-emerald-700 dark:text-emerald-400">${report.resolved}</span>
          </div>
          <p class="v4-rp-legend" aria-hidden="true"><span><i class="v4-rp-lost"></i>Before we were called</span><span><i class="v4-rp-fix"></i>With VavenCloud</span></p>
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

export function reportV4(): Section {
  return {
    html: `
<section id="report" class="overflow-x-clip border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800">
  <div class="container-page grid items-center gap-14 lg:grid-cols-2">
    <div class="rp-head min-w-0">
      ${sectionHeading({
        eyebrow: '<span class="font-mono tabular-nums">09:00</span> the next morning · Report in your inbox',
        title: 'We don’t send you a ticket number. <em>We send you the fix.</em>',
        description: reportIntro,
      })}
      ${toolCards()}
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
