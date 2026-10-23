import type { IconName } from '@/shared/ui/icons.ts'

export interface Service {
  icon: IconName
  title: string
  description: string
  tags: string[]
  className?: string
  featured?: boolean
}

export const services: Service[] = [
  {
    icon: 'cloud',
    title: 'Cloud Servers & Infrastructure',
    description:
      'Deploy high-performance cloud servers in seconds. Scale CPU, RAM and storage on demand, run on redundant hardware across global data centers, and let our team manage the infrastructure for you.',
    tags: ['VPS & dedicated vCPU', 'Auto-scaling', 'Load balancers', 'Managed cloud'],
    className: 'lg:col-span-2',
    featured: true,
  },
  {
    icon: 'server',
    title: 'Web Hosting',
    description: 'Lightning-fast, secure hosting with free SSL, daily backups and one-click installs for WordPress and more.',
    tags: ['NVMe storage', 'Free SSL', 'WordPress'],
  },
  {
    icon: 'globe',
    title: 'CDN & Edge Network',
    description: 'Cache and deliver your content from edge locations close to your visitors for sub-second load times worldwide.',
    tags: ['Global CDN', 'Edge caching', 'DDoS shield'],
  },
  {
    icon: 'clock',
    title: 'Backups & Cloud Storage',
    description: 'Automated daily snapshots and scalable object storage, kept offsite and restorable in one click.',
    tags: ['Daily snapshots', 'Object storage', '1-click restore'],
  },
  {
    icon: 'mail',
    title: 'Professional Email Solutions',
    description: 'Build trust with branded email on your own domain, with spam protection and access from any device.',
    tags: ['Custom domain', 'Anti-spam', 'Webmail'],
  },
]

export const stats = [
  { value: '99.99%', label: 'Uptime SLA' },
  { value: '2,000+', label: 'Happy clients' },
  { value: '15+', label: 'Global data centers' },
  { value: '24/7', label: 'Expert support' },
]
