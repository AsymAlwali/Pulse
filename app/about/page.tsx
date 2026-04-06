import Link from "next/link"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Zap, Github, Twitter, ExternalLink, ArrowLeft } from "lucide-react"

export default function AboutPage() {
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
            <Link href="/about" className="text-sm font-medium text-foreground">
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

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Profile Header */}
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-foreground text-4xl font-bold text-background">
            A
          </div>
          <h1 className="mt-6 text-3xl font-bold">Asym Alwali</h1>
          <p className="mt-2 text-muted-foreground">@Asym_Alwali</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">19 years old</span>
            <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">Nigeria</span>
            <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">CS Student</span>
          </div>
        </div>

        {/* Story Section */}
        <section className="mt-16 rounded-2xl border border-border bg-card p-8">
          <h2 className="text-2xl font-bold">The Story Behind Pulse</h2>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              I built Pulse because I was frustrated. Like many people trying to improve themselves, 
              I had a habit tracker app, a sleep tracker, a learning log, and a goal tracker. 
              Five different apps, five different subscriptions, and zero connection between them.
            </p>
            <p>
              How does my sleep affect my habit completion? Does learning more help me reach my goals faster? 
              I had no idea, because my data was scattered everywhere.
            </p>
            <p>
              So I decided to build Pulse - one unified dashboard where I can track everything that matters. 
              No premium walls, no subscription fees. Just a clean, simple tool that helps me see the full 
              picture of my progress.
            </p>
          </div>
          <blockquote className="mt-6 border-l-4 border-foreground pl-4 italic">
            &ldquo;One dashboard to rule them all.&rdquo;
          </blockquote>
        </section>

        {/* Other Projects */}
        <section className="mt-8 rounded-2xl border border-border bg-card p-8">
          <h2 className="text-2xl font-bold">Other Projects</h2>
          <div className="mt-6 space-y-4">
            <a
              href="https://fracq.carrd.co"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl bg-secondary/50 p-4 transition-colors hover:bg-secondary"
            >
              <div>
                <h3 className="font-semibold">FracqAI</h3>
                <p className="text-sm text-muted-foreground">AI-powered productivity tool</p>
              </div>
              <ExternalLink className="h-5 w-5 text-muted-foreground" />
            </a>
          </div>
        </section>

        {/* Connect */}
        <section className="mt-8 rounded-2xl border border-border bg-card p-8">
          <h2 className="text-2xl font-bold">Connect</h2>
          <div className="mt-6 space-y-3">
            <a
              href="https://x.com/Asym_Alwali"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl bg-secondary/50 p-4 transition-colors hover:bg-secondary"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground">
                <Twitter className="h-5 w-5 text-background" />
              </div>
              <div>
                <p className="font-semibold">X / Twitter</p>
                <p className="text-sm text-muted-foreground">Follow for updates and thoughts</p>
              </div>
            </a>
            <a
              href="https://github.com/Asym-Alwali"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl bg-secondary/50 p-4 transition-colors hover:bg-secondary"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground">
                <Github className="h-5 w-5 text-background" />
              </div>
              <div>
                <p className="font-semibold">GitHub</p>
                <p className="text-sm text-muted-foreground">Check out my code</p>
              </div>
            </a>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">Ready to track your progress?</p>
          <Link
            href="/sign-up"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Get started with Pulse
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30 py-8 mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Made with focus and determination - 2026 Pulse
          </p>
        </div>
      </footer>
    </div>
  )
}
