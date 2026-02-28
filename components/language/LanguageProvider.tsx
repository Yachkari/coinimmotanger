'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Lang = 'fr' | 'en'

interface LanguageContextType {
  lang: Lang
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr')

  const toggleLanguage = () => setLang(prev => (prev === 'fr' ? 'en' : 'fr'))

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider')
  return context
}