/** Background colour of the neighbouring section. Full class names so Tailwind picks them up. */
const fades = {
  white: { top: 'bg-linear-to-b from-white', bottom: 'bg-linear-to-t from-white' },
  'slate-50': { top: 'bg-linear-to-b from-slate-50', bottom: 'bg-linear-to-t from-slate-50' },
} as const

export type EdgeColor = keyof typeof fades

/**
 * Soft straight fade that blends a dark section into its light neighbour (no curves).
 * Place inside a `relative` section and give the section extra padding on that side (~pt/pb-28).
 *
 * @param side     which edge of the section to fade
 * @param neighbor background colour of the section on that side
 */
export function sectionFade(side: 'top' | 'bottom', neighbor: EdgeColor = 'white'): string {
  const pos = side === 'top' ? 'top-0' : 'bottom-0'
  return `
  <div class="pointer-events-none absolute inset-x-0 ${pos} z-[1] h-24 ${fades[neighbor][side]} to-transparent sm:h-32" aria-hidden="true"></div>
  <!-- Navbar colour zone: the near-solid strip at the very edge counts as a light background -->
  <div data-nav="light" class="pointer-events-none absolute inset-x-0 ${pos} h-6" aria-hidden="true"></div>`
}
