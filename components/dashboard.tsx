"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "@/components/sidebar"
import { MoodTracker } from "@/components/mood-tracker"
import { AIChat } from "@/components/ai-chat"
import { JournalEntry } from "@/components/journal-entry"
import { TherapistMarketplace } from "@/components/therapist-marketplace"
import { CommunityForum } from "@/components/community-forum"
import { SettingsPanel } from "@/components/settings-panel"
import { APITestPanel } from "@/components/api-test-panel"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { MessageCircle, TrendingUp, BookOpen, Heart, TestTube } from "lucide-react"

type ActiveView = "dashboard" | "chat" | "mood" | "journal" | "therapists" | "community" | "settings" | "api-test"

export function Dashboard() {
  const { t, isRTL } = useLanguage()
  const { user } = useAuth()
  const [activeView, setActiveView] = useState<ActiveView>("dashboard")

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
      default:
        return <DashboardHome />
    }
  }

  const DashboardHome = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">
          {t("dashboard.welcome")}, {user?.name}! 👋
        </h1>
        <p className="text-lg opacity-90">How are you feeling today? Let's check in with your mental wellness.</p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card
            className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
            onClick={() => setActiveView("mood")}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t("dashboard.mood.title")}</h3>
                  <p className="text-sm text-muted-foreground">Track your emotions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card
            className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
            onClick={() => setActiveView("chat")}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t("dashboard.chat.title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("dashboard.chat.subtitle")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card
            className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
            onClick={() => setActiveView("journal")}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Journal</h3>
                  <p className="text-sm text-muted-foreground">Write your thoughts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* API Test Card - Only show in development */}
        {process.env.NODE_ENV === "development" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card
              className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20"
              onClick={() => setActiveView("api-test")}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <TestTube className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">API Tests</h3>
                    <p className="text-sm text-muted-foreground">Test Gemini API</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Insights Preview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>{t("dashboard.insights.title")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Weekly Mood Average</span>
                  <span>7.2/10</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Journal Entries</span>
                  <span>5 this week</span>
                </div>
                <Progress value={83} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Meditation Minutes</span>
                  <span>45 min</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.recent.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Mood tracked: Happy</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Chat session completed</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Journal entry added</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
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
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 p-6 ml-64">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveView()}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
