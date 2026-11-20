import { routes } from '@/app/routes.ts'
import { site } from '@/app/site.config.ts'
import { legalPaths } from '@/features/legal/legal.routes.ts'

export interface FooterColumn {
  title: string
  links: { label: string; href: string; external?: boolean }[]
}

export const footerColumns: FooterColumn[] = [
  {
    title: 'Company',
    links: [
      { label: 'About VavenCloud', href: routes.team },
      { label: 'About Vavensoft', href: site.vavensoftUrl, external: true },
      { label: 'Contact', href: routes.book },
      { label: 'Blog', href: site.blogUrl, external: true },
    ],
  },
]

/** The policies, linked along the footer's foot (features/legal/), in vavencloud.com's footer order and wording */
export const legalLinks = [
  { label: 'Terms of Service', href: legalPaths.termsOfService },
  { label: 'Privacy Policy', href: legalPaths.privacyPolicy },
  { label: 'Acceptable Use Policy', href: legalPaths.acceptableUsePolicy },
  { label: 'SLA', href: legalPaths.serviceLevelAgreement },
  { label: 'Trust & Security', href: legalPaths.trustAndSecurity },
]

/** The copyright line, as on vavencloud.com */
export const copyrightOwner = 'Vavencloud, A Brand Of Vavensoft Private Limited. All Rights Reserved.'
