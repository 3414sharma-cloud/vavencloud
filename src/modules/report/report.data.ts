/* "The morning after" (VavenCloud-Sample-Content.md): what you get after an incident, and every month. */

export const reportIntro =
  'Afterwards you get a written explanation of what happened and what we changed so it doesn’t happen again. Every month, a report: uptime, incidents, changes made and what we recommend next.'

/** What the monthly report covers */
export const monthly = ['Uptime', 'Incidents', 'Changes made', 'What we recommend next']

/** An example incident report for the night in the problem section (checkout slow at 02:14). Illustration only: no real customer. */
export const report = {
  title: 'Checkout slow for 27 minutes',
  started: '02:14',
  resolved: '02:41',
  meta: [
    ['Started', '02:14'],
    ['Resolved', '02:41'],
    ['Affected', 'Checkout only'],
    ['Handled by', 'On-call engineer'],
  ],
  sections: [
    ['What happened', 'Checkout response time rose above 4 seconds. Monitoring paged the on-call engineer.'],
    ['Cause', 'A missing database index on the orders table.'],
    ['Fix', 'Index added and verified. Checkout back to normal speed.'],
    ['So it doesn’t happen again', 'Slow-query alert added. New migrations are now checked for missing indexes.'],
  ],
}
