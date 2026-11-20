import type { IconName } from '@/components/ui/icons.ts'

export const comparisonFeatures = [
  { key: 'engineering', label: 'Engineering coverage' },
  { key: 'infrastructure', label: 'Infrastructure & operations' },
  { key: 'reporting', label: 'Reporting' },
] as const

interface Plan {
  name: string
  icon: IconName
  bestFor: string
  price: string
  comparison?: {
    codeFixHours: number
    benefits: Record<(typeof comparisonFeatures)[number]['key'], string>
  }
}

export const plans: Plan[] = [
  {
    name: 'Essential',
    icon: 'server',
    bestFor: 'Early-stage founders',
    price: 'From $100/month',
  },
  {
    name: 'Managed',
    icon: 'shield',
    bestFor: 'Live products with a small development team',
    price: 'Agreed after your review',
    comparison: {
      codeFixHours: 4,
      benefits: {
        engineering: 'Dedicated engineers on call 24/7',
        infrastructure: 'Managed infrastructure, deployments, and monitoring',
        reporting: 'Monthly report',
      },
    },
  },
  {
    name: 'Partner',
    icon: 'zap',
    bestFor: 'Products where every minute of downtime costs revenue',
    price: 'Agreed after your review',
    comparison: {
      codeFixHours: 20,
      benefits: {
        engineering: 'Named lead engineer and 24/7 cover',
        infrastructure: 'Proactive scaling and quarterly deployment and monitoring improvements',
        reporting: 'Monthly report and quarterly growth review',
      },
    },
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
    text: '30 minutes with a senior engineer. You keep the written roadmap either way.',
  },
  {
    icon: 'wallet',
    title: 'One fixed monthly fee',
    text: 'Agreed after your review. No hourly meter, no surprise invoices.',
  },
  {
    icon: 'lock',
    title: 'Never locked in',
    text: 'Standard Linux, MySQL and PostgreSQL. Change plans anytime, or leave with everything handed over.',
  },
]
