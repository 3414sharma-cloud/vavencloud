import { routes } from '@/app/routes.ts'

export interface NavLink {
  label: string
  href: string
}

/** Landing page sections, in page order. */
export const navLinks: NavLink[] = [
  { label: 'How it works', href: routes.process },
  { label: 'Platform', href: routes.services },
  { label: 'Why VavenCloud', href: routes.whyUs },
  { label: 'Plans', href: routes.plans },
  { label: 'FAQ', href: routes.faq },
  { label: 'Contact', href: routes.contact },
]
