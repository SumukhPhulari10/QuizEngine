"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Cpu, Eye, EyeOff } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const redirectByRole = async (userId: string) => {
    let role: string | null = null

    // Try primary profiles table first
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle()

    if (profileError) {
      console.error("Error fetching profile role:", profileError)
    }

    if (profile?.role) {
      role = profile.role
    }

    // Fallback to user_branches if no role found in profiles
    if (!role) {
      const { data: userBranch, error: userBranchError } = await supabase
        .from("user_branches")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle()

      if (userBranchError) {
        console.error("Error fetching branch role:", userBranchError)
      }

      if (userBranch?.role) {
        role = userBranch.role
      }
    }

    if (role === "admin") {
      router.push("/dashboard/admin")
      return
    }
    if (role === "teacher") {
      router.push("/dashboard/teacher")
      return
    }
    if (role === "student") {
      router.push("/dashboard/student")
      return
    }

    // Default fallback
    router.push("/dashboard")
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const email = (formData.get("email") as string) ?? ""
      const password = (formData.get("password") as string) ?? ""

      console.log("Attempting login with email:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("Login response:", { data, error })

      if (error) {
        console.error("Login error:", error)
        setError(error.message)
        setIsLoading(false)
        return
      }

      if (!data.user) {
        console.error("No user in response")
        setError("Login failed - no user returned")
        setIsLoading(false)
        return
      }

      // Wait for session to be fully established
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Refresh the session to ensure it's available to middleware
      await supabase.auth.refreshSession()

      console.log("Login success, redirecting based on role...")
      await redirectByRole(data.user.id)
    } catch (err: any) {
      console.error("Login exception:", err)
      setError(err.message || "Network error. Please check your connection and try again.")
      setIsLoading(false)
      return
    } finally {
      setIsLoading(false)
    }
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

        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue learning</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Email/Password Form */}
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="name@example.com" required />
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
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
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
