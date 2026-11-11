import '../v2/v2.css'
import './v5.css'
import { createPage } from '@/app/create-page.ts'
import { blogSection } from '@/modules/blog/blog.section.ts'
import { contactSection } from '@/modules/contact/contact.section.ts'
import { faqSection } from '@/modules/faq/faq.section.ts'
import { reviewsV2 } from '@/pages/v2/sections/reviews.v2.ts'
import { stickyCtaV2 } from '@/pages/v2/sections/sticky-cta.v2.ts'
import { behindV5 } from './sections/behind.v5.ts'
import { compareV5 } from './sections/compare.v5.ts'
import { heroV5 } from './sections/hero.v5.ts'
import { ownV5 } from './sections/own.v5.ts'
import { plansV5 } from './sections/plans.v5.ts'
import { reportV5 } from './sections/report.v5.ts'
import { stagesV5 } from './sections/stages.v5.ts'
import { startV5 } from './sections/start.v5.ts'
import { chatV5 } from './sections/chat.v5.ts'
import { trackRecordV5 } from './sections/track-record.v5.ts'
import { chapters } from './v5.data.ts'

/*
 * v5 of the landing page (/v5/): a copy of v4 with every eyebrow tag removed (the small pills above the hero
 * title and section titles, e.g. "VavenCloud Infrastructure + Services"). Everything below is v4's description.
 *
 * v4 of the landing page (/v4/): v3's design with the v4 draft's order and copy. After the problem (v3's story,
 * now ending on what the night cost) it says what we own, meets you where you are, shows the morning after,
 * compares the real options, says who's behind it (then the clients' own words), and how we start, before the
 * plans. The copy lives in v5.data.ts; v4's own copies of the hero, the story and the report keep the landing
 * page, v2 and v3 exactly as they are.
 */
createPage({
  nav: chapters,
  sections: [
    heroV5(), // one call fixes it, on your cloud or ours
    trackRecordV5(),
    chatV5(), // that's exactly my night, and one call would have fixed it
    ownV5(), // and they'd own every layer of it
    stagesV5(), // wherever I am right now
    reportV5(), // here's what I'd actually get the next morning
    compareV5(), // against the other ways of doing it
    behindV5(), // who these people are
    reviewsV2(), // people like me trust them: in their own words
    startV5(), // switching isn't a risk
    plansV5(), // what I'd sign up for, and it's safe
    faqSection(), // but what about…?
    contactSection({ title: 'Get back to your customers. <em>We’ve got production.</em>' }),
    blogSection({ covers: true, title: 'What we’ve learned <em>on the 2am side of production.</em>' }),
    stickyCtaV2(),
  ],
})
