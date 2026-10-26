/**
 * Light / dark theme. Light (white background, black text) is the default for everyone;
 * dark is opt-in via the header toggle or the footer switch ("System" follows the OS).
 * The first paint is handled by the inline boot script in vite.config.ts (same storage key).
 */
export type ThemePreference = 'system' | 'light' | 'dark'
export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'vc-theme-choice'
const EVENT = 'vc:themechange'
const THEME_COLORS: Record<Theme, string> = { light: '#ffffff', dark: '#0a0a0a' }

const systemDark = window.matchMedia('(prefers-color-scheme: dark)')

export function getThemePreference(): ThemePreference {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'dark' || saved === 'system' ? saved : 'light'
  } catch {
    return 'light' // storage blocked (e.g. strict privacy mode)
  }
}

/** The theme actually shown right now. */
export function getTheme(): Theme {
  const pref = getThemePreference()
  if (pref !== 'system') return pref
  return systemDark.matches ? 'dark' : 'light'
}

function applyTheme(): void {
  const theme = getTheme()
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
  window.dispatchEvent(new CustomEvent(EVENT))
}

export function setThemePreference(pref: ThemePreference): void {
  try {
    if (pref === 'light') localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, pref)
  } catch {
    /* not persisted, still applied for this visit */
  }
  applyTheme()
}

/** Runs `callback` now and after every theme change (user choice or OS switch). */
export function onThemeChange(callback: () => void): void {
  window.addEventListener(EVENT, callback)
  callback()
}

/** Call once per page: applies the theme and follows OS changes while the preference is "system". */
export function initTheme(): void {
  applyTheme()
  systemDark.addEventListener('change', () => {
    if (getThemePreference() === 'system') applyTheme()
  })
}
