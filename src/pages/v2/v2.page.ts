import './v2.css'
import { createPage } from '@/app/create-page.ts'
import { blogSection } from '@/modules/blog/blog.section.ts'
import { contactSection } from '@/modules/contact/contact.section.ts'
import { faqSection } from '@/modules/faq/faq.section.ts'
import { reportSection } from '@/modules/report/report.section.ts'
import { trackRecordSection } from '@/modules/track-record/track-record.section.ts'
import { heroSection } from '@/pages/home/sections/hero.section.ts'
import { plansV2 } from './sections/plans.v2.ts'
import { problemV2 } from './sections/problem.v2.ts'
import { reviewsV2 } from './sections/reviews.v2.ts'
import { stickyCtaV2 } from './sections/sticky-cta.v2.ts'
import { chapters } from './v2.data.ts'

/*
 * v2 of the landing page (/v2/), in the Sky palette: the same offer told as one short story, so a visitor
 * never loses the thread. The opening is the main landing page's hero (the three-slide slider). Then the
 * problem (played out: three suppliers, then one call) → what you get → proof → plans → questions → book. Proof comes
 * before the plans (belief before commitment), the testimonials are the client stories (one section, not
 * two), and the blog comes after the booking form, for visitors who aren't ready yet, so it never pulls
 * anyone off the page before they've seen the offer. The header lists the chapters and marks the one on
 * screen; on phones a bar keeps the booking button and the emergency line in reach.
 */
createPage({
  nav: chapters,
  sections: [
    heroSection(), // the same opening slider as the main landing page
    trackRecordSection(), // works with the cloud I'm on
    problemV2(), // that's exactly my night, and one call would have fixed it
    reportSection(), // and here's what I'd actually get: the morning-after report
    reviewsV2(), // people like me trust them: in their own words
    plansV2(), // what I'd sign up for, and it's safe
    faqSection(), // but what about…?
    contactSection(), // what do I do now?
    blogSection({ covers: true }), // not ready yet: read
    stickyCtaV2(),
  ],
})
