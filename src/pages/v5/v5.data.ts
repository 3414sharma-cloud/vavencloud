import { routes } from '@/app/routes.ts'
import type { HeroSlide } from '@/pages/home/sections/hero.data.ts'
import type { Caller, CallerId, Scene, SiteState } from '@/pages/v3/v3.data.ts'
import type { IconName } from '@/shared/ui/icons.ts'

/*
 * v4's copy, from the v4 draft ("VavenCloud v4 — landing page draft"): v3's page in a new order, with five new
 * chapters (what we own, where you are today, the comparison, who's behind it, how we start). Everything not
 * here comes from v3, v2 or the landing page's modules, unchanged. The story and the report are an example,
 * not a real client.
 */

/** The header's links: the chapters, in reading order. The one on screen is marked as you scroll. */
export const chapters = [
  { label: 'The problem', href: `${routes.home}#problem` },
  { label: 'What we own', href: `${routes.home}#own` },
  { label: 'Compare', href: `${routes.home}#compare` },
  { label: 'Plans', href: `${routes.home}#plans` },
  { label: 'FAQ', href: `${routes.home}#faq` },
]

/* ---------- The hero: one call fixes it, stay on your cloud, or run on ours ---------- */

const book: HeroSlide['primary'] = { label: 'Book a free production review', href: routes.book }

/**
 * The landing page's slide, with the note under the buttons optional. For long copy the slide takes the hero's
 * full width (v4.css). `titleEm`: how wide the title's longer half is on one line, in its own em, with a little
 * to spare (measured in the browser; measure again when the title changes): the title is sized so each half
 * keeps to one line. `longText`: the paragraph runs in two even lines.
 */
export type V5HeroSlide = Omit<HeroSlide, 'reassurance' | 'eyebrow'> & { reassurance?: string; titleEm?: number; longText?: boolean }

export const heroSlides: V5HeroSlide[] = [
  {
    tab: 'One call fixes it',
    title: ['When something breaks, you make one call.', 'We fix the rest.'],
    description: 'One team runs your servers, deployments and code, on call 24/7. No more chasing your host, freelancer and developers.',
    primary: book,
    secondary: { label: 'See how it works', href: `${routes.home}#problem` },
  },
  {
    tab: 'Stay on your cloud',
    title: ['On AWS, Azure or Google Cloud?', 'We run it right where it is.'],
    titleEm: 14.9,
    description:
      'Keep your hosting platform. Zero migration. We secure, monitor and optimise your infrastructure 24/7, with right-sized resources, so everything stays secure and online, you stop paying for idle capacity, and it’s scalable when you’re ready to grow.',
    longText: true,
    primary: book,
    secondary: { label: 'See the plans', href: routes.plans },
    reassurance: 'Same team · same chat · same 24/7 cover',
  },
  {
    tab: 'Or run on ours',
    title: ['Cloud servers with engineers attached,', 'so you’re never managing them alone.'],
    titleEm: 17.6,
    longText: true,
    description:
      'High-performance private cloud with built-in security, backups and auto-scaling, managed around the clock by the team that runs your deployments and code.',
    primary: book,
    secondary: { label: 'Explore our cloud', href: 'https://vavencloud.com/cloud-services', external: true },
    reassurance: 'Same team · same chat · no lock-in',
  },
]

/* ---------- The problem: v3's story with v4's script (story.v5.ts plays it, v3.data.ts explains the shape) ---------- */

export const callers: Record<CallerId, Caller> = {
  host: { name: 'Hosting provider', role: 'Keeps the server on', icon: 'server', excuse: '“The server’s up. Must be your application.”', verdict: 'Server looks fine' },
  devops: { name: 'DevOps freelancer', role: 'Set up the servers last year', icon: 'infinity', excuse: '“The pipeline deployed fine. Ask your developers.”', verdict: 'Pipeline looks fine' },
  devs: { name: 'Your developers', role: 'Wrote the code', icon: 'code', excuse: '“We haven’t changed anything. Must be the server.”', verdict: 'Code looks fine' },
  vaven: { name: 'VavenCloud', role: 'Servers, deployments and code', excuse: '“I can see it. I’m on it.”', verdict: 'Fixed in 27 min' },
}

/** On the list of calls, once all three have passed the problem on */
export const loopNote = 'Three answers, all true on their own. Nobody owns the whole. You’re back where you started.'

/** The site in the example */
export const site = {
  url: 'yourapp.com/checkout',
  states: {
    ok: { chip: 'Online', code: '200', text: 'All good. Orders are coming in.' },
    down: { chip: 'Down', code: '502', text: 'Bad gateway. Customers can’t pay.' },
    fixing: { chip: 'Engineer on it', code: '502', text: 'Still down, but an engineer is fixing it.' },
    up: { chip: 'Back online', code: '200', text: 'Fast again. Customers can pay.' },
  } satisfies Record<SiteState, { chip: string; code: string; text: string }>,
  /** For the example: checkouts that fail each minute it's down */
  failedPerMinute: 3,
}

export const scenes: Scene[] = [
  {
    id: 'crash',
    tab: 'It breaks',
    ms: 5600,
    tone: 'bad',
    screen: 'lock',
    clock: [
      [0, 14],
      [5600, 15],
    ],
    captions: [{ at: 0, text: 'Your site goes down. Customers can’t pay.' }],
    site: [{ at: 700, state: 'down' }],
    alerts: [
      { at: 1300, icon: 'activity', tone: 'bad', app: 'Uptime monitor', title: 'yourapp.com is down', text: '502 Bad Gateway on /checkout' },
      { at: 2500, icon: 'wallet', tone: 'warn', app: 'Payments', title: 'No successful payments', text: 'None in the last 10 minutes' },
      { at: 3700, icon: 'mail', tone: 'brand', app: 'Mail', title: 'A customer', text: '“I can’t pay. Is your site down?”' },
    ],
  },
  {
    id: 'host',
    tab: 'Hosting provider',
    ms: 8600,
    tone: 'bad',
    screen: 'host',
    clock: [
      [0, 16],
      [8600, 29],
    ],
    captions: [{ at: 0, text: 'You call your hosting provider.' }],
    call: { answered: 1300 },
    lines: [
      { at: 1600, you: 'Our site is down. Checkout shows a 502 error.' },
      { at: 3400, them: 'The server’s up and running on our side.' },
      { at: 5200, them: 'Must be your application. Please open a ticket. We reply within 24 to 48 hours.' },
    ],
    verdict: 6700,
  },
  {
    id: 'devops',
    tab: 'DevOps freelancer',
    ms: 7800,
    tone: 'bad',
    screen: 'devops',
    clock: [
      [0, 31],
      [7800, 38],
    ],
    captions: [{ at: 0, text: 'You try the DevOps freelancer who set up your servers.' }],
    call: { missed: 2200 },
    lines: [
      { at: 2200, note: 'No answer' },
      { at: 2800, you: 'Site’s down. Can you take a look? It’s urgent.' },
      { at: 3600, note: 'Seen {time}' },
      { at: 5300, them: 'I’m away until Monday. The pipeline deployed fine. Ask your developers.' },
    ],
    verdict: 6500,
  },
  {
    id: 'devs',
    tab: 'Developers',
    ms: 10500,
    tone: 'bad',
    screen: 'devs',
    clock: [
      [0, 40],
      [10500, 52],
    ],
    captions: [{ at: 0, text: 'You wake up your developers.' }],
    call: { answered: 1200 },
    lines: [
      { at: 1500, you: 'Checkout is down. Did anything change today?' },
      { at: 3200, them: 'We haven’t deployed since Tuesday.' },
      { at: 5000, them: 'We haven’t changed anything. Must be the server.' },
    ],
    verdict: 6300,
    loop: 7300,
  },
  {
    id: 'vaven',
    tab: 'VavenCloud',
    ms: 9600,
    tone: 'accent',
    screen: 'vaven',
    clock: [
      [0, 53],
      [4600, 65],
      [7400, 72],
    ],
    captions: [
      { at: 0, text: 'Three answers. Zero fixes. You make one call, to VavenCloud.' },
      { at: 3000, text: 'One engineer looks at the servers, the deployments and the code.' },
    ],
    call: { answered: 600, connected: 'Answered on the first ring' },
    site: [{ at: 2600, state: 'fixing' }],
    lines: [
      { at: 900, you: 'Checkout is down.' },
      { at: 2200, them: 'I can see it on our monitoring. I’m on it.' },
      { at: 4600, them: 'Found it: a missing database index on the orders table. Every checkout was timing out.', time: true },
      { at: 7400, them: 'Index added and tested. Rolling it out now.', time: true },
    ],
  },
  {
    id: 'fixed',
    tab: 'Fixed',
    ms: 7400,
    tone: 'good',
    screen: 'vaven',
    clock: [
      [0, 72],
      [1800, 80],
    ],
    captions: [{ at: 1800, text: 'Fixed 27 minutes after the call. You go back to sleep.' }],
    site: [{ at: 1800, state: 'up' }],
    lines: [
      { at: 1800, them: 'Fixed and verified. Checkout is fast again.', time: true },
      { at: 3300, them: 'Your written report will be in your inbox by 09:00.' },
    ],
    verdict: 4500,
  },
]

/** Under the story: what the night cost (the minutes come from the story's clock), and the next step */
export const payoff = {
  text: 'The fix was never the hard part. Finding someone who owned it was.',
  question: 'Who would you call tonight?',
  note: 'Free · Any cloud · No commitment',
}

/* ---------- What we own: every layer, one team ---------- */

export interface Layer {
  icon: IconName
  title: string
  text: string
  points: string[]
  forYou: string
  /** Shown big; `feature` is the dark one, our difference */
  size: 'wide' | 'third'
  feature?: boolean
}

export const layers: Layer[] = [
  {
    icon: 'server',
    title: 'Infrastructure',
    text: 'Servers, databases, networks and backups, on AWS, Azure, Google Cloud or ours.',
    points: ['Security patches and hardening', 'Automated backups, tested restores', 'Firewalls and private networking'],
    forYou: 'the foundation is looked after, not just switched on.',
    size: 'wide',
  },
  {
    icon: 'clock',
    title: '24/7 operations',
    text: 'Engineers watching your product day and night, and responding when it matters.',
    points: ['Monitoring and alerting set up for you', 'Incident response, any hour', 'Plain-English report after every incident'],
    forYou: 'you hear about problems from us, not from customers.',
    size: 'wide',
  },
  {
    icon: 'code',
    title: 'Fixes in your code',
    text: 'Vavensoft’s developers fix bugs and broken releases in your application, within your plan’s monthly hours.',
    points: ['Bugs and errors in existing features', 'Slow pages and performance problems', 'Bigger work quoted first, never billed without approval'],
    forYou: 'no “that’s the developer’s problem.” It’s ours.',
    size: 'third',
    feature: true,
  },
  {
    icon: 'rocket',
    title: 'Deployments',
    text: 'CI/CD pipelines that release your code safely, every time.',
    points: ['Automated build, test and release', 'One-step rollback', 'Staging before production'],
    forYou: 'releases stop being a risk you dread.',
    size: 'third',
  },
  {
    icon: 'wallet',
    title: 'Cost and scaling',
    text: 'A regular look at your cloud bill and traffic, with a plan before you need it.',
    points: ['Right-sized servers, no idle capacity', 'Load balancing and auto scaling', 'Growth planned ahead of launches'],
    forYou: 'a bill you understand, and growth that doesn’t break things.',
    size: 'third',
  },
]

/* ---------- Where are you today: five moments founders come to us ---------- */

export type StageId = 'idea' | 'mvp' | 'scale' | 'cost' | 'owner'

/** `id` picks the stage's diagram (stage-art.v5.ts) */
export const stages: { id: StageId; title: string; worry: string; answer: string }[] = [
  { id: 'idea', title: 'I have an idea', worry: '“Will I pick the wrong team? Will it fall apart after launch?”', answer: 'Build it once, built to last, with one team from build to run.' },
  { id: 'mvp', title: 'I have an MVP', worry: '“Will it survive real users?”', answer: 'Find what breaks first and fix it before your customers do.' },
  { id: 'scale', title: 'I’m live, but it won’t scale', worry: '“Every growth spike becomes an outage.”', answer: 'Find the bottleneck and plan the next step ahead of time.' },
  { id: 'cost', title: 'I’m paying too much for cloud', worry: '“Our bill keeps growing and nobody can explain it.”', answer: 'Show you where the money goes, and right-size it.' },
  { id: 'owner', title: 'It works. Nobody owns it.', worry: '“My developer left. Nobody owns this.”', answer: 'Take it over, document it, and give you one team that understands it.' },
]

/* ---------- After every fix: the report the next morning (the same night as the story) ---------- */

export const reportIntro =
  'You wake up to a fixed product and a plain-English report: what broke, why it broke, what we changed and what we’ve done so it doesn’t happen again. Every month you get the bigger picture: uptime, incidents, changes made and what we recommend next. No chasing updates. Nothing happens out of sight.'

/** Where you follow the work, whichever cloud the product runs on */
export const workspace: { name: string; who: string; headline: string; what: string; icon: IconName }[] = [
  {
    name: 'Client portal',
    who: 'For every client',
    headline: 'One place for everything we do for you.',
    what: 'Talk to your engineers, raise and track issues, share files and access securely, and see every report and your growth roadmap.',
    icon: 'users',
  },
  {
    name: 'VavenCloud dashboard',
    who: 'For clients on VavenCloud infrastructure',
    headline: 'Your infrastructure, in plain view.',
    what: 'See and manage your servers, databases, load balancers, private networks and backups, all in one dashboard.',
    icon: 'monitor',
  },
]

/** The example report. The bar splits the night at the call: before it, and with us. */
export const report = {
  title: 'Checkout down: fixed 27 minutes after the call',
  started: '02:14',
  called: '02:53',
  resolved: '03:20',
  meta: [
    ['Started', '02:14'],
    ['Engineer engaged', '02:53'],
    ['Resolved', '03:20'],
    ['Affected', 'Checkout only'],
  ],
  sections: [
    ['What happened', 'Checkout requests began timing out and returning errors. Payments stopped.'],
    ['Cause', 'A missing database index on the orders table. Every checkout query scanned the full table.'],
    ['Fix', 'Index added, tested and rolled out. Checkout back to normal speed.'],
    ['So it doesn’t happen again', 'Slow-query alert added. New database changes are now checked for missing indexes before release.'],
    ['Handled by', 'On-call engineer'],
  ],
}

/* ---------- Compare: three ways to run production ---------- */

/** One row of the table: what three vendors and one hire give you, then VavenCloud. `no` marks a gap with a cross. */
export interface Compare {
  label: string
  vendors: { text: string; no?: boolean }
  hire: { text: string; no?: boolean }
  vaven: string
}

export const compareColumns = ['Three separate vendors', 'Hire a DevOps engineer', 'VavenCloud']

export const compare: Compare[] = [
  { label: 'Who owns an outage', vendors: { text: 'Nobody. Each owns one layer.', no: true }, hire: { text: 'One person, for infrastructure only' }, vaven: 'One team, every layer' },
  { label: 'Cover at 2am', vendors: { text: 'Tickets and business hours', no: true }, hire: { text: 'One person can’t be on call every night', no: true }, vaven: 'On call 24/7' },
  { label: 'Fixes in your code', vendors: { text: 'Your developers, when they’re free' }, hire: { text: 'Usually not their job', no: true }, vaven: 'Included, within plan hours' },
  { label: 'How you pay', vendors: { text: 'Three bills, plus hourly extras' }, hire: { text: 'A full salary, plus months of hiring' }, vaven: 'One fixed monthly fee' },
  { label: 'If someone leaves', vendors: { text: 'The knowledge leaves with them', no: true }, hire: { text: 'Your setup leaves with them', no: true }, vaven: 'Everything documented and handed over' },
  { label: 'Time to get covered', vendors: { text: 'Already in place, gaps included' }, hire: { text: 'Months to find and hire' }, vaven: 'Handover in about 1–2 weeks' },
]

export const compareMeans = 'you don’t need more vendors or another hire. You need one team that owns the whole problem, and one fee that covers it.'

/* ---------- Who's behind it ---------- */

export const behindIntro =
  'VavenCloud is the managed cloud side of Vavensoft, a software company building AI products, SaaS platforms, mobile apps and cloud systems for founders, mainly in the US and Europe, since 2022.'

/* TODO: confirm every figure before launch (as in stats.data.ts) */
export const behindStats: { value: string; label: string }[] = [
  { value: '210+', label: 'products delivered by Vavensoft' },
  { value: '99%', label: 'of clients come back for more work' },
  { value: '12+ yrs', label: 'of DevOps and cloud engineering' },
  { value: '100%', label: 'Job Success and Top Rated on Upwork' },
]

/** Beside them: a co-founder on video (YouTube, loaded only when played) */
export const behindVideo = {
  id: 'N186wgIn-lo',
  title: 'Jerry Bopara | Co-Founder, DevOps & AI Integration Architect | Vavensoft',
  caption: 'Jerry Bopara, co-founder of Vavensoft and VavenCloud',
  /** Where the thumbnail draws its own play button, so ours sits right on it (change it with the thumbnail) */
  play: { x: '57.6%', y: '60.5%' },
}

/** The two co-founders */
export const founders: { initials: string; name: string; role: string; bio: string }[] = [
  {
    initials: 'JB',
    name: 'Jerry Bopara',
    role: 'Co-founder · Solution Architect & Principal Consultant',
    bio: 'More than twelve years as a DevOps and cloud engineer. Helps founders turn AI and SaaS ideas into systems that scale, not MVPs that break.',
  },
  {
    initials: 'PK',
    name: 'Puneet Kumar',
    role: 'Co-founder · Operations',
    bio: 'Leads Vavensoft’s operations. An AI agent and SaaS developer who makes sure every client has one team that knows their product.',
  },
]

/** Behind the "rest of the team" button, above the engineers on your account (by role, from stats.data.ts) */
export const teamIntro =
  'A senior bench of DevOps, DevSecOps and full-stack engineers. On the Partner plan, a named lead engineer knows your product inside out.'

/* ---------- How we start: first call to fully covered ---------- */

export const startSteps: { when: string; title: string; text: string }[] = [
  { when: 'Day 1', title: 'Free review call', text: '45 minutes with a senior engineer, not a salesperson.' },
  { when: 'Within 48 hours', title: 'Written roadmap', text: 'Risks, quick wins and current costs. Yours to keep, either way.' },
  { when: 'When you’re ready', title: 'One fixed fee', text: 'Agreed once we understand your product. No hourly meter.' },
  { when: 'Week 1–2', title: 'Handover', text: 'We document everything, fix what’s urgent and set up monitoring and backups.' },
  { when: 'From then on', title: 'Fully covered', text: 'Your engineers, 24/7 response and a report every month.' },
]

export const handover: { title: string; text: string }[] = [
  { title: 'Nothing goes dark', text: 'Your product stays live the whole time.' },
  { title: 'Everything written down', text: 'How it runs, where it runs, who has access.' },
  { title: 'Urgent risks fixed first', text: 'Before we take responsibility, not after.' },
  { title: 'Your accounts stay yours', text: 'Code, data and cloud accounts never change hands.' },
]

/* ---------- Plans: what the plan hours cover ---------- */

export const scope = {
  included: ['Bugs and errors in existing features', 'Failed deployments and broken releases', 'Performance problems and slow pages', 'Security patches and dependency updates', 'Small config and copy changes'],
  quoted: ['New features and new screens', 'Rebuilding or redesigning large parts of the app', 'Moving to a different framework or language', 'Work on third-party systems we don’t look after', 'Projects needing more than a week of development'],
  note: ['If a fix needs more than your remaining hours,', 'we tell you first, give you a fixed quote and wait for your approval. Nothing is billed without it.'],
}
