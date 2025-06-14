"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useSubscription } from "@/components/subscription-provider"
import { useToast } from "@/hooks/use-toast"
import {
  Crown,
  Camera,
  Mic,
  TrendingUp,
  MessageCircle,
  Shield,
  Download,
  Palette,
  Users,
  Check,
  Sparkles,
  Zap,
  Star,
  X,
} from "lucide-react"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  feature?: string
  featureDescription?: string
}

const PRICING_PLANS = [
  {
    id: "premium",
    name: "Premium",
    price: "$9.99",
    period: "month",
    description: "Perfect for individuals serious about mental wellness",
    popular: true,
    features: [
      { icon: Camera, text: "Live Mood Detection", highlight: true },
      { icon: Mic, text: "Voice Emotion Analysis", highlight: true },
      { icon: TrendingUp, text: "Advanced Insights & Analytics" },
      { icon: MessageCircle, text: "Unlimited AI Chat Sessions" },
      { icon: Download, text: "Export Your Data" },
      { icon: Palette, text: "Custom Themes" },
    ],
    color: "from-blue-500 to-purple-500",
    buttonText: "Start 7-Day Free Trial",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19.99",
    period: "month",
    description: "For families and those who need priority support",
    popular: false,
    features: [
      { icon: Crown, text: "Everything in Premium", highlight: true },
      { icon: Shield, text: "Priority Support", highlight: true },
      { icon: Users, text: "Family Sharing (up to 5 members)" },
      { icon: Zap, text: "Advanced AI Models" },
      { icon: Star, text: "Early Access to New Features" },
    ],
    color: "from-purple-500 to-pink-500",
    buttonText: "Upgrade to Pro",
  },
]

export function UpgradeModal({ isOpen, onClose, feature, featureDescription }: UpgradeModalProps) {
  const { upgradeToTier, tier, isTrialActive, daysRemaining } = useSubscription()
  const { toast } = useToast()
  const [selectedPlan, setSelectedPlan] = useState<"premium" | "pro">("premium")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleUpgrade = async (planId: "premium" | "pro") => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    upgradeToTier(planId)

    toast({
      title: planId === "premium" ? "Welcome to Premium!" : "Welcome to Pro!",
      description:
        planId === "premium"
          ? "Your 7-day free trial has started. Enjoy all premium features!"
          : "You now have access to all Pro features including priority support!",
    })

    setIsProcessing(false)
    onClose()
  }

  const startFreeTrial = () => {
    handleUpgrade("premium")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
              <Crown className="w-6 h-6 text-yellow-500" />
              <span>Unlock Premium Features</span>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Feature Highlight */}
        {feature && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">{feature}</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">Premium Feature</p>
              </div>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {featureDescription ||
                "This advanced feature requires a Premium subscription to unlock its full potential."}
            </p>
          </motion.div>
        )}

        {/* Trial Status */}
        {isTrialActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800 dark:text-green-200">
                Free Trial Active - {daysRemaining} days remaining
              </span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              You're currently enjoying all Premium features. Upgrade before your trial ends to continue!
            </p>
          </motion.div>
        )}

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {PRICING_PLANS.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`relative cursor-pointer transition-all duration-300 ${
                  selectedPlan === plan.id ? "ring-2 ring-blue-500 shadow-lg scale-105" : "hover:shadow-md"
                } ${plan.popular ? "border-blue-500" : ""}`}
                onClick={() => setSelectedPlan(plan.id as "premium" | "pro")}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}
                    >
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center space-x-1 mb-2">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            feature.highlight ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          {feature.highlight ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <feature.icon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                          )}
                        </div>
                        <span className={`text-sm ${feature.highlight ? "font-medium" : ""}`}>{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white`}
                    onClick={() => handleUpgrade(plan.id as "premium" | "pro")}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      plan.buttonText
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Free Trial CTA */}
        {!isTrialActive && tier === "free" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-lg"
          >
            <Sparkles className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Start Your Free Trial Today!</h3>
            <p className="mb-4 opacity-90">Get 7 days of Premium features absolutely free. No credit card required.</p>
            <Button
              onClick={startFreeTrial}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8"
              disabled={isProcessing}
            >
              {isProcessing ? "Starting Trial..." : "Start Free Trial"}
            </Button>
          </motion.div>
        )}

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4">
            <Shield className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <h4 className="font-medium mb-1">Secure & Private</h4>
            <p className="text-xs text-muted-foreground">Your data is encrypted and never shared</p>
          </div>
          <div className="text-center p-4">
            <Zap className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <h4 className="font-medium mb-1">Instant Access</h4>
            <p className="text-xs text-muted-foreground">Unlock features immediately after upgrade</p>
          </div>
          <div className="text-center p-4">
            <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <h4 className="font-medium mb-1">Cancel Anytime</h4>
            <p className="text-xs text-muted-foreground">No long-term commitments required</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
