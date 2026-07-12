import HeroSection from "../../components/home/HeroSection";
import StatsSection from "../../components/home/StatsSection";
import FeaturesSection from "../../components/home/FeaturesSection";
import WhySection from "../../components/home/WhySection";
import PreviewSection from "../../components/home/PreviewSection";
import CtaSection from "../../components/home/CtaSection";

export default function Home() {
  return (
    <div className="home">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <WhySection />
      <PreviewSection />
      <CtaSection />
    </div>
  );
}
