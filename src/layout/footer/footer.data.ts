import { routes } from '@/app/routes.ts'
import { site } from '@/app/site.config.ts'

export interface FooterColumn {
  title: string
  links: { label: string; href: string; external?: boolean }[]
}

export const footerColumns: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: routes.process },
      { label: 'Plans', href: routes.plans },
      { label: 'FAQ', href: routes.faq },
    ],
  },
  {
    title: 'Services',
    // The service pages on vavencloud.com
    links: [
      { label: 'Cloud servers', href: 'https://vavencloud.com/cloud-services', external: true },
      { label: 'Server security', href: 'https://vavencloud.com/services', external: true },
      { label: 'Web hosting', href: 'https://vavencloud.com/web-hosting', external: true },
      { label: 'Business email', href: 'https://vavencloud.com/email-solutions', external: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About VavenCloud', href: routes.about },
      { label: 'About Vavensoft', href: site.vavensoftUrl, external: true },
      { label: 'Contact', href: routes.book },
      { label: 'Blog', href: site.blogUrl, external: true },
    ],
  },
]

/** The policies published on vavencloud.com */
export const legalLinks = [
  { label: 'Terms', href: 'https://vavencloud.com/terms-of-service' },
  { label: 'Privacy', href: 'https://vavencloud.com/privacy-policy' },
  { label: 'Acceptable use', href: 'https://vavencloud.com/acceptable-use-policy' },
  { label: 'SLA', href: 'https://vavencloud.com/sla' },
]
