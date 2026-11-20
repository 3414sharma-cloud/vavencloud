import type { IconName } from '@/components/ui/icons.ts'

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
  /** A short headline about them, shown where the name goes (names are left off for now) */
  tagline: string
  role: string
  /** A photo in /public, e.g. '/team/qa-tester.webp'. Without one, the card shows a placeholder portrait */
  photo?: string
  /** What they work on, shown as small tags */
  tags: string[]
  /** One or two short, true sentences about them */
  line: string
}

/**
 * Team members, shown as cards under the roles ("Meet some of the team").
 *
 * The photos are the team's illustrated portraits (public/team/*.webp, made from the PNGs beside them). Names
 * are left off for now: each card leads with a tagline. Before launch, check every role, tag and line with the
 * person it shows (docs/messaging.md: nothing invented).
 */
export const members: Member[] = [
  {
    tagline: 'Keeps production calm',
    role: 'Lead DevOps Engineer',
    photo: '/team/devops-lead.webp',
    tags: ['DevOps', 'Kubernetes', 'On-call lead'],
    line: 'Looks after the pipelines and clusters behind client products, and leads the response when something breaks.',
  },
  {
    tagline: 'Ships it every day',
    role: 'DevOps Engineer',
    photo: '/team/devops-engineer.webp',
    tags: ['CI/CD', 'Docker', 'Terraform'],
    line: 'Builds the code → build → test → deploy pipelines, and keeps them fast and repeatable.',
  },
  {
    tagline: 'Infrastructure you never think about',
    role: 'Cloud & DevOps Engineer',
    photo: '/team/cloud-devops.webp',
    tags: ['AWS', 'Infra', 'Monitoring'],
    line: 'Runs client infrastructure on AWS and watches it, so problems are caught before customers notice.',
  },
  {
    tagline: 'From code to cloud',
    role: 'Cloud Developer',
    photo: '/team/cloud-developer.webp',
    tags: ['Next.js', 'Node.js', 'AWS'],
    line: 'Writes the code and ships it to the cloud, so a fix goes from commit to live without a handoff.',
  },
  {
    tagline: 'Front to back, end to end',
    role: 'Full Stack Developer',
    photo: '/team/full-stack.webp',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    line: 'Fixes and builds across the whole product: the interface, the API and the database under it.',
  },
  {
    tagline: 'Turns ideas into working features',
    role: 'Full Stack Developer',
    photo: '/team/full-stack-2.webp',
    tags: ['React', 'Next.js', 'Deploy'],
    line: 'Takes a feature from first sketch to production, frontend, backend and deploy.',
  },
  {
    tagline: 'Breaks it before your users do',
    role: 'QA Tester',
    photo: '/team/qa-tester.webp',
    tags: ['Test cases', 'Automation', 'Selenium'],
    line: 'Writes the test cases, automates them, and retests every fix before it goes out.',
  },
  {
    tagline: 'Designs that make sense',
    role: 'UI/UX Designer',
    photo: '/team/ui-ux-designer.webp',
    tags: ['Research', 'Wireframes', 'Figma'],
    line: 'Researches, wireframes and prototypes screens so they’re clear before a line of code is written.',
  },
  {
    tagline: 'Your first hello',
    role: 'Bidding & Sales',
    photo: '/team/bidding-sales.webp',
    tags: ['Proposals', 'RFPs', 'Follow-up'],
    line: 'Answers RFPs, writes proposals and stays in touch until the work is agreed.',
  },
]
