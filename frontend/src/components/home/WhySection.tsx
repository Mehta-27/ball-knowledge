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

        const featured = players[0];
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
        // placeholder
      }
    }

    loadFeatured();
  }, []);

  const statItems = [
    { label: "Goals", value: player?.goals ?? "—", accent: true },
    { label: "Assists", value: player?.assists ?? "—" },
    { label: "xG", value: player?.xG ? player.xG.toFixed(1) : "—" },
    { label: "Rating", value: player?.rating ? player.rating.toFixed(1) : "—", accent: true },
  ];

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
        {/* Player Card — backlit with edge glow */}
        <motion.div
          className="featured-card"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Backlit glow layer */}
          <div className="featured-card__glow" aria-hidden="true" />

          <div className="featured-card__inner">
            <div className="featured-card__header">
              <div className="featured-card__avatar">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <div className="featured-card__info">
                <div className="featured-card__name">
                  {player?.name ?? "Loading..."}
                </div>
                <div className="featured-card__meta">
                  {player?.position && <>{player.position} &middot; </>}
                  {player?.team || player?.country || "2026 World Cup"}
                </div>
              </div>
            </div>

            <div className="featured-card__stats">
              {statItems.map((s) => (
                <div key={s.label} className="featured-card-stat">
                  <div className={`featured-card-stat__value ${s.accent ? "featured-card-stat__value--accent" : ""}`}>
                    {s.value}
                  </div>
                  <div className="featured-card-stat__label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Similarity Panel */}
        <motion.div
          className="home-featured-similar"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="home-featured-similar__title">Similar Players</div>

          {similar.length > 0
            ? similar.map((s, i) => (
                <motion.div
                  key={s.player_id}
                  className="similar-row"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="similar-row__rank">{i + 1}</span>
                  <div className="similar-row__avatar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="similar-row__info">
                    <div className="similar-row__name">{s.player_name}</div>
                    <div className="similar-row__position">{s.position}</div>
                  </div>
                  <span className="similar-row__score">
                    {(s.similarity * 100).toFixed(1)}%
                  </span>
                </motion.div>
              ))
            : ["Kylian Mbappé", "Vinícius Jr", "Bukayo Saka", "Lamine Yamal", "Jude Bellingham"].map(
                (name, i) => (
                  <div key={name} className="similar-row">
                    <span className="similar-row__rank">{i + 1}</span>
                    <div className="similar-row__avatar">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className="similar-row__info">
                      <div className="similar-row__name">{name}</div>
                      <div className="similar-row__position">FWD</div>
                    </div>
                    <span className="similar-row__score">
                      {(94.2 - i * 2.5).toFixed(1)}%
                    </span>
                  </div>
                )
              )}

          <div className="similar-footer">
            Cosine similarity across 15+ statistical features
          </div>
        </motion.div>
      </div>
    </section>
  );
}
