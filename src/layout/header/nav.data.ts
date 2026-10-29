import { routes } from '@/app/routes.ts'

export interface NavLink {
  label: string
  href: string
}

/** Core decision paths. The booking button remains the primary action. */
export const navLinks: NavLink[] = [
  { label: 'How we help', href: routes.oneTeam },
  { label: 'How it works', href: routes.process },
  { label: 'Plans', href: routes.plans },
  { label: 'About', href: routes.about },
]

/** Thin bar above the navigation. Change `id` when the message changes, so dismissed bars show again. */
export const topBar = {
  id: 'founding-2026-10',
  text: "Founding client program: we're taking on 5 founders this month.",
  link: { label: 'Reserve your free review', href: routes.book },
}
