import Link from "next/link"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Check, Zap, Moon, BookOpen, Target, BarChart3, Users, Smartphone, RefreshCw, DollarSign, Link2, Globe, Rocket } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/profile.jpg"
              alt="Asym Alwali"
              className="h-10 w-10 rounded-full border-2 border-primary object-cover"
            />
            <span className="text-xl font-bold">Pulse</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-semibold text-foreground transition-colors hover:text-primary">
              Why
            </Link>
            <Link href="/dashboard" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/about" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
              About
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                Dashboard
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 py-16 sm:py-24 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Tweet Card */}
          <div className="mx-auto mb-12 max-w-xl rounded-2xl bg-white p-6 text-foreground shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="/profile.jpg"
                alt="Asym Alwali"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-1 font-bold text-slate-900">
                  Asym Alwali
                  <span className="text-blue-500">&#10003;</span>
                </div>
                <div className="text-sm text-slate-500">@Asym_Alwali</div>
              </div>
            </div>
            <p className="text-slate-800 text-lg mb-3">
              Building Pulse because I was frustrated with scattered tracking tools. One dashboard to rule them all. 🚀
            </p>
            <a
              href="https://x.com/i/status/2041181255094472805"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 font-semibold hover:underline"
            >
              View on X →
            </a>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance">
              Stop Juggling Apps.
              <br />
              <span className="text-blue-400">Start Tracking Life.</span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 text-balance">
              I built Pulse because I was tired of using 5 different apps to track my habits, sleep, learning, and goals. Now it&apos;s all in one place.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-900 px-8 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                Launch Dashboard
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-white bg-transparent px-8 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Meet the Builder
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl mb-12">
            😤 The Problem
          </h2>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <ProblemCard
              icon={<Smartphone className="h-8 w-8" />}
              title="Too Many Apps"
              description="Habit tracker here, sleep app there, learning log somewhere else. It's chaos."
            />
            <ProblemCard
              icon={<RefreshCw className="h-8 w-8" />}
              title="No Context"
              description="Your sleep affects your habits. Your learning affects your goals. But your apps don't talk to each other."
            />
            <ProblemCard
              icon={<DollarSign className="h-8 w-8" />}
              title="Premium Walls"
              description="Why pay $10/month for each tracking tool? Building in public should be free."
            />
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl mb-12">
            ✨ The Solution
          </h2>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <SolutionCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="One Dashboard"
              description="Habits, sleep, learning, goals — all visible at a glance."
            />
            <SolutionCard
              icon={<Link2 className="h-6 w-6" />}
              title="Connected Data"
              description="See how your sleep impacts your habit completion. Track correlations that matter."
            />
            <SolutionCard
              icon={<Globe className="h-6 w-6" />}
              title="Share & Collaborate"
              description="Built with Supabase. Share your progress, compete with friends, stay accountable."
            />
            <SolutionCard
              icon={<Rocket className="h-6 w-6" />}
              title="Free Forever"
              description="Open source. No premium tiers. No BS. Just tracking that works."
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-border bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need
            </h2>
            <p className="mt-4 text-muted-foreground">
              One dashboard to rule them all. Track what matters, skip the noise.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Check className="h-5 w-5" />}
              title="Habit Tracking"
              description="Build streaks, track completion, and see your consistency grow over time."
            />
            <FeatureCard
              icon={<Moon className="h-5 w-5" />}
              title="Sleep Logging"
              description="Log your sleep hours and understand how rest affects your performance."
            />
            <FeatureCard
              icon={<BookOpen className="h-5 w-5" />}
              title="Learning Log"
              description="Track what you learn, categorize topics, and measure your growth."
            />
            <FeatureCard
              icon={<Target className="h-5 w-5" />}
              title="Goal Progress"
              description="Set goals, track progress, and celebrate when you hit milestones."
            />
            <FeatureCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Activity Feed"
              description="See all your actions in one timeline. Never lose track of progress."
            />
            <FeatureCard
              icon={<Users className="h-5 w-5" />}
              title="Built for You"
              description="Open source, free forever. No premium walls, no BS."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-4">
              <img
                src="/profile.jpg"
                alt="Asym Alwali"
                className="h-12 w-12 rounded-full border-2 border-blue-500 object-cover"
              />
              <div>
                <p className="font-bold">Built by Asym Alwali</p>
                <p className="text-sm text-slate-400">
                  19 • Nigeria • CS Student • Building{" "}
                  <a href="https://fracq.carrd.co" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    FracqAI
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://x.com/Asym_Alwali"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                X/Twitter
              </a>
              <a
                href="https://github.com/Asym-Alwali"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                GitHub
              </a>
              <Link
                href="/dashboard"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Launch App
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-700 text-center">
            <p className="text-sm text-slate-500">
              Made with ☕ and chaos • © 2026 Pulse
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ProblemCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-8 text-center transition-transform hover:-translate-y-1">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center text-slate-600">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function SolutionCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl bg-slate-900 p-8 text-white transition-transform hover:-translate-y-1">
      <div className="mb-4 flex items-center gap-3">
        {icon}
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className="text-slate-300">{description}</p>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group rounded-xl border border-border bg-card p-6 transition-colors hover:bg-secondary/50">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
