/**
 * Every internal link in one place. The site is a single landing page for now, so these are
 * section anchors. Prefixed with "/" so they keep working if more pages are added later.
 */
export const routes = {
  home: '/',
  top: '/#top',
  builtBy: '/#built-by',
  find: '/#find',
  services: '/#services',
  process: '/#process',
  whyUs: '/#why-us',
  plans: '/#plans',
  faq: '/#faq',
  contact: '/#contact',
  // Kept for the (currently unused) pricing modules; there is no pricing page right now.
  clients: '/#clients',
  pricing: '/#plans',
  webHosting: '/#plans',
  cloudServices: '/#plans',
} as const

export type Route = (typeof routes)[keyof typeof routes]
