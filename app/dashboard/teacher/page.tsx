"use client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Cpu } from "lucide-react"

export default function TeacherDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold">QuizEngine</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Logout</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
            <p className="text-muted-foreground">Overview and tools for managing students and quizzes.</p>
          </div>
          <div className="flex gap-2">
            <Button>Create Quiz</Button>
            <Button variant="secondary">Assign Task</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
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
              <Button className="w-full" variant="outline">View Students</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quiz Scores</CardTitle>
              <CardDescription>Recent quiz performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">No recent attempts</div>
              <Button className="w-full" variant="outline">See Reports</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Badges and milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">No achievements yet</div>
              <Button className="w-full" variant="outline">Manage</Button>
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
                  <Input id="task-title" placeholder="E.g., Arrays Practice Set" />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">Assign to Class</Button>
                  <Button className="flex-1" variant="secondary">Assign to Section</Button>
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
                <Button className="flex-1" variant="secondary">Question Bank</Button>
              </div>
              <Button variant="outline" className="w-full">Schedule Exam</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
