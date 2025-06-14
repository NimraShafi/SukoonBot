"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Language = "en" | "ur"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const translations = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.chat": "AI Chat",
    "nav.mood": "Mood Tracker",
    "nav.journal": "Journal",
    "nav.therapists": "Find Therapists",
    "nav.community": "Community",
    "nav.settings": "Settings",

    // Landing Page
    "landing.title": "Your Mental Health Companion",
    "landing.subtitle": "AI-powered support tailored for South Asian communities",
    "landing.cta.signup": "Get Started Free",
    "landing.cta.login": "Sign In",

    // Dashboard
    "dashboard.welcome": "Welcome back",
    "dashboard.mood.title": "How are you feeling today?",
    "dashboard.mood.track": "Track Mood",
    "dashboard.chat.title": "Talk to SukoonBot",
    "dashboard.chat.subtitle": "Your AI companion is here to listen",
    "dashboard.insights.title": "Your Insights",
    "dashboard.recent.title": "Recent Activity",

    // Mood Tracker
    "mood.happy": "Happy",
    "mood.sad": "Sad",
    "mood.angry": "Angry",
    "mood.anxious": "Anxious",
    "mood.calm": "Calm",
    "mood.neutral": "Neutral",

    // Chat
    "chat.placeholder": "Type your message...",
    "chat.send": "Send",
    "chat.voice": "Voice Message",
    "chat.typing": "SukoonBot is typing...",

    // Common
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.continue": "Continue",
    "common.back": "Back",
  },
  ur: {
    // Navigation
    "nav.dashboard": "ڈیش بورڈ",
    "nav.chat": "اے آئی چیٹ",
    "nav.mood": "موڈ ٹریکر",
    "nav.journal": "ڈائری",
    "nav.therapists": "ماہر نفسیات تلاش کریں",
    "nav.community": "کمیونٹی",
    "nav.settings": "سیٹنگز",

    // Landing Page
    "landing.title": "آپ کا ذہنی صحت کا ساتھی",
    "landing.subtitle": "جنوبی ایشیائی کمیونٹیز کے لیے اے آئی سپورٹ",
    "landing.cta.signup": "مفت شروع کریں",
    "landing.cta.login": "سائن ان",

    // Dashboard
    "dashboard.welcome": "واپس آپ کا خیر مقدم",
    "dashboard.mood.title": "آج آپ کیسا محسوس کر رہے ہیں؟",
    "dashboard.mood.track": "موڈ ٹریک کریں",
    "dashboard.chat.title": "سکون بوٹ سے بات کریں",
    "dashboard.chat.subtitle": "آپ کا اے آئی ساتھی سننے کے لیے یہاں ہے",
    "dashboard.insights.title": "آپ کی بصیرت",
    "dashboard.recent.title": "حالیہ سرگرمی",

    // Mood Tracker
    "mood.happy": "خوش",
    "mood.sad": "اداس",
    "mood.angry": "غصے میں",
    "mood.anxious": "پریشان",
    "mood.calm": "پرسکون",
    "mood.neutral": "عام",

    // Chat
    "chat.placeholder": "اپنا پیغام ٹائپ کریں...",
    "chat.send": "بھیجیں",
    "chat.voice": "آواز کا پیغام",
    "chat.typing": "سکون بوٹ ٹائپ کر رہا ہے...",

    // Common
    "common.loading": "لوڈ ہو رہا ہے...",
    "common.save": "محفوظ کریں",
    "common.cancel": "منسوخ",
    "common.continue": "جاری رکھیں",
    "common.back": "واپس",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("sukoonbot_language") as Language
    if (savedLang && (savedLang === "en" || savedLang === "ur")) {
      setLanguage(savedLang)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("sukoonbot_language", language)
    document.documentElement.setAttribute("dir", language === "ur" ? "rtl" : "ltr")
    document.documentElement.setAttribute("lang", language)
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRTL: language === "ur",
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
