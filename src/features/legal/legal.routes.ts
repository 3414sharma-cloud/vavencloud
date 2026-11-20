import { routes } from '@/app/routes.ts'

/**
 * The legal pages, built here (src/pages/<name>/index.html), at the same paths as on vavencloud.com.
 * Trailing slashes, because each is its own page folder. Contact is the booking form on the landing page.
 */
export const legalPaths = {
  termsOfService: '/terms-of-service/',
  privacyPolicy: '/privacy-policy/',
  acceptableUsePolicy: '/acceptable-use-policy/',
  serviceLevelAgreement: '/sla/',
  trustAndSecurity: '/trust-and-security/',
  contact: routes.book,
} as const
