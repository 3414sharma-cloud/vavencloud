import '../v2/v2.css'
import '../v5/v5.css'
import { createPage } from '@/app/create-page.ts'
import { blogSection } from '@/modules/blog/blog.section.ts'
import { contactSection } from '@/modules/contact/contact.section.ts'
import { faqSection } from '@/modules/faq/faq.section.ts'
import { reviewsV2 } from '@/pages/v2/sections/reviews.v2.ts'
import { stickyCtaV2 } from '@/pages/v2/sections/sticky-cta.v2.ts'
import { behindV5 } from '../v5/sections/behind.v5.ts'
import { compareV5 } from '../v5/sections/compare.v5.ts'
import { heroV5 } from '../v5/sections/hero.v5.ts'
import { ownV5 } from '../v5/sections/own.v5.ts'
import { plansV5 } from '../v5/sections/plans.v5.ts'
import { reportV5 } from '../v5/sections/report.v5.ts'
import { stagesV5 } from '../v5/sections/stages.v5.ts'
import { startV5 } from '../v5/sections/start.v5.ts'
import { storyV4 } from '@/pages/v4/sections/story.v4.ts'
import { trackRecordV5 } from '../v5/sections/track-record.v5.ts'
import { chapters, clientReviews } from '../v5/v5.data.ts'

/*
 * v6 shares v5's layout, content and sections.
 * Only the stage images differ: planning and architecture boards instead of base images.
 */
createPage({
  nav: chapters,
  sections: [
    heroV5(), // one call fixes it, on your cloud or ours
    trackRecordV5(),
    storyV4(), // v4's story: that's exactly my night, and one call would have fixed it
    behindV5(), // who these people are
    ownV5(), // and they'd own every layer of it
    stagesV5({ imageVariant: 'plan' }), // wherever I am right now
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
