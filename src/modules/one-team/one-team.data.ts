import type { IconName } from '@/shared/ui/icons.ts'

/* "The answer: one team, every layer" (VavenCloud-Sample-Content.md): who owns which layer of a product. */

export type LayerId = 'code' | 'delivery' | 'infra'

/** The three layers of a product, top to bottom. `short` is the name on the fee chips. */
export const layers: { id: LayerId; name: string; short: string; covers: string; by: string; icon: IconName }[] = [
  {
    id: 'code',
    name: 'Your code',
    short: 'Your code',
    covers: 'Bug fixes, dependency upgrades, performance tuning',
    by: 'Vavensoft developers',
    icon: 'code',
  },
  {
    id: 'delivery',
    name: 'Deployments and on-call',
    short: 'Deployments',
    covers: 'Pipelines, releases, monitoring, incidents at any hour',
    by: 'Senior DevOps engineers',
    icon: 'activity',
  },
  {
    id: 'infra',
    name: 'Infrastructure',
    short: 'Infrastructure',
    covers: 'Servers, databases, backups, networks',
    by: 'VavenCloud, or your AWS, Azure or Google Cloud',
    icon: 'server',
  },
]

export interface Cover {
  state: 'yes' | 'partly' | 'no'
  note: string
}

export interface Provider {
  id: string
  name: string
  layers: Record<LayerId, Cover>
  onCall: string
  pay: string
}

const yes = (note = 'Covered'): Cover => ({ state: 'yes', note })
const partly = (note: string): Cover => ({ state: 'partly', note })
const no: Cover = { state: 'no', note: 'Not covered' }

/** By kind of provider. No competitor is named on purpose. VavenCloud is last: the walkthrough ends on it. */
export const providers: Provider[] = [
  {
    id: 'host',
    name: 'Cloud host',
    layers: { code: no, delivery: no, infra: yes() },
    onCall: 'Server only',
    pay: 'Per server',
  },
  {
    id: 'agency',
    name: 'DevOps agency',
    layers: { code: partly('Rarely'), delivery: yes(), infra: no },
    onCall: 'If you pay extra',
    pay: 'Per hour or retainer',
  },
  {
    id: 'support',
    name: 'Outsourced IT support',
    layers: { code: partly('Separate contract'), delivery: partly('Sometimes'), infra: no },
    onCall: 'Yes, by the hour',
    pay: 'Per hour',
  },
  {
    id: 'vaven',
    name: 'VavenCloud',
    layers: { code: yes('Within your plan'), delivery: yes(), infra: yes() },
    onCall: 'Yes, 24/7',
    pay: 'One fixed monthly fee',
  },
]

/**
 * One hire against a whole team. `hireCovers`: the layers one DevOps engineer can look after.
 * TODO: confirm the salary figure before launch (see "Numbers and facts to confirm" in the content doc).
 */
export const fee = {
  hire: 140000,
  hireText: 'a year to hire one senior DevOps engineer in the US',
  hireCovers: ['infra', 'delivery'] as LayerId[],
  teamText: 'engineers, infrastructure and fixes in your code',
  note: 'And they still can’t fix your code at 3am on their own.',
  punch: 'VavenCloud gives you a whole team for a fixed monthly fee.',
}

/** Where the work happens, whichever cloud the product runs on */
export const workspace: { name: string; who: string; what: string; icon: IconName }[] = [
  {
    name: 'Client portal',
    who: 'Every client',
    what: 'Talk to your engineers, raise and track issues, share files and access securely, see monthly reports and your growth roadmap.',
    icon: 'users',
  },
  {
    name: 'VavenCloud dashboard',
    who: 'Clients on VavenCloud infrastructure',
    what: 'See and manage your servers, databases, load balancers, networks and backups.',
    icon: 'monitor',
  },
]
