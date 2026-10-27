import type { Section } from '@/app/types.ts'

/**
 * "A note from the founder" (VavenCloud-Sample-Content.md).
 * TODO: add Jerry's photo (public/founder.jpg) and signature before launch.
 */
export function founderSection(): Section {
  return {
    html: `
<section id="founder" class="border-t border-neutral-200 bg-neutral-50 py-24 sm:py-32 dark:border-neutral-800 dark:bg-neutral-900/40" aria-labelledby="founder-title">
  <div class="container-page">
    <figure class="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[16rem_1fr] lg:gap-16">
      <div>
        <!-- Photo placeholder: replace with <img src="/founder.jpg" alt="Jerry Bopara"> -->
        <div class="flex aspect-[4/5] w-48 items-end rounded-3xl bg-neutral-200 p-4 text-xs text-neutral-500 lg:w-full dark:bg-neutral-800" aria-hidden="true">Photo of Jerry</div>
        <p id="founder-title" class="mt-6 text-sm font-medium text-neutral-500">A note from the founder</p>
      </div>
      <div>
        <blockquote class="space-y-6 text-xl leading-relaxed text-neutral-800 sm:text-2xl sm:leading-relaxed dark:text-neutral-200">
          <p>I spent twelve years as a DevOps and cloud engineer before co-founding Vavensoft. In that time I watched the same thing happen again and again: good products hurt by outages nobody owned. The host blamed the code, the developers blamed the server, and the founder lost the weekend.</p>
          <p>We built VavenCloud so that never happens to our clients. One team, every layer, and a person who picks up the phone. If you book a review, you’ll speak to someone who has run production systems for over a decade, not a salesperson. <span class="font-semibold text-neutral-950 dark:text-white">That’s a promise.</span></p>
        </blockquote>
        <figcaption class="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <p class="font-semibold text-neutral-950 dark:text-white">Jerry Bopara</p>
          <p class="text-sm text-neutral-500">Co-founder, Vavensoft and VavenCloud</p>
        </figcaption>
      </div>
    </figure>
  </div>
</section>`,
  }
}
