import { routes } from '@/app/routes.ts'

/*
 * Brand logo images (public/), from the old site (vavencloud-static-website/src/assets/logo.png):
 *  - logo.png        original: gradient "V" mark + indigo "Vavencloud" wordmark, for light backgrounds
 *  - logo-light.png  same mark with a white wordmark, for dark backgrounds
 * Both are 320x80 (4:1).
 */
const logoImg = (src: string, extra = '') =>
  `<img src="${src}" alt="" width="320" height="80" class="h-8 w-auto sm:h-9 ${extra}" decoding="async" />`

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
