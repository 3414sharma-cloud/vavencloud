import type { IconName } from '@/shared/ui/icons.ts'

/*
 * "A typical production handoff": one night, one step per screen, with three vendors and with VavenCloud.
 * Times are minutes past 02:00. It is the incident in the report section (checkout slow at 02:14, fixed at
 * 02:41, report at 09:00). An illustration, not a real customer.
 */

export const intro =
  'Your host keeps the server alive. Your DevOps freelancer set up the pipeline last year. Your developers wrote the code. When checkout fails at 2am, each of them can honestly say it isn’t their problem. So it becomes yours.'

/** What happens on one side at a step */
export interface Moment {
  /** Who is involved, shown with their icon */
  who: string
  icon: IconName
  /** The time beside who, when it isn't the step's own */
  clock?: string
  text: string
  /** What came back, as a chat bubble */
  reply?: string
  /** A short verdict, stamped on the panel */
  verdict?: string
}

export interface Step {
  /** Minutes past 02:00 */
  at: number
  label: string
  vendors: Moment
  vaven: Moment
}

/** The night runs from the outage to 03:00; VavenCloud's side is fixed at 02:41 */
export const night = { start: 14, fixed: 41, end: 60 }

export const steps: Step[] = [
  {
    at: 14,
    label: 'It breaks',
    vendors: { who: 'Your checkout', icon: 'zap', text: 'Checkout is down. Customers can’t pay.', reply: 'Error 504 on every order.' },
    vaven: { who: 'Monitoring', icon: 'activity', text: 'The on-call engineer is paged.', reply: 'You’re asleep.' },
  },
  {
    at: 16,
    label: 'The first call',
    vendors: { who: 'Your host', icon: 'server', text: 'You call your host.', reply: '“Your server is running normally.”', verdict: 'Not our problem' },
    vaven: { who: 'Your engineer', icon: 'support', clock: '02:19', text: 'Your engineer is on it.', reply: '“Looking at the database and the last deployment.”' },
  },
  {
    at: 31,
    label: 'The second call',
    vendors: { who: 'Your DevOps freelancer', icon: 'infinity', text: 'You message your freelancer.', reply: 'Seen. No reply.', verdict: 'No answer' },
    vaven: { who: 'Your engineer', icon: 'search', text: 'Cause found.', reply: 'A missing database index on the orders table.' },
  },
  {
    at: 41,
    label: 'The third call',
    vendors: { who: 'Your developers', icon: 'code', clock: '02:40', text: 'You call your developers.', reply: '“It works on our machines.”', verdict: 'Not our code' },
    vaven: { who: 'Your engineer', icon: 'check', text: 'Fixed and verified.', reply: 'Checkout is fast again.', verdict: 'Fixed' },
  },
  {
    at: 60,
    label: 'By morning',
    vendors: { who: 'You', icon: 'clock', text: 'Still down. Nobody owns it.', reply: 'You’re still on the phone.' },
    vaven: { who: 'Your inbox', icon: 'mail', clock: '09:00', text: 'A written report is waiting.', reply: 'What happened, why, and what we changed.' },
  },
]
