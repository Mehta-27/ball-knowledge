import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function PitchGrid() {
  return (
    <div className="home-hero__grid">
      <svg
        viewBox="0 0 800 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="home-hero__pitch"
        aria-hidden="true"
      >
        {/* Outer boundary */}
        <rect x="40" y="20" width="720" height="360" stroke="rgba(59,130,246,0.07)" strokeWidth="1" rx="4" />
        {/* Center line */}
        <line x1="400" y1="20" x2="400" y2="380" stroke="rgba(59,130,246,0.07)" strokeWidth="1" />
        {/* Center circle */}
        <circle cx="400" cy="200" r="60" stroke="rgba(59,130,246,0.07)" strokeWidth="1" />
        <circle cx="400" cy="200" r="3" fill="rgba(59,130,246,0.15)" />
        {/* Left penalty area */}
        <rect x="40" y="110" width="100" height="180" stroke="rgba(59,130,246,0.06)" strokeWidth="1" fill="none" />
        <rect x="40" y="155" width="40" height="90" stroke="rgba(59,130,246,0.05)" strokeWidth="1" fill="none" />
        {/* Right penalty area */}
        <rect x="660" y="110" width="100" height="180" stroke="rgba(59,130,246,0.06)" strokeWidth="1" fill="none" />
        <rect x="720" y="155" width="40" height="90" stroke="rgba(59,130,246,0.05)" strokeWidth="1" fill="none" />
        {/* Corner arcs */}
        <path d="M40 30 Q50 20 40 20" stroke="rgba(59,130,246,0.08)" strokeWidth="1" fill="none" />
        <path d="M760 30 Q750 20 760 20" stroke="rgba(59,130,246,0.08)" strokeWidth="1" fill="none" />
        <path d="M40 370 Q50 380 40 380" stroke="rgba(59,130,246,0.08)" strokeWidth="1" fill="none" />
        <path d="M760 370 Q750 380 760 380" stroke="rgba(59,130,246,0.08)" strokeWidth="1" fill="none" />

        {/* Animated tactical dots */}
        {[
          { cx: 180, cy: 160, delay: 0 },
          { cx: 300, cy: 220, delay: 1.2 },
          { cx: 520, cy: 180, delay: 0.6 },
          { cx: 620, cy: 240, delay: 1.8 },
          { cx: 350, cy: 120, delay: 2.4 },
          { cx: 450, cy: 280, delay: 0.3 },
          { cx: 250, cy: 300, delay: 1.5 },
          { cx: 550, cy: 100, delay: 2.1 },
        ].map((dot, i) => (
          <circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r="2.5"
            fill="rgba(59,130,246,0.25)"
          >
            <animate
              attributeName="opacity"
              values="0.15;0.5;0.15"
              dur="3s"
              begin={`${dot.delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="2;3.5;2"
              dur="3s"
              begin={`${dot.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Connecting lines (tactical passing network) */}
        {[
          "M180 160 L300 220 L350 120",
          "M520 180 L620 240 L550 100",
          "M350 120 L450 280 L520 180",
          "M250 300 L300 220 L180 160",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="rgba(59,130,246,0.06)"
            strokeWidth="0.8"
            fill="none"
          >
            <animate
              attributeName="stroke-opacity"
              values="0.03;0.1;0.03"
              dur="4s"
              begin={`${i * 0.8}s`}
              repeatCount="indefinite"
            />
          </path>
        ))}
      </svg>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="home-hero">
      <PitchGrid />

      <div className="home-hero__content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="type-overline" style={{ color: "var(--primary)" }}>
            2026 FIFA World Cup
          </span>
        </motion.div>

        <motion.h1
          className="home-hero__title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Ball Knowledge
        </motion.h1>

        <motion.p
          className="home-hero__subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          Football Intelligence Platform
        </motion.p>

        <motion.p
          className="home-hero__description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          Advanced player intelligence, match analytics, team insights
          and machine learning for modern football analysis.
        </motion.p>

        <motion.div
          className="home-hero__actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to="/players" className="btn btn--primary btn--lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Explore Players
          </Link>
          <Link to="/teams" className="btn btn--secondary btn--lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
            Explore Teams
          </Link>
          <Link to="/matches" className="btn btn--ghost btn--lg">
            Explore Matches
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
