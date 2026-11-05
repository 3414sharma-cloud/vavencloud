export const PRIVACY_POLICY = {
  title: 'Privacy Policy',
  subtitle: 'How VavenCloud collects, uses, and protects your information',
  effectiveDate: 'July 2, 2026',
  seoTitle: 'Privacy Policy | VavenCloud',
  seoDescription:
    'Learn how VavenCloud collects, uses, discloses, and protects personal data in compliance with DPDPA 2023, GDPR, and international privacy regulations.',
  sections: [
    {
      heading: '1. Introduction',
      body: [
        'This Privacy Policy explains how VavenCloud, Powered by Vavensoft ("VavenCloud," "we," "us") collects, uses, discloses, and protects personal data when you visit our website, create an Account, or use the Services. This Policy is designed to align with India\'s Digital Personal Data Protection Act, 2023 (DPDPA), and, for customers outside India, with applicable frameworks such as the EU General Data Protection Regulation (GDPR) and relevant US state privacy laws, where they apply to our processing.',
      ],
    },
    {
      heading: '2. Information We Collect',
      list: [
        'Account information: name, email address, phone number, billing address, and company details you provide at signup.',
        'Payment information: processed directly by our payment partners, Razorpay and Chargebee; VavenCloud does not store full card numbers.',
        'Service data: configuration details of the resources you provision (server sizes, regions, domain names), support tickets, and communications with us.',
        'Usage and log data: IP addresses, access timestamps, API request logs, and dashboard activity, collected for security, billing, and operational purposes.',
        'Cookies and similar technologies: as described in Section 10.',
      ],
      bodyAfter: [
        'VavenCloud does not inspect, scan, or access the content stored inside customer servers, databases, or hosting accounts except where necessary to provide support you request, investigate an AUP violation, or comply with a valid legal order.',
      ],
    },
    {
      heading: '3. How We Use Your Information',
      list: [
        'To create and manage your Account and provision the Services you order.',
        'To process payments, generate invoices, and manage subscriptions and renewals.',
        'To provide customer support and respond to tickets or inquiries.',
        'To monitor, secure, and maintain the reliability of the platform, including fraud and abuse prevention.',
        'To send service-related notices (e.g., maintenance, billing, security alerts) and, where you have consented, marketing communications.',
        'To comply with legal, regulatory, and tax obligations.',
      ],
    },
    {
      heading: '4. Legal Basis for Processing',
      body: [
        'Where applicable law requires a legal basis for processing, we rely on: your consent (e.g., for marketing), performance of a contract (e.g., providing the Services you ordered), compliance with a legal obligation (e.g., tax records, breach notification), and our legitimate interests (e.g., platform security and fraud prevention), balanced against your rights.',
      ],
    },
    {
      heading: '5. How We Share Information',
      body: ['We do not sell personal data. We share information only with:'],
      list: [
        'Payment partners (Razorpay, Chargebee) to process transactions and manage billing.',
        'Infrastructure and datacenter partners necessary to deliver the Services.',
        'Subprocessors providing support tools (e.g., ticketing, email delivery), bound by confidentiality and data protection obligations.',
        'Law enforcement or regulators, where required by valid legal process.',
        'A successor entity in the event of a merger, acquisition, or asset sale, subject to continued protection of your data under this Policy.',
      ],
    },
    {
      heading: '6. International Data Transfers',
      body: [
        'As VavenCloud serves customers worldwide, personal data may be transferred to and processed in countries other than your own, including where our datacenter and processing partners are located. Where required, we implement appropriate safeguards (such as standard contractual clauses or equivalent mechanisms) for such transfers.',
      ],
    },
    {
      heading: '7. Data Retention',
      list: [
        'Account and billing data is retained for as long as your Account is active, and for 7 years thereafter to meet tax, accounting, and legal obligations.',
        'Service configuration and log data is retained for 12 months for security and operational purposes, unless a longer period is required by law.',
        'Upon Account closure, Customer Content is deleted in line with Section 9 of the Terms & Conditions (Part I).',
      ],
    },
    {
      heading: '8. Security Measures',
      body: [
        'We implement technical and organizational measures appropriate to the risk, including encryption of data in transit and at rest, access controls and multi-factor authentication for administrative systems, network segmentation, logging and monitoring, and regular patching. No method of transmission or storage is completely secure; we cannot guarantee absolute security, but we are committed to promptly investigating and addressing any incident.',
      ],
    },
    {
      heading: '9. Your Rights',
      body: [
        'Subject to applicable law (including the DPDPA and, where applicable, GDPR), you may have the right to:',
      ],
      list: [
        'Access the personal data we hold about you.',
        'Correct inaccurate or incomplete data.',
        'Request erasure of your personal data, subject to legal retention requirements.',
        'Withdraw consent where processing is based on consent, without affecting prior lawful processing.',
        'Nominate another individual to exercise your rights on your behalf in the event of death or incapacity (as provided under the DPDPA).',
        'Lodge a grievance with our Grievance Officer (Section 13) or complain to the relevant supervisory authority (e.g., the Data Protection Board of India).',
      ],
      bodyAfter: [
        'To exercise these rights, contact us at privacy@vavencloud.com. We will respond within the timeframe required by applicable law.',
      ],
      contact: {
        email: 'privacy@vavencloud.com',
      },
    },
    {
      heading: '10. Cookies & Tracking Technologies',
      body: [
        'We use cookies and similar technologies on our website and dashboard for authentication, security, preference storage, and (where you consent) analytics. You can control cookies through your browser settings; disabling essential cookies may affect the functionality of the dashboard.',
      ],
    },
    {
      heading: '11. Children’s Privacy',
      body: [
        'The Services are not directed at individuals under the age of 18. We do not knowingly collect personal data from children. If we become aware that we have inadvertently collected such data, we will take steps to delete it promptly.',
      ],
    },
    {
      heading: '12. Data Breach Notification',
      body: [
        'In the event of a personal data breach that poses a risk to your rights, we will notify affected customers and, where required by applicable law, the relevant regulator (e.g., the Data Protection Board of India) without undue delay, in line with our Incident Response procedures.',
      ],
    },
    {
      heading: '13. Grievance Officer',
      body: [
        'In accordance with applicable Indian law, VavenCloud has appointed a Grievance Officer to address concerns regarding personal data processing:',
        'Name: Data Protection Officer, VavenCloud',
      ],
      contact: {
        email: 'privacy@vavencloud.com',
        address: 'Mohali, Punjab, India',
      },
    },
    {
      heading: '14. Changes to This Policy',
      body: [
        'We may update this Privacy Policy periodically. Material changes will be communicated via email or a prominent dashboard notice before they take effect. The “Last Updated” date at the top of this document reflects the most recent revision.',
      ],
    },
    {
      heading: '15. Contact Us',
      body: [
        'For any questions about this Privacy Policy or our data practices, contact: privacy@vavencloud.com — VavenCloud, Powered by Vavensoft, Mohali, Punjab, India.',
      ],
      contact: {
        email: 'privacy@vavencloud.com',
        address: 'Mohali, Punjab, India',
      },
    },
  ],
} as const
