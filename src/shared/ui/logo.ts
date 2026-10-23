import { routes } from '@/app/routes.ts'

/*
 * Brand logo images (public/), from the old site (vavencloud-static-website/src/assets/logo.png):
 *  - logo.png        original: gradient "V" mark + indigo "Vavencloud" wordmark, for light backgrounds
 *  - logo-light.png  same mark with a white wordmark, for dark backgrounds
 * Both are 320x80 (4:1).
 */
const logoImg = (src: string, extra = '') =>
  `<img src="${src}" alt="" width="320" height="80" class="h-9 w-auto sm:h-10 ${extra}" decoding="async" />`

interface BrandLinkOptions {
  /** Extra classes on the <a> */
  className?: string
  /**
   * `dark`: always the white-wordmark logo (footer).
   * `auto`: both images, swapped by CSS via `.on-light` (navbar, see header.css).
   */
  tone?: 'dark' | 'auto'
}

/** VavenCloud logo linking to the top of the home page. */
export function brandLink({ className = '', tone = 'dark' }: BrandLinkOptions = {}): string {
  const images =
    tone === 'auto'
      ? `${logoImg('/logo-light.png', 'logo-on-dark')}${logoImg('/logo.png', 'logo-on-light')}`
      : logoImg('/logo-light.png')
  return `<a href="${routes.top}" class="flex shrink-0 items-center ${className}" aria-label="VavenCloud home">${images}</a>`
}
