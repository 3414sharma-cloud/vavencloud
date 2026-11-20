import { planTerms } from '@/features/shared/plan-terms.ts'

/*
 * The placeholder register from "VavenCloud Legal Pages v1": every value in [SQUARE BRACKETS] on the legal pages,
 * in one place. Fill a value here and it appears on every page that uses it. While a value is empty, the
 * placeholder is shown highlighted, so it can't be missed on staging.
 *
 * Do not go live until every value is filled. The same values must match the landing page, the plans and the
 * FAQ ("change it in one place, change it everywhere"). The PDF's suggested starting point is in each comment.
 *
 * The plan values (response times, code-fix hours, Essential's scope, backups) come from the shared plan numbers
 * (features/shared/plan-terms.ts, from "VavenCloud Plans: Essential, Managed, Partner"), the same ones the plan
 * cards and comparison use. Change them there, not here. The rest are still to be decided.
 *
 * The PDF uses one [RESPONSE TIME] and one [SEV-2 TIME] for all three plans in the SLA table; they are split
 * per plan here because the values differ per plan.
 */
const { criticalResponse, highResponse, codeFixHours, serverLimit, backupDays } = planTerms

export const legalValues: Record<string, string> = {
  /** All pages. Suggested: the date the pages go live */
  'EFFECTIVE DATE': '',

  /* SLA: Severity 1 and 2 response, per plan (plan-terms.ts) */
  'ESSENTIAL RESPONSE TIME': criticalResponse.essential,
  'MANAGED RESPONSE TIME': criticalResponse.managed,
  'PARTNER RESPONSE TIME': criticalResponse.partner,
  'ESSENTIAL SEV-2 TIME': highResponse.essential,
  'MANAGED SEV-2 TIME': highResponse.managed,
  'PARTNER SEV-2 TIME': highResponse.partner,

  /** Terms §6: "Managed and Partner plans include … of code fixes each month" */
  'CODE-FIX HOURS': `${codeFixHours.managed} hours (Managed) and ${codeFixHours.partner} hours (Partner, with priority)`,
  /** Terms §5: "Essential starts at $100 a month and covers …" */
  'ESSENTIAL PLAN SCOPE': `a shared senior team, one production environment of up to ${serverLimit.essential} servers or services, monitoring, daily backups kept ${backupDays.essential} days and monthly patching`,

  /** SLA: monthly uptime for servers on VavenCloud. Suggested: 99.9% */
  'UPTIME TARGET': '',
  /** SLA §9, Trust: backups and restore tests, per plan */
  'BACKUP SCHEDULE': `daily backups kept ${backupDays.essential} days on Essential; daily backups kept ${backupDays.managed} days with a quarterly restore test on Managed; hourly database snapshots kept ${backupDays.partner} days with a monthly restore test and a disaster recovery plan on Partner`,
  /** Terms: notice to cancel or change plan. Suggested: 30 days */
  'NOTICE PERIOD': '',
  /** Terms: when invoices are due. Suggested: 7 days */
  'PAYMENT TERMS': '',
  /** Terms: maximum liability. Suggested: the fees paid in the previous 12 months */
  'LIABILITY CAP': '',
  /** Terms, Privacy: how long data is kept after a client leaves. Suggested: 30 days, then deleted */
  'EXIT RETENTION': '',
  /** Privacy, Trust: provider and regions behind VavenCloud infrastructure */
  'DATA CENTRES': '',
  /** Privacy, Trust: third parties that touch client data (cloud host, email, billing, chat) */
  'SUB-PROCESSORS': '',
  /**
   * Trust: any certification held or in progress. If none, set this to a single space (' ') so the placeholder
   * disappears. Never claim a certification (SOC 2, ISO 27001) that isn't held.
   */
  'CERTIFICATIONS STATUS': '',
  /** Terms: law and courts that apply. Suggested: the laws of India, courts at Mohali, Punjab */
  'GOVERNING LAW': '',
  /** Privacy: named person for complaints (Indian IT Rules): name and email */
  'GRIEVANCE OFFICER': '',
  /** SLA: 24/7 line for critical incidents. Decide whether to publish one */
  'EMERGENCY PHONE': '',
}

/*
 * Mailboxes the pages use: legal@, privacy@, security@, abuse@ and support@vavencloud.com (and sales@).
 * Create them, or route them all to one inbox, before going live.
 */
