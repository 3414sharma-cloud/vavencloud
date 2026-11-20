/* The shape of a legal page's copy (./data). Plain text throughout; React escapes it. */

interface LegalTable {
  headers: readonly string[]
  rows: readonly (readonly string[])[]
}

export interface LegalSection {
  heading: string
  body?: readonly string[]
  list?: readonly string[]
  table?: LegalTable
  bodyAfter?: readonly string[]
  links?: readonly { label: string; href: string }[]
  contact?: { email: string; address?: string }
}

export interface LegalPage {
  title: string
  subtitle?: string
  intro?: string
  effectiveDate?: string
  /** The page's <title> and description (data/*.ts) */
  seoTitle?: string
  seoDescription?: string
  sections: readonly LegalSection[]
}
