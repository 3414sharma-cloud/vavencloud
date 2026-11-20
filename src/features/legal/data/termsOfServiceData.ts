import type { LegalPage } from '../legal.types.ts'

/** Terms of Service, from "VavenCloud Legal Pages v1" */
export const TERMS_OF_SERVICE: LegalPage = {
  title: 'Terms of Service',
  lastUpdated: '[EFFECTIVE DATE]',
  intro:
    'These terms explain what VavenCloud does for you, what you do for us, and how either of us can change or end the arrangement. We have written them in plain English. If something is unclear, ask us before you sign up: legal@vavencloud.com.',
  seoTitle: 'Terms of Service | VavenCloud',
  seoDescription:
    'What VavenCloud does for you, what you do for us, and how either of us can change or end the arrangement, in plain English.',
  sections: [
    {
      heading: '1. Who we are',
      blocks: [
        'VavenCloud is a brand of Vavensoft Private Limited, a company registered in India, with its office at La Daftar, D 178, Phase 8B, Industrial Area, Sector 74, Sahibzada Ajit Singh Nagar, Punjab 140308, India (“VavenCloud”, “we”, “us”).',
        'These terms apply when you use our website, the client portal, the VavenCloud dashboard or any of our services (“you” means the business signing up and the people it authorises).',
      ],
    },
    {
      heading: '2. What makes up our agreement',
      blocks: [
        'Our agreement with you is made of these documents:',
        {
          ordered: true,
          list: [
            'Your order form or plan confirmation, which sets out your plan, fee, scope and start date.',
            'These Terms of Service.',
            'The Service Level Agreement (SLA).',
            'The Acceptable Use Policy.',
            'The Privacy Policy, and a Data Processing Agreement if you ask for one.',
          ],
        },
        'If two documents disagree, the one higher in this list wins.',
      ],
    },
    {
      heading: '3. What we do',
      blocks: [
        'We take ownership of running your product in production. Depending on your plan, that covers:',
        {
          list: [
            '**Infrastructure:** servers, databases, networks, backups, security patching and hardening.',
            '**Deployments:** build and release pipelines, staging and rollback.',
            '**Monitoring and incident response:** alerts set up for you, engineers on call 24/7, and a plain-English report after every incident.',
            '**Fixes in your code:** bugs and failed releases in your existing application, fixed by Vavensoft developers within your plan.',
            '**Cost and scaling:** right-sizing, load balancing and planning ahead of growth.',
          ],
        },
        'We deliver this in one of two ways, and your order form says which:',
        {
          list: [
            '**On your cloud.** Your product stays in your own AWS, Azure, Google Cloud or other account. The account stays in your name and your provider bills you directly.',
            '**On VavenCloud.** Your product runs on infrastructure we operate, and we bill you for it as set out in your order form.',
          ],
        },
      ],
    },
    {
      heading: '4. How we start',
      blocks: [
        '**Free production review.** A 30-minute call with a senior engineer, followed by a written roadmap within 48 hours. It is free, it creates no obligation, and the roadmap is yours to keep whether or not you work with us.',
        '**Handover.** Once you choose a plan, handover usually takes 1 to 2 weeks. We take access, document how your product runs, fix urgent risks and set up monitoring and backups. Your existing setup keeps running throughout.',
        '**Covered date.** Our SLA commitments start on the date we confirm in writing that handover is complete. Before that date we work on a best-effort basis, and we tell you about any risk we find straight away.',
      ],
    },
    {
      heading: '5. Plans and fees',
      blocks: [
        {
          list: [
            '**Essential** starts at $100 a month and covers [ESSENTIAL PLAN SCOPE].',
            '**Managed** and **Partner** are a fixed monthly fee agreed after your free review and set out in your order form.',
          ],
        },
        'Fees are billed monthly in advance and due within [PAYMENT TERMS]. Prices are in US dollars and exclude taxes, which are added where the law requires.',
        '**Cloud costs.** On your cloud, your provider bills you directly and those costs are separate from our fee. On VavenCloud, infrastructure is billed as set out in your order form. We never add resources that raise your bill without telling you first, except for a short-term change needed to keep your product online during an incident, which we report and reverse once it is no longer needed.',
        '**Late payment.** If an invoice is more than 15 days overdue, we will remind you in writing. If it stays unpaid 15 days after that reminder, we may pause non-urgent work. We keep monitoring and incident response running for a further 15 days before any suspension, and we never delete your data because of a late payment.',
      ],
    },
    {
      heading: '6. Fixes in your code',
      blocks: [
        'Managed and Partner plans include [CODE-FIX HOURS] of code fixes each month. On Essential, code fixes are quoted when needed.',
        '**Included in plan hours:** bugs in existing features, failed deployments, slow pages, security patches and dependency updates, and small configuration and copy changes.',
        '**Quoted first:** new features and screens, large rebuilds, moving to a new framework, building integrations with new third-party systems, and any single piece of work over a week.',
        'We never bill for work outside your plan without your written approval. Unused plan hours do not carry over to the next month.',
      ],
    },
    {
      heading: '7. What we need from you',
      blocks: [
        {
          list: [
            'Accurate information about your product, and the access we need to run it, shared through a secure channel.',
            'One named contact who can make decisions, and a backup contact for out-of-hours incidents.',
            'Valid licences for any third-party software you ask us to run.',
            'Advance notice before your own team makes significant changes to production.',
            'Content and use of the service that follow our Acceptable Use Policy and the law.',
          ],
        },
        'If an incident is caused by a change we were not told about, or by something we cannot access, we still work to fix it, but it does not count against our SLA.',
      ],
    },
    {
      heading: '8. How we act in your accounts',
      blocks: [
        'We act only within the scope you agree. Access is given to named engineers, limited to what the work needs, and logged. Production changes go through your pipeline and staging environment where they exist. During an incident we may make emergency changes to restore service; every one is listed in the incident report.',
      ],
    },
    {
      heading: '9. Who owns what',
      blocks: [
        '**Yours:** your code, your data, your accounts, your domains and your cloud resources. They stay yours at all times, including after you leave.',
        '**Made for you:** configuration, infrastructure code, runbooks and documentation we create specifically for your product become yours once the related fees are paid.',
        '**Ours:** our own tools, scripts, templates, the client portal and the VavenCloud dashboard. You may use them while you are a client; they remain ours.',
      ],
    },
    {
      heading: '10. Confidentiality',
      blocks: [
        'Each of us keeps the other’s confidential information private, uses it only to deliver or receive the services, and shares it only with people who need it and are bound by the same duty. This continues for 3 years after our agreement ends, and indefinitely for credentials, source code and personal data. A separate NDA is available on request.',
      ],
    },
    {
      heading: '11. Personal data',
      blocks: [
        'When we handle personal data inside your product, we act only on your instructions, as your processor. Our Privacy Policy explains how we handle personal data, and we sign a Data Processing Agreement on request.',
      ],
    },
    {
      heading: '12. Changing plans and leaving',
      blocks: [
        '**Change plan:** move up or down at any time. The change takes effect from your next billing month.',
        '**Leave:** give us [NOTICE PERIOD] written notice. There is no exit fee.',
        'When you leave, we hand over: your documentation, runbooks, all access returned or rotated, and a full backup. On VavenCloud, we help you move to the provider of your choice. We keep your data for [EXIT RETENTION] after the end date so nothing is lost in the move, then delete it securely and confirm in writing.',
      ],
    },
    {
      heading: '13. Suspension',
      blocks: [
        'We may suspend part of the service only to stop a breach of the Acceptable Use Policy, to contain a security threat, or for non-payment as described in section 5. We suspend only what is necessary, tell you first unless it is an emergency, and restore service as soon as the reason is resolved.',
      ],
    },
    {
      heading: '14. Our commitment and its limits',
      blocks: [
        'We will deliver the services with reasonable skill and care, using qualified engineers, and meet the commitments in our SLA.',
        'No one can promise that software never fails. We do not guarantee that your product will be free of incidents. Outages caused by your cloud provider, third-party services, your own team’s changes or work outside your plan are handled on a best-effort basis and are not a breach of these terms. Apart from what these terms say, we give no other warranties, to the extent the law allows.',
      ],
    },
    {
      heading: '15. Liability',
      blocks: [
        'Each party’s total liability under this agreement is limited to [LIABILITY CAP]. Neither party is liable for indirect or consequential losses, such as lost profits, lost revenue or lost goodwill.',
        'These limits do not apply to fees you owe, to breaches of confidentiality, to fraud, or to anything else that cannot be limited by law.',
      ],
    },
    {
      heading: '16. Indemnities',
      blocks: [
        'You protect us against claims caused by your content or by use of the service that breaks our Acceptable Use Policy. We protect you against claims that our own tools infringe someone else’s intellectual property.',
      ],
    },
    {
      heading: '17. Events beyond our control',
      blocks: [
        'Neither party is responsible for failures caused by events outside reasonable control, such as natural disasters, wide-scale internet or power failures, or government action. We still do everything we reasonably can to keep your product running and to keep you informed.',
      ],
    },
    {
      heading: '18. Changes to these terms',
      blocks: [
        'We will give you at least 30 days’ notice by email of any change that materially affects you. If you do not accept the change, you can leave before it takes effect, with no exit fee.',
      ],
    },
    {
      heading: '19. Disputes',
      blocks: [
        'If something goes wrong, tell us first. A founder will respond within 5 business days, and we aim to resolve it within 30 days. If we cannot, these terms are governed by [GOVERNING LAW].',
      ],
    },
    {
      heading: '20. Contact',
      blocks: ['Vavensoft Private Limited (VavenCloud) · legal@vavencloud.com · sales@vavencloud.com'],
    },
  ],
}
