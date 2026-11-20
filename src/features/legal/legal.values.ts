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

  /** SLA §9, Trust: backups and restore tests, per plan */
  'BACKUP SCHEDULE': `daily backups kept ${backupDays.essential} days on Essential; daily backups kept ${backupDays.managed} days with a quarterly restore test on Managed; hourly database snapshots kept ${backupDays.partner} days with a monthly restore test and a disaster recovery plan on Partner`,
  /** Terms §12: "give us … written notice". The PDF's suggestion */
  'NOTICE PERIOD': '30 days’',
  /** Terms §5: "due within …". The PDF's suggestion */
  'PAYMENT TERMS': '7 days of the invoice date',
  /** Terms §15: "limited to …". The PDF's suggestion */
  'LIABILITY CAP': 'the fees you paid us in the 12 months before the claim',
  /** Terms §12, Privacy §6: "keep your data for … after the end date … then delete it". The PDF's suggestion */
  'EXIT RETENTION': '30 days',
  /** SLA §6 and §7: monthly uptime on VavenCloud infrastructure. The PDF's suggestion */
  'UPTIME TARGET': '99.9%',
  /** Terms §19: "these terms are governed by …" */
  'GOVERNING LAW': 'the laws of India',
  /**
   * Privacy §5, Trust: where VavenCloud's own servers are. The regions the old site published
   * (vavencloud-static-website, serviceRegionsData.ts), matching the FAQ ("the United States or Europe").
   * TODO: add the provider's name, as the PDF asks ("Name provider and regions").
   */
  'DATA CENTRES':
    'data centres in New York and St. Louis (United States) and Strasbourg (France), in the region you choose',
  /**
   * Trust: any certification held or in progress. A single space removes the placeholder, the PDF's suggestion
   * when none is held. Never claim a certification (SOC 2, ISO 27001) that isn't held.
   */
  'CERTIFICATIONS STATUS': ' ',
  /**
   * SLA §2: the 24/7 line for critical incidents. The number the landing page already shows as its 24/7 line
   * ("Site down right now? Call 24/7", home/booking/booking.data.ts). Confirm it's the emergency line.
   */
  'EMERGENCY PHONE': '+91 90609 79706',

  /** All pages: "Last updated: …". Update it whenever a page changes materially */
  'EFFECTIVE DATE': '20 November 2026',
  /** Privacy (2 places): the named person for complaints (Indian IT Rules) */
  'GRIEVANCE OFFICER': 'Puneet Kumar, puneets@vavensoft.com',
  /**
   * Privacy §4, Trust: third parties that handle client data. None at present. Before adding one, name it here
   * and tell clients at least 30 days ahead (as the Trust page promises).
   */
  'SUB-PROCESSORS': 'none at present',
}

/*
 * Mailboxes the pages use: legal@, privacy@, security@, abuse@ and support@vavencloud.com (and sales@).
 * Create them, or route them all to one inbox, before going live.
 */
