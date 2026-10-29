import type { Section } from '@/app/types.ts'
import { personImage } from '@/shared/ui/portrait.ts'
import { engineers, type Engineer } from '@/modules/stats/stats.data.ts'

const engineerCard = (engineer: Engineer) => `
  <li class="card group p-6">
    <div class="pt-avatar pt-avatar--hover h-16 w-16"><span class="pt-ring" aria-hidden="true"></span><span class="pt-photo">${personImage({ look: engineer.look, photo: engineer.photo, name: engineer.name })}</span></div>
    <p class="mt-5 font-semibold text-neutral-950 dark:text-white">${engineer.name}</p>
    <p class="mt-0.5 text-sm text-neutral-500">${engineer.speciality}</p>
    <p class="mt-3 text-sm leading-relaxed">${engineer.line}</p>
  </li>`

/** Team profiles belong on About. The data stays visibly marked as sample content until approved. */
export function teamSection(): Section {
  return {
    html: `
<section id="team" class="border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800" aria-labelledby="team-title">
  <div class="container-page">
    <div class="max-w-3xl">
      <p class="text-xs font-semibold tracking-[0.14em] text-brand-700 uppercase dark:text-brand-300">The people behind the work</p>
      <h2 id="team-title" class="mt-4 text-4xl leading-[1.05] font-semibold tracking-tight text-neutral-950 sm:text-5xl dark:text-white">Meet your engineers.</h2>
      <p class="mt-5 text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-400">The people who investigate, fix and explain what happened when your product needs attention.</p>
    </div>
    <p class="mt-7 max-w-2xl rounded-2xl border border-dashed border-neutral-300 px-4 py-3 text-sm text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"><span class="font-medium text-neutral-950 dark:text-white">Sample team profiles.</span> Names, roles and outcomes are placeholders for layout. Replace them with approved team information before launch.</p>
    <ul class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" role="list">${engineers.map(engineerCard).join('')}</ul>
  </div>
</section>`,
  }
}
