import { routes } from '@/app/routes.ts'

/**
 * The legal pages' addresses, as set in "VavenCloud Legal Pages v1" (/terms, /privacy, /acceptable-use, /sla,
 * /trust), with the site's trailing slash. Contact is the booking form on the landing page.
 */
export const legalPaths = {
  termsOfService: '/terms/',
  privacyPolicy: '/privacy/',
  acceptableUsePolicy: '/acceptable-use/',
  serviceLevelAgreement: '/sla/',
  trustAndSecurity: '/trust/',
  contact: routes.book,
} as const

/**
 * Earlier addresses of the legal pages (vavencloud.com, old and new site), each sent on to its page today, so
 * links and search results that still use them keep working.
 */
export const legalRedirects: { from: string; to: string }[] = [
  { from: '/terms-of-service', to: legalPaths.termsOfService },
  { from: '/terms-and-conditions', to: legalPaths.termsOfService },
  { from: '/privacy-policy', to: legalPaths.privacyPolicy },
  { from: '/acceptable-use-policy', to: legalPaths.acceptableUsePolicy },
  { from: '/aup', to: legalPaths.acceptableUsePolicy },
  { from: '/service-level-agreement', to: legalPaths.serviceLevelAgreement },
  { from: '/trust-and-security', to: legalPaths.trustAndSecurity },
  { from: '/security', to: legalPaths.trustAndSecurity },
]
