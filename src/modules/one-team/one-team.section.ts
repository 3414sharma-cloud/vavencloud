import './one-team.css'
import type { Section } from '@/app/types.ts'
import { icon, type IconName } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'

/**
 * "The answer: one team, every layer" (VavenCloud-Sample-Content.md).
 * Reuses the merge-lines design: three pillars flow into one promise, then the portal/dashboard table.
 */
const pillars: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'server',
    title: 'The infrastructure',
    text: 'Run your product on VavenCloud, our own cloud platform in US and European data centres, built for availability from day one. Already on AWS, Azure or Google Cloud? We can take ownership there too.',
  },
  {
    icon: 'support',
    title: 'The engineers',
    text: 'Senior DevOps engineers who learn your product, set up your deployments and monitoring, and watch it 24 hours a day, 7 days a week. Real people with names, in your chat, not a ticket queue.',
  },
  {
    icon: 'code',
    title: 'The developers',
    text: 'Behind them sits Vavensoft, the software company that has delivered 210+ products. When the problem is in the code, the people who fix it are already on your team.',
  },
]

const tools = [
  {
    name: 'Client portal',
    who: 'Every client',
    what: 'Talk to your engineers, raise and track issues, share files and access securely, see monthly reports and your growth roadmap.',
    line: 'Your direct line to the team that owns your product.',
  },
  {
    name: 'VavenCloud dashboard',
    who: 'Clients who run on VavenCloud infrastructure',
    what: 'See and manage your servers, databases, load balancers, networks and backups.',
    line: 'Your infrastructure, visible and under control.',
  },
]

export function oneTeamSection(): Section {
  return {
    html: `
<section id="one-team" class="border-t border-neutral-200 bg-neutral-50 py-24 sm:py-32 dark:border-neutral-800 dark:bg-neutral-900/40">
  <div class="container-page">
    <div class="mx-auto max-w-3xl text-center">
      ${sectionHeading({
        eyebrow: 'The VavenCloud way',
        title: 'One team owns your production. Not just the server. All of it.',
        description:
          'VavenCloud brings together three things that usually come from three different companies: the infrastructure your product runs on, the DevOps engineers who keep it healthy, and the developers who can fix the code itself. Same team, same chat, same responsibility.',
      })}
    </div>

    <ol class="mt-14 grid gap-5 md:grid-cols-3" role="list">
      ${pillars
        .map(
          (p) => `
      <li class="group card flex flex-col p-7 transition-colors hover:border-neutral-400 dark:hover:border-neutral-600">
        <span class="icon-box transition-colors group-hover:border-brand-600 group-hover:text-brand-600 dark:group-hover:border-brand-400 dark:group-hover:text-brand-300">${icon(p.icon, 'h-5 w-5')}</span>
        <h3 class="mt-5 text-xl font-semibold tracking-tight text-neutral-950 dark:text-white">${p.title}</h3>
        <p class="mt-3 leading-relaxed">${p.text}</p>
      </li>`,
        )
        .join('')}
    </ol>

    <!-- The three layers flow into one promise (decorative, wide screens) -->
    <div class="one-team-merge relative hidden h-20 md:block" aria-hidden="true">
      <span class="one-team-drop" style="left:16.66%"></span>
      <span class="one-team-drop" style="left:50%"></span>
      <span class="one-team-drop" style="left:83.33%"></span>
      <span class="one-team-rail"></span>
      <span class="one-team-drop one-team-drop--center" style="left:50%"></span>
    </div>

    <p data-reveal class="mx-auto mt-10 max-w-4xl rounded-3xl bg-neutral-950 px-8 py-10 text-center text-2xl leading-snug font-semibold tracking-tight text-balance text-white sm:text-3xl md:mt-0 dark:bg-white dark:text-neutral-950">
      If your product is down, we treat it as our problem until it’s back, whatever the cause.
    </p>

    <div class="mt-24">
      <h3 class="text-center text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-white">Everything in one place, whichever cloud you’re on.</h3>
      <div class="mt-10 grid gap-5 md:grid-cols-2">
        ${tools
          .map(
            (t) => `
        <article class="card flex flex-col p-7">
          <p class="text-xs font-medium tracking-wide text-neutral-500 uppercase">For: ${t.who}</p>
          <h4 class="mt-2 text-xl font-semibold text-neutral-950 dark:text-white">${t.name}</h4>
          <p class="mt-3 leading-relaxed">${t.what}</p>
          <p class="mt-auto pt-6 font-medium text-neutral-950 dark:text-white">“${t.line}”</p>
        </article>`,
          )
          .join('')}
      </div>
    </div>
  </div>
</section>`,
  }
}
