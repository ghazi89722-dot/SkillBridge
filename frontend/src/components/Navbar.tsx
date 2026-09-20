"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from './ui/Button';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X } from 'lucide-react';

const landingLinks = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Domains', href: '#domains' },
  { label: 'For Institutions', href: '#who-uses' },
  { label: 'For Industry', href: '#who-uses' },
];

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-fraunces text-2xl font-bold text-primary">
              SkillBridge
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex gap-6">
            {user?.role === 'industry' ? (
              <Link href="/industry/dashboard" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                Industry Dashboard
              </Link>
            ) : user?.role === 'institution' ? (
              <Link href="/institution/dashboard" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                Institution Dashboard
              </Link>
            ) : user?.role === 'ministry' ? (
              <Link href="/ministry/dashboard" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                Ecosystem Insights
              </Link>
            ) : user ? (
              <>
                <Link href="/student/dashboard" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                  My Passport
                </Link>
                <Link href="/opportunities" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                  Opportunities
                </Link>
              </>
            ) : (
              // Landing page links for non-authenticated users
              <>
                {landingLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {!loading && user ? (
            <>
              <span className="hidden text-sm font-medium text-text-secondary sm:inline">
                {user.name}
              </span>
              <Button variant="ghost" onClick={logout}>Log out</Button>
            </>
          ) : !loading ? (
            <>
              <Link href="/login" className="hidden sm:inline-flex">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-full px-5">Get Started</Button>
              </Link>
            </>
          ) : null}

          {/* Mobile menu toggle */}
          <button
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-lg text-text-primary hover:bg-border/30 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-surface px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {user?.role === 'industry' ? (
              <Link
                href="/industry/dashboard"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-border/20 hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                Industry Dashboard
              </Link>
            ) : user?.role === 'institution' ? (
              <Link
                href="/institution/dashboard"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-border/20 hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                Institution Dashboard
              </Link>
            ) : user?.role === 'ministry' ? (
              <Link
                href="/ministry/dashboard"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-border/20 hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                Ecosystem Insights
              </Link>
            ) : user ? (
              <>
                <Link
                  href="/student/dashboard"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-border/20 hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  My Passport
                </Link>
                <Link
                  href="/opportunities"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-border/20 hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  Opportunities
                </Link>
              </>
            ) : (
              <>
                {landingLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-border/20 hover:text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-2 border-t border-border pt-3 flex flex-col gap-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full rounded-full">Get Started</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
