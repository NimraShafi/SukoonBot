"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  Camera,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Monitor,
  Smartphone,
  Globe,
  Shield,
  Settings,
  Info,
  Download,
} from "lucide-react"

interface BrowserInfo {
  name: string
  version: string
  platform: string
  userAgent: string
  isMobile: boolean
  isSecureContext: boolean
}

interface CameraCapability {
  deviceId: string
  label: string
  kind: MediaDeviceKind
  groupId: string
}

interface PermissionStatus {
  camera: PermissionState | "unknown"
  microphone: PermissionState | "unknown"
}

interface TestResult {
  test: string
  status: "pass" | "fail" | "warning" | "pending"
  message: string
  details?: string
  timestamp: Date
}

interface CameraConstraints {
  video: {
    width?: { min?: number; ideal?: number; max?: number }
    height?: { min?: number; ideal?: number; max?: number }
    frameRate?: { min?: number; ideal?: number; max?: number }
    facingMode?: string
    deviceId?: string
  }
}

const COMMON_RESOLUTIONS = [
  { name: "QVGA", width: 320, height: 240 },
  { name: "VGA", width: 640, height: 480 },
  { name: "HD", width: 1280, height: 720 },
  { name: "Full HD", width: 1920, height: 1080 },
]

const BROWSER_COMPATIBILITY = {
  Chrome: { minVersion: 53, features: ["getUserMedia", "permissions", "mediaDevices"] },
  Firefox: { minVersion: 36, features: ["getUserMedia", "permissions", "mediaDevices"] },
  Safari: { minVersion: 11, features: ["getUserMedia", "mediaDevices"] },
  Edge: { minVersion: 12, features: ["getUserMedia", "permissions", "mediaDevices"] },
}

export function CameraVerification() {
  const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null)
  const [permissions, setPermissions] = useState<PermissionStatus>({
    camera: "unknown",
    microphone: "unknown",
  })
  const [cameraDevices, setCameraDevices] = useState<CameraCapability[]>([])
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null)
  const [supportedConstraints, setSupportedConstraints] = useState<MediaTrackSupportedConstraints | null>(null)
  const [testProgress, setTestProgress] = useState(0)

  // Detect browser information
  useEffect(() => {
    const detectBrowser = (): BrowserInfo => {
      const ua = navigator.userAgent
      let browserName = "Unknown"
      let version = "Unknown"

      // Detect browser
      if (ua.includes("Chrome") && !ua.includes("Edg")) {
        browserName = "Chrome"
        const match = ua.match(/Chrome\/(\d+)/)
        version = match ? match[1] : "Unknown"
      } else if (ua.includes("Firefox")) {
        browserName = "Firefox"
        const match = ua.match(/Firefox\/(\d+)/)
        version = match ? match[1] : "Unknown"
      } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
        browserName = "Safari"
        const match = ua.match(/Version\/(\d+)/)
        version = match ? match[1] : "Unknown"
      } else if (ua.includes("Edg")) {
        browserName = "Edge"
        const match = ua.match(/Edg\/(\d+)/)
        version = match ? match[1] : "Unknown"
      }

      return {
        name: browserName,
        version,
        platform: navigator.platform,
        userAgent: ua,
        isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
        isSecureContext: window.isSecureContext,
      }
    }

    setBrowserInfo(detectBrowser())
  }, [])

  // Check permissions
  const checkPermissions = async () => {
    const newPermissions: PermissionStatus = {
      camera: "unknown",
      microphone: "unknown",
    }

    try {
      if ("permissions" in navigator) {
        try {
          const cameraPermission = await navigator.permissions.query({ name: "camera" as PermissionName })
          newPermissions.camera = cameraPermission.state
        } catch (error) {
          console.log("Camera permission query not supported")
        }

        try {
          const micPermission = await navigator.permissions.query({ name: "microphone" as PermissionName })
          newPermissions.microphone = micPermission.state
        } catch (error) {
          console.log("Microphone permission query not supported")
        }
      }
    } catch (error) {
      console.log("Permissions API not supported")
    }

    setPermissions(newPermissions)
    return newPermissions
  }

  // Get available camera devices
  const getCameraDevices = async (): Promise<CameraCapability[]> => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const cameras = devices
        .filter((device) => device.kind === "videoinput")
        .map((device) => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId.slice(0, 8)}`,
          kind: device.kind,
          groupId: device.groupId,
        }))

      setCameraDevices(cameras)
      return cameras
    } catch (error) {
      console.error("Error enumerating devices:", error)
      return []
    }
  }

  // Test camera access with specific constraints
  const testCameraAccess = async (constraints: CameraConstraints): Promise<TestResult> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      const videoTrack = stream.getVideoTracks()[0]
      const settings = videoTrack.getSettings()

      // Clean up
      stream.getTracks().forEach((track) => track.stop())

      return {
        test: `Camera Access (${settings.width}x${settings.height})`,
        status: "pass",
        message: `Successfully accessed camera`,
        details: `Resolution: ${settings.width}x${settings.height}, Frame rate: ${settings.frameRate}fps`,
        timestamp: new Date(),
      }
    } catch (error: any) {
      return {
        test: "Camera Access",
        status: "fail",
        message: error.name || "Camera access failed",
        details: error.message,
        timestamp: new Date(),
      }
    }
  }

  // Test different camera resolutions
  const testResolutions = async (): Promise<TestResult[]> => {
    const results: TestResult[] = []

    for (const resolution of COMMON_RESOLUTIONS) {
      try {
        const constraints: CameraConstraints = {
          video: {
            width: { ideal: resolution.width },
            height: { ideal: resolution.height },
          },
        }

        const result = await testCameraAccess(constraints)
        results.push({
          ...result,
          test: `${resolution.name} Resolution`,
        })
      } catch (error) {
        results.push({
          test: `${resolution.name} Resolution`,
          status: "fail",
          message: "Resolution not supported",
          timestamp: new Date(),
        })
      }
    }

    return results
  }

  // Test camera switching (front/back)
  const testCameraSwitching = async (): Promise<TestResult[]> => {
    const results: TestResult[] = []
    const facingModes = ["user", "environment"]

    for (const facingMode of facingModes) {
      try {
        const constraints: CameraConstraints = {
          video: { facingMode },
        }

        const result = await testCameraAccess(constraints)
        results.push({
          ...result,
          test: `${facingMode === "user" ? "Front" : "Back"} Camera`,
        })
      } catch (error) {
        results.push({
          test: `${facingMode === "user" ? "Front" : "Back"} Camera`,
          status: "warning",
          message: "Camera not available",
          timestamp: new Date(),
        })
      }
    }

    return results
  }

  // Test browser compatibility
  const testBrowserCompatibility = (): TestResult[] => {
    const results: TestResult[] = []

    if (!browserInfo) return results

    // Check if browser is supported
    const browserCompat = BROWSER_COMPATIBILITY[browserInfo.name as keyof typeof BROWSER_COMPATIBILITY]
    if (browserCompat) {
      const version = Number.parseInt(browserInfo.version)
      const isSupported = version >= browserCompat.minVersion

      results.push({
        test: "Browser Compatibility",
        status: isSupported ? "pass" : "fail",
        message: isSupported
          ? `${browserInfo.name} ${browserInfo.version} is supported`
          : `${browserInfo.name} ${browserInfo.version} may not be fully supported (min: ${browserCompat.minVersion})`,
        timestamp: new Date(),
      })
    }

    // Check secure context (HTTPS)
    results.push({
      test: "Secure Context (HTTPS)",
      status: browserInfo.isSecureContext ? "pass" : "fail",
      message: browserInfo.isSecureContext ? "Running in secure context" : "Camera access requires HTTPS in production",
      timestamp: new Date(),
    })

    // Check MediaDevices API
    results.push({
      test: "MediaDevices API",
      status: "mediaDevices" in navigator ? "pass" : "fail",
      message: "mediaDevices" in navigator ? "MediaDevices API available" : "MediaDevices API not supported",
      timestamp: new Date(),
    })

    // Check getUserMedia
    results.push({
      test: "getUserMedia Support",
      status: navigator.mediaDevices?.getUserMedia ? "pass" : "fail",
      message: navigator.mediaDevices?.getUserMedia ? "getUserMedia is available" : "getUserMedia is not supported",
      timestamp: new Date(),
    })

    return results
  }

  // Run comprehensive camera tests
  const runComprehensiveTests = async () => {
    setIsRunningTests(true)
    setTestResults([])
    setTestProgress(0)

    const allResults: TestResult[] = []

    try {
      // Step 1: Browser compatibility (10%)
      const browserResults = testBrowserCompatibility()
      allResults.push(...browserResults)
      setTestResults([...allResults])
      setTestProgress(10)

      // Step 2: Check permissions (20%)
      await checkPermissions()
      setTestProgress(20)

      // Step 3: Get camera devices (30%)
      const devices = await getCameraDevices()
      allResults.push({
        test: "Camera Device Detection",
        status: devices.length > 0 ? "pass" : "fail",
        message: `Found ${devices.length} camera device(s)`,
        details: devices.map((d) => d.label).join(", "),
        timestamp: new Date(),
      })
      setTestResults([...allResults])
      setTestProgress(30)

      // Step 4: Test basic camera access (50%)
      const basicAccessResult = await testCameraAccess({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
      })
      allResults.push(basicAccessResult)
      setTestResults([...allResults])
      setTestProgress(50)

      // Step 5: Test different resolutions (70%)
      const resolutionResults = await testResolutions()
      allResults.push(...resolutionResults)
      setTestResults([...allResults])
      setTestProgress(70)

      // Step 6: Test camera switching (90%)
      const switchingResults = await testCameraSwitching()
      allResults.push(...switchingResults)
      setTestResults([...allResults])
      setTestProgress(90)

      // Step 7: Get supported constraints (100%)
      if (navigator.mediaDevices?.getSupportedConstraints) {
        const constraints = navigator.mediaDevices.getSupportedConstraints()
        setSupportedConstraints(constraints)
        allResults.push({
          test: "Constraint Support",
          status: "pass",
          message: `${Object.keys(constraints).length} constraints supported`,
          details: Object.keys(constraints).join(", "),
          timestamp: new Date(),
        })
      }

      setTestResults([...allResults])
      setTestProgress(100)

      // Show summary
      const passCount = allResults.filter((r) => r.status === "pass").length
      const failCount = allResults.filter((r) => r.status === "fail").length
      const warningCount = allResults.filter((r) => r.status === "warning").length

      toast({
        title: "Camera Tests Completed",
        description: `${passCount} passed, ${warningCount} warnings, ${failCount} failed`,
        variant: failCount > passCount ? "destructive" : "default",
      })
    } catch (error) {
      console.error("Error running tests:", error)
      toast({
        title: "Test Error",
        description: "An error occurred while running camera tests",
        variant: "destructive",
      })
    } finally {
      setIsRunningTests(false)
    }
  }

  // Test live camera feed
  const testLiveFeed = async () => {
    try {
      if (currentStream) {
        // Stop current stream
        currentStream.getTracks().forEach((track) => track.stop())
        setCurrentStream(null)
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCurrentStream(stream)
        streamRef.current = stream
      }
    } catch (error: any) {
      toast({
        title: "Camera Error",
        description: error.message || "Failed to access camera",
        variant: "destructive",
      })
    }
  }

  // Export test results
  const exportResults = () => {
    const report = {
      timestamp: new Date().toISOString(),
      browserInfo,
      permissions,
      cameraDevices,
      supportedConstraints,
      testResults,
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `camera-verification-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "fail":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      default:
        return <RefreshCw className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "pass":
        return "text-green-600 dark:text-green-400"
      case "fail":
        return "text-red-600 dark:text-red-400"
      case "warning":
        return "text-yellow-600 dark:text-yellow-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const passCount = testResults.filter((r) => r.status === "pass").length
  const failCount = testResults.filter((r) => r.status === "fail").length
  const warningCount = testResults.filter((r) => r.status === "warning").length

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>Camera Verification & Compatibility</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={exportResults} variant="outline" size="sm" disabled={testResults.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button
                onClick={runComprehensiveTests}
                disabled={isRunningTests}
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              >
                {isRunningTests ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4 mr-2" />
                    Run Tests
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Comprehensive camera compatibility testing across different browsers, devices, and configurations.
          </p>
          {isRunningTests && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Test Progress</span>
                <span>{testProgress}%</span>
              </div>
              <Progress value={testProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Browser Information */}
      {browserInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Browser Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Browser:</span>
                  <Badge variant="outline">
                    {browserInfo.name} {browserInfo.version}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Platform:</span>
                  <Badge variant="outline">{browserInfo.platform}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Device Type:</span>
                  <div className="flex items-center space-x-1">
                    {browserInfo.isMobile ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                    <Badge variant="outline">{browserInfo.isMobile ? "Mobile" : "Desktop"}</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Secure Context:</span>
                  <Badge variant={browserInfo.isSecureContext ? "default" : "destructive"}>
                    {browserInfo.isSecureContext ? "HTTPS" : "HTTP"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Camera Permission:</span>
                  <Badge
                    variant={
                      permissions.camera === "granted"
                        ? "default"
                        : permissions.camera === "denied"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {permissions.camera}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Microphone Permission:</span>
                  <Badge
                    variant={
                      permissions.microphone === "granted"
                        ? "default"
                        : permissions.microphone === "denied"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {permissions.microphone}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Camera Devices:</span>
                  <Badge variant="outline">{cameraDevices.length} found</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Camera Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Live Camera Test</span>
            <Button onClick={testLiveFeed} variant={currentStream ? "destructive" : "default"}>
              {currentStream ? (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Stop Camera
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Test Camera
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ display: currentStream ? "block" : "none" }}
            />
            {!currentStream && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Click "Test Camera" to start live feed</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Test Results</span>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{passCount} Passed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span>{warningCount} Warnings</span>
                </div>
                <div className="flex items-center space-x-1">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>{failCount} Failed</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.test}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{result.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <p className={`text-sm ${getStatusColor(result.status)}`}>{result.message}</p>
                  {result.details && <p className="text-xs text-muted-foreground mt-1 font-mono">{result.details}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Camera Devices */}
      {cameraDevices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Camera Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cameraDevices.map((device, index) => (
                <div key={device.deviceId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Camera className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{device.label || `Camera ${index + 1}`}</p>
                      <p className="text-xs text-muted-foreground">ID: {device.deviceId.slice(0, 20)}...</p>
                    </div>
                  </div>
                  <Badge variant="outline">{device.kind}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Supported Constraints */}
      {supportedConstraints && (
        <Card>
          <CardHeader>
            <CardTitle>Supported Camera Constraints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {Object.entries(supportedConstraints).map(([constraint, supported]) => (
                <div key={constraint} className="flex items-center space-x-2">
                  {supported ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm">{constraint}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Troubleshooting Guide */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>Troubleshooting Guide</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Common Issues & Solutions:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <Shield className="w-4 h-4 mt-0.5 text-blue-600" />
                <span>
                  <strong>Permission Denied:</strong> Check browser settings and allow camera access. Some browsers
                  require user interaction before requesting permissions.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <Globe className="w-4 h-4 mt-0.5 text-blue-600" />
                <span>
                  <strong>HTTPS Required:</strong> Camera access requires HTTPS in production. Use localhost for
                  development testing.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <Camera className="w-4 h-4 mt-0.5 text-blue-600" />
                <span>
                  <strong>Camera in Use:</strong> Close other applications that might be using the camera (Zoom, Skype,
                  etc.).
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <Monitor className="w-4 h-4 mt-0.5 text-blue-600" />
                <span>
                  <strong>Browser Compatibility:</strong> Use modern browsers (Chrome 53+, Firefox 36+, Safari 11+, Edge
                  12+).
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
