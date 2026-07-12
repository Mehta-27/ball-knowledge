import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { useCallback, useMemo } from "react";

interface NetworkNode {
  id: number;
  name: string;
  x: number;
  y: number;
  r: number;
  delay: number;
}

interface NetworkEdge {
  from: number;
  to: number;
  delay: number;
}

const nodes: NetworkNode[] = [
  { id: 0, name: "Messi", x: 400, y: 200, r: 22, delay: 0 },
  { id: 1, name: "Mbappé", x: 280, y: 140, r: 16, delay: 0.3 },
  { id: 2, name: "Haaland", x: 540, y: 150, r: 17, delay: 0.6 },
  { id: 3, name: "Bellingham", x: 320, y: 280, r: 14, delay: 0.9 },
  { id: 4, name: "Vinícius", x: 500, y: 290, r: 15, delay: 1.2 },
  { id: 5, name: "Saka", x: 180, y: 220, r: 12, delay: 0.4 },
  { id: 6, name: "Pedri", x: 440, y: 110, r: 11, delay: 0.7 },
  { id: 7, name: "Salah", x: 620, y: 220, r: 13, delay: 1.0 },
  { id: 8, name: "De Bruyne", x: 200, y: 310, r: 12, delay: 0.5 },
  { id: 9, name: "Rodri", x: 370, y: 350, r: 11, delay: 1.3 },
  { id: 10, name: "Yamal", x: 560, y: 340, r: 10, delay: 0.8 },
  { id: 11, name: "Foden", x: 140, y: 160, r: 9, delay: 1.1 },
  { id: 12, name: "Kvaratskhelia", x: 660, y: 300, r: 10, delay: 0.2 },
  { id: 13, name: "Musiala", x: 480, y: 380, r: 10, delay: 1.5 },
  { id: 14, name: "Valverde", x: 300, y: 380, r: 9, delay: 1.4 },
];

const edges: NetworkEdge[] = [
  { from: 0, to: 1, delay: 0 },
  { from: 0, to: 2, delay: 0.3 },
  { from: 0, to: 3, delay: 0.6 },
  { from: 0, to: 4, delay: 0.9 },
  { from: 1, to: 4, delay: 0.2 },
  { from: 1, to: 6, delay: 0.5 },
  { from: 2, to: 7, delay: 0.4 },
  { from: 2, to: 3, delay: 0.7 },
  { from: 3, to: 9, delay: 0.8 },
  { from: 3, to: 4, delay: 1.0 },
  { from: 4, to: 10, delay: 0.6 },
  { from: 5, to: 8, delay: 0.3 },
  { from: 5, to: 11, delay: 0.9 },
  { from: 6, to: 0, delay: 0.4 },
  { from: 7, to: 12, delay: 0.7 },
  { from: 8, to: 9, delay: 0.5 },
  { from: 9, to: 14, delay: 1.1 },
  { from: 10, to: 13, delay: 0.8 },
  { from: 11, to: 6, delay: 1.0 },
  { from: 12, to: 7, delay: 0.2 },
  { from: 13, to: 14, delay: 1.2 },
  { from: 0, to: 6, delay: 0.1 },
  { from: 1, to: 5, delay: 0.6 },
];

function NetworkVisualization({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const parallaxX = (mouseX - 0.5) * 20;
  const parallaxY = (mouseY - 0.5) * 15;

  return (
    <motion.div
      className="home-hero__network"
      style={{ x: parallaxX, y: parallaxY }}
    >
      <svg viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background grid — subtle tactical feel */}
        {Array.from({ length: 9 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={80 * (i + 1)}
            y1="0"
            x2={80 * (i + 1)}
            y2="450"
            stroke="rgba(0,214,143,0.02)"
            strokeWidth="0.5"
          />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={75 * (i + 1)}
            x2="800"
            y2={75 * (i + 1)}
            stroke="rgba(0,214,143,0.02)"
            strokeWidth="0.5"
          />
        ))}

        {/* Connection edges */}
        {edges.map((edge, i) => {
          const fromNode = nodes[edge.from];
          const toNode = nodes[edge.to];
          return (
            <g key={`edge-${i}`}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="rgba(0,214,143,0.06)"
                strokeWidth="0.8"
              />
              {/* Animated pulse traveling along edge */}
              <circle r="1.5" fill="rgba(0,214,143,0.3)">
                <animateMotion
                  dur={`${3 + edge.delay}s`}
                  begin={`${edge.delay}s`}
                  repeatCount="indefinite"
                  path={`M${fromNode.x} ${fromNode.y} L${toNode.x} ${toNode.y}`}
                />
                <animate
                  attributeName="opacity"
                  values="0;0.6;0"
                  dur={`${3 + edge.delay}s`}
                  begin={`${edge.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}

        {/* Player nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            {/* Outer glow ring */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r + 6}
              fill="none"
              stroke="rgba(0,214,143,0.06)"
              strokeWidth="0.5"
            >
              <animate
                attributeName="r"
                values={`${node.r + 4};${node.r + 8};${node.r + 4}`}
                dur="4s"
                begin={`${node.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                values="0.04;0.1;0.04"
                dur="4s"
                begin={`${node.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
            {/* Node circle */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill={node.id === 0 ? "rgba(0,214,143,0.12)" : "rgba(0,214,143,0.06)"}
              stroke={node.id === 0 ? "rgba(0,214,143,0.3)" : "rgba(0,214,143,0.12)"}
              strokeWidth={node.id === 0 ? 1.5 : 0.8}
            >
              <animate
                attributeName="fill-opacity"
                values="0.6;1;0.6"
                dur="3s"
                begin={`${node.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
            {/* Node label */}
            <text
              x={node.x}
              y={node.y + node.r + 14}
              textAnchor="middle"
              fill={node.id === 0 ? "rgba(0,214,143,0.5)" : "rgba(255,255,255,0.2)"}
              fontSize={node.id === 0 ? "11" : "9"}
              fontWeight={node.id === 0 ? "600" : "500"}
              fontFamily="Inter, sans-serif"
              letterSpacing="0.02em"
            >
              {node.name}
            </text>
          </g>
        ))}

        {/* Central highlight —梅西 node glow */}
        <circle
          cx={400}
          cy={200}
          r="40"
          fill="none"
          stroke="rgba(0,214,143,0.08)"
          strokeWidth="0.5"
          strokeDasharray="2 4"
        >
          <animate
            attributeName="r"
            values="35;45;35"
            dur="5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-opacity"
            values="0.05;0.12;0.05"
            dur="5s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </motion.div>
  );
}

export default function HeroSection() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY]
  );

  const parallaxX = useTransform(springX, [0, 1], [-10, 10]);
  const parallaxY = useTransform(springY, [0, 1], [-8, 8]);

  const letterVariants = useMemo(
    () =>
      ({
        hidden: { opacity: 0, y: 40, rotateX: -30 },
        visible: (i: number) => ({
          opacity: 1,
          y: 0,
          rotateX: 0,
          transition: {
            duration: 0.7,
            delay: 0.3 + i * 0.04,
            ease: [0.16, 1, 0.3, 1] as const,
          },
        }),
      }),
    []
  );

  const titleText = "Ball Knowledge";

  return (
    <section className="home-hero" onMouseMove={handleMouseMove}>
      <NetworkVisualization
        mouseX={mouseX.get()}
        mouseY={mouseY.get()}
      />

      <motion.div
        className="home-hero__content"
        style={{ x: parallaxX, y: parallaxY }}
      >
        <motion.div
          className="home-hero__overline"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          2026 FIFA World Cup Intelligence
        </motion.div>

        <h1 className="home-hero__title">
          {titleText.split("").map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: "inline-block",
                whiteSpace: char === " " ? "pre" : undefined,
              }}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="home-hero__subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Every pass. Every duel. Every decision. <br />
          Football intelligence powered by machine learning.
        </motion.p>

        <motion.div
          className="home-hero__actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
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
          transition={{ duration: 0.8, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
    </section>
  );
}
