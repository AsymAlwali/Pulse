"use client"

import { useState } from "react"
import { UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link"
import {
  Zap,
  Check,
  Moon,
  BookOpen,
  Target,
  Plus,
  Trash2,
  Flame,
  Clock,
  TrendingUp,
  Calendar,
} from "lucide-react"

// Types
type Habit = {
  id: number
  name: string
  streak: number
  completedToday: boolean
}

type SleepEntry = {
  id: number
  hours: number
  date: string
}

type LearningEntry = {
  id: number
  topic: string
  minutes: number
  category: string
  date: string
}

type Goal = {
  id: number
  name: string
  current: number
  target: number
}

type Activity = {
  id: number
  text: string
  timestamp: string
}

export default function DashboardPage() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState<"overview" | "habits" | "sleep" | "learning" | "goals">("overview")

  // State for all data
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, name: "Morning Exercise", streak: 7, completedToday: false },
    { id: 2, name: "Read 30 mins", streak: 12, completedToday: true },
    { id: 3, name: "Meditate", streak: 3, completedToday: false },
  ])

  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([
    { id: 1, hours: 7.5, date: "2026-04-05" },
    { id: 2, hours: 6, date: "2026-04-04" },
    { id: 3, hours: 8, date: "2026-04-03" },
  ])

  const [learningEntries, setLearningEntries] = useState<LearningEntry[]>([
    { id: 1, topic: "TypeScript generics", minutes: 45, category: "Programming", date: "2026-04-06" },
    { id: 2, topic: "System design basics", minutes: 60, category: "Programming", date: "2026-04-05" },
  ])

  const [goals, setGoals] = useState<Goal[]>([
    { id: 1, name: "Complete React course", current: 75, target: 100 },
    { id: 2, name: "Run 100km this month", current: 42, target: 100 },
  ])

  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, text: "Completed habit: Read 30 mins", timestamp: "2026-04-06T10:30:00" },
    { id: 2, text: "Logged 7.5h sleep", timestamp: "2026-04-06T08:00:00" },
    { id: 3, text: "Learned TypeScript generics for 45m", timestamp: "2026-04-05T20:00:00" },
  ])

  // Form states
  const [newHabitName, setNewHabitName] = useState("")
  const [sleepHours, setSleepHours] = useState("")
  const [learnTopic, setLearnTopic] = useState("")
  const [learnMinutes, setLearnMinutes] = useState("")
  const [learnCategory, setLearnCategory] = useState("Programming")
  const [goalName, setGoalName] = useState("")
  const [goalTarget, setGoalTarget] = useState("")

  // Calculate streak
  const currentStreak = habits.length > 0 
    ? Math.max(...habits.map(h => h.streak))
    : 0

  // Calculate averages
  const avgSleep = sleepEntries.length > 0
    ? (sleepEntries.reduce((sum, e) => sum + e.hours, 0) / sleepEntries.length).toFixed(1)
    : "0"

  const totalLearningHours = (learningEntries.reduce((sum, e) => sum + e.minutes, 0) / 60).toFixed(1)

  // Handlers
  const addActivity = (text: string) => {
    setActivities(prev => [
      { id: Date.now(), text, timestamp: new Date().toISOString() },
      ...prev.slice(0, 19),
    ])
  }

  const toggleHabit = (id: number) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id === id) {
          const newCompleted = !h.completedToday
          const newStreak = newCompleted ? h.streak + 1 : Math.max(0, h.streak - 1)
          if (newCompleted) {
            addActivity(`Completed habit: ${h.name}`)
          }
          return { ...h, completedToday: newCompleted, streak: newStreak }
        }
        return h
      })
    )
  }

  const addHabit = () => {
    if (!newHabitName.trim()) return
    setHabits(prev => [
      ...prev,
      { id: Date.now(), name: newHabitName, streak: 0, completedToday: false },
    ])
    addActivity(`Added new habit: ${newHabitName}`)
    setNewHabitName("")
  }

  const deleteHabit = (id: number) => {
    setHabits(prev => prev.filter(h => h.id !== id))
  }

  const logSleep = () => {
    const hours = parseFloat(sleepHours)
    if (!hours || hours < 0 || hours > 24) return
    setSleepEntries(prev => [
      { id: Date.now(), hours, date: new Date().toISOString().split("T")[0] },
      ...prev,
    ])
    addActivity(`Logged ${hours}h sleep`)
    setSleepHours("")
  }

  const logLearning = () => {
    if (!learnTopic.trim() || !learnMinutes) return
    const minutes = parseInt(learnMinutes)
    setLearningEntries(prev => [
      { id: Date.now(), topic: learnTopic, minutes, category: learnCategory, date: new Date().toISOString().split("T")[0] },
      ...prev,
    ])
    addActivity(`Learned ${learnTopic} for ${minutes}m`)
    setLearnTopic("")
    setLearnMinutes("")
  }

  const addGoal = () => {
    if (!goalName.trim() || !goalTarget) return
    setGoals(prev => [
      ...prev,
      { id: Date.now(), name: goalName, current: 0, target: parseInt(goalTarget) },
    ])
    addActivity(`Added goal: ${goalName}`)
    setGoalName("")
    setGoalTarget("")
  }

  const updateGoalProgress = (id: number, value: number) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id === id) {
          const newCurrent = Math.min(Math.max(0, value), g.target)
          if (newCurrent >= g.target && g.current < g.target) {
            addActivity(`Goal completed: ${g.name}!`)
          }
          return { ...g, current: newCurrent }
        }
        return g
      })
    )
  }

  const deleteGoal = (id: number) => {
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  const completedHabitsToday = habits.filter(h => h.completedToday).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <Zap className="h-5 w-5 text-background" />
            </div>
            <span className="text-xl font-bold">Pulse</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.firstName || "there"}
            </span>
            <UserButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Flame className="h-5 w-5 text-orange-500" />}
            label="Current Streak"
            value={`${currentStreak} days`}
          />
          <StatCard
            icon={<Check className="h-5 w-5 text-green-500" />}
            label="Habits Today"
            value={`${completedHabitsToday}/${habits.length}`}
          />
          <StatCard
            icon={<Moon className="h-5 w-5 text-blue-500" />}
            label="Avg Sleep"
            value={`${avgSleep}h`}
          />
          <StatCard
            icon={<BookOpen className="h-5 w-5 text-purple-500" />}
            label="Learning Hours"
            value={`${totalLearningHours}h`}
          />
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-border pb-4">
          {(["overview", "habits", "sleep", "learning", "goals"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "overview" && (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Quick Habits */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Check className="h-5 w-5" />
                  Today&apos;s Habits
                </h3>
                <div className="mt-4 space-y-3">
                  {habits.slice(0, 5).map((habit) => (
                    <div key={habit.id} className="flex items-center justify-between">
                      <span className={`text-sm ${habit.completedToday ? "text-muted-foreground line-through" : ""}`}>
                        {habit.name}
                      </span>
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className={`flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${
                          habit.completedToday
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        {habit.completedToday && <Check className="h-4 w-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </h3>
                <div className="mt-4 space-y-3">
                  {activities.slice(0, 6).map((activity) => (
                    <div key={activity.id} className="flex items-start justify-between gap-4 text-sm">
                      <span>{activity.text}</span>
                      <span className="shrink-0 text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <p className="text-sm text-muted-foreground">No activity yet. Start tracking!</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "habits" && (
            <div className="space-y-6">
              {/* Add Habit */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold">Add New Habit</h3>
                <div className="mt-4 flex gap-3">
                  <input
                    type="text"
                    placeholder="Habit name..."
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addHabit()}
                    className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    onClick={addHabit}
                    className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Habits List */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {habits.map((habit) => (
                  <div key={habit.id} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{habit.name}</h4>
                        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <Flame className="h-4 w-4 text-orange-500" />
                          {habit.streak} day streak
                        </p>
                      </div>
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className={`mt-4 w-full rounded-lg py-2 text-sm font-medium transition-colors ${
                        habit.completedToday
                          ? "bg-green-500/10 text-green-600"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      {habit.completedToday ? "Completed Today" : "Mark Complete"}
                    </button>
                  </div>
                ))}
                {habits.length === 0 && (
                  <p className="col-span-full text-center text-muted-foreground py-12">
                    No habits yet. Add your first habit above!
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "sleep" && (
            <div className="space-y-6">
              {/* Log Sleep */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold">Log Sleep</h3>
                <div className="mt-4 flex gap-3">
                  <input
                    type="number"
                    placeholder="Hours slept..."
                    min="0"
                    max="24"
                    step="0.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && logSleep()}
                    className="w-32 rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    onClick={logSleep}
                    className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                  >
                    <Plus className="h-4 w-4" />
                    Log
                  </button>
                </div>
              </div>

              {/* Sleep Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-5 text-center">
                  <p className="text-sm text-muted-foreground">Average Sleep</p>
                  <p className="mt-1 text-2xl font-bold">{avgSleep}h</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 text-center">
                  <p className="text-sm text-muted-foreground">Total Entries</p>
                  <p className="mt-1 text-2xl font-bold">{sleepEntries.length}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 text-center">
                  <p className="text-sm text-muted-foreground">Best Night</p>
                  <p className="mt-1 text-2xl font-bold">
                    {sleepEntries.length > 0 ? Math.max(...sleepEntries.map(e => e.hours)) : 0}h
                  </p>
                </div>
              </div>

              {/* Sleep History */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold">Sleep History</h3>
                <div className="mt-4 space-y-3">
                  {sleepEntries.slice(0, 10).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Moon className="h-4 w-4 text-blue-500" />
                        {entry.hours}h
                      </span>
                      <span className="text-muted-foreground">{entry.date}</span>
                    </div>
                  ))}
                  {sleepEntries.length === 0 && (
                    <p className="text-muted-foreground">No sleep entries yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "learning" && (
            <div className="space-y-6">
              {/* Log Learning */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold">Log Learning Session</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  <input
                    type="text"
                    placeholder="What did you learn?"
                    value={learnTopic}
                    onChange={(e) => setLearnTopic(e.target.value)}
                    className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring sm:col-span-2"
                  />
                  <input
                    type="number"
                    placeholder="Minutes"
                    min="1"
                    value={learnMinutes}
                    onChange={(e) => setLearnMinutes(e.target.value)}
                    className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <select
                    value={learnCategory}
                    onChange={(e) => setLearnCategory(e.target.value)}
                    className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option>Programming</option>
                    <option>Design</option>
                    <option>Business</option>
                    <option>Language</option>
                    <option>Other</option>
                  </select>
                </div>
                <button
                  onClick={logLearning}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                >
                  <Plus className="h-4 w-4" />
                  Log Session
                </button>
              </div>

              {/* Learning Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-5 text-center">
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="mt-1 text-2xl font-bold">{totalLearningHours}h</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 text-center">
                  <p className="text-sm text-muted-foreground">Sessions</p>
                  <p className="mt-1 text-2xl font-bold">{learningEntries.length}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 text-center">
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="mt-1 text-2xl font-bold">
                    {(learningEntries
                      .filter(e => {
                        const weekAgo = new Date()
                        weekAgo.setDate(weekAgo.getDate() - 7)
                        return new Date(e.date) > weekAgo
                      })
                      .reduce((sum, e) => sum + e.minutes, 0) / 60).toFixed(1)}h
                  </p>
                </div>
              </div>

              {/* Learning History */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold">Learning History</h3>
                <div className="mt-4 space-y-3">
                  {learningEntries.slice(0, 10).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{entry.topic}</p>
                        <p className="text-muted-foreground">{entry.category} - {entry.minutes}m</p>
                      </div>
                      <span className="text-muted-foreground">{entry.date}</span>
                    </div>
                  ))}
                  {learningEntries.length === 0 && (
                    <p className="text-muted-foreground">No learning entries yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "goals" && (
            <div className="space-y-6">
              {/* Add Goal */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold">Add New Goal</h3>
                <div className="mt-4 flex gap-3">
                  <input
                    type="text"
                    placeholder="Goal name..."
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    type="number"
                    placeholder="Target"
                    min="1"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="w-24 rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    onClick={addGoal}
                    className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Goals List */}
              <div className="grid gap-4 sm:grid-cols-2">
                {goals.map((goal) => {
                  const percentage = Math.round((goal.current / goal.target) * 100)
                  return (
                    <div key={goal.id} className="rounded-xl border border-border bg-card p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{goal.name}</h4>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {goal.current} / {goal.target}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full bg-green-500 transition-all"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <input
                          type="number"
                          value={goal.current}
                          onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value) || 0)}
                          min="0"
                          max={goal.target}
                          className="w-20 rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <span className={`text-lg font-bold ${percentage >= 100 ? "text-green-500" : ""}`}>
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  )
                })}
                {goals.length === 0 && (
                  <p className="col-span-full text-center text-muted-foreground py-12">
                    No goals yet. Set your first goal above!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  )
}
