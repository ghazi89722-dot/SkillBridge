"use client";

import Link from "next/link";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "How It Works", href: "#how-it-works" },
      { label: "For Students", href: "/register" },
      { label: "For Industry", href: "/register" },
      { label: "For Institutions", href: "/register" },
    ],
  },
  {
    title: "Domains",
    links: [
      { label: "Engineering", href: "#domains" },
      { label: "Medical / Healthcare", href: "#domains" },
      { label: "All Domains", href: "#domains" },
    ],
  },
  {
    title: "Get Started",
    links: [
      { label: "Create Account", href: "/register" },
      { label: "Sign In", href: "/login" },
      { label: "Student Dashboard", href: "/student/dashboard" },
      { label: "Opportunities", href: "/opportunities" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Branding */}
          <div>
            <Link href="/" className="inline-block">
              <span className="font-fraunces text-2xl font-bold text-primary">
                SkillBridge
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-secondary">
              Evidence-based skill readiness platform connecting students,
              industry, institutions, and regulatory bodies.
            </p>
          </div>

          {/* Link groups */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                {group.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-border pt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} SkillBridge. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Evidence-Based Skill Readiness
          </p>
        </div>
      </div>
    </footer>
  );
}
