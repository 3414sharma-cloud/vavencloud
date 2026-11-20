import type { IconName } from '@/components/ui/icons.ts'

/* ---------- What we own: every layer, one team ---------- */

export interface Layer {
  icon: IconName
  title: string
  text: string
  points: string[]
  forYou: string
  /** Shown big; `feature` is the dark one, our difference */
  size: 'wide' | 'third'
  feature?: boolean
}

export const layers: Layer[] = [
  {
    icon: 'server',
    title: 'Infrastructure',
    text: 'Servers, databases, networks and backups, on AWS, Azure, Google Cloud or ours.',
    points: [
      'Security patches and hardening',
      'Automated backups, tested restores',
      'Firewalls and private networking',
    ],
    forYou: 'the foundation is looked after, not just switched on.',
    size: 'wide',
  },
  {
    icon: 'clock',
    title: '24/7 operations',
    text: 'Engineers watching your product day and night, and responding when it matters.',
    points: [
      'Monitoring and alerting set up for you',
      'Incident response, any hour',
      'Plain-English report after every incident',
    ],
    forYou: 'you hear about problems from us, not from customers.',
    size: 'wide',
  },
  {
    icon: 'code',
    title: 'Fixes in your code',
    text: 'Vavensoft’s developers fix bugs and broken releases in your application, within your plan’s monthly hours.',
    points: [
      'Bugs and errors in existing features',
      'Slow pages and performance problems',
      'Bigger work quoted first, never billed without approval',
    ],
    forYou: 'no “that’s the developer’s problem.” It’s ours.',
    size: 'third',
    feature: true,
  },
  {
    icon: 'rocket',
    title: 'Deployments',
    text: 'CI/CD pipelines that release your code safely, every time.',
    points: ['Automated build, test and release', 'One-step rollback', 'Staging before production'],
    forYou: 'releases stop being a risk you dread.',
    size: 'third',
  },
  {
    icon: 'wallet',
    title: 'Cost and scaling',
    text: 'A regular look at your cloud bill and traffic, with a plan before you need it.',
    points: [
      'Right-sized servers, no idle capacity',
      'Load balancing and auto scaling',
      'Growth planned ahead of launches',
    ],
    forYou: 'a bill you understand, and growth that doesn’t break things.',
    size: 'third',
  },
]
