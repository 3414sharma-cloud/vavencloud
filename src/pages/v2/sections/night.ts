import type { Moment } from '@/modules/ownership/ownership.data.ts'

/*
 * The night of the outage as a card, used twice on v2: with three vendors (the problem, a light card) and
 * with VavenCloud (the fix, a dark one). Same times, same layout, so the second reads as the answer to the
 * first. Data from ownership.data.ts, the same night as on the landing page.
 */

export type Side = 'vendors' | 'vaven'

export const clock = (m: number) => `0${2 + Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`

/* Status colours as Tailwind classes, written out in full so they are picked up by the build */
const verdictTone: Record<Side, string> = {
  vendors: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
  vaven: 'bg-emerald-400/15 text-emerald-300',
}
const dotTone = { down: 'bg-rose-500', fixed: 'bg-emerald-400' }

export const nightRow = (time: string, m: Moment, side: Side) => `
          <li class="v2-row">
            <time class="v2-row-time">${time}</time>
            <div class="min-w-0">
              <p class="v2-row-text">${m.text}</p>
              ${m.reply ? `<p class="v2-row-reply">${m.reply}</p>` : ''}
            </div>
            ${m.verdict ? `<span class="v2-verdict ${verdictTone[side]}">${m.verdict}</span>` : ''}
          </li>`

/** The card: a title, how long the product was down, then the night line by line */
export const nightCard = (side: Side, title: string, status: { tone: 'down' | 'fixed'; text: string }, rows: string) => `
      <figure class="v2-night v2-night--${side} ${side === 'vaven' ? 'surface-ink' : ''}">
        <figcaption class="v2-night-head">
          <span class="v2-night-title">${title}</span>
          <span class="v2-night-status"><span class="v2-dot ${status.tone === 'down' ? 'v2-dot--live' : ''} ${dotTone[status.tone]}" aria-hidden="true"></span>${status.text}</span>
        </figcaption>
        <ol class="v2-rows">${rows}
        </ol>
      </figure>`
