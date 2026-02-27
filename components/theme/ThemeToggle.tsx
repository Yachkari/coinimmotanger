"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      <style>{`
        .theme-toggle {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          background: transparent;
          border: 1px solid var(--border-hover);
          border-radius: 2px;
          color: var(--muted-2);
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .theme-toggle:hover {
          border-color: var(--gold);
          color: var(--gold);
        }
      `}</style>
    </button>
  );
}