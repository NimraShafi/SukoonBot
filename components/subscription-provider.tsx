"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type SubscriptionTier = "free" | "premium" | "pro"

interface SubscriptionFeatures {
  liveMoodDetection: boolean
  voiceAnalysis: boolean
  advancedInsights: boolean
  unlimitedChatSessions: boolean
  prioritySupport: boolean
  exportData: boolean
  customThemes: boolean
  familySharing: boolean
}

interface SubscriptionContextType {
  tier: SubscriptionTier
  features: SubscriptionFeatures
  isFeatureAvailable: (feature: keyof SubscriptionFeatures) => boolean
  upgradeToTier: (tier: SubscriptionTier) => void
  daysRemaining?: number
  isTrialActive: boolean
}

const SUBSCRIPTION_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    liveMoodDetection: false,
    voiceAnalysis: false,
    advancedInsights: false,
    unlimitedChatSessions: false,
    prioritySupport: false,
    exportData: false,
    customThemes: false,
    familySharing: false,
  },
  premium: {
    liveMoodDetection: true,
    voiceAnalysis: true,
    advancedInsights: true,
    unlimitedChatSessions: true,
    prioritySupport: false,
    exportData: true,
    customThemes: true,
    familySharing: false,
  },
  pro: {
    liveMoodDetection: true,
    voiceAnalysis: true,
    advancedInsights: true,
    unlimitedChatSessions: true,
    prioritySupport: true,
    exportData: true,
    customThemes: true,
    familySharing: true,
  },
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<SubscriptionTier>("free")
  const [isTrialActive, setIsTrialActive] = useState(false)
  const [daysRemaining, setDaysRemaining] = useState<number>()

  useEffect(() => {
    // Load subscription data from localStorage
    const savedTier = localStorage.getItem("sukoonbot_subscription_tier") as SubscriptionTier
    const trialStart = localStorage.getItem("sukoonbot_trial_start")

    if (savedTier && (savedTier === "free" || savedTier === "premium" || savedTier === "pro")) {
      setTier(savedTier)
    }

    // Check trial status (7-day trial for premium features)
    if (trialStart) {
      const trialStartDate = new Date(trialStart)
      const now = new Date()
      const daysSinceStart = Math.floor((now.getTime() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24))
      const remaining = 7 - daysSinceStart

      if (remaining > 0) {
        setIsTrialActive(true)
        setDaysRemaining(remaining)
      } else {
        setIsTrialActive(false)
        localStorage.removeItem("sukoonbot_trial_start")
      }
    }
  }, [])

  const features = SUBSCRIPTION_FEATURES[tier]

  const isFeatureAvailable = (feature: keyof SubscriptionFeatures): boolean => {
    // During trial, premium features are available
    if (isTrialActive && SUBSCRIPTION_FEATURES.premium[feature]) {
      return true
    }
    return features[feature]
  }

  const upgradeToTier = (newTier: SubscriptionTier) => {
    setTier(newTier)
    localStorage.setItem("sukoonbot_subscription_tier", newTier)

    // Start trial if upgrading to premium for the first time
    if (newTier === "premium" && !localStorage.getItem("sukoonbot_trial_start")) {
      const now = new Date().toISOString()
      localStorage.setItem("sukoonbot_trial_start", now)
      setIsTrialActive(true)
      setDaysRemaining(7)
    }
  }

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        features,
        isFeatureAvailable,
        upgradeToTier,
        daysRemaining,
        isTrialActive,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
}
