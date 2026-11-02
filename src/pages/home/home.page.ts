import { createPage } from '@/app/create-page.ts'
import { blogSection } from '@/modules/blog/blog.section.ts'
import { contactSection } from '@/modules/contact/contact.section.ts'
import { faqSection } from '@/modules/faq/faq.section.ts'
import { oneTeamSection } from '@/modules/one-team/one-team.section.ts'
import { ownershipSection } from '@/modules/ownership/ownership.section.ts'
import { pipelineSection } from '@/modules/pipeline/pipeline.section.ts'
import { plansSection } from '@/modules/pricing/plans.section.ts'
import { reportSection } from '@/modules/report/report.section.ts'
import { reviewsSection } from '@/modules/reviews/reviews.section.ts'
import { statsSection } from '@/modules/stats/stats.section.ts'
import { trackRecordSection } from '@/modules/track-record/track-record.section.ts'
import { heroSection } from './sections/hero.section.ts'

// Page order follows the buyer's journey in docs/messaging.md:
// recognition → relief → belief → safety → action
createPage({
  sections: [
    heroSection(), // recognition
    trackRecordSection(),
    ownershipSection(), // the problem, one night step by step
    oneTeamSection(), // relief, with how we compare
    reportSection(),
    pipelineSection(), // belief
    plansSection(), // ends with the exit promise (safety)
    reviewsSection(), // proof: clients
    statsSection(), // proof: the team
    faqSection(), // action
    blogSection(),
    contactSection(),
  ],
})
