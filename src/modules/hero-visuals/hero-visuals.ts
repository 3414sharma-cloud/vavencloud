import './hero-visuals.css'
import { brandLogos } from '@/modules/track-record/brand-logos.ts'
import { icon } from '@/shared/ui/icons.ts'
import { cloud, incident, servers } from './hero-visuals.data.ts'

/*
 * The hero's visuals, one per thing we sell, each a small app window labelled as an example:
 *  - incident: an incident in the client portal, from the alert at 02:14 to the report at 09:00 (24/7 DevOps support)
 *  - cloud: the client's own AWS, Azure or Google Cloud account, kept healthy by our engineers (managed cloud)
 *  - servers: a new server going live on the VavenCloud dashboard (cloud servers)
 * Each plays once while it carries .is-playing (CSS only, see hero-visuals.css); restart it with playVisual().
 * The markup is the end state, so without .is-playing, or with reduced motion, it simply shows.
 */

export type VisualName = 'incident' | 'cloud' | 'servers'

interface VisualOptions {
  /** Start playing at once (the first slide, or a hero without a slider) */
  playing?: boolean
  /** Extra classes and inline style on the <figure>, e.g. the hero's load-in */
  className?: string
  style?: string
}

/* Status colours as Tailwind classes, written out in full so they are picked up by the build */
const ok = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
const okDot = '<i class="bg-emerald-500"></i>'
const avatarTone = {
  alert: 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300',
  engineer: 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300',
  done: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  report: 'bg-brand-600 text-white',
}

const figure = (name: VisualName, caption: string, body: string, { playing = false, className = '', style = '' }: VisualOptions) => `
      <figure class="hv hv--${name}${playing ? ' is-playing' : ''}${className ? ` ${className}` : ''}"${style ? ` style="${style}"` : ''} aria-labelledby="hv-${name}-caption">
        <div class="hv-window">${body}
        </div>
        <figcaption id="hv-${name}-caption" class="hv-caption">${caption}</figcaption>
      </figure>`

const bar = (app: string, appIcon: Parameters<typeof icon>[0], right: string) => `
          <div class="hv-bar" aria-hidden="true">
            <span class="hv-app">${icon(appIcon, 'h-3.5 w-3.5')}${app}</span>
            ${right}
          </div>`

/** A brand logo at a fixed height, its width from its viewBox */
const brand = (name: string, height: number) => {
  const l = brandLogos[name]
  const [, , w, h] = l.viewBox.split(' ').map(Number)
  return `<svg width="${Math.round((height * w) / h)}" height="${height}" viewBox="${l.viewBox}" fill="currentColor" aria-hidden="true">${l.body}</svg>`
}

/* ---------- 24/7 DevOps support: the incident ---------- */

/** Checkout's response time through the night: normal, the spike at 02:14, easing at 02:31, back at 02:41 */
const chart = `
          <div class="pm-chart" aria-hidden="true">
            <div class="pm-chart-labels"><span>Checkout response time</span><span class="text-emerald-700 dark:text-emerald-400">182 ms</span></div>
            <svg viewBox="0 0 300 64" preserveAspectRatio="none" class="pm-chart-svg">
              <defs>
                <linearGradient id="pm-line" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stop-color="#10b981" /><stop offset="0.1" stop-color="#f43f5e" /><stop offset="0.66" stop-color="#f43f5e" /><stop offset="0.74" stop-color="#10b981" />
                </linearGradient>
                <linearGradient id="pm-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f43f5e" stop-opacity="0.16" /><stop offset="1" stop-color="#f43f5e" stop-opacity="0" /></linearGradient>
              </defs>
              <path d="M0 52 L30 52 L42 10 L118 8 L132 12 L150 9 L168 30 L196 32 L214 52 L300 52 L300 64 L0 64 Z" fill="url(#pm-fill)" />
              <path d="M0 52 L30 52 L42 10 L118 8 L132 12 L150 9 L168 30 L196 32 L214 52 L300 52" fill="none" stroke="url(#pm-line)" stroke-width="2.4" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
            </svg>
            <div class="pm-chart-axis"><span>02:00</span><span class="text-rose-600 dark:text-rose-400">4.2 s at 02:14</span><span>03:00</span></div>
          </div>`

export const incidentVisual = (options: VisualOptions = {}) =>
  figure(
    'incident',
    'An example incident in the client portal, not a real client.',
    `${bar('Client portal', 'grid', '<span class="hv-url">yourapp.example</span>')}
          <div class="hv-head">
            <div class="min-w-0">
              <p class="hv-kicker">Incident · Production</p>
              <p class="hv-title">Checkout slow</p>
            </div>
            <span class="pm-status">
              <span class="hv-pill pm-status-live bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300" aria-hidden="true"><i class="bg-rose-500"></i>Investigating</span>
              <span class="hv-pill pm-status-done ${ok}">${okDot}Resolved in 27 min</span>
            </span>
          </div>
          ${chart}
          <ol class="pm-thread">
            ${incident
              .map(
                (m, k) => `
            <li class="pm-msg pm-msg--${m.tone}" style="--k:${k}">
              <span class="pm-avatar ${avatarTone[m.tone]}" aria-hidden="true">${icon(m.icon, 'h-3.5 w-3.5')}</span>
              <div class="min-w-0">
                <p class="pm-meta"><b>${m.who}</b><time>${m.time}</time></p>
                <p class="pm-text">${m.text}</p>
              </div>
            </li>`,
              )
              .join('')}
          </ol>`,
    options,
  )

/* ---------- Managed cloud: the client's own account ---------- */

export const cloudVisual = (options: VisualOptions = {}) =>
  figure(
    'cloud',
    'An example of a client’s own cloud account, run by our engineers.',
    `${bar('Your cloud account', 'cloud', `<span class="hv-live">${okDot}Watched 24/7</span>`)}
          <div class="hv-head">
            <div class="min-w-0">
              <p class="hv-kicker">Managed by VavenCloud</p>
              <p class="hv-title cv-providers">
                <span class="sr-only">Your AWS, Azure or Google Cloud account</span>
                ${cloud.providers.map((p, n) => `<span class="cv-provider" style="--n:${n}" aria-hidden="true">${brand(p, p === 'AWS' ? 18 : 16)}${p === 'AWS' ? '' : `<span>${p}</span>`}<span class="cv-account">account</span></span>`).join('')}
              </p>
            </div>
            <span class="hv-pill ${ok}">${okDot}All healthy</span>
          </div>
          <ul class="cv-resources">
            ${cloud.resources
              .map(
                (r, k) => `
            <li class="cv-row" style="--k:${k}">
              <span class="cv-icon" aria-hidden="true">${icon(r.icon, 'h-4 w-4')}</span>
              <div class="min-w-0">
                <p class="cv-name">${r.name}</p>
                <p class="cv-detail">${r.detail}</p>
              </div>
              <span class="hv-pill ${ok}">${okDot}${r.status}</span>
            </li>`,
              )
              .join('')}
          </ul>
          <ul class="hv-chips">
            ${cloud.facts.map((f) => `<li>${icon(f.icon, 'h-3.5 w-3.5')}${f.text}</li>`).join('')}
          </ul>`,
    options,
  )

/* ---------- Cloud servers: a new server going live ---------- */

export const serversVisual = (options: VisualOptions = {}) =>
  figure(
    'servers',
    'An example of a new server on the VavenCloud dashboard.',
    `${bar('VavenCloud dashboard', 'grid', '<span class="hv-url">New server</span>')}
          <div class="sv-body">
            <p class="sv-label">Region</p>
            <ul class="sv-regions">
              ${servers.regions.map((r) => `<li${r === servers.server.region ? ' class="is-on"' : ''}>${icon('map-pin', 'h-3.5 w-3.5')}${r}</li>`).join('')}
            </ul>
            <p class="sv-label">Plan</p>
            <div class="sv-plan"><span><b>${servers.plan}</b> · private VM</span><span class="sv-price">from <b>${servers.price}</b>/mo</span></div>
            <div class="sv-progress">
              <div class="sv-progress-labels">
                <span class="sv-creating" aria-hidden="true">Creating ${servers.server.name}…</span>
                <span class="sv-live text-emerald-700 dark:text-emerald-400">${icon('check', 'h-3.5 w-3.5')}Live in ${servers.liveIn}</span>
              </div>
              <span class="sv-bar" aria-hidden="true"><i class="bg-emerald-500"></i></span>
            </div>
            <div class="sv-server">
              <span class="sv-server-icon" aria-hidden="true">${icon('server', 'h-4 w-4')}</span>
              <div class="min-w-0">
                <p class="sv-server-name">${servers.server.name}</p>
                <p class="sv-server-meta">${servers.server.region} · ${servers.server.ip}</p>
              </div>
              <span class="hv-pill ${ok}">${okDot}Running</span>
            </div>
            <ul class="hv-chips">
              ${servers.extras.map((x) => `<li>${icon(x.icon, 'h-3.5 w-3.5')}${x.text}</li>`).join('')}
            </ul>
          </div>`,
    options,
  )

export const heroVisual: Record<VisualName, (options?: VisualOptions) => string> = {
  incident: incidentVisual,
  cloud: cloudVisual,
  servers: serversVisual,
}

/** Starts a visual's animation again from the beginning (or stops it, so it shows its end state) */
export function playVisual(root: HTMLElement, on = true): void {
  const visual = root.querySelector<HTMLElement>('.hv')
  if (!visual) return
  visual.classList.remove('is-playing')
  if (!on) return
  void visual.offsetWidth
  visual.classList.add('is-playing')
}
