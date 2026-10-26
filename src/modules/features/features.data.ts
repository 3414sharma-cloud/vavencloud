import type { IconName } from '@/shared/ui/icons.ts'

export interface Feature {
  icon: IconName
  title: string
  description: string
}

/** Partner, not vendor: support language from docs/messaging.md. */
export const features: Feature[] = [
  {
    icon: 'support',
    title: "We're on call",
    description: 'Real engineers, day and night. When something breaks, you talk to a person who can fix it.',
  },
  {
    icon: 'rocket',
    title: "We're behind your launch",
    description: 'We set up, deploy and test with you, then stay close on go-live day.',
  },
  {
    icon: 'activity',
    title: 'We keep it running',
    description: 'Monitoring, nightly backups and security patches, handled quietly in the background.',
  },
  {
    icon: 'lock',
    title: 'Your product stays yours',
    description: 'Your code, your data, your accounts. We run it, you own it.',
  },
  {
    icon: 'zap',
    title: 'Fast where your users are',
    description: 'NVMe storage, caching and a global CDN keep your app quick, wherever people open it.',
  },
  {
    icon: 'wallet',
    title: 'Clear, simple pricing',
    description: 'Plans without surprises. Grow or scale back whenever you need.',
  },
]
