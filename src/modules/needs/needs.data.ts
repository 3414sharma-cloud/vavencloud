import type { IconName } from '@/shared/ui/icons.ts'

export type NeedId = 'website' | 'cloud' | 'launch' | 'manage'

/** Plan tabs on the landing page (see modules/pricing/plans.section.ts). */
export type PlanTabId = 'web-hosting' | 'compute'

/**
 * "Where is your product today?" options. The visitor's pick tailors the page:
 * matching platform cards are marked, the plans tab switches and the contact subject is pre-selected.
 */
export interface Need {
  id: NeedId
  /** Option label in the picker */
  label: string
  icon: IconName
  /** Recommended solution shown under the picker */
  title: string
  summary: string
  points: string[]
  /** "Starting at" text */
  from: string
  /** Must match one of the contact form subjects (modules/contact/contact.section.ts) */
  subject: string
  planTab?: PlanTabId
}

export const needs: Need[] = [
  {
    id: 'website',
    label: 'I have a website to host',
    icon: 'globe',
    title: 'Web Hosting',
    summary: 'A fast, secure home for your site, store or WordPress, with a free move from your current host.',
    points: ['Free SSL and automatic backups', 'Unlimited bandwidth', 'Free move from your current host'],
    from: '$10.00/mo',
    subject: 'Web Hosting',
    planTab: 'web-hosting',
  },
  {
    id: 'cloud',
    label: 'My app needs its own servers',
    icon: 'server',
    title: 'Cloud Servers (VPS)',
    summary: 'Dedicated vCPU, RAM and SSD with full root access, sized for your app and easy to grow.',
    points: ['From 1 to 8 vCPU and 32 GB RAM', 'Snapshots and backups', 'Private networking included'],
    from: '$12.00/mo',
    subject: 'Cloud Servers',
    planTab: 'compute',
  },
  {
    id: 'launch',
    label: 'My product is ready to launch',
    icon: 'rocket',
    title: 'Launch Support',
    summary: 'Bring your product, whoever built it. We set up the servers, deploy it, test it and stay with you on launch day.',
    points: ['Server setup and deployment', 'Tested before you go live', 'An engineer with you on launch day'],
    from: 'Custom quote',
    subject: 'Launch my product',
  },
  {
    id: 'manage',
    label: 'I need someone on call',
    icon: 'support',
    title: 'Engineers on your side',
    summary: 'Monitoring, backups, patching and a real person to call when something breaks, wherever your servers run.',
    points: ['24/7 monitoring and alerts', 'Backups and security patches', 'Someone to call when it breaks'],
    from: 'Custom quote',
    subject: 'On-call support',
  },
]
