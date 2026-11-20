export const SERVICE_LEVEL_AGREEMENT = {
  title: 'Service Level Agreement (SLA)',
  subtitle: 'Uptime commitments, service credits, and support response times',
  effectiveDate: 'July 2, 2026',
  seoTitle: 'Service Level Agreement (SLA) | VavenCloud',
  seoDescription:
    "Review VavenCloud's Service Level Agreement (SLA) outlining our 99.9% - 99.99% monthly uptime targets, support response times, service credits, and maintenance policies.",
  sections: [
    {
      heading: '1. Purpose & Scope',
      body: [
        "This Service Level Agreement (“SLA”) describes VavenCloud's uptime commitments, service credit remedies, and support response-time targets for each Service and plan tier. It is incorporated by reference into the VavenCloud Terms & Conditions and applies only to paid, generally-available Services (not beta or trial resources, unless stated otherwise).",
      ],
    },
    {
      heading: '2. Definitions',
      list: [
        "“Downtime” means the total minutes in a calendar month during which a Service is unreachable or fails to respond, as measured by VavenCloud's monitoring systems, excluding Scheduled Maintenance and events described in Section 6 (Exclusions).",
        '“Scheduled Maintenance” means planned maintenance windows announced at least 24 hours in advance via the dashboard and/or status page.',
        "“Service Credit” means a percentage of the affected Service's monthly fee, applied as account credit toward a future invoice.",
        '“Monthly Uptime Percentage” means ((total minutes in the month − Downtime minutes) ÷ total minutes in the month) × 100.',
      ],
    },
    {
      heading: '3. Uptime Commitments by Service',
      body: ['VavenCloud targets the following Monthly Uptime Percentages:'],
      table: {
        headers: ['Service', 'Plan / Tier', 'Monthly Uptime Target'],
        rows: [
          ['Cloud Servers', 'All tiers', '99.9%'],
          ['Load Balancer', 'Basic', '99.9%'],
          ['Load Balancer', 'High Availability (HA)', '99.95%'],
          ['Load Balancer', 'Enterprise', '99.99%'],
          ['Managed Databases', 'All engines', '99.9%'],
          ['Web Hosting', 'All plans', '99.9%'],
          ['Networking (VPC / Firewall)', 'All tiers', '99.9%'],
        ],
      },
    },
    {
      heading: '4. Support Response Time Commitments',
      body: ['Initial response time targets, measured from ticket submission:'],
      table: {
        headers: ['Support Plan', 'Critical Issues', 'Standard Issues'],
        rows: [
          ['Basic Support', '24 hours', '48 hours'],
          ['Standard Support', '12 hours', '24 hours'],
          ['Premium / Enterprise Support', '1 hour', '12 hours'],
        ],
      },
    },
    {
      heading: '5. Service Credits',
      body: [
        'If the Monthly Uptime Percentage for a Service falls below its target in Section 3, the affected customer may claim a Service Credit as follows:',
      ],
      table: {
        headers: ['Monthly Uptime Percentage', 'Service Credit'],
        rows: [
          ['Below target, but ≥ 99.0%', '5% of monthly fee for the affected Service'],
          ['< 99.0%, but ≥ 95.0%', '10% of monthly fee for the affected Service'],
          ['< 95.0%', '25% of monthly fee for the affected Service'],
        ],
      },
      list: [
        'Service Credits are the sole and exclusive remedy for any failure to meet the uptime commitments in this SLA.',
        "Total Service Credits in any billing month will not exceed 100% of that month's fee for the affected Service.",
        'Service Credits are issued as account credit and are not redeemable for cash.',
      ],
    },
    {
      heading: '6. Exclusions from This SLA',
      body: [
        'The following are excluded from Downtime calculations and do not entitle the customer to a Service Credit:',
      ],
      list: [
        'Scheduled Maintenance, announced in accordance with Section 2.',
        "Factors outside VavenCloud's reasonable control, including force majeure events, upstream internet backbone failures, or attacks against the customer's own resources (e.g., a DDoS attack targeting the customer's application).",
        "Issues caused by the customer's own configuration, code, third-party integrations, or failure to follow VavenCloud's documented best practices.",
        'Suspension of Service due to a violation of the Acceptable Use Policy or non-payment.',
        'Beta, preview, or trial features explicitly marked as not covered by this SLA.',
      ],
    },
    {
      heading: '7. How to Claim a Service Credit',
      list: [
        'Submit a claim via a support ticket within 30 days of the incident, including the affected resource ID(s) and the dates/times of the outage.',
        'VavenCloud will verify the claim against internal monitoring data and respond within 5 business days.',
        "Approved credits will be applied to the customer's next invoice.",
      ],
    },
    {
      heading: '8. Scheduled Maintenance',
      body: [
        'VavenCloud performs periodic maintenance to patch, upgrade, or otherwise maintain the Services. Where feasible, maintenance affecting HA and Enterprise Load Balancer tiers will be performed in a rolling fashion to avoid customer-visible downtime. Emergency maintenance required to address an active security threat may be performed with shorter or no advance notice.',
      ],
    },
    {
      heading: '9. Limitations',
      body: [
        "This SLA does not apply to any Service while it is suspended or terminated in accordance with the Terms & Conditions or Acceptable Use Policy. VavenCloud's total liability under this SLA in any billing month is limited to the Service Credits described in Section 5, and does not include any other form of compensation, refund, or damages.",
      ],
    },
    {
      heading: '10. Changes to This SLA',
      body: [
        'We may update this SLA from time to time, including to reflect new Services, plan tiers, or infrastructure improvements. Material reductions in committed uptime or support response times will be communicated at least 30 days before taking effect.',
      ],
    },
  ],
} as const
