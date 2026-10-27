export interface Faq {
  q: string
  a: string
}

/**
 * FAQ from VavenCloud-Sample-Content.md. The order matters: the most common objection first,
 * price last, after the value is clear.
 */
export const faqs: Faq[] = [
  {
    q: 'Is this just managed hosting with a nicer name?',
    a: 'No. Managed hosting looks after the server and stops there. We take responsibility for your whole product: infrastructure, deployments, monitoring, incidents and fixes in your code. When something breaks, we don’t send you a ticket number. We send you the fix.',
  },
  {
    q: 'We already have developers. Why would we need you?',
    a: 'Because your developers should be building your product, not waking up for server alerts. We take production off their plate and work alongside them in a shared channel. They stay in control of the code; we make sure it runs.',
  },
  {
    q: 'We’re on AWS. Do we have to move?',
    a: 'No. You can run on VavenCloud or keep your own AWS, Azure or Google Cloud account, and we take ownership there. In your review we’ll tell you honestly which makes more sense for your budget and growth.',
  },
  {
    q: 'You didn’t write our code. How can you own it?',
    a: 'That’s exactly why every engagement starts with a production audit. We find the risks first, fix the critical ones with you, and only then take responsibility. We’d rather tell you the uncomfortable truth in week one than discover it at 3am.',
  },
  {
    q: 'What happens when something breaks at night or at the weekend?',
    a: 'Your engineers are on call 24 hours a day, 7 days a week. Critical incidents get a response within 1 hour on Managed and within 30 minutes on Partner, and we keep you updated in your portal until it’s fixed. Afterwards you get a written explanation of what happened and what we changed so it doesn’t happen again.',
  },
  {
    q: 'What if we want to leave?',
    a: 'You can, at any time, under the terms of your agreement. Everything runs on open standards, and we hand over documentation, access, runbooks and a full backup. No lock-in, no hostage data.',
  },
  {
    q: 'Can you take over an app built by an agency, a freelancer or with AI tools?',
    a: 'Yes. It’s one of the most common reasons founders come to us. We document how your product runs, close the gaps and give you one team that understands it.',
  },
  {
    q: 'Where is our data stored, and who can access it?',
    // TODO: confirm the platform logs engineer access before keeping "every access is logged"
    a: 'In the region you choose, the United States or Europe. Access is limited to your assigned engineers, and every access is logged.',
  },
  {
    q: 'How much does it cost?',
    a: 'A fixed monthly fee, agreed after your free review, once we understand your product. It’s usually a fraction of hiring one senior DevOps engineer, and you get a whole team, the infrastructure and fixes in your code. There’s no hourly meter and no surprise invoices.',
  },
]
