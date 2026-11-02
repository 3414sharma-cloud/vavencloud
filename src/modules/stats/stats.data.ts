import type { IconName } from '@/shared/ui/icons.ts'

/** The people who look after your product, by team. Roles only, no invented names (docs/messaging.md). */
export const accountTeam: { role: string; focus: string; icon: IconName }[] = [
  { role: 'DevOps engineers', focus: 'Deployments, monitoring and the 24/7 on-call rota', icon: 'activity' },
  { role: 'Cloud and database engineers', focus: 'Servers, PostgreSQL, MySQL and backups', icon: 'server' },
  { role: 'Security engineers', focus: 'Firewalls, patching and hardening', icon: 'shield' },
  { role: 'Vavensoft developers', focus: 'Fixes in your code, within your plan', icon: 'code' },
]

export type StatId = 'products' | 'years' | 'jobSuccess' | 'returning'

export interface Stat {
  /** Number the counter animates to */
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  label: string
  note: string
}

/* Vavensoft figures from the content doc. TODO: confirm every one before launch. */
export const stats: Record<StatId, Stat> = {
  products: { value: 210, suffix: '+', label: 'Products delivered by Vavensoft', note: 'Web apps, SaaS platforms and mobile apps, built and shipped.' },
  years: { value: 12, suffix: '+', label: 'Years running production systems', note: 'Long enough to have seen most of the ways things break.' },
  jobSuccess: { value: 100, suffix: '%', label: 'Job Success on Upwork', note: 'A Top Rated agency, rated by the clients who paid for the work.' },
  returning: { value: 99, suffix: '%', label: 'Of clients come back', note: 'Most of our work comes from people we have worked with before.' },
}

export interface Story {
  id: StatId
  /** Short line above the big number */
  kicker: string
}

/** The scroll story: one big number per step, in this order. */
export const stories: Story[] = [
  { id: 'products', kicker: 'Built by the team behind them' },
  { id: 'years', kicker: 'Running production for over a decade' },
  { id: 'jobSuccess', kicker: 'Top Rated on Upwork' },
  { id: 'returning', kicker: 'People come back' },
]