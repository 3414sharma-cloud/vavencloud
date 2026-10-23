export interface FooterColumn {
  title: string
  links: { label: string; href: string }[]
}

import { routes } from '@/app/routes.ts'

// TODO: point these at real pages as they are added (see src/app/routes.ts)
export const footerColumns: FooterColumn[] = [
  {
    title: 'Services',
    links: ['Cloud Servers', 'Managed Cloud', 'Web Hosting', 'CDN & Edge', 'Backups & Storage'].map(
      (label) => ({ label, href: '#' }),
    ),
  },
  {
    title: 'Company',
    links: [
      { label: 'Pricing', href: routes.pricing },
      ...['About Us', 'Clients', 'Careers', 'Blog', 'Help Center'].map((label) => ({ label, href: '#' })),
    ],
  },
]

export const legalLinks = ['Privacy Policy', 'Terms of Service', 'Cookies'].map((label) => ({ label, href: '#' }))
