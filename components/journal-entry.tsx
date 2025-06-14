"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useLanguage } from "@/components/language-provider"
import { Save, CalendarIcon, Tag, Mic, MicOff, BookOpen, Search, Filter } from "lucide-react"

interface JournalEntry {
  id: string
  title: string
  content: string
  mood: string
  tags: string[]
  date: Date
  hasVoiceNote: boolean
}

const moodTags = [
  { id: "grateful", label: "Grateful", color: "bg-green-100 text-green-800" },
  { id: "anxious", label: "Anxious", color: "bg-yellow-100 text-yellow-800" },
  { id: "peaceful", label: "Peaceful", color: "bg-blue-100 text-blue-800" },
  { id: "frustrated", label: "Frustrated", color: "bg-red-100 text-red-800" },
  { id: "hopeful", label: "Hopeful", color: "bg-purple-100 text-purple-800" },
  { id: "reflective", label: "Reflective", color: "bg-gray-100 text-gray-800" },
]

export function JournalEntry() {
  const { t } = useLanguage()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState({
    title: "",
    content: "",
    mood: "",
    tags: [] as string[],
    date: new Date(),
  })
  const [isRecording, setIsRecording] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMoodFilter, setSelectedMoodFilter] = useState("")
  const [showCalendar, setShowCalendar] = useState(false)

  useEffect(() => {
    const savedEntries = localStorage.getItem("sukoonbot_journal_entries")
    if (savedEntries) {
      setEntries(
        JSON.parse(savedEntries).map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
        })),
      )
    }
  }, [])

  const saveEntry = () => {
    if (!currentEntry.title.trim() || !currentEntry.content.trim()) return

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      ...currentEntry,
      hasVoiceNote: isRecording,
    }

    const updatedEntries = [newEntry, ...entries]
    setEntries(updatedEntries)
    localStorage.setItem("sukoonbot_journal_entries", JSON.stringify(updatedEntries))

    // Reset form
    setCurrentEntry({
      title: "",
      content: "",
      mood: "",
      tags: [],
      date: new Date(),
    })
    setIsRecording(false)
  }

  const toggleTag = (tagId: string) => {
    setCurrentEntry((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId) ? prev.tags.filter((t) => t !== tagId) : [...prev.tags, tagId],
    }))
  }

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setIsRecording(true)

      setTimeout(() => {
        setCurrentEntry((prev) => ({
          ...prev,
          content: prev.content + "\n[Voice note recorded]",
        }))
        setIsRecording(false)
        stream.getTracks().forEach((track) => track.stop())
      }, 3000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMood = !selectedMoodFilter || entry.tags.includes(selectedMoodFilter)
    return matchesSearch && matchesMood
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* New Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>New Journal Entry</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              placeholder="Entry title..."
              value={currentEntry.title}
              onChange={(e) => setCurrentEntry((prev) => ({ ...prev, title: e.target.value }))}
            />

            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {currentEntry.date.toLocaleDateString()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={currentEntry.date}
                  onSelect={(date) => {
                    if (date) {
                      setCurrentEntry((prev) => ({ ...prev, date }))
                      setShowCalendar(false)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="relative">
            <Textarea
              placeholder="What's on your mind today? How are you feeling?"
              value={currentEntry.content}
              onChange={(e) => setCurrentEntry((prev) => ({ ...prev, content: e.target.value }))}
              className="min-h-[200px] resize-none"
            />
            <Button
              size="sm"
              variant={isRecording ? "destructive" : "outline"}
              className="absolute bottom-3 right-3"
              onClick={isRecording ? () => setIsRecording(false) : startVoiceRecording}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>

          {/* Mood Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium">How are you feeling?</label>
            <div className="flex flex-wrap gap-2">
              {moodTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={currentEntry.tags.includes(tag.id) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${currentEntry.tags.includes(tag.id) ? tag.color : ""}`}
                  onClick={() => toggleTag(tag.id)}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag.label}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={saveEntry}
            disabled={!currentEntry.title.trim() || !currentEntry.content.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Entry
          </Button>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedMoodFilter}
                onChange={(e) => setSelectedMoodFilter(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="">All moods</option>
                {moodTags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journal Entries */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No entries found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedMoodFilter
                  ? "Try adjusting your search or filter criteria."
                  : "Start writing your first journal entry to track your thoughts and feelings."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{entry.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {entry.date.toLocaleDateString()} at{" "}
                        {entry.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {entry.hasVoiceNote && (
                      <Badge variant="outline">
                        <Mic className="w-3 h-3 mr-1" />
                        Voice Note
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm mb-4 line-clamp-3">{entry.content}</p>

                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tagId) => {
                        const tag = moodTags.find((t) => t.id === tagId)
                        return tag ? (
                          <Badge key={tagId} variant="secondary" className={tag.color}>
                            {tag.label}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
