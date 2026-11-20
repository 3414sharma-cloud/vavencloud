import { ACCEPTABLE_USE_POLICY } from './data/acceptableUsePolicyData.ts'
import { PRIVACY_POLICY } from './data/privacyPolicyData.ts'
import { SERVICE_LEVEL_AGREEMENT } from './data/serviceLevelAgreementData.ts'
import { TERMS_OF_SERVICE } from './data/termsOfServiceData.ts'
import { TRUST_AND_SECURITY } from './data/trustAndSecurityData.ts'
import { legalPaths } from './legal.routes.ts'
import type { LegalPage } from './legal.types.ts'

/** The legal pages: each one's address and copy (the router makes a page of each) */
export const legalPages: { path: string; page: LegalPage }[] = [
  { path: legalPaths.termsOfService, page: TERMS_OF_SERVICE },
  { path: legalPaths.privacyPolicy, page: PRIVACY_POLICY },
  { path: legalPaths.acceptableUsePolicy, page: ACCEPTABLE_USE_POLICY },
  { path: legalPaths.serviceLevelAgreement, page: SERVICE_LEVEL_AGREEMENT },
  { path: legalPaths.trustAndSecurity, page: TRUST_AND_SECURITY },
]
