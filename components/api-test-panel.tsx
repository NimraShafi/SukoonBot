"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, AlertCircle, Loader2, Send, Globe, Clock, Zap } from "lucide-react"

interface TestResult {
  id: string
  timestamp: Date
  testType: string
  language: string
  input: string
  output: string
  responseTime: number
  status: "success" | "error" | "warning"
  error?: string
}

const TEST_SCENARIOS = [
  {
    id: "basic_en",
    name: "Basic English Response",
    language: "en",
    input: "Hello, I'm feeling anxious today. Can you help me?",
    expectedKeywords: ["anxiety", "help", "support", "understand"],
  },
  {
    id: "basic_ur",
    name: "Basic Urdu Response",
    language: "ur",
    input: "السلام علیکم، میں آج بہت پریشان ہوں۔ کیا آپ میری مدد کر سکتے ہیں؟",
    expectedKeywords: ["مدد", "سمجھ", "پریشان", "سکون"],
  },
  {
    id: "depression_en",
    name: "Depression Support (English)",
    language: "en",
    input: "I've been feeling really depressed lately and don't know what to do.",
    expectedKeywords: ["depression", "understand", "support", "help"],
  },
  {
    id: "stress_ur",
    name: "Stress Management (Urdu)",
    language: "ur",
    input: "مجھے کام کا بہت زیادہ تناؤ ہے اور میں سو نہیں سکتا۔",
    expectedKeywords: ["تناؤ", "آرام", "نیند", "مدد"],
  },
  {
    id: "cultural_en",
    name: "Cultural Context (English)",
    language: "en",
    input: "My family doesn't understand my mental health struggles. It's hard being South Asian.",
    expectedKeywords: ["family", "understand", "cultural", "support"],
  },
]

export function APITestPanel() {
  const { toast } = useToast()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [customInput, setCustomInput] = useState("")
  const [customLanguage, setCustomLanguage] = useState<"en" | "ur">("en")
  const [apiStatus, setApiStatus] = useState<"unknown" | "healthy" | "degraded" | "down">("unknown")

  const testAPICall = async (input: string, language: "en" | "ur"): Promise<TestResult> => {
    const startTime = Date.now()
    const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          language: language,
          context: "api_test",
        }),
      })

      const responseTime = Date.now() - startTime
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      return {
        id: testId,
        timestamp: new Date(),
        testType: "API Call",
        language,
        input,
        output: data.response,
        responseTime,
        status: data.error ? "warning" : "success",
        error: data.error,
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      return {
        id: testId,
        timestamp: new Date(),
        testType: "API Call",
        language,
        input,
        output: "",
        responseTime,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  const runSingleTest = async (scenario: (typeof TEST_SCENARIOS)[0]) => {
    const result = await testAPICall(scenario.input, scenario.language as "en" | "ur")

    // Check if response contains expected keywords (basic validation)
    if (result.status === "success" && result.output) {
      const hasExpectedContent = scenario.expectedKeywords.some((keyword) =>
        result.output.toLowerCase().includes(keyword.toLowerCase()),
      )

      if (!hasExpectedContent) {
        result.status = "warning"
        result.error = "Response may not contain expected mental health support content"
      }
    }

    return result
  }

  const runAllTests = async () => {
    setIsRunningTests(true)
    setTestResults([])

    const results: TestResult[] = []

    for (const scenario of TEST_SCENARIOS) {
      try {
        const result = await runSingleTest(scenario)
        results.push(result)
        setTestResults([...results])

        // Add delay between tests to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`Test ${scenario.id} failed:`, error)
      }
    }

    // Determine overall API status
    const successCount = results.filter((r) => r.status === "success").length
    const errorCount = results.filter((r) => r.status === "error").length
    const warningCount = results.filter((r) => r.status === "warning").length

    if (errorCount === 0 && warningCount === 0) {
      setApiStatus("healthy")
    } else if (errorCount === 0 && warningCount > 0) {
      setApiStatus("degraded")
    } else if (successCount > errorCount) {
      setApiStatus("degraded")
    } else {
      setApiStatus("down")
    }

    setIsRunningTests(false)

    // Show summary toast
    toast({
      title: "API Tests Completed",
      description: `${successCount} passed, ${warningCount} warnings, ${errorCount} failed`,
      variant: errorCount > successCount ? "destructive" : "default",
    })
  }

  const runCustomTest = async () => {
    if (!customInput.trim()) return

    const result = await testAPICall(customInput, customLanguage)
    setTestResults((prev) => [result, ...prev])

    toast({
      title: "Custom Test Completed",
      description: `Response received in ${result.responseTime}ms`,
      variant: result.status === "error" ? "destructive" : "default",
    })
  }

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return "text-green-600 dark:text-green-400"
      case "warning":
        return "text-yellow-600 dark:text-yellow-400"
      case "error":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4" />
      case "warning":
        return <AlertCircle className="w-4 h-4" />
      case "error":
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getApiStatusBadge = () => {
    switch (apiStatus) {
      case "healthy":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Healthy</Badge>
      case "degraded":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Degraded</Badge>
      case "down":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Down</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const averageResponseTime = testResults.length
    ? Math.round(testResults.reduce((sum, result) => sum + result.responseTime, 0) / testResults.length)
    : 0

  const successRate = testResults.length
    ? Math.round((testResults.filter((r) => r.status === "success").length / testResults.length) * 100)
    : 0

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* API Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Gemini API Status</span>
            </div>
            {getApiStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{successRate}%</div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{averageResponseTime}ms</div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{testResults.length}</div>
              <p className="text-sm text-muted-foreground">Total Tests</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Controls */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Automated Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Run comprehensive tests to verify API functionality across different scenarios and languages.
            </p>
            <Button
              onClick={runAllTests}
              disabled={isRunningTests}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              {isRunningTests ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Run All Tests
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <select
                value={customLanguage}
                onChange={(e) => setCustomLanguage(e.target.value as "en" | "ur")}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="en">English</option>
                <option value="ur">اردو (Urdu)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Test Message</label>
              <Textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter your test message here..."
                className="min-h-[80px]"
              />
            </div>
            <Button onClick={runCustomTest} disabled={!customInput.trim()} className="w-full" variant="outline">
              <Send className="w-4 h-4 mr-2" />
              Test Custom Message
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((result) => (
                <div key={result.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={getStatusColor(result.status)}>{getStatusIcon(result.status)}</div>
                      <span className="font-medium">{result.testType}</span>
                      <Badge variant="outline">{result.language.toUpperCase()}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{result.responseTime}ms</span>
                      </div>
                      <span>{result.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">INPUT:</label>
                      <p className="text-sm bg-muted p-2 rounded mt-1">{result.input}</p>
                    </div>

                    {result.output && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">OUTPUT:</label>
                        <p className="text-sm bg-muted p-2 rounded mt-1">{result.output}</p>
                      </div>
                    )}

                    {result.error && (
                      <div>
                        <label className="text-xs font-medium text-red-600">ERROR:</label>
                        <p className="text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded mt-1 text-red-700 dark:text-red-300">
                          {result.error}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Scenarios Info */}
      <Card>
        <CardHeader>
          <CardTitle>Test Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {TEST_SCENARIOS.map((scenario) => (
              <div key={scenario.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{scenario.name}</h4>
                  <Badge variant="outline">{scenario.language.toUpperCase()}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{scenario.input}</p>
                <div className="flex flex-wrap gap-1">
                  {scenario.expectedKeywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
