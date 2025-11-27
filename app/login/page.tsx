"use client"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Cpu, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { findUserByCredentials, setActiveUser } from "@/lib/profile-storage"
import db from "@/lib/db"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const prefilledEmail = useMemo(() => searchParams?.get("email") ?? "", [searchParams])
  const [email, setEmail] = useState(prefilledEmail)
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const formRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    if (searchParams?.get("registered")) {
      toast({
        title: "Signup successful",
        description: "Please sign in to continue.",
      })
    }
  }, [searchParams, toast])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isLoading) return
    setIsLoading(true)

    if (!email || !password) {
      toast({ title: "Missing fields", description: "Enter email and password to sign in.", variant: "destructive" })
      setIsLoading(false)
      return
    }

    const user = findUserByCredentials(email, password)

    if (!user) {
      toast({
        title: "Invalid credentials",
        description: "Double-check your email and password and try again.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const { password: _pw, ...profile } = user
    setActiveUser({ ...profile, lastLogin: new Date().toISOString() })

    // For students: reset their personal results/progress on sign-in to provide
    // a fresh start as requested. This clears any stored attempts for this user.
    if (profile.role === "student") {
      try {
        db.clearResultsByEmail(profile.email)
      } catch (err) {
        // swallow — non-critical
      }
    }

    toast({
      title: "Welcome back",
      description: `${profile.name} is signed in as ${profile.role}.`,
    })

    const destination = profile.role === "teacher" ? "/dashboard/teacher" : "/dashboard"
    setTimeout(() => {
      router.push(destination)
      setIsLoading(false)
    }, 400)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-secondary/10 blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Cpu className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">QuizEngine</span>
        </Link>

        <Card className="border-border shadow-2xl shadow-accent/10">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue learning</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email/Password Form */}
            <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="off"
                  />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-sm text-accent hover:text-accent/80 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
                onClick={() => formRef.current?.requestSubmit()}
              >
                {isLoading ? "Signing you in..." : "Sign In"}
              </Button>
            </form>
            <div className="flex items-center gap-2 text-sm text-muted-foreground rounded-md bg-muted/50 p-3">
              <ShieldCheck className="w-4 h-4 text-accent" />
              Secure by design — we only store data locally on your device.
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-accent hover:text-accent/80 font-medium transition-colors">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our{" "}
          <Link href="#" className="text-accent hover:text-accent/80 transition-colors">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-accent hover:text-accent/80 transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          Preparing secure sign-in...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
