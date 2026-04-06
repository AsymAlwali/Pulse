"use client"

import { useState } from "react"
import { UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link"
import Image from "next/image"
import {
  Check,
  Moon,
  BookOpen,
  Target,
  Plus,
  Trash2,
  Flame,
  Clock,
  LayoutDashboard,
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
    { id: 1, topic: "TypeScript generics", minutes: 45, category: "Coding", date: "2026-04-06" },
    { id: 2, topic: "System design basics", minutes: 60, category: "Coding", date: "2026-04-05" },
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
  const [learnCategory, setLearnCategory] = useState("Coding")
  const [goalName, setGoalName] = useState("")
  const [goalTarget, setGoalTarget] = useState("")

  // Calculate streak
  const currentStreak = habits.length > 0 
    ? Math.max(...habits.map(h => h.streak))
    : 0

  // Calculate averages
  const avgSleep = sleepEntries.length > 0
    ? (sleepEntries.reduce((sum, e) => sum + e.hours, 0) / sleepEntries.length).toFixed(1)
    : "--"

  const totalLearningHours = (learningEntries.reduce((sum, e) => sum + e.minutes, 0) / 60).toFixed(1)
  
  const todayLearning = learningEntries
    .filter(e => e.date === new Date().toISOString().split("T")[0])
    .reduce((sum, e) => sum + e.minutes, 0)

  // Handlers
  const addActivity = (text: string) => {
    setActivities(prev => [
      { id: Date.now(), text, timestamp: new Date().toISOString() },
      ...prev.slice(0, 49),
    ])
  }

  const toggleHabit = (id: number) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id === id) {
          const newCompleted = !h.completedToday
          const newStreak = newCompleted ? h.streak + 1 : Math.max(0, h.streak - 1)
          if (newCompleted) {
            addActivity(`Completed: ${h.name} (${newStreak} day streak)`)
          } else {
            addActivity(`Undone: ${h.name}`)
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
    addActivity(`Added habit: ${newHabitName}`)
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
    addActivity(`Logged ${hours}h of sleep`)
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
  const todayProgress = habits.length > 0 ? Math.round((completedHabitsToday / habits.length) * 100) : 0
  const avgGoalProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, g) => sum + (g.current / g.target) * 100, 0) / goals.length)
    : 0

  const navItems = [
    { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
    { id: "habits" as const, label: "Habits", icon: Check },
    { id: "sleep" as const, label: "Sleep", icon: Moon },
    { id: "learning" as const, label: "Learning", icon: BookOpen },
    { id: "goals" as const, label: "Goals", icon: Target },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-blue-500">
              <Image
                src="/profile.jpg"
                alt="Asym Alwali"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold text-slate-900">Pulse</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900">
              Why
            </Link>
            <Link href="/dashboard" className="text-sm font-semibold text-slate-900">
              Dashboard
            </Link>
            <Link href="/about" className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900">
              About
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-600 sm:block">
              {user?.firstName || "Welcome"}
            </span>
            <UserButton />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 border-r border-slate-200 bg-white p-6 lg:block overflow-y-auto">
          {/* Quick Stats */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">Streak</span>
                <span className="font-bold text-slate-900">{currentStreak} days</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">Today&apos;s Progress</span>
                <span className="font-bold text-slate-900">{todayProgress}%</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Navigation</h3>
            <div className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                    activeTab === item.id
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white p-2 lg:hidden">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "text-slate-900"
                    : "text-slate-500"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 pb-24 lg:pb-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Today&apos;s Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon="check" label="Habits Done" value={`${completedHabitsToday}/${habits.length}`} />
                <StatCard icon="moon" label="Last Sleep" value={sleepEntries.length > 0 ? `${sleepEntries[0].hours}h` : "--h"} />
                <StatCard icon="book" label="Learning Today" value={`${todayLearning}m`} />
                <StatCard icon="target" label="Goal Progress" value={`${avgGoalProgress}%`} />
              </div>

              {/* Recent Activity */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="p-6">
                  <h3 className="flex items-center gap-2 font-semibold text-slate-900">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </h3>
                  <div className="mt-4 divide-y divide-slate-100">
                    {activities.slice(0, 10).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between py-3">
                        <span className="text-sm text-slate-700">{activity.text}</span>
                        <span className="text-xs text-slate-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {activities.length === 0 && (
                      <p className="py-6 text-center text-sm text-slate-500">No activity yet. Start tracking!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Habits Tab */}
          {activeTab === "habits" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Daily Habits</h2>
              </div>

              {/* Add Habit */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter habit name..."
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addHabit()}
                    className="flex-1 rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={addHabit}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:-translate-y-0.5"
                  >
                    <Plus className="h-4 w-4" />
                    Add Habit
                  </button>
                </div>
              </div>

              {/* Habits List */}
              <div className="space-y-3">
                {habits.map((habit) => (
                  <div key={habit.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div>
                      <h4 className="font-semibold text-slate-900">{habit.name}</h4>
                      <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                        <Flame className="h-4 w-4 text-orange-500" />
                        {habit.streak} day streak
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={habit.completedToday}
                        onChange={() => toggleHabit(habit.id)}
                        className="h-6 w-6 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                      />
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {habits.length === 0 && (
                  <p className="py-12 text-center text-slate-500">No habits yet. Add your first habit!</p>
                )}
              </div>
            </div>
          )}

          {/* Sleep Tab */}
          {activeTab === "sleep" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Sleep Tracker</h2>

              {/* Log Sleep */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Hours Slept Last Night</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="7.5"
                    min="0"
                    max="24"
                    step="0.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && logSleep()}
                    className="w-32 rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={logSleep}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:-translate-y-0.5"
                  >
                    Log Sleep
                  </button>
                </div>
              </div>

              {/* Sleep Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                  <h4 className="text-sm font-medium text-slate-500">Average Sleep</h4>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{avgSleep}h</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                  <h4 className="text-sm font-medium text-slate-500">Total Entries</h4>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{sleepEntries.length}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                  <h4 className="text-sm font-medium text-slate-500">Best Night</h4>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {sleepEntries.length > 0 ? Math.max(...sleepEntries.map(e => e.hours)) : "--"}h
                  </p>
                </div>
              </div>

              {/* Sleep History */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="p-6">
                  <h3 className="font-semibold text-slate-900">Recent Logs</h3>
                  <div className="mt-4 divide-y divide-slate-100">
                    {sleepEntries.slice(0, 10).map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between py-3">
                        <span className="flex items-center gap-2 text-sm text-slate-700">
                          <Moon className="h-4 w-4 text-blue-500" />
                          {entry.hours}h
                        </span>
                        <span className="text-sm text-slate-500">{entry.date}</span>
                      </div>
                    ))}
                    {sleepEntries.length === 0 && (
                      <p className="py-6 text-center text-sm text-slate-500">No sleep logs yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Learning Tab */}
          {activeTab === "learning" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Learning Log</h2>

              {/* Log Learning */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <input
                  type="text"
                  placeholder="What did you learn? (e.g., JavaScript Promises)"
                  value={learnTopic}
                  onChange={(e) => setLearnTopic(e.target.value)}
                  className="w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-blue-500 mb-4"
                />
                <div className="flex flex-wrap gap-3">
                  <input
                    type="number"
                    placeholder="Minutes spent"
                    min="1"
                    value={learnMinutes}
                    onChange={(e) => setLearnMinutes(e.target.value)}
                    className="w-32 rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <select
                    value={learnCategory}
                    onChange={(e) => setLearnCategory(e.target.value)}
                    className="rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option>Coding</option>
                    <option>Design</option>
                    <option>Business</option>
                    <option>Other</option>
                  </select>
                  <button
                    onClick={logLearning}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:-translate-y-0.5"
                  >
                    Log Learning
                  </button>
                </div>
              </div>

              {/* Learning Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                  <h4 className="text-sm font-medium text-slate-500">Total Hours</h4>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{totalLearningHours}h</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                  <h4 className="text-sm font-medium text-slate-500">Entries</h4>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{learningEntries.length}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                  <h4 className="text-sm font-medium text-slate-500">This Week</h4>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
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
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="p-6">
                  <h3 className="font-semibold text-slate-900">Recent Learning</h3>
                  <div className="mt-4 divide-y divide-slate-100">
                    {learningEntries.slice(0, 10).map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium text-slate-900">{entry.topic}</p>
                          <p className="text-sm text-slate-500">{entry.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-900">{entry.minutes}m</p>
                          <p className="text-sm text-slate-500">{entry.date}</p>
                        </div>
                      </div>
                    ))}
                    {learningEntries.length === 0 && (
                      <p className="py-6 text-center text-sm text-slate-500">No learning logs yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === "goals" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Active Goals</h2>

              {/* Add Goal */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    placeholder="Goal name (e.g., Learn React)"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    className="flex-1 min-w-48 rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Target (e.g., 100)"
                    min="1"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="w-32 rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={addGoal}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:-translate-y-0.5"
                  >
                    Add Goal
                  </button>
                </div>
              </div>

              {/* Goals List */}
              <div className="grid gap-4 sm:grid-cols-2">
                {goals.map((goal) => {
                  const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100))
                  return (
                    <div key={goal.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900">{goal.name}</h3>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="rounded-lg bg-red-500 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="h-3 overflow-hidden rounded-full bg-slate-200 mb-4">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={goal.current}
                            onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value) || 0)}
                            min="0"
                            max={goal.target}
                            className="w-20 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                          />
                          <span className="text-slate-500">/ {goal.target}</span>
                        </div>
                        <span className={`text-2xl font-bold ${percentage >= 100 ? "text-green-500" : "text-blue-500"}`}>
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  )
                })}
                {goals.length === 0 && (
                  <p className="col-span-full py-12 text-center text-slate-500">No goals yet. Add your first goal!</p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: "check" | "moon" | "book" | "target"
  label: string
  value: string
}) {
  const icons = {
    check: <Check className="h-6 w-6" />,
    moon: <Moon className="h-6 w-6" />,
    book: <BookOpen className="h-6 w-6" />,
    target: <Target className="h-6 w-6" />,
  }
  
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-slate-600">
        {icons[icon]}
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-500">{label}</h3>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  )
}
