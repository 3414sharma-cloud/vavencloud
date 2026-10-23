import type { IconName } from './icons.ts'

export interface NavLink {
  label: string
  href: string
  children?: { label: string; href: string; description: string; icon: IconName }[]
}

export const navLinks: NavLink[] = [
  {
    label: 'Products',
    href: '#services',
    children: [
      { label: 'Cloud Servers', href: '#services', description: 'Scalable VPS & cloud compute', icon: 'cloud' },
      { label: 'Web Hosting', href: '#services', description: 'Fast, secure NVMe hosting', icon: 'server' },
      { label: 'CDN & Edge', href: '#services', description: 'Global delivery in milliseconds', icon: 'globe' },
      { label: 'Backups & Storage', href: '#services', description: 'Automated, offsite snapshots', icon: 'clock' },
      { label: 'Email Solutions', href: '#services', description: 'Business email on your domain', icon: 'mail' },
    ],
  },
  { label: 'Services', href: '#services' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Clients', href: '#clients' },
  { label: 'FAQ', href: '#faq' },
]

/** Products cycled in the hero headline ("Power your business with ___ designed to scale.") */
export const heroWords = ['Cloud Servers', 'Web Hosting', 'CDN & Edge', 'Cloud Backups', 'Business Email']

export const heroHighlights = [
  'Blazing-fast NVMe hosting',
  'Scalable cloud servers',
  '99.99% uptime guarantee',
  'Free SSL & daily backups',
  '24/7 expert support',
  'Free website migration',
]

export const trustedBy = ['Northwind', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Stark Labs', 'Wayne Tech', 'Acme Co']

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

export const faqs = [
  {
    q: 'What is VavenCloud?',
    a: 'VavenCloud is a hosting and cloud services provider. We offer web hosting, scalable cloud servers, CDN, backups and storage, and professional email, all on one platform.',
  },
  {
    q: 'What makes VavenCloud different from other hosting providers?',
    a: 'Fast NVMe infrastructure across global data centers, a 99.99% uptime SLA, and real cloud engineers available 24/7 who can manage and scale your servers for you.',
  },
  {
    q: 'What is the difference between web hosting and cloud servers?',
    a: 'Web hosting is a ready-to-go environment for websites and WordPress. Cloud servers give you dedicated, scalable resources with full root access for apps, databases and custom workloads.',
  },
  {
    q: 'Can I migrate my existing website to VavenCloud?',
    a: 'Absolutely. Our team handles migrations for free with zero downtime, including files, databases and email accounts.',
  },
  {
    q: 'What uptime do you guarantee?',
    a: 'We back our hosting with a 99.99% uptime SLA, monitored around the clock across redundant infrastructure.',
  },
  {
    q: 'What kind of support is available?',
    a: 'Our experts are available 24/7 via live chat, email and phone. Managed cloud plans also include proactive monitoring, patching and scaling assistance.',
  },
]

export const footerLinks = [
  {
    title: 'Services',
    links: ['Cloud Servers', 'Managed Cloud', 'Web Hosting', 'CDN & Edge', 'Backups & Storage', 'Email Solutions'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Clients', 'Careers', 'Blog', 'Help Center'],
  },
]
