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
import { supabase } from "@/lib/supabase/client"
import PopupModal from "@/components/PopupModal"

export default function SignupPage() {
  const router = useRouter()
  const [role, setRole] = useState("")
  const [branch, setBranch] = useState("")
  const [yearClass, setYearClass] = useState("")
  const [section, setSection] = useState("")
  const [error, setError] = useState("")
  const [popup, setPopup] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const email = String(formData.get("email") || "")
      const password = String(formData.get("password") || "")
      const fullName = (e.currentTarget as HTMLFormElement)
        .querySelector<HTMLInputElement>("#name")?.value || ""

      // Validate required fields
      if (!role) {
        setError("Please select a role")
        setLoading(false)
        return
      }

      // For non-admin roles, validate branch and class
      if (role !== "admin") {
        if (!branch || !yearClass) {
          setError("Please fill in all required fields (Role, Branch, and Class)")
          setLoading(false)
          return
        }

        // Validate section for second and third year
        if ((yearClass === "second-year" || yearClass === "third-year") && !section) {
          setError("Please select a section")
          setLoading(false)
          return
        }
      }

      if (role == "admin") {
        router.push("/dashboard/admin")
      }
      if (role == "teacher") {
        router.push("/dashboard/teacher")
      }
      if (role == "student") {
        router.push("/dashboard/student")
      }

      const { data: { user }, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signupError) {
        setError(signupError.message)
        setLoading(false)
        return
      }

      if (!user) {
        setError("Signup failed. Please try again.")
        setLoading(false)
        return
      }

      // Try to get branch_id from branches table (if it exists)
      // If branches table doesn't exist, we'll store branch name directly
      let branchId: string | null = null
      let branchName: string | null = null
      
      if (role !== "admin" && branch) {
        // Try to get branch_id from branches table
        const { data: branchData, error: branchError } = await supabase
          .from("branches")
          .select("id")
          .eq("name", branch)
          .single()

        if (!branchError && branchData) {
          branchId = branchData.id
        } else {
          // Branches table doesn't exist or branch not found - store name directly
          branchName = branch
          console.log("Branches table not found or branch not found, storing branch name directly")
        }
      }

      // Create profile in Supabase profiles table with all user info
      const profileData: any = {
        id: user.id,
        full_name: fullName,
        email: email,
        role: role,
        year_class: role !== "admin" ? yearClass : null,
        section: role !== "admin" && (yearClass === "second-year" || yearClass === "third-year") ? section : null,
      }

      // Add branch_id if available, otherwise add branch name
      if (branchId) {
        profileData.branch_id = branchId
      } else if (branchName) {
        profileData.branch = branchName
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .insert(profileData)

      if (profileError) {
        console.error("Profile creation error:", profileError)
        setError(profileError.message || "Failed to create profile. Please try again.")
        setLoading(false)
        return
      }

      setLoading(false)
      setPopup(true)
    } catch (err) {
      console.error("Signup error:", err)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <PopupModal
        message="Account created successfully! Check your email to verify."
        visible={popup}
        onClose={() => router.push("/login")}
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
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>Join thousands of engineering students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email/Password Form */}
            <form className="space-y-4" onSubmit={handleSignup}>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="name@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Create a password" required />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={(value) => {
                  setRole(value)
                  if (value === "admin") {
                    setBranch("")
                    setYearClass("")
                    setSection("")
                  }
                }}>
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

              {role !== "admin" && (
                <>
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
                    <Select value={yearClass} onValueChange={(v) => { setYearClass(v); setSection("") }}>
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
                </>
              )}

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
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
