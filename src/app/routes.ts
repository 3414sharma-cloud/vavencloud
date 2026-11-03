/**
 * Every internal link in one place. The site is a single landing page for now, so these are
 * section anchors. Prefixed with the landing page's path so they keep working from other pages.
 *
 * The landing page has a v2 at /v2/ with its own copy of these sections, so on /v2/ the anchors point at
 * /v2/ (a visitor stays on the version they're reading). Everywhere else they point at /, as before.
 */
const landing = typeof location !== 'undefined' && location.pathname.startsWith('/v2') ? '/v2/' : '/'

export const routes = {
  home: landing,
  about: '/about/',
  top: `${landing}#top`,
  oneTeam: `${landing}#one-team`,
  /** v2 has no "how it works" chapter: there, it goes to what you get after an incident (the report) */
  process: landing === '/v2/' ? `${landing}#report` : `${landing}#how-it-works`,
  plans: `${landing}#plans`,
  proof: `${landing}#proof`,
  faq: `${landing}#faq`,
  /** Every "Book a free review" button leads here (final call to action + booking form) */
  book: `${landing}#book`,
  contact: `${landing}#book`,
  // Kept for the older, currently unused pricing modules.
  clients: `${landing}#proof`,
  pricing: `${landing}#plans`,
  webHosting: `${landing}#plans`,
  cloudServices: `${landing}#plans`,
}

export type Route = (typeof routes)[keyof typeof routes]
