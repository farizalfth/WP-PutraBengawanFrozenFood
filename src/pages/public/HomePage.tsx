import HeroSection from '../../components/public/HeroSection'
import ServiceHighlight from '../../components/public/ServiceHighlight'
import BestSellerSection from '../../components/public/BestSellerSection'
import CategorySection from '../../components/public/CategorySection'
import AboutSection from '../../components/public/AboutSection'
import TestimonialSection from '../../components/public/TestimonialSection'
import ContactCta from '../../components/public/ContactCta'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ServiceHighlight />
      <BestSellerSection />
      <CategorySection />
      <AboutSection />
      <TestimonialSection />
      <ContactCta />
    </>
  )
}

export default HomePage