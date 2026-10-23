interface SectionHeadingOptions {
  /** Small pill label above the title */
  eyebrow?: string
  /** May contain inline HTML, e.g. `Our <span class="text-brand-600">services</span>` */
  title: string
  description?: string
  /** `dark` = for sections on an ink background */
  tone?: 'light' | 'dark'
}

/** Eyebrow + h2 + intro text used at the top of most sections. Wrap it to control alignment/width. */
export function sectionHeading({ eyebrow, title, description, tone = 'light' }: SectionHeadingOptions): string {
  const dark = tone === 'dark'
  return `
    ${eyebrow ? `<span class="${dark ? 'eyebrow-dark' : 'eyebrow'}">${eyebrow}</span>` : ''}
    <h2 class="section-title ${eyebrow ? 'mt-4' : ''} ${dark ? 'text-white' : ''}">${title}</h2>
    ${description ? `<p class="mt-5 text-lg ${dark ? 'text-slate-400' : 'text-slate-600'}">${description}</p>` : ''}`
}
