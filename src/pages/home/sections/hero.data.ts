import { routes } from '@/app/routes.ts'
import type { IconName } from '@/shared/ui/icons.ts'

/** Hero copy follows docs/messaging.md. */
export const hero = {
  eyebrow: 'VavenCloud, by Vavensoft',
  kicker: 'Production ownership for founders',
  headline: { before: 'When something', broken: 'breaks,', between: 'you make', call: 'one call', after: '.', highlight: 'We fix the rest.' },
  description:
    'We own the servers, deployments and code behind your live product. One team, one point of contact, on call 24/7.',
  primary: { label: 'Book a free production review', href: routes.book },
  secondary: { label: 'See what we review', href: routes.book },
  reassurance: '45 minutes with a senior engineer. You keep the written roadmap, whether or not you work with us.',
}

/** A clearly-labelled example incident. It does not represent live customer data. */
export interface OutageEvent {
  clock: string
  minute: number
  who: string
  text: string
  tone: 'alert' | 'work' | 'done'
  latency: number
  heat: number
}

export const outage = {
  url: 'yourapp.example',
  clock: '02:14',
  baseLatency: 182,
  fixedIn: 27,
  vendors: [
    { who: 'Your host', says: 'Server healthy', icon: 'server' as IconName },
    { who: 'Your freelancer', says: 'Pipeline only', icon: 'infinity' as IconName },
    { who: 'Your developers', says: 'Code only', icon: 'code' as IconName },
  ],
  events: [
    { clock: '02:14', minute: 0, who: 'Monitoring', text: 'Checkout response time above 4 s. On-call engineer paged.', tone: 'alert', latency: 4210, heat: 1 },
    { clock: '02:19', minute: 5, who: 'On-call engineer', text: 'Looking at the database and the last deployment.', tone: 'work', latency: 4210, heat: 1 },
    { clock: '02:31', minute: 17, who: 'On-call engineer', text: 'Missing database index identified and corrected.', tone: 'work', latency: 1900, heat: 0.55 },
    { clock: '02:41', minute: 27, who: 'On-call engineer', text: 'Checkout fixed and response time verified.', tone: 'done', latency: 182, heat: 0 },
  ] satisfies OutageEvent[],
}
