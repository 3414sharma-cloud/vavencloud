import './reviews.css'
import type { Section } from '@/app/types.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { icon } from '@/shared/ui/icons.ts'
import { clientFacts, founderVideo, reviews } from './reviews.data.ts'

/*
 * Hear it from us, then from our clients: the co-founder's video beside the reviews published on
 * vavencloud.com, under three figures.
 *  - The video shows YouTube's own thumbnail and only loads the player (youtube-nocookie) when it is played.
 *  - The reviews show one at a time and change only when asked (the numbered names under them, or the
 *    arrow keys), so nothing moves by itself. Reviews not on show are inert; they share one cell, so the
 *    card keeps the height of the longest.
 */

const pad = (n: number) => String(n).padStart(2, '0')

const quoteMark = `<svg class="rv-mark" viewBox="0 0 48 36" aria-hidden="true"><path d="M0 36V22C0 9 7 1.5 19 0l2 5.5C14 7.5 11 12 11 17h8v19H0zm27 0V22C27 9 34 1.5 46 0l2 5.5C41 7.5 38 12 38 17h8v19H27z" /></svg>`

const video = () => `
      <figure id="founder-video" class="rv-video">
        <div class="rv-video-box">
          <button type="button" class="rv-video-poster" data-video-play aria-label="Play the video: ${founderVideo.title}">
            <img src="https://i.ytimg.com/vi/${founderVideo.id}/maxresdefault.jpg" alt="" width="1280" height="720" loading="lazy" />
            <span class="rv-video-play" aria-hidden="true"><span>${icon('play', 'h-3.5 w-3.5 translate-x-px', true)}</span>Play video</span>
          </button>
        </div>
        <figcaption class="rv-video-caption">
          <span><span class="rv-overline">Meet our co-founder</span><span class="rv-video-name">${founderVideo.name}</span></span>
          <span class="rv-video-role">${founderVideo.role}</span>
        </figcaption>
      </figure>`

const review = (r: (typeof reviews)[number], i: number) => `
          <div id="rv-panel-${i}" role="tabpanel" aria-labelledby="rv-tab-${i}" class="rv-review${i === 0 ? ' is-active' : ''}" ${i === 0 ? '' : 'inert'}>
            <div class="flex items-start justify-between gap-4">
              <p class="rv-topic">${r.topic}</p>
              ${quoteMark}
            </div>
            <blockquote class="rv-quote">${r.quote}</blockquote>
            <p class="rv-who"><span class="rv-name">${r.name}</span><span class="rv-client">VavenCloud client</span></p>
          </div>`

const tab = (r: (typeof reviews)[number], i: number) => `
          <button type="button" role="tab" id="rv-tab-${i}" aria-controls="rv-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" class="rv-tab">
            <span class="rv-tab-bar" aria-hidden="true"></span>
            <span class="rv-tab-num" aria-hidden="true">${pad(i + 1)}</span>
            <span class="rv-tab-name">${r.name}</span>
          </button>`

const html = (overline: string) => `
<section id="clients" class="border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800" aria-labelledby="clients-title">
  <div class="container-page">
    <div class="flex flex-wrap items-end justify-between gap-x-12 gap-y-10">
      <div class="min-w-0 flex-[1_1_28rem]">
        <p class="rv-overline rv-overline--brand">${overline}</p>
        <h2 id="clients-title" class="section-title mt-4">Hear it from us. <span class="text-brand-600 dark:text-brand-400">Then from our clients.</span></h2>
      </div>
      <dl class="rv-facts">
        ${clientFacts.map((f) => `<div><dt class="sr-only">${f.label}</dt><dd class="rv-fact-value">${f.value}</dd><dd class="rv-fact-label" aria-hidden="true">${f.label}</dd></div>`).join('')}
      </dl>
    </div>

    <div class="mt-12 grid gap-5 lg:grid-cols-[7fr_5fr]">
      ${video()}
      <div class="rv-card card" data-reviews>
        <div class="rv-reviews">
          ${reviews.map(review).join('')}
        </div>
        <div role="tablist" aria-label="Choose a review" class="rv-tabs">
          ${reviews.map(tab).join('')}
        </div>
      </div>
    </div>
  </div>
</section>`

/** The video: swap the thumbnail for YouTube's player, already playing */
function initVideo(): void {
  qs('#clients [data-video-play]').addEventListener('click', (e) => {
    const iframe = document.createElement('iframe')
    iframe.src = `https://www.youtube-nocookie.com/embed/${founderVideo.id}?autoplay=1&rel=0&playsinline=1`
    iframe.title = founderVideo.title
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen'
    iframe.allowFullscreen = true
    iframe.className = 'rv-video-frame'
    ;(e.currentTarget as HTMLElement).replaceWith(iframe)
    iframe.focus()
  })
}

function initReviews(): void {
  const root = qs('#clients [data-reviews]')
  const panels = qsa('[role="tabpanel"]', root)
  const tabs = qsa<HTMLButtonElement>('[role="tab"]', root)
  let index = 0

  const show = (next: number, focus = false) => {
    index = (next + reviews.length) % reviews.length
    panels.forEach((p, i) => {
      p.classList.toggle('is-active', i === index)
      p.inert = i !== index
    })
    tabs.forEach((t, i) => {
      t.setAttribute('aria-selected', String(i === index))
      t.tabIndex = i === index ? 0 : -1
    })
    if (focus) tabs[index].focus()
  }
  tabs.forEach((t, i) => t.addEventListener('click', () => show(i)))
  qs('[role="tablist"]', root).addEventListener('keydown', (e) => {
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: reviews.length - 1 }
    if (!(e.key in keys)) return
    e.preventDefault()
    show(keys[e.key], true)
  })
}

/** `overline`: the small label above the heading, when a page names its chapters its own way */
export function reviewsSection({ overline = 'Client stories' }: { overline?: string } = {}): Section {
  return {
    html: html(overline),
    init() {
      initVideo()
      initReviews()
    },
  }
}
