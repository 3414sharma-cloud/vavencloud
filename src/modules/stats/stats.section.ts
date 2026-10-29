import type { Section } from '@/app/types.ts'
import { stats, stories, type Stat } from './stats.data.ts'

const format = (stat: Stat) =>
  `${stat.prefix ?? ''}${stat.value.toLocaleString('en-US', { minimumFractionDigits: stat.decimals ?? 0, maximumFractionDigits: stat.decimals ?? 0 })}${stat.suffix ?? ''}`

/** A compact proof section. The detailed people and stories now live on /about/. */
export function statsSection(): Section {
  return {
    html: `
<section id="proof" class="border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800" aria-labelledby="proof-title">
  <div class="container-page">
    <div class="max-w-5xl">
      <p class="text-xs font-semibold tracking-[0.14em] text-brand-700 uppercase dark:text-brand-300">Built by Vavensoft</p>
      <h2 id="proof-title" class="mt-5 text-5xl leading-[0.94] font-semibold tracking-[-0.06em] text-neutral-950 sm:text-7xl lg:text-[5.5rem] dark:text-white">Built by the team behind<br><span class="text-brand-600 dark:text-brand-400">210+ products.</span></h2>
      <p class="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-400">VavenCloud is run by the software company that has been building and operating live products for more than a decade.</p>
    </div>

    <ol class="mt-16 border-t border-neutral-200 dark:border-neutral-800" aria-label="Vavensoft track record">
      ${stories
        .map((story, index) => {
          const stat = stats[story.id]
          return `
          <li data-reveal class="grid gap-4 border-b border-neutral-200 py-7 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:items-end sm:gap-8 sm:py-9 dark:border-neutral-800">
            <span class="font-mono text-xs font-semibold text-neutral-400">${String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3 class="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">${stat.label}</h3>
              <p class="mt-2 max-w-xl leading-relaxed">${stat.note}</p>
            </div>
            <p class="text-5xl leading-none font-semibold tracking-[-0.06em] text-brand-600 tabular-nums sm:text-6xl dark:text-brand-400">${format(stat)}</p>
          </li>`
        })
        .join('')}
    </ol>
  </div>
</section>`,
  }
}
