import HeroSection from "../../components/home/HeroSection";
import IntelligenceSection from "../../components/home/IntelligenceSection";
import FeaturedSection from "../../components/home/FeaturedSection";
import EngineSection from "../../components/home/EngineSection";
import ExploreSection from "../../components/home/ExploreSection";
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
