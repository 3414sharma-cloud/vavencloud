import { legalPaths as paths } from '../legal.routes.ts'

export const TRUST_AND_SECURITY = {
  title: 'Trust & Security at VavenCloud',
  intro:
    "VavenCloud is built on infrastructure we own and operate ourselves. This page explains, plainly, how we protect your data and what happens if something goes wrong. We'll keep this page updated as our security practices grow — including once we pursue third-party certifications like SOC 2.",
  seoTitle: 'Trust & Security | VavenCloud',
  seoDescription:
    'Learn plainly how VavenCloud protects your data through encryption, isolated private networks, bare-metal infrastructure, automated backups, and proactive incident response.',
  sections: [
    {
      heading: 'Encryption',
      list: [
        'All traffic between your device and the VavenCloud dashboard, APIs, and provisioned services is encrypted in transit using TLS.',
        'Data stored in Managed Databases, backups, and snapshots is encrypted at rest.',
      ],
    },
    {
      heading: 'Where Your Data Lives',
      body: [
        "VavenCloud operates its own bare-metal infrastructure across multiple regions: Strasbourg, France; St. Louis, USA; and New York, USA. We're actively expanding into Germany, Canada, Australia, and India — this section will be updated as new regions go live.",
        'We do not share physical infrastructure with, or resell from, third-party cloud providers.',
      ],
    },
    {
      heading: 'Network & Access Security',
      list: [
        "Every customer's servers run on an isolated private network; other customers cannot see or reach them.",
        'Two-factor authentication (2FA) is available for all customer accounts and required for our internal administrative systems.',
        "Access to customer infrastructure by VavenCloud staff is limited to what's needed for support and platform operations.",
      ],
    },
    {
      heading: 'Backups',
      list: [
        'Automated backups are available for Cloud Servers and Managed Databases and can be enabled directly from your dashboard. Once enabled, backups run automatically on the schedule you configure.',
        "Enabling and verifying backups is the customer's responsibility — we strongly recommend keeping an independent copy of critical data.",
      ],
    },
    {
      heading: 'Payments',
      body: [
        'We never see or store your full card details. All payments and billing are processed securely by Razorpay and Chargebee, our PCI-compliant payment partners.',
      ],
    },
    {
      heading: 'Incident Response',
      body: [
        'If we discover or are notified of a security incident affecting customer data, we will investigate promptly and notify affected customers without undue delay, consistent with our Privacy Policy and applicable law.',
        'You can report a suspected vulnerability or security issue to security@vavencloud.com. We take all reports seriously and will respond.',
      ],
      contact: {
        email: 'security@vavencloud.com',
      },
    },
    {
      heading: 'Compliance Roadmap',
      body: [
        "We're currently focused on strong operational security fundamentals. Formal third-party certifications such as SOC 2 are on our roadmap as we scale — this page will be updated as we achieve them.",
      ],
    },
    {
      heading: 'Related Policies',
      links: [
        { label: 'Terms & Conditions — vavencloud.com/terms', href: paths.termsOfService },
        { label: 'Privacy Policy — vavencloud.com/privacy', href: paths.privacyPolicy },
        { label: 'Acceptable Use Policy — vavencloud.com/aup', href: paths.acceptableUsePolicy },
        {
          label: 'Service Level Agreement — vavencloud.com/sla',
          href: paths.serviceLevelAgreement,
        },
      ],
    },
  ],
} as const
