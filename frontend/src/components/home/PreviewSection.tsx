import { motion } from "framer-motion";

function PlayerPreview() {
  return (
        <div className="preview-card preview-card--player">
          <div className="preview-card__glow" style={{ background: "radial-gradient(circle at 30% 20%, rgba(59,130,246,0.12), transparent 70%)" }} />
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--bg-elevated), var(--bg-surface))",
              border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-muted)", fontSize: "1.5rem",
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "1.05rem", marginBottom: 4 }}>Lionel Messi</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>Forward &middot; Argentina</div>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <span className="badge badge--primary">#10</span>
                <span className="badge badge--success">9.2</span>
              </div>
            </div>
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px", marginTop: 20, paddingTop: 16,
            borderTop: "1px solid var(--border)",
          }}>
            {[
              { label: "Goals", value: "8" },
              { label: "Assists", value: "5" },
              { label: "xG", value: "7.2" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>{s.value}</div>
                <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
  );
}

function TeamPreview() {
  return (
        <div className="preview-card preview-card--team">
          <div className="preview-card__glow" style={{ background: "radial-gradient(circle at 70% 30%, rgba(16,185,129,0.12), transparent 70%)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: "0.875rem", color: "#fff",
            }}>
              ARG
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "1.05rem" }}>Argentina</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>CONMEBOL</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["FWD", "MID", "DEF", "GK"].map((pos) => (
              <span key={pos} className="badge badge--neutral">{pos}</span>
            ))}
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px", marginTop: 16, paddingTop: 14,
            borderTop: "1px solid var(--border)",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>26</div>
              <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Squad</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>2</div>
              <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Stage</div>
            </div>
          </div>
        </div>
  );
}

function MatchPreview() {
  return (
        <div className="preview-card preview-card--match">
          <div className="preview-card__glow" style={{ background: "radial-gradient(circle at 50% 0%, rgba(245,158,11,0.1), transparent 70%)" }} />
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <span className="badge badge--warning" style={{ marginBottom: 12, display: "inline-flex" }}>Group Stage</span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 20, marginBottom: 16,
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 44, height: 44, borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, #60a5fa, #2563eb)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: "0.75rem", color: "#fff", margin: "0 auto 6px",
              }}>BRA</div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 500 }}>Brazil</div>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              2 — 1
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 44, height: 44, borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, #f87171, #dc2626)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: "0.75rem", color: "#fff", margin: "0 auto 6px",
              }}>GER</div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 500 }}>Germany</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
            {[
              { label: "xG", value: "1.8" },
              { label: "Poss", value: "58%" },
              { label: "Shots", value: "14" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1rem", fontWeight: 700 }}>{s.value}</div>
                <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
  );
}

function SimilarityPreview() {
  return (
        <div className="preview-card preview-card--similarity">
          <div className="preview-card__glow" style={{ background: "radial-gradient(circle at 50% 50%, rgba(167,139,250,0.1), transparent 70%)" }} />
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>AI Powered</div>
            <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>Similar Players</div>
          </div>
          <div className="flex--col" style={{ gap: 10 }}>
            {[
              { name: "Kylian Mbappé", pos: "FWD", sim: "94.2%", color: "var(--success)" },
              { name: "Vinicius Jr", pos: "FWD", sim: "91.8%", color: "var(--success)" },
              { name: "Bukayo Saka", pos: "FWD", sim: "88.5%", color: "var(--primary)" },
            ].map((p) => (
              <div key={p.name} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 12px", borderRadius: "var(--radius-md)",
                background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "var(--bg-elevated)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", color: "var(--text-muted)",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>{p.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{p.pos}</div>
                  </div>
                </div>
                <span className="badge badge--success">{p.sim}</span>
              </div>
            ))}
          </div>
        </div>
  );
}

export default function PreviewSection() {
  return (
    <section className="home-preview">
      <div className="home-section-header">
        <motion.span
          className="type-overline"
          style={{ color: "var(--primary)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Platform Preview
        </motion.span>
        <motion.h2
          className="home-section-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          A glimpse of what's inside
        </motion.h2>
      </div>

      <div className="home-preview__grid">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0, ease: [0.16, 1, 0.3, 1] }}
        >
          <PlayerPreview />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <TeamPreview />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <MatchPreview />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <SimilarityPreview />
        </motion.div>
      </div>
    </section>
  );
}
