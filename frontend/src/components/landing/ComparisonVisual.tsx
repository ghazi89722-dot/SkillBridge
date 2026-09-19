"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ScrollSection } from "./ScrollSection";

const traditionalSteps = ["Resume", "Apply", "Job"];
const skillBridgeSteps = [
  "Career Goal",
  "Skills",
  "Assessment",
  "Gap",
  "Improvement",
  "Readiness",
  "Opportunity",
];

export function ComparisonVisual() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Traditional */}
      <ScrollSection direction="right" className="rounded-[1.5rem] border border-border bg-surface p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          Traditional Job Platform
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          {traditionalSteps.map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-background text-sm font-medium text-text-secondary sm:h-14 sm:w-14">
                  {step === "Resume" ? "📄" : step === "Apply" ? "📨" : "💼"}
                </div>
                <span className="mt-2 text-xs font-medium text-text-secondary">
                  {step}
                </span>
              </div>
              {i < traditionalSteps.length - 1 && (
                <div className="mb-5 h-0.5 w-6 bg-border sm:w-10" />
              )}
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-text-muted">
          Claims only. No evidence of readiness.
        </p>
      </ScrollSection>

      {/* SkillBridge */}
      <ScrollSection
        direction="left"
        delay={0.15}
        className="rounded-[1.5rem] border-2 border-primary/20 p-6 sm:p-8"
      >
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            SkillBridge
          </p>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            Evidence-Based
          </span>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {skillBridgeSteps.map((step, i) => (
            <motion.div
              key={step}
              className="flex items-center gap-2"
              initial={
                prefersReducedMotion ? {} : { opacity: 0, y: 10 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
            >
              <div className="flex flex-col items-center">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-button-text sm:h-11 sm:w-11"
                  style={{
                    background:
                      i === 0
                        ? "var(--pine)"
                        : i === skillBridgeSteps.length - 1
                        ? "var(--ochre)"
                        : `linear-gradient(135deg, var(--pine), rgba(33,70,61,0.7))`,
                  }}
                >
                  {i + 1}
                </div>
                <span className="mt-1.5 max-w-[70px] text-center text-[10px] font-semibold leading-tight text-text-primary sm:text-xs">
                  {step}
                </span>
              </div>
              {i < skillBridgeSteps.length - 1 && (
                <motion.div
                  className="mb-5 h-0.5 w-3 rounded-full sm:w-4"
                  style={{ background: "var(--primary)" }}
                  initial={
                    prefersReducedMotion ? {} : { scaleX: 0 }
                  }
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.3 + i * 0.08,
                    duration: 0.3,
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm font-medium text-primary">
          From career goal to verified readiness to opportunity.
        </p>
      </ScrollSection>
    </div>
  );
}
