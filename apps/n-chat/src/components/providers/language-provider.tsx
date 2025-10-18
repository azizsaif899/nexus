'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getInitialLanguage, isClient } from '@/lib/utils'

type Language = 'ar' | 'en'

type LanguageProviderProps = {
  children: React.ReactNode
  defaultLanguage?: Language
  storageKey?: string
}

type LanguageProviderState = {
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
  isRTL: boolean
}

const initialState: LanguageProviderState = {
  language: 'ar',
  setLanguage: () => null,
  toggleLanguage: () => null,
  isRTL: true,
}

const LanguageProviderContext = createContext<LanguageProviderState>(initialState)

export function LanguageProvider({
  children,
  defaultLanguage = 'ar',
  storageKey = 'language',
  ...props
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    if (!isClient()) return defaultLanguage
    return getInitialLanguage()
  })

  useEffect(() => {
    if (!isClient()) return

    const root = window.document.documentElement
    const body = window.document.body

    // Apply RTL/LTR classes
    root.classList.toggle('rtl', language === 'ar')
    root.classList.toggle('ltr', language === 'en')
    root.dir = language === 'ar' ? 'rtl' : 'ltr'
    
    // Apply font classes
    body.classList.toggle('font-arabic', language === 'ar')
    
    // Store in localStorage
    localStorage.setItem(storageKey, language)
  }, [language, storageKey])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar')
  }

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    isRTL: language === 'ar',
  }

  return (
    <LanguageProviderContext.Provider {...props} value={value}>
      {children}
    </LanguageProviderContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext)

  if (context === undefined)
    throw new Error('useLanguage must be used within a LanguageProvider')

  return context
}