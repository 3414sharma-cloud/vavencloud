import type { StageId } from '../v5.data.ts'

/*
 * One small diagram per stage in "Where are you today?" (stages.v5.ts), each drawing that stage's worry and
 * what we do about it: rose for the problem, the brand blue for the fix, as in the rest of the page. All share
 * one 220 x 112 frame, so they line up from card to card. Colours come from the .v4-dg-* classes in v4.css,
 * so they follow the theme. Each one is an image with its own description for screen readers.
 */

const frame = (label: string, body: string) =>
  `<svg viewBox="0 0 220 112" role="img" aria-label="${label}" font-family="inherit">${body}</svg>`

/** An arrow along y from x1 to x2, its head at x2 */
const arrow = (x1: number, x2: number, y: number) =>
  `<path class="v4-dg-line" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M${x1} ${y}H${x2}M${x2 - 4} ${y - 4}l4 4-4 4" />`

const label = (x: number, y: number, text: string, cls = 'v4-dg-text', size = 10.5) =>
  `<text class="${cls}" x="${x}" y="${y}" text-anchor="middle" font-size="${size}" font-weight="600">${text}</text>`

/** A small uppercase title in the top left of a chart */
const title = (text: string) =>
  `<text class="v4-dg-muted" x="14" y="14" font-size="9" font-weight="650" letter-spacing="0.08em">${text}</text>`

export const stageArt: Record<StageId, string> = {
  /* Idea → build → run, all with one team */
  idea: frame(
    'Idea, build and run, all with one team',
    `${arrow(60, 88, 42)}${arrow(130, 158, 42)}
    <circle class="v4-dg-surface v4-dg-brand" cx="40" cy="42" r="18" stroke-width="1.5" />
    <circle class="v4-dg-brand" fill="none" cx="40" cy="39" r="6" stroke-width="1.6" />
    <path class="v4-dg-brand" fill="none" stroke-width="1.6" stroke-linecap="round" d="M37 48.5h6M38 51.5h4" />
    <circle class="v4-dg-surface v4-dg-brand" cx="110" cy="42" r="18" stroke-width="1.5" />
    <path class="v4-dg-brand" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M105 36l-6 6 6 6M115 36l6 6-6 6" />
    <circle class="v4-dg-brand-fill" cx="180" cy="42" r="18" />
    <path fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M169 42h4l3-7 4 14 3-7h4" />
    ${label(40, 76, 'Idea')}${label(110, 76, 'Build')}${label(180, 76, 'Run')}
    <rect class="v4-dg-tint" x="18" y="88" width="184" height="18" rx="9" />
    ${label(110, 100.5, 'One team, from build to run', 'v4-dg-brand-text', 10)}`,
  ),

  /* A load test: at ten times the users the database breaks first, so it's fixed before launch */
  mvp: frame(
    'At ten times the users, the database breaks first, so it is fixed before launch',
    `${title('AT 10× REAL USERS')}
    ${label(190, 14, 'limit', 'v4-dg-bad-text', 9)}
    ${[
      ['Pages', 30, 58, 'v4-dg-brand-fill'],
      ['API', 50, 84, 'v4-dg-brand-fill'],
      ['Database', 70, 136, 'v4-dg-bad-fill'],
    ]
      .map(
        ([name, y, w, cls]) =>
          `<text class="v4-dg-text" x="14" y="${Number(y) + 3.5}" font-size="10.5" font-weight="600">${name}</text>
    <rect class="v4-dg-track" x="70" y="${Number(y) - 5}" width="136" height="10" rx="5" />
    <rect class="${cls}" x="70" y="${Number(y) - 5}" width="${w}" height="10" rx="5" />`,
      )
      .join('')}
    <path class="v4-dg-bad" fill="none" stroke-width="1.2" stroke-dasharray="3 3" d="M190 20V80" />
    <circle class="v4-dg-bad-fill" cx="206" cy="70" r="7" />
    <path fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" d="M206 66.5v4M206 73.4v.1" />
    <rect class="v4-dg-tint" x="70" y="88" width="136" height="18" rx="9" />
    ${label(138, 100.5, 'Fixed before launch', 'v4-dg-brand-text', 10)}`,
  ),

  /* Traffic spikes over the old limit (the outage, shaded); planned capacity steps up ahead of it */
  scale: frame(
    'A traffic spike goes over the old limit and the site goes down; planned capacity rises before the spike',
    `<defs><clipPath id="v4-dg-over"><rect x="0" y="0" width="220" height="58" /></clipPath></defs>
    <path class="v4-dg-line" fill="none" stroke-width="1.2" d="M14 94H206" />
    <path class="v4-dg-bad-tint" clip-path="url(#v4-dg-over)" d="M14 84C40 82 62 78 84 72S106 24 118 24S132 68 152 72S190 66 206 62V94H14Z" />
    <path class="v4-dg-bad" fill="none" stroke-width="1.4" stroke-dasharray="4 3" d="M14 58H206" />
    <path class="v4-dg-brand" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M62 58V18H206" />
    <path class="v4-dg-ink" fill="none" stroke-width="1.8" stroke-linecap="round" d="M14 84C40 82 62 78 84 72S106 24 118 24S132 68 152 72S190 66 206 62" />
    <text class="v4-dg-bad-text" x="14" y="52" font-size="9.5" font-weight="600">old limit</text>
    <text class="v4-dg-bad-text" x="140" y="50" font-size="9.5" font-weight="650">outage</text>
    <text class="v4-dg-brand-text" x="206" y="12" text-anchor="end" font-size="9.5" font-weight="650">planned capacity</text>
    <text class="v4-dg-muted" x="206" y="80" text-anchor="end" font-size="9.5" font-weight="600">traffic</text>`,
  ),

  /* The monthly bill grows with idle capacity in it; right-sized, it drops */
  cost: frame(
    'The monthly bill grows with idle capacity in it; after right-sizing it drops',
    `${title('MONTHLY BILL')}
    <path class="v4-dg-line" fill="none" stroke-width="1.2" d="M14 96H206" />
    ${[
      [22, 30, 10],
      [52, 34, 16],
      [82, 38, 22],
      [112, 42, 28],
    ]
      .map(
        ([x, used, idle]) =>
          `<rect class="v4-dg-used" x="${x}" y="${96 - used}" width="20" height="${used}" rx="2" />
    <rect class="v4-dg-bad-tint v4-dg-bad" x="${x + 0.6}" y="${96 - used - idle + 0.6}" width="18.8" height="${idle - 1.2}" rx="2" stroke-width="1.2" stroke-dasharray="2.5 2" />`,
      )
      .join('')}
    <rect class="v4-dg-brand-fill" x="152" y="52" width="20" height="44" rx="2" />
    <rect class="v4-dg-brand-fill" x="182" y="50" width="20" height="46" rx="2" />
    ${label(122, 20, 'idle', 'v4-dg-bad-text', 9.5)}
    <path class="v4-dg-brand" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M137 28l11 12M148 34.5v5.5h-5.5" />
    ${label(177, 42, 'right-sized', 'v4-dg-brand-text', 9.5)}`,
  ),

  /* No owner → everything documented → one team that understands it */
  owner: frame(
    'From no owner, to everything documented, to one team that understands it',
    `${arrow(60, 88, 44)}${arrow(130, 158, 44)}
    <circle class="v4-dg-surface v4-dg-bad" cx="40" cy="44" r="18" stroke-width="1.5" stroke-dasharray="4 3" />
    <text class="v4-dg-bad-text" x="40" y="50" text-anchor="middle" font-size="17" font-weight="700">?</text>
    <circle class="v4-dg-surface v4-dg-brand" cx="110" cy="44" r="18" stroke-width="1.5" />
    <path class="v4-dg-brand" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="M104 34h8l5 5v15h-13zM107 42.5h7M107 46.5h7M107 50.5h4" />
    <circle class="v4-dg-brand-fill" cx="180" cy="44" r="18" />
    <circle fill="none" stroke="#fff" stroke-width="1.6" cx="176" cy="40" r="3.2" />
    <circle fill="none" stroke="#fff" stroke-width="1.6" cx="185" cy="40" r="3.2" />
    <path fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" d="M170.5 52a5.5 5.5 0 0 1 11 0M179.5 52a5.5 5.5 0 0 1 11 0" />
    ${label(40, 80, 'No owner', 'v4-dg-bad-text')}${label(110, 80, 'Documented')}${label(180, 80, 'One team')}
    ${label(110, 102, 'Runbooks · access · backups', 'v4-dg-muted', 9.5)}`,
  ),
}
