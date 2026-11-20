import { useSyncExternalStore } from 'react'
import { getTheme, getThemePreference, subscribeTheme } from '@/lib/theme.ts'

/** The visitor's theme choice (light, dark or system), kept up to date as it changes anywhere on the page */
export const useThemePreference = () => useSyncExternalStore(subscribeTheme, getThemePreference)

/** The theme actually shown (light or dark), kept up to date */
export const useTheme = () => useSyncExternalStore(subscribeTheme, getTheme)
