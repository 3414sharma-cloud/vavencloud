import type { IconName } from '@/shared/ui/icons.ts'

/*
 * The team page (/team/): who's behind VavenCloud. Everything here comes from what the site already says
 * (v5.data.ts, founder.data.ts, stats.data.ts, VavenCloud-Sample-Content.md). No invented people, names,
 * faces or numbers (docs/messaging.md): add real team members to `members` once they're approved.
 */

export interface Founder {
  initials: string
  name: string
  role: string
  /** One paragraph on who they are */
  bio: string
  /** Short facts, shown as a list */
  facts: string[]
  /** What they look after, shown as tags */
  focus: string[]
  /** A YouTube video of them (loaded only when played) */
  video?: { id: string; title: string; play: { x: string; y: string } }
}

export const founders: Founder[] = [
  {
    initials: 'JB',
    name: 'Jerry Bopara',
    role: 'Co-founder · Solution Architect & Principal Consultant',
    bio: 'More than twelve years as a DevOps and cloud engineer before co-founding Vavensoft and VavenCloud. Helps founders turn AI and SaaS ideas into systems that scale, not MVPs that break. If you book a production review, he’s the kind of engineer you’ll speak to, not a salesperson.',
    facts: [
      '12+ years as a DevOps and cloud engineer',
      'Co-founded Vavensoft and VavenCloud',
      'Runs production systems, not slide decks',
    ],
    focus: ['DevOps', 'Cloud architecture', 'AI integration', 'Production reviews'],
    video: {
      id: 'N186wgIn-lo',
      title: 'Jerry Bopara | Co-Founder, DevOps & AI Integration Architect | Vavensoft',
      // Where the thumbnail draws its own play button, so ours sits right on it (as in v5.data.ts)
      play: { x: '57.6%', y: '60.5%' },
    },
  },
  {
    initials: 'PK',
    name: 'Puneet Kumar',
    role: 'Co-founder · Operations',
    bio: 'Leads Vavensoft’s operations. An AI agent and SaaS developer who makes sure every client has one team that knows their product, and that the right engineer picks up when something needs attention.',
    facts: [
      'Co-founded Vavensoft and VavenCloud',
      'Leads operations across every client account',
      'AI agent and SaaS developer',
    ],
    focus: ['Operations', 'Client accounts', 'AI agents', 'SaaS'],
  },
]

/** How the team works with a client (VavenCloud-Sample-Content.md: the engineers, the plans, the FAQ) */
export const ways: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'users',
    title: 'One team, every layer',
    text: 'The same engineers look after your servers, your deployments and your code, so a problem never becomes a chain of handoffs.',
  },
  {
    icon: 'clock',
    title: 'On call 24/7',
    text: 'Engineers watch your product day and night. Critical incidents get a response within an hour, or 30 minutes on Partner.',
  },
  {
    icon: 'support',
    title: 'In your chat, not a ticket queue',
    text: 'Real people with names, in your portal and your chat, who learn how your product works.',
  },
  {
    icon: 'star',
    title: 'A named lead on Partner',
    text: 'On the Partner plan, one lead engineer knows your product inside out and is your first call.',
  },
]

export interface Member {
  name: string
  role: string
  /** A square photo in /public, e.g. '/team/first-last.jpg'. Without one, the card shows a placeholder portrait */
  photo?: string
  /** What they work on, shown as small tags */
  tags: string[]
  /** One or two short, true sentences about them */
  line: string
}

/**
 * Team members, shown as cards under the roles ("Meet some of the team").
 *
 * TODO before launch: these five are PLACEHOLDERS (a template), not real people. Replace each name, role, tags
 * and line with a real, approved team member, and add their photo; or remove the ones you don't need. Keep
 * every line true (docs/messaging.md: no invented people or numbers).
 */
export const members: Member[] = [
  {
    name: 'Full Name',
    role: 'Lead DevOps Engineer',
    tags: ['DevOps', 'Kubernetes', 'On-call lead'],
    line: 'Short description: what they look after and what they’re known for on client accounts.',
  },
  {
    name: 'Full Name',
    role: 'Cloud & Database Engineer',
    tags: ['AWS', 'PostgreSQL', 'Backups'],
    line: 'Short description: the clouds and databases they run, and how they keep them healthy.',
  },
  {
    name: 'Full Name',
    role: 'Security Engineer',
    tags: ['Hardening', 'Patching', 'Firewalls'],
    line: 'Short description: how they keep client servers patched, locked down and audited.',
  },
  {
    name: 'Full Name',
    role: 'Full-stack Developer',
    tags: ['Node.js', 'React', 'Bug fixes'],
    line: 'Short description: the kind of fixes in client code they handle within the plan’s hours.',
  },
  {
    name: 'Full Name',
    role: 'Site Reliability Engineer',
    tags: ['Monitoring', 'Incidents', 'Reports'],
    line: 'Short description: how they spot problems early and write up every incident.',
  },
]
