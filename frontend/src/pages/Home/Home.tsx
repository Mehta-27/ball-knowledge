import HeroSection from "../../components/home/HeroSection";
import IntelligenceSection from "../../components/home/StatsSection";
import FeaturedSection from "../../components/home/WhySection";
import EngineSection from "../../components/home/FeaturesSection";
import ExploreSection from "../../components/home/PreviewSection";
import CtaSection from "../../components/home/CtaSection";

export default function Home() {
  return (
    <div className="home">
      <HeroSection />
      <IntelligenceSection />
      <FeaturedSection />
      <EngineSection />
      <ExploreSection />
      <CtaSection />
    </div>
  );
}
