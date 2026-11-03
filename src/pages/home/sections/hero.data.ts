import { routes } from '@/app/routes.ts'

interface Link {
  label: string
  href: string
  external?: boolean
}

const book: Link = { label: 'Book a free production review', href: routes.book }

/* ---------- The slides: 1. 24/7 DevOps support, 2. managed cloud, 3. cloud servers ---------- */

export interface HeroSlide {
  /** Its name in the numbered index under the slides */
  tab: string
  /** Small caps above the title, the parts split by a short rule */
  eyebrow: string[]
  /** Two lines: the first dark, the second muted */
  title: [string, string]
  description: string
  primary: Link
  secondary: Link
  reassurance: string
}

/** Copy follows docs/messaging.md. The first slide's title is the page's h1. */
export const heroSlides: HeroSlide[] = [
  {
    tab: '24/7 DevOps support',
    eyebrow: ['Managed DevOps and 24/7 server support', 'by Vavensoft'],
    title: ['When something breaks, you make one call.', 'We fix the rest.'],
    description: 'One team runs your servers, deployments and code, on call 24/7. No more chasing your host, freelancer and developers.',
    primary: book,
    secondary: { label: 'See how it works', href: routes.process },
    reassurance: '45 minutes with a senior engineer, not a salesperson. You keep the written growth roadmap, whether or not you work with us.',
  },
  {
    tab: 'Managed cloud',
    eyebrow: ['Managed AWS, Azure and Google Cloud'],
    title: ['On AWS, Azure or Google Cloud?', 'We run it right where it is.'],
    description: 'Keep the account you have. Our engineers take it over and watch it day and night. Nothing to move.',
    primary: book,
    secondary: { label: 'See the plans', href: routes.plans },
    reassurance: 'Same team · same chat · same 24/7 cover',
  },
  {
    // Facts from vavencloud.com/cloud-services (October 2026): keep them in step with the site
    tab: 'Cloud servers',
    eyebrow: ['VavenCloud servers', 'US and EU data centres'],
    title: ['Fast private cloud servers,', 'run by the same team.'],
    description: 'Private VMs in New York, St. Louis and Strasbourg, looked after by the engineers who run your app.',
    primary: book,
    secondary: { label: 'Explore our cloud', href: 'https://vavencloud.com/cloud-services', external: true },
    reassurance: 'From $12 a month · live in 60 seconds · 99.9% uptime guarantee',
  },
]
