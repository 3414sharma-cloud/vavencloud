export type StatId = 'live' | 'uptime' | 'oncall' | 'regions' | 'businesses' | 'launches' | 'response' | 'rating'

export interface Stat {
  /** Number the counter animates to */
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  label: string
  note: string
}

/* Placeholder figures: replace with your verified numbers before going live. */
export const stats: Record<StatId, Stat> = {
  live: { value: 12000, suffix: '+', label: 'Sites and apps kept live', note: 'Built by teams, freelancers, agencies and AI tools. All of them run here.' },
  uptime: { value: 99.99, decimals: 2, suffix: '%', label: 'Uptime SLA', note: 'Backed by service credits. We watch your product day and night.' },
  oncall: { value: 24, suffix: '/7', label: 'Engineers on call', note: 'A real person picks up, every day of the year.' },
  regions: { value: 15, suffix: '+', label: 'Data center locations', note: 'Host your product close to the people who use it.' },
  businesses: { value: 2000, suffix: '+', label: 'Businesses served', note: '' },
  launches: { value: 350, suffix: '+', label: 'Launches supported', note: '' },
  response: { value: 15, prefix: '< ', suffix: ' min', label: 'Avg. first response', note: '' },
  rating: { value: 4.9, decimals: 1, suffix: '/5', label: 'Customer rating', note: '' },
}

export interface Story {
  id: StatId
  /** Short line above the big number */
  kicker: string
}

/** The scroll story: one big number per step, in this order. */
export const stories: Story[] = [
  { id: 'live', kicker: 'Whoever built it' },
  { id: 'uptime', kicker: 'We keep it running' },
  { id: 'oncall', kicker: "We're on call" },
  { id: 'regions', kicker: 'Close to your users' },
]

/** Supporting figures in the row under the story. */
export const secondary: StatId[] = ['businesses', 'launches', 'response', 'rating']

/** Technologies shown in the scrolling strip at the bottom. */
export const technologies = [
  'Linux',
  'Docker',
  'Kubernetes',
  'cPanel',
  'WordPress',
  'Nginx',
  'Cloudflare',
  'PostgreSQL',
  'MySQL',
  'Redis',
  'Node.js',
  'React',
  'Laravel',
  'Python',
  'Terraform',
  'GitHub Actions',
]
