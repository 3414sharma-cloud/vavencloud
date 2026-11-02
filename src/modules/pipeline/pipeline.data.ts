import type { IconName } from '@/shared/ui/icons.ts'

export interface PipelineStage {
  id: string
  /** Short name in the step index */
  name: string
  icon: IconName
  /** When it happens */
  when: string
  title: string
  description: string
  deliverables: string[]
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
  },
]
