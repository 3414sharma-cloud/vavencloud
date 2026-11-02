import { routes } from '@/app/routes.ts'
import { site } from '@/app/site.config.ts'

export interface NavLink {
  label: string
  href: string
}

/** Core decision paths. The booking button remains the primary action. */
export const navLinks: NavLink[] = [
  { label: 'How we help', href: routes.oneTeam },
  { label: 'How it works', href: routes.process },
  { label: 'Plans', href: routes.plans },
  { label: 'About', href: routes.about },
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
