import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/landing/HeroSection';
import ProblemSection from '@/components/landing/ProblemSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import SuccessStoriesSection from '@/components/landing/SuccessStoriesSection';
import PartnersSection from '@/components/landing/PartnersSection';
import CTASection from '@/components/landing/CTASection';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <FeaturesSection />
        <SuccessStoriesSection />
        <PartnersSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
