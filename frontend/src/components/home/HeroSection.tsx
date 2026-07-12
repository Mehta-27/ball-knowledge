import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { useCallback } from "react";

interface Node {
  x: number;
  y: number;
  r: number;
}

const nodes: Node[] = [
  { x: 400, y: 180, r: 6 },
  { x: 260, y: 130, r: 4 },
  { x: 560, y: 140, r: 5 },
  { x: 310, y: 270, r: 4 },
  { x: 510, y: 260, r: 4.5 },
  { x: 180, y: 210, r: 3.5 },
  { x: 450, y: 100, r: 3 },
  { x: 640, y: 210, r: 3.5 },
  { x: 200, y: 320, r: 3 },
  { x: 380, y: 340, r: 3 },
  { x: 570, y: 330, r: 3 },
  { x: 130, y: 150, r: 2.5 },
  { x: 680, y: 300, r: 2.5 },
  { x: 490, y: 370, r: 2.5 },
  { x: 300, y: 380, r: 2.5 },
];

const edges: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4],
  [1, 4], [1, 6], [2, 7], [2, 3],
  [3, 8], [3, 4], [4, 10],
  [5, 8], [5, 11], [6, 0],
  [7, 12], [8, 9], [9, 14],
  [10, 13], [11, 6], [12, 7],
  [13, 14], [0, 6], [1, 5],
];

function Network() {
  return (
    <div className="home-hero__network">
      <svg viewBox="0 0 800 450" fill="none">
        {/* Very subtle grid */}
        {Array.from({ length: 9 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={80 * (i + 1)} y1="0"
            x2={80 * (i + 1)} y2="450"
            stroke="rgba(0,214,143,0.018)"
            strokeWidth="0.5"
          />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line
            key={`h${i}`}
            x1="0" y1={75 * (i + 1)}
            x2="800" y2={75 * (i + 1)}
            stroke="rgba(0,214,143,0.018)"
            strokeWidth="0.5"
          />
        ))}

        {/* Edges — static, very faint */}
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x} y1={nodes[a].y}
            x2={nodes[b].x} y2={nodes[b].y}
            stroke="rgba(0,214,143,0.04)"
            strokeWidth="0.6"
          />
        ))}

        {/* A few slow-traveling pulses — not on every edge */}
        {[[0, 1], [0, 2], [2, 7], [3, 9], [5, 8]].map(([a, b], i) => (
          <circle key={`pulse-${i}`} r="1.2" fill="rgba(0,214,143,0.25)">
            <animateMotion
              dur={`${6 + i * 1.5}s`}
              begin={`${i * 2}s`}
              repeatCount="indefinite"
              path={`M${nodes[a].x} ${nodes[a].y} L${nodes[b].x} ${nodes[b].y}`}
            />
            <animate
              attributeName="opacity"
              values="0;0.5;0"
              dur={`${6 + i * 1.5}s`}
              begin={`${i * 2}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Nodes — no text labels */}
        {nodes.map((node, i) => (
          <circle
            key={i}
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill="rgba(0,214,143,0.08)"
            stroke="rgba(0,214,143,0.1)"
            strokeWidth="0.5"
          />
        ))}

        {/* Central glow ring — one slow pulse */}
        <circle
          cx="400" cy="200" r="30"
          fill="none"
          stroke="rgba(0,214,143,0.06)"
          strokeWidth="0.5"
          strokeDasharray="2 4"
        >
          <animate
            attributeName="r"
            values="25;35;25"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}

export default function HeroSection() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY]
  );

  const parallaxX = useTransform(springX, [0, 1], [-8, 8]);
  const parallaxY = useTransform(springY, [0, 1], [-6, 6]);

  return (
    <section className="home-hero" onMouseMove={handleMouseMove}>
      <Network />

      <motion.div
        className="home-hero__content"
        style={{ x: parallaxX, y: parallaxY }}
      >
        <motion.div
          className="home-hero__overline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        >
          2026 FIFA World Cup Intelligence
        </motion.div>

        <motion.h1
          className="home-hero__title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Ball Knowledge
        </motion.h1>

        <motion.p
          className="home-hero__subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: "easeOut" }}
        >
          Every pass. Every duel. Every decision.
          <br />
          Football intelligence powered by machine learning.
        </motion.p>

        <motion.div
          className="home-hero__actions"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
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
          transition={{ duration: 1, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
    </section>
  );
}
