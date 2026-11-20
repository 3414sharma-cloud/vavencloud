/*
 * The placeholder register from "VavenCloud Legal Pages v1": every value in [SQUARE BRACKETS] on the legal pages,
 * in one place. Fill a value here and it appears on every page that uses it. While a value is empty, the
 * placeholder is shown highlighted, so it can't be missed on staging.
 *
 * Do not go live until every value is filled. The same values must match the landing page, the plans and the
 * FAQ ("change it in one place, change it everywhere"). The PDF's suggested starting point is in each comment;
 * none is filled in yet because each is a business decision.
 *
 * The PDF uses one [RESPONSE TIME] and one [SEV-2 TIME] for all three plans in the SLA table; they are split
 * per plan here because the suggested values differ per plan.
 */
export const legalValues: Record<string, string> = {
  /** All pages. Suggested: the date the pages go live */
  'EFFECTIVE DATE': '',

  /** SLA (and landing page, plans, FAQ): Severity 1 response. Suggested: 4 hours */
  'ESSENTIAL RESPONSE TIME': '',
  /** Suggested: 1 hour */
  'MANAGED RESPONSE TIME': '',
  /** Suggested: 30 minutes */
  'PARTNER RESPONSE TIME': '',

  /** SLA: Severity 2 response. Suggested: 1 business day */
  'ESSENTIAL SEV-2 TIME': '',
  /** Suggested: 4 hours */
  'MANAGED SEV-2 TIME': '',
  /** Suggested: 2 hours */
  'PARTNER SEV-2 TIME': '',

  /**
   * Terms (and plans, SLA): monthly code-fix hours. Suggested: Managed 10 h, Partner 25 h (Essential: quoted).
   * Note: the plans on the landing page currently say Managed 4 h, Partner 20 h (home/plans/plans.data.ts).
   */
  'CODE-FIX HOURS': '',
  /** Terms (and plans): exactly what $100 a month covers. Suggested: one environment, one cloud account */
  'ESSENTIAL PLAN SCOPE': '',

  /** SLA: monthly uptime for servers on VavenCloud. Suggested: 99.9% */
  'UPTIME TARGET': '',
  /** SLA, Trust: default backup frequency and retention. Suggested: daily, kept 14 days */
  'BACKUP SCHEDULE': '',
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
