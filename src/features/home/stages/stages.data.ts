/* ---------- Where are you today: five moments founders come to us ---------- */

export type StageId = 'idea' | 'mvp' | 'scale' | 'cost' | 'owner'

/** `id` picks the stage's photo (/images/stages/<id>.webp) */
export const stages: { id: StageId; title: string; worry: string; answer: string }[] = [
  {
    id: 'idea',
    title: 'I have an idea',
    worry: '“Will I pick the wrong team? Will it fall apart after launch?”',
    answer: 'Build it once, built to last, with one team from build to run.',
  },
  {
    id: 'mvp',
    title: 'I have an MVP',
    worry: '“Will it survive real users?”',
    answer: 'Find what breaks first and fix it before your customers do.',
  },
  {
    id: 'scale',
    title: 'I’m live, but it won’t scale',
    worry: '“Every growth spike becomes an outage.”',
    answer: 'Find the bottleneck and plan the next step ahead of time.',
  },
  {
    id: 'cost',
    title: 'I’m paying too much for cloud',
    worry: '“Our bill keeps growing and nobody can explain it.”',
    answer: 'Show you where the money goes, and right-size it.',
  },
  {
    id: 'owner',
    title: 'It works. Nobody owns it.',
    worry: '“My developer left. Nobody owns this.”',
    answer: 'Take it over, document it, and give you one team that understands it.',
  },
]
