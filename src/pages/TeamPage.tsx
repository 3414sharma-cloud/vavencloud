import { routes } from '@/app/routes.ts'
import { PageMeta } from '@/components/seo/PageMeta.tsx'
import { Engineers, Founders, HeroStage, Intro, TeamCta } from '@/features/team/Team.tsx'
import { useAutoReveal } from '@/hooks/useAutoReveal.ts'

/*
 * The team page (/team/), opened from "Meet the whole Vavensoft team" on the landing page and the "About" links.
 * The particle hero, then who's behind VavenCloud, the co-founders, the engineers on your account and one call
 * to action (features/team/).
 */
export function TeamPage() {
  // After every section's own effects (a parent's effects run after its children's)
  useAutoReveal()
  return (
    <>
      <PageMeta
        title="The team | VavenCloud by Vavensoft"
        path={routes.team}
        description="Meet the team behind VavenCloud: Vavensoft’s co-founders Jerry Bopara and Puneet Kumar, and the engineers who run your production 24/7."
      />
      <HeroStage />
      <Intro />
      <Founders />
      <Engineers />
      <TeamCta />
    </>
  )
}
