"use client";

import { motion, useReducedMotion } from "framer-motion";

const journeySteps = [
  { label: "Career", icon: "🎯", color: "var(--pine)" },
  { label: "Skills", icon: "⚡", color: "var(--ochre)" },
  { label: "Assessment", icon: "📋", color: "var(--pine)" },
  { label: "Skill Gaps", icon: "🔍", color: "var(--rust)" },
  { label: "Improvement", icon: "📈", color: "var(--ochre)" },
  { label: "Readiness", icon: "✅", color: "var(--pine)" },
  { label: "Opportunity", icon: "🚀", color: "var(--ochre)" },
];

export function HeroIllustration() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative w-full" style={{ minHeight: "420px" }}>
      {/* Soft glow background */}
      <div
        className="absolute inset-0 rounded-[2.5rem]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(33,70,61,0.08), transparent 70%)",
        }}
      />

      {/*
        Centering anchor: a zero-size div placed at the exact center of the
        container. Every child (student, cards, SVG) positions itself relative
        to this single point, guaranteeing mathematical centering regardless
        of container aspect ratio.
      */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{ width: 0, height: 0 }}
      >
        {/* Central student figure — positioned from the 0,0 anchor */}
        <div
          className="absolute z-10"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <motion.div
            className="flex flex-col items-center"
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Student avatar */}
            <div
              className="relative flex h-20 w-20 items-center justify-center rounded-full shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, var(--pine), var(--ochre))",
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {/* Pulsing ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: "2px solid var(--pine)",
                  opacity: 0.3,
                  animation: prefersReducedMotion
                    ? "none"
                    : "pulse-ring 3s ease-in-out infinite",
                }}
              />
            </div>
            <span
              className="mt-2 text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Student
            </span>
          </motion.div>
        </div>

        {/* Floating journey cards orbiting around the student */}
        {journeySteps.map((step, i) => {
          const totalSteps = journeySteps.length;
          const angle = (i / totalSteps) * 2 * Math.PI - Math.PI / 2;
          const radiusX = 160;
          const radiusY = 145;
          const x = Math.cos(angle) * radiusX;
          const y = Math.sin(angle) * radiusY;

          return (
            <motion.div
              key={step.label}
              className="absolute z-20"
              style={{
                left: `${x}px`,
                top: `${y}px`,
              }}
              initial={
                prefersReducedMotion
                  ? { x: "-50%", y: "-50%" }
                  : { x: "-50%", y: "-50%", opacity: 0, scale: 0.5 }
              }
              animate={{ x: "-50%", y: "-50%", opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.5 + i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                className="glass-card flex flex-col items-center rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3"
                style={{
                  animation: prefersReducedMotion
                    ? "none"
                    : `float ${3 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
                  minWidth: "80px",
                }}
              >
                <span className="text-lg sm:text-xl">{step.icon}</span>
                <span
                  className="mt-1 text-[10px] font-semibold uppercase tracking-wider sm:text-xs"
                  style={{ color: step.color }}
                >
                  {step.label}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Connecting path SVG — centered on the same 0,0 anchor */}
        <svg
          className="absolute"
          width="400"
          height="400"
          viewBox="-200 -200 400 400"
          fill="none"
          style={{
            zIndex: 5,
            left: "-200px",
            top: "-200px",
          }}
        >
          <motion.ellipse
            cx="0"
            cy="0"
            rx="160"
            ry="145"
            stroke="var(--mist)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            initial={prefersReducedMotion ? {} : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 2, delay: 0.8, ease: "easeInOut" }}
          />
        </svg>
      </div>
    </div>
  );
}
