import { routes } from '@/app/routes.ts'
import { site } from '@/app/site.config.ts'

export interface FooterColumn {
  title: string
  links: { label: string; href: string; external?: boolean }[]
}

// TODO: point the "#" links at real pages once they exist
export const footerColumns: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: routes.process },
      { label: 'Plans', href: routes.plans },
      { label: 'What we own', href: routes.scope },
      { label: 'Platform', href: routes.platform },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Vavensoft', href: site.vavensoftUrl, external: true },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: routes.book },
      { label: 'Blog', href: site.blogUrl, external: true },
    ],
  },
]

export const legalLinks = ['Terms', 'Privacy', 'Acceptable use', 'SLA'].map((label) => ({ label, href: '#' }))
