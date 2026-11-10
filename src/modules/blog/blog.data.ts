import { site } from '@/app/site.config.ts'

/** One article card: its topic (coloured by `tone`: brand, sage or clay), title, date, link and cover image */
export interface Post {
  topic: string
  title: string
  date: string
  href: string
  tone: 'brand' | 'sage' | 'clay'
  /** The article's cover image, at the blog's 600px size (600x315). Left out when the post has none */
  cover?: string
}

/** How many articles the section shows */
export const POST_COUNT = 3

const tones: Post['tone'][] = ['brand', 'sage', 'clay']

/**
 * Only used if the blog can't be reached (and nothing was saved from an earlier visit): the guides the page
 * was last written with (October 2026). The section normally shows the blog's latest, see fetchLatestPosts.
 */
export const fallbackPosts: Post[] = [
  {
    topic: 'Cloud infrastructure',
    title: 'Why Websites Crash During Traffic Spikes (and How a Load Balancer Fixes It)',
    date: '16 Oct 2026',
    href: `${site.blogUrl}website-crashes-during-traffic-spike/`,
    tone: 'brand',
    cover: `${site.blogUrl}content/images/size/w600/2026/10/feat-traffic-spike-1.png`,
  },
  {
    topic: 'Cloud infrastructure',
    title: 'Snapshot vs Backup: Which One Do You Need?',
    date: '21 Oct 2026',
    href: `${site.blogUrl}snapshot-vs-backup-which-do-you-need/`,
    tone: 'sage',
    cover: `${site.blogUrl}content/images/size/w600/2026/10/feat-snapshot-vs-backup.png`,
  },
  {
    topic: 'DevOps and server support',
    title: 'Not Just Servers: How VavenCloud Actually Helps When Things Go Wrong',
    date: '15 Oct 2026',
    href: `${site.blogUrl}not-just-servers-vavencloud-support/`,
    tone: 'clay',
    cover: `${site.blogUrl}content/images/size/w600/2026/10/hero-qp_LBpDh-1.png`,
  },
]

/* ---------- The latest posts, from the blog ---------- */

interface GhostPost {
  title?: string
  url?: string
  published_at?: string
  feature_image?: string | null
  tags?: { name: string; visibility?: string }[]
}

/** Ghost serves its images resized: /content/images/2026/11/a.png → /content/images/size/w600/2026/11/a.png */
const resized = (src: string) =>
  src.includes('/content/images/size/') ? src : src.replace('/content/images/', '/content/images/size/w600/')

/** Only links and images on the blog itself are used, whatever the API sends */
const onBlog = (url: string) => url.startsWith(site.blogUrl)

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

/**
 * The newest articles, straight from the blog's Ghost Content API (newest first), so the section is always up
 * to date without touching this site. Rejects if the blog can't be reached or answers badly; the caller then
 * keeps whatever it is already showing.
 */
export async function fetchLatestPosts(count = POST_COUNT): Promise<Post[]> {
  if (!site.blogApiKey) throw new Error('No blog API key')
  const url = new URL('ghost/api/content/posts/', site.blogUrl)
  url.search = new URLSearchParams({
    key: site.blogApiKey,
    limit: String(count),
    order: 'published_at desc',
    include: 'tags',
    fields: 'title,url,published_at,feature_image',
  }).toString()

  const abort = new AbortController()
  const timer = window.setTimeout(() => abort.abort(), 8000)
  try {
    const res = await fetch(url, { signal: abort.signal })
    if (!res.ok) throw new Error(`Blog answered ${res.status}`)
    const { posts } = (await res.json()) as { posts?: GhostPost[] }
    const latest = (posts ?? [])
      .filter((p): p is Required<Pick<GhostPost, 'title' | 'url' | 'published_at'>> & GhostPost =>
        Boolean(p.title && p.url && p.published_at && onBlog(p.url)),
      )
      .map<Post>((p, i) => ({
        topic: p.tags?.find((t) => t.visibility === 'public' || t.visibility === undefined)?.name ?? 'From the blog',
        title: p.title,
        date: formatDate(p.published_at),
        href: p.url,
        tone: tones[i % tones.length],
        cover: p.feature_image && onBlog(p.feature_image) ? resized(p.feature_image) : undefined,
      }))
    if (!latest.length) throw new Error('No posts')
    return latest
  } finally {
    window.clearTimeout(timer)
  }
}

/* ---------- Remembered between visits, so a returning visitor sees the latest at once ---------- */

const CACHE_KEY = 'vc-blog-latest'

export function savedPosts(): Post[] | undefined {
  try {
    const saved = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null') as Post[] | null
    return Array.isArray(saved) && saved.length && saved.every((p) => p.title && p.href && onBlog(p.href))
      ? saved.slice(0, POST_COUNT)
      : undefined
  } catch {
    return undefined
  }
}

export function savePosts(posts: Post[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(posts))
  } catch {
    // Storage blocked or full: the section works the same, it just fetches each visit
  }
}
