import { v5Nav } from '@/pages/v5/v5.shell.ts'
import { createPage } from '@/app/create-page.ts'
import { SERVICE_LEVEL_AGREEMENT } from '@/modules/legal/data/serviceLevelAgreementData.ts'
import { legalPaths } from '@/modules/legal/legal.routes.ts'
import { legalSection } from '@/modules/legal/legal.section.ts'

createPage({
  nav: v5Nav,
  sections: [legalSection(SERVICE_LEVEL_AGREEMENT, legalPaths.serviceLevelAgreement)],
})