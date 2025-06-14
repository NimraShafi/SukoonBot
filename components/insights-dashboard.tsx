"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Heart, MessageCircle, BookOpen, Calendar } from "lucide-react"

const moodData = [
  { date: "2024-01-01", mood: 7, anxiety: 3, energy: 6 },
  { date: "2024-01-02", mood: 6, anxiety: 4, energy: 5 },
  { date: "2024-01-03", mood: 8, anxiety: 2, energy: 7 },
  { date: "2024-01-04", mood: 5, anxiety: 6, energy: 4 },
  { date: "2024-01-05", mood: 7, anxiety: 3, energy: 6 },
  { date: "2024-01-06", mood: 9, anxiety: 1, energy: 8 },
  { date: "2024-01-07", mood: 8, anxiety: 2, energy: 7 },
]

const activityData = [
  { activity: "Meditation", minutes: 45, target: 60 },
  { activity: "Exercise", minutes: 30, target: 45 },
  { activity: "Journaling", minutes: 15, target: 20 },
  { activity: "Sleep", minutes: 420, target: 480 },
]

export function InsightsDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Mood</p>
                <p className="text-2xl font-bold">7.2/10</p>
                <p className="text-xs text-green-600">+0.5 from last week</p>
              </div>
              <Heart className="w-8 h-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chat Sessions</p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-blue-600">3 this week</p>
              </div>
              <MessageCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Journal Entries</p>
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-purple-600">2 this week</p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold">15 days</p>
                <p className="text-xs text-green-600">Keep it up!</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mood Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Mood Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="anxiety" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Activity Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activityData.map((activity) => (
              <div key={activity.activity} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{activity.activity}</span>
                  <span className="text-muted-foreground">
                    {activity.activity === "Sleep"
                      ? `${Math.floor(activity.minutes / 60)}h ${activity.minutes % 60}m / ${Math.floor(activity.target / 60)}h`
                      : `${activity.minutes}min / ${activity.target}min`}
                  </span>
                </div>
                <Progress value={(activity.minutes / activity.target) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
