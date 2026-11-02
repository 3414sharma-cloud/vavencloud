/* Client stories: real reviews and figures only (docs/messaging.md: never invent quotes or customers). */

/** The reviews published on vavencloud.com/services (October 2026). `topic` is what each one is about, in its own words. TODO: add each client's role and company when known. */
export const reviews = [
  {
    name: 'Kyle Bagley',
    topic: 'Hosting and cloud',
    quote:
      'Reliable web hosting and cloud solutions transformed our business. Fast performance, smooth migrations, and robust security helped us scale confidently. I highly recommend VavenCloud as a trusted long-term partner.',
  },
  {
    name: 'Mohammed Imtiaz Ali',
    topic: 'Security and 24/7 support',
    quote:
      'VavenCloud exceeded expectations with strong performance and dependable security. Our websites run smoothly 24/7, and their support team is always available for quick technical help and scaling guidance.',
  },
  {
    name: 'Jon God Gilly',
    topic: 'App development',
    quote:
      'A true partner in our app journey. Their expertise, innovation, and reliability made every phase smooth from planning to deployment. Responsive communication and quality-focused execution set them apart.',
  },
]

/** Beside the heading: what vavencloud.com says (the Upwork record is in the proof section). TODO: confirm before launch. */
export const clientFacts = [
  { value: '500+', label: 'businesses trust VavenCloud, in India and worldwide' },
  { value: '99.9%', label: 'uptime guarantee' },
]

/** The co-founder on Vavensoft's YouTube channel */
export const founderVideo = {
  id: 'N186wgIn-lo',
  /** As titled on YouTube */
  title: 'Jerry Bopara, Co-founder, DevOps and AI Integration Architect',
  name: 'Jerry Bopara',
  role: 'Co-founder, DevOps and AI Integration Architect',
}
