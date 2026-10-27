import { routes } from '@/app/routes.ts'
import type { IconName } from '@/shared/ui/icons.ts'

/** Hero copy from VavenCloud-Sample-Content.md → "Navigation and hero". */
export const hero = {
  eyebrow: 'VavenCloud, by Vavensoft · Production ownership for founders',
  /**
   * The headline is split so it can act out its own meaning (see initHeadline):
   * "breaks" cracks apart, "one call" lights up and rings, then it all snaps back and "We fix the rest." is underlined.
   */
  headline: { before: 'When something', broken: 'breaks,', between: 'you make', call: 'one call', after: '.', highlight: 'We fix the rest.' },
  description:
    'We run your product end to end: the servers, the deployments and the code. One team, one point of contact, on call 24/7. Stop chasing your host, your DevOps freelancer and your developers, and get back to building the business.',
  primary: { label: 'Book a free production review', href: routes.book },
  secondary: { label: 'See how it works', href: routes.process },
  reassurance: '45 minutes with a senior engineer, not a salesperson. You keep the written growth roadmap, whether or not you work with us.',
}

/* TODO: confirm before launch (see "Numbers and facts to confirm" in the content doc). */
export const trustStrip = [
  { value: '210+', label: 'products delivered by Vavensoft' },
  { value: '12+ years', label: 'running production systems' },
  { value: '100%', label: 'Job Success on Upwork' },
  { value: '24/7', label: 'engineers on call' },
]

/**
 * The hero's "try it" demo: an example outage, played out. It illustrates how the service works, so it
 * uses roles ("On-call engineer") and an example domain, never invented customers or quotes.
 */
export interface OutageEvent {
  clock: string
  /** Minutes since the alert (drives the "since alert" counter) */
  minute: number
  who: string
  text: string
  tone: 'alert' | 'work' | 'done'
  /** Checkout response time shown in the app while this event is current */
  latency: number
  /** 1 = incident spike on the chart, 0 = back to normal */
  heat: number
}

export const outage = {
  url: 'yourapp.example',
  clock: '02:14',
  baseLatency: 182,
  /** Minutes from alert to verified fix (the last event) */
  fixedIn: 27,
  /** The three vendors from "The problem" section, each saying why it isn't theirs */
  vendors: [
    { who: 'Your host', says: '"The server is fine."', icon: 'server' as IconName },
    { who: 'Your DevOps freelancer', says: '"I only set up the pipeline."', icon: 'infinity' as IconName },
    { who: 'Your developers', says: '"It works on our machines."', icon: 'code' as IconName },
  ],
  events: [
    { clock: '02:14', minute: 0, who: 'Monitoring', text: 'Checkout response time above 4 s. On-call engineer paged.', tone: 'alert', latency: 4210, heat: 1 },
    { clock: '02:19', minute: 5, who: 'On-call engineer', text: "I'm on it. Looking at the database and the last deploy.", tone: 'work', latency: 4210, heat: 1 },
    { clock: '02:31', minute: 17, who: 'On-call engineer', text: 'Cause found: a missing database index on the orders table.', tone: 'work', latency: 1900, heat: 0.55 },
    { clock: '02:41', minute: 27, who: 'On-call engineer', text: 'Fixed and verified. Checkout is back to normal speed.', tone: 'done', latency: 182, heat: 0 },
  ] satisfies OutageEvent[],
}
