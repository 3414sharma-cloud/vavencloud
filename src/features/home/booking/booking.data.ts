import { site } from '@/app/site.config.ts'

/** The emergency line, as the design spaces the number out; the link itself comes from site.config.ts */
export const emergency = { label: '+91 90609 79706', href: site.contact.phones[0]?.href ?? '' }

/** What happens after the form, shown before it so booking feels small and certain */
export const nextSteps = [
  { title: 'We reply', text: 'Within one business day, to pick a time.' },
  { title: 'Free review', text: '30 minutes with a senior engineer.' },
  { title: 'Written roadmap', text: 'Yours to keep, within 48 hours.' },
]

/** On the confirmation, once the form is sent */
export const afterSteps = [
  site.bookingCalendarUrl
    ? 'Pick a 30-minute slot in the calendar. You’ll then get an invite and a short email from the engineer who’ll run your review.'
    : 'You’ll get a calendar invite and a short email from the engineer who’ll run your review.',
  'Before the call, we’ll take a quick look at your product from the outside, so we don’t waste your time on basics.',
  'Within 48 hours of the call, your written growth roadmap arrives in your inbox.',
]

export const roles = ['Founder or CEO', 'CTO', 'Head of engineering', 'Other']
