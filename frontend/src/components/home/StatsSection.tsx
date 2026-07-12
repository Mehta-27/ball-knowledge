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
    <span ref={ref} className={`home-intel-card__value ${accent ? "home-intel-card__value--accent" : ""}`}>
      {count.toLocaleString()}
    </span>
  );
}

export default function IntelligenceSection() {
  const [stats, setStats] = useState<IntelStat[]>([
    { value: 1162, label: "Players", detail: "Across 48 nations", accent: true },
    { value: 48, label: "Teams", detail: "From 6 confederations" },
    { value: 104, label: "Matches", detail: "Full tournament data" },
    { value: 16, label: "Venues", detail: "Host stadiums" },
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
          { value: players.length, label: "Players", detail: "Across 48 nations", accent: true },
          { value: teams.length, label: "Teams", detail: "From 6 confederations" },
          { value: matches.length, label: "Matches", detail: "Full tournament data" },
          { value: venues.length, label: "Venues", detail: "Host stadiums" },
        ]);
      } catch {
        // Keep hardcoded defaults on API failure
      }
    }

    fetchLiveData();
  }, []);

  return (
    <section className="home-intelligence">
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
        className="home-intelligence__grid"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="home-intel-card"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatedNumber value={stat.value} accent={stat.accent} />
            <div className="home-intel-card__label">{stat.label}</div>
            <div className="home-intel-card__detail">{stat.detail}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
