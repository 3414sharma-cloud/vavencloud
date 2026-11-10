import '@/pages/v2/sections/reviews.v2.css'
import './team.css'
import { v5Nav } from '@/pages/v5/v5.shell.ts'
import { behindIntro, behindStats, teamIntro } from '@/pages/v5/v5.data.ts'
import { createPage } from '@/app/create-page.ts'
import { routes } from '@/app/routes.ts'
import { site } from '@/app/site.config.ts'
import type { Section } from '@/app/types.ts'
import { accountTeam } from '@/modules/stats/stats.data.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { founders, members, ways, type Founder, type Member } from './team.data.ts'

/*
 * The team page (/team/), opened from "Meet the whole Vavensoft team" on v5 and the About page. In v5's look
 * (v5.shell.ts, data-landing="v5"): who's behind VavenCloud and four numbers, the two co-founders in full
 * (Jerry with his video), the engineers on your account by role, the team members (team.data.ts) and how
 * they work with you, then one call to action.
 */

const newTab = '<span class="sr-only"> (opens in a new tab)</span>'

const hero = (): Section => ({
  html: `
<section id="top" class="band-linen tp-hero -mt-18 border-b border-neutral-200 dark:border-neutral-800" aria-labelledby="team-title">
  <div class="container-page">
    <p class="tp-kicker">The team behind VavenCloud</p>
    <h1 id="team-title" class="tp-title">The people who own <em>your production.</em></h1>
    <p class="tp-lead">${behindIntro}</p>
    <dl class="tp-stats">
      ${behindStats.map((s) => `<div><dt>${s.label}</dt><dd>${s.value}</dd></div>`).join('')}
    </dl>
  </div>
</section>`,
})

/** A founder's video: YouTube's thumbnail until it's played, then the player (as on v5's "who's behind it") */
const video = (v: NonNullable<Founder['video']>, name: string) => `
          <div class="tm-video tp-video">
            <button type="button" class="tm-poster" data-play="${v.id}" data-title="${v.title}" aria-label="Play the video: ${name}">
              <img src="https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg" alt="" width="1280" height="720" loading="lazy" draggable="false" />
              <span class="tm-play" style="left:${v.play.x};top:${v.play.y}" aria-hidden="true">${icon('play', 'h-5 w-5 translate-x-0.5', true)}</span>
            </button>
          </div>`

const profile = (f: Founder) => `
      <article class="tp-founder card${f.video ? ' tp-founder--video' : ''}">
        ${f.video ? video(f.video, f.name) : ''}
        <div class="tp-founder-body">
          <div class="tp-founder-head">
            <span class="tp-avatar" aria-hidden="true">${f.initials}</span>
            <div class="min-w-0">
              <h3 class="tp-name">${f.name}</h3>
              <p class="tp-role">${f.role}</p>
            </div>
          </div>
          <p class="tp-bio">${f.bio}</p>
          <ul class="tp-facts">
            ${f.facts.map((x) => `<li><span class="tp-tick" aria-hidden="true">${icon('check', 'h-3 w-3')}</span>${x}</li>`).join('')}
          </ul>
          <ul class="tp-focus" aria-label="Focus">
            ${f.focus.map((x) => `<li>${x}</li>`).join('')}
          </ul>
        </div>
      </article>`

const foundersSection = (): Section => ({
  html: `
<section id="founders" class="v2-section" aria-labelledby="founders-title">
  <div class="container-page">
    <div class="max-w-4xl">
      ${sectionHeading({
        id: 'founders-title',
        title: 'Two co-founders. <em>Both still on the work.</em>',
        description:
          'Vavensoft and VavenCloud are run by the people who started them, and who still look at production systems every week.',
      })}
    </div>
    <div class="tp-founders">
      ${founders.map(profile).join('')}
    </div>
  </div>
</section>`,
  init() {
    qsa<HTMLButtonElement>('#founders [data-play]').forEach((poster) =>
      poster.addEventListener('click', () => {
        const iframe = document.createElement('iframe')
        iframe.src = `https://www.youtube-nocookie.com/embed/${poster.dataset.play}?autoplay=1&rel=0&playsinline=1`
        iframe.title = poster.dataset.title ?? ''
        iframe.allow =
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen'
        iframe.allowFullscreen = true
        iframe.className = 'tm-frame'
        poster.replaceWith(iframe)
        iframe.focus()
      }),
    )
  },
})

/** A team member's photo; until there is one, a head and shoulders on the brand colour (cropped to fill the card) */
const galleryPhoto = (m: Member) =>
  m.photo
    ? `<img src="${m.photo}" alt="${m.name}" width="640" height="800" loading="lazy" class="tp-gal-img" draggable="false" />`
    : `<svg class="tp-gal-img tp-gal-img--empty" viewBox="0 0 120 150" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><circle cx="60" cy="58" r="24" /><path d="M14 150c3-30 22-46 46-46s43 16 46 46z" /></svg>`

/**
 * One member, as a tall card: the photo fills it, the name and role sit over its foot, and on hover or focus
 * (or always, on a phone) the card opens to show their tags and a line about them.
 */
const galleryItem = (m: Member) => `
        <li class="tp-gal-item" tabindex="0">
          <div class="tp-gal-card">
            <div class="tp-gal-photo">${galleryPhoto(m)}</div>
            <div class="tp-gal-info">
              <p class="tp-gal-name">${m.name}</p>
              <p class="tp-gal-role">${m.role}</p>
              <div class="tp-gal-more">
                <div>
                  <ul class="tp-gal-tags" aria-label="Works on">${m.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
                  <p class="tp-gal-line">${m.line}</p>
                </div>
              </div>
            </div>
          </div>
        </li>`

/** The team as a gallery: a row of cards where the one you point at grows, and arrows that slide along when there are more than fit */
const gallery = () => `
    <div class="tp-gal" data-gallery style="--n:${members.length}">
      <div class="tp-gal-viewport">
        <ul class="tp-gal-track" role="list">${members.map(galleryItem).join('')}
        </ul>
      </div>
      <button type="button" class="tp-gal-nav tp-gal-nav--prev" data-gal-prev aria-label="Previous team members" hidden>${icon('chevron-left', 'h-5 w-5')}</button>
      <button type="button" class="tp-gal-nav tp-gal-nav--next" data-gal-next aria-label="Next team members" hidden>${icon('chevron-right', 'h-5 w-5')}</button>
    </div>`

/**
 * Slides the gallery: --start (the first visible card) moves the track in CSS; how many show at once (--per)
 * comes from the screen's width in team.css. The arrows only appear when there are more cards than fit, and
 * stop at each end. Tabbing to a card that's off to the side slides it into view.
 */
function initGallery(root: HTMLElement): void {
  const n = members.length
  const viewport = qs('.tp-gal-viewport', root)
  const prev = qs<HTMLButtonElement>('[data-gal-prev]', root)
  const next = qs<HTMLButtonElement>('[data-gal-next]', root)
  const items = qsa('.tp-gal-item', root)
  let start = 0

  const per = () => parseInt(getComputedStyle(root).getPropertyValue('--per'), 10) || 5
  const show = (to: number) => {
    const max = Math.max(n - per(), 0)
    start = Math.min(Math.max(to, 0), max)
    root.style.setProperty('--start', String(start))
    prev.hidden = next.hidden = max === 0
    prev.disabled = start <= 0
    next.disabled = start >= max
  }

  prev.addEventListener('click', () => show(start - 1))
  next.addEventListener('click', () => show(start + 1))
  window.addEventListener('resize', () => show(start))
  items.forEach((item, i) =>
    item.addEventListener('focusin', () => {
      // The browser scrolls a clipped box to a focused card: undo that and slide the track instead
      viewport.scrollLeft = 0
      if (i < start) show(i)
      else if (i >= start + per()) show(i - per() + 1)
    }),
  )
  show(0)
}

const teamSection = (): Section => ({
  html: `
<section id="engineers" class="v2-section border-t border-neutral-200 dark:border-neutral-800" aria-labelledby="engineers-title">
  <div class="container-page">
    <div class="max-w-4xl">
      ${sectionHeading({
        id: 'engineers-title',
        title: 'The engineers <em>on your account.</em>',
        description: teamIntro,
      })}
    </div>
    <ul class="tp-roles">
      ${accountTeam
        .map(
          (m) => `
      <li class="tp-role-card card">
        <span class="icon-box">${icon(m.icon, 'h-5 w-5')}</span>
        <h3 class="tp-role-title">${m.role}</h3>
        <p class="tp-role-text">${m.focus}</p>
      </li>`,
        )
        .join('')}
    </ul>
    ${
      members.length
        ? `
    <h3 class="tp-sub">Meet some of the team</h3>
    ${gallery()}`
        : ''
    }
    <h3 class="tp-sub">How the team works with you</h3>
    <ul class="tp-ways">
      ${ways.map((w) => `<li><span class="icon-box">${icon(w.icon, 'h-5 w-5')}</span><div><p class="tp-way-title">${w.title}</p><p class="tp-way-text">${w.text}</p></div></li>`).join('')}
    </ul>
  </div>
</section>`,
  init() {
    qsa('#engineers [data-gallery]').forEach(initGallery)
  },
})

const cta = (): Section => ({
  html: `
<section id="talk" class="v2-section" aria-labelledby="talk-title">
  <div class="container-page">
    <div class="tp-cta surface-ink">
      <div>
        <h2 id="talk-title" class="tp-cta-title">Talk to the people who’d run it.</h2>
        <p class="tp-cta-text">A free 45-minute production review with a senior engineer, not a salesperson. You keep the written roadmap either way.</p>
      </div>
      <div class="tp-cta-actions">
        <a href="${routes.book}" class="btn-primary !px-7 !py-3.5 !text-base">Book a free production review ${icon('arrow-right', 'h-4 w-4')}</a>
        <a href="${site.vavensoftUrl}" target="_blank" rel="noopener" class="tp-cta-link">More about Vavensoft${newTab} ${icon('arrow-right', 'h-4 w-4')}</a>
      </div>
    </div>
  </div>
</section>`,
})

createPage({
  nav: v5Nav,
  sections: [hero(), foundersSection(), teamSection(), cta()],
})
