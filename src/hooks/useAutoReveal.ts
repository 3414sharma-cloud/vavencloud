import { useEffect } from 'react'
import { initAutoReveal } from '@/lib/reveal.ts'

/**
 * The scroll reveal for a page's sections (lib/reveal.ts): headings, cards and tables rise in as they come into
 * view. Called by each page component; its effect runs after its sections' own, so they're all on screen.
 */
export function useAutoReveal(): void {
  useEffect(() => initAutoReveal(), [])
}
