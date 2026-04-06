import { SignIn } from "@clerk/nextjs"
import Link from "next/link"
import { Zap } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden w-1/2 flex-col justify-between bg-foreground p-12 lg:flex">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
            <Zap className="h-6 w-6 text-foreground" />
          </div>
          <span className="text-2xl font-bold text-background">Pulse</span>
        </Link>

        <div className="max-w-md">
          <blockquote className="text-2xl font-medium leading-relaxed text-background/90">
            &ldquo;Building Pulse because I was frustrated with scattered tracking tools. 
            One dashboard to rule them all.&rdquo;
          </blockquote>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-lg font-bold text-foreground">
              A
            </div>
            <div>
              <p className="font-semibold text-background">Asym Alwali</p>
              <p className="text-sm text-background/60">Creator of Pulse</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-background/50">
          Track your life, own your progress.
        </p>
      </div>

      {/* Right Panel - Sign In Form */}
      <div className="flex w-full flex-col items-center justify-center px-4 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center justify-center lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
                <Zap className="h-5 w-5 text-background" />
              </div>
              <span className="text-xl font-bold">Pulse</span>
            </Link>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to continue tracking your progress
            </p>
          </div>

          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none p-0 bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "border border-border bg-background hover:bg-secondary transition-colors",
                socialButtonsBlockButtonText: "text-foreground font-medium",
                dividerLine: "bg-border",
                dividerText: "text-muted-foreground text-sm",
                formFieldLabel: "text-foreground font-medium",
                formFieldInput:
                  "border-border bg-background focus:border-ring focus:ring-1 focus:ring-ring",
                formButtonPrimary:
                  "bg-foreground text-background hover:bg-foreground/90 shadow-none",
                footerActionLink: "text-foreground font-medium hover:text-foreground/80",
                identityPreviewEditButton: "text-foreground",
                formFieldAction: "text-foreground font-medium",
                otpCodeFieldInput: "border-border",
              },
            }}
            redirectUrl="/dashboard"
            signUpUrl="/sign-up"
          />

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-medium text-foreground hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
