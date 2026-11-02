import { site } from '@/app/site.config.ts'

/**
 * Recent guides on the blog (October 2026). `tone` colours the topic: brand (petrol), sage or clay.
 * `cover`: the article's own cover image on the blog, at the blog's 600px size (600x315).
 */
export const posts: { topic: string; title: string; date: string; href: string; tone: 'brand' | 'sage' | 'clay'; cover: string }[] = [
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
