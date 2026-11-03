import './proof.css'
import type { Section } from '@/app/types.ts'
import { site } from '@/app/site.config.ts'
import { founderCartoon } from '@/modules/founder/founder-cartoon.ts'
import { founder } from '@/modules/founder/founder.data.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { accountTeam, stats, stories, type Stat } from './stats.data.ts'

const format = (stat: Stat) =>
  `${stat.prefix ?? ''}${stat.value.toLocaleString('en-US', { minimumFractionDigits: stat.decimals ?? 0, maximumFractionDigits: stat.decimals ?? 0 })}${stat.suffix ?? ''}`

const newTab = '<span class="sr-only"> (opens in a new tab)</span>'

/** The founder: his portrait, a line from his note, and the whole note on request */
const founderCard = () => `
      <div class="pf-founder surface-ink rounded-3xl">
        <div class="flex items-center gap-5">
          <span class="pf-avatar">${founder.photo ? `<img src="${founder.photo}" alt="${founder.name}" width="160" height="160" loading="lazy" />` : founderCartoon()}</span>
          <div>
            <p class="pf-overline">A note from the founder</p>
            <p class="pf-name">${founder.name}</p>
            <p class="pf-role">${founder.role}</p>
          </div>
        </div>
        <blockquote class="pf-quote">“${founder.excerpt}”</blockquote>
        <ul class="pf-facts">
          ${founder.facts.map((f) => `<li>${icon('check', 'h-3.5 w-3.5 flex-none')}${f}</li>`).join('')}
        </ul>
        <a href="#founder-video" class="pf-watch"><span>${icon('play', 'h-3 w-3 translate-x-px', true)}</span>Watch ${founder.name.split(' ')[0]}’s video</a>
        <details class="pf-note group">
          <summary><span class="group-open:hidden">Read the full note</span><span class="hidden group-open:inline">Hide the note</span>${icon('chevron-down', 'h-4 w-4 transition-transform duration-300 group-open:rotate-180')}</summary>
          <div>${founder.note.map((p) => `<p>${p}</p>`).join('')}</div>
        </details>
      </div>`

/** The people on your account, by team (roles only), and a way through to the whole company */
const teamCard = () => `
      <div class="pf-team card">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <h3 class="pf-team-title">The people on your account</h3>
          <p class="pf-team-sub">Senior engineers, in your chat</p>
        </div>
        <ul class="pf-roles">
          ${accountTeam
            .map(
              (m) => `
          <li>
            <span class="pf-role-icon" aria-hidden="true">${icon(m.icon, 'h-5 w-5')}</span>
            <span><span class="pf-role-name">${m.role}</span><span class="pf-role-focus">${m.focus}</span></span>
          </li>`,
            )
            .join('')}
        </ul>
        <a href="${site.vavensoftUrl}" target="_blank" rel="noopener" class="pf-meet">
          <span><span class="pf-meet-title">Meet the whole team</span><span class="pf-meet-text">Who they are, what they’ve built, and how we work</span></span>
          <span class="pf-meet-go" aria-hidden="true">${icon('arrow-right', 'h-4 w-4')}</span>${newTab}
        </a>
      </div>`

/** The proof: the track record in four numbers, then the founder and the people on your account. */
export function statsSection(): Section {
  return {
    html: `
<section id="proof" class="border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800" aria-labelledby="proof-title">
  <div class="container-page">
    <div class="max-w-5xl">
      ${sectionHeading({
        id: 'proof-title',
        eyebrow: 'Built by Vavensoft',
        title: 'Built by the team behind <em>210+ products.</em>',
        description: 'VavenCloud is run by the software company that has been building and operating live products for more than a decade.',
      })}
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

    <div class="mt-16 grid gap-5 lg:grid-cols-[5fr_7fr]">
      ${founderCard()}
      ${teamCard()}
    </div>
  </div>
</section>`,
  }
}
