import { routes } from '@/app/routes.ts'

/*
 * Brand logo images (public/), from the old site (vavencloud-static-website/src/assets/logo.png):
 *  - logo.png        original: gradient "V" mark + indigo "Vavencloud" wordmark, for light backgrounds
 *  - logo-light.png  same mark with a white wordmark, for dark backgrounds
 *  - favicon.png     the "V" mark alone
 * The logos are 320x80 (4:1).
 *
 * Every one sits in a .vc-logo wrapper. As is, the wrapper changes nothing; on a page whose <html> has
 * data-logo="brand" (v3), the image's shape masks the wrapper and the site's brand colours fill it
 * (components.css), so the logo follows the palette.
 */

/** A logo image in its wrapper */
export const logoImage = (src: string, className: string, alt = '') =>
  `<span class="vc-logo" style="--logo:url(${src})"><img src="${src}" alt="${alt}" width="320" height="80" class="${className}" decoding="async" /></span>`

/** The "V" mark alone, `size` px square */
export const logoMark = (size: number, className: string) =>
  `<span class="vc-logo vc-logo--mark" style="--logo:url(/favicon.png)"><img src="/favicon.png" alt="" width="${size}" height="${size}" class="${className}" /></span>`

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
