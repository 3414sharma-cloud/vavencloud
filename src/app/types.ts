/**
 * A self-contained block of a page (hero, FAQ, footer, ...).
 * `html` is rendered first; `init` runs once everything is in the DOM (event listeners, effects).
 */
export interface Section {
  html: string
  init?: () => void
}

export interface PageOptions {
  /** Rendered in order inside <main>. */
  sections: Section[]
  /** Optional page-level behaviour that runs after all sections are initialised. */
  init?: () => void
}
