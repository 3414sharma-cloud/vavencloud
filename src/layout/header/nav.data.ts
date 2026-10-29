import { routes } from '@/app/routes.ts'

export interface NavLink {
  label: string
  href: string
}

/** Landing page sections, in page order (docs/messaging.md). */
export const navLinks: NavLink[] = [
  { label: 'One team', href: routes.oneTeam },
  { label: 'Compare', href: routes.compare },
  { label: 'How it works', href: routes.process },
  { label: 'Plans', href: routes.plans },
  { label: 'Platform', href: routes.platform },
  { label: 'Proof', href: routes.proof },
  { label: 'FAQ', href: routes.faq },
]

/** Thin bar above the navigation. Change `id` when the message changes, so dismissed bars show again. */
export const topBar = {
  id: 'founding-2026-10',
  text: "Founding client program: we're taking on 5 founders this month.",
  link: { label: 'Reserve your free review', href: routes.book },
}
