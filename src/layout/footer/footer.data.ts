import { routes } from '@/app/routes.ts'
import { site } from '@/app/site.config.ts'

export interface FooterColumn {
  title: string
  links: { label: string; href: string; external?: boolean }[]
}

export const footerColumns: FooterColumn[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Web Hosting', href: routes.services },
      { label: 'Cloud Servers', href: routes.services },
      { label: 'Launch Support', href: routes.services },
      { label: 'CDN & Backups', href: routes.services },
      { label: 'Engineers on call', href: routes.services },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'How it works', href: routes.process },
      { label: 'Why VavenCloud', href: routes.whyUs },
      { label: 'Plans', href: routes.plans },
      { label: 'FAQ', href: routes.faq },
      { label: 'Contact', href: routes.contact },
      { label: 'Blog', href: site.blogUrl, external: true },
    ],
  },
]

// TODO: point these at real pages once they exist
export const legalLinks = ['Privacy Policy', 'Terms of Service'].map((label) => ({ label, href: '#' }))
