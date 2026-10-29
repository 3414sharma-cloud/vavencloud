/**
 * Every internal link in one place. The site is a single landing page for now, so these are
 * section anchors. Prefixed with "/" so they keep working if more pages are added later.
 */
export const routes = {
  home: '/',
  about: '/about/',
  top: '/#top',
  problem: '/#problem',
  oneTeam: '/#one-team',
  compare: '/#compare',
  process: '/#how-it-works',
  plans: '/#plans',
  platform: '/#platform',
  proof: '/#proof',
  faq: '/#faq',
  /** Every "Book a free review" button leads here (final call to action + booking form) */
  book: '/#book',
  contact: '/#book',
  // Kept for the older, currently unused pricing modules.
  clients: '/#proof',
  pricing: '/#plans',
  webHosting: '/#plans',
  cloudServices: '/#plans',
} as const

export type Route = (typeof routes)[keyof typeof routes]
