export interface Faq {
  q: string
  a: string
}

export const faqs: Faq[] = [
  {
    q: 'What is VavenCloud?',
    a: 'A hosting platform that backs your product. We host your website or app, get it live and keep it running, with real engineers on call 24/7.',
  },
  {
    q: 'Who can host with you?',
    a: "Anyone. Built by your own team, a freelancer, an agency or with AI tools, it doesn't matter. If it runs on the web, we can run it.",
  },
  {
    q: 'My app was made with AI tools. Can you host it?',
    a: "Yes. We'll look at what you have, set up the right servers and get it ready for real users and real traffic.",
  },
  {
    q: 'What happens after I bring my product?',
    a: "We move it to your platform, deploy and test it, then monitor it and back it up every night. And when something breaks, there's someone to call.",
  },
  {
    q: 'Can you move my site from my current host?',
    a: 'Yes, for free. We move your files, databases and email, and your current site stays up while we do it.',
  },
  {
    q: 'Do you build apps?',
    a: 'Our focus is running your product. If you need a fix or a new feature, our engineers can help with that too.',
  },
  {
    q: 'What is the difference between web hosting and cloud servers?',
    a: 'Web hosting is a ready-to-go home for websites and WordPress. Cloud servers give your app its own dedicated resources with full root access.',
  },
  {
    q: 'What uptime do you guarantee?',
    a: 'We back our hosting with a 99.99% uptime SLA, monitored around the clock across redundant infrastructure.',
  },
]
