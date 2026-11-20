import { site } from '@/app/site.config.ts'

interface PageMetaProps {
  title: string
  description: string
  /**
   * The page's own address, as in routes.ts (e.g. "/team/"), for its canonical URL: the one address search
   * engines should list, whichever way the page was opened (with or without a trailing slash, with ?utm_...).
   * Left out on the 404 page.
   */
  path?: string
  /** For link previews (social sharing); only the landing page sets them */
  og?: { title: string; description: string }
}

/** A page's <title>, description and canonical URL. React puts them in <head>, and swaps them as the page changes. */
export function PageMeta({ title, description, path, og }: PageMetaProps) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {path && <link rel="canonical" href={`${site.url}${path}`} />}
      {og && <meta property="og:title" content={og.title} />}
      {og && <meta property="og:description" content={og.description} />}
    </>
  )
}
