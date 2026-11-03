interface SectionHeadingOptions {
  /** Small label above the title, shown as a pill. May contain inline HTML */
  eyebrow?: string
  /** May contain inline HTML. An <em> goes on its own line in the brand colour, like the hero's second line */
  title: string
  description?: string
  /** The title's id, for the section's aria-labelledby */
  id?: string
  /** h3 for a heading inside a section */
  tag?: 'h2' | 'h3'
  /** Kept for the older modules; the landing page follows the light/dark theme instead. */
  tone?: 'light' | 'dark'
}

/** Eyebrow + title + lead at the top of every section, in the hero's type. Wrap it to control alignment/width. */
export function sectionHeading({ eyebrow, title, description, id, tag = 'h2' }: SectionHeadingOptions): string {
  return `
    ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
    <${tag} ${id ? `id="${id}"` : ''} class="section-title ${eyebrow ? 'mt-6' : ''}">${title}</${tag}>
    ${description ? `<p class="section-lead mt-7">${description}</p>` : ''}`
}
