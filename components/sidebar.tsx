"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
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
} from "lucide-react"

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { t, isRTL } = useLanguage()
  const { user, logout } = useAuth()

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: t("nav.dashboard") },
    { id: "chat", icon: MessageCircle, label: t("nav.chat") },
    { id: "mood", icon: Heart, label: t("nav.mood") },
    { id: "journal", icon: BookOpen, label: t("nav.journal") },
    { id: "therapists", icon: Calendar, label: t("nav.therapists") },
    { id: "community", icon: Users, label: t("nav.community") },
    { id: "settings", icon: Settings, label: t("nav.settings") },
  ]

  // Add API test menu item only in development
  if (process.env.NODE_ENV === "development") {
    menuItems.push({ id: "api-test", icon: TestTube, label: "API Tests" })
  }

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 ${isRTL ? "right-0 left-auto border-l border-r-0" : ""}`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
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
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeView === item.id ? "default" : "ghost"}
              className={`w-full justify-start space-x-3 ${
                activeView === item.id ? "bg-gradient-to-r from-blue-500 to-green-500 text-white" : "hover:bg-muted"
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar>
              <AvatarImage src={user?.avatar || "/placeholder.svg"} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          <Button variant="outline" size="sm" className="w-full" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
