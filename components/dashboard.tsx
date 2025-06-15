"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { MoodTracker } from "@/components/mood-tracker"
import { AIChat } from "@/components/ai-chat"
import { JournalEntry } from "@/components/journal-entry"
import { TherapistMarketplace } from "@/components/therapist-marketplace"
import { CommunityForum } from "@/components/community-forum"
import { SettingsPanel } from "@/components/settings-panel"
import { APITestPanel } from "@/components/api-test-panel"
import { LiveMoodDetection } from "@/components/live-mood-detection"
import { CameraVerification } from "@/components/camera-verification"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { MessageCircle, TrendingUp, BookOpen, Heart, TestTube, Camera, Shield, Crown, Menu, Brain } from "lucide-react"
import { useSubscription } from "@/components/subscription-provider"
import { Button } from "@/components/ui/button"

type ActiveView =
  | "dashboard"
  | "chat"
  | "mood"
  | "journal"
  | "therapists"
  | "community"
  | "settings"
  | "api-test"
  | "live-mood"
  | "camera-test"

export function Dashboard() {
  const { t, isRTL } = useLanguage()
  const { user } = useAuth()
  const [activeView, setActiveView] = useState<ActiveView>("dashboard")
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { tier, isTrialActive, daysRemaining } = useSubscription()

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Close mobile sidebar when view changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [activeView, isMobile])

  const renderActiveView = () => {
    switch (activeView) {
      case "chat":
        return <AIChat />
      case "mood":
        return <MoodTracker />
      case "journal":
        return <JournalEntry />
      case "therapists":
        return <TherapistMarketplace />
      case "community":
        return <CommunityForum />
      case "settings":
        return <SettingsPanel />
      case "api-test":
        return <APITestPanel />
      case "live-mood":
        return <LiveMoodDetection />
      case "camera-test":
        return <CameraVerification />
      default:
        return <DashboardHome />
    }
  }

  const DashboardHome = () => (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-white"
      >
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
          {t("dashboard.welcome")}, {user?.name}! 👋
        </h1>
        <p className="text-sm sm:text-base lg:text-lg opacity-90">
          How are you feeling today? Let's check in with your mental wellness.
        </p>
      </motion.div>

      {/* Trial Status Banner */}
      {isTrialActive && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-3">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Premium Trial Active</h3>
                <p className="text-xs sm:text-sm opacity-90">{daysRemaining} days remaining</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="self-start sm:self-auto">
              Upgrade Now
            </Button>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card
            className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 tap-target"
            onClick={() => setActiveView("mood")}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base sm:text-lg truncate">{t("dashboard.mood.title")}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Track your emotions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card
            className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 tap-target"
            onClick={() => setActiveView("chat")}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base sm:text-lg truncate">{t("dashboard.chat.title")}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{t("dashboard.chat.subtitle")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card
            className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 tap-target"
            onClick={() => setActiveView("journal")}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base sm:text-lg">Journal</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Write your thoughts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Live Mood Detection Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card
            className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 relative tap-target"
            onClick={() => setActiveView("live-mood")}
          >
            {tier === "free" && (
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                  <Crown className="w-3 h-3" />
                  <span className="hidden sm:inline">Premium</span>
                </div>
              </div>
            )}
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base sm:text-lg truncate">Live Mood Detection</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {tier === "free" ? "Premium camera-based analysis" : "Camera-based emotion analysis"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Camera Verification Card - Only show in development */}
        {process.env.NODE_ENV === "development" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card
              className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 tap-target"
              onClick={() => setActiveView("camera-test")}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base sm:text-lg truncate">Camera Verification</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Test camera compatibility</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* API Test Card - Only show in development */}
        {process.env.NODE_ENV === "development" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card
              className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 tap-target"
              onClick={() => setActiveView("api-test")}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <TestTube className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base sm:text-lg truncate">API Tests</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Test Gemini API</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Insights Preview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{t("dashboard.insights.title")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span>Weekly Mood Average</span>
                <span>7.2/10</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span>Journal Entries</span>
                <span>5 this week</span>
              </div>
              <Progress value={83} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span>Meditation Minutes</span>
                <span>45 min</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span>Camera Mood Sessions</span>
                <span>3 this week</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">{t("dashboard.recent.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">Camera verification completed</p>
                <p className="text-xs text-muted-foreground">30 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">Live mood detection: Happy</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">Mood tracked: Happy</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">Chat session completed</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-green-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${isRTL ? "font-urdu" : ""}`}
    >
      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && <Sidebar activeView={activeView} onViewChange={setActiveView} />}

        {/* Mobile Sidebar */}
        {isMobile && (
          <MobileSidebar
            activeView={activeView}
            onViewChange={setActiveView}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 ${isMobile ? "w-full" : "ml-64"} safe-area-inset`}>
          {/* Mobile Header */}
          {isMobile && (
            <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 safe-area-top">
              <div className="flex items-center justify-between p-4">
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="tap-target">
                  <Menu className="w-5 h-5" />
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-sm">SukoonBot</span>
                </div>
                <div className="w-10" /> {/* Spacer for centering */}
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="p-3 sm:p-4 lg:p-6 safe-area-bottom">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderActiveView()}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
