import { routes } from '@/app/routes.ts'
import { site } from '@/app/site.config.ts'
import { reviews } from '@/modules/reviews/reviews.data.ts'
import type { IconName } from '@/shared/ui/icons.ts'

/*
 * v2 copy that isn't already in a module. Everything else (the night, the layers, the steps, the plans,
 * the reviews) comes from the same data as the landing page, so the two can't drift apart.
 */

/** The header's links: the story's chapters, in reading order. The one on screen is marked as you scroll. */
export const chapters = [
  { label: 'The problem', href: `${routes.home}#problem` },
  { label: 'Clients', href: `${routes.home}#clients` },
  { label: 'Plans', href: `${routes.home}#plans` },
  { label: 'FAQ', href: `${routes.home}#faq` },
]

/** The design spaces the number out; the link itself comes from site.config.ts */
export const emergency = { label: '+91 90609 79706', href: site.contact.phones[0].href }

/* ---------- The problem: "Who do you call?", played as a live example (from the live landing page) ---------- */

/** One call in the example: who you ring, what you hear back, and when. Times are minutes past 02:00. */
export interface Call {
  id: string
  name: string
  role: string
  reply: string
  /** How the call ended, on its card */
  verdict: string
  /** You dial at `dial`; by `end` the call is over (or answered) */
  dial: number
  end: number
}

/** Under the heading (problem-heading.ts, also on v3): the same night, in one paragraph */
export const problemIntro =
  'It’s 2:14am. Your checkout is down and customers can’t pay. Your host says the server is fine. Your DevOps freelancer says the pipeline is fine. Your developers say the code is fine. Each of them is right about their own part, and nobody owns the whole. So you’re the one awake, relaying messages between three vendors while the orders stop.'

/** Checkout goes down at 02:14 */
export const downAt = 14

export const vendorCalls: (Call & { icon: IconName })[] = [
  {
    id: 'host',
    icon: 'server',
    name: 'Your host',
    role: 'Keeps the machine on.',
    reply: '“Your server is running normally.”',
    verdict: 'Not our problem',
    dial: 16,
    end: 29,
  },
  {
    id: 'freelancer',
    icon: 'infinity',
    name: 'Your DevOps freelancer',
    role: 'Set up the pipeline last year.',
    reply: 'Seen 6 hours ago. No reply.',
    verdict: 'No answer',
    dial: 31,
    end: 38,
  },
  {
    id: 'developers',
    icon: 'code',
    name: 'Your developers',
    role: 'Wrote the code.',
    reply: '“It works on our machines.”',
    verdict: 'Not our code',
    dial: 40,
    end: 52,
  },
]

export const vavenCall: Call = {
  id: 'vaven',
  name: 'VavenCloud',
  role: 'Servers, deployments and code. One team.',
  reply: 'Picked up on the first ring: “I’m on it.”',
  verdict: 'Answered',
  dial: 53,
  end: 53,
}

/** After VavenCloud picks up: the engineer's messages, ending in the fix */
export const fixSteps = [
  { at: 65, text: 'Cause found: a missing database index on the orders table.' },
  { at: 80, text: 'Fixed and verified. Checkout is fast again.' },
]

/**
 * Client stories: one card each, in a row that scrolls sideways, so add as many as there are. Real clients and
 * their own words only (docs/messaging.md). `highlight` is a phrase from the quote, underlined on the card.
 * A video review adds `video` (the YouTube id and its title); its card shows the thumbnail and loads the player
 * only when played. Its `quote` is optional: a line the client says in the video, word for word.
 * `sample` marks a placeholder video card (no video yet): its poster says "Sample" so it can't pass for real.
 */
export interface Testimonial {
  name: string
  topic: string
  quote?: string
  highlight?: string
  video?: { id: string; title: string }
  sample?: boolean
}

const highlights: Record<string, string> = {
  'Kyle Bagley': 'a trusted long-term partner',
  'Mohammed Imtiaz Ali': 'their support team is always available',
  'Jon God Gilly': 'A true partner in our app journey.',
}

/**
 * TODO before launch: a sample, to show how a video review looks in the row. Replace it with a real client's
 * video, name, topic and words, e.g. { name: '…', topic: '…', quote: '…', video: { id: '<YouTube id>', title: '…' } },
 * or delete it.
 */
const sampleVideo: Testimonial = {
  name: '[Client name]',
  topic: '[Topic]',
  quote: '[A line the client says in the video, word for word.]',
  sample: true,
}

// The reviews published on vavencloud.com, with the sample video second so it shows without scrolling
const written = reviews.map((r) => ({ ...r, highlight: highlights[r.name] }))
export const testimonials: Testimonial[] = [written[0], sampleVideo, ...written.slice(1)]

/** Beside the plans: why saying yes is safe */
export const safety: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'search',
    title: 'Free review first',
    text: '45 minutes with a senior engineer. You keep the written roadmap either way.',
  },
  {
    icon: 'wallet',
    title: 'One fixed monthly fee',
    text: 'Agreed after your review. No hourly meter, no surprise invoices.',
  },
  {
    icon: 'lock',
    title: 'Never locked in',
    text: 'Standard Linux, MySQL and PostgreSQL. Leave any time with everything handed over.',
  },
]
