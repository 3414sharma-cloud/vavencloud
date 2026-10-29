import type { Section } from '@/app/types.ts'
import { qsa } from '@/shared/lib/dom.ts'
import { getPalette, setPalette, type Palette } from '@/shared/lib/palette.ts'

/** Swatches use fixed colours (each palette's brand-500), so they look the same whichever palette is on. */
const options: { value: Palette; label: string; swatch: string }[] = [
  { value: 'petrol', label: 'Petrol', swatch: '#0f828d' },
  { value: 'sky', label: 'Sky', swatch: '#117ab4' },
]

/**
 * Floating Petrol / Sky switch (bottom left) for comparing the two palettes on the live page.
 * Native radios, so it works with the keyboard and screen readers as-is. Rendered by createPage()
 * while `site.paletteSwitcher` is true; turn that off once a palette is chosen.
 */
export function paletteSwitcher(): Section {
  return {
    html: `
<fieldset id="palette-switch" class="fixed bottom-4 left-4 z-[60] flex items-center gap-2 rounded-full border border-neutral-950/10 bg-white/90 p-1 pl-3.5 shadow-[0_10px_30px_-12px_rgb(40_32_20/0.35)] backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/90 dark:shadow-[0_10px_30px_-12px_rgb(0_0_0/0.8)]">
  <legend class="sr-only">Colour palette</legend>
  <span class="text-xs font-medium text-neutral-500" aria-hidden="true">Palette</span>
  <div class="flex gap-0.5">
    ${options
      .map(
        (o) => `
    <label class="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:text-neutral-950 has-checked:bg-neutral-950 has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-600 dark:text-neutral-400 dark:hover:text-white dark:has-checked:bg-white dark:has-checked:text-neutral-950">
      <input type="radio" name="palette" value="${o.value}" class="sr-only" />
      <span class="h-3 w-3 shrink-0 rounded-full ring-2 ring-white/70 dark:ring-black/30" style="background:${o.swatch}" aria-hidden="true"></span>${o.label}
    </label>`,
      )
      .join('')}
  </div>
</fieldset>`,
    init() {
      const radios = qsa<HTMLInputElement>('#palette-switch input[name="palette"]')
      const current = getPalette()
      radios.forEach((r) => {
        r.checked = r.value === current
        r.addEventListener('change', () => r.checked && setPalette(r.value as Palette))
      })
    },
  }
}
