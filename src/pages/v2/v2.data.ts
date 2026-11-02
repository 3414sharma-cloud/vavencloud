import { routes } from '@/app/routes.ts'
import { site } from '@/app/site.config.ts'
import type { LayerId } from '@/modules/one-team/one-team.data.ts'
import type { IconName } from '@/shared/ui/icons.ts'

/*
 * v2 copy that isn't already in a module. Everything else (the night, the layers, the steps, the plans,
 * the reviews) comes from the same data as the landing page, so the two can't drift apart.
 */

/** The header's links: the story's chapters, in reading order. The one on screen is marked as you scroll. */
export const chapters = [
  { label: 'The problem', href: `${routes.home}#problem` },
  { label: 'The fix', href: `${routes.home}#solution` },
  { label: 'Clients', href: `${routes.home}#clients` },
  { label: 'Plans', href: `${routes.home}#plans` },
  { label: 'FAQ', href: `${routes.home}#faq` },
]

/** The design spaces the number out; the link itself comes from site.config.ts */
export const emergency = { label: '+91 90609 79706', href: site.contact.phones[0].href }

/** What three vendors cost you, beyond the outage itself */
export const costs: { icon: IconName; text: string }[] = [
  { icon: 'wallet', text: 'Every minute down costs sales, sign-ups and trust you don’t get back.' },
  { icon: 'code', text: 'Your developers get pulled off the roadmap to fight fires.' },
  { icon: 'phone', text: 'And the 2am call still comes to you.' },
]

/** The fix's layer stack: who usually owns each layer (the three vendors from the problem chapter), and who does with us */
export const owners: Record<LayerId, { before: string; now: string }> = {
  code: { before: 'Your developers', now: 'Vavensoft developers' },
  delivery: { before: 'Your freelancer', now: 'Senior DevOps engineers' },
  infra: { before: 'Your host', now: 'VavenCloud or your cloud' },
}

/** Beside the plans: why saying yes is safe */
export const safety: { icon: IconName; title: string; text: string }[] = [
  { icon: 'search', title: 'Free review first', text: '45 minutes with a senior engineer. You keep the written roadmap either way.' },
  { icon: 'wallet', title: 'One fixed monthly fee', text: 'Agreed after your review. No hourly meter, no surprise invoices.' },
  { icon: 'lock', title: 'Never locked in', text: 'Standard Linux, MySQL and PostgreSQL. Leave any time with everything handed over.' },
]
