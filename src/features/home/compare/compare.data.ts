/* ---------- Compare: three ways to run production ---------- */

/** One row of the table: what three vendors and one hire give you, then VavenCloud. `no` marks a gap with a cross. */
export interface Compare {
  label: string
  vendors: { text: string; no?: boolean }
  hire: { text: string; no?: boolean }
  vaven: string
}

export const compareColumns = ['Three separate vendors', 'Hire a DevOps engineer', 'VavenCloud']

export const compare: Compare[] = [
  {
    label: 'Who owns an outage',
    vendors: { text: 'Nobody. Each owns one layer.', no: true },
    hire: { text: 'One person, for infrastructure only' },
    vaven: 'One team, every layer',
  },
  {
    label: 'Cover at 2am',
    vendors: { text: 'Tickets and business hours', no: true },
    hire: { text: 'One person can’t be on call every night', no: true },
    vaven: 'On call 24/7',
  },
  {
    label: 'Fixes in your code',
    vendors: { text: 'Your developers, when they’re free' },
    hire: { text: 'Usually not their job', no: true },
    vaven: 'Included, within plan hours',
  },
  {
    label: 'How you pay',
    vendors: { text: 'Three bills, plus hourly extras' },
    hire: { text: 'A full salary, plus months of hiring' },
    vaven: 'From $100/month',
  },
  {
    label: 'If someone leaves',
    vendors: { text: 'The knowledge leaves with them', no: true },
    hire: { text: 'Your setup leaves with them', no: true },
    vaven: 'Everything documented and handed over',
  },
  {
    label: 'Time to get covered',
    vendors: { text: 'Already in place, gaps included' },
    hire: { text: 'Months to find and hire' },
    vaven: 'Handover in about 1–2 weeks',
  },
]

export const compareMeans =
  'you don’t need more vendors or another hire. You need one team that owns the whole problem, and one fee that covers it.'
