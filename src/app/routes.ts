/**
 * Every internal link in one place. Most are sections of the landing page (/, built from src/pages/v5/),
 * written as "/#plans" so they work from every page.
 */
const landing = '/'

export const routes = {
  home: landing,
  /** The team page: the co-founders and the engineers (opened from "Meet the whole Vavensoft team", and the "About" links) */
  team: '/team/',
  /** The price comparison: the same servers and cover on AWS, Azure and VavenCloud */
  comparison: '/comparison/',
  top: `${landing}#top`,
  oneTeam: `${landing}#one-team`,
  /** There's no "how it works" chapter: it goes to what you get after an incident (the report) */
  process: `${landing}#report`,
  plans: `${landing}#plans`,
  /** Every "Book a free review" button leads here (final call to action + booking form) */
  book: `${landing}#book`,
}
