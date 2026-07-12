import { motion } from "framer-motion";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const features: Feature[] = [
  {
    title: "Player Intelligence",
    description: "Detailed profiles for every player in the 2026 World Cup. Performance ratings, career stats, and biometric data at your fingertips.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    gradient: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.03))",
  },
  {
    title: "Team Analysis",
    description: "Explore all 48 national teams. Confederation data, squad composition, and tactical profiles for every nation competing.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      </svg>
    ),
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.03))",
  },
  {
    title: "Match Insights",
    description: "Complete World Cup match data. Team-level and per-player statistics including xG, xA, possession, and defensive metrics.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.03))",
  },
  {
    title: "AI Player Similarity",
    description: "Machine learning powered player recommendations. Find players with similar profiles using cosine similarity on 15+ statistical features.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4" />
        <path d="m16.2 7.8 2.9-2.9" />
        <path d="M18 12h4" />
        <path d="m16.2 16.2 2.9 2.9" />
        <path d="M12 18v4" />
        <path d="m4.9 19.1 2.9-2.9" />
        <path d="M2 12h4" />
        <path d="m4.9 4.9 2.9 2.9" />
      </svg>
    ),
    gradient: "linear-gradient(135deg, rgba(167,139,250,0.15), rgba(167,139,250,0.03))",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function FeaturesSection() {
  return (
    <section className="home-features">
      <div className="home-section-header">
        <motion.span
          className="type-overline"
          style={{ color: "var(--primary)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Capabilities
        </motion.span>
        <motion.h2
          className="home-section-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Everything you need for football analysis
        </motion.h2>
      </div>

      <motion.div
        className="home-features__grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            className="home-feature-card"
            variants={cardVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="home-feature-card__icon" style={{ background: feature.gradient }}>
              {feature.icon}
            </div>
            <h3 className="home-feature-card__title">{feature.title}</h3>
            <p className="home-feature-card__description">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
