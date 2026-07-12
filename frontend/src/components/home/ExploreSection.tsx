import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface ExploreCard {
  to: string;
  title: string;
  description: string;
  count: string;
  icon: React.ReactNode;
}

const cards: ExploreCard[] = [
  {
    to: "/players",
    title: "Players",
    description: "1,162 player profiles with performance ratings, career stats, and AI-powered similarity analysis.",
    count: "1,162 profiles",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: "/teams",
    title: "Teams",
    description: "48 national teams with squad composition, confederation data, and tactical profiles.",
    count: "48 teams",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      </svg>
    ),
  },
  {
    to: "/matches",
    title: "Matches",
    description: "104 matches with team-level and per-player statistics including xG, possession, and defensive metrics.",
    count: "104 matches",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    to: "/standings",
    title: "Standings",
    description: "Group and knockout stage standings with points, goal difference, and qualification status.",
    count: "12 groups",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
  },
  {
    to: "/venues",
    title: "Venues",
    description: "16 host stadiums with capacity, location, and match allocation data.",
    count: "16 stadiums",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
        <path d="M9 9h.01" />
        <path d="M9 13h.01" />
        <path d="M9 17h.01" />
      </svg>
    ),
  },
  {
    to: "/groups",
    title: "Groups",
    description: "12 groups with team composition, match schedules, and qualification scenarios.",
    count: "12 groups",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
];

export default function ExploreSection() {
  return (
    <section className="home-explore">
      <div className="home-section-header">
        <motion.span
          className="home-section-overline"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Explore
        </motion.span>
        <motion.h2
          className="home-section-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Dive into the data
        </motion.h2>
      </div>

      <div className="explore-grid">
        {cards.map((card, i) => (
          <motion.div
            key={card.to}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to={card.to} className="explore-card">
              {/* Underglow — RGB keyboard style */}
              <div className="explore-card__underglow" aria-hidden="true" />
              {/* Top rim */}
              <div className="explore-card__rim" aria-hidden="true" />

              <div className="explore-card__icon">
                {card.icon}
              </div>
              <div className="explore-card__title">{card.title}</div>
              <div className="explore-card__description">{card.description}</div>
              <div className="explore-card__footer">
                <span className="explore-card__count">{card.count}</span>
                <span className="explore-card__arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
