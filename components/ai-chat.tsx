"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Send, Mic, MicOff, Bot, User, Volume2, VolumeX, AlertCircle } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  isVoice?: boolean
  hasError?: boolean
}

export function AIChat() {
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        language === "ur"
          ? "السلام علیکم! میں سکون بوٹ ہوں۔ آج آپ کیسا محسوس کر رہے ہیں؟ میں یہاں آپ کی بات سننے اور مدد کرنے کے لیے ہوں۔"
          : "Hello! I'm SukoonBot, your AI mental health companion. How are you feeling today? I'm here to listen and support you.",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      setIsConnected(true)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          language: language,
          context: "mental_health_support",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response")
      }

      if (data.error) {
        setIsConnected(false)
        toast({
          title: "Connection Issue",
          description: "AI service is temporarily unavailable. Showing offline response.",
          variant: "destructive",
        })
      }

      return data.response
    } catch (error) {
      console.error("Error generating AI response:", error)
      setIsConnected(false)

      toast({
        title: "Connection Error",
        description: "Unable to connect to AI service. Please check your internet connection.",
        variant: "destructive",
      })

      // Return offline fallback responses
      const offlineResponses = {
        ur: [
          "معذرت، میں اس وقت آن لائن نہیں ہوں۔ آپ کے جذبات اہم ہیں اور میں جلد ہی واپس آؤں گا۔",
          "میں سمجھ سکتا ہوں کہ یہ مشکل وقت ہو سکتا ہے۔ براہ کرم صبر کریں، میں جلد دستیاب ہوں گا۔",
          "آپ کی بات سننا میرے لیے اہم ہے۔ فی الوقت، گہری سانس لیں اور یاد رکھیں کہ آپ اکیلے نہیں ہیں۔",
        ],
        en: [
          "I apologize, but I'm currently offline. Your feelings matter, and I'll be back to support you soon.",
          "I understand this might be a difficult time. Please be patient - I'll be available to help you shortly.",
          "Your wellbeing is important to me. For now, please take deep breaths and remember that you're not alone.",
          "I'm temporarily unavailable, but please know that what you're going through is valid. I'll be here to listen soon.",
        ],
      }

      const responses = offlineResponses[language] || offlineResponses.en
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }

  const sendMessage = async (content: string, isVoice = false) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      isVoice,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    try {
      // Add a more realistic typing delay
      const typingDelay = Math.min(content.length * 50, 3000) // 50ms per character, max 3 seconds

      setTimeout(
        async () => {
          try {
            const aiResponse = await generateAIResponse(content)

            const botMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: aiResponse,
              sender: "bot",
              timestamp: new Date(),
              hasError: !isConnected,
            }

            setMessages((prev) => [...prev, botMessage])
          } catch (error) {
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              content:
                language === "ur"
                  ? "معذرت، کچھ غلط ہو گیا۔ براہ کرم دوبارہ کوشش کریں۔"
                  : "Sorry, something went wrong. Please try again.",
              sender: "bot",
              timestamp: new Date(),
              hasError: true,
            }
            setMessages((prev) => [...prev, errorMessage])
          } finally {
            setIsTyping(false)
          }
        },
        Math.max(typingDelay, 1000),
      ) // Minimum 1 second delay
    } catch (error) {
      setIsTyping(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const audioChunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        // Simulate speech-to-text transcription
        const transcriptions = {
          ur: [
            "میں آج بہت پریشان محسوس کر رہا ہوں",
            "مجھے نیند نہیں آ رہی",
            "میں بہت تناؤ میں ہوں",
            "کیا آپ میری مدد کر سکتے ہیں؟",
          ],
          en: [
            "I am feeling very anxious today",
            "I can't seem to sleep well",
            "I'm under a lot of stress",
            "Can you help me with my worries?",
            "I'm feeling overwhelmed",
          ],
        }

        const options = transcriptions[language] || transcriptions.en
        const transcription = options[Math.floor(Math.random() * options.length)]

        sendMessage(transcription, true)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
      toast({
        title: "Microphone Error",
        description: "Unable to access microphone. Please check your permissions.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const speakMessage = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === "ur" ? "ur-PK" : "en-US"
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[calc(100vh-8rem)]">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{t("dashboard.chat.title")}</h2>
                <p className="text-sm text-muted-foreground">{t("dashboard.chat.subtitle")}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className="text-xs text-muted-foreground">{isConnected ? "Online" : "Offline"}</span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col h-full p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {message.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={`rounded-2xl p-4 ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                          : message.hasError
                            ? "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800"
                            : "bg-muted"
                      }`}
                    >
                      {message.hasError && (
                        <div className="flex items-center mb-2 text-red-600 dark:text-red-400">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          <span className="text-xs">Offline Response</span>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.isVoice && (
                        <div className="flex items-center mt-2 text-xs opacity-70">
                          <Mic className="w-3 h-3 mr-1" />
                          Voice message
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {message.sender === "bot" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                            onClick={() => (isSpeaking ? stopSpeaking() : speakMessage(message.content))}
                          >
                            {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-2xl p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={t("chat.placeholder")}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(inputMessage)}
                  className="pr-12"
                  disabled={isTyping}
                />
              </div>

              <Button
                size="sm"
                variant={isRecording ? "destructive" : "outline"}
                onClick={isRecording ? stopRecording : startRecording}
                className="shrink-0"
                disabled={isTyping}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>

              <Button
                size="sm"
                onClick={() => sendMessage(inputMessage)}
                disabled={!inputMessage.trim() || isTyping}
                className="shrink-0 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {!isConnected && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                You're currently offline. Messages will use cached responses.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
