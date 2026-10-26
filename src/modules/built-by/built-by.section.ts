import './built-by.css'
import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { icon, type IconName } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'

interface Builder {
  icon: IconName
  who: string
  text: string
}

/** "Built by anyone" (docs/messaging.md, supporting message 1): whoever made it, we can run it. */
const builders: Builder[] = [
  { icon: 'users', who: 'Your own team', text: 'Keep shipping. We look after the servers, the deploys and the 3 a.m. alerts.' },
  { icon: 'code', who: 'A freelancer', text: 'When the project wraps up, your app still has a home and someone looking after it.' },
  { icon: 'layers', who: 'An agency', text: 'They hand it over, we keep it running. No gap between launch and support.' },
  { icon: 'sparkles', who: 'AI tools', text: 'Made it with AI? We get your prototype ready for real users and real traffic.' },
]

const card = (b: Builder, i: number) => `
  <li class="built-by-card group card relative flex flex-col p-6 transition-colors hover:border-neutral-400 dark:hover:border-neutral-600" style="--i:${i}">
    <span class="icon-box transition-colors group-hover:border-brand-600 group-hover:text-brand-600 dark:group-hover:border-brand-400 dark:group-hover:text-brand-300">${icon(b.icon, 'h-5 w-5')}</span>
    <p class="mt-5 text-xs font-medium tracking-wide text-neutral-500 uppercase">Built by</p>
    <h3 class="mt-1 text-lg font-semibold text-neutral-950 dark:text-white">${b.who}</h3>
    <p class="mt-2 leading-relaxed">${b.text}</p>
  </li>`

export function builtBySection(): Section {
  return {
    html: `
<section id="built-by" class="border-t border-neutral-200 py-20 sm:py-28 dark:border-neutral-800">
  <div class="container-page">
    <div class="mx-auto max-w-2xl text-center">
      ${sectionHeading({
        eyebrow: 'Built by anyone',
        title: "It doesn't matter who built it",
        description: "If it runs on the web, we can run it. You don't need to change your code, your stack or your team.",
      })}
    </div>

    <ul class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      ${builders.map(card).join('')}
    </ul>

    <!-- Every path flows into one place (decorative, wide screens) -->
    <div class="built-by-merge relative hidden h-20 lg:block" aria-hidden="true">
      <span class="built-by-drop" style="left:12.5%"></span>
      <span class="built-by-drop" style="left:37.5%"></span>
      <span class="built-by-drop" style="left:62.5%"></span>
      <span class="built-by-drop" style="left:87.5%"></span>
      <span class="built-by-rail"></span>
      <span class="built-by-drop built-by-drop--center" style="left:50%"></span>
    </div>

    <div class="mt-10 flex justify-center lg:mt-0">
      <div class="inline-flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-5 text-center shadow-sm sm:flex-row sm:text-left dark:border-neutral-800 dark:bg-neutral-900">
        <span class="built-by-live relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">${icon('cloud', 'h-5 w-5')}</span>
        <p class="text-sm">
          <span class="block font-semibold text-neutral-950 dark:text-white">Live on VavenCloud</span>
          Hosted, monitored, backed up and supported.
        </p>
        <a href="${routes.contact}" class="btn-primary sm:ml-4">Bring your app ${icon('arrow-right', 'h-4 w-4')}</a>
      </div>
    </div>
  </div>
</section>`,
  }
}
