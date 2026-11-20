import { routes } from '@/app/routes.ts'
import { site } from '@/app/site.config.ts'

export interface NavLink {
  label: string
  href: string
}

/** The header's links: the landing page's chapters, in reading order. The one on screen is marked as you scroll. */
export const navLinks: NavLink[] = [
  { label: 'The problem', href: `${routes.home}#problem` },
  { label: 'What we own', href: `${routes.home}#own` },
  { label: 'Compare', href: `${routes.home}#compare` },
  { label: 'Plans', href: `${routes.home}#plans` },
  { label: 'FAQ', href: `${routes.home}#faq` },
]

/**
 * Thin bar above the navigation: the 24/7 emergency line, for the founder reading this with something broken.
 * Change `id` when the message changes, so dismissed bars show again.
 */
export const topBar = {
  id: 'emergency-line',
  text: 'Engineers on call 24/7. Site down right now?',
  /** The design spaces the number out; the link itself comes from site.config.ts */
  link: { label: 'Call +91 90609 79706', href: site.contact.phones[0].href },
}
