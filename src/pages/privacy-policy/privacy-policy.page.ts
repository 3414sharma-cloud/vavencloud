import { v5Nav } from '@/pages/v5/v5.shell.ts'
import { createPage } from '@/app/create-page.ts'
import { PRIVACY_POLICY } from '@/modules/legal/data/privacyPolicyData.ts'
import { legalPaths } from '@/modules/legal/legal.routes.ts'
import { legalSection } from '@/modules/legal/legal.section.ts'

createPage({
  nav: v5Nav,
  sections: [legalSection(PRIVACY_POLICY, legalPaths.privacyPolicy)],
})
