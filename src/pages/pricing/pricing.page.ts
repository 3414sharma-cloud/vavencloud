import { createPage } from '@/app/create-page.ts'
import { contactSection } from '@/modules/contact/contact.section.ts'
import { faqSection } from '@/modules/faq/faq.section.ts'
import { featuresSection } from '@/modules/features/features.section.ts'
import { planIncludes, pricingFaqs } from '@/modules/pricing/pricing.data.ts'
import { pricingSection } from '@/modules/pricing/pricing.section.ts'
import { services } from '@/modules/services/services.data.ts'
import { servicesSection } from '@/modules/services/services.section.ts'
import { testimonialsSection } from '@/modules/testimonials/testimonials.section.ts'

// Business email is hidden on this page for now, so leave the email service out of the cards.
// The last card spans two columns so the 3-column grid stays full without the email card.
const pricingServices = services
  .filter((s) => s.icon !== 'mail')
  .map((s, i, list) => (i === list.length - 1 ? { ...s, className: 'lg:col-span-2' } : s))

createPage({
  sections: [
    pricingSection(),
    servicesSection({ services: pricingServices, showStats: false }),
    featuresSection({
      features: planIncludes,
      heading: {
        eyebrow: 'Every plan includes',
        title: 'Everything you need <span class="gradient-text">to succeed online</span>',
        description: 'One trusted partner for fast hosting and next-level development, with these essentials built into every plan.',
      },
    }),
    testimonialsSection(),
    faqSection({ items: pricingFaqs }),
    contactSection(),
  ],
})
