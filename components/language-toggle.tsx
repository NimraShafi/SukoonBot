"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { Globe } from "lucide-react"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "ur" : "en")}
      className="flex items-center space-x-2"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">{language === "en" ? "اردو" : "English"}</span>
    </Button>
  )
}
