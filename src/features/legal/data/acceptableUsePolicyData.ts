import type { LegalPage } from '../legal.types.ts'

/** Acceptable Use Policy, from "VavenCloud Legal Pages v1" */
export const ACCEPTABLE_USE_POLICY: LegalPage = {
  title: 'Acceptable Use Policy',
  lastUpdated: '[EFFECTIVE DATE]',
  intro:
    'We take responsibility for running your product, so we need to know it is used lawfully. This policy sets out what we will not run or support, and what happens if something goes wrong.',
  seoTitle: 'Acceptable Use Policy | VavenCloud',
  seoDescription:
    'What VavenCloud will not run or support, what needs our approval first, and what happens if something goes wrong.',
  sections: [
    {
      heading: '1. Who this applies to',
      blocks: [
        'This policy applies to every client, and to anyone who uses a product we run.',
        {
          list: [
            '**On VavenCloud infrastructure:** this policy applies in full.',
            '**On your own cloud:** your cloud provider’s acceptable use policy also applies. We will not build, deploy or operate anything this policy prohibits, wherever it runs.',
          ],
        },
      ],
    },
    {
      heading: '2. Not allowed',
      blocks: [
        'You may not use our services, or a product we run, to:',
        {
          list: [
            '**Break the law:** host, sell or promote anything illegal where you or your users operate, or help others do so.',
            '**Harm children:** any content that sexualises or exploits minors. We report it to the authorities straight away and end the service.',
            '**Spread malware:** host or send viruses, ransomware, spyware or phishing pages, or run command-and-control servers.',
            '**Attack others:** run denial-of-service attacks, scan or probe systems you do not own, or try to break into accounts or networks.',
            '**Send spam:** send unsolicited bulk email or messages, or use mailing lists bought or collected without consent.',
            '**Infringe rights:** host or share content that infringes copyright, trademarks or other people’s intellectual property.',
            '**Misuse personal data:** collect, sell or process personal data without a lawful basis, or scrape data in breach of a site’s terms.',
            '**Deceive or harass:** impersonate people or organisations, publish fraudulent offers, or harass, threaten or defame anyone.',
            '**Break sanctions:** serve anyone, or any country, under trade sanctions that apply to us or to you.',
          ],
        },
      ],
    },
    {
      heading: '3. Needs our written approval first',
      blocks: [
        'Some uses are legitimate but carry extra risk. Ask us before you start:',
        {
          list: [
            'cryptocurrency mining or other sustained, high-load computing on VavenCloud infrastructure;',
            'running open proxies, VPN services or Tor exit nodes;',
            'bulk email above 10,000 messages a day;',
            'penetration testing or load testing of VavenCloud infrastructure, or of anything we run for you.',
          ],
        },
      ],
    },
    {
      heading: '4. Fair use of shared resources',
      blocks: [
        'On VavenCloud, servers and networks are sized to your plan. If your use starts to affect other clients, we will contact you to agree a fix, such as moving to a larger plan or a dedicated server. We only throttle without notice to stop an immediate impact on other clients.',
      ],
    },
    {
      heading: '5. What we do about a breach',
      blocks: [
        'We respond in proportion to the problem:',
        {
          ordered: true,
          list: [
            '**We tell you** what we have found and agree a fix and a deadline.',
            '**We contain it** by limiting only the affected part if the fix is not made, or if there is a risk to other people.',
            '**We suspend** that part of the service if the problem continues or is serious.',
            '**We end the service** only for serious or repeated breaches, as set out in our Terms of Service.',
          ],
        },
        'We may skip steps where there is illegal content, an active attack or an immediate risk to others. We never delete your data as a first step, and we keep you informed throughout.',
      ],
    },
    {
      heading: '6. Reporting abuse',
      blocks: [
        'If you believe a product we run breaks this policy, email abuse@vavencloud.com with the address and what you saw. We review every report within 1 business day. To report a security vulnerability, see our Trust & Security page.',
      ],
    },
    {
      heading: '7. Changes',
      blocks: [
        'We may update this policy as the law and new risks change. We will tell clients by email at least 30 days before a material change takes effect.',
      ],
    },
  ],
}
