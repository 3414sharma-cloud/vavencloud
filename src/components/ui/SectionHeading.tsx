import { cn } from '@/lib/cn.ts'
import { sectionLead, sectionTitle } from './classes.ts'

interface SectionHeadingProps {
  title: string
  description?: string
  /** The title's id, for the section's aria-labelledby */
  id?: string
  /** h3 for a heading inside a section */
  tag?: 'h2' | 'h3'
  /** A heading across the page (Plans, FAQ): the title a little smaller, so each of its lines fits on one line on a wide screen, and the lead wider, in at most two lines */
  wide?: boolean
  /** Classes for the title and the lead, over their own */
  titleClassName?: string
  leadClassName?: string
}

/**
 * A section's heading: its title, and the paragraph under it. The title and description may contain inline HTML
 * from our own data files (e.g. an <em> in a title), so they're set as HTML. Never pass user input here.
 */
export function SectionHeading({
  title,
  description,
  id,
  tag: Tag = 'h2',
  wide,
  titleClassName,
  leadClassName,
}: SectionHeadingProps) {
  return (
    <>
      <Tag
        id={id}
        className={cn(sectionTitle, wide && 'text-[length:clamp(2.25rem,4.6vw,4.4rem)]', titleClassName)}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      {description && (
        <p
          className={cn(sectionLead, 'mt-7', wide && 'max-w-[60rem]', leadClassName)}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </>
  )
}
