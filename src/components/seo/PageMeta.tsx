interface PageMetaProps {
  title: string
  description: string
  /** For link previews (social sharing); only the landing page sets them */
  og?: { title: string; description: string }
}

/** A page's <title> and description. React puts them in <head>, and swaps them as the page changes. */
export function PageMeta({ title, description, og }: PageMetaProps) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {og && <meta property="og:title" content={og.title} />}
      {og && <meta property="og:description" content={og.description} />}
    </>
  )
}
