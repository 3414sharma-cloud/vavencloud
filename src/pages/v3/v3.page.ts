import '../v2/v2.css'
import { createPage } from '@/app/create-page.ts'
import { blogSection } from '@/modules/blog/blog.section.ts'
import { contactSection } from '@/modules/contact/contact.section.ts'
import { faqSection } from '@/modules/faq/faq.section.ts'
import { reportSection } from '@/modules/report/report.section.ts'
import { trackRecordSection } from '@/modules/track-record/track-record.section.ts'
import { heroSection } from '@/pages/home/sections/hero.section.ts'
import { plansV2 } from '@/pages/v2/sections/plans.v2.ts'
import { reviewsV2 } from '@/pages/v2/sections/reviews.v2.ts'
import { stickyCtaV2 } from '@/pages/v2/sections/sticky-cta.v2.ts'
import { chapters } from '@/pages/v2/v2.data.ts'
import { storyV3 } from './sections/story.v3.ts'

/*
 * v3 of the landing page (/v3/): v2 with the problem told as a story (story.v3.ts). The site goes down, you
 * call your hosting provider, your DevOps freelancer and your developers, and each one passes it on; then one
 * call to VavenCloud fixes it. Every other chapter is v2's, in the same order and the same Sky palette.
 */
createPage({
  nav: chapters,
  sections: [
    heroSection(),
    trackRecordSection(),
    storyV3(), // that's exactly my night, and one call would have fixed it
    reportSection(),
    reviewsV2(),
    plansV2(),
    faqSection(),
    contactSection(),
    blogSection({ covers: true }),
    stickyCtaV2(),
  ],
})
