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

/** "How it works" (VavenCloud-Sample-Content.md): the five steps from first call to fully covered. */
export const pipeline: PipelineStage[] = [
  {
    id: 'review',
    name: 'Free review',
    icon: 'search',
    when: '45 minutes',
    title: 'Free production review',
    description:
      'A senior engineer learns your product, your business model and how it runs today. No slides, no pitch. Just an honest look at what’s working and what’s at risk.',
    deliverables: ['A senior engineer, not a salesperson', 'How your product runs today', 'What’s working and what’s at risk'],
    log: [
      { kind: '$', text: 'review --product yourapp.example' },
      { kind: '>', text: 'Hosting, deploys, backups, monitoring' },
      { kind: '>', text: 'Business model and growth plans' },
      { kind: 'ok', text: 'Review done · roadmap in progress' },
    ],
  },
  {
    id: 'roadmap',
    name: 'Roadmap',
    icon: 'book',
    when: 'Within 48 hours',
    title: 'Your growth roadmap',
    description:
      'A one-page written plan: the right setup for your budget today, the signals that mean it’s time for the next stage, and what that stage will look like and cost. It’s yours to keep, even if you never work with us.',
    deliverables: ['The right setup for your budget', 'Signals for the next stage', 'Yours to keep, either way'],
    log: [
      { kind: '$', text: 'roadmap --write' },
      { kind: '>', text: 'Today: setup and monthly cost' },
      { kind: '>', text: 'Next stage: triggers and cost' },
      { kind: 'ok', text: 'Roadmap sent to your inbox' },
    ],
  },
  {
    id: 'audit',
    name: 'Audit',
    icon: 'shield',
    when: 'Before we take over',
    title: 'Production audit',
    description:
      'Before we take responsibility, we go through your code, infrastructure and security in detail and give you a written list of risks, ranked. You see exactly what we found and why it matters.',
    deliverables: ['Code, infrastructure and security', 'A written list of risks, ranked', 'Why each one matters'],
    log: [
      { kind: '$', text: 'audit --code --infra --security' },
      { kind: '>', text: 'Backups: none tested in 6 months' },
      { kind: '>', text: 'SSL renews manually · no alerts' },
      { kind: 'ok', text: 'Risk list ready · 3 critical, 7 minor' },
    ],
  },
  {
    id: 'migrate',
    name: 'Migration',
    icon: 'layers',
    when: 'At a quiet time',
    title: 'Migration and hardening',
    description:
      'We fix the critical risks, move your product to its new setup and switch over with you at a quiet time for your users. Nothing goes live until you’ve seen it work.',
    deliverables: ['Critical risks fixed first', 'Switch-over at a quiet time', 'Nothing goes live until you’ve seen it work'],
    log: [
      { kind: '$', text: 'migrate --test-first' },
      { kind: '>', text: 'Critical risks fixed and verified' },
      { kind: '>', text: 'Staging copy approved by you' },
      { kind: 'ok', text: 'Switched over · no downtime' },
    ],
  },
  {
    id: 'own',
    name: 'We own it',
    icon: 'activity',
    when: 'Every day after',
    title: 'We own it',
    description:
      'Your engineers are on call 24/7, in your portal and your chat. Every month you get a report: uptime, incidents, changes made and what we recommend next.',
    deliverables: ['On call 24/7, in your portal and chat', 'Monthly report', 'What we recommend next'],
    log: [
      { kind: '$', text: 'status --watch' },
      { kind: '>', text: 'On-call engineer assigned' },
      { kind: '>', text: 'Monitoring, backups, patching' },
      { kind: 'ok', text: 'Monthly report sent' },
    ],
  },
]
