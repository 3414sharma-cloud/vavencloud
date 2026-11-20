import type { IconName } from '@/components/ui/icons.ts'

/* ---------- Who VavenCloud is: on the landing page ("who's behind it") and the team page ---------- */

export const behindIntro =
  'VavenCloud is the managed cloud side of Vavensoft, a software company building AI products, SaaS platforms, mobile apps and cloud systems for founders, mainly in the US and Europe, since 2022.'

/* TODO: confirm every figure before launch */
export const behindStats: { value: string; label: string }[] = [
  { value: '210+', label: 'products delivered by Vavensoft' },
  { value: '99%', label: 'of clients come back for more work' },
  { value: '12+ yrs', label: 'of DevOps and cloud engineering' },
  { value: '100%', label: 'Job Success and Top Rated on Upwork' },
]

/** Behind the "rest of the team" button, above the engineers on your account */
export const teamIntro =
  'A senior bench of DevOps, DevSecOps and full-stack engineers. On the Partner plan, a named lead engineer knows your product inside out.'

/** The people who look after your product, by team. Roles only, no invented names (docs/messaging.md). */
export const accountTeam: { role: string; focus: string; icon: IconName }[] = [
  { role: 'DevOps engineers', focus: 'Deployments, monitoring and the 24/7 on-call rota', icon: 'activity' },
  { role: 'Cloud and database engineers', focus: 'Servers, PostgreSQL, MySQL and backups', icon: 'server' },
  { role: 'Security engineers', focus: 'Firewalls, patching and hardening', icon: 'shield' },
  { role: 'Vavensoft developers', focus: 'Fixes in your code, within your plan', icon: 'code' },
]
