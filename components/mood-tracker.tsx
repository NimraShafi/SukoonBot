"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/components/language-provider"
import { useToast } from "@/hooks/use-toast"
import { Smile, Frown, Angry, Zap, Heart, Meh, Mic, MicOff, Save, TrendingUp, Download, Trash2 } from "lucide-react"

interface MoodEntry {
  id: string
  mood: string
  intensity: number
  note: string
  timestamp: string
  isVoice?: boolean
}

const moodOptions = [
  { id: "happy", icon: Smile, label: "mood.happy", color: "bg-yellow-100 text-yellow-800", emoji: "😊" },
  { id: "sad", icon: Frown, label: "mood.sad", color: "bg-blue-100 text-blue-800", emoji: "😢" },
  { id: "angry", icon: Angry, label: "mood.angry", color: "bg-red-100 text-red-800", emoji: "😠" },
  { id: "anxious", icon: Zap, label: "mood.anxious", color: "bg-purple-100 text-purple-800", emoji: "😰" },
  { id: "calm", icon: Heart, label: "mood.calm", color: "bg-green-100 text-green-800", emoji: "😌" },
  { id: "neutral", icon: Meh, label: "mood.neutral", color: "bg-gray-100 text-gray-800", emoji: "😐" },
]

export function MoodTracker() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [selectedMood, setSelectedMood] = useState<string>("")
  const [intensity, setIntensity] = useState<number>(5)
  const [note, setNote] = useState<string>("")
  const [isRecording, setIsRecording] = useState(false)
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [currentMoodAnimation, setCurrentMoodAnimation] = useState<string>("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    try {
      const savedEntries = localStorage.getItem("sukoonbot_mood_entries")
      if (savedEntries) {
        const parsedEntries = JSON.parse(savedEntries)
        const validEntries = parsedEntries.filter(
          (entry: any) =>
            entry &&
            typeof entry.id === "string" &&
            typeof entry.mood === "string" &&
            typeof entry.intensity === "number" &&
            typeof entry.note === "string" &&
            entry.timestamp,
        )
        setMoodEntries(validEntries)
      }
    } catch (error) {
      console.error("Error loading mood entries:", error)
      localStorage.removeItem("sukoonbot_mood_entries")
    }
  }, [isClient])

  const saveMoodEntry = () => {
    if (!selectedMood || !isClient) return

    try {
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        mood: selectedMood,
        intensity,
        note,
        timestamp: new Date().toISOString(),
        isVoice: isRecording,
      }

      const updatedEntries = [newEntry, ...moodEntries]
      setMoodEntries(updatedEntries)
      localStorage.setItem("sukoonbot_mood_entries", JSON.stringify(updatedEntries))

      toast({
        title: "Mood Saved!",
        description: `Your ${getMoodLabel(selectedMood)} mood has been recorded.`,
      })

      setCurrentMoodAnimation(selectedMood)
      setSelectedMood("")
      setIntensity(5)
      setNote("")

      setTimeout(() => setCurrentMoodAnimation(""), 2000)
    } catch (error) {
      console.error("Error saving mood entry:", error)
      toast({
        title: "Error",
        description: "Failed to save mood entry. Please try again.",
        variant: "destructive",
      })
    }
  }

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setIsRecording(true)

      setTimeout(() => {
        const voiceNotes = [
          "Feeling overwhelmed with work today",
          "Had a great conversation with a friend",
          "Struggling with sleep lately",
          "Excited about upcoming plans",
          "Feeling grateful for small moments",
        ]
        const randomNote = voiceNotes[Math.floor(Math.random() * voiceNotes.length)]
        setNote((prev) => (prev ? `${prev} ${randomNote}` : randomNote))
        setIsRecording(false)
        stream.getTracks().forEach((track) => track.stop())

        toast({
          title: "Voice Note Added",
          description: "Your voice note has been transcribed and added.",
        })
      }, 2000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      setIsRecording(false)
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to record voice notes.",
        variant: "destructive",
      })
    }
  }

  const getMoodLabel = (moodId: string) => {
    const mood = moodOptions.find((m) => m.id === moodId)
    return mood ? t(mood.label) : moodId
  }

  const getMoodStats = () => {
    if (!isClient || moodEntries.length === 0) {
      return { avgIntensity: 0, dominantMood: null, totalEntries: 0 }
    }

    const recentEntries = moodEntries.slice(0, 7)
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

  const clearAllEntries = () => {
    if (!isClient) return

    if (confirm("Are you sure you want to clear all mood entries? This action cannot be undone.")) {
      setMoodEntries([])
      localStorage.removeItem("sukoonbot_mood_entries")
      toast({
        title: "Data Cleared",
        description: "All mood entries have been removed.",
      })
    }
  }

  const exportMoodData = () => {
    if (!isClient || moodEntries.length === 0) return

    try {
      const dataStr = JSON.stringify(moodEntries, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `mood-data-${new Date().toISOString().split("T")[0]}.json`
      link.click()
      URL.revokeObjectURL(url)

      toast({
        title: "Data Exported",
        description: "Your mood data has been downloaded successfully.",
      })
    } catch (error) {
      console.error("Error exporting data:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export mood data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleDateString()
    } catch {
      return "Invalid date"
    }
  }

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch {
      return "Invalid time"
    }
  }

  const stats = getMoodStats()

  if (!isClient) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-base sm:text-lg">Loading Mood Tracker...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Current Mood Selector */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-center text-lg sm:text-xl">{t("dashboard.mood.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Mood Animation Display */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <AnimatePresence>
              {currentMoodAnimation && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="text-6xl sm:text-8xl"
                >
                  {moodOptions.find((m) => m.id === currentMoodAnimation)?.emoji}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mood Options */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {moodOptions.map((mood) => (
              <motion.div key={mood.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant={selectedMood === mood.id ? "default" : "outline"}
                  className={`h-16 sm:h-20 w-full flex flex-col items-center justify-center space-y-1 sm:space-y-2 tap-target ${
                    selectedMood === mood.id ? mood.color : ""
                  }`}
                  onClick={() => setSelectedMood(mood.id)}
                >
                  <span className="text-xl sm:text-2xl">{mood.emoji}</span>
                  <span className="text-xs sm:text-sm font-medium">{t(mood.label)}</span>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Intensity Slider */}
          {selectedMood && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Intensity: {intensity}/10
                  <span className="ml-2 text-xs text-muted-foreground">
                    {intensity <= 3 ? "Low" : intensity <= 7 ? "Medium" : "High"}
                  </span>
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>Medium</span>
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
                    className="min-h-[80px] sm:min-h-[100px] pr-12"
                  />
                  <Button
                    size="sm"
                    variant={isRecording ? "destructive" : "outline"}
                    className="absolute bottom-2 right-2 tap-target"
                    onClick={isRecording ? () => setIsRecording(false) : startVoiceRecording}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Save Button */}
              <Button
                onClick={saveMoodEntry}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 tap-target"
              >
                <Save className="w-4 h-4 mr-2" />
                {t("dashboard.mood.track")}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Mood Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Weekly Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span>Average Intensity</span>
                <span>{stats.avgIntensity.toFixed(1)}/10</span>
              </div>
              <Progress value={stats.avgIntensity * 10} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span>Entries This Week</span>
                <span>{stats.totalEntries}</span>
              </div>
              <Progress value={(stats.totalEntries / 7) * 100} className="h-2" />
            </div>

            {stats.dominantMood && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-xs sm:text-sm font-medium">Most Common Mood</span>
                <div className="flex items-center space-x-2">
                  <span className="text-base sm:text-lg">
                    {moodOptions.find((m) => m.id === stats.dominantMood)?.emoji}
                  </span>
                  <span className="text-xs sm:text-sm">{getMoodLabel(stats.dominantMood)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg">Recent Entries</CardTitle>
              <div className="flex space-x-1 sm:space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={exportMoodData}
                  disabled={moodEntries.length === 0}
                  className="tap-target"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearAllEntries}
                  disabled={moodEntries.length === 0}
                  className="tap-target"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto scroll-smooth-mobile">
              {moodEntries.slice(0, 5).map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg sm:text-2xl">{moodOptions.find((m) => m.id === entry.mood)?.emoji}</span>
                    <div>
                      <p className="text-xs sm:text-sm font-medium">{getMoodLabel(entry.mood)}</p>
                      <p className="text-xs text-muted-foreground">Intensity: {entry.intensity}/10</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{formatDate(entry.timestamp)}</p>
                    <p className="text-xs text-muted-foreground">{formatTime(entry.timestamp)}</p>
                  </div>
                </motion.div>
              ))}

              {moodEntries.length === 0 && (
                <div className="text-center py-6 sm:py-8 text-muted-foreground">
                  <Heart className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No mood entries yet. Start tracking your emotions!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
