import type { Section } from '@/app/types.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { behindIntro, behindStats, people } from '../v4.data.ts'

/*
 * Who's behind it, just before the client stories: who VavenCloud is, four numbers, and the people (the two
 * co-founders, then the engineers on your account, by role). Side by side on a wide screen.
 */
export function behindV4(): Section {
  return {
    html: `
<section id="behind" class="v2-section border-t border-neutral-200 dark:border-neutral-800" aria-labelledby="behind-title">
  <div class="container-page v4-behind">
    <div class="min-w-0">
      ${sectionHeading({
        id: 'behind-title',
        eyebrow: 'Who’s behind it',
        title: 'Built by engineers <em>who’ve done the 2am shift.</em>',
        description: behindIntro,
      })}
      <dl class="v4-stats" data-reveal>
        ${behindStats.map((s) => `<div><dt>${s.label}</dt><dd>${s.value}</dd></div>`).join('')}
      </dl>
    </div>
    <ul class="v4-people">
      ${people
        .map(
          (p) => `
      <li class="v4-person card${p.team ? ' v4-person--team' : ''}">
        <span class="v4-avatar" aria-hidden="true">${p.initials}</span>
        <div class="min-w-0">
          <p class="v4-person-name">${p.name}</p>
          <p class="v4-person-role">${p.role}</p>
          <p class="v4-person-bio">${p.bio}</p>
        </div>
      </li>`,
        )
        .join('')}
    </ul>
  </div>
</section>`,
  }
}
