import { v5Nav } from '@/pages/v5/v5.shell.ts'
import { createPage } from '@/app/create-page.ts'
import { TERMS_OF_SERVICE } from '@/modules/legal/data/termsOfServiceData.ts'
import { legalPaths } from '@/modules/legal/legal.routes.ts'
import { legalSection } from '@/modules/legal/legal.section.ts'

createPage({
  nav: v5Nav,
  sections: [legalSection(TERMS_OF_SERVICE, legalPaths.termsOfService)],
})
