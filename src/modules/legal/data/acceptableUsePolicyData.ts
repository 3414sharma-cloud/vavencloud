export const ACCEPTABLE_USE_POLICY = {
  title: 'Acceptable Use Policy',
  subtitle: 'Rules governing what may and may not be hosted or run on VavenCloud',
  effectiveDate: 'July 2, 2026',
  seoTitle: 'Acceptable Use Policy (AUP) | VavenCloud',
  seoDescription:
    "Read VavenCloud's Acceptable Use Policy (AUP) detailing prohibited content, security rules, anti-spam policies, resource fair-use guidelines, and abuse reporting procedures.",
  sections: [
    {
      heading: '1. Purpose & Scope',
      body: [
        "This Acceptable Use Policy (“AUP”) describes the activities and content that are prohibited on VavenCloud's Cloud Servers, Load Balancers, Managed Databases, Web Hosting, Domains & Email, and any other Service. It is incorporated by reference into, and forms part of, the VavenCloud Terms & Conditions. It applies to you, your users, and anyone you permit to access your account or resources.",
      ],
    },
    {
      heading: '2. Prohibited Content',
      body: ['You may not use the Services to store, host, publish, or transmit:'],
      list: [
        'Child sexual abuse material (CSAM), or any content sexualizing minors.',
        'Content that infringes copyright, trademark, patent, or other intellectual property rights.',
        'Malware, ransomware, spyware, or other malicious code, including command-and-control infrastructure.',
        'Phishing pages, fraudulent websites, or content designed to deceive or steal credentials/financial information.',
        'Content promoting or facilitating terrorism, extremist violence, or human trafficking.',
        'Defamatory, harassing, or unlawfully discriminatory content directed at individuals or groups.',
        'Any content that is illegal under the laws applicable to you, VavenCloud, or the datacenter jurisdiction hosting it.',
      ],
    },
    {
      heading: '3. Prohibited Activities & Security Violations',
      body: ['You may not use the Services to:'],
      list: [
        'Launch, participate in, or facilitate Denial-of-Service (DoS/DDoS) attacks.',
        'Conduct unauthorized port scanning, vulnerability scanning, or penetration testing against systems you do not own or lack written authorization to test.',
        'Attempt to gain unauthorized access to any account, system, or network, whether belonging to VavenCloud, another customer, or a third party.',
        'Intercept, monitor, or tamper with network traffic not addressed to you.',
        'Operate open proxies, open mail relays, or Tor exit nodes without prior written approval from VavenCloud.',
        "Engage in cryptocurrency mining or other resource-intensive activity that violates your plan's fair-use limits (Section 4) without an appropriate plan upgrade.",
        'Circumvent or disable any security, metering, or access-control mechanism of the Services.',
      ],
    },
    {
      heading: '4. Resource Usage & Fair Use',
      body: [],
      list: [
        'Each plan tier includes defined compute, storage, and bandwidth allowances as described on the pricing page; usage beyond these allowances is billed at the applicable overage rate or may be throttled.',
        'Sustained CPU, memory, disk I/O, or network usage that materially degrades the experience of other customers sharing the same physical infrastructure may result in throttling, migration to a different plan, or a request to upgrade.',
        'Automated scripts, bots, or crawlers must respect reasonable rate limits and must not be used to circumvent fair-use restrictions.',
      ],
    },
    {
      heading: '5. Anti-Spam & Email Policy',
      body: [],
      list: [
        'You may not send unsolicited bulk email (“spam”) from any Service, including Web Hosting-provided mailboxes.',
        "All commercial email must include a functional unsubscribe/opt-out mechanism and comply with applicable anti-spam law (e.g., CAN-SPAM, India's IT Act provisions, GDPR-linked ePrivacy rules where relevant).",
        'You must maintain reasonable list-hygiene practices; a sustained high complaint or bounce rate may result in mail-sending suspension pending review.',
      ],
    },
    {
      heading: '6. Copyright & Trademark Compliance',
      body: [
        'VavenCloud responds to valid copyright and trademark infringement notices in accordance with the DMCA (or equivalent local law) process described in the Terms & Conditions. Repeat infringers are subject to account termination.',
      ],
    },
    {
      heading: '7. Monitoring & Investigation',
      body: [
        'VavenCloud does not proactively monitor the content of customer servers, databases, or mailboxes. We may investigate a specific resource in response to a credible abuse report, a security incident affecting the platform, or a valid legal request, and may take action described in Section 9 as a result.',
      ],
    },
    {
      heading: '8. Reporting Abuse',
      body: [
        'Suspected violations of this AUP — including spam, malware, phishing, or DDoS activity originating from VavenCloud IP space — can be reported to abuse@vavencloud.com. Reports should include the IP address or domain involved, timestamps, and supporting evidence (headers, logs, screenshots) where available.',
      ],
      contact: {
        email: 'abuse@vavencloud.com',
      },
    },
    {
      heading: '9. Consequences of Violation',
      body: ['Depending on severity, a violation of this AUP may result in:'],
      list: [
        'A warning and request to remediate within a defined period.',
        'Temporary suspension of the specific affected resource (e.g., one VM, one mailbox) rather than the full account, where feasible.',
        'Full account suspension for severe, repeated, or platform-threatening violations.',
        'Immediate suspension without prior notice where necessary to protect the security of the platform or other customers (e.g., active DDoS, actively spreading malware).',
        'Permanent termination and, where legally required, referral to law enforcement.',
      ],
      bodyAfter: [
        'Where feasible, VavenCloud will notify the customer of the action taken and the reason, and provide an opportunity to appeal via a support ticket.',
      ],
    },
    {
      heading: '10. Changes to This Policy',
      body: [
        'We may update this AUP from time to time to address new categories of abuse or platform risk. Material changes will be communicated via email or dashboard notice. Continued use of the Services after changes take effect constitutes acceptance.',
      ],
    },
  ],
} as const
