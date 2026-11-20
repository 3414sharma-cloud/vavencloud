/* ---------- Client stories: the clients' own words (docs/messaging.md: never invent quotes or customers) ---------- */

/**
 * One card in the row. `highlight` is a phrase from the quote, underlined on the card. A video review adds `video`
 * (the YouTube id and its title); its card shows the thumbnail and loads the player only when played. Its `quote`
 * is optional: a line the client says in the video, word for word. `sample` marks a placeholder video card (no
 * video yet): its poster says "Sample" so it can't pass for real.
 */
export interface Testimonial {
  name: string
  /** What the review is about; optional (a video card can go without one) */
  topic?: string
  quote?: string
  highlight?: string
  video?: { id: string; title: string }
  sample?: boolean
  /** The client's photo in /public (e.g. '/clients/first-last.png'). Without one, the card shows their initials */
  photo?: string
}

/**
 * The reviews on vavencloud.com, word for word, in the site's order and with the site's photos (in
 * /public/clients). TODO: add each client's role and company when known.
 */
const written: Testimonial[] = [
  {
    name: 'Jon God Gilly',
    topic: 'App development',
    quote:
      'A true partner in our app journey. Their expertise, innovation, and reliability made every phase smooth from planning to deployment. Responsive communication and quality-focused execution set them apart.',
    highlight: 'A true partner in our app journey.',
    photo: '/clients/jon-god-gilly.png',
  },
  {
    name: 'Mohammed Imtiaz Ali',
    topic: 'Security and 24/7 support',
    quote:
      'VavenCloud exceeded expectations with strong performance and dependable security. Our websites run smoothly 24/7, and their support team is always available for quick technical help and scaling guidance.',
    highlight: 'their support team is always available',
    photo: '/clients/mohammed-imtiaz-ali.png',
  },
  {
    name: 'Kyle Bagley',
    topic: 'Hosting and cloud',
    quote:
      'Reliable web hosting and cloud solutions transformed our business. Fast performance, smooth migrations, and robust security helped us scale confidently. I highly recommend VavenCloud as a trusted long-term partner.',
    highlight: 'a trusted long-term partner',
    photo: '/clients/kyle-bagley.png',
  },
]

/**
 * Video reviews on VavenSoft's YouTube channel. TODO: add each client's full name, a `topic`, and a `quote`
 * (a line they say, word for word).
 */
const videos: Testimonial[] = [
  {
    name: 'Corey',
    video: { id: 'TRMI9awI9G8', title: 'Customer Success Stories | VavenSoft Reviews That Inspire Confidence' },
  },
  {
    name: 'Muhammad',
    video: { id: 'lFOMw1Bi4i8', title: 'Hear from Our Happy Clients | Why They Chose VavenSoft' },
  },
  {
    name: 'Mark',
    video: { id: '93wrYKUcJsU', title: 'Trusted by Businesses Worldwide | VavenSoft Client Testimonials' },
  },
]

/** Written and video reviews in turn, so a video shows without scrolling */
export const clientReviews: Testimonial[] = written.flatMap((w, i) => {
  const video = videos[i]
  return video ? [w, video] : [w]
})
