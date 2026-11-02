/**
 * The founder shown in "A note from the founder".
 * SAMPLE LOOK: the cartoon portrait (founder-cartoon.ts) is a stand-in. Put a real photo in /public (e.g. /founder.jpg)
 * and set `photo` to its path to use it instead.
 */
export const founder: { name: string; role: string; photo?: string; excerpt: string; facts: string[]; note: string[] } = {
  name: 'Jerry Bopara',
  role: 'Co-founder, Vavensoft and VavenCloud',
  /** Pulled from the note below, word for word (shown on the home page) */
  excerpt: 'We built VavenCloud so that never happens to our clients. One team, every layer, and a person who picks up the phone.',
  facts: ['12 years as a DevOps and cloud engineer', 'Co-founded Vavensoft and VavenCloud'],
  note: [
    'I spent twelve years as a DevOps and cloud engineer before co-founding Vavensoft. In that time I watched the same thing happen again and again: good products hurt by outages nobody owned. The host blamed the code, the developers blamed the server, and the founder lost the weekend.',
    'We built VavenCloud so that never happens to our clients. One team, every layer, and a person who picks up the phone. If you book a review, you’ll speak to someone who has run production systems for over a decade, not a salesperson. That’s a promise.',
  ],
}
