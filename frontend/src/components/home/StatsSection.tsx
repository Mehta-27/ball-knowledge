import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { getPlayers } from "../../api/players";
import { getMatches } from "../../api/matches";
import { getTeams } from "../../api/teams";
import { getVenues } from "../../api/venues";

interface IntelStat {
  value: number;
  label: string;
  detail: string;
  accent?: boolean;
  icon: React.ReactNode;
}

function AnimatedNumber({ value, accent }: { value: number; accent?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = value / (duration / step);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span
      ref={ref}
      className={`intel-number ${accent ? "intel-number--accent" : ""}`}
    >
      <span className="intel-number__glow" aria-hidden="true" />
      {count.toLocaleString()}
    </span>
  );
}

const icons = {
  players: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  teams: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  ),
  matches: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  venues: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
    </svg>
  ),
};

export default function IntelligenceSection() {
  const [stats, setStats] = useState<IntelStat[]>([
    { value: 1162, label: "Players", detail: "Across 48 nations", accent: true, icon: icons.players },
    { value: 48, label: "Teams", detail: "From 6 confederations", icon: icons.teams },
    { value: 104, label: "Matches", detail: "Full tournament data", icon: icons.matches },
    { value: 16, label: "Venues", detail: "Host stadiums", icon: icons.venues },
  ]);

  useEffect(() => {
    async function fetchLiveData() {
      try {
        const [players, matches, teams, venues] = await Promise.all([
          getPlayers(),
          getMatches(),
          getTeams(),
          getVenues(),
        ]);

        setStats([
          { value: players.length, label: "Players", detail: "Across 48 nations", accent: true, icon: icons.players },
          { value: teams.length, label: "Teams", detail: "From 6 confederations", icon: icons.teams },
          { value: matches.length, label: "Matches", detail: "Full tournament data", icon: icons.matches },
          { value: venues.length, label: "Venues", detail: "Host stadiums", icon: icons.venues },
        ]);
      } catch {
        // Keep hardcoded defaults
      }
    }

    fetchLiveData();
  }, []);

  return (
    <section className="home-intelligence">
      {/* Background pitch grid texture */}
      <div className="intel-bg-grid" aria-hidden="true" />

      <div className="home-section-header">
        <motion.span
          className="home-section-overline"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          The Dataset
        </motion.span>
        <motion.h2
          className="home-section-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Every number tells a story
        </motion.h2>
        <motion.p
          className="home-section-description"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Complete 2026 FIFA World Cup dataset, continuously updated
          from official sources and enhanced with machine learning.
        </motion.p>
      </div>

      <motion.div
        className="intel-grid"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="intel-card"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="intel-card__icon">{stat.icon}</div>
            <AnimatedNumber value={stat.value} accent={stat.accent} />
            <div className="intel-card__label">{stat.label}</div>
            <div className="intel-card__detail">{stat.detail}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
