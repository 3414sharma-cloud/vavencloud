import './portrait.css'

/*
 * Illustrated portraits, used wherever a real photo is not available yet (client stories, founder, team).
 * Give a person a `look`; when a real photo exists, pass its URL as `photo` and it is used instead.
 */

export type HairStyle = 'short' | 'long' | 'bun' | 'curly' | 'bald'

export interface Look {
  /** Background gradient, top-left to bottom-right. Any CSS colour, including var(--color-…) to follow the palette */
  bg: [string, string]
  skin: string
  hair: string
  style: HairStyle
  /** Any CSS colour, including var(--color-…) */
  shirt: string
  glasses?: boolean
  beard?: boolean
}

let portraitId = 0

const hairBack = (l: Look) =>
  l.style === 'long'
    ? `<path d="M26 46c-3-23 8-32 22-32s25 9 22 32c0 14 2 24-4 30H30c-6-6-4-16-4-30z" fill="${l.hair}"/>`
    : ''

const hairFront = (l: Look) => {
  switch (l.style) {
    case 'short':
      return `<path d="M31 42C29 25 37 15 48 15s19 10 17 27c-2-8-5-12-9-14-7 4-15 4-22 0-3 2-5 6-5 14z" fill="${l.hair}"/>`
    case 'long':
      return `<path d="M31 43C29 26 37 16 48 16s19 10 17 27c-3-9-7-13-12-15-5 4-14 5-22 0-2 3-3 8-4 15z" fill="${l.hair}"/>`
    case 'bun':
      return `<circle cx="48" cy="11" r="7" fill="${l.hair}"/><path d="M31 42C29 25 37 15 48 15s19 10 17 27c-2-8-5-12-9-14-7 4-15 4-22 0-3 2-5 6-5 14z" fill="${l.hair}"/>`
    case 'curly':
      return `<g fill="${l.hair}"><circle cx="33" cy="32" r="8"/><circle cx="41" cy="23" r="9"/><circle cx="55" cy="23" r="9"/><circle cx="63" cy="32" r="8"/><circle cx="48" cy="20" r="9"/></g>`
    default:
      return ''
  }
}

/** The portrait as an SVG that fills its box (the caller rounds and clips it). */
export function portrait(l: Look): string {
  const id = `pt-bg-${portraitId++}`
  const mouth = l.beard ? '#f5e6df' : '#7c2d12'
  return `
  <svg viewBox="0 0 96 96" class="block h-full w-full" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:${l.bg[0]}"/><stop offset="1" style="stop-color:${l.bg[1]}"/></linearGradient></defs>
    <rect width="96" height="96" fill="url(#${id})"/>
    ${hairBack(l)}
    <path d="M10 98c1-20 15-30 38-30s37 10 38 30z" style="fill:${l.shirt}"/>
    <rect x="41" y="55" width="14" height="18" rx="6" fill="${l.skin}"/>
    <path d="M41 63q7 6 14 0v-7H41z" fill="rgb(0 0 0 / 0.12)"/>
    <ellipse cx="48" cy="42" rx="16" ry="19" fill="${l.skin}"/>
    ${l.beard ? `<path d="M32 47c0 14 7 21 16 21s16-7 16-21c-2 4-5 6-9 6H41c-4 0-7-2-9-6z" fill="${l.hair}"/>` : ''}
    ${hairFront(l)}
    <ellipse class="pt-eye" cx="41" cy="44" rx="1.8" ry="2.2" fill="#1f2937"/>
    <ellipse class="pt-eye" cx="55" cy="44" rx="1.8" ry="2.2" fill="#1f2937"/>
    ${l.glasses ? '<g fill="none" stroke="#111827" stroke-width="1.5"><circle cx="41" cy="44" r="6"/><circle cx="55" cy="44" r="6"/><path d="M47 44h2"/></g>' : ''}
    <path d="M42 55q6 4 12 0" stroke="${mouth}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  </svg>`
}

/** A real photo when there is one, the illustrated portrait otherwise. Fills its (already clipped) box. */
export function personImage({ look, photo, name }: { look: Look; photo?: string; name: string }): string {
  return photo
    ? `<img src="${photo}" alt="${name}" width="160" height="160" loading="lazy" class="h-full w-full object-cover" />`
    : portrait(look)
}
