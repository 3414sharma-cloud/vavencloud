export interface Faq {
  q: string
  a: string
}

export const faqs: Faq[] = [
  {
    q: 'What is VavenCloud?',
    a: 'VavenCloud is a hosting and cloud services provider. We offer web hosting, scalable cloud servers, CDN, backups and storage, and professional email, all on one platform.',
  },
  {
    q: 'What makes VavenCloud different from other hosting providers?',
    a: 'Fast NVMe infrastructure across global data centers, a 99.99% uptime SLA, and real cloud engineers available 24/7 who can manage and scale your servers for you.',
  },
  {
    q: 'What is the difference between web hosting and cloud servers?',
    a: 'Web hosting is a ready-to-go environment for websites and WordPress. Cloud servers give you dedicated, scalable resources with full root access for apps, databases and custom workloads.',
  },
  {
    q: 'Can I migrate my existing website to VavenCloud?',
    a: 'Absolutely. Our team handles migrations for free with zero downtime, including files, databases and email accounts.',
  },
  {
    q: 'What uptime do you guarantee?',
    a: 'We back our hosting with a 99.99% uptime SLA, monitored around the clock across redundant infrastructure.',
  },
  {
    q: 'What kind of support is available?',
    a: 'Our experts are available 24/7 via live chat, email and phone. Managed cloud plans also include proactive monitoring, patching and scaling assistance.',
  },
]
