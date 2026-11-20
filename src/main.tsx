import '@/styles/main.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App.tsx'
import { site } from '@/app/site.config.ts'
import { qs } from '@/lib/dom.ts'
import { initPalette } from '@/lib/palette.ts'
import { initTheme } from '@/lib/theme.ts'

/*
 * The app's entry (index.html loads it). The theme is already on the page before this runs (index.html's
 * inline script); initTheme follows OS changes from here on.
 */
initTheme()
// Palette preview (Petrol / Sky): applied only while the switch is shown, so a saved choice can't outlive it
if (site.paletteSwitcher) initPalette()
// The app restores the scroll position itself when going back (hooks/useScrollOnNavigate.ts)
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

createRoot(qs<HTMLDivElement>('#app')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
