"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
  id?: string;
}

export function ScrollSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
  id,
}: ScrollSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    up: {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    },
    left: {
      hidden: { opacity: 0, x: 60 },
      visible: { opacity: 1, x: 0 },
    },
    right: {
      hidden: { opacity: 0, x: -60 },
      visible: { opacity: 1, x: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.92 },
      visible: { opacity: 1, scale: 1 },
    },
  };

  if (prefersReducedMotion) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      id={id}
      className={className}
      variants={variants[direction]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerChildProps {
  children: ReactNode;
  className?: string;
  index: number;
  baseDelay?: number;
}

export function StaggerChild({
  children,
  className = "",
  index,
  baseDelay = 0,
}: StaggerChildProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: baseDelay + index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
