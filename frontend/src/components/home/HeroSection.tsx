import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/* ── Pitch outline (viewBox 1000x600) ──────────────────────────── */
function Pitch() {
  return (
    <svg viewBox="0 0 1000 600" fill="none" className="hero-pitch">
      <rect x="40" y="20" width="920" height="560" rx="2"
        stroke="rgba(0,214,143,0.06)" strokeWidth="1" />
      <line x1="500" y1="20" x2="500" y2="580"
        stroke="rgba(0,214,143,0.04)" strokeWidth="0.8" />
      <circle cx="500" cy="300" r="72"
        stroke="rgba(0,214,143,0.05)" strokeWidth="0.8" />
      <circle cx="500" cy="300" r="2"
        fill="rgba(0,214,143,0.12)" />
      <rect x="40" y="160" width="120" height="280"
        stroke="rgba(0,214,143,0.04)" strokeWidth="0.8" />
      <rect x="40" y="220" width="48" height="160"
        stroke="rgba(0,214,143,0.03)" strokeWidth="0.8" />
      <rect x="840" y="160" width="120" height="280"
        stroke="rgba(0,214,143,0.04)" strokeWidth="0.8" />
      <rect x="912" y="220" width="48" height="160"
        stroke="rgba(0,214,143,0.03)" strokeWidth="0.8" />
      <path d="M160 245 A50 50 0 0 1 160 355"
        stroke="rgba(0,214,143,0.03)" strokeWidth="0.8" />
      <path d="M840 245 A50 50 0 0 0 840 355"
        stroke="rgba(0,214,143,0.03)" strokeWidth="0.8" />
      <path d="M40 32 A12 12 0 0 0 52 20" stroke="rgba(0,214,143,0.04)" strokeWidth="0.8" />
      <path d="M948 20 A12 12 0 0 0 960 32" stroke="rgba(0,214,143,0.04)" strokeWidth="0.8" />
      <path d="M40 568 A12 12 0 0 1 52 580" stroke="rgba(0,214,143,0.04)" strokeWidth="0.8" />
      <path d="M948 580 A12 12 0 0 1 960 568" stroke="rgba(0,214,143,0.04)" strokeWidth="0.8" />
      {[200, 360, 640, 800].map((x) => (
        <line key={`zone-${x}`} x1={x} y1="20" x2={x} y2="580"
          stroke="rgba(0,214,143,0.015)" strokeWidth="0.5" strokeDasharray="4 8" />
      ))}
    </svg>
  );
}

/* ── 4-3-3 Formation ────────────────────────────────────────────── */
interface Pos { x: number; y: number; label: string; zone: string }

const formation: Pos[] = [
  { x: 100, y: 300, label: "GK", zone: "GK" },
  { x: 220, y: 140, label: "LB", zone: "DEF" },
  { x: 220, y: 250, label: "CB", zone: "DEF" },
  { x: 220, y: 350, label: "CB", zone: "DEF" },
  { x: 220, y: 460, label: "RB", zone: "DEF" },
  { x: 400, y: 200, label: "CM", zone: "MID" },
  { x: 400, y: 300, label: "CM", zone: "MID" },
  { x: 400, y: 400, label: "CM", zone: "MID" },
  { x: 580, y: 170, label: "LW", zone: "FWD" },
  { x: 620, y: 300, label: "ST", zone: "FWD" },
  { x: 580, y: 430, label: "RW", zone: "FWD" },
];

const passingLinks: [number, number][] = [
  [0, 2], [0, 3], [1, 5], [2, 5], [2, 6],
  [3, 6], [3, 7], [4, 7], [5, 8], [5, 9],
  [6, 9], [6, 10], [1, 2], [2, 3], [3, 4],
  [5, 6], [6, 7], [8, 9], [9, 10],
];

const ballPath = "M 100 300 Q 300 150 500 300 Q 650 400 780 280";

function Formation() {
  return (
    <svg viewBox="0 0 1000 600" fill="none" className="hero-formation">
      {passingLinks.map(([a, b], i) => (
        <line key={`link-${i}`}
          x1={formation[a].x} y1={formation[a].y}
          x2={formation[b].x} y2={formation[b].y}
          stroke="rgba(0,214,143,0.04)" strokeWidth="0.6" />
      ))}
      {[[0, 2], [2, 6], [6, 9], [4, 7], [5, 8], [9, 10]].map(([a, b], i) => (
        <circle key={`pass-${i}`} r="1.5" fill="rgba(0,214,143,0.35)">
          <animateMotion dur={`${5 + i}s`} begin={`${i * 1.8}s`} repeatCount="indefinite"
            path={`M${formation[a].x} ${formation[a].y} L${formation[b].x} ${formation[b].y}`} />
          <animate attributeName="opacity" values="0;0.6;0"
            dur={`${5 + i}s`} begin={`${i * 1.8}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <path d={ballPath} stroke="rgba(0,214,143,0.08)" strokeWidth="1" strokeDasharray="3 6" fill="none" />
      <circle r="2" fill="rgba(0,214,143,0.5)">
        <animateMotion dur="8s" repeatCount="indefinite" path={ballPath} />
        <animate attributeName="opacity" values="0.2;0.7;0.2" dur="8s" repeatCount="indefinite" />
      </circle>
      {formation.map((pos, i) => (
        <g key={`pos-${i}`}>
          <circle cx={pos.x} cy={pos.y} r="12" fill="none" stroke="rgba(0,214,143,0.06)" strokeWidth="0.5" />
          <circle cx={pos.x} cy={pos.y} r="3" fill="rgba(0,214,143,0.15)"
            stroke="rgba(0,214,143,0.25)" strokeWidth="0.8" />
          <text x={pos.x} y={pos.y + 22} textAnchor="middle" fill="rgba(0,214,143,0.12)"
            fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.05em">
            {pos.label}
          </text>
        </g>
      ))}
      <text x="170" y="590" fill="rgba(0,214,143,0.04)" fontSize="9"
        fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.15em">DEFENSIVE THIRD</text>
      <text x="370" y="590" fill="rgba(0,214,143,0.04)" fontSize="9"
        fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.15em">MIDDLE THIRD</text>
      <text x="580" y="590" fill="rgba(0,214,143,0.04)" fontSize="9"
        fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.15em">ATTACKING THIRD</text>
    </svg>
  );
}

/* ── Football silhouette SVGs for floating objects ─────────────── */

/* Football (soccer ball) — pentagon pattern */
function FootballSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M20 6 L14 12 L16 19 L24 19 L26 12 Z" stroke="currentColor" strokeWidth="0.7" opacity="0.4" />
      <path d="M14 12 L8 16 L10 22 L16 19 Z" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <path d="M26 12 L32 16 L30 22 L24 19 Z" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <path d="M16 19 L10 22 L12 28 L20 30 L24 19 Z" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <path d="M20 30 L28 28 L30 22 L24 19 Z" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

/* Boot / cleat silhouette */
function BootSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 50 30" fill="none">
      <path d="M5 8 Q8 4 14 4 L22 4 Q24 4 25 6 L28 14 Q29 16 30 16 L44 16 Q48 16 48 20 L48 24 Q48 26 46 26 L6 26 Q4 26 4 22 L4 14 Q4 10 5 8Z"
        stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
      <line x1="8" y1="26" x2="8" y2="29" stroke="currentColor" strokeWidth="0.6" opacity="0.25" />
      <line x1="14" y1="26" x2="14" y2="29" stroke="currentColor" strokeWidth="0.6" opacity="0.25" />
      <line x1="20" y1="26" x2="20" y2="29" stroke="currentColor" strokeWidth="0.6" opacity="0.25" />
    </svg>
  );
}

/* Whistle silhouette */
function WhistleSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 50 25" fill="none">
      <path d="M6 12 Q6 6 12 6 L34 6 Q38 6 40 8 L46 12 Q48 14 46 16 L40 20 Q38 22 34 22 L12 22 Q6 22 6 16 Z"
        stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <circle cx="10" cy="14" r="4" stroke="currentColor" strokeWidth="0.7" opacity="0.25" />
      <line x1="40" y1="10" x2="40" y2="18" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
    </svg>
  );
}

/* Referee card */
function CardSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 30 36" fill="none">
      <rect x="3" y="2" width="24" height="32" rx="2" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <line x1="3" y1="18" x2="27" y2="18" stroke="currentColor" strokeWidth="0.4" opacity="0.15" />
    </svg>
  );
}

/* Corner flag */
function CornerFlagSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 24 34" fill="none">
      <line x1="4" y1="2" x2="4" y2="32" stroke="currentColor" strokeWidth="0.7" opacity="0.25" />
      <path d="M4 2 L20 8 L4 14 Z" stroke="currentColor" strokeWidth="0.6" fill="currentColor" opacity="0.08" />
    </svg>
  );
}

/* ── Floating objects with depth-of-field ──────────────────────── */
interface FloatObj {
  component: React.FC<{ size: number }>;
  x: string;
  y: string;
  size: number;
  blur: number;
  opacity: number;
  duration: number;
  delay: number;
  drift: number;
}

const floatObjects: FloatObj[] = [
  // Near layer — sharp, small, slow
  { component: FootballSVG, x: "12%", y: "25%", size: 28, blur: 0, opacity: 0.12, duration: 22, delay: 0, drift: 15 },
  { component: BootSVG, x: "85%", y: "35%", size: 36, blur: 0, opacity: 0.08, duration: 26, delay: -6, drift: -12 },
  { component: CardSVG, x: "78%", y: "70%", size: 22, blur: 0, opacity: 0.07, duration: 24, delay: -10, drift: 10 },
  { component: CornerFlagSVG, x: "8%", y: "65%", size: 18, blur: 0, opacity: 0.06, duration: 28, delay: -14, drift: -8 },

  // Mid layer — slightly blurred, medium
  { component: FootballSVG, x: "70%", y: "18%", size: 40, blur: 1.5, opacity: 0.06, duration: 30, delay: -4, drift: -18 },
  { component: WhistleSVG, x: "22%", y: "75%", size: 44, blur: 1, opacity: 0.05, duration: 28, delay: -12, drift: 14 },
  { component: BootSVG, x: "55%", y: "80%", size: 32, blur: 1.5, opacity: 0.04, duration: 26, delay: -8, drift: -10 },

  // Far layer — very blurred, large, ghostly
  { component: FootballSVG, x: "40%", y: "15%", size: 60, blur: 4, opacity: 0.03, duration: 35, delay: -2, drift: 20 },
  { component: CornerFlagSVG, x: "90%", y: "55%", size: 30, blur: 3, opacity: 0.025, duration: 32, delay: -16, drift: -15 },
  { component: CardSVG, x: "15%", y: "45%", size: 34, blur: 3.5, opacity: 0.02, duration: 30, delay: -20, drift: 12 },
];

function FloatingObjects() {
  return (
    <div className="hero-floating" aria-hidden="true">
      {floatObjects.map((obj, i) => {
        const Comp = obj.component;
        return (
          <div
            key={i}
            className="hero-floating__obj"
            style={{
              left: obj.x,
              top: obj.y,
              filter: obj.blur > 0 ? `blur(${obj.blur}px)` : undefined,
              opacity: obj.opacity,
              animationDuration: `${obj.duration}s`,
              animationDelay: `${obj.delay}s`,
              '--drift': `${obj.drift}px`,
            } as React.CSSProperties}
          >
            <Comp size={obj.size} />
          </div>
        );
      })}
    </div>
  );
}

/* ── Hero Section ──────────────────────────────────────────────── */
export default function HeroSection() {
  return (
    <section className="home-hero">
      {/* Layer 1: Pitch */}
      <div className="hero-layer hero-layer--pitch">
        <Pitch />
      </div>

      {/* Layer 2: Formation */}
      <div className="hero-layer hero-layer--formation">
        <Formation />
      </div>

      {/* Layer 3: Floating football objects with depth-of-field */}
      <FloatingObjects />

      {/* Content */}
      <div className="home-hero__content">
        <motion.div
          className="home-hero__overline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
        >
          2026 FIFA World Cup Intelligence
        </motion.div>

        <motion.h1
          className="home-hero__title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Ball Knowledge
        </motion.h1>

        <motion.p
          className="home-hero__subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
        >
          Every pass. Every duel. Every decision.
          <br />
          Football intelligence powered by machine learning.
        </motion.p>

        <motion.div
          className="home-hero__actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1, ease: "easeOut" }}
        >
          <Link to="/players" className="btn btn--primary btn--lg">
            Explore Players
          </Link>
          <Link to="/matches" className="btn btn--secondary btn--lg">
            View Matches
          </Link>
        </motion.div>

        <motion.div
          className="home-hero__line"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.2, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </section>
  );
}
