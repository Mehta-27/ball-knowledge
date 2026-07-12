import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getPlayers, getSimilarPlayers } from "../../api/players";
import type { PlayerCard, SimilarPlayer } from "../../types/players";

interface FeaturedPlayer extends PlayerCard {
  country: string;
  team: string;
  age: number;
  goals: number;
  assists: number;
  rating: number;
  xG: number;
}

export default function FeaturedSection() {
  const [player, setPlayer] = useState<FeaturedPlayer | null>(null);
  const [similar, setSimilar] = useState<SimilarPlayer[]>([]);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const players = await getPlayers();
        if (players.length === 0) return;

        // Pick a featured player (index 0 from the API — could be any notable player)
        const featured = players[0];
        // Fetch full details to get stats
        const resp = await fetch(`http://127.0.0.1:8000/players/${featured.id}`);
        const detail = await resp.json();

        setPlayer({
          ...featured,
          country: detail.country ?? "",
          team: detail.team ?? "",
          age: detail.age ?? 0,
          goals: detail.statistics?.goals ?? 0,
          assists: detail.statistics?.assists ?? 0,
          rating: detail.statistics?.rating ?? 0,
          xG: detail.statistics?.xG ?? 0,
        });

        const similarResp = await getSimilarPlayers(String(featured.id));
        setSimilar(similarResp.slice(0, 5));
      } catch {
        // API not available — show placeholder
      }
    }

    loadFeatured();
  }, []);

  return (
    <section className="home-featured">
      <div className="home-section-header">
        <motion.span
          className="home-section-overline"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Featured Intelligence
        </motion.span>
        <motion.h2
          className="home-section-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Every player, deeply understood
        </motion.h2>
      </div>

      <div className="home-featured__layout">
        {/* Player Card */}
        <motion.div
          className="home-featured-player"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="home-featured-player__header">
            <div className="home-featured-player__avatar">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
            <div className="home-featured-player__info">
              <div className="home-featured-player__name">
                {player?.name ?? "Loading..."}
              </div>
              <div className="home-featured-player__meta">
                {player?.position && <>{player.position} &middot; </>}
                {player?.team || player?.country || "2026 World Cup"}
              </div>
            </div>
          </div>

          <div className="home-featured-player__stats">
            <div className="home-featured-stat">
              <div className="home-featured-stat__value home-featured-stat__value--accent">
                {player?.goals ?? "—"}
              </div>
              <div className="home-featured-stat__label">Goals</div>
            </div>
            <div className="home-featured-stat">
              <div className="home-featured-stat__value">
                {player?.assists ?? "—"}
              </div>
              <div className="home-featured-stat__label">Assists</div>
            </div>
            <div className="home-featured-stat">
              <div className="home-featured-stat__value">
                {player?.xG ? player.xG.toFixed(1) : "—"}
              </div>
              <div className="home-featured-stat__label">xG</div>
            </div>
            <div className="home-featured-stat">
              <div className="home-featured-stat__value home-featured-stat__value--accent">
                {player?.rating ? player.rating.toFixed(1) : "—"}
              </div>
              <div className="home-featured-stat__label">Rating</div>
            </div>
          </div>
        </motion.div>

        {/* Similarity Panel */}
        <motion.div
          className="home-featured-similar"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="home-featured-similar__title">Similar Players</div>

          {similar.length > 0
            ? similar.map((s, i) => (
                <motion.div
                  key={s.player_id}
                  className="home-similar-row"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="home-similar-row__rank">{i + 1}</span>
                  <div className="home-similar-row__avatar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="home-similar-row__info">
                    <div className="home-similar-row__name">{s.player_name}</div>
                    <div className="home-similar-row__position">{s.position}</div>
                  </div>
                  <span className="home-similar-row__score">
                    {(s.similarity * 100).toFixed(1)}%
                  </span>
                </motion.div>
              ))
            : // Placeholder rows when API is not available
              ["Kylian Mbappé", "Vinícius Jr", "Bukayo Saka", "Lamine Yamal", "Jude Bellingham"].map(
                (name, i) => (
                  <div key={name} className="home-similar-row">
                    <span className="home-similar-row__rank">{i + 1}</span>
                    <div className="home-similar-row__avatar">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className="home-similar-row__info">
                      <div className="home-similar-row__name">{name}</div>
                      <div className="home-similar-row__position">FWD</div>
                    </div>
                    <span className="home-similar-row__score">
                      {(94.2 - i * 2.5).toFixed(1)}%
                    </span>
                  </div>
                )
              )}

          <div style={{
            fontSize: "0.75rem",
            color: "var(--text-ghost)",
            marginTop: "var(--space-2)",
            lineHeight: 1.5,
          }}>
            Cosine similarity across 15+ statistical features
          </div>
        </motion.div>
      </div>
    </section>
  );
}
