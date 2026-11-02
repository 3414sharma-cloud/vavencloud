import './report.css'
import type { Section } from '@/app/types.ts'
import { qs } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { monthly, report, reportIntro } from './report.data.ts'

/*
 * The morning after: the promise and the monthly report on the left, an example incident report on the
 * right. The first time the report is seen its time bar runs from 02:14 to 02:41 and a RESOLVED stamp
 * lands. The report is an example, not a real client.
 */

const doc = () => `
    <figure class="rp-doc" data-report>
      <div class="rp-card card">
        <span class="rp-stamp border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400" aria-hidden="true">Resolved</span>
        <p class="rp-label">Incident report · Example</p>
        <h3 class="rp-title">${report.title}</h3>
        <div class="rp-time" aria-hidden="true">
          <span class="text-rose-600 dark:text-rose-400">${report.started}</span>
          <span class="rp-bar"><i class="bg-emerald-500"></i></span>
          <span class="text-emerald-700 dark:text-emerald-400">${report.resolved}</span>
        </div>
        <dl class="rp-meta">
          ${report.meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
        </dl>
        <dl class="rp-rows">
          ${report.sections.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
        </dl>
      </div>
      <figcaption class="rp-caption">An example report, not a real client.</figcaption>
    </figure>`

export function reportSection(): Section {
  return {
    html: `
<section id="report" class="border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800">
  <div class="container-page grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
    <div class="min-w-0">
      <p class="rp-pill"><span class="bg-emerald-500" aria-hidden="true"></span><span class="font-mono tabular-nums">09:00</span> · Report in your inbox</p>
      <div class="mt-6">
        ${sectionHeading({
          title: 'We don’t send you a ticket number. <span class="text-brand-600 dark:text-brand-400">We send you the fix.</span>',
          description: reportIntro,
        })}
      </div>
      <p class="rp-monthly-label">Every month</p>
      <ol class="rp-monthly">
        ${monthly.map((m, i) => `<li><span aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${m}</li>`).join('')}
      </ol>
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
