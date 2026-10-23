import type { IconName } from '@/shared/ui/icons.ts'

export interface Feature {
  icon: IconName
  title: string
  description: string
}

export const features: Feature[] = [
  {
    icon: 'infinity',
    title: 'Managed Infrastructure',
    description: 'Server setup, patching, monitoring and scaling handled by cloud engineers, so you never have to firefight servers.',
  },
  {
    icon: 'globe',
    title: 'Global Cloud Infrastructure',
    description: 'Data centers across multiple continents keep your sites fast for visitors wherever they are.',
  },
  {
    icon: 'shield',
    title: 'Enterprise-grade Security',
    description: 'DDoS protection, firewalls, malware scanning and free SSL on every plan.',
  },
  {
    icon: 'zap',
    title: 'Performance First',
    description: 'NVMe storage, built-in caching and a global CDN for sub-second load times.',
  },
  {
    icon: 'support',
    title: 'Human Support, 24/7',
    description: 'Talk to real experts any time via chat, email or phone. No bots, no runaround.',
  },
  {
    icon: 'wallet',
    title: 'Transparent Pricing',
    description: 'Simple plans with no hidden fees. Scale up or down whenever you need.',
  },
]
