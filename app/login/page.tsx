"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Cpu } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import PopupModal from "@/components/PopupModal"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [popup, setPopup] = useState("")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = String(formData.get("email") || "")
    const password = String(formData.get("password") || "")

    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      return
    }

    // fetch profile name
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user!.id)
      .single()

    // show popup
    setPopup(`Welcome back, ${profile?.full_name || "User"}!`)
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <PopupModal
        message={popup}
        visible={popup.length > 0}
        onClose={() => router.push("/dashboard")}
      />
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
                <Input id="password" name="password" type="password" placeholder="Enter your password" required />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Sign In
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
