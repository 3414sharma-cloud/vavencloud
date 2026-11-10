import type { Faq } from '@/modules/faq/faq.data.ts'
import type { Feature } from '@/modules/features/features.data.ts'

/* Ported from vavencloud-static-website/src/constants/pricing/*. Prices are in USD. */

export interface Plan {
  name: string
  description?: string
  /** Pre-discount price, shown struck through, e.g. "$20.00" */
  oldPrice?: string
  /** Small pill next to the old price, e.g. "Save 50%" or "Included" */
  discount?: string
  /** Main price, e.g. "$10.00" or "FREE" */
  price: string
  /** Suffix after the price, e.g. "/mo" or "/GB" */
  period?: string
  popular?: boolean
  /** Not launched yet: features are blurred behind a "Coming soon" badge and the CTA goes to the contact form */
  comingSoon?: boolean
  features: string[]
  /** Shown muted with a dash, after the included features */
  missing?: string[]
}

/** One comparison-table row. `values` follow the order of the category's plans; booleans render as ✓ / ✕. */
export interface ComparisonRow {
  feature: string
  values: (string | boolean)[]
}

export interface PlanCategory {
  id: string
  label: string
  plans: Plan[]
  comparison: ComparisonRow[]
}

/** A main tab. Groups with more than one category show a second row of sub-tabs. */
export interface PlanGroup {
  id: string
  label: string
  categories: PlanCategory[]
}

const webHosting: PlanCategory = {
  id: 'web-hosting',
  label: 'Web Hosting',
  plans: [
    {
      name: 'Starter',
      description: 'Everything you need to create your website.',
      oldPrice: '$20.00',
      discount: 'Save 50%',
      price: '$10.00',
      period: '/mo',
      features: [
        'Standard Performance',
        'Unlimited Website',
        '10 GB SSD storage',
        '1 cPanel',
        'Weekly Backups',
        'Free SSL',
        'Free email',
        'Unlimited Bandwidth',
        '1 GB RAM',
        '1 Subdomain',
      ],
      missing: ['On-Demand Backups', 'Dedicated IP Address', 'Add-On Domains'],
    },
    {
      name: 'Pro',
      description: 'Level up with more enhanced features.',
      oldPrice: '$24.00',
      discount: 'Save 50%',
      price: '$12.00',
      period: '/mo',
      popular: true,
      features: [
        'Increased Performance (Up to 5x)',
        'Unlimited Website',
        '30 GB SSD storage',
        '1 cPanel',
        'Weekly Backups',
        'Free SSL',
        'Free email',
        'Unlimited Bandwidth',
        '2 GB RAM',
        '2 Subdomain',
        '1 Add-On Subdomain',
      ],
      missing: ['On-Demand Backups', 'Dedicated IP Address'],
    },
    {
      name: 'Business',
      description: 'Enjoy optimized powerful resources.',
      oldPrice: '$30.00',
      discount: 'Save 50%',
      price: '$15.00',
      period: '/mo',
      features: [
        'Maximum Performance (Up to 10x)',
        'Unlimited Website',
        '30 GB SSD storage',
        '1 cPanel',
        'Weekly Backups',
        'Free SSL',
        'Free email',
        'Unlimited Bandwidth',
        '3 GB RAM',
        '2 Subdomain',
        '1 Add-On Subdomain',
        'On-Demand Backups',
        'Dedicated IP Address',
      ],
    },
  ],
  comparison: [
    { feature: 'Standard DDoS Protection', values: [true, true, true] },
    { feature: 'Web Application Firewall', values: [false, true, true] },
    { feature: 'Malware Scanner', values: [false, false, true] },
    { feature: '30-Day Money-Back Guarantee', values: [false, true, true] },
    { feature: '99.9% Uptime Guarantee', values: [true, true, true] },
    { feature: '24/7 Customer Support', values: [true, true, true] },
    { feature: 'Data Centres', values: ['Fixed', 'Self-selected', 'Self-selected'] },
    { feature: 'Priority Support', values: [false, true, true] },
    { feature: 'Ticket Support', values: [false, true, true] },
    { feature: 'Chat', values: [false, true, true] },
  ],
}

const compute: PlanCategory = {
  id: 'compute',
  label: 'Compute',
  plans: [
    ['VPS Micro', '$24.00', '$12.00', '1 vCPU', '2 GB RAM', '40 GB SSD', '$1.00', '$2.00'],
    ['VPS Small', '$48.00', '$24.00', '2 vCPU', '4 GB RAM', '50 GB SSD', '$2.00', '$3.00'],
    ['VPS Medium', '$96.00', '$48.00', '4 vCPU', '8 GB RAM', '80 GB SSD', '$3.00', '$5.00'],
    ['VPS Large', '$180.00', '$90.00', '6 vCPU', '16 GB RAM', '100 GB SSD', '$4.00', '$7.00'],
    ['VPS XL', '$240.00', '$120.00', '8 vCPU', '32 GB RAM', '120 GB SSD', '$5.00', '$9.00'],
  ].map(([name, oldPrice, price, cpu, ram, ssd, backups, snapshots]) => ({
    name,
    oldPrice,
    discount: 'Save 50%',
    price,
    period: '/mo',
    popular: name === 'VPS Medium',
    features: [cpu, ram, ssd, `Auto-Backups (3 Days): ${backups}/mo`, `Snapshots: ${snapshots}/mo`],
  })),
  comparison: [
    { feature: 'vCPU', values: ['1', '2', '4', '6', '8'] },
    { feature: 'RAM', values: ['2 GB', '4 GB', '8 GB', '16 GB', '32 GB'] },
    { feature: 'SSD', values: ['40 GB', '50 GB', '80 GB', '100 GB', '120 GB'] },
    { feature: 'Auto-Backups (3 Days)', values: ['$1.00/mo', '$2.00/mo', '$3.00/mo', '$4.00/mo', '$5.00/mo'] },
    { feature: 'Snapshots', values: ['$2.00/mo', '$3.00/mo', '$5.00/mo', '$7.00/mo', '$9.00/mo'] },
  ],
}

const databases: PlanCategory = {
  id: 'databases',
  label: 'Databases',
  plans: [
    ['Starter', '$24.00', '$12.00', '1 vCPU', '1 GB RAM', '20 GB Storage', '$1.00', '$2.00'],
    ['Basic', '$40.00', '$20.00', '2 vCPU', '2 GB RAM', '30 GB Storage', '$1.00', '$2.00'],
    ['Standard', '$48.00', '$24.00', '2 vCPU', '4 GB RAM', '40 GB Storage', '$2.00', '$3.00'],
    ['Pro', '$72.00', '$36.00', '4 vCPU', '8 GB RAM', '50 GB Storage', '$2.00', '$3.00'],
  ].map(([name, oldPrice, price, cpu, ram, storage, backups, snapshots]) => ({
    name,
    oldPrice,
    discount: 'Save 50%',
    price,
    period: '/mo',
    popular: name === 'Standard',
    features: [cpu, ram, storage, `Auto-Backups (3 Days): ${backups}/mo`, `Snapshots: ${snapshots}/mo`],
  })),
  comparison: [
    { feature: 'vCPU', values: ['1', '2', '2', '4'] },
    { feature: 'RAM', values: ['1 GB', '2 GB', '4 GB', '8 GB'] },
    { feature: 'Storage', values: ['20 GB', '30 GB', '40 GB', '50 GB'] },
    { feature: 'Auto-Backups (3 Days)', values: ['$1.00/mo', '$1.00/mo', '$2.00/mo', '$2.00/mo'] },
    { feature: 'Snapshots', values: ['$2.00/mo', '$2.00/mo', '$3.00/mo', '$3.00/mo'] },
  ],
}

const loadBalancer: PlanCategory = {
  id: 'load-balancer',
  label: 'Load Balancer',
  plans: [
    {
      name: 'Basic',
      oldPrice: '$24.00',
      discount: 'Save 50%',
      price: '$12.00',
      period: '/mo',
      features: ['1 vCPU', '1 GB RAM', '5 GB SSD', 'Single load balancer VM'],
    },
    {
      name: 'HA (High Availability)',
      oldPrice: '$48.00',
      discount: 'Save 50%',
      price: '$24.00',
      period: '/mo',
      popular: true,
      features: ['2 vCPU', '2 GB RAM', '10 GB SSD', 'Active + standby pair'],
    },
    {
      name: 'Enterprise',
      oldPrice: '$60.00',
      discount: 'Save 50%',
      price: '$30.00',
      period: '/mo',
      features: ['3 vCPU', '3 GB RAM', '15 GB SSD', '2 directors + 1 HAProxy node', 'Minimum 1, max 10 nodes'],
    },
  ],
  comparison: [
    { feature: 'vCPU', values: ['1', '2', '3'] },
    { feature: 'RAM', values: ['1 GB', '2 GB', '3 GB'] },
    { feature: 'SSD', values: ['5 GB', '10 GB', '15 GB'] },
    {
      feature: 'Architecture',
      values: ['Single Load Balancer VM', 'Active + Standby Pair', '2 Directors + 1 HAProxy Nodes'],
    },
    { feature: 'Nodes', values: ['—', '—', 'Min 1, Max 10'] },
  ],
}

const networking: PlanCategory = {
  id: 'networking',
  label: 'Networking',
  plans: [
    {
      name: 'VPC',
      description: 'Private cloud networking included at no cost.',
      discount: 'Included',
      price: 'FREE',
      features: ['Virtual Private Cloud', 'Private IP Ranges', 'Subnet Isolation', 'Firewall Rules'],
    },
    {
      name: 'NAT Gateway',
      description: 'Your private VLAN is created automatically. Enable NAT for outbound internet access.',
      oldPrice: '$20.00',
      discount: 'Save 50%',
      price: '$10.00',
      period: '/mo',
      features: [
        'Outbound internet access for private servers',
        'Dedicated outbound public IP',
        'Servers are not directly accessible from the internet',
      ],
    },
  ],
  comparison: [
    { feature: 'Private VLAN', values: ['Included', 'Uses your VPC'] },
    { feature: 'Outbound Internet', values: ['—', 'Enabled'] },
    { feature: 'Outbound Public IP', values: ['—', 'Dedicated IP'] },
    { feature: 'Direct Internet Access', values: ['—', 'Not exposed'] },
    { feature: 'Price', values: ['FREE', '$10.00/mo'] },
  ],
}

const backups: PlanCategory = {
  id: 'backups',
  label: 'Backups',
  plans: [
    {
      name: 'Additional Storage',
      description: 'Pricing depends on the service you are using.',
      discount: 'Per GB',
      price: '$0.50',
      period: '/GB',
      features: [
        '1 GB additional storage',
        'Auto-Backups (3 Days): +$0.02/GB/month',
        'Snapshots: +$0.03/GB/month',
        'Rates apply based on your active cloud service',
      ],
    },
  ],
  comparison: [
    { feature: 'Unit', values: ['Per GB'] },
    { feature: 'Auto-Backups (3 Days)', values: ['+$0.02/GB/month'] },
    { feature: 'Snapshots', values: ['+$0.03/GB/month'] },
  ],
}

/** Hidden for now: add `{ id: 'business-email', label: 'Business Email', categories: [businessEmail] }` back to `planGroups` to show it. */
export const businessEmail: PlanCategory = {
  id: 'business-email',
  label: 'Business Email',
  plans: [
    {
      name: 'Starter Email',
      oldPrice: '$10.00',
      discount: 'Save 50%',
      price: 'Pricing under review',
      comingSoon: true,
      features: [
        '1 Mailbox',
        'Webmail Access',
        'Basic Spam Filter',
        'Mobile Compatibility',
        'SSL/TLS',
        'Email Forwarding',
      ],
    },
    {
      name: 'Team Email',
      oldPrice: '$20.00',
      discount: 'Save 50%',
      price: 'Pricing under review',
      comingSoon: true,
      features: ['5 Mailboxes', 'Webmail Access', 'Custom Domain', 'Shared Inbox', 'SSL/TLS', 'Team Forwarding Rules'],
    },
    {
      name: 'Pro Email',
      oldPrice: '$30.00',
      discount: 'Save 50%',
      price: 'Pricing under review',
      popular: true,
      comingSoon: true,
      features: [
        '10 Mailboxes',
        'Advanced Spam Protection',
        'Custom Domain',
        'Shared Calendars',
        'SSL + DKIM + SPF',
        'Priority Support',
      ],
    },
    {
      name: 'Enterprise Email',
      oldPrice: '$50.00',
      discount: 'Save 50%',
      price: 'Pricing under review',
      comingSoon: true,
      features: [
        'Unlimited Mailboxes',
        'Custom Policies',
        'Advanced Security',
        'Admin Console',
        'SLA Support',
        'Priority Onboarding',
      ],
    },
  ],
  comparison: [
    { feature: 'Mailbox Storage', values: ['10 GB', '50 GB', '100 GB', 'Enterprise Cloud'] },
    { feature: 'Advanced Security', values: ['Basic', 'Standard', 'Advanced', 'Enterprise Suite'] },
    { feature: 'Team Collaboration', values: ['Limited', 'Shared Inbox', 'Calendars + Teams', 'Enterprise Workspace'] },
    { feature: 'DKIM / SPF', values: ['Basic', 'Enhanced', 'Advanced', 'Custom Policies'] },
    { feature: 'SLA / Uptime', values: ['Basic SLA', 'Standard SLA', 'Priority SLA', 'Enterprise SLA'] },
    { feature: 'Ticket Support', values: ['Email Only', 'Fast Response', 'Priority Queue', 'Dedicated Manager'] },
  ],
}

export const planGroups: PlanGroup[] = [
  { id: 'web-hosting', label: 'Web Hosting', categories: [webHosting] },
  {
    id: 'cloud-services',
    label: 'Cloud Services',
    categories: [compute, databases, loadBalancer, networking, backups],
  },
]

/** "Every plan includes" – shown with the shared features section on the pricing page. */
export const planIncludes: Feature[] = [
  {
    icon: 'grid',
    title: 'Easy-to-Use Control Panel',
    description:
      'Manage domains, hosting, databases, email, backups and SSL certificates from one control panel, a few clicks each.',
  },
  {
    icon: 'shield',
    title: 'Advanced Security Protection',
    description:
      'Firewall security, malware detection, DDoS protection, automatic security updates and round-the-clock monitoring.',
  },
  {
    icon: 'support',
    title: '24/7 Technical Support',
    description:
      'Hosting specialists on hand day and night for migrations, server issues, website performance and technical help.',
  },
  {
    icon: 'zap',
    title: 'High-Speed SSD Storage',
    description: 'NVMe flash storage for faster page loads, a better user experience and stronger search rankings.',
  },
  {
    icon: 'lock',
    title: 'Free SSL Certificate',
    description:
      'Free SSL certificates and regular backups keep your data secure and recoverable whenever you need it.',
  },
  {
    icon: 'activity',
    title: '99.99% Uptime Guarantee',
    description: 'Redundant cloud infrastructure and proactive monitoring keep your site available and fast, 24/7.',
  },
]

export const pricingFaqs: Faq[] = [
  {
    q: 'What types of hosting plans do you offer?',
    a: 'We offer Web Hosting and Cloud Services (compute, databases, load balancers, networking and backups), so you can pick exactly what your project needs.',
  },
  {
    q: 'Do you provide free SSL certificates?',
    a: 'Yes, all our hosting plans come with free SSL certificates to secure your website.',
  },
  {
    q: 'What is cPanel, and do you offer it?',
    a: 'cPanel is a web hosting control panel that simplifies website management. Yes, every web hosting plan includes cPanel.',
  },
  {
    q: 'How much storage and bandwidth do I get?',
    a: 'Storage depends on the plan you choose, and every web hosting plan includes unlimited bandwidth. Open "Compare all features" above for the full breakdown.',
  },
  {
    q: 'Can I migrate my existing website to VavenCloud?',
    a: 'Yes, we provide free website migration for new customers.',
  },
]
