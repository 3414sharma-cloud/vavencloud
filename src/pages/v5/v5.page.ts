import '@/pages/v5/base/v2.css'
import './v5.css'
import { createPage } from '@/app/create-page.ts'
import { blogSection } from '@/modules/blog/blog.section.ts'
import { contactSection } from '@/modules/contact/contact.section.ts'
import { faqSection } from '@/modules/faq/faq.section.ts'
import { reviewsV2 } from '@/pages/v5/base/reviews.v2.ts'
import { stickyCtaV2 } from '@/pages/v5/base/sticky-cta.v2.ts'
import { behindV5 } from './sections/behind.v5.ts'
import { compareV5 } from './sections/compare.v5.ts'
import { heroV5 } from './sections/hero.v5.ts'
import { ownV5 } from './sections/own.v5.ts'
import { plansV5 } from './sections/plans.v5.ts'
import { reportV5 } from './sections/report.v5.ts'
import { stagesV5 } from './sections/stages.v5.ts'
import { startV5 } from './sections/start.v5.ts'
import { storyV4 } from '@/pages/v5/base/story.v4.ts'
import { trackRecordV5 } from './sections/track-record.v5.ts'
import { chapters, clientReviews } from './v5.data.ts'

/*
 * The landing page (/, src/pages/index.html). It is "v5", the only version left: the earlier versions (v2, v3,
 * v4 and the first landing page) were removed, and the pieces of them this page still uses now live in ./base/
 * (they keep their old names, e.g. story.v4.ts and v2.css, as the classes inside them do).
 *
 * After the problem (the story, ending on what the night cost) it says who's behind it, what we own, meets you
 * where you are, shows the morning after, compares the real options, lets clients speak, and how we start,
 * before the plans. The copy lives in v5.data.ts.
 */
createPage({
  nav: chapters,
  sections: [
    heroV5(), // one call fixes it, on your cloud or ours
    trackRecordV5(),
    storyV4(), // v4's story: that's exactly my night, and one call would have fixed it
    behindV5(), // who these people are
    ownV5(), // and they'd own every layer of it
    stagesV5(), // wherever I am right now
    reportV5(), // here's what I'd actually get the next morning
    compareV5(), // against the other ways of doing it
    reviewsV2(clientReviews), // people like me trust them: in their own words, with their photos
    startV5(), // switching isn't a risk
    plansV5(), // what I'd sign up for, and it's safe
    faqSection(), // but what about…?
    contactSection({ title: 'Get back to your customers. <em>We’ve got production.</em>' }),
    blogSection({ covers: true, title: 'What we’ve learned <em>on the 2am side of production.</em>' }),
    stickyCtaV2(),
  ],
})
