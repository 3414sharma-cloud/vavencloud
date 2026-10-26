import { createPage } from '@/app/create-page.ts'
import { builtBySection } from '@/modules/built-by/built-by.section.ts'
import { contactSection } from '@/modules/contact/contact.section.ts'
import { faqSection } from '@/modules/faq/faq.section.ts'
import { featuresSection } from '@/modules/features/features.section.ts'
import { needsSection } from '@/modules/needs/needs.section.ts'
import { pipelineSection } from '@/modules/pipeline/pipeline.section.ts'
import { problemSection } from '@/modules/problem/problem.section.ts'
import { plansSection } from '@/modules/pricing/plans.section.ts'
import { servicesSection } from '@/modules/services/services.section.ts'
import { statsSection } from '@/modules/stats/stats.section.ts'
import { heroSection } from './sections/hero.section.ts'

// Section order and the message each one carries: docs/messaging.md → "How the landing page uses this"
createPage({
  sections: [
    heroSection(),
    problemSection(),
    statsSection(),
    builtBySection(),
    pipelineSection(),
    servicesSection(),
    needsSection(),
    featuresSection(),
    plansSection(),
    faqSection(),
    contactSection(),
  ],
})
