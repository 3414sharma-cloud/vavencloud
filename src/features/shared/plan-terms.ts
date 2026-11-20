/*
 * The plan numbers, in one place ("VavenCloud Plans: Essential, Managed, Partner", Before launch: "One source of
 * truth"). The plans on the landing page (home/plans/plans.data.ts) and the legal pages (legal/legal.values.ts)
 * both read them, so the plan cards, the comparison, the SLA and the Terms can't drift apart.
 *
 * Every value here is the document's suggestion, still to confirm before launch.
 */

export type PlanKey = 'essential' | 'managed' | 'partner'

export const planTerms = {
  /** Severity 1 (critical) response, 24/7 */
  criticalResponse: { essential: '4 hours', managed: '1 hour', partner: '30 minutes' },
  /** Severity 2 (high) response */
  highResponse: { essential: '1 business day', managed: '4 hours', partner: '2 hours' },
  /** Code-fix hours included each month (Essential: quoted when needed) */
  codeFixHours: { managed: 10, partner: 25 },
  /** Servers or services included (Partner: as agreed in the order form) */
  serverLimit: { essential: 3, managed: 15 },
  /** How long backups are kept, in days */
  backupDays: { essential: 7, managed: 14, partner: 30 },
} as const
