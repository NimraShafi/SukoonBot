"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { useSubscription } from "@/components/subscription-provider"
import {
  LayoutDashboard,
  MessageCircle,
  Heart,
  BookOpen,
  Users,
  Calendar,
  Settings,
  LogOut,
  Brain,
  TestTube,
  Camera,
  Shield,
  Crown,
  X,
} from "lucide-react"

interface MobileSidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebar({ activeView, onViewChange, isOpen, onClose }: MobileSidebarProps) {
  const { t, isRTL } = useLanguage()
  const { user, logout } = useAuth()
  const { tier, isTrialActive, daysRemaining } = useSubscription()

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: t("nav.dashboard") },
    { id: "chat", icon: MessageCircle, label: t("nav.chat") },
    { id: "mood", icon: Heart, label: t("nav.mood") },
    { id: "live-mood", icon: Camera, label: "Live Mood Detection", isPremium: tier === "free" },
    { id: "journal", icon: BookOpen, label: t("nav.journal") },
    { id: "therapists", icon: Calendar, label: t("nav.therapists") },
    { id: "community", icon: Users, label: t("nav.community") },
    { id: "settings", icon: Settings, label: t("nav.settings") },
  ]

  // Add development menu items only in development
  if (process.env.NODE_ENV === "development") {
    menuItems.push(
      { id: "camera-test", icon: Shield, label: "Camera Verification" },
      { id: "api-test", icon: TestTube, label: "API Tests" },
    )
  }

  const handleItemClick = (viewId: string) => {
    onViewChange(viewId)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 safe-area-inset ${
              isRTL ? "right-0 border-l border-r-0" : "left-0"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header - Same Brain logo as desktop */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 safe-area-top">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                      SukoonBot
                    </h2>
                    <p className="text-xs text-muted-foreground">Mental Health Companion</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="tap-target">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto scroll-smooth-mobile">
                {menuItems.map((item) => (
                  <div key={item.id} className="relative">
                    <Button
                      variant={activeView === item.id ? "default" : "ghost"}
                      className={`w-full justify-start space-x-3 tap-target ${
                        activeView === item.id
                          ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => handleItemClick(item.id)}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.isPremium && <Crown className="w-3 h-3 text-yellow-500 ml-auto flex-shrink-0" />}
                    </Button>
                  </div>
                ))}
              </nav>

              {/* User Profile */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3 gap-2">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>

                {/* Subscription Status */}
                {tier !== "free" && (
                  <div className="mb-3 p-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center space-x-2">
                      <Crown className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-purple-800 dark:text-purple-200 capitalize truncate">
                          {tier} Plan
                        </p>
                        {isTrialActive && (
                          <p className="text-xs text-purple-600 dark:text-purple-400">
                            Trial: {daysRemaining} days left
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <Button variant="outline" size="sm" className="w-full tap-target" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
