import type { Section } from '@/app/types.ts'
import { site } from '@/app/site.config.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { posts } from './blog.data.ts'

/**
 * Three recent guides from the blog, as a numbered list under hairlines. The blog is its own site, so links
 * open in a new tab. `covers` shows each article's own cover image (from the blog) above it.
 */

/* Topic colours, written out in full so Tailwind picks them up */
const tones = {
  brand: 'text-brand-700 dark:text-brand-300',
  sage: 'text-sage-700 dark:text-sage-300',
  clay: 'text-clay-700 dark:text-clay-300',
}

const newTab = '<span class="sr-only"> (opens in a new tab)</span>'

/** The cover repeats the title, so it is decorative (alt=""); the title link right under it covers the whole card */
const cover = (src: string) =>
  `<img src="${src}" alt="" width="600" height="315" loading="lazy" decoding="async" class="mb-5 aspect-[40/21] w-full rounded-2xl border border-neutral-200 object-cover transition-transform duration-500 group-hover:-translate-y-1 dark:border-neutral-800" />`

export function blogSection({ covers = false }: { covers?: boolean } = {}): Section {
  return {
    html: `
<section id="blog" class="border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800">
  <div class="container-page">
    <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div class="max-w-2xl">
        ${sectionHeading({
          title: 'Plain-English guides from our engineers.',
          description: 'Short answers to the questions business owners ask us most.',
        })}
      </div>
      <a href="${site.blogUrl}" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 self-start font-semibold text-neutral-950 underline decoration-neutral-950/25 underline-offset-[0.3rem] hover:text-brand-700 lg:self-auto dark:text-white dark:decoration-white/25 dark:hover:text-brand-300">View all articles${newTab} ${icon('arrow-right', 'h-4 w-4')}</a>
    </div>

    <ol class="mt-12 grid gap-x-8 md:grid-cols-3">
      ${posts
        .map(
          (p, i) => `
      <li>
        <article class="group relative flex h-full flex-col ${covers ? 'pb-6' : 'border-t border-neutral-200 py-6 dark:border-neutral-800'}">${covers ? cover(p.cover) : ''}
          <p class="flex items-center gap-3 text-xs font-bold tracking-[0.1em] uppercase"><span class="font-mono font-medium text-neutral-500" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="${tones[p.tone]}">${p.topic}</span></p>
          <h3 class="mt-4 text-xl leading-snug font-semibold tracking-tight text-neutral-950 dark:text-white"><a href="${p.href}" target="_blank" rel="noopener" class="decoration-brand-500/40 underline-offset-4 group-hover:underline after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600">${p.title}${newTab}</a></h3>
          <p class="mt-3 text-sm text-neutral-500"><time>${p.date}</time></p>
          <p class="mt-auto pt-5 text-sm font-semibold text-brand-700 dark:text-brand-300" aria-hidden="true">Read the article →</p>
        </article>
      </li>`,
        )
        .join('')}
    </ol>
  </div>
</section>`,
  }
}
