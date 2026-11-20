import type { IconName } from '@/components/ui/icons.ts'

/**
 * The plans (VavenCloud-Sample-Content.md). No prices on purpose: a fixed monthly fee is agreed after the free
 * review. TODO: confirm response times and monthly code hours before launch.
 */
export interface Plan {
  name: string
  popular?: boolean
  bestFor: string
  rows: { label: string; value: string }[]
}

export const plans: Plan[] = [
  {
    name: 'Managed',
    bestFor: 'Live products with a small development team',
    rows: [
      { label: 'Price', value: 'Fixed monthly fee, agreed after your review' },
      { label: 'On call', value: '24/7, 7 days a week' },
      { label: 'Critical incident response', value: 'Within 1 hour, any time' },
      { label: 'Your engineers', value: 'A dedicated team in your portal and chat' },
      { label: 'Infrastructure', value: 'Designed, built and run by us' },
      { label: 'Deployments and monitoring', value: 'Set up and maintained' },
      { label: 'Fixes in your code', value: '4 hours every month' },
      { label: 'Reporting', value: 'Monthly report' },
    ],
  },
  {
    name: 'Partner',
    popular: true,
    bestFor: 'Products where every minute of downtime costs revenue',
    rows: [
      { label: 'Price', value: 'Fixed monthly fee, agreed after your review' },
      { label: 'On call', value: '24/7, 7 days a week' },
      { label: 'Critical incident response', value: 'Within 30 minutes, any time' },
      { label: 'Your engineers', value: 'A named lead engineer who knows your product inside out' },
      { label: 'Infrastructure', value: 'Designed, built, run and scaled ahead of growth' },
      { label: 'Deployments and monitoring', value: 'Set up and improved every quarter' },
      { label: 'Fixes in your code', value: '20 hours every month' },
      { label: 'Reporting', value: 'Monthly report and a quarterly growth review' },
    ],
  },
]

/** Between the plans and why it's safe: what the plan hours cover */
export const scope = {
  included: [
    'Bugs and errors in existing features',
    'Failed deployments and broken releases',
    'Performance problems and slow pages',
    'Security patches and dependency updates',
    'Small config and copy changes',
  ],
  quoted: [
    'New features and new screens',
    'Rebuilding or redesigning large parts of the app',
    'Moving to a different framework or language',
    'Work on third-party systems we don’t look after',
    'Projects needing more than a week of development',
  ],
  note: [
    'If a fix needs more than your remaining hours,',
    'we tell you first, give you a fixed quote and wait for your approval. Nothing is billed without it.',
  ],
}

/** Under the plans: why saying yes is safe */
export const safety: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'search',
    title: 'Free review first',
    text: '45 minutes with a senior engineer. You keep the written roadmap either way.',
  },
  {
    icon: 'wallet',
    title: 'One fixed monthly fee',
    text: 'Agreed after your review. No hourly meter, no surprise invoices.',
  },
  {
    icon: 'lock',
    title: 'Never locked in',
    text: 'Standard Linux, MySQL and PostgreSQL. Leave any time with everything handed over.',
  },
]
