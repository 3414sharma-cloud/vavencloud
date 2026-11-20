import { extendTailwindMerge } from 'tailwind-merge'

/*
 * A font size doesn't replace a line height here. tailwind-merge drops `leading-*` before a later `text-*`, but
 * in Tailwind v4 an explicit `leading-*` always wins over a named size's own line height, and an arbitrary size
 * (`text-[length:…]`) sets the font size alone, so both have to stay.
 */
const twMerge = extendTailwindMerge({ override: { conflictingClassGroups: { 'font-size': [] } } })

/**
 * Joins class lists, dropping the empty ones, and lets a later class replace an earlier one for the same
 * property (`cn(card, 'rounded-[1.4rem]')` keeps only the 1.4rem radius). Two Tailwind classes for one property
 * on the same element would otherwise be decided by the stylesheet's order, not by the markup's.
 */
export const cn = (...parts: (string | false | null | undefined)[]): string => twMerge(parts.filter(Boolean).join(' '))
