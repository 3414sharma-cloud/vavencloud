export const TERMS_OF_SERVICE = {
  title: 'Terms & Conditions',
  subtitle: "Governing the use of VavenCloud's platform and services",
  effectiveDate: 'July 2, 2026',
  seoTitle: 'Terms & Conditions | VavenCloud',
  seoDescription:
    "Read VavenCloud's Terms & Conditions governing access to our cloud servers, databases, web hosting, network infrastructure, billing, and platform services.",
  sections: [
    {
      heading: '1. Introduction & Acceptance',
      body: [
        'These Terms & Conditions ("Terms") form a binding agreement between you ("Customer," "you") and VavenCloud, Powered by Vavensoft ("VavenCloud," "we," "us"), governing your access to and use of the VavenCloud dashboard, APIs, and all services described below (collectively, the "Services").',
        'By creating an account, provisioning any Service, or clicking "I Agree," you confirm that you have read, understood, and accepted these Terms in full. If you do not agree, you must not use the Services.',
        'These Terms apply worldwide to all customers, alongside any additional jurisdiction-specific terms referenced herein (e.g., data protection addenda).',
      ],
    },
    {
      heading: '2. Definitions',
      list: [
        '“Account” means the customer profile created on the VavenCloud dashboard.',
        '“Services” means Cloud Servers, Load Balancers, Managed Databases, Web Hosting, Domains & Email, Networking & Security features, and Billing tools, as described in Section 3.',
        '“Content” means any data, files, code, or material uploaded, stored, or transmitted by the Customer using the Services.',
        '“SLA” means the Service Level Agreement published separately, describing uptime commitments and remedies.',
        '“AUP” means the Acceptable Use Policy set out in Section 5 of these Terms.',
      ],
    },
    {
      heading: '3. Description of Services',
      body: ['VavenCloud provides self-service, on-demand cloud infrastructure, including:'],
      list: [
        'Cloud Servers (virtual private servers) with resizable compute, storage, and networking.',
        'Load Balancers across Basic, High Availability (HA), and Enterprise tiers, including optional SSL termination and Web Application Firewall (WAF).',
        'Managed Databases (MySQL, PostgreSQL, MongoDB, Redis) with automated backups and maintenance.',
        "Web Hosting (cPanel/WHM-based) for websites and email under a customer's domain.",
        'Domain registration, DNS management, and business email provisioning.',
        'Networking & Security tools, including private networking (VPC-style), firewall groups, and NAT.',
        'Self-service billing, invoicing, and subscription management.',
      ],
      bodyAfter: [
        'VavenCloud reserves the right to modify, add, or discontinue features of the Services with reasonable prior notice, except where changes are required urgently for security or legal reasons.',
      ],
    },
    {
      heading: '4. Eligibility & Account Registration',
      list: [
        'You must be at least 18 years old, or the age of legal majority in your jurisdiction, to create an Account.',
        'You must provide accurate, current, and complete registration and billing information, and keep it up to date.',
        'You are responsible for maintaining the confidentiality of your Account credentials and for all activity under your Account.',
        'VavenCloud may decline or terminate registrations that appear fraudulent, duplicate, or in violation of these Terms.',
      ],
    },
    {
      heading: '5. Acceptable Use Policy (AUP)',
      body: [
        'You agree not to use the Services, and not to permit any third party to use the Services, to:',
      ],
      list: [
        'Send unsolicited bulk email (“spam”) or engage in email/phone/SMS abuse.',
        'Host, distribute, or transmit malware, ransomware, or other malicious code.',
        'Launch, participate in, or facilitate Denial-of-Service (DoS/DDoS) attacks against any system.',
        'Host content that infringes intellectual property rights, is defamatory, obscene, or unlawful in the relevant jurisdiction.',
        "Attempt unauthorized access to other customers' data, VavenCloud systems, or third-party networks.",
        'Engage in port scanning, network probing, or vulnerability exploitation without authorization.',
        'Use the Services in violation of applicable export control, sanctions, or anti-money-laundering laws.',
        "Resell or sublicense the Services in violation of your plan's terms without prior written consent.",
      ],
      bodyAfter: [
        'Violation of this AUP may result in immediate suspension of the affected resource, pending investigation, without prior notice where necessary to protect the platform or other customers, followed by notice and an opportunity to remediate where appropriate.',
      ],
    },
    {
      heading: '6. Billing, Payment & Refunds',
      list: [
        'Fees are billed in advance on a recurring basis (monthly or annually, as selected) via our third-party payment partners, Razorpay and Chargebee. VavenCloud does not store your full card details.',
        'Recurring subscriptions renew automatically until cancelled by you through the dashboard.',
        'Upgrades and downgrades are billed on a prorated basis for the remainder of the billing cycle.',
        "Failure to pay may result in service suspension after a grace period of 7 days' notice, and eventual data deletion after 30 additional days of continued non-payment.",
        'Refunds, where offered, are described in our separate Refund Policy; certain usage-based charges (bandwidth overage, backups already generated) are non-refundable.',
        "You are responsible for any taxes applicable to your purchase, except taxes on VavenCloud's net income.",
      ],
    },
    {
      heading: '7. Service Levels & Support',
      list: [
        'Uptime commitments, service credit remedies, and support response-time targets for each plan tier are set out in the SLA published at /sla, which is incorporated into these Terms by reference.',
        'Scheduled maintenance will be announced in advance via the dashboard and/or status page, and is excluded from downtime calculations.',
        'Support is provided via our ticketing system and customer support channels.',
      ],
    },
    {
      heading: '8. Customer Data & Content',
      list: [
        'You retain all ownership rights in your Content. VavenCloud claims no ownership over data, code, or files you upload.',
        'You grant VavenCloud a limited license to host, store, process, and transmit your Content solely to the extent necessary to provide the Services.',
        'You are solely responsible for ensuring you have the necessary rights and consents to store and process any data (including personal data of third parties) using the Services.',
        'You are responsible for configuring access controls, encryption, and security settings appropriate to the sensitivity of your Content.',
      ],
    },
    {
      heading: '9. Backups & Data Loss',
      list: [
        "Automated or on-demand backup options are available as described in each Service's documentation and are billed separately unless stated otherwise.",
        'VavenCloud is not liable for data loss resulting from Customer error, failure to configure backups, or use of unsupported configurations.',
        'Customers are strongly encouraged to maintain independent backups of critical data outside the platform.',
      ],
    },
    {
      heading: '10. Suspension & Termination',
      list: [
        'VavenCloud may suspend or terminate any Service immediately for violations of the AUP, non-payment, suspected fraud, legal or regulatory requirement, or risk to platform security.',
        'You may cancel any Service at any time through the dashboard; cancellation takes effect at the end of the current billing period unless otherwise stated.',
        'Upon termination, Customer data will be retained for 30 days to permit export, after which it may be permanently deleted.',
      ],
    },
    {
      heading: '11. Intellectual Property',
      body: [
        "The VavenCloud name, logo, dashboard software, and underlying platform are the property of VavenCloud, Powered by Vavensoft and are protected by applicable intellectual property laws. Nothing in these Terms grants you rights to VavenCloud's trademarks or proprietary software beyond the limited right to use the Services as intended.",
      ],
    },
    {
      heading: '12. Warranties & Disclaimers',
      body: [
        'Except as expressly stated in the SLA, the Services are provided “as is” and “as available,” without warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement, to the maximum extent permitted by applicable law.',
      ],
    },
    {
      heading: '13. Limitation of Liability',
      body: [
        "To the maximum extent permitted by law, VavenCloud's aggregate liability arising out of or relating to these Terms shall not exceed the amount paid by the Customer for the affected Service in the 12-month period preceding the claim. VavenCloud shall not be liable for indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunity, even if advised of the possibility of such damages.",
      ],
    },
    {
      heading: '14. Indemnification',
      body: [
        'You agree to indemnify and hold VavenCloud harmless from any claims, damages, liabilities, and expenses (including reasonable legal fees) arising from your Content, your violation of these Terms, or your violation of applicable law.',
      ],
    },
    {
      heading: '15. Copyright & DMCA Complaints',
      body: [
        'VavenCloud respects intellectual property rights and responds to valid notices of alleged infringement. Copyright complaints regarding content hosted on the Services should be submitted to our designated agent at legal@vavencloud.com, including all information required for a valid notice under applicable law (e.g., the DMCA in the United States).',
      ],
      contact: {
        email: 'legal@vavencloud.com',
      },
    },
    {
      heading: '16. Force Majeure',
      body: [
        'VavenCloud shall not be liable for any failure or delay in performance resulting from causes beyond its reasonable control, including natural disasters, war, terrorism, labor disputes, internet or power outages beyond our infrastructure, or governmental action.',
      ],
    },
    {
      heading: '17. Governing Law & Disputes',
      body: [
        'These Terms are governed by the laws of India, without regard to conflict-of-law principles. Any disputes shall be subject to the exclusive jurisdiction of the courts of Mohali, Punjab (S.A.S. Nagar), India.',
      ],
    },
    {
      heading: '18. Changes to These Terms',
      body: [
        'We may update these Terms from time to time. Material changes will be notified via email or dashboard notice at least 30 days before taking effect. Continued use of the Services after changes take effect constitutes acceptance.',
      ],
    },
    {
      heading: '19. Contact Information',
      body: [
        'Questions about these Terms may be directed to: legal@vavencloud.com — VavenCloud, Powered by Vavensoft, Mohali, Punjab, India.',
      ],
      contact: {
        email: 'legal@vavencloud.com',
        address: 'Mohali, Punjab, India',
      },
    },
  ],
} as const
