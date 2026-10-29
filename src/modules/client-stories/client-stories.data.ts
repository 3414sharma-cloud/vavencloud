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
    look: { bg: ['var(--color-brand-100)', 'var(--color-brand-300)'], skin: '#f1c9a5', hair: '#1f1a17', style: 'long', shirt: '#ae5528' },
  },
  {
    quote: 'We used to pay a host, a DevOps freelancer and an agency separately. Now it is one monthly fee, one chat and a team that knows our product.',
    name: 'Daniel Okafor',
    role: 'CTO',
    company: 'Parcelwise',
    industry: 'Logistics platform',
    country: 'United Kingdom',
    metric: { value: 38, suffix: '%', label: 'lower infrastructure spend' },
    look: { bg: ['#def2e1', '#a1cea9'], skin: '#8d5a3b', hair: '#17120f', style: 'short', shirt: 'var(--color-brand-800)', glasses: true },
  },
  {
    quote: 'They moved us across at 5am on a Sunday. Our customers never noticed, and I only found out when the report landed in my inbox.',
    name: 'Sofia Marin',
    role: 'Co-founder',
    company: 'Fieldnote',
    industry: 'Field service app',
    country: 'Spain',
    metric: { value: 0, suffix: ' min', label: 'downtime during migration' },
    look: { bg: ['#f6ead2', '#e9cf9c'], skin: '#e0ac86', hair: '#4a2c1a', style: 'bun', shirt: 'var(--color-brand-700)' },
  },
  {
    quote: 'I used to sleep with my phone on the pillow. Now an engineer with a name and a face is on call, and I sleep.',
    name: 'Tom Becker',
    role: 'Founder',
    company: 'Brightloop',
    industry: 'Marketing analytics',
    country: 'Germany',
    metric: { value: 90, suffix: ' days', label: 'without a night-time page' },
    look: { bg: ['#f5e3ea', '#e6b9cb'], skin: '#f3d2b3', hair: '#7a5232', style: 'short', shirt: '#2b2923', beard: true },
  },
  {
    quote: 'Audit season used to be a fire drill. Backups, access logs and runbooks are simply there now, written down and tested.',
    name: 'Priya Nair',
    role: 'COO',
    company: 'Kestrel Pay',
    industry: 'Payments',
    country: 'Canada',
    metric: { value: 100, suffix: '%', label: 'of backups restore-tested' },
    look: { bg: ['#ffe6db', '#f6b294'], skin: '#b9774f', hair: '#1c1311', style: 'curly', shirt: '#325b3b' },
  },
  {
    quote: 'Checkout felt slow and nobody could say why. They found a missing database index, fixed it in our code and sent a written report.',
    name: 'James Whitfield',
    role: 'Founder',
    company: 'Northgate Learning',
    industry: 'E-learning',
    country: 'Australia',
    metric: { value: 60, suffix: '%', label: 'faster checkout' },
    look: { bg: ['#ece8e1', '#cfc9bf'], skin: '#f0c8a0', hair: '#b8b3ab', style: 'bald', shirt: '#8d4521', glasses: true, beard: true },
  },
  {
    quote: 'A press feature doubled our traffic overnight. Nothing broke, and the first I heard of it was a note from the team afterwards.',
    name: 'Aoife Brennan',
    role: 'CEO',
    company: 'Greenfield Rentals',
    industry: 'Marketplace',
    country: 'Ireland',
    metric: { value: 2, suffix: 'x', label: 'traffic handled with no changes' },
    look: { bg: ['var(--color-brand-100)', 'var(--color-brand-300)'], skin: '#f6d9c4', hair: '#b4532a', style: 'long', shirt: '#325b3b' },
  },
]
