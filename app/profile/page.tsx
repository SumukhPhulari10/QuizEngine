"use client"
import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Clock, User as UserIcon } from "lucide-react"
import { getActiveUser, clearActiveUser, upsertUser, StoredUser, setActiveUser } from "@/lib/profile-storage"
import db from "@/lib/db"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

function ProfileEditor({ viewingUser, canEditViewing, onSave }: { viewingUser: StoredUser | null | undefined; canEditViewing: boolean; onSave: (u: StoredUser) => void }) {
  const [name, setName] = useState(() => viewingUser?.name || "")
  const [about, setAbout] = useState(() => viewingUser?.about || "")
  const [branch, setBranch] = useState(() => viewingUser?.branch || "")
  const [yearClass, setYearClass] = useState(() => viewingUser?.yearClass || "")

  useEffect(() => {
    // no setState here; component remounts when viewingUser changes via key in parent
  }, [])

  return (
    <div className="mt-4 grid grid-cols-1 gap-3">
      <div>
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} disabled={!canEditViewing} />
      </div>
      <div>
        <Label>About</Label>
        <Input value={about} onChange={(e) => setAbout(e.target.value)} disabled={!canEditViewing} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Branch</Label>
          <Input value={branch} onChange={(e) => setBranch(e.target.value)} disabled={!canEditViewing} />
        </div>
        <div>
          <Label>Class</Label>
          <Input value={yearClass} onChange={(e) => setYearClass(e.target.value)} disabled={!canEditViewing} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSave({ ...(viewingUser as StoredUser), name, about, branch, yearClass } as StoredUser)}>Save</Button>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const [activeUser, setActiveUserState] = useState(() => getActiveUser())
  const [viewingUser, setViewingUser] = useState<StoredUser | (typeof activeUser) | null>(() => getActiveUser())
  const results = useMemo(() => (viewingUser ? db.getResultsByEmail((viewingUser as StoredUser).email) : []), [viewingUser])

  // The profile editor is a child component which manages editable fields; it re-initializes on viewingUser change

  // initialize editing fields from current viewing user; update on viewingUser change
  // Initialize editing fields and results derives from viewingUser

  // when teacher/admin selects a different user to view
  const handleSelectViewingUser = (email?: string) => {
    if (!email) return
    const u = [...db.getStudents(), ...db.getTeachers(), ...db.getAdmins()].find((x) => x.email === email)
    if (u) {
      setViewingUser(u as StoredUser)
      setResults(db.getResultsByEmail(u.email))
      setName(u.name || "")
      setAbout(u.about || "")
      setBranch(u.branch || "")
      setYearClass(u.yearClass || "")
    }
  }

  const displayedUser = viewingUser || activeUser

  const initials = displayedUser?.name
    ? displayedUser.name
        .split(" ")
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase()
    : "QE"

  const handleLogout = () => {
    clearActiveUser()
    router.push("/login")
  }

  const average = results.length ? Math.round((results.reduce((a, r) => a + r.score, 0) / (results.reduce((a, r) => a + r.total, 0) / results.length)) * 100) / 100 : 0

  const isAdmin = activeUser?.role === "admin"
  const isTeacher = activeUser?.role === "teacher"
  const canEditViewing = isAdmin || (activeUser && viewingUser && activeUser.email === viewingUser.email)

  const allUsers = useMemo(() => {
    return [...db.getStudents(), ...db.getTeachers(), ...db.getAdmins()]
  }, [])

  const quizzes = useMemo(() => db.getQuizzes(), [])

  // per-subject progress summary for displayed user
  const subjectSummary = useMemo(() => {
    if (!displayedUser) return []
    const userResults = db.getResultsByEmail(displayedUser.email)
    const byQuiz = new Map<string, { attempts: number; correct: number; totalPoints: number }>()
    for (const r of userResults) {
      const quiz = quizzes.find((q) => q.id === r.quizId)
      const key = quiz?.category ?? r.quizId
      const cur = byQuiz.get(key) ?? { attempts: 0, correct: 0, totalPoints: 0 }
      cur.attempts += 1
      cur.correct += r.score
      cur.totalPoints += r.total
      byQuiz.set(key, cur)
    }
    const arr = Array.from(byQuiz.entries()).map(([category, v]) => ({
      category,
      attempts: v.attempts,
      correct: v.correct,
      total: v.totalPoints,
      average: v.totalPoints ? Math.round((v.correct / v.totalPoints) * 10000) / 100 : 0,
    }))
    return arr
  }, [displayedUser, quizzes])

  const exportCsv = (forUserEmail?: string) => {
    const email = forUserEmail ?? displayedUser?.email
    if (!email) return
    const rows = db.getResultsByEmail(email)
    const header = ["id", "quizId", "quizTitle", "userEmail", "score", "total", "takenAt"]
    const csv = [header.join(",")].concat(
      rows.map((r) => [r.id, r.quizId, (r.quizTitle || "").replace(/\n|\r|,/g, " "), r.userEmail, r.score, r.total, r.takenAt].join(","))
    )
    const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `activity_${email.replace(/[@.]/g, "_")}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Profile
              </CardTitle>
              <CardDescription>Your account and recent activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {displayedUser ? (
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-lg">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground flex items-center gap-2"><Mail className="w-4 h-4"/>{displayedUser.email}</div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <div>Role: <span className="font-medium">{displayedUser.role}</span></div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" onClick={() => router.push('/dashboard')}>Dashboard</Button>
                        <Button variant="ghost" onClick={handleLogout}>Log out</Button>
                      </div>
                    </div>

                    {/* editing area */}
                    <ProfileEditor
                      key={(viewingUser as StoredUser)?.email ?? "self"}
                      viewingUser={viewingUser as StoredUser}
                      canEditViewing={canEditViewing}
                      onSave={(merged: StoredUser) => {
                        // keep role-specific collections in sync
                        upsertUser(merged)
                        if (merged.role === "student") db.upsertStudent(merged)
                        if (merged.role === "teacher") db.upsertTeacher(merged)
                        if (merged.role === "admin") db.upsertAdmin(merged)
                        // if editing own profile, update active user
                        if (activeUser && activeUser.email === merged.email) {
                          setActiveUser({ ...merged, lastLogin: activeUser.lastLogin })
                          setActiveUserState(getActiveUser())
                        }
                        toast({ title: "Profile saved" })
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">You are not signed in.</p>
                  <div className="flex gap-2">
                    <Button asChild>
                      <Link href="/login">Sign in</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/signup">Sign up</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* teacher/admin: pick user to view */}
          {(isTeacher || isAdmin) && (
            <Card>
              <CardHeader>
                <CardTitle>View User Profile</CardTitle>
                <CardDescription>Search and view student/teacher profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Pick user</Label>
                  <Select onValueChange={(v) => handleSelectViewingUser(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {allUsers.map((u) => (
                        <SelectItem key={u.email} value={u.email}>{u.name} — {u.email}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Per-subject Progress</CardTitle>
              <CardDescription>Summary of attempts and averages by subject</CardDescription>
            </CardHeader>
            <CardContent>
              {subjectSummary.length === 0 ? (
                <div className="text-sm text-muted-foreground">No subject activity available.</div>
              ) : (
                <div className="space-y-3">
                  {subjectSummary.map((s) => (
                    <div key={s.category} className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-medium">{s.category}</div>
                        <div className="text-xs text-muted-foreground">Attempts: {s.attempts} • Correct: {s.correct}/{s.total}</div>
                      </div>
                      <div className="w-36 text-right">
                        <div className="font-semibold">{s.average}%</div>
                        <div className="text-xs text-muted-foreground">Avg</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest quiz attempts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.length === 0 ? (
                <div className="text-sm text-muted-foreground">No recent activity found.</div>
              ) : (
                results.slice().reverse().slice(0, 10).map((r) => (
                  <div key={r.id} className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div>
                      <p className="font-medium">{r.quizTitle ?? r.quizId}</p>
                      <p className="text-xs text-muted-foreground">{new Date(r.takenAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-accent">{r.score}/{r.total}</p>
                    </div>
                  </div>
                ))
              )}
              <div className="flex items-center justify-between mt-2">
                <div className="text-sm text-muted-foreground">Average score</div>
                <div className="font-medium">{results.length ? `${average}%` : `-`}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
