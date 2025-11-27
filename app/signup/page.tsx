"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Cpu } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { StoredUser, getStoredUsers, upsertUser } from "@/lib/profile-storage"
import db from "@/lib/db"

const PROFILE_REDIRECT_DELAY = 800

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  // sensible defaults to reduce validation friction for users
  const [role, setRole] = useState<StoredUser["role"] | "">("student")
  const [branch, setBranch] = useState("cse")
  const [yearClass, setYearClass] = useState("first-year")
  const [section, setSection] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [about, setAbout] = useState("")

  const resetOptionalFields = () => {
    setSection("")
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return

    if (!role || !branch || !yearClass) {
      toast({
        title: "Missing details",
        description: "Please select your role, branch, and class to continue.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    const profile: StoredUser = {
      name: fullName.trim(),
      email: email.trim(),
      password: password.trim(),
      role,
      branch,
      yearClass,
      section: section || undefined,
      about: about.trim() || undefined,
      createdAt: new Date().toISOString(),
    }

    const existingUsers = getStoredUsers()
    const alreadyRegistered = existingUsers.some((user) => user.email.toLowerCase() === profile.email.toLowerCase())
    if (alreadyRegistered) {
      toast({
        title: "Account exists",
        description: "That email is already registered. Try signing in instead.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    upsertUser(profile)
    // keep role-separated storage in sync
    try {
      if (profile.role === "student") db.upsertStudent(profile)
      else if (profile.role === "teacher") db.upsertTeacher(profile)
      else if (profile.role === "admin") db.upsertAdmin(profile)
    } catch (err) {
      // non-critical: continue
    }
    toast({
      title: "Account created",
      description: "You can now sign in with your credentials.",
    })

    setTimeout(() => {
      router.push(`/login?registered=1&email=${encodeURIComponent(profile.email)}`)
    }, PROFILE_REDIRECT_DELAY)
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
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>Join thousands of engineering students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email/Password Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={role}
                  onValueChange={(value: StoredUser["role"]) => {
                    setRole(value)
                    resetOptionalFields()
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Branch</Label>
                <Select value={branch} onValueChange={setBranch}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cse">CSE</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="ece">ECE</SelectItem>
                    <SelectItem value="mechanical">Mechanical</SelectItem>
                    <SelectItem value="civil">Civil</SelectItem>
                    <SelectItem value="ai-ml">AI/ML</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Class</Label>
                <Select
                  value={yearClass}
                  onValueChange={(value) => {
                    setYearClass(value)
                    resetOptionalFields()
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first-year">First Year</SelectItem>
                    <SelectItem value="second-year">Second Year</SelectItem>
                    <SelectItem value="third-year">Third Year</SelectItem>
                    <SelectItem value="btech">BTech</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {yearClass === "second-year" && (
                <div className="space-y-2">
                  <Label>Section (Second Year)</Label>
                  <Select value={section} onValueChange={setSection}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sy-a">SY-A</SelectItem>
                      <SelectItem value="sy-b">SY-B</SelectItem>
                      <SelectItem value="sy-c">SY-C</SelectItem>
                      <SelectItem value="sy-ai-ml">SY-AI/ML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {yearClass === "third-year" && (
                <div className="space-y-2">
                  <Label>Section (Third Year)</Label>
                  <Select value={section} onValueChange={setSection}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ty-a">TY-A</SelectItem>
                      <SelectItem value="ty-b">TY-B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="about">Personal Bio</Label>
                <Textarea
                  id="about"
                  placeholder="Share anything you'd like classmates or faculty to know."
                  value={about}
                  onChange={(event) => setAbout(event.target.value)}
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Creating profile..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:text-accent/80 font-medium transition-colors">
                Sign in
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
