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
    tone: 'bg-sky-50 text-sky-600 ring-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-900',
  },
  {
    icon: 'activity',
    title: 'Auto scaling',
    description: 'More servers when traffic spikes, fewer when it’s quiet. You pay for what you use.',
    tone: 'bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-900',
  },
  {
    icon: 'server',
    title: 'Managed databases',
    description: 'MySQL and PostgreSQL, private to your network, backed up on schedule.',
    tone: 'bg-violet-50 text-violet-600 ring-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:ring-violet-900',
  },
  {
    icon: 'lock',
    title: 'Private networking',
    description: 'Your own isolated network. Nothing is exposed unless you choose.',
    tone: 'bg-amber-50 text-amber-600 ring-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-900',
  },
  {
    icon: 'shield',
    title: 'Hypervisor firewalls',
    description: 'Security rules enforced outside your servers, so a misconfigured server can’t switch them off.',
    tone: 'bg-rose-50 text-rose-600 ring-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-900',
  },
  {
    icon: 'cloud',
    title: 'Backups and snapshots',
    description: 'Daily or weekly, kept separately from your servers, with retention you choose.',
    tone: 'bg-indigo-50 text-indigo-600 ring-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:ring-indigo-900',
  },
]

/** TODO: confirm the data centre cities before launch. */
export const regions = [
  { name: 'United States', city: '[US city]' },
  { name: 'Europe', city: '[EU city]' },
]
