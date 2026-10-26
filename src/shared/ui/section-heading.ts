interface SectionHeadingOptions {
  /** Small label above the title */
  eyebrow?: string
  /** May contain inline HTML */
  title: string
  description?: string
  /** Kept for the older modules; the landing page follows the light/dark theme instead. */
  tone?: 'light' | 'dark'
}

/** Eyebrow + h2 + intro text used at the top of most sections. Wrap it to control alignment/width. */
export function sectionHeading({ eyebrow, title, description }: SectionHeadingOptions): string {
  return `
    ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
    <h2 class="section-title ${eyebrow ? 'mt-5' : ''}">${title}</h2>
    ${description ? `<p class="section-lead mt-5">${description}</p>` : ''}`
}
