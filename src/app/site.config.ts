import type { IconName } from '@/shared/ui/icons.ts'

export interface SocialLink {
  icon: IconName
  label: string
  href: string
}

/** Site-wide settings and contact details. Replace the placeholders before going live. */
export const site = {
  name: 'VavenCloud',

  /** TODO: confirm the legal entity name (shown in the footer). */
  legalName: '[Legal entity name]',

  /** The parent software company, linked from the footer and the proof section. */
  vavensoftUrl: 'https://vavensoft.com/',

  /** TODO: link to the Vavensoft agency profile on Upwork (used in the proof section). */
  upworkUrl: 'https://www.upwork.com/',

  /**
   * Calendar link opened after the booking form (Cal.com, Calendly...). Leave empty until a tool is
   * chosen: the form still sends the request and the team follows up by email.
   */
  bookingCalendarUrl: '',

  /**
   * YouTube/Vimeo embed URL played by every [data-video] button (e.g. "https://www.youtube.com/embed/VIDEO_ID").
   * Leave empty to show a "coming soon" placeholder.
   */
  videoUrl: '',

  paletteSwitcher: false,

  /** Customer control panel where plans are ordered ("Choose plan" buttons on the pricing page). */
  panelUrl: 'https://panel.vavencloud.com/',

  /** External blog (navbar → Help Center → Blogs). */
  blogUrl: 'https://blog.vavencloud.com/',

  /** From the old site (vavencloud-static-website/src/constants/contact/contactPageData.ts). */
  contact: {
    email: 'sales@vavencloud.com',
    phones: [
      { label: '+91 9060979706', href: 'tel:+919060979706' },
      { label: '+91 9090949405', href: 'tel:+919090949405' },
    ],
    address: 'La Daftar, D 178, Phase 8B, Industrial Area, Sector 74, Sahibzada Ajit Singh Nagar, Punjab 140308',
  },

  /**
   * Contact form backend (same as the old site): POST {apiBaseUrl}/api/contact with reCAPTCHA v3.
   * Set in test/.env:  VITE_API_BASE_URL=https://...   VITE_RECAPTCHA_SITE_KEY=...
   */
  api: {
    baseUrl: (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, ''),
    recaptchaSiteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? '',
  },

  /** As linked from vavencloud.com */
  socials: [
    { icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/vavencloud/' },
    { icon: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/vavencloud/' },
  ] satisfies SocialLink[],
}
