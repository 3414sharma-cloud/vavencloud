import type { IconName } from '@/shared/ui/icons.ts'

export interface Feature {
  icon: IconName
  title: string
  description: string
  /** Icon tile colours (light + dark). Written out in full so Tailwind picks them up. Neutral if left out. */
  tone?: string
}

/** "The platform" tiles (VavenCloud-Sample-Content.md). */
export const features: Feature[] = [
  {
    icon: 'layers',
    title: 'High-availability load balancers',
    description: 'Automatic failover, so one failing node never takes you offline.',
    tone: 'bg-brand-50 text-brand-600 ring-brand-200 dark:bg-brand-950/60 dark:text-brand-300 dark:ring-brand-900',
  },
  {
    icon: 'activity',
    title: 'Auto scaling',
    description: 'More servers when traffic spikes, fewer when it’s quiet. You pay for what you use.',
    tone: 'bg-sage-50 text-sage-600 ring-sage-200 dark:bg-sage-950/60 dark:text-sage-300 dark:ring-sage-900',
  },
  {
    icon: 'server',
    title: 'Managed databases',
    description: 'MySQL and PostgreSQL, private to your network, backed up on schedule.',
    tone: 'bg-clay-50 text-clay-600 ring-clay-200 dark:bg-clay-950/60 dark:text-clay-300 dark:ring-clay-900',
  },
  {
    icon: 'lock',
    title: 'Private networking',
    description: 'Your own isolated network. Nothing is exposed unless you choose.',
    tone: 'bg-brand-50 text-brand-600 ring-brand-200 dark:bg-brand-950/60 dark:text-brand-300 dark:ring-brand-900',
  },
  {
    icon: 'shield',
    title: 'Hypervisor firewalls',
    description: 'Security rules enforced outside your servers, so a misconfigured server can’t switch them off.',
    tone: 'bg-sage-50 text-sage-600 ring-sage-200 dark:bg-sage-950/60 dark:text-sage-300 dark:ring-sage-900',
  },
  {
    icon: 'cloud',
    title: 'Backups and snapshots',
    description: 'Daily or weekly, kept separately from your servers, with retention you choose.',
    tone: 'bg-clay-50 text-clay-600 ring-clay-200 dark:bg-clay-950/60 dark:text-clay-300 dark:ring-clay-900',
  },
]

/** TODO: confirm the data centre cities before launch. */
export const regions = [
  { name: 'United States', city: '[US city]' },
  { name: 'Europe', city: '[EU city]' },
]
