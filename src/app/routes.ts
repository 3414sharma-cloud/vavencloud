/**
 * Every internal link in one place. The site is a single landing page for now, so these are
 * section anchors. Prefixed with the landing page's path so they keep working from other pages.
 *
 * The landing page has versions at /v2/ and /v3/ with their own copy of these sections, so on a version the
 * anchors point at that version (a visitor stays on the one they're reading). Everywhere else they point at /.
 */
const version = typeof location !== 'undefined' ? /^\/(v\d+)(\/|$)/.exec(location.pathname)?.[1] : undefined
const landing = version ? `/${version}/` : '/'

export const routes = {
  home: landing,
  about: '/about/',
  top: `${landing}#top`,
  oneTeam: `${landing}#one-team`,
  /** The versions have no "how it works" chapter: there, it goes to what you get after an incident (the report) */
  process: version ? `${landing}#report` : `${landing}#how-it-works`,
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
