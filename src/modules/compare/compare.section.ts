import type { Section } from '@/app/types.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'

/** "How we compare" (VavenCloud-Sample-Content.md). No competitor is named on purpose. */
const columns = ['Cloud host', 'DevOps agency', 'Outsourced IT support', 'VavenCloud']

const rows: { label: string; values: string[] }[] = [
  { label: 'Runs your infrastructure', values: ['Yes', 'No', 'No', 'Yes'] },
  { label: 'Sets up deployments and monitoring', values: ['No', 'Yes', 'Sometimes', 'Yes'] },
  { label: 'Fixes problems in your code', values: ['No', 'Rarely', 'Separate contract', 'Yes, within your plan'] },
  { label: 'On call 24/7 for your product', values: ['Server only', 'If you pay extra', 'Yes, by the hour', 'Yes'] },
  { label: 'Knows your product and your business', values: ['No', 'Partly', 'No', 'Yes'] },
  { label: 'How you pay', values: ['Per server', 'Per hour or retainer', 'Per hour', 'One fixed monthly fee'] },
  { label: 'Who you call when it breaks', values: ['2 or more', '2 or more', '2 or more', '1'] },
]

/** Plain Yes/No get an icon; everything else stays as text. Icons are decorative, the word is kept for screen readers. */
const cell = (v: string, ours: boolean) => {
  if (v === 'Yes') return `<span class="inline-flex items-center gap-1.5">${icon('check', `h-4 w-4 ${ours ? 'text-brand-300 dark:text-brand-600' : 'text-neutral-950 dark:text-white'}`)}Yes</span>`
  if (v === 'No') return `<span class="inline-flex items-center gap-1.5 text-neutral-400">${icon('minus', 'h-4 w-4')}No</span>`
  return v
}

export function compareSection(): Section {
  const last = rows.length - 1
  return {
    init() {
      // VavenCloud column fills in row by row the first time the table is in view
      const table = document.querySelector('#compare table')
      if (!table || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
      table.classList.add('cmp-wait')
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        table.classList.replace('cmp-wait', 'cmp-play')
      }, { threshold: 0.35 })
      io.observe(table)
    },
    html: `
<section id="compare" class="py-24 sm:py-32">
  <div class="container-page">
    <div class="max-w-3xl">
      ${sectionHeading({
        eyebrow: 'Why VavenCloud',
        title: 'Others own a piece of your product. We own the outcome.',
        description: 'You have options. Here’s what each one actually takes responsibility for, in plain terms.',
      })}
    </div>

    <div class="mt-12 overflow-x-auto overflow-y-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800" tabindex="0" role="region" aria-label="Comparison table, scrolls sideways on small screens">
      <table class="w-full min-w-[760px] border-collapse text-left text-sm">
        <caption class="sr-only">What each kind of provider takes responsibility for</caption>
        <thead>
          <tr>
            <th scope="col" class="sticky left-0 z-10 bg-white px-5 py-5 font-medium text-neutral-500 dark:bg-neutral-950"><span class="sr-only">Responsibility</span></th>
            ${columns
              .map((c, i) => {
                const ours = i === columns.length - 1
                return `<th scope="col" class="px-5 py-5 text-base font-semibold ${ours ? 'rounded-t-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'text-neutral-950 dark:text-white'}">${c}</th>`
              })
              .join('')}
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (r, ri) => `
          <tr class="border-t border-neutral-200 dark:border-neutral-800 ${ri === last ? 'text-base' : ''}">
            <th scope="row" class="sticky left-0 z-10 bg-white px-5 py-4 font-medium text-neutral-950 dark:bg-neutral-950 dark:text-white">${r.label}</th>
            ${r.values
              .map((v, i) => {
                const ours = i === columns.length - 1
                return `<td ${ours ? `style="--r:${ri}"` : ''} class="px-5 py-4 ${ours ? `cmp-ours bg-neutral-950 font-semibold text-white dark:bg-white dark:text-neutral-950 ${ri === last ? 'rounded-b-2xl text-2xl' : ''}` : ''}">${ours ? `<span class="cmp-v inline-block">${cell(v, ours)}</span>` : cell(v, ours)}</td>`
              })
              .join('')}
          </tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>

    <p class="mt-8 max-w-3xl text-lg leading-relaxed">
      Hiring a senior DevOps engineer in the US costs around $140,000 a year, and they still can’t fix your code at 3am on their own.
      <span class="font-semibold text-neutral-950 dark:text-white">VavenCloud gives you a whole team for a fixed monthly fee.</span>
    </p>
  </div>
</section>`,
  }
}
