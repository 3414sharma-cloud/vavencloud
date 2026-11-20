import { routes } from '@/app/routes.ts'

/* ---------- The hero: one call fixes it, stay on your cloud, or run on ours ---------- */

export interface HeroLink {
  label: string
  href: string
  external?: boolean
}

/**
 * One slide. `titleEm`: how wide the title's longer half is on one line, in its own em, with a little to spare
 * (measured in the browser; measure again when the title changes): the title is sized so each half keeps to one
 * line, and the slide takes the hero's full width. `longText`: the paragraph runs in two even lines.
 */
export interface HeroSlide {
  /** Its name in the numbered index under the slides */
  tab: string
  eyebrow: string
  /** Two lines: the first dark, the second muted */
  title: [string, string]
  description: string
  primary: HeroLink
  secondary: HeroLink
  /** The small note under the buttons */
  reassurance?: string
  titleEm?: number
  longText?: boolean
}

const book: HeroLink = { label: 'Book a free production review', href: routes.book }

/** The first slide's title is the page's h1. */
export const heroSlides: HeroSlide[] = [
  {
    tab: 'One call fixes it',
    eyebrow: 'Production ownership for founders',
    reassurance: 'Free 30-minute review. Keep the written roadmap.',
    title: ['When something breaks, you make one call.', 'We fix the rest.'],
    description:
      'One team runs your servers, deployments and code, on call 24/7. No more chasing your host, freelancer and developers.',
    primary: book,
    secondary: { label: 'See how it works', href: `${routes.home}#problem` },
  },
  {
    tab: 'Stay on your cloud',
    eyebrow: 'Managed on your cloud',
    title: ['On AWS, Azure or Google Cloud?', 'We run it right where it is.'],
    titleEm: 14.9,
    description:
      'Keep your hosting platform. Zero migration. We secure, monitor and optimise your infrastructure 24/7, with right-sized resources, so everything stays secure and online, you stop paying for idle capacity, and it’s scalable when you’re ready to grow.',
    longText: true,
    primary: book,
    secondary: { label: 'See the plans', href: routes.plans },
    reassurance: 'Same team · same chat · same 24/7 cover',
  },
  {
    tab: 'Or run on ours',
    eyebrow: 'Managed VavenCloud infrastructure',
    title: ['Cloud servers with engineers attached,', 'so you’re never managing them alone.'],
    titleEm: 17.6,
    longText: true,
    description:
      'Private cloud with built-in security, backups and auto-scaling, managed around the clock by the team that runs your deployments and code.',
    primary: book,
    secondary: { label: 'Explore our cloud', href: 'https://vavencloud.com/cloud-services', external: true },
    reassurance: 'Same team · same chat · no lock-in',
  },
]

/** How long each slide stays before the next one, in ms. The first stays longer, so its title can play in. */
export const DURATIONS = [9000, 8000, 8000]

export const ownershipHighlights = ['One accountable team', '24/7 production cover', 'Fixes in your code']
