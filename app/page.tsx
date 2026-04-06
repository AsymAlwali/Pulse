import Link from "next/link"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { ArrowRight, Check, Zap, Moon, BookOpen, Target, BarChart3, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <Zap className="h-5 w-5 text-background" />
            </div>
            <span className="text-xl font-bold">Pulse</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Why Pulse
            </Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                Sign up
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
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              Free forever. Built in public.
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-balance">
              Stop juggling apps.{" "}
              <span className="text-muted-foreground">Start tracking life.</span>
            </h1>
            
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-balance">
              I built Pulse because I was tired of using 5 different apps to track my habits, sleep, 
              learning, and goals. Now it&apos;s all in one place.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-secondary"
              >
                Meet the builder
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-border bg-secondary/30 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mt-4 text-muted-foreground">
              One dashboard to rule them all. Track what matters, skip the noise.
            </p>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Problem/Solution Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">The problem</h2>
              <ul className="mt-8 space-y-6">
                <ProblemItem
                  title="Too many apps"
                  description="Habit tracker here, sleep app there, learning log somewhere else. It's chaos."
                />
                <ProblemItem
                  title="No context"
                  description="Your sleep affects your habits. Your learning affects your goals. But your apps don't talk to each other."
                />
                <ProblemItem
                  title="Premium walls"
                  description="Why pay $10/month for each tracking tool? Building in public should be free."
                />
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8">
              <h2 className="text-2xl font-bold sm:text-3xl">The solution</h2>
              <ul className="mt-8 space-y-4">
                <SolutionItem text="One unified dashboard for everything" />
                <SolutionItem text="See how metrics connect and affect each other" />
                <SolutionItem text="Streak tracking that actually motivates" />
                <SolutionItem text="Activity feed to review your progress" />
                <SolutionItem text="Free and open source. Forever." />
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                Start tracking now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground">
                <span className="text-sm font-bold text-background">A</span>
              </div>
              <div>
                <p className="font-semibold">Built by Asym Alwali</p>
                <p className="text-sm text-muted-foreground">19 - Nigeria - CS Student</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://x.com/Asym_Alwali"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                X/Twitter
              </a>
              <a
                href="https://github.com/Asym-Alwali"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Made with focus and determination - 2026 Pulse
          </p>
        </div>
      </footer>
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

function ProblemItem({ title, description }: { title: string; description: string }) {
  return (
    <li className="flex gap-4">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive text-sm font-medium">
        !
      </span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </li>
  )
}

function SolutionItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <Check className="h-5 w-5 shrink-0 text-green-500" />
      <span className="text-sm">{text}</span>
    </li>
  )
}
