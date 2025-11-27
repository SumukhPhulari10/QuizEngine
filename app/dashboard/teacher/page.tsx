"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Cpu, LogOut, Users } from "lucide-react"
import { ActiveUser, clearActiveUser, getActiveUser } from "@/lib/profile-storage"

export default function TeacherDashboardPage() {
  const router = useRouter()
  const [user] = useState<ActiveUser | null>(() => getActiveUser())

  useEffect(() => {
    if (!user || user.role !== "teacher") {
      router.replace("/login")
    }
  }, [router, user])

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((segment) => segment[0])
        .join("")
        .toUpperCase()
    : "QE"

  const handleLogout = () => {
    clearActiveUser()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 transition-colors hover:text-accent">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold">QuizEngine</span>
          </Link>
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                {user.name}
              </div>
            )}
            <Button variant="ghost" asChild className="hover:cursor-pointer">
              <Link href="/dashboard">Learner View</Link>
            </Button>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">Faculty Workspace</p>
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="text-muted-foreground">
              {user ? `Welcome, ${user.name}.` : "Overview and tools for managing students and quizzes."}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/dashboard/teacher/create-quiz">Create Quiz</Link>
            </Button>
            <Button variant="secondary">Assign Task</Button>
          </div>
        </div>

        {user && (
          <Card className="border-accent/30">
            <CardContent className="flex flex-wrap items-center gap-4 py-6">
              <Avatar className="h-14 w-14 border border-accent/60">
                <AvatarFallback className="bg-accent text-accent-foreground text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-[220px]">
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex gap-2 text-sm text-muted-foreground">
                <span className="rounded-full bg-secondary/30 px-3 py-1 capitalize">{user.role}</span>
                {user.branch && <span className="rounded-full bg-secondary/30 px-3 py-1">{user.branch}</span>}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardHeader>
              <CardTitle>Student Progress</CardTitle>
              <CardDescription>Track students' marks and topic mastery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Overall Average</span>
                <span className="font-medium">--%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Quizzes Completed</span>
                <span className="font-medium">--</span>
              </div>
              <Button className="w-full" variant="outline">
                View Students
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardHeader>
              <CardTitle>Quiz Scores</CardTitle>
              <CardDescription>Recent quiz performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">No recent attempts</div>
              <Button className="w-full" variant="outline">
                See Reports
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Badges and milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">No achievements yet</div>
              <Button className="w-full" variant="outline">
                Manage
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Assign Tasks</CardTitle>
              <CardDescription>Create and assign tasks to classes/sections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input id="task-title" placeholder="E.g., Arrays Practice Set" className="focus-visible:ring-accent" />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">Assign to Class</Button>
                  <Button className="flex-1" variant="secondary">
                    Assign to Section
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quiz Management</CardTitle>
              <CardDescription>Create, edit, and schedule quizzes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button className="flex-1">New Quiz</Button>
                <Button className="flex-1" variant="secondary">
                  Question Bank
                </Button>
              </div>
              <Button variant="outline" className="w-full">
                Schedule Exam
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
