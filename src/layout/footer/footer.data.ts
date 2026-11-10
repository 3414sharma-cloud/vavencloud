import { routes } from '@/app/routes.ts'
import { site } from '@/app/site.config.ts'
import { legalPaths } from '@/modules/legal/legal.routes.ts'

export interface FooterColumn {
  title: string
  links: { label: string; href: string; external?: boolean }[]
}

/** vavencloud.com, where the pages below live (same names as its navigation and footer) */
const vc = 'https://vavencloud.com'

export const footerColumns: FooterColumn[] = [
  {
    title: 'Hosting',
    links: [
      { label: 'Pricing', href: `${vc}/pricing`, external: true },
      { label: 'Web Hosting', href: `${vc}/web-hosting`, external: true },
      { label: 'Cloud Services', href: `${vc}/cloud-services`, external: true },
      { label: 'Email Solutions', href: `${vc}/email-solutions`, external: true },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Website Development', href: `${vc}/services`, external: true },
      { label: 'Mobile App Development', href: `${vc}/services#mobile`, external: true },
      { label: 'DevOps & Server Support', href: `${vc}/services#devops`, external: true },
      { label: 'Plans', href: routes.plans },
      { label: 'AWS & Azure price comparison', href: routes.comparison },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About VavenCloud', href: routes.about },
      { label: 'About Vavensoft', href: site.vavensoftUrl, external: true },
      { label: 'Contact', href: `${vc}/contact`, external: true },
      { label: 'Blog', href: site.blogUrl, external: true },
    ],
  },
]

/** The policies, as pages on this site (src/pages/<name>/), in vavencloud.com's footer order and wording */
export const legalLinks = [
  { label: 'Terms of Service', href: legalPaths.termsOfService },
  { label: 'Privacy Policy', href: legalPaths.privacyPolicy },
  { label: 'Acceptable Use Policy', href: legalPaths.acceptableUsePolicy },
  { label: 'SLA', href: legalPaths.serviceLevelAgreement },
  { label: 'Trust & Security', href: legalPaths.trustAndSecurity },
]

/** The copyright line, as on vavencloud.com */
export const copyrightOwner = 'Vavencloud, A Brand Of Vavensoft Private Limited. All Rights Reserved.'
