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
 * Every one sits in a .vc-logo wrapper. The logo keeps its own colours, except "CLOUD": over it lies a
 * gradient in the site's current brand colours, cut to the letters by logo-cloud-mask.png (components.css).
 */

/**
 * A logo image in its wrapper, with the brand-colour overlay on "CLOUD". `wrapClass` takes the classes that
 * show or hide the logo (e.g. `dark:hidden`), so the overlay hides with it.
 */
export const logoImage = (src: string, className: string, alt = '', wrapClass = '') =>
  `<span class="vc-logo${src.includes('light') ? ' vc-logo--light' : ''} ${wrapClass}"><img src="${src}" alt="${alt}" width="777" height="120" class="${className}" decoding="async" /><i class="vc-logo-cloud" aria-hidden="true"></i></span>`

/** The "V" mark alone, `size` px square */
export const logoMark = (size: number, className: string) =>
  `<span class="vc-logo vc-logo--mark"><img src="/favicon.png" alt="" width="${size}" height="${size}" class="${className}" /></span>`

const logoImg = (src: string, wrapClass = '') => logoImage(src, 'h-8 w-auto sm:h-9', '', wrapClass)

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
      ? `${logoImg('/logo.png', 'dark:hidden')}${logoImg('/logo-light.png', 'hidden dark:inline-flex')}`
      : logoImg('/logo-light.png')
  return `<a href="${routes.top}" class="flex shrink-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 ${className}" aria-label="VavenCloud home">${images}</a>`
}
