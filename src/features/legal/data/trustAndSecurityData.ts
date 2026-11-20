import type { LegalPage } from '../legal.types.ts'

/** Trust & Security, from "VavenCloud Legal Pages v1" */
export const TRUST_AND_SECURITY: LegalPage = {
  title: 'Trust & Security',
  lastUpdated: '[EFFECTIVE DATE]',
  intro:
    'When you hand us production, you hand us the keys. Owning your product means owning its security too, so this page explains exactly how we protect your access, your data and your customers.',
  seoTitle: 'Trust & Security | VavenCloud',
  seoDescription:
    'How VavenCloud protects your access, your data and your customers: your accounts stay yours, named engineers only, encryption, backups and incident response.',
  sections: [
    {
      heading: 'Your accounts stay yours',
      blocks: [
        {
          list: [
            'Your cloud accounts, domains, code repositories and data stay in your name. We never move them into ours.',
            'We work through access you grant and can withdraw at any time, using roles limited to what the work needs.',
            'When you leave, we return or rotate every credential, hand over documentation and a full backup, and confirm in writing that our access is removed.',
          ],
        },
      ],
    },
    {
      heading: 'Who can access your systems',
      blocks: [
        {
          list: [
            '**Named engineers only.** Access goes to the engineers assigned to your account, not to the whole company.',
            '**Least privilege.** Each person gets only the permissions their work needs, and access is reviewed every quarter.',
            '**Multi-factor authentication** on every account we use, ours and yours.',
            '**Secrets stay secret.** Credentials live in an encrypted secrets manager, never in email, chat or code.',
            '**Every action is logged.** Changes in your environment are traceable to a named person.',
            '**Offboarding the same day.** When someone leaves our team or your account, their access is removed that day.',
          ],
        },
      ],
    },
    {
      heading: 'How we protect data',
      blocks: [
        {
          list: [
            'Encrypted in transit with TLS and encrypted at rest.',
            'Personal data inside your product is used only to run your product. Never for our own purposes, never sold, never used to train AI models.',
            'We sign a Data Processing Agreement on request. Our Privacy Policy has the full detail.',
          ],
        },
      ],
    },
    {
      heading: 'Infrastructure security',
      blocks: [
        '**On your cloud:** we apply your provider’s security best practice: private networks, firewall rules, hardened server images, patching on a fixed schedule, and logging switched on and kept.',
        '**On VavenCloud:** our infrastructure runs in [DATA CENTRES]. Each client’s environment is isolated, protected by firewalls and filtering against denial-of-service attacks, and patched on a fixed schedule.',
      ],
    },
    {
      heading: 'Safe changes',
      blocks: [
        {
          list: [
            'Changes go through a build and release pipeline, with automated checks, a staging environment and one-step rollback where your product supports it.',
            'Fixes in your code are reviewed before release.',
            'Dependencies and server packages are kept up to date, and critical security patches are applied as a priority.',
          ],
        },
      ],
    },
    {
      heading: 'Backups and recovery',
      blocks: [
        'Automated backups on the schedule your plan sets, stored separately from your production systems. We test restores on that schedule too and report the result, because a backup you have not restored is only a hope.',
      ],
    },
    {
      heading: 'When something goes wrong',
      blocks: [
        {
          list: [
            'Engineers on call 24/7, with response times set in our SLA.',
            'One engineer owns each incident from first alert to fix.',
            'A plain-English incident report after every incident: what broke, why, what we changed, and what stops it happening again.',
            'If a security incident affects your data, we tell you within 72 hours of becoming aware of it, and usually much sooner.',
          ],
        },
      ],
    },
    {
      heading: 'Our people',
      blocks: [
        'Everyone on our team signs a confidentiality agreement before they get access to client systems, and completes security training when they join and every year after. Our engineers work from secured, managed devices.',
      ],
    },
    {
      heading: 'Compliance',
      blocks: [
        'We follow the data protection laws that apply to our clients, including the GDPR, the UK GDPR, US state privacy laws such as the CCPA, and India’s Digital Personal Data Protection Act, 2023. [CERTIFICATIONS STATUS]',
      ],
    },
    {
      heading: 'Sub-processors',
      blocks: [
        'The third parties that may handle client data on our behalf: [SUB-PROCESSORS]. We notify clients at least 30 days before adding a new sub-processor.',
      ],
    },
    {
      heading: 'Report a vulnerability',
      blocks: [
        'If you find a security issue in our website, client portal, dashboard or infrastructure, email security@vavencloud.com. We acknowledge reports within 1 business day and keep you updated until it is fixed. Please give us reasonable time to fix it before sharing it publicly, and do not access or change other people’s data while testing. We will not take legal action against good-faith research that follows these rules.',
      ],
    },
    {
      heading: 'Questions',
      blocks: [
        'Security questionnaires, DPA requests and anything else: security@vavencloud.com. We are happy to walk your team through how we will protect your product during your free review.',
      ],
    },
  ],
}
