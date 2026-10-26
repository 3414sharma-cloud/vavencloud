import { routes } from '@/app/routes.ts'
import type { IconName } from '@/shared/ui/icons.ts'

export interface HeroSlide {
  id: string
  /** Short label on the slider tab */
  tab: string
  icon: IconName
  eyebrow: string
  /** Headline = `title` + highlighted `highlight` (+ optional `titleEnd`) */
  title: string
  highlight: string
  titleEnd?: string
  description: string
  primary: { label: string; href: string }
  secondary: { label: string; href: string }
  /** Glow colour behind the text while this slide is active */
  accent: string
  /** Two floating "live" cards shown beside the text on wide screens */
  floats: [HeroFloat, HeroFloat]
}

export interface HeroFloat {
  icon: IconName
  label: string
  value: string
  note: string
}

/** The four hero headlines from docs/messaging.md, in that order. */
export const heroSlides: HeroSlide[] = [
  {
    id: 'launch',
    tab: 'Launch',
    icon: 'rocket',
    eyebrow: 'Launch support',
    title: 'Bring your product.',
    highlight: "We'll get it live.",
    description: 'Server, setup, deployment and a real team behind your launch.',
    primary: { label: 'Bring your app', href: routes.contact },
    secondary: { label: 'See how it works', href: routes.process },
    accent: '#3d69cc',
    floats: [
      { icon: 'check', label: 'Launch checklist', value: '12 / 12 passed', note: 'Ready to go live' },
      { icon: 'support', label: 'On launch day', value: 'Engineer on call', note: 'Watching every request' },
    ],
  },
  {
    id: 'hosting',
    tab: 'Hosting',
    icon: 'server',
    eyebrow: 'Hosting and cloud servers',
    title: 'Hosting that backs your idea,',
    highlight: 'not just your server.',
    description: 'Fast hosting and cloud servers, set up for your product and looked after by people who know it.',
    primary: { label: 'See plans', href: routes.plans },
    secondary: { label: 'Help me choose', href: routes.find },
    accent: '#2563eb',
    floats: [
      { icon: 'activity', label: 'Uptime, last 90 days', value: '99.99%', note: 'All systems operational' },
      { icon: 'zap', label: 'Avg. page load', value: '0.8 s', note: 'NVMe + global CDN' },
    ],
  },
  {
    id: 'supported',
    tab: 'Support',
    icon: 'support',
    eyebrow: 'Live and supported',
    title: 'Your app, live and supported.',
    highlight: 'Built by anyone, hosted by us.',
    description: 'We keep it running, back it up every night and pick up the phone when you need us.',
    primary: { label: 'Talk to an engineer', href: routes.contact },
    secondary: { label: 'Why VavenCloud', href: routes.whyUs },
    accent: '#648cdb',
    floats: [
      { icon: 'shield', label: 'Nightly backup', value: 'Completed', note: 'Stored off-site' },
      { icon: 'support', label: 'Someone to call', value: '24/7', note: 'Real engineers, not bots' },
    ],
  },
  {
    id: 'anyone',
    tab: 'Any builder',
    icon: 'code',
    eyebrow: 'Built by anyone',
    title: 'Whoever built it,',
    highlight: "we'll make it run.",
    description: "Your own team, a freelancer, an agency or AI tools. It doesn't matter. Bring it, and we take it from here.",
    primary: { label: 'Bring your app', href: routes.contact },
    secondary: { label: 'Who we host', href: routes.builtBy },
    accent: '#0ea5e9',
    floats: [
      { icon: 'code', label: 'Built with', value: 'Any stack', note: 'PHP, Node, Python, WordPress…' },
      { icon: 'sparkles', label: 'Made with AI tools', value: 'Welcome here', note: 'From prototype to production' },
    ],
  },
]

export const heroHighlights = [
  'Built by anyone, hosted by us',
  'Free move from your current host',
  'Real engineers on call, 24/7',
  '99.99% uptime SLA',
]

/** How long each slide stays before auto-advancing. */
export const HERO_INTERVAL_MS = 6500
