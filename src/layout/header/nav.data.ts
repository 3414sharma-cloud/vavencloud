import { routes } from '@/app/routes.ts'
import { site } from '@/app/site.config.ts'
import type { IconName } from '@/shared/ui/icons.ts'

export interface NavChild {
  label: string
  href: string
  description: string
  icon: IconName
  /** Opens in a new tab (e.g. the blog) */
  external?: boolean
}

export interface NavLink {
  label: string
  href: string
  /** Small heading above the dropdown items, e.g. "Hosting plans" */
  heading?: string
  children?: NavChild[]
}

/** Same structure as the old site's navbar (vavencloud-static-website/src/components/layout/Navbar.tsx). */
export const navLinks: NavLink[] = [
  { label: 'Pricing', href: routes.pricing },
  {
    label: 'Hosting',
    href: routes.webHosting,
    heading: 'Hosting plans',
    children: [
      { label: 'Web Hosting', href: routes.webHosting, description: 'Fast, secure hosting with cPanel & free SSL', icon: 'globe' },
      { label: 'Cloud Services', href: routes.cloudServices, description: 'VPS, databases, load balancers & more', icon: 'server' },
    ],
  },
  {
    label: 'Services',
    // TODO: point at a /services/ page (with #mobile / #devops anchors) once it exists
    href: routes.services,
    heading: 'Development',
    children: [
      { label: 'Website Development', href: routes.services, description: 'Websites & SaaS built to scale', icon: 'code' },
      { label: 'Mobile App Development', href: routes.services, description: 'iOS & Android apps', icon: 'smartphone' },
      { label: 'DevOps & Server Support', href: routes.services, description: 'CI/CD, monitoring & server management', icon: 'infinity' },
    ],
  },
  // Email Solutions hidden for now. To bring it back: { label: 'Email Solutions', href: <email page route> },
  {
    label: 'Help Center',
    href: routes.contact,
    heading: 'Help',
    children: [
      { label: 'Blogs', href: site.blogUrl, description: 'Guides, tips & product news', icon: 'book', external: true },
      { label: 'Contact Us', href: routes.contact, description: 'Talk to our team, 24/7', icon: 'support' },
    ],
  },
]
