import type { IconName } from '@/components/ui/icons.ts'

/* ---------- After every fix: the report the next morning (the same night as the story) ---------- */

export const reportIntro =
  'You wake up to a fixed product and a plain-English report: what broke, why it broke, what we changed and what we’ve done so it doesn’t happen again. Every month you get the bigger picture: uptime, incidents, changes made and what we recommend next. No chasing updates. Nothing happens out of sight.'

/** Where you follow the work, whichever cloud the product runs on */
export const workspace: { name: string; who: string; headline: string; what: string; icon: IconName }[] = [
  {
    name: 'Client portal',
    who: 'For every client',
    headline: 'One place for everything we do for you.',
    what: 'Talk to your engineers, raise and track issues, share files and access securely, and see every report and your growth roadmap.',
    icon: 'users',
  },
  {
    name: 'VavenCloud dashboard',
    who: 'For clients on VavenCloud infrastructure',
    headline: 'Your infrastructure, in plain view.',
    what: 'See and manage your servers, databases, load balancers, private networks and backups, all in one dashboard.',
    icon: 'monitor',
  },
]

/** The example report. The bar splits the night at the call: before it, and with us. */
export const report = {
  title: 'Checkout down: fixed 27 minutes after the call',
  started: '02:14',
  called: '02:53',
  resolved: '03:20',
  meta: [
    ['Started', '02:14'],
    ['Engineer engaged', '02:53'],
    ['Resolved', '03:20'],
    ['Affected', 'Checkout only'],
  ],
  sections: [
    ['What happened', 'Checkout requests began timing out and returning errors. Payments stopped.'],
    ['Cause', 'A missing database index on the orders table. Every checkout query scanned the full table.'],
    ['Fix', 'Index added, tested and rolled out. Checkout back to normal speed.'],
    [
      'So it doesn’t happen again',
      'Slow-query alert added. New database changes are now checked for missing indexes before release.',
    ],
    ['Handled by', 'On-call engineer'],
  ],
}
