import type { IconName } from '@/shared/ui/icons.ts'

export interface Feature {
  icon: IconName
  title: string
  description: string
}

/** "The platform" tiles (VavenCloud-Sample-Content.md). */
export const features: Feature[] = [
  { icon: 'layers', title: 'High-availability load balancers', description: 'Automatic failover, so one failing node never takes you offline.' },
  { icon: 'activity', title: 'Auto scaling', description: 'More servers when traffic spikes, fewer when it’s quiet. You pay for what you use.' },
  { icon: 'server', title: 'Managed databases', description: 'MySQL and PostgreSQL, private to your network, backed up on schedule.' },
  { icon: 'lock', title: 'Private networking', description: 'Your own isolated network. Nothing is exposed unless you choose.' },
  { icon: 'shield', title: 'Hypervisor firewalls', description: 'Security rules enforced outside your servers, so a misconfigured server can’t switch them off.' },
  { icon: 'cloud', title: 'Backups and snapshots', description: 'Daily or weekly, kept separately from your servers, with retention you choose.' },
]

/** TODO: confirm the data centre cities before launch. */
export const regions = [
  { name: 'United States', city: '[US city]' },
  { name: 'Europe', city: '[EU city]' },
]
