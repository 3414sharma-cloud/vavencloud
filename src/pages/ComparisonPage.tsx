import { routes } from '@/app/routes.ts'
import { PageMeta } from '@/components/seo/PageMeta.tsx'
import { ComparisonCta, ComparisonHero, ComparisonTool } from '@/features/comparison/Comparison.tsx'
import { useAutoReveal } from '@/hooks/useAutoReveal.ts'

/*
 * The comparison page (/comparison/): what the same servers cost on AWS, Azure and VavenCloud, then who does the
 * work on each (features/comparison/).
 */
export function ComparisonPage() {
  // After every section's own effects (a parent's effects run after its children's)
  useAutoReveal()
  return (
    <>
      <PageMeta
        title="AWS vs Azure vs VavenCloud: price comparison | VavenCloud"
        path={routes.comparison}
        description="Compare what the same servers cost on AWS, Azure and VavenCloud, and what each charges for managed support. Change the sizes and see the difference."
      />
      <ComparisonHero />
      <ComparisonTool />
      <ComparisonCta />
    </>
  )
}
