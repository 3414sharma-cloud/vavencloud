import '@/pages/v5/base/reviews.v2.css'
import './team.css'
import { v5Nav } from '@/pages/v5/v5.shell.ts'
import { behindIntro, behindStats, teamIntro } from '@/pages/v5/v5.data.ts'
import { createPage } from '@/app/create-page.ts'
import { routes } from '@/app/routes.ts'
import { site } from '@/app/site.config.ts'
import type { Section } from '@/app/types.ts'
import { accountTeam } from '@/modules/stats/stats.data.ts'
import { mountLogoParticles } from '@/shared/effects/logo-particles.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { founders, members, ways, type Founder, type Member } from './team.data.ts'

/*
 * The team page (/team/), opened from "Meet the whole Vavensoft team" on v5 and the "About" links. In v5's look
 * (v5.shell.ts, data-landing="v5"): who's behind VavenCloud and four numbers, the two co-founders in full
 * (Jerry with his video), the engineers on your account by role, the team members (team.data.ts) and how
 * they work with you, then one call to action.
 *
 * The hero is a full-screen black stage with the logo in particles (shared/effects/logo-particles.ts): dots
 * that form the "VAVENCLOUD" wordmark, then fly across into the "V" mark and back, in the logo's colours,
 * pushed aside by the pointer, gathered by a press and thrown out on release. Corner marks, the form's number, a hint and a line that
 * fills until the next form frame it. It is decorative (aria-hidden) and always dark, like v5's hero, so the
 * header turns dark over it (.v5-hero-dark). The title, intro and numbers follow in their own block.
 * Scrolling down, the dots pour out of the hero and its frame fades, while the intro slides up over it as a
 * rounded sheet and its lines rise in.
 */

const newTab = '<span class="sr-only"> (opens in a new tab)</span>'

const hero = (): Section => ({
  html: `
<section id="top" class="dark v5-hero-dark tp-hero" aria-hidden="true">
  <div class="tp-stage" data-logo-stage>
    <span class="tp-corner"></span><span class="tp-corner"></span><span class="tp-corner"></span><span class="tp-corner"></span>
    <span class="tp-form-label" data-form-label>FORM / 01</span>
    <span class="tp-hint">move = repel · hold = gather · release = burst</span>
    <span class="tp-progress"><i data-form-progress></i></span>
  </div>
</section>
<section id="intro" class="band-linen tp-intro border-b border-neutral-200 dark:border-neutral-800" aria-labelledby="team-title">
  <div class="container-page">
    <p class="tp-kicker" data-reveal>The team behind VavenCloud</p>
    <h1 id="team-title" class="tp-title" data-reveal>The people who own <em>your production.</em></h1>
    <p class="tp-lead" data-reveal>${behindIntro}</p>
    <dl class="tp-stats" data-reveal>
      ${behindStats.map((s) => `<div><dt>${s.label}</dt><dd>${s.value}</dd></div>`).join('')}
    </dl>
  </div>
</section>`,
  init() {
    const stage = qs('#top [data-logo-stage]')
    const label = qs('[data-form-label]', stage)
    mountLogoParticles(stage, {
      sources: ['/logo-text.png', '/logo-mark.png'], // first the wordmark, then the "V" mark
      holds: [7, 6],
      backdrop: true,
      // The logo's colours, blended a third of the way toward the site's sky blue; glow and trail in sky blue
      tint: { colour: '--color-brand-400', amount: 0.3 },
      accent: '--color-brand-400',
      scrollOut: true, // scrolling down, the dots pour out of the hero as the intro slides up over it
      progress: qs('[data-form-progress]', stage),
      onForm: (form) => (label.textContent = `FORM / 0${form + 1}`),
      onReady: () => stage.classList.add('is-ready'),
    })
  },
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
    ? `<img src="${m.photo}" alt="${m.role}" width="800" height="800" loading="lazy" decoding="async" class="tp-gal-img" draggable="false" />`
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
              <p class="tp-gal-name">${m.tagline}</p>
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

/** At most this many cards share a row on a wide screen */
const PER_ROW = 5

/** Splits the members into rows as even as possible (9 → 5 + 4, 7 → 4 + 3), the longer rows first */
const rows = (list: Member[]): Member[][] => {
  const count = Math.ceil(list.length / PER_ROW)
  const out: Member[][] = []
  for (let r = 0, from = 0; r < count; r++) {
    const size = Math.ceil((list.length - from) / (count - r))
    out.push(list.slice(from, from + size))
    from += size
  }
  return out
}

/**
 * The team as a gallery, with no sliding: on a wide screen, rows of tall cards where the one you point at (or
 * tab to) grows and opens; on smaller screens, a plain grid of cards. Every card is always on the page.
 */
const gallery = () => `
    <ul class="tp-gal" role="list">${rows(members)
      .map((row) => `<li class="tp-gal-row"><ul class="tp-gal-track" role="list">${row.map(galleryItem).join('')}</ul></li>`)
      .join('')}
    </ul>`

const teamSection = (): Section => ({
  html: `
<section id="engineers" class="v2-section border-t border-neutral-200 dark:border-neutral-800" aria-labelledby="engineers-title">
  <div class="container-page">
    <div class="tp-engineers-layout">
    <div class="tp-engineers-intro">
      ${sectionHeading({
        id: 'engineers-title',
        title: 'The engineers <em>on your account.</em>',
        description: teamIntro,
      })}
    </div>
    <ul class="tp-roles">
      ${accountTeam
        .map(
          (m, i) => `
      <li class="tp-role-card">
        <span class="tp-role-number" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <span class="icon-box">${icon(m.icon, 'h-5 w-5')}</span>
        <div class="tp-role-copy"><h3 class="tp-role-title">${m.role}</h3>
        <p class="tp-role-text">${m.focus}</p></div>
      </li>`,
        )
        .join('')}
    </ul>
    </div>
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
