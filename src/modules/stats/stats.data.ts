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
 * Founding client stories. Empty until real pilot clients go live: never invent a quote.
 * Shape: { quote, name, role, company, country, result }
 */
export const clientStories: { quote: string; name: string; role: string; company: string; country: string; result: string }[] = []

/** "Meet your engineers". TODO: add real photos, first names, specialities and real numbers. */
export const engineers = [
  { name: '[First name]', speciality: '[Speciality, e.g. Kubernetes and AWS]', line: '[One true, human line, e.g. “Has rescued 40+ production outages”]' },
  { name: '[First name]', speciality: '[Speciality]', line: '[One true, human line]' },
  { name: '[First name]', speciality: '[Speciality]', line: '[One true, human line]' },
  { name: '[First name]', speciality: '[Speciality]', line: '[One true, human line]' },
]
