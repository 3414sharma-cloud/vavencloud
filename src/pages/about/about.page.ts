import { createPage } from '@/app/create-page.ts'
import { routes } from '@/app/routes.ts'
import type { Section } from '@/app/types.ts'
import { clientStoriesSection } from '@/modules/client-stories/client-stories.section.ts'
import { founderSection } from '@/modules/founder/founder.section.ts'
import { teamSection } from '@/modules/team/team.section.ts'
import { icon } from '@/shared/ui/icons.ts'

const aboutIntro = (): Section => ({
  html: `
<section id="about" class="band-linen -mt-18 border-b border-neutral-200 pt-36 pb-20 sm:pt-44 sm:pb-28 dark:border-neutral-800" aria-labelledby="about-title">
  <div class="container-page">
    <p class="text-xs font-semibold tracking-[0.14em] text-brand-700 uppercase dark:text-brand-300">About VavenCloud</p>
    <h1 id="about-title" class="mt-5 max-w-5xl text-5xl leading-[0.94] font-semibold tracking-[-0.06em] text-neutral-950 sm:text-7xl lg:text-[5.5rem] dark:text-white">A team that stays<br>after <span class="text-brand-600 dark:text-brand-400">launch.</span></h1>
    <div class="mt-10 grid max-w-4xl gap-8 border-t border-neutral-200 pt-7 sm:grid-cols-[0.8fr_1.2fr] dark:border-neutral-800">
      <p class="text-sm font-semibold tracking-wide text-neutral-500 uppercase">Production ownership<br>for live products</p>
      <div>
        <p class="text-xl leading-relaxed text-neutral-700 dark:text-neutral-300">VavenCloud is for founders who need someone to own what happens after the product ships. We run the servers, deployments and code, so a problem does not become a chain of handoffs.</p>
        <a href="${routes.book}" class="mt-7 inline-flex items-center gap-2 font-semibold text-neutral-950 underline underline-offset-4 hover:text-brand-700 dark:text-white dark:hover:text-brand-300">Book a free production review ${icon('arrow-right', 'h-4 w-4')}</a>
      </div>
    </div>
  </div>
</section>`,
})

createPage({
  sections: [aboutIntro(), founderSection(), teamSection(), clientStoriesSection()],
})
