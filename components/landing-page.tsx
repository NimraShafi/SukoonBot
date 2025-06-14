"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AuthModal } from "@/components/auth-modal"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { useLanguage } from "@/components/language-provider"
import { useState } from "react"
import { Heart, MessageCircle, TrendingUp, Users, Shield, Globe, Brain, Sparkles } from "lucide-react"

export function LandingPage() {
  const { t, isRTL } = useLanguage()
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null)

  const features = [
    {
      icon: MessageCircle,
      title: "AI Therapy Chat",
      description: "Talk to our AI companion trained in CBT and trauma-informed care",
    },
    {
      icon: TrendingUp,
      title: "Mood Tracking",
      description: "Track your emotional journey with voice and text analysis",
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with others in a safe, anonymous environment",
    },
    {
      icon: Heart,
      title: "Wellness Tools",
      description: "Meditation, journaling, and habit tracking features",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "End-to-end encryption and GDPR compliant",
    },
    {
      icon: Globe,
      title: "Multilingual",
      description: "Full support for Urdu and English languages",
    },
  ]

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${isRTL ? "font-urdu" : ""}`}
    >
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            SukoonBot
          </span>
        </motion.div>

        <div className="flex items-center space-x-4">
          <LanguageToggle />
          <ThemeToggle />
          <Button variant="ghost" onClick={() => setAuthModal("login")} className="hidden sm:inline-flex">
            {t("landing.cta.login")}
          </Button>
          <Button onClick={() => setAuthModal("signup")}>{t("landing.cta.signup")}</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            {t("landing.title")}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">{t("landing.subtitle")}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              onClick={() => setAuthModal("signup")}
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 py-3 text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {t("landing.cta.signup")}
            </Button>
            <Button size="lg" variant="outline" onClick={() => setAuthModal("login")} className="px-8 py-3 text-lg">
              {t("landing.cta.login")}
            </Button>
          </div>

          {/* Animated Mood Emojis */}
          <motion.div
            className="flex justify-center space-x-4 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {["😊", "😌", "🤗", "💚", "🌟"].map((emoji, index) => (
              <motion.div
                key={emoji}
                className="text-4xl"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  delay: index * 0.2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Comprehensive Mental Health Support</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for your mental wellness journey, designed with cultural sensitivity
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl p-12 text-white"
        >
          <h2 className="text-4xl font-bold mb-4">Start Your Wellness Journey Today</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands who have found peace and support with SukoonBot</p>
          <Button
            size="lg"
            onClick={() => setAuthModal("signup")}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
          >
            Get Started Free
          </Button>
        </motion.div>
      </section>

      {/* Auth Modal */}
      {authModal && <AuthModal mode={authModal} onClose={() => setAuthModal(null)} />}
    </div>
  )
}
