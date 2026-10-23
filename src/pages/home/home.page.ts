import { createPage } from '@/app/create-page.ts'
import { contactSection } from '@/modules/contact/contact.section.ts'
import { faqSection } from '@/modules/faq/faq.section.ts'
import { featuresSection } from '@/modules/features/features.section.ts'
import { productTourSection } from '@/modules/product-tour/product-tour.section.ts'
import { servicesSection } from '@/modules/services/services.section.ts'
import { testimonialsSection } from '@/modules/testimonials/testimonials.section.ts'
import { heroSection } from './sections/hero.section.ts'

createPage({
  sections: [
    heroSection(),
    servicesSection({ showStats: false }),
    testimonialsSection(),
    featuresSection({ layout: 'gallery' }),
    productTourSection(),
    faqSection(),
    contactSection(),
  ],
})
