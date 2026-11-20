import { PageMeta } from '@/components/seo/PageMeta.tsx'
import { Behind } from '@/features/home/behind/Behind.tsx'
import { Blog } from '@/features/home/blog/Blog.tsx'
import { BookingSection } from '@/features/home/booking/BookingSection.tsx'
import { Compare } from '@/features/home/compare/Compare.tsx'
import { Faq } from '@/features/home/faq/Faq.tsx'
import { Hero } from '@/features/home/hero/Hero.tsx'
import { Own } from '@/features/home/own/Own.tsx'
import { Plans } from '@/features/home/plans/Plans.tsx'
import { Report } from '@/features/home/report/Report.tsx'
import { Reviews } from '@/features/home/reviews/Reviews.tsx'
import { Stages } from '@/features/home/stages/Stages.tsx'
import { Start } from '@/features/home/start/Start.tsx'
import { StickyCta } from '@/features/home/sticky-cta/StickyCta.tsx'
import { Story } from '@/features/home/story/Story.tsx'
import { TrackRecord } from '@/features/home/track-record/TrackRecord.tsx'
import { useAutoReveal } from '@/hooks/useAutoReveal.ts'

/*
 * The landing page (/). After the problem (the story, ending on what the night cost) it says who's behind it,
 * what we own, meets you where you are, shows the morning after, compares the real options, lets clients speak,
 * and how we start, before the plans. Each section is a feature in src/features/home/, with its own copy and
 * behaviour, styled with Tailwind in its own components.
 */
export function HomePage() {
  // After every section's own effects (a parent's effects run after its children's)
  useAutoReveal()
  return (
    <>
      <PageMeta
        title="Managed DevOps and 24/7 Server Support for Founders | VavenCloud"
        description="One team runs your servers, deployments and code, on call 24/7. Free production review with a senior engineer. Built by the team behind 210+ products."
        og={{
          title: 'When something breaks, you make one call. We fix the rest.',
          description:
            'One team runs your servers, deployments and code, on call 24/7. Free production review with a senior engineer.',
        }}
      />
      {/* What the visitor is thinking at each: one call fixes it, on my cloud or theirs */}
      <Hero />
      <TrackRecord />
      {/* That's exactly my night, and one call would have fixed it */}
      <Story />
      {/* Who these people are, and they'd own every layer of it */}
      <Behind />
      <Own />
      {/* Wherever I am right now, here's what I'd actually get the next morning */}
      <Stages />
      <Report />
      {/* Against the other ways of doing it; people like me trust them, in their own words */}
      <Compare />
      <Reviews />
      {/* Switching isn't a risk; what I'd sign up for, and it's safe; but what about…? */}
      <Start />
      <Plans />
      <Faq />
      <BookingSection title="Get back to your customers. <em>We’ve got production.</em>" />
      <Blog covers title="What we’ve learned <em>on the 2am side of production.</em>" />
      {/* Phones only: the booking button and the emergency line, between the hero and the form */}
      <StickyCta />
    </>
  )
}
