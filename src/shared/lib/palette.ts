/**
 * Colour palette preview: Petrol (the default) or Sky. Sky is switched on with data-palette="sky" on
 * <html>; its colour values live in styles/theme.css. The floating switch (shared/ui/palette-switcher.ts)
 * changes it, and the choice is remembered in this browser.
 *
 * No flash on load: the page is rendered by JS and both palettes share the same page background, so
 * applying the saved palette at the start of createPage() is early enough.
 */
export type Palette = 'petrol' | 'sky'

const STORAGE_KEY = 'vc-palette'

/** The palette shown right now. */
export function getPalette(): Palette {
  return document.documentElement.dataset.palette === 'sky' ? 'sky' : 'petrol'
}

function apply(palette: Palette): void {
  const root = document.documentElement
  if (palette === 'sky') root.dataset.palette = 'sky'
  else delete root.dataset.palette
}

export function setPalette(palette: Palette): void {
  apply(palette)
  try {
    if (palette === 'sky') localStorage.setItem(STORAGE_KEY, 'sky')
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* storage blocked: still applied for this visit */
  }
}

/** Applies the palette saved in this browser. Call once per page, before rendering. */
export function initPalette(): void {
  let saved: string | null = null
  try {
    saved = localStorage.getItem(STORAGE_KEY)
  } catch {
    /* storage blocked (e.g. strict privacy mode): Petrol */
  }
  apply(saved === 'sky' ? 'sky' : 'petrol')
}
