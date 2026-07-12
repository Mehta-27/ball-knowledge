import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CtaSection() {
  return (
    <section className="home-footer-close">
      <motion.div
        className="home-footer-close__inner"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="home-footer-close__line-wrap">
          <div className="home-footer-close__line" />
          <div className="home-footer-close__line-glow" />
        </div>
        <div className="home-footer-close__text">
          Built for the beautiful game.
        </div>
        <div className="home-footer-close__links">
          <Link to="/players" className="home-footer-close__link">
            Players
          </Link>
          <Link to="/teams" className="home-footer-close__link">
            Teams
          </Link>
          <Link to="/matches" className="home-footer-close__link">
            Matches
          </Link>
          <Link to="/standings" className="home-footer-close__link">
            Standings
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
