"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

type SkillStatus = "done" | "warning" | "missing";

interface Skill {
  name: string;
  status: SkillStatus;
}

interface ReadinessCardProps {
  title: string;
  targetRole: string;
  skills: Skill[];
  readinessPercent: number;
  accentColor?: string;
  accentLight?: string;
  icon: React.ReactNode;
  variant?: "engineering" | "medical";
}

const statusIcon: Record<SkillStatus, { symbol: string; color: string }> = {
  done: { symbol: "✓", color: "var(--pine)" },
  warning: { symbol: "⚠", color: "var(--ochre)" },
  missing: { symbol: "○", color: "var(--text-muted)" },
};

export function ReadinessCard({
  title,
  targetRole,
  skills,
  readinessPercent,
  accentColor = "var(--pine)",
  accentLight = "rgba(33,70,61,0.08)",
  icon,
  variant = "engineering",
}: ReadinessCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setAnimatedPercent(readinessPercent);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let current = 0;
          const step = readinessPercent / 40;
          const interval = setInterval(() => {
            current += step;
            if (current >= readinessPercent) {
              setAnimatedPercent(readinessPercent);
              clearInterval(interval);
            } else {
              setAnimatedPercent(Math.round(current));
            }
          }, 25);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [readinessPercent, hasAnimated, prefersReducedMotion]);

  const gaps = skills.filter((s) => s.status !== "done");

  return (
    <motion.div
      ref={cardRef}
      className="rounded-[1.5rem] border border-border bg-surface p-6 transition-shadow duration-300 hover:shadow-lg sm:p-7"
      style={{ boxShadow: "var(--shadow-card)" }}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: accentLight }}
            >
              {icon}
            </div>
            <p
              className="text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: accentColor }}
            >
              {title}
            </p>
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.15em] text-text-muted">
            Target Role
          </p>
          <p className="mt-1 font-fraunces text-lg font-semibold text-text-primary">
            {targetRole}
          </p>
        </div>
        <div
          className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
          style={{
            background: accentLight,
            color: accentColor,
          }}
        >
          Example
        </div>
      </div>

      {/* Skills list */}
      <div className="mb-5 space-y-2">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
          Required Skills
        </p>
        {skills.map((skill, i) => {
          const si = statusIcon[skill.status];
          return (
            <motion.div
              key={skill.name}
              className="flex items-center justify-between rounded-xl border border-border/50 bg-background/60 px-3.5 py-2"
              initial={
                prefersReducedMotion ? {} : { opacity: 0, x: -10 }
              }
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
            >
              <span className="text-sm text-text-primary">{skill.name}</span>
              <span
                className="text-sm font-semibold"
                style={{ color: si.color }}
              >
                {si.symbol}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Readiness score */}
      <div
        className="rounded-2xl p-4"
        style={{ background: accentLight }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
          Role Readiness
        </p>
        <div className="mt-3 flex items-end gap-3">
          <span
            className="font-fraunces text-4xl font-bold"
            style={{ color: accentColor }}
          >
            {animatedPercent}%
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border/30">
          <motion.div
            className="h-full rounded-full"
            style={{ background: accentColor }}
            initial={{ width: 0 }}
            whileInView={{
              width: `${readinessPercent}%`,
            }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Skill gaps */}
      {gaps.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
            Skill Gaps
          </p>
          <div className="flex flex-wrap gap-1.5">
            {gaps.map((g) => (
              <span
                key={g.name}
                className="rounded-full border px-2.5 py-1 text-xs font-medium"
                style={{
                  borderColor:
                    g.status === "warning" ? "var(--ochre)" : "var(--border)",
                  color:
                    g.status === "warning"
                      ? "var(--ochre)"
                      : "var(--text-secondary)",
                  background:
                    g.status === "warning"
                      ? "rgba(185,134,60,0.08)"
                      : "transparent",
                }}
              >
                {g.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
