import HeroSection from '../../components/public/HeroSection'
import FeatureSection from '../../components/public/FeatureSection'
import AboutSection from '../../components/public/AboutSection'
import CounterSection from '../../components/public/CounterSection'
import ServiceSection from '../../components/public/ServiceSection'
import BestSellerSection from '../../components/public/BestSellerSection'
import TestimonialSection from '../../components/public/TestimonialSection'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <AboutSection />
      <CounterSection />
      <ServiceSection />
      <BestSellerSection />
      <TestimonialSection />
    </>
  )
}

export default HomePage
