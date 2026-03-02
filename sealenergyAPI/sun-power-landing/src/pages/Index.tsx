import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import CalculatorSection from "@/components/landing/CalculatorSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import VideoFAQSection from "@/components/landing/VideoFAQSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import FooterSection from "@/components/landing/FooterSection";
import ChatbotButton from "@/components/landing/ChatbotButton";
import MobileStickyCTA from "@/components/landing/MobileStickyCTA";

const Index = () => (
  <>
    <Header />
    <main className="pt-16">
      <HeroSection />
      <AboutSection />
      <CalculatorSection />
      <BenefitsSection />
      <HowItWorksSection />
      <VideoFAQSection />
      <SocialProofSection />
      <FooterSection />
    </main>
    <ChatbotButton />
    <MobileStickyCTA />
  </>
);

export default Index;
