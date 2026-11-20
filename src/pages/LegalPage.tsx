import { PageMeta } from '@/components/seo/PageMeta.tsx'
import { LegalDocument } from '@/features/legal/Legal.tsx'
import type { LegalPage as LegalCopy } from '@/features/legal/legal.types.ts'
import { useAutoReveal } from '@/hooks/useAutoReveal.ts'

/** A legal page (terms, privacy, acceptable use, SLA, trust & security) */
export function LegalPage({ page, path }: { page: LegalCopy; path: string }) {
  useAutoReveal()
  return (
    <>
      <PageMeta title={page.seoTitle ?? `${page.title} | VavenCloud`} description={page.seoDescription ?? ''} />
      <LegalDocument page={page} current={path} />
    </>
  )
}
