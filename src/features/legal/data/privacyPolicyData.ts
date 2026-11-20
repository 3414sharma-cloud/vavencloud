import type { LegalPage } from '../legal.types.ts'

/** Privacy Policy, from "VavenCloud Legal Pages v1" */
export const PRIVACY_POLICY: LegalPage = {
  title: 'Privacy Policy',
  lastUpdated: '[EFFECTIVE DATE]',
  intro:
    'We collect only what we need to talk to you, run your product and bill you. We never sell personal data. This policy explains what we collect, why, who sees it and what rights you have.',
  seoTitle: 'Privacy Policy | VavenCloud',
  seoDescription:
    'What personal data VavenCloud collects, why, who sees it and what rights you have. We never sell personal data.',
  sections: [
    {
      heading: '1. Who is responsible',
      blocks: [
        'Vavensoft Private Limited, trading as VavenCloud, La Daftar, D 178, Phase 8B, Industrial Area, Sector 74, Sahibzada Ajit Singh Nagar, Punjab 140308, India. Privacy questions: privacy@vavencloud.com.',
        'We play two roles, and this matters for your rights:',
        {
          list: [
            '**Controller** for information about our website visitors, prospects and client contacts. This policy covers that information in full.',
            '**Processor** for personal data inside the products we run for clients, such as their customers’ records in a database. We handle that data only on the client’s instructions, under our agreement with them. If you are one of our client’s customers, contact that client first; we will help them answer you.',
          ],
        },
      ],
    },
    {
      heading: '2. What we collect',
      blocks: [
        {
          table: {
            headers: ['Where it comes from', 'What we collect'],
            rows: [
              [
                'Free review form and emails',
                'Name, work email, company, website, role, and what you tell us about your product',
              ],
              ['Review and support calls', 'Notes from the call. We record a call only if you agree at the start'],
              [
                'Becoming a client',
                'Billing contact, billing address, tax details and payment records. Card details are handled by our payment provider, not stored by us',
              ],
              ['Client portal and dashboard', 'Login details, activity logs and messages with our engineers'],
              [
                'Running your product',
                'Access credentials, system logs and monitoring data. These may contain personal data of your users, which we handle as your processor',
              ],
              [
                'Our website',
                'Pages visited, device and browser type, approximate location from IP address, and cookies (see section 8)',
              ],
            ],
          },
        },
      ],
    },
    {
      heading: '3. Why we use it',
      blocks: [
        {
          table: {
            headers: ['Purpose', 'Legal basis (GDPR)'],
            rows: [
              ['Reply to your enquiry and run your free review', 'Steps you asked for before a contract'],
              ['Deliver the service, respond to incidents and send reports', 'Performing our contract with you'],
              ['Bill you and keep tax records', 'Legal obligation'],
              ['Keep our systems and yours secure, and prevent abuse', 'Legitimate interest'],
              [
                'Send occasional articles or product updates',
                'Consent, or legitimate interest for existing clients. Unsubscribe any time',
              ],
              ['Improve our website', 'Consent, through the cookie banner'],
            ],
          },
        },
        'We do not use personal data inside your product for any purpose of our own, and we do not use it to train AI models.',
      ],
    },
    {
      heading: '4. Who we share it with',
      blocks: [
        {
          list: [
            '**Our team:** VavenCloud and Vavensoft engineers who work on your account, each bound by confidentiality.',
            '**Service providers (sub-processors):** [SUB-PROCESSORS]. Any we add will be bound by a written contract to protect the data and use it only for the service they provide to us.',
            '**Your cloud provider:** when we run your product in your own cloud account, your data stays with your provider under your agreement with them.',
            '**Authorities:** only when the law requires, and we tell you first unless the law forbids it.',
          ],
        },
        'We never sell personal data, and we do not share it for cross-context behavioural advertising.',
      ],
    },
    {
      heading: '5. International transfers',
      blocks: [
        'Our team works from India, and our providers may be in other countries. When personal data from the EU, UK or another region with transfer rules leaves that region, we protect it with recognised safeguards, such as the European Commission’s Standard Contractual Clauses. Data hosted on VavenCloud infrastructure is stored in [DATA CENTRES].',
      ],
    },
    {
      heading: '6. How long we keep it',
      blocks: [
        {
          list: [
            '**Enquiries that do not become clients:** 24 months from our last contact, then deleted.',
            '**Client account and contract records:** for the length of the contract plus the period tax and company law requires, usually 8 years for financial records in India.',
            '**Data inside your product:** for as long as we run your product, then [EXIT RETENTION] after you leave, then securely deleted, with written confirmation.',
            '**Logs and monitoring data:** 90 days, unless your plan or an incident investigation needs longer.',
          ],
        },
      ],
    },
    {
      heading: '7. How we protect it',
      blocks: [
        'Access is limited to named engineers and logged. Data is encrypted in transit and at rest, credentials are kept in a secrets manager, and accounts use multi-factor authentication. Our Trust & Security page gives the full picture.',
        'If a breach affects your personal data, we will tell you without undue delay. For clients, we tell you within 72 hours of becoming aware of it, so you can meet your own duties.',
      ],
    },
    {
      heading: '8. Cookies',
      blocks: [
        'We use essential cookies to make the website and portal work. Analytics cookies are used only if you accept them in the cookie banner, and you can change your choice at any time. We do not use advertising cookies.',
      ],
    },
    {
      heading: '9. Your rights',
      blocks: [
        'Depending on where you live, you may ask to:',
        {
          list: [
            'see the personal data we hold about you, and get a copy;',
            'correct it or have it deleted;',
            'restrict or object to how we use it, including for marketing;',
            'move it to another provider;',
            'withdraw consent you gave earlier.',
          ],
        },
        '**EU and UK:** you also have the right to complain to your local data protection authority.',
        '**California and other US states:** you have the right to know, delete and correct, and the right not to be discriminated against for using these rights. We do not sell or share personal information as these laws define it.',
        '**India:** under the Digital Personal Data Protection Act, 2023, you may ask for a summary of your data, its correction or erasure, and nominate someone to act for you. Grievance Officer: [GRIEVANCE OFFICER].',
        'To use any of these rights, email privacy@vavencloud.com. We reply within 30 days and may ask you to confirm your identity first.',
      ],
    },
    {
      heading: '10. Children',
      blocks: ['Our services are for businesses. We do not knowingly collect personal data from anyone under 18.'],
    },
    {
      heading: '11. Changes to this policy',
      blocks: [
        'If we make a change that materially affects you, we will tell clients by email at least 30 days before it takes effect, and update the date at the top of this page.',
      ],
    },
    {
      heading: '12. Contact',
      blocks: [
        'privacy@vavencloud.com · Grievance Officer: [GRIEVANCE OFFICER] · Vavensoft Private Limited, address above.',
      ],
    },
  ],
}
