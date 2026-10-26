import type { NeedId } from '@/modules/needs/needs.data.ts'
import type { IconName } from '@/shared/ui/icons.ts'

export interface Service {
  icon: IconName
  title: string
  description: string
  tags: string[]
  /** "Where is your product today?" choices this card is recommended for */
  needs: NeedId[]
}

/**
 * "Everything your product needs to run" (docs/messaging.md). Platform only: development is not a
 * headline service, it appears as the quiet "Need extra hands?" card after the plans.
 * Business email is hidden on the site for now, so it is not listed here.
 */
export const services: Service[] = [
  {
    icon: 'globe',
    title: 'Web Hosting',
    description: 'A fast, secure home for your website or store, with cPanel, free SSL and one-click WordPress.',
    tags: ['NVMe storage', 'Free SSL', 'cPanel'],
    needs: ['website'],
  },
  {
    icon: 'server',
    title: 'Cloud Servers',
    description: 'Dedicated vCPU, RAM and SSD for your app, with full root access and room to grow.',
    tags: ['VPS', 'Databases', 'Private network'],
    needs: ['cloud', 'launch'],
  },
  {
    icon: 'rocket',
    title: 'Launch Support',
    description: 'Bring your product. We set up the server, deploy it, test it and stay with you on launch day.',
    tags: ['Setup', 'Deployment', 'Go-live'],
    needs: ['launch'],
  },
  {
    icon: 'cloud',
    title: 'CDN & Backups',
    description: 'Your app stays quick worldwide, and nightly backups are kept off-site with one-click restore.',
    tags: ['Edge caching', 'Snapshots', '1-click restore'],
    needs: ['website', 'cloud', 'manage'],
  },
  {
    icon: 'infinity',
    title: 'Engineers on your side',
    description: 'Monitoring, patching, scaling and CI/CD, looked after by people who learn how your product works.',
    tags: ['24/7 monitoring', 'CI/CD', 'Patching'],
    needs: ['manage', 'launch'],
  },
  {
    icon: 'shield',
    title: 'Security built in',
    description: 'DDoS protection, firewalls, malware scanning and SSL, switched on for your product from day one.',
    tags: ['DDoS protection', 'Firewall', 'SSL'],
    needs: ['website', 'cloud', 'manage'],
  },
]
