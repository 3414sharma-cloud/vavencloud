import { routes } from '@/app/routes.ts'

/*
 * Brand logo images (public/), made from the full-size logo public/Logo Cloud-1.png (trimmed, transparent):
 *  - logo.png        blue/pink "V" mark + charcoal "VAVEN" + blue "CLOUD", for light backgrounds
 *  - logo-light.png  the same with a white "VAVEN", for dark backgrounds
 *  - favicon.png     the "V" mark alone (256px square)
 *  - logo-text.png   the wordmark alone, and logo-mark.png the "V" alone, large: the shapes the team page's
 *                    particle hero forms (shared/effects/logo-particles.ts)
 * The logos are 777x120 (about 6.5:1).
 *
 * Every one sits in a .vc-logo wrapper. The logo keeps its own colours on every page (data-logo="brand" no
 * longer repaints it).
 */

/** A logo image in its wrapper */
export const logoImage = (src: string, className: string, alt = '') =>
  `<span class="vc-logo"><img src="${src}" alt="${alt}" width="777" height="120" class="${className}" decoding="async" /></span>`

/** The "V" mark alone, `size` px square */
export const logoMark = (size: number, className: string) =>
  `<span class="vc-logo vc-logo--mark"><img src="/favicon.png" alt="" width="${size}" height="${size}" class="${className}" /></span>`

const logoImg = (src: string, extra = '') => logoImage(src, `h-8 w-auto sm:h-9 ${extra}`)

interface BrandLinkOptions {
  /** Extra classes on the <a> */
  className?: string
  /**
   * `theme` (default): follows the light/dark theme.
   * `dark`: always the white-wordmark logo.
   */
  tone?: 'theme' | 'dark'
}

/** VavenCloud logo linking to the top of the page. */
export function brandLink({ className = '', tone = 'theme' }: BrandLinkOptions = {}): string {
  const images =
    tone === 'theme'
      ? `${logoImg('/logo.png', 'dark:hidden')}${logoImg('/logo-light.png', 'hidden dark:block')}`
      : logoImg('/logo-light.png')
  return `<a href="${routes.top}" class="flex shrink-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 ${className}" aria-label="VavenCloud home">${images}</a>`
}
