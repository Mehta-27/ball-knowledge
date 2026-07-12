import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CtaSection() {
  return (
    <section className="home-cta">
      <motion.div
        className="home-cta__inner"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="home-cta__glow" />
        <h2 className="home-cta__title">
          Start exploring football intelligence
        </h2>
        <p className="home-cta__description">
          Dive into 1,162 player profiles, 104 matches, and AI-powered similarity analysis across the 2026 FIFA World Cup.
        </p>
        <div className="home-cta__actions">
          <Link to="/players" className="btn btn--primary btn--lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            Explore Players
          </Link>
          <Link to="/matches" className="btn btn--secondary btn--lg">
            Browse Matches
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
