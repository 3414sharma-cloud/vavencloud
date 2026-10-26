import type { IconName } from '@/shared/ui/icons.ts'

export interface PipelineStage {
  id: string
  /** Short name on the pipeline node */
  name: string
  icon: IconName
  /** When it happens */
  when: string
  title: string
  description: string
  deliverables: string[]
  /** Console lines "streamed" for this stage. `$` = command, `>` = progress, `ok` = done */
  log: { kind: '$' | '>' | 'ok'; text: string }[]
}

/** "We take it from here" (docs/messaging.md, supporting message 2): what happens once they bring the product. */
export const pipeline: PipelineStage[] = [
  {
    id: 'bring',
    name: 'Bring it',
    icon: 'code',
    when: 'Day 1',
    title: 'Show us what you have',
    description:
      "Code, a live site or a prototype made with AI tools. Tell us what it does and who uses it. We'll take a look and give you a clear plan.",
    deliverables: ['A free look at your product', 'The right setup for it', 'A clear, fixed quote'],
    log: [
      { kind: '$', text: 'vaven check ./your-app' },
      { kind: '>', text: 'Found: Node.js app + PostgreSQL' },
      { kind: '>', text: 'No changes needed to your code' },
      { kind: 'ok', text: 'Plan ready for you' },
    ],
  },
  {
    id: 'move',
    name: 'Moved over',
    icon: 'layers',
    when: 'Days 2–3',
    title: 'Moved to your platform',
    description:
      'We set up your servers and copy your code, data and email across. Your current site stays up the whole time.',
    deliverables: ['Servers set up for your app', 'Files, databases and email moved', 'SSL and DNS ready'],
    log: [
      { kind: '$', text: 'vaven move --from current-host' },
      { kind: '>', text: 'Copying files and databases' },
      { kind: '>', text: 'Mailboxes moved · SSL issued' },
      { kind: 'ok', text: 'Everything is on your platform' },
    ],
  },
  {
    id: 'deploy',
    name: 'Deployed & tested',
    icon: 'rocket',
    when: 'Launch week',
    title: 'Deployed and tested',
    description:
      "We deploy to a private copy first and test it with you. When it's right, we switch it live at a quiet hour.",
    deliverables: ['A private copy to test on', 'Checked before go-live', 'Rollback ready, just in case'],
    log: [
      { kind: '$', text: 'vaven deploy --test-first' },
      { kind: '>', text: 'Health checks 12/12 passing' },
      { kind: '>', text: 'Traffic switched · DNS updated' },
      { kind: 'ok', text: 'Your app is live' },
    ],
  },
  {
    id: 'monitor',
    name: 'Monitored & backed up',
    icon: 'activity',
    when: 'Every day after',
    title: 'Monitored and backed up',
    description:
      'We watch it day and night, back it up every night and add room before a busy day turns into a problem.',
    deliverables: ['24/7 uptime monitoring', 'Nightly off-site backups', 'Security patches applied'],
    log: [
      { kind: '$', text: 'vaven status --watch' },
      { kind: '>', text: 'Uptime 99.99% · response 182 ms' },
      { kind: '>', text: 'Nightly backup completed' },
      { kind: 'ok', text: 'Extra capacity added for your peak' },
    ],
  },
  {
    id: 'oncall',
    name: 'Someone to call',
    icon: 'support',
    when: 'Whenever you need us',
    title: 'Someone to call when it breaks',
    description:
      'Something feels off? Call, chat or email. A real engineer picks up, looks at your product and fixes it with you.',
    deliverables: ['Real engineers, 24/7', 'A fast first reply', "Clear updates until it's fixed"],
    log: [
      { kind: '$', text: 'vaven help --now' },
      { kind: '>', text: 'Engineer assigned · looking now' },
      { kind: '>', text: 'Cause found: database disk full' },
      { kind: 'ok', text: "Fixed · you're back to normal" },
    ],
  },
]
