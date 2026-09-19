"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { HeroIllustration } from "@/components/landing/HeroIllustration";
import { WorkflowTimeline } from "@/components/landing/WorkflowTimeline";
import { ReadinessCard } from "@/components/landing/ReadinessCard";
import { ComparisonVisual } from "@/components/landing/ComparisonVisual";
import { ScrollSection, StaggerChild } from "@/components/landing/ScrollSection";
import { Footer } from "@/components/landing/Footer";
import {
  GraduationCap,
  Building2,
  Landmark,
  Shield,
  FileText,
  Upload,
  User,
  Briefcase,
  Search,
  BarChart3,
  Target,
  Zap,
  CheckCircle2,
  RefreshCw,
  Link2,
  ArrowRight,
  Stethoscope,
  Code,
} from "lucide-react";

/* ====================================================================
   DATA
   ==================================================================== */

const audiencePills = [
  { label: "For Students", icon: <GraduationCap size={14} /> },
  { label: "For Industry", icon: <Building2 size={14} /> },
  { label: "For Institutions", icon: <Landmark size={14} /> },
  { label: "For Ministry / NCISM", icon: <Shield size={14} /> },
];

const problemCards = [
  {
    role: "Students",
    question:
      "\"I know what I studied. But what am I actually missing for my target role?\"",
    icon: <GraduationCap size={28} />,
    color: "var(--pine)",
    bg: "rgba(33,70,61,0.06)",
  },
  {
    role: "Industry",
    question:
      "\"Resumes show claims. How can we understand candidate readiness?\"",
    icon: <Building2 size={28} />,
    color: "var(--ochre)",
    bg: "rgba(185,134,60,0.06)",
  },
  {
    role: "Institutions",
    question: "\"Which skills are students missing?\"",
    icon: <Landmark size={28} />,
    color: "var(--pine)",
    bg: "rgba(33,70,61,0.06)",
  },
  {
    role: "Ministry / NCISM",
    question:
      "\"How can skill readiness be understood across institutions and domains?\"",
    icon: <Shield size={28} />,
    color: "var(--rust)",
    bg: "rgba(168,83,56,0.06)",
  },
];

const whoUsesCards = [
  {
    role: "Students",
    description:
      "Discover skills, assess readiness, identify gaps, improve, upload resume and explore opportunities.",
    icon: <GraduationCap size={24} />,
    color: "var(--pine)",
  },
  {
    role: "Industry",
    description:
      "Define opportunity requirements and review relevant candidates.",
    icon: <Building2 size={24} />,
    color: "var(--ochre)",
  },
  {
    role: "Institutions",
    description: "Understand student readiness and skill gaps.",
    icon: <Landmark size={24} />,
    color: "var(--pine)",
  },
  {
    role: "Ministry / NCISM",
    description:
      "View aggregated/read-only skill readiness information according to existing permissions.",
    icon: <Shield size={24} />,
    color: "var(--rust)",
  },
];

const whyDifferentCards = [
  {
    title: "Evidence-Based",
    description: "Skills are assessed and verified, not just claimed.",
    icon: <CheckCircle2 size={22} />,
  },
  {
    title: "Career-Driven",
    description: "Everything starts from the career goal you choose.",
    icon: <Target size={22} />,
  },
  {
    title: "Skill-Gap Focused",
    description: "Gaps are identified precisely so you know what to improve.",
    icon: <Search size={22} />,
  },
  {
    title: "Continuous Improvement",
    description: "Reassess anytime to track real progress over time.",
    icon: <RefreshCw size={22} />,
  },
  {
    title: "Verified Progress",
    description: "Your readiness grows with each verified assessment.",
    icon: <BarChart3 size={22} />,
  },
  {
    title: "Connected Ecosystem",
    description:
      "Students, industry, institutions, and regulators — all connected.",
    icon: <Link2 size={22} />,
  },
];

const engineeringSkills = [
  { name: "HTML", status: "done" as const },
  { name: "CSS", status: "done" as const },
  { name: "JavaScript", status: "warning" as const },
  { name: "React", status: "missing" as const },
  { name: "Git", status: "done" as const },
  { name: "REST APIs", status: "missing" as const },
];

const medicalSkills = [
  { name: "Clinical Assessment", status: "done" as const },
  { name: "Medical Terminology", status: "done" as const },
  { name: "Patient Care", status: "warning" as const },
  { name: "Clinical Documentation", status: "missing" as const },
  { name: "Healthcare Ethics", status: "done" as const },
  { name: "Health Informatics", status: "missing" as const },
  { name: "Diagnostic Procedures", status: "missing" as const },
];

const engineeringDomains = [
  "Software Development",
  "Web Development",
  "Data Analytics",
  "AI / ML",
  "Cybersecurity",
  "Cloud",
  "DevOps",
];

const medicalDomains = [
  "Clinical Skills",
  "Medical Terminology",
  "Patient Care",
  "Clinical Documentation",
  "Healthcare Ethics",
  "Diagnostics",
  "Health Informatics",
];

const resumeSteps = [
  { label: "Student", icon: <User size={20} /> },
  { label: "Upload Resume", icon: <Upload size={20} /> },
  { label: "SkillBridge Profile", icon: <FileText size={20} /> },
  { label: "Skills + Assessment + Readiness", icon: <BarChart3 size={20} /> },
  { label: "Opportunity", icon: <Zap size={20} /> },
  { label: "Industry Views Candidate", icon: <Briefcase size={20} /> },
];

/* ====================================================================
   PAGE COMPONENT
   ==================================================================== */

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden">
      {/* ================================================================
          SECTION 1: HERO
          ================================================================ */}
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Background storytelling */}
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, rgba(33,70,61,0.10), transparent 50%), radial-gradient(circle at 80% 70%, rgba(185,134,60,0.06), transparent 50%)",
          }}
        />

        {/* Floating background shapes */}
        <motion.div
          className="absolute -right-20 top-20 h-64 w-64 rounded-full opacity-[0.04]"
          style={{ background: "var(--pine)" }}
          animate={
            prefersReducedMotion
              ? {}
              : { y: [0, -20, 0], rotate: [0, 5, 0] }
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -left-32 bottom-20 h-96 w-96 rounded-full opacity-[0.03]"
          style={{ background: "var(--ochre)" }}
          animate={
            prefersReducedMotion
              ? {}
              : { y: [0, 15, 0], rotate: [0, -3, 0] }
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 md:pt-16 lg:pb-24 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: copy */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-7"
            >
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Evidence-Based Skill Readiness
              </div>

              <div className="space-y-5">
                <h1 className="font-fraunces text-4xl font-bold leading-[1.1] tracking-tight text-primary sm:text-5xl lg:text-6xl xl:text-[3.6rem]">
                  Know What You Know.
                  <br />
                  <span style={{ color: "var(--ochre)" }}>
                    Know What You Need.
                  </span>
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
                  SkillBridge helps students discover the skills required for
                  their target career, assess what they actually know, identify
                  skill gaps, improve them, verify their progress, and connect
                  with relevant opportunities.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="group rounded-full px-8"
                  >
                    Start Your Journey
                    <ArrowRight
                      size={16}
                      className="ml-2 transition-transform group-hover:translate-x-1"
                    />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8"
                  >
                    Explore How It Works
                  </Button>
                </Link>
              </div>

              {/* Audience pills */}
              <div className="flex flex-wrap gap-2.5">
                {audiencePills.map((pill) => (
                  <span
                    key={pill.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary"
                  >
                    {pill.icon}
                    {pill.label}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right: illustration */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative hidden md:block"
            >
              <HeroIllustration />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 2: THE PROBLEM
          ================================================================ */}
      <section className="relative border-y border-border" id="problem">
        <div className="absolute inset-0 section-gradient-top" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <ScrollSection className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-secondary">
              The problem
            </p>
            <h2 className="mt-4 font-fraunces text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
              Bridging the Gap Between
              <br className="hidden sm:block" /> Education and Industry
            </h2>
          </ScrollSection>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {problemCards.map((card, i) => (
              <StaggerChild key={card.role} index={i}>
                <div
                  className="group h-full rounded-[1.5rem] border border-border bg-surface p-6 transition-all duration-300 hover:border-primary/30"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div
                    className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: card.bg, color: card.color }}
                  >
                    {card.icon}
                  </div>
                  <h3
                    className="font-fraunces text-lg font-semibold"
                    style={{ color: card.color }}
                  >
                    {card.role}
                  </h3>
                  <p className="mt-3 text-sm italic leading-relaxed text-text-secondary">
                    {card.question}
                  </p>
                </div>
              </StaggerChild>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 3: HOW SKILLBRIDGE WORKS
          ================================================================ */}
      <div id="how-it-works">
        <WorkflowTimeline />
      </div>

      {/* ================================================================
          SECTION 4: YOUR READINESS JOURNEY
          ================================================================ */}
      <section className="relative border-y border-border" id="readiness">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(33,70,61,0.06), transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <ScrollSection className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-secondary">
              Your readiness journey
            </p>
            <h2 className="mt-4 font-fraunces text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
              See Your Progress. Plan Your Next Step.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-text-secondary">
              SkillBridge gives you a clear dashboard of where you stand for
              your target role — what you know and what to work on next.
            </p>
          </ScrollSection>

          <div className="mx-auto max-w-2xl">
            <ReadinessCard
              title="Engineering"
              targetRole="Frontend Developer"
              skills={engineeringSkills}
              readinessPercent={68}
              accentColor="var(--pine)"
              accentLight="rgba(33,70,61,0.07)"
              icon={<Code size={16} style={{ color: "var(--pine)" }} />}
              variant="engineering"
            />
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 5: ENGINEERING + MEDICAL/HEALTHCARE
          ================================================================ */}
      <section className="relative overflow-hidden" id="domains">
        <div className="absolute inset-0 section-gradient-medical" />
        <div className="absolute inset-0 bg-dots opacity-20" />

        {/* Floating background accents */}
        <motion.div
          className="absolute -right-40 top-40 h-80 w-80 rounded-full opacity-[0.04]"
          style={{ background: "var(--medical)" }}
          animate={
            prefersReducedMotion
              ? {}
              : { y: [0, -15, 0] }
          }
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <ScrollSection className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-secondary">
              Multi-domain platform
            </p>
            <h2 className="mt-4 font-fraunces text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
              Built for Different Fields
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary">
              SkillBridge is not limited to technology. From software engineering
              to clinical healthcare, the platform adapts to evaluate readiness
              in context.
            </p>
          </ScrollSection>

          {/* Domain tags */}
          <div className="mb-12 grid gap-8 lg:grid-cols-2">
            <ScrollSection direction="right">
              <div className="rounded-2xl border border-border bg-surface p-6" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Code size={18} style={{ color: "var(--pine)" }} />
                  <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--pine)" }}>
                    Engineering
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {engineeringDomains.map((d) => (
                    <span
                      key={d}
                      className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollSection>

            <ScrollSection direction="left" delay={0.1}>
              <div className="rounded-2xl border border-border bg-surface p-6" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Stethoscope size={18} style={{ color: "var(--medical)" }} />
                  <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--medical)" }}>
                    Medical / Healthcare
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {medicalDomains.map((d) => (
                    <span
                      key={d}
                      className="rounded-full border px-3 py-1.5 text-xs font-medium"
                      style={{
                        borderColor: "rgba(124,92,191,0.2)",
                        background: "var(--medical-surface)",
                        color: "var(--medical)",
                      }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollSection>
          </div>

          {/* Side-by-side readiness cards */}
          <div className="grid gap-8 lg:grid-cols-2">
            <ReadinessCard
              title="Engineering"
              targetRole="Frontend Developer"
              skills={engineeringSkills}
              readinessPercent={68}
              accentColor="var(--pine)"
              accentLight="rgba(33,70,61,0.07)"
              icon={<Code size={16} style={{ color: "var(--pine)" }} />}
              variant="engineering"
            />
            <ReadinessCard
              title="Medical / Healthcare"
              targetRole="Clinical / Healthcare Role"
              skills={medicalSkills}
              readinessPercent={43}
              accentColor="var(--medical)"
              accentLight="var(--medical-surface)"
              icon={
                <Stethoscope
                  size={16}
                  style={{ color: "var(--medical)" }}
                />
              }
              variant="medical"
            />
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 6: STUDENT RESUME WORKFLOW
          ================================================================ */}
      <section className="relative border-y border-border" id="resume">
        <div className="absolute inset-0 bg-dots opacity-25" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 40% 60%, rgba(185,134,60,0.05), transparent 50%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <ScrollSection className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-secondary">
              Resume integration
            </p>
            <h2 className="mt-4 font-fraunces text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
              Your Resume. More Context.
              <br className="hidden sm:block" /> Better Opportunities.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary">
              Students can upload their resume to their SkillBridge profile.
              Industry can view a relevant candidate&apos;s resume when reviewing
              candidates for its opportunity.
            </p>
          </ScrollSection>

          {/* Resume workflow */}
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {resumeSteps.map((step, i) => (
                <motion.div
                  key={step.label}
                  className="flex items-center gap-3 sm:gap-4"
                  initial={
                    prefersReducedMotion ? {} : { opacity: 0, y: 20 }
                  }
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.15 + i * 0.1,
                    duration: 0.5,
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl text-button-text shadow-md sm:h-16 sm:w-16"
                      style={{
                        background:
                          i < 3
                            ? "linear-gradient(135deg, var(--pine), rgba(33,70,61,0.8))"
                            : i < 5
                            ? "linear-gradient(135deg, var(--ochre), rgba(185,134,60,0.8))"
                            : "linear-gradient(135deg, var(--pine), var(--ochre))",
                      }}
                    >
                      {step.icon}
                    </div>
                    <span className="mt-2 max-w-[90px] text-center text-[10px] font-semibold leading-tight text-text-primary sm:text-xs">
                      {step.label}
                    </span>
                  </div>
                  {i < resumeSteps.length - 1 && (
                    <motion.div
                      className="mb-6"
                      initial={
                        prefersReducedMotion ? {} : { scaleX: 0 }
                      }
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.3 + i * 0.1,
                        duration: 0.3,
                      }}
                    >
                      <ArrowRight
                        size={16}
                        className="text-text-muted"
                      />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Resume card mock */}
            <ScrollSection className="mt-14 flex justify-center" delay={0.3}>
              <div
                className="w-full max-w-md rounded-[1.5rem] border border-border bg-surface p-6"
                style={{ boxShadow: "var(--shadow-elevated)" }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: "rgba(33,70,61,0.08)",
                      color: "var(--pine)",
                    }}
                  >
                    <FileText size={22} />
                  </div>
                  <div>
                    <p className="font-fraunces text-lg font-semibold text-text-primary">
                      Student Resume
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      resume_2025.pdf · 245 KB · Uploaded Jan 2025
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle2
                      size={14}
                      style={{ color: "var(--pine)" }}
                    />
                    <span>Attached to SkillBridge profile</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle2
                      size={14}
                      style={{ color: "var(--pine)" }}
                    />
                    <span>Available for opportunity matching</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Shield
                      size={14}
                      style={{ color: "var(--ochre)" }}
                    />
                    <span>Visible only to authorized industry</span>
                  </div>
                </div>

                <p className="mt-4 rounded-xl bg-primary/5 px-3 py-2 text-xs text-text-muted">
                  Note: Uploading a resume supports your profile with additional
                  context. It does not replace or verify assessed skills.
                </p>
              </div>
            </ScrollSection>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 7: WHO USES SKILLBRIDGE
          ================================================================ */}
      <section className="relative overflow-hidden" id="who-uses">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(33,70,61,0.04), transparent 50%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <ScrollSection className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-secondary">
              Ecosystem roles
            </p>
            <h2 className="mt-4 font-fraunces text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
              Who Uses SkillBridge
            </h2>
          </ScrollSection>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {whoUsesCards.map((card, i) => (
              <StaggerChild key={card.role} index={i}>
                <div
                  className="group h-full rounded-[1.5rem] border border-border bg-surface p-6 transition-all duration-300 hover:border-primary/30"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background:
                        card.color === "var(--pine)"
                          ? "rgba(33,70,61,0.08)"
                          : card.color === "var(--ochre)"
                          ? "rgba(185,134,60,0.08)"
                          : "rgba(168,83,56,0.08)",
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </div>
                  <h3
                    className="font-fraunces text-xl font-semibold"
                    style={{ color: card.color }}
                  >
                    {card.role}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {card.description}
                  </p>
                </div>
              </StaggerChild>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 8: WHY SKILLBRIDGE IS DIFFERENT
          ================================================================ */}
      <section
        className="relative border-y border-border"
        id="why-different"
      >
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(33,70,61,0.06), transparent 50%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <ScrollSection className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-secondary">
              What makes us unique
            </p>
            <h2 className="mt-4 font-fraunces text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
              Not Just Another Job Platform
            </h2>
          </ScrollSection>

          {/* Feature cards */}
          <div className="mb-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyDifferentCards.map((card, i) => (
              <StaggerChild key={card.title} index={i}>
                <div
                  className="group h-full rounded-[1.5rem] border border-border bg-surface p-6 transition-all duration-300 hover:border-primary/25 hover:shadow-lg"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 text-primary transition-transform duration-300 group-hover:scale-110">
                    {card.icon}
                  </div>
                  <h3 className="font-fraunces text-lg font-semibold text-primary">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {card.description}
                  </p>
                </div>
              </StaggerChild>
            ))}
          </div>

          {/* Comparison visual */}
          <ScrollSection>
            <ComparisonVisual />
          </ScrollSection>
        </div>
      </section>

      {/* ================================================================
          SECTION 9: FINAL CTA
          ================================================================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(33,70,61,0.08), transparent 50%)",
          }}
        />

        {/* Floating shapes */}
        <motion.div
          className="absolute left-[10%] top-[20%] h-48 w-48 rounded-full opacity-[0.04]"
          style={{ background: "var(--ochre)" }}
          animate={
            prefersReducedMotion
              ? {}
              : { y: [0, -12, 0], x: [0, 5, 0] }
          }
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-[15%] right-[15%] h-36 w-36 rounded-full opacity-[0.04]"
          style={{ background: "var(--pine)" }}
          animate={
            prefersReducedMotion
              ? {}
              : { y: [0, 10, 0] }
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:py-32">
          <ScrollSection>
            <div
              className="rounded-[2.5rem] border border-primary/15 p-8 sm:p-12 lg:p-16"
              style={{
                background:
                  "linear-gradient(135deg, rgba(33,70,61,0.04), rgba(185,134,60,0.03))",
                boxShadow: "var(--shadow-hero)",
              }}
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Target size={28} className="text-primary" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-secondary">
                Start today
              </p>
              <h2 className="mt-4 font-fraunces text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                Your Career Goal Is the Starting Point.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg">
                Choose where you want to go. Discover what you need. Build the
                skills to get there.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="group rounded-full px-10"
                  >
                    Start Your Journey
                    <ArrowRight
                      size={16}
                      className="ml-2 transition-transform group-hover:translate-x-1"
                    />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-10"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* ================================================================
          SECTION 10: FOOTER
          ================================================================ */}
      <Footer />
    </div>
  );
}
