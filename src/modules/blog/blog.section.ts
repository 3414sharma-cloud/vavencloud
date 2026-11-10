import type { Section } from '@/app/types.ts'
import { site } from '@/app/site.config.ts'
import { qs } from '@/shared/lib/dom.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { fallbackPosts, fetchLatestPosts, savePosts, savedPosts, type Post } from './blog.data.ts'

/**
 * The three newest guides from the blog, as a numbered list under hairlines. They are always the blog's latest:
 * the page loads with the ones it last saw (or, the first time, the fallback in blog.data.ts), then asks the
 * blog for its newest three and swaps them in. If the blog can't be reached, what is showing stays. The blog is
 * its own site, so links open in a new tab. `covers` shows each article's own cover image (from the blog) above
 * it; `title` words the heading for a page that has its own.
 */

/* Topic colours, written out in full so Tailwind picks them up */
const tones = {
  brand: 'text-brand-700 dark:text-brand-300',
  sage: 'text-sage-700 dark:text-sage-300',
  clay: 'text-clay-700 dark:text-clay-300',
}

const newTab = '<span class="sr-only"> (opens in a new tab)</span>'

/** Titles and topics come from the blog: written out as text, never as markup */
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

/** The cover repeats the title, so it is decorative (alt=""); the title link right under it covers the whole card */
const cover = (src?: string) =>
  src
    ? `<img src="${esc(src)}" alt="" width="600" height="315" loading="lazy" decoding="async" class="mb-5 aspect-[40/21] w-full rounded-2xl border border-neutral-200 object-cover transition-transform duration-500 group-hover:-translate-y-1 dark:border-neutral-800" />`
    : `<div class="mb-5 aspect-[40/21] w-full rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900" aria-hidden="true"></div>`

const postItems = (posts: Post[], covers: boolean) =>
  posts
    .map(
      (p, i) => `
      <li>
        <article class="group relative flex h-full flex-col ${covers ? 'pb-6' : 'border-t border-neutral-200 py-6 dark:border-neutral-800'}">${covers ? cover(p.cover) : ''}
          <p class="flex items-center gap-3 text-xs font-bold tracking-[0.1em] uppercase"><span class="font-mono font-medium text-neutral-500" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="${tones[p.tone]}">${esc(p.topic)}</span></p>
          <h3 class="mt-4 text-xl leading-snug font-semibold tracking-tight text-neutral-950 dark:text-white"><a href="${esc(p.href)}" target="_blank" rel="noopener" class="decoration-brand-500/40 underline-offset-4 group-hover:underline after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600">${esc(p.title)}${newTab}</a></h3>
          <p class="mt-3 text-sm text-neutral-500"><time>${esc(p.date)}</time></p>
          <p class="mt-auto pt-5 text-sm font-semibold text-brand-700 dark:text-brand-300" aria-hidden="true">Read the article →</p>
        </article>
      </li>`,
    )
    .join('')

/** What identifies a list of posts, to tell whether the blog has anything newer than what's showing */
const signature = (posts: Post[]) => posts.map((p) => `${p.href}|${p.title}|${p.cover ?? ''}`).join('\n')

export function blogSection({
  covers = false,
  title = 'Plain-English guides <em>from our engineers.</em>',
}: { covers?: boolean; title?: string } = {}): Section {
  /** On screen first: the latest the page saw on an earlier visit, or the fallback the first time */
  const shown = savedPosts() ?? fallbackPosts
  return {
    html: `
<section id="blog" class="border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800">
  <div class="container-page">
    <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div class="max-w-4xl">
        ${sectionHeading({
          title,
          description: 'Short answers to the questions business owners ask us most.',
        })}
      </div>
      <a href="${site.blogUrl}" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 self-start font-semibold text-neutral-950 underline decoration-neutral-950/25 underline-offset-[0.3rem] hover:text-brand-700 lg:self-auto dark:text-white dark:decoration-white/25 dark:hover:text-brand-300">View all articles${newTab} ${icon('arrow-right', 'h-4 w-4')}</a>
    </div>

    <ol class="mt-12 grid gap-x-8 md:grid-cols-3" data-blog-list>${postItems(shown, covers)}
    </ol>
  </div>
</section>`,
    init() {
      const list = qs('[data-blog-list]')
      fetchLatestPosts()
        .then((latest) => {
          savePosts(latest)
          // Nothing to redraw if they're the same three the page is already showing
          if (signature(latest) !== signature(shown)) list.innerHTML = postItems(latest, covers)
        })
        .catch(() => {
          // The blog can't be reached: keep what's showing
        })
    },
  }
}
