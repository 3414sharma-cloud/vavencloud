import { routes } from '@/app/routes.ts'
import type { IconName } from '@/components/ui/icons.ts'
import { planTerms as t, type PlanKey } from '@/features/shared/plan-terms.ts'

/*
 * The plans, from "VavenCloud Plans: Essential, Managed, Partner": the plan cards (six bullets each, so the
 * cards line up), what every plan includes, and the full comparison. The numbers come from plan-terms.ts, shared
 * with the SLA and the Terms.
 */

interface Plan {
  key: PlanKey
  name: string
  icon: IconName
  /** One line under the name */
  tagline: string
  price: string
  /** Who it's for, beside the price */
  forWhom: string
  /** Exactly six, so the cards line up */
  bullets: string[]
  cta: { label: string; href: string }
}

export const plans: Plan[] = [
  {
    key: 'essential',
    name: 'Essential',
    icon: 'server',
    tagline: 'Experts on call before you can afford a team.',
    price: 'From $100/month',
    forWhom: 'For early products and MVPs',
    bullets: [
      `Critical response within ${t.criticalResponse.essential}, 24/7`,
      'Shared senior team in your client portal',
      'Monitoring, daily backups and monthly patching',
      `Production environment, up to ${t.serverLimit.essential} servers`,
      'Code fixes quoted when you need them',
      'Incident reports and a monthly report',
    ],
    cta: { label: 'Start with Essential', href: routes.book },
  },
  {
    key: 'managed',
    name: 'Managed',
    icon: 'shield',
    tagline: 'Your own team, owning every layer.',
    price: 'Fixed monthly fee',
    forWhom: 'For live products with paying users',
    bullets: [
      `Critical response within ${t.criticalResponse.managed}, 24/7`,
      'Dedicated team of 2 to 3 in your portal and chat',
      'Production and staging, CI/CD with one-step rollback',
      `${t.codeFixHours.managed} hours of code fixes every month`,
      'App performance monitoring and monthly security scans',
      'Monthly report, monthly call and quarterly cost review',
    ],
    cta: { label: 'Book a free review', href: routes.book },
  },
  {
    key: 'partner',
    name: 'Partner',
    icon: 'zap',
    tagline: 'A named lead engineer who plans ahead, not just fixes.',
    price: 'Fixed monthly fee',
    forWhom: 'For revenue-critical products',
    bullets: [
      `Critical response within ${t.criticalResponse.partner}, 24/7`,
      'Named lead engineer, backup, and a direct line',
      'Zero-downtime releases and launch-day standby',
      `${t.codeFixHours.partner} hours of code fixes every month, priority queue`,
      'Hourly snapshots and a tested disaster recovery plan',
      'Quarterly growth review with your founder or CTO',
    ],
    cta: { label: 'Book a free review', href: routes.book },
  },
]

/** Under the cards */
export const sameCore =
  'The same core on every plan: 24/7 critical response, one owner per incident, a report after every fix, and no lock-in. Change plans any time.'

/** Included on every plan. These never move behind a higher price. */
export const everyPlan = [
  '24/7 critical incident response',
  'One engineer owns each incident until it is fixed, including fixes in your code',
  'A plain-English report after every incident',
  'Client portal and a monthly report',
  'Your accounts stay yours, no lock-in, full handover if you leave',
  'Free 30-minute review and a written roadmap within 48 hours before you start',
]

export interface ComparisonRow {
  label: string
  values: Record<PlanKey, string>
}

/** The full comparison, in groups. Price and who it's for are on the cards. */
export const comparison: { group: string; rows: ComparisonRow[] }[] = [
  {
    group: 'Response and team',
    rows: [
      {
        label: 'Critical response (24/7)',
        values: t.criticalResponse,
      },
      {
        label: 'High-severity response',
        values: t.highResponse,
      },
      {
        label: 'Your engineers',
        values: {
          essential: 'Shared senior team',
          managed: 'Dedicated team of 2 to 3 who know your product',
          partner: 'Named lead engineer plus a backup',
        },
      },
      {
        label: 'How you reach us',
        values: {
          essential: 'Portal and email',
          managed: 'Plus a shared Slack or Teams channel',
          partner: 'Plus a direct line to your lead engineer',
        },
      },
    ],
  },
  {
    group: 'Infrastructure',
    rows: [
      {
        label: 'Environments',
        values: { essential: 'Production only', managed: 'Production and staging', partner: 'All environments' },
      },
      {
        label: 'Size included',
        values: {
          essential: `Up to ${t.serverLimit.essential} servers or services`,
          managed: `Up to ${t.serverLimit.managed} servers or services`,
          partner: 'As agreed in the order form',
        },
      },
      {
        label: 'Monitoring',
        values: {
          essential: 'Uptime, server health and alerts',
          managed: 'Plus app performance and error tracking',
          partner: 'Plus business alerts (checkout, sign-ups) and simulated user journeys',
        },
      },
      {
        label: 'Backups',
        values: {
          essential: `Daily, kept ${t.backupDays.essential} days`,
          managed: `Daily, kept ${t.backupDays.managed} days, quarterly restore test`,
          partner: `Hourly database snapshots, kept ${t.backupDays.partner} days, monthly restore test, disaster recovery plan`,
        },
      },
      {
        label: 'Security',
        values: {
          essential: 'Monthly patching',
          managed: 'Plus a monthly vulnerability scan',
          partner: 'Plus a yearly security review and a quarterly access audit',
        },
      },
      {
        label: 'Deployments',
        values: {
          essential: 'Your current pipeline kept running',
          managed: 'CI/CD set up and maintained, staging, one-step rollback',
          partner: 'Zero-downtime releases, an engineer on standby for big launches',
        },
      },
      {
        label: 'Scaling',
        values: {
          essential: 'Fixed when it breaks',
          managed: 'Auto scaling set up',
          partner: 'Capacity planned ahead of launches, load test before big releases',
        },
      },
      {
        label: 'Cloud cost',
        values: {
          essential: 'Monthly bill summary',
          managed: 'Quarterly cost-reduction review',
          partner: 'Ongoing cost reduction',
        },
      },
    ],
  },
  {
    group: 'Code, reviews and handover',
    rows: [
      {
        label: 'Code fixes',
        values: {
          essential: 'Quoted when needed',
          managed: `${t.codeFixHours.managed} hours a month included`,
          partner: `${t.codeFixHours.partner} hours a month included, priority queue`,
        },
      },
      {
        label: 'Reviews',
        values: {
          essential: 'Monthly report',
          managed: 'Monthly report and a 30-minute call',
          partner: 'Monthly call and a quarterly growth review with your founder or CTO',
        },
      },
      {
        label: 'Handover',
        values: {
          essential: 'About 1 week, core documentation',
          managed: '1 to 2 weeks, full documentation and runbooks',
          partner: '2 weeks, deep audit and a disaster recovery runbook',
        },
      },
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
    text: '30 minutes with a senior engineer. You keep the written roadmap either way.',
  },
  {
    icon: 'wallet',
    title: 'One fixed monthly fee',
    text: 'From $100/month, or agreed after your review. No hourly meter, no surprise invoices.',
  },
  {
    icon: 'lock',
    title: 'Never locked in',
    text: 'Built on open standards. Leave anytime, with everything handed over.',
  },
]
