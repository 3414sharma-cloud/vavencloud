import { createPage } from '@/app/create-page.ts'
import { compareSection } from '@/modules/compare/compare.section.ts'
import { contactSection } from '@/modules/contact/contact.section.ts'
import { faqSection } from '@/modules/faq/faq.section.ts'
import { featuresSection } from '@/modules/features/features.section.ts'
import { founderSection } from '@/modules/founder/founder.section.ts'
import { oneTeamSection } from '@/modules/one-team/one-team.section.ts'
import { pipelineSection } from '@/modules/pipeline/pipeline.section.ts'
import { plansSection } from '@/modules/pricing/plans.section.ts'
import { problemSection } from '@/modules/problem/problem.section.ts'
import { scopeSection } from '@/modules/scope/scope.section.ts'
import { statsSection } from '@/modules/stats/stats.section.ts'
import { heroSection } from './sections/hero.section.ts'

// Page order follows the buyer's journey in docs/messaging.md:
// recognition → relief → belief → safety → action
createPage({
  sections: [
    heroSection(), // recognition
    problemSection(),
    oneTeamSection(), // relief
    compareSection(), // belief
    pipelineSection(),
    plansSection(),
    scopeSection(), // safety (what we own + exit promise)
    featuresSection(),
    statsSection(), // proof
    founderSection(),
    faqSection(), // action
    contactSection(),
  ],
})
