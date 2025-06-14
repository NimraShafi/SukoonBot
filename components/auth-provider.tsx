"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { SubscriptionProvider } from "@/components/subscription-provider"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  preferredLanguage: "en" | "ur"
  moodTrackingEnabled: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = async () => {
      const savedUser = localStorage.getItem("sukoonbot_user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate login API call
    const mockUser: User = {
      id: "1",
      email,
      name: email.split("@")[0],
      preferredLanguage: "en",
      moodTrackingEnabled: true,
    }

    setUser(mockUser)
    localStorage.setItem("sukoonbot_user", JSON.stringify(mockUser))
  }

  const signup = async (email: string, password: string, name: string) => {
    // Simulate signup API call
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
      preferredLanguage: "en",
      moodTrackingEnabled: true,
    }

    setUser(mockUser)
    localStorage.setItem("sukoonbot_user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("sukoonbot_user")
  }

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("sukoonbot_user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      <SubscriptionProvider>{children}</SubscriptionProvider>
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
