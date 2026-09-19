"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/Button";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("skillbridge-theme");
    if (storedTheme === "dark") {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("skillbridge-theme", nextTheme);
    setTheme(nextTheme);
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" aria-label="Switch to dark mode" title="Switch to dark mode">
        <Moon size={18} />
        <span className="hidden sm:inline">Dark mode</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      <span className="hidden sm:inline">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
    </Button>
  );
}
