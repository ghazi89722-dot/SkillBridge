"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ScrollSection, StaggerChild } from "./ScrollSection";

const workflowSteps = [
  {
    label: "Choose Your Goal",
    description: "Pick the career you want to pursue",
    icon: "🎯",
  },
  {
    label: "Claim Your Skills",
    description: "Tell us what you already know",
    icon: "📝",
  },
  {
    label: "Assess Your Skills",
    description: "Verify your actual proficiency level",
    icon: "📋",
  },
  {
    label: "Discover Skill Gaps",
    description: "See what's missing for your target role",
    icon: "🔍",
  },
  {
    label: "Improve",
    description: "Access resources to close your gaps",
    icon: "📈",
  },
  {
    label: "Reassess",
    description: "Prove your progress with new assessments",
    icon: "🔄",
  },
  {
    label: "Build Readiness",
    description: "Achieve evidence-backed career readiness",
    icon: "✅",
  },
  {
    label: "Explore Opportunities",
    description: "Connect with roles that match your skills",
    icon: "🚀",
  },
];

export function WorkflowTimeline() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-40" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(33,70,61,0.05), transparent 50%), radial-gradient(circle at 70% 80%, rgba(185,134,60,0.04), transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <ScrollSection className="mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-secondary">
            How SkillBridge works
          </p>
          <h2 className="mt-4 font-fraunces text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            One Platform. From Learning to Opportunity.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary lg:text-lg">
            SkillBridge helps students understand what skills they need for the
            career they want — then guides them from assessment to readiness.
          </p>
        </ScrollSection>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 hidden h-full w-0.5 md:left-1/2 md:block">
            <motion.div
              className="h-full w-full rounded-full"
              style={{ background: "var(--mist)" }}
              initial={prefersReducedMotion ? {} : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              // eslint-disable-next-line react/style-prop-object
            />
          </div>

          <div className="space-y-8 md:space-y-12">
            {workflowSteps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <StaggerChild key={step.label} index={i} baseDelay={0.1}>
                  <div
                    className={`relative flex flex-col md:flex-row md:items-center ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Node */}
                    <div className="absolute left-6 top-4 z-10 hidden -translate-x-1/2 md:left-1/2 md:block">
                      <motion.div
                        className="flex h-12 w-12 items-center justify-center rounded-full text-lg shadow-md"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--surface), var(--background))",
                          border: "2px solid var(--primary)",
                        }}
                        whileInView={
                          prefersReducedMotion
                            ? {}
                            : { scale: [0.8, 1.1, 1] }
                        }
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.5,
                          delay: 0.2 + i * 0.08,
                        }}
                      >
                        {step.icon}
                      </motion.div>
                    </div>

                    {/* Content card */}
                    <div
                      className={`ml-0 md:w-[calc(50%-2rem)] ${
                        isEven
                          ? "md:mr-auto md:pr-12 md:text-right"
                          : "md:ml-auto md:pl-12 md:text-left"
                      }`}
                    >
                      <div className="glass-card rounded-2xl p-5 transition-shadow duration-300 hover:shadow-lg">
                        <div
                          className={`flex items-center gap-3 ${
                            isEven
                              ? "md:flex-row-reverse md:justify-start"
                              : ""
                          }`}
                        >
                          <span className="text-2xl md:hidden">
                            {step.icon}
                          </span>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                              Step {i + 1}
                            </p>
                            <h3 className="mt-1 font-fraunces text-lg font-semibold text-primary sm:text-xl">
                              {step.label}
                            </h3>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-text-secondary">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </StaggerChild>
              );
            })}
          </div>
        </div>

        {/* Not just a job board callout */}
        <ScrollSection className="mt-16 text-center" delay={0.2}>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5">
            <span className="text-lg">💡</span>
            <span className="text-sm font-semibold text-primary">
              Not just a job board.
            </span>
            <span className="text-sm text-text-secondary">
              SkillBridge maps the path from where you are to where you want to
              be.
            </span>
          </div>
        </ScrollSection>
      </div>
    </section>
  );
}
