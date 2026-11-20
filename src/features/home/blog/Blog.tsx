import { useEffect, useState } from 'react'
import { site } from '@/app/site.config.ts'
import { Icon } from '@/components/ui/Icon.tsx'
import { SectionHeading } from '@/components/ui/SectionHeading.tsx'
import { fallbackPosts, fetchLatestPosts, savedPosts, savePosts, type Post } from './blog.data.ts'
import { container } from '@/components/ui/classes.ts'

/*
 * The three newest guides from the blog, as a numbered list under hairlines. They are always the blog's latest:
 * the section opens with the ones it last saw (or, the first time, the fallback in blog.data.ts), then asks the
 * blog for its newest three and swaps them in. If the blog can't be reached, what is showing stays. The blog is
 * its own site, so links open in a new tab. Titles and topics come from the blog: React escapes them.
 */

/* Topic colours, written out in full so Tailwind picks them up */
const tones = {
  brand: 'text-brand-700 dark:text-brand-300',
  sage: 'text-sage-700 dark:text-sage-300',
  clay: 'text-clay-700 dark:text-clay-300',
}

const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>

/** The cover repeats the title, so it is decorative (alt=""); the title link right under it covers the whole card */
const Cover = ({ src }: { src?: string }) =>
  src ? (
    <img
      src={src}
      alt=""
      width="600"
      height="315"
      loading="lazy"
      decoding="async"
      className="mb-5 aspect-[40/21] w-full rounded-2xl border border-neutral-200 object-cover [grid-column:1/-1] transition-transform duration-500 group-hover:-translate-y-1 dark:border-neutral-800"
    />
  ) : (
    <div
      className="mb-5 aspect-[40/21] w-full rounded-2xl border border-neutral-200 bg-neutral-100 [grid-column:1/-1] dark:border-neutral-800 dark:bg-neutral-900"
      aria-hidden="true"
    ></div>
  )

/** What identifies a list of posts, to tell whether the blog has anything newer than what's showing */
const signature = (posts: Post[]) => posts.map((p) => `${p.href}|${p.title}|${p.cover ?? ''}`).join('\n')

interface BlogProps {
  /** Each article's own cover image (from the blog) above it */
  covers?: boolean
  /** The heading, for a page that words it its own way */
  title?: string
}

export function Blog({ covers = false, title = 'Plain-English guides <em>from our engineers.</em>' }: BlogProps) {
  // On screen first: the latest the page saw on an earlier visit, or the fallback the first time
  const [posts, setPosts] = useState(() => savedPosts() ?? fallbackPosts)

  // Then ask the blog for its newest three; if it can't be reached, what is showing stays
  useEffect(() => {
    let current = true
    fetchLatestPosts()
      .then((latest) => {
        savePosts(latest)
        // Nothing to redraw if they're the same three the page is already showing
        if (current) setPosts((shown) => (signature(latest) === signature(shown) ? shown : latest))
      })
      .catch(() => {
        // The blog can't be reached: keep what's showing
      })
    return () => {
      current = false
    }
  }, [])

  return (
    <section id="blog" className="border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800">
      <div className={container}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          {/* The heading takes all the room beside "View all articles": "What we've learned" on one line, "on the 2am
              side of production." on the next (at the wide headings' size, so it fits), and the paragraph as wide */}
          <div className="min-w-0 max-w-none flex-1">
            <SectionHeading
              title={title}
              description="Short answers to the questions business owners ask us most."
              titleClassName="text-[length:clamp(2.25rem,4.6vw,4.3rem)]"
              leadClassName="max-w-none"
            />
          </div>
          <a
            href={site.blogUrl}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 self-start font-semibold text-neutral-950 underline decoration-neutral-950/25 underline-offset-[0.3rem] hover:text-brand-700 lg:self-auto dark:text-white dark:decoration-white/25 dark:hover:text-brand-300"
          >
            View all articles
            <NewTab /> <Icon name="arrow-right" className="h-4 w-4" />
          </a>
        </div>

        <ol className="mt-12 grid gap-x-8 md:grid-cols-3" data-blog-list="">
          {posts.map((p, i) => (
            <li key={p.href}>
              {/* The date and "Read the article" share its last row, at the foot of the card, so they line up along the row */}
              <article
                className={`group relative grid h-full grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_auto_auto_1fr] flex-col gap-x-4 ${covers ? 'pb-6' : 'border-t border-neutral-200 py-6 dark:border-neutral-800'}`}
              >
                {covers && <Cover src={p.cover} />}
                <p className="flex items-center gap-3 text-xs font-bold tracking-[0.1em] uppercase [grid-column:1/-1]">
                  <span className="font-mono font-medium text-neutral-500" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={tones[p.tone]}>{p.topic}</span>
                </p>
                <h3 className="mt-4 text-xl leading-snug font-semibold tracking-tight text-neutral-950 [grid-column:1/-1] dark:text-white">
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener"
                    className="decoration-brand-500/40 underline-offset-4 group-hover:underline after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
                  >
                    {p.title}
                    <NewTab />
                  </a>
                </h3>
                <p className="[align-self:end] pt-[1.1rem] text-sm text-neutral-500 [grid-column:1] [grid-row:4]">
                  <time>{p.date}</time>
                </p>
                <p
                  className="[align-self:end] pt-[1.1rem] text-sm font-semibold text-brand-700 [grid-column:2] [grid-row:4] dark:text-brand-300"
                  aria-hidden="true"
                >
                  Read the article →
                </p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
