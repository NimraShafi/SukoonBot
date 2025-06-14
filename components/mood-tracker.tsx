"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/components/language-provider"
import { Smile, Frown, Angry, Zap, Heart, Meh, Mic, MicOff, Save, TrendingUp } from "lucide-react"

interface MoodEntry {
  id: string
  mood: string
  intensity: number
  note: string
  timestamp: Date
  isVoice?: boolean
}

const moodOptions = [
  { id: "happy", icon: Smile, label: "mood.happy", color: "mood-happy", emoji: "😊" },
  { id: "sad", icon: Frown, label: "mood.sad", color: "mood-sad", emoji: "😢" },
  { id: "angry", icon: Angry, label: "mood.angry", color: "mood-angry", emoji: "😠" },
  { id: "anxious", icon: Zap, label: "mood.anxious", color: "mood-anxious", emoji: "😰" },
  { id: "calm", icon: Heart, label: "mood.calm", color: "mood-calm", emoji: "😌" },
  { id: "neutral", icon: Meh, label: "mood.neutral", color: "mood-neutral", emoji: "😐" },
]

export function MoodTracker() {
  const { t } = useLanguage()
  const [selectedMood, setSelectedMood] = useState<string>("")
  const [intensity, setIntensity] = useState<number>(5)
  const [note, setNote] = useState<string>("")
  const [isRecording, setIsRecording] = useState(false)
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [currentMoodAnimation, setCurrentMoodAnimation] = useState<string>("")

  useEffect(() => {
    // Load mood entries from localStorage
    const savedEntries = localStorage.getItem("sukoonbot_mood_entries")
    if (savedEntries) {
      setMoodEntries(JSON.parse(savedEntries))
    }
  }, [])

  const saveMoodEntry = () => {
    if (!selectedMood) return

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      intensity,
      note,
      timestamp: new Date(),
      isVoice: isRecording,
    }

    const updatedEntries = [newEntry, ...moodEntries]
    setMoodEntries(updatedEntries)
    localStorage.setItem("sukoonbot_mood_entries", JSON.stringify(updatedEntries))

    // Reset form
    setSelectedMood("")
    setIntensity(5)
    setNote("")
    setCurrentMoodAnimation(selectedMood)

    // Clear animation after 2 seconds
    setTimeout(() => setCurrentMoodAnimation(""), 2000)
  }

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setIsRecording(true)

      // Simulate voice recording and transcription
      setTimeout(() => {
        setNote((prev) => prev + " [Voice note recorded]")
        setIsRecording(false)
        stream.getTracks().forEach((track) => track.stop())
      }, 3000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const getMoodStats = () => {
    const recentEntries = moodEntries.slice(0, 7) // Last 7 entries
    const avgIntensity =
      recentEntries.length > 0
        ? recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) / recentEntries.length
        : 0

    const moodCounts = recentEntries.reduce(
      (acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const dominantMood = Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0]?.[0]

    return { avgIntensity, dominantMood, totalEntries: recentEntries.length }
  }

  const stats = getMoodStats()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Current Mood Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{t("dashboard.mood.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Animation Display */}
          <div className="flex justify-center mb-6">
            <AnimatePresence>
              {currentMoodAnimation && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="text-8xl"
                >
                  {moodOptions.find((m) => m.id === currentMoodAnimation)?.emoji}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mood Options */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {moodOptions.map((mood) => (
              <motion.div key={mood.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={selectedMood === mood.id ? "default" : "outline"}
                  className={`h-20 w-full flex flex-col items-center space-y-2 ${
                    selectedMood === mood.id ? mood.color : ""
                  }`}
                  onClick={() => setSelectedMood(mood.id)}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-sm font-medium">{t(mood.label)}</span>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Intensity Slider */}
          {selectedMood && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Intensity: {intensity}/10</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (Optional)</label>
                <div className="relative">
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="How are you feeling? What's on your mind?"
                    className="min-h-[100px]"
                  />
                  <Button
                    size="sm"
                    variant={isRecording ? "destructive" : "outline"}
                    className="absolute bottom-2 right-2"
                    onClick={isRecording ? () => setIsRecording(false) : startVoiceRecording}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Save Button */}
              <Button
                onClick={saveMoodEntry}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              >
                <Save className="w-4 h-4 mr-2" />
                {t("dashboard.mood.track")}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Mood Statistics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Weekly Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Average Intensity</span>
                <span>{stats.avgIntensity.toFixed(1)}/10</span>
              </div>
              <Progress value={stats.avgIntensity * 10} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Entries This Week</span>
                <span>{stats.totalEntries}</span>
              </div>
              <Progress value={(stats.totalEntries / 7) * 100} className="h-2" />
            </div>

            {stats.dominantMood && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Most Common Mood</span>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{moodOptions.find((m) => m.id === stats.dominantMood)?.emoji}</span>
                  <span className="text-sm">
                    {t(moodOptions.find((m) => m.id === stats.dominantMood)?.label || "")}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {moodEntries.slice(0, 5).map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{moodOptions.find((m) => m.id === entry.mood)?.emoji}</span>
                    <div>
                      <p className="text-sm font-medium">
                        {t(moodOptions.find((m) => m.id === entry.mood)?.label || "")}
                      </p>
                      <p className="text-xs text-muted-foreground">Intensity: {entry.intensity}/10</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{entry.timestamp.toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {moodEntries.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No mood entries yet. Start tracking your emotions!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
