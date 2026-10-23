/**
 * Every internal link in one place. When you add a page (e.g. src/pages/pricing/index.html),
 * add its URL here and link to it via `routes.pricing`.
 * Anchors are prefixed with "/" so they also work from other pages.
 */
export const routes = {
  home: '/',
  top: '/#top',
  services: '/#services',
  whyUs: '/#why-us',
  clients: '/#clients',
  faq: '/#faq',
  contact: '/#contact',
  pricing: '/pricing/',
  // No dedicated pages yet: these deep-link into the pricing tabs (see pricing.section.ts)
  webHosting: '/pricing/#web-hosting',
  cloudServices: '/pricing/#cloud-services',
} as const

export type Route = (typeof routes)[keyof typeof routes]
