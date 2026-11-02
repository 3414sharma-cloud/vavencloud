import type { Section } from '@/app/types.ts'
import { site } from '@/app/site.config.ts'
import { accountTeam } from '@/modules/stats/stats.data.ts'
import { icon } from '@/shared/ui/icons.ts'

/**
 * The people on your account, by team (About page). Roles only, no invented names or faces
 * (docs/messaging.md). Add real people here once they are approved for the page.
 */
export function teamSection(): Section {
  return {
    html: `
<section id="team" class="border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800" aria-labelledby="team-title">
  <div class="container-page">
    <div class="max-w-3xl">
      <p class="text-xs font-semibold tracking-[0.14em] text-brand-700 uppercase dark:text-brand-300">The people behind the work</p>
      <h2 id="team-title" class="mt-4 text-4xl leading-[1.05] font-semibold tracking-tight text-neutral-950 sm:text-5xl dark:text-white">The people on your account.</h2>
      <p class="mt-5 text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-400">Senior engineers who investigate, fix and explain what happened when your product needs attention. In your chat, not a ticket queue.</p>
    </div>
    <ul class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" role="list">
      ${accountTeam
        .map(
          (m) => `
      <li class="card p-6">
        <span class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300" aria-hidden="true">${icon(m.icon, 'h-5 w-5')}</span>
        <p class="mt-5 font-semibold text-neutral-950 dark:text-white">${m.role}</p>
        <p class="mt-2 text-sm leading-relaxed text-neutral-500">${m.focus}</p>
      </li>`,
        )
        .join('')}
    </ul>
    <a href="${site.vavensoftUrl}" target="_blank" rel="noopener" class="mt-8 inline-flex items-center gap-2 font-semibold text-neutral-950 underline underline-offset-4 hover:text-brand-700 dark:text-white dark:hover:text-brand-300">Meet the whole Vavensoft team<span class="sr-only"> (opens in a new tab)</span> ${icon('arrow-right', 'h-4 w-4')}</a>
  </div>
</section>`,
  }
}
