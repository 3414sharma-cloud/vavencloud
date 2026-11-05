import '@/pages/v2/sections/reviews.v2.css'
import type { Section } from '@/app/types.ts'
import { site } from '@/app/site.config.ts'
import { accountTeam } from '@/modules/stats/stats.data.ts'
import { qs } from '@/shared/lib/dom.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { behindIntro, behindStats, behindVideo, founders, teamIntro } from '../v5.data.ts'

/*
 * Who's behind it, just before the client stories, in two halves on a wide screen. On the left who VavenCloud
 * is and four numbers; on the right a co-founder on video, the two co-founders side by side, and a button that
 * opens the rest of the team (the engineers on your account, by role) across the whole width under both
 * halves. The video is YouTube's thumbnail until
 * it's played, then the player (youtube-nocookie), as in the client stories (reviews.v2.css styles both).
 */

const newTab = '<span class="sr-only"> (opens in a new tab)</span>'

const video = () => `
      <figure>
        <div class="tm-video">
          <button type="button" class="tm-poster" data-v4-play aria-label="Play the video: ${behindVideo.caption}">
            <img src="https://i.ytimg.com/vi/${behindVideo.id}/maxresdefault.jpg" alt="" width="1280" height="720" loading="lazy" draggable="false" />
            <span class="tm-play" style="left:${behindVideo.play.x};top:${behindVideo.play.y}" aria-hidden="true">${icon('play', 'h-5 w-5 translate-x-0.5', true)}</span>
          </button>
        </div>
        <figcaption class="v4-video-caption"><span class="tm-badge">${icon('play', 'h-2.5 w-2.5', true)}Video</span>${behindVideo.caption}</figcaption>
      </figure>`

const founderCards = () => `
      <ul class="v4-founders">
        ${founders
          .map(
            (p) => `
        <li class="v4-person card">
          <div class="v4-person-head">
            <span class="v4-avatar" aria-hidden="true">${p.initials}</span>
            <div class="min-w-0">
              <p class="v4-person-name">${p.name}</p>
              <p class="v4-person-role">${p.role}</p>
            </div>
          </div>
          <p class="v4-person-bio">${p.bio}</p>
        </li>`,
          )
          .join('')}
      </ul>`

/** The button, under the co-founders */
const teamButton = () => `
      <button type="button" class="btn-secondary v4-team-toggle" data-team-toggle aria-expanded="false" aria-controls="v4-team">
        <span data-team-label>Meet the rest of the team</span> ${icon('chevron-down', 'h-4 w-4')}
      </button>`

/** The engineers it shows, across the whole section under both halves: roles only, no invented names */
const teamPanel = () => `
      <div id="v4-team" class="v4-team" hidden>
        <p class="v4-team-intro">${teamIntro}</p>
        <ul class="v4-team-roles">
          ${accountTeam.map((m) => `<li><span class="icon-box">${icon(m.icon, 'h-4 w-4')}</span><span><b>${m.role}</b>${m.focus}</span></li>`).join('')}
        </ul>
        <p class="v4-team-more"><a href="${site.vavensoftUrl}" target="_blank" rel="noopener" class="v4-team-link">Meet the whole Vavensoft team${newTab} ${icon('arrow-right', 'h-4 w-4')}</a></p>
      </div>`

export function behindV5(): Section {
  return {
    html: `
<section id="behind" class="v2-section border-t border-neutral-200 dark:border-neutral-800" aria-labelledby="behind-title">
  <div class="container-page v4-behind">
    <div class="min-w-0">
      ${sectionHeading({
        id: 'behind-title',
        title: 'Built by engineers <em>who’ve done the 2am shift.</em>',
        description: behindIntro,
      })}
      <dl class="v4-stats" data-reveal>
        ${behindStats.map((s) => `<div><dt>${s.label}</dt><dd>${s.value}</dd></div>`).join('')}
      </dl>
    </div>
    <div class="v4-behind-side min-w-0">
      ${video()}
      ${founderCards()}
      ${teamButton()}
    </div>
    ${teamPanel()}
  </div>
</section>`,
    init() {
      const root = qs('#behind')

      // The thumbnail gives way to YouTube's player, already playing
      const poster = qs<HTMLButtonElement>('[data-v4-play]', root)
      poster.addEventListener('click', () => {
        const iframe = document.createElement('iframe')
        iframe.src = `https://www.youtube-nocookie.com/embed/${behindVideo.id}?autoplay=1&rel=0&playsinline=1`
        iframe.title = behindVideo.title
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen'
        iframe.allowFullscreen = true
        iframe.className = 'tm-frame'
        poster.replaceWith(iframe)
        iframe.focus()
      })

      // The rest of the team opens under the button, and closes again
      const toggle = qs<HTMLButtonElement>('[data-team-toggle]', root)
      const panel = qs('#v4-team', root)
      toggle.addEventListener('click', () => {
        const open = panel.hidden
        panel.hidden = !open
        toggle.setAttribute('aria-expanded', String(open))
        qs('[data-team-label]', toggle).textContent = open ? 'Hide the team' : 'Meet the rest of the team'
      })
    },
  }
}
