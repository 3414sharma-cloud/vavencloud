import type { LegalPage } from '../legal.types.ts'

/** Service Level Agreement, from "VavenCloud Legal Pages v1" */
export const SERVICE_LEVEL_AGREEMENT: LegalPage = {
  title: 'Service Level Agreement',
  lastUpdated: '[EFFECTIVE DATE]',
  intro:
    'This SLA turns “one call, one team, we own the fix” into commitments you can hold us to: how fast we respond, how we keep you updated, what you get after every incident, and what we give back if we fall short.',
  seoTitle: 'Service Level Agreement (SLA) | VavenCloud',
  seoDescription:
    'How fast VavenCloud responds, how we keep you updated, what you get after every incident, and the service credits if we fall short.',
  sections: [
    {
      heading: '1. When it applies',
      blocks: [
        'This SLA applies from your covered date, the day we confirm in writing that handover is complete. Your plan sets your response times. Your order form can improve on this SLA, but never weaken it.',
      ],
    },
    {
      heading: '2. How to reach us',
      blocks: [
        {
          list: [
            '**Critical incidents, 24/7:** [EMERGENCY PHONE], or the urgent channel in your client portal.',
            '**Everything else:** your client portal, shared chat channel, or support@vavencloud.com.',
          ],
        },
        'We also watch your product ourselves. Most incidents reach us through our monitoring before anyone has to call.',
      ],
    },
    {
      heading: '3. Severity levels and response times',
      blocks: [
        'Response time means a named engineer has acknowledged the issue and started work on it. It is measured from your report or our alert, whichever comes first.',
        {
          table: {
            headers: ['Severity', 'What it means', 'Essential', 'Managed', 'Partner'],
            rows: [
              [
                '**1 · Critical**',
                'Product down, payments or checkout failing, data at risk, or an active security incident',
                '[ESSENTIAL RESPONSE TIME], 24/7',
                '[MANAGED RESPONSE TIME], 24/7',
                '[PARTNER RESPONSE TIME], 24/7',
              ],
              [
                '**2 · High**',
                'A major feature broken or badly slowed for many users',
                '[ESSENTIAL SEV-2 TIME]',
                '[MANAGED SEV-2 TIME]',
                '[PARTNER SEV-2 TIME]',
              ],
              [
                '**3 · Normal**',
                'A bug or performance issue with a workaround',
                '1 business day',
                '1 business day',
                '1 business day',
              ],
              [
                '**4 · Request**',
                'A change, question or planned task',
                '2 business days',
                '2 business days',
                '1 business day',
              ],
            ],
          },
        },
        'Business days are Monday to Friday, excluding public holidays in India, unless your order form sets your own time zone.',
      ],
    },
    {
      heading: '4. While we work on it',
      blocks: [
        {
          list: [
            '**Updates:** for a critical incident, every 30 minutes until service is restored; for high, every 2 hours.',
            '**One owner:** the engineer who picks it up owns it until it is fixed, including any fix in your code. You never have to relay messages between vendors.',
            '**Escalation:** if a critical incident is not restored within 2 hours, a senior engineer joins; after 4 hours, a founder is informed.',
          ],
        },
      ],
    },
    {
      heading: '5. After every incident',
      blocks: [
        'You receive a plain-English incident report, usually by the next morning and always within 1 business day of the fix. It covers what broke, why, what we changed and what we did to stop it happening again.',
        'Every month you also receive a report covering uptime, incidents, changes made, cloud costs and what we recommend next.',
      ],
    },
    {
      heading: '6. Uptime on VavenCloud infrastructure',
      blocks: [
        'When your product runs on VavenCloud infrastructure, we commit to [UPTIME TARGET] monthly uptime for the servers, network and storage we operate.',
        'Uptime is measured by our external monitoring each minute. A minute counts as down when your service cannot be reached because of infrastructure we operate.',
        'On your own cloud, the underlying hardware and network belong to your provider, so we do not promise an uptime percentage for them. We do commit to the response times, updates, reports and fixes in this SLA, and we work your provider’s support on your behalf.',
      ],
    },
    {
      heading: '7. Service credits',
      blocks: [
        'If we miss a commitment, you receive a credit against your next invoice.',
        {
          table: {
            headers: ['What we missed', 'Credit on that month’s fee'],
            rows: [
              ['Monthly uptime on VavenCloud below [UPTIME TARGET]', '10%'],
              ['Monthly uptime on VavenCloud below 99.0%', '25%'],
              ['Monthly uptime on VavenCloud below 95.0%', '50%'],
              ['A critical response time missed', '10% for each miss'],
              ['The incident report not sent within 1 business day', '5% for each miss'],
            ],
          },
        },
        'Credits for one month are capped at 50% of that month’s fee. To claim, email support@vavencloud.com within 30 days of the end of the month. We confirm within 5 business days. If we miss the same commitment three months running, you may also end your plan without notice and without an exit fee.',
        'Credits are your sole financial remedy for missing this SLA. They do not limit your right to end the agreement under our Terms of Service.',
      ],
    },
    {
      heading: '8. Maintenance',
      blocks: [
        '**Planned maintenance:** we tell you at least 48 hours ahead and do it in your lowest-traffic window. It does not count as downtime if we gave notice.',
        '**Urgent security patches:** we may apply them with shorter notice to protect your product. We tell you as soon as we can and list them in the monthly report.',
      ],
    },
    {
      heading: '9. Backups',
      blocks: [
        'We take automated backups on the schedule set in your order form, with a default of [BACKUP SCHEDULE]. We test a restore at least once a quarter and include the result in your monthly report.',
      ],
    },
    {
      heading: '10. What this SLA does not cover',
      blocks: [
        'We still help in these cases, but they do not count against our commitments or earn credits:',
        {
          list: [
            'outages of your cloud provider or other third-party services outside our control;',
            'changes made by your team or another vendor without telling us;',
            'issues from work outside your plan, or that you asked us not to fix;',
            'your request to delay a fix, or missing access we asked for and did not receive;',
            'suspension under our Acceptable Use Policy or Terms of Service;',
            'attacks beyond reasonable protection, and events beyond our control as described in our Terms of Service;',
            'the period before your covered date.',
          ],
        },
      ],
    },
  ],
}
