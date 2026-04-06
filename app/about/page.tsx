import Link from "next/link"
import Image from "next/image"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Github, ExternalLink, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
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
            <Link href="/dashboard" className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900">
              Dashboard
            </Link>
            <Link href="/about" className="text-sm font-semibold text-slate-900">
              About
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800"
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
        {/* Profile Header */}
        <div className="text-center">
          <div className="relative mx-auto h-36 w-36 overflow-hidden rounded-full border-4 border-slate-900">
            <Image
              src="/profile.jpg"
              alt="Asym Alwali"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-slate-900">Asym Alwali</h1>
          <p className="mt-2 text-lg text-slate-500">@Asym_Alwali</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-slate-900 text-white px-4 py-1.5 text-sm font-semibold">19 years old</span>
            <span className="rounded-full bg-slate-900 text-white px-4 py-1.5 text-sm font-semibold">Nigeria 🇳🇬</span>
            <span className="rounded-full bg-slate-900 text-white px-4 py-1.5 text-sm font-semibold">CS Student</span>
            <span className="rounded-full bg-slate-900 text-white px-4 py-1.5 text-sm font-semibold">Builder</span>
          </div>
        </div>

        {/* Introduction Section */}
        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            👋 Introduction
          </h2>
          <div className="mt-6 space-y-4 text-slate-600 leading-relaxed">
            <p>
              I&apos;m Yunusa Mohammed Alwali, but everyone calls me Asym. I&apos;m from Gashua, Yobe State in Northern Nigeria, currently studying at FEDPODAM in Damaturu.
            </p>
            <p>
              I&apos;m obsessed with building tools that solve real problems. Pulse was born out of my own frustration with scattered tracking apps.
            </p>
          </div>
        </section>

        {/* What I'm Building Section */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            🚀 What I&apos;m Building
          </h2>
          <div className="mt-6 space-y-4">
            {/* FracqAI Project */}
            <div className="flex gap-6 p-6 bg-slate-50 rounded-xl">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                F
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">FracqAI</h3>
                <p className="mt-1 text-slate-600">
                  Helping early-stage startups hire fractional growth executives — senior talent, part-time commitment, a fraction of the cost.
                </p>
                <a
                  href="https://x.com/FracqAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                >
                  Follow @FracqAI →
                </a>
              </div>
            </div>

            {/* Pulse Project */}
            <div className="flex gap-6 p-6 bg-slate-50 rounded-xl">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Zap className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Pulse</h3>
                <p className="mt-1 text-slate-600">
                  Your all-in-one life tracking dashboard. Because managing your life shouldn&apos;t require 5 different apps.
                </p>
                <Link
                  href="/dashboard"
                  className="mt-3 inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                >
                  Try Pulse →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Connect Section */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            📱 Connect
          </h2>
          <div className="mt-6 space-y-3">
            <a
              href="https://x.com/Asym_Alwali"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 transition-all hover:bg-slate-100 hover:translate-x-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">
                𝕏
              </div>
              <div>
                <p className="font-bold text-slate-900">X/Twitter</p>
                <p className="text-sm text-slate-500">@Asym_Alwali • Daily builds & learnings</p>
              </div>
            </a>
            <a
              href="https://github.com/Asym-Alwali"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 transition-all hover:bg-slate-100 hover:translate-x-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Github className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">GitHub</p>
                <p className="text-sm text-slate-500">Open source projects & experiments</p>
              </div>
            </a>
            <a
              href="https://fracq.carrd.co"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 transition-all hover:bg-slate-100 hover:translate-x-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
                <ExternalLink className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">FracqAI</p>
                <p className="text-sm text-slate-500">Fractional hiring for startups</p>
              </div>
            </a>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            💡 Philosophy
          </h2>
          <blockquote className="mt-6 border-l-4 border-blue-500 pl-6 italic text-lg text-slate-700">
            &ldquo;I ship things daily — tools, experiments, chaos. Building in public isn&apos;t just a trend, it&apos;s how I learn and grow.&rdquo;
          </blockquote>
          <p className="mt-4 text-slate-600">
            Follow my journey as I build FracqAI, learn CS, and create tools like Pulse to solve real problems.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-slate-400">Built with ❤️ in Nigeria • © 2026 Pulse</p>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
                Why Pulse
              </Link>
              <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
                Launch App
              </Link>
              <a
                href="https://x.com/Asym_Alwali"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                X/Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
