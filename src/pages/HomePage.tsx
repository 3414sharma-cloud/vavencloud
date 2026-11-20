import { routes } from '@/app/routes.ts'
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
import { StickyCta } from '@/features/home/sticky-cta/StickyCta.tsx'
import { Story } from '@/features/home/story/Story.tsx'
import { TrackRecord } from '@/features/home/track-record/TrackRecord.tsx'
import { useAutoReveal } from '@/hooks/useAutoReveal.ts'

export function HomePage() {
  // After every section's own effects (a parent's effects run after its children's)
  useAutoReveal()
  return (
    <>
      <PageMeta
        title="Production Ownership for Founders | VavenCloud"
        path={routes.home}
        description="One team runs your servers, deployments and code, on call 24/7. Free 30-minute production review with a senior engineer. Built by the team behind 210+ products."
        og={{
          title: 'When something breaks, you make one call. We fix the rest.',
          description:
            'One team runs your servers, deployments and code, on call 24/7. Free 30-minute production review with a senior engineer.',
        }}
      />
      <Hero />
      <TrackRecord />
      <Story />
      <Own />
      <Stages />
      <Report />
      <Compare />
      <Behind>
        <Reviews />
      </Behind>
      <Plans />
      <Faq />
      <BookingSection title="Who would you call <em>tonight?</em>" />
      <Blog covers title="What we’ve learned <em>on the 2am side of production.</em>" />
      <StickyCta />
    </>
  )
}
