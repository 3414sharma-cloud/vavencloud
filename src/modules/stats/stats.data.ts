import type { Look } from '@/shared/ui/portrait.ts'

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

/**
 * "Meet your engineers". SAMPLE CONTENT: the names, specialities and lines are made up for layout.
 * Replace them with the real team before launch. `photo`: real portrait path (put the file in /public),
 * used instead of the illustrated `look` when set.
 */
export interface Engineer {
  name: string
  speciality: string
  line: string
  look: Look
  photo?: string
}

export const engineers: Engineer[] = [
  {
    name: 'Arjun',
    speciality: 'Kubernetes and AWS',
    line: 'Has rescued more than 40 production outages.',
    look: { bg: ['var(--color-brand-100)', 'var(--color-brand-300)'], skin: '#b9774f', hair: '#17120f', style: 'short', shirt: 'var(--color-brand-800)', glasses: true },
  },
  {
    name: 'Lena',
    speciality: 'Databases and performance',
    line: 'Once turned a nine second query into a 40 millisecond one.',
    look: { bg: ['#f6ead2', '#e9cf9c'], skin: '#f3d2b3', hair: '#b4532a', style: 'bun', shirt: '#325b3b' },
  },
  {
    name: 'Marcus',
    speciality: 'Security and backups',
    line: 'Restore-tests every client backup, every month.',
    look: { bg: ['#def2e1', '#a1cea9'], skin: '#8d5a3b', hair: '#17120f', style: 'short', shirt: '#2b2923', beard: true },
  },
  {
    name: 'Nadia',
    speciality: 'Deployments and monitoring',
    line: 'Knows your alerts by name, and answers them herself.',
    look: { bg: ['#ffe6db', '#f6b294'], skin: '#e0ac86', hair: '#1c1311', style: 'long', shirt: 'var(--color-brand-700)' },
  },
]