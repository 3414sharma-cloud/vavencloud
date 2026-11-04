import '../v2/v2.css'
import './v4.css'
import { createPage } from '@/app/create-page.ts'
import { blogSection } from '@/modules/blog/blog.section.ts'
import { contactSection } from '@/modules/contact/contact.section.ts'
import { faqSection } from '@/modules/faq/faq.section.ts'
import { trackRecordSection } from '@/modules/track-record/track-record.section.ts'
import { reviewsV2 } from '@/pages/v2/sections/reviews.v2.ts'
import { stickyCtaV2 } from '@/pages/v2/sections/sticky-cta.v2.ts'
import { behindV4 } from './sections/behind.v4.ts'
import { compareV4 } from './sections/compare.v4.ts'
import { heroV4 } from './sections/hero.v4.ts'
import { ownV4 } from './sections/own.v4.ts'
import { plansV4 } from './sections/plans.v4.ts'
import { reportV4 } from './sections/report.v4.ts'
import { stagesV4 } from './sections/stages.v4.ts'
import { startV4 } from './sections/start.v4.ts'
import { storyV4 } from './sections/story.v4.ts'
import { chapters } from './v4.data.ts'

/*
 * v4 of the landing page (/v4/): v3's design with the v4 draft's order and copy. After the problem (v3's story,
 * now ending on what the night cost) it says what we own, meets you where you are, shows the morning after,
 * compares the real options, says who's behind it (then the clients' own words), and how we start, before the
 * plans. The copy lives in v4.data.ts; v4's own copies of the hero, the story and the report keep the landing
 * page, v2 and v3 exactly as they are.
 */
createPage({
  nav: chapters,
  sections: [
    heroV4(), // one call fixes it, on your cloud or ours
    trackRecordSection({ label: 'Runs on what you already run' }),
    storyV4(), // that's exactly my night, and one call would have fixed it
    ownV4(), // and they'd own every layer of it
    stagesV4(), // wherever I am right now
    reportV4(), // here's what I'd actually get the next morning
    compareV4(), // against the other ways of doing it
    behindV4(), // who these people are
    reviewsV2(), // people like me trust them: in their own words
    startV4(), // switching isn't a risk
    plansV4(), // what I'd sign up for, and it's safe
    faqSection(), // but what about…?
    contactSection({ title: 'Get back to your customers. <em>We’ve got production.</em>' }),
    blogSection({ covers: true, title: 'What we’ve learned <em>on the 2am side of production.</em>' }),
    stickyCtaV2(),
  ],
})
