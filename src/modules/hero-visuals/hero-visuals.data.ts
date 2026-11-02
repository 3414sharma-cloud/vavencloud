import type { IconName } from '@/shared/ui/icons.ts'

/*
 * What each thing we sell looks like, for the hero: examples, labelled as such, never a real client.
 * The incident is the same night as everywhere else on the site (02:14 to 02:41, report at 09:00).
 */

/** 24/7 DevOps support: one incident in the client portal, owned from alert to report */
export const incident: { who: string; icon: IconName; time: string; text: string; tone: 'alert' | 'engineer' | 'done' | 'report' }[] = [
  { who: 'Monitoring', icon: 'activity', time: '02:14', text: 'Checkout response time above 4 s. On-call engineer paged.', tone: 'alert' },
  { who: 'On-call engineer', icon: 'support', time: '02:19', text: 'I’m on it. Looking at the database and the last deployment.', tone: 'engineer' },
  { who: 'On-call engineer', icon: 'support', time: '02:31', text: 'Found it: a missing index on the orders table. Fixing now.', tone: 'engineer' },
  { who: 'Resolved', icon: 'check', time: '02:41', text: 'Fixed and verified. Checkout is back to 182 ms.', tone: 'done' },
  { who: 'Report sent', icon: 'mail', time: '09:00', text: 'What happened, why, and what we changed so it doesn’t happen again.', tone: 'report' },
]

/** Managed cloud: the client's own account (it stays theirs), with what our engineers keep healthy in it */
export const cloud = {
  providers: ['AWS', 'Azure', 'Google Cloud'],
  resources: [
    { icon: 'server', name: 'App servers', detail: '3 instances, monitored', status: 'Healthy' },
    { icon: 'layers', name: 'PostgreSQL database', detail: 'Backups restore-tested', status: 'Healthy' },
    { icon: 'globe', name: 'Load balancer', detail: 'Traffic spread across zones', status: 'Healthy' },
    { icon: 'shield', name: 'Security patches', detail: 'Applied at a quiet time', status: 'Done' },
  ] as { icon: IconName; name: string; detail: string; status: string }[],
  facts: [
    { icon: 'lock', text: 'Your account, your keys' },
    { icon: 'check', text: 'Nothing to move' },
    { icon: 'activity', text: 'Watched 24/7' },
  ] as { icon: IconName; text: string }[],
}

/**
 * Cloud servers: a new server on the VavenCloud dashboard. Regions, plan and price from
 * vavencloud.com/cloud-services (October 2026): keep them in step. The IP is from the range kept for examples.
 */
export const servers = {
  regions: ['New York', 'St. Louis', 'Strasbourg'],
  plan: 'VPS Micro',
  price: '$12',
  server: { name: 'app-01', region: 'New York', ip: '203.0.113.24' },
  liveIn: '58 s',
  extras: [
    { icon: 'cloud', text: 'Backups on' },
    { icon: 'shield', text: 'Firewall on' },
    { icon: 'support', text: 'Run by your engineers' },
  ] as { icon: IconName; text: string }[],
}
