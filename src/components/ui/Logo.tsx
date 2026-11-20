import { Link } from 'react-router'
import { routes } from '@/app/routes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * Brand logo images (public/), made from the full-size logo public/Logo Cloud-1.png (trimmed, transparent):
 *  - logo.png        blue/pink "V" mark + charcoal "VAVEN" + blue "CLOUD", for light backgrounds
 *  - logo-light.png  the same with a white "VAVEN", for dark backgrounds
 *  - favicon.png     the "V" mark alone (256px square)
 *  - logo-text.png   the wordmark alone, and logo-mark.png the "V" alone, large: the shapes the team page's
 *                    particle hero forms
 * The logos are 777x120 (about 6.5:1).
 *
 * The logo keeps its own colours, except "CLOUD": over it lies a gradient in the site's current brand colours,
 * cut to the letters by logo-cloud-mask.png (the same 777x120 size as the logo, so it lines up at any height).
 * On dark backgrounds (logo-light.png) the gradient is lighter.
 */

const wrap = 'relative inline-flex flex-none'
const cloud =
  'pointer-events-none absolute inset-0 [mask:url(/logo-cloud-mask.png)_0_0/100%_100%_no-repeat] [-webkit-mask:url(/logo-cloud-mask.png)_0_0/100%_100%_no-repeat]'
const cloudOnLight =
  'bg-[linear-gradient(90deg,var(--color-brand-700)_58%,var(--color-brand-500)_80%,var(--color-brand-400))]'
const cloudOnDark =
  'bg-[linear-gradient(90deg,var(--color-brand-400)_58%,var(--color-brand-300)_80%,var(--color-brand-200))]'

interface LogoImageProps {
  src: string
  className: string
  alt?: string
  /** Classes that show or hide the logo (e.g. `dark:hidden`), so the "CLOUD" overlay hides with it */
  wrapClass?: string
}

/** A logo image with the brand-colour overlay on "CLOUD". */
export function LogoImage({ src, className, alt = '', wrapClass = '' }: LogoImageProps) {
  return (
    <span className={cn(wrap, wrapClass)}>
      <img src={src} alt={alt} width="777" height="120" className={className} decoding="async" />
      <i className={`${cloud} ${src.includes('light') ? cloudOnDark : cloudOnLight}`} aria-hidden="true" />
    </span>
  )
}

/** The "V" mark alone, `size` px square */
export function LogoMark({ size, className }: { size: number; className: string }) {
  return (
    <span className={wrap}>
      <img src="/favicon.png" alt="" width={size} height={size} className={className} />
    </span>
  )
}

const HeaderLogo = ({ src, wrapClass }: { src: string; wrapClass?: string }) => (
  <LogoImage src={src} className="h-8 w-auto sm:h-9" wrapClass={wrapClass} />
)

interface BrandLinkProps {
  /** Extra classes on the <a> */
  className?: string
  /** `theme` (default): follows the light/dark theme. `dark`: always the white-wordmark logo. */
  tone?: 'theme' | 'dark'
}

/** VavenCloud logo linking to the top of the page. */
export function BrandLink({ className = '', tone = 'theme' }: BrandLinkProps) {
  return (
    <Link
      to={routes.top}
      className={`flex shrink-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 ${className}`}
      aria-label="VavenCloud home"
    >
      {tone === 'theme' ? (
        <>
          <HeaderLogo src="/logo.png" wrapClass="dark:hidden" />
          <HeaderLogo src="/logo-light.png" wrapClass="hidden dark:inline-flex" />
        </>
      ) : (
        <HeaderLogo src="/logo-light.png" />
      )}
    </Link>
  )
}
