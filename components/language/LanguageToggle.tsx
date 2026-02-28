'use client'

import { useLanguage } from './LanguageProvider'

export function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      aria-label="Toggle language"
      className="theme-toggle"
    >
      {lang === 'fr' ? 'EN' : 'FR'}
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
  )
}