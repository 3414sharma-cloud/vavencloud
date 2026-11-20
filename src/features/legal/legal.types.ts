/*
 * The shape of a legal page's copy (./data), from "VavenCloud Legal Pages v1". Every string may use three bits of
 * inline markup, turned into elements by Legal.tsx (React still escapes the text):
 *  - **Bold lead-in:** the bold label that starts many paragraphs and list items
 *  - [PLACEHOLDER]   a value still to be decided, filled from legal.values.ts and highlighted until then
 *  - name@vavencloud.com   becomes a mailto link
 */

interface LegalTable {
  headers: readonly string[]
  rows: readonly (readonly string[])[]
}

/** A paragraph (a plain string), a bulleted or numbered list, or a table */
export type LegalBlock = string | { list: readonly string[]; ordered?: boolean } | { table: LegalTable }

export interface LegalSection {
  heading: string
  blocks: readonly LegalBlock[]
}

export interface LegalPage {
  title: string
  /** Shown as "Last updated: …" under the title */
  lastUpdated: string
  intro: string
  /** The page's <title> and description */
  seoTitle: string
  seoDescription: string
  sections: readonly LegalSection[]
}
