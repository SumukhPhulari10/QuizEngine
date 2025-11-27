"use client"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Target, LogOut } from "lucide-react"
import { ActiveUser, clearActiveUser, getActiveUser } from "@/lib/profile-storage"
import db from "@/lib/db"

export default function StudentDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<ActiveUser | null>(() => getActiveUser())
  const [quizzes] = useState(() => db.getQuizzes())
  const results = useMemo(() => (user ? db.getResultsByEmail(user.email) : []), [user])
  const [showOtherBranches, setShowOtherBranches] = useState(false)
  // subjects are derived from quizzes / user
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.replace("/login")
    }
  }, [router, user])

  const subjects = useMemo(() => {
    const all = db.getQuizzes()
    if (user) {
      return Array.from(new Set(all.filter((q) => q.branch === user.branch).map((q) => q.category ?? q.title)))
    }
    return []
  }, [user])

  const quizzesForSelectedSubject = selectedSubject
    ? quizzes.filter((q) => (q.category ?? q.title) === selectedSubject && q.branch === user?.branch)
    : []

  // results is derived using useMemo above

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
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
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold">QuizEngine</span>
          </Link>
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1 text-sm text-muted-foreground">
                {user.name}
              </div>
            )}
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
            <p className="text-sm text-muted-foreground uppercase tracking-wide">Student Workspace</p>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-muted-foreground">{user ? `Welcome, ${user.name}.` : "Take quizzes and track your progress."}</p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="text-sm text-muted-foreground">Showing:</div>
            <div className="rounded-full bg-muted/40 px-3 py-1 text-sm text-foreground">{user?.branch?.toUpperCase() ?? "ALL"}</div>
            <Button size="sm" variant="outline" onClick={() => setShowOtherBranches((v) => !v)}>
              {showOtherBranches ? "Show My Branch" : "Try Other Branches"}
            </Button>
            <Button asChild>
              <Link href="/quiz">Browse Quizzes</Link>
            </Button>
          </div>
        </div>

        {user && (
          <Card>
            <CardContent className="flex items-center gap-4 py-6">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Subjects</CardTitle>
                <CardDescription>Topics available for your branch</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                {subjects.length === 0 && <div className="text-sm text-muted-foreground">No subjects available for your branch yet.</div>}
                {subjects.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSubject((prev) => (prev === s ? null : s))}
                    className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                      selectedSubject === s ? "bg-accent text-accent-foreground border-accent" : "bg-muted/30 border-border/60"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
          {selectedSubject && (
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{selectedSubject}</CardTitle>
                  <CardDescription>Subject overview and quizzes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    {quizzesForSelectedSubject.length > 0 ? (
                      quizzesForSelectedSubject[0].description ?? `${selectedSubject} quizzes` 
                    ) : (
                      "No quizzes created yet for this subject."
                    )}
                  </div>

                  <div className="grid gap-3">
                    {quizzesForSelectedSubject.map((q) => (
                      <div key={q.id} className="flex items-center justify-between border rounded-md p-3">
                        <div>
                          <p className="font-medium">{q.title}</p>
                          <p className="text-xs text-muted-foreground">{q.category} • {q.branch}</p>
                        </div>
                        <div>
                          <Button size="sm" asChild>
                            <Link href={`/quiz/${q.branch ?? q.category ?? "general"}/${q.id}`}>Take Test</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedSubject(null)}>
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Available Quizzes</CardTitle>
              <CardDescription>Choose a quiz to begin. Only your attempts are visible to you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quizzes.length === 0 && <div className="text-sm text-muted-foreground">No quizzes available yet.</div>}
              {quizzes
                .filter((q) => {
                  if (showOtherBranches) return true
                  return user ? q.branch === user.branch : true
                })
                .map((q) => (
                  <div key={q.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{q.title}</p>
                      <p className="text-xs text-muted-foreground">{q.category} • {q.branch}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" asChild>
                        <Link href={`/quiz/${q.branch ?? q.category ?? "general"}/${q.id}`}>Take Test</Link>
                      </Button>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Results</CardTitle>
              <CardDescription>Your quiz attempts and scores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.length === 0 && <div className="text-sm text-muted-foreground">No attempts yet.</div>}
              {results.map((r) => (
                <div key={r.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{r.quizTitle ?? r.quizId}</p>
                    <p className="text-xs text-muted-foreground">{new Date(r.takenAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-accent">{r.score}/{r.total}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/history">View Full History</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
