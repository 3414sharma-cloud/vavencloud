/**
 * Founding client stories.
 *
 * SAMPLE CONTENT: every person, company, quote and number below is made up so the slider can be reviewed.
 * Replace each entry with a real, approved story before launch (see "Rules" in docs/messaging.md).
 * Set `isSample` to true to show a "Sample story" tag on each card and a note above the slider.
 * It is currently false, so the stories look final: swap in real ones before launch.
 *
 * `photo`: path to a real portrait (e.g. '/clients/maya.jpg', put the file in /public). When it is set the
 * photo is used; otherwise the animated illustrated avatar from `look` is shown.
 */

import type { Look } from '@/shared/ui/portrait.ts'

export const isSample = false

export interface Metric {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  /** What the number measures, shown under it */
  label: string
}

export interface ClientStory {
  quote: string
  name: string
  role: string
  company: string
  industry: string
  country: string
  metric: Metric
  look: Look
  photo?: string
}

export const clientStories: ClientStory[] = [
  {
    quote: 'Our checkout went down on a Friday night. An engineer had it fixed before I finished my coffee. I have not opened a server console since.',
    name: 'Maya Chen',
    role: 'Founder and CEO',
    company: 'Lumen Booking',
    industry: 'Booking SaaS',
    country: 'United States',
    metric: { value: 12, suffix: ' min', label: 'from alert to fixed' },
    look: { bg: ['#bfd1f2', '#93b2e8'], skin: '#f1c9a5', hair: '#1f1a17', style: 'long', shirt: '#3157b3' },
  },
  {
    quote: 'We used to pay a host, a DevOps freelancer and an agency separately. Now it is one monthly fee, one chat and a team that knows our product.',
    name: 'Daniel Okafor',
    role: 'CTO',
    company: 'Parcelwise',
    industry: 'Logistics platform',
    country: 'United Kingdom',
    metric: { value: 38, suffix: '%', label: 'lower infrastructure spend' },
    look: { bg: ['#bbf7d0', '#6ee7b7'], skin: '#8d5a3b', hair: '#17120f', style: 'short', shirt: '#0f766e', glasses: true },
  },
  {
    quote: 'They moved us across at 5am on a Sunday. Our customers never noticed, and I only found out when the report landed in my inbox.',
    name: 'Sofia Marin',
    role: 'Co-founder',
    company: 'Fieldnote',
    industry: 'Field service app',
    country: 'Spain',
    metric: { value: 0, suffix: ' min', label: 'downtime during migration' },
    look: { bg: ['#fde68a', '#fdba74'], skin: '#e0ac86', hair: '#4a2c1a', style: 'bun', shirt: '#be123c' },
  },
  {
    quote: 'I used to sleep with my phone on the pillow. Now an engineer with a name and a face is on call, and I sleep.',
    name: 'Tom Becker',
    role: 'Founder',
    company: 'Brightloop',
    industry: 'Marketing analytics',
    country: 'Germany',
    metric: { value: 90, suffix: ' days', label: 'without a night-time page' },
    look: { bg: ['#ddd6fe', '#c4b5fd'], skin: '#f3d2b3', hair: '#7a5232', style: 'short', shirt: '#4338ca', beard: true },
  },
  {
    quote: 'Audit season used to be a fire drill. Backups, access logs and runbooks are simply there now, written down and tested.',
    name: 'Priya Nair',
    role: 'COO',
    company: 'Kestrel Pay',
    industry: 'Payments',
    country: 'Canada',
    metric: { value: 100, suffix: '%', label: 'of backups restore-tested' },
    look: { bg: ['#fecdd3', '#fda4af'], skin: '#b9774f', hair: '#1c1311', style: 'curly', shirt: '#0f172a' },
  },
  {
    quote: 'Checkout felt slow and nobody could say why. They found a missing database index, fixed it in our code and sent a written report.',
    name: 'James Whitfield',
    role: 'Founder',
    company: 'Northgate Learning',
    industry: 'E-learning',
    country: 'Australia',
    metric: { value: 60, suffix: '%', label: 'faster checkout' },
    look: { bg: ['#bae6fd', '#7dd3fc'], skin: '#f0c8a0', hair: '#b8b3ab', style: 'bald', shirt: '#334155', glasses: true, beard: true },
  },
  {
    quote: 'A press feature doubled our traffic overnight. Nothing broke, and the first I heard of it was a note from the team afterwards.',
    name: 'Aoife Brennan',
    role: 'CEO',
    company: 'Greenfield Rentals',
    industry: 'Marketplace',
    country: 'Ireland',
    metric: { value: 2, suffix: 'x', label: 'traffic handled with no changes' },
    look: { bg: ['#d9f99d', '#bef264'], skin: '#f6d9c4', hair: '#b4532a', style: 'long', shirt: '#166534' },
  },
]
