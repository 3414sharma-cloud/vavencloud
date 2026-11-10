import { v5Nav } from '@/pages/v5/v5.shell.ts'
import { createPage } from '@/app/create-page.ts'
import { TRUST_AND_SECURITY } from '@/modules/legal/data/trustAndSecurityData.ts'
import { legalPaths } from '@/modules/legal/legal.routes.ts'
import { legalSection } from '@/modules/legal/legal.section.ts'

createPage({
  nav: v5Nav,
  sections: [legalSection(TRUST_AND_SECURITY, legalPaths.trustAndSecurity)],
})
