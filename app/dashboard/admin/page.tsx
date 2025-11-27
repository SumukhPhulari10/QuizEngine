"use client"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// Using native confirm for prompts; dialog UI is available at components/ui/dialog if we want to upgrade
import { ActiveUser, getActiveUser, setActiveUser, getStoredUsers, upsertUser, clearActiveUser } from "@/lib/profile-storage"
import db, { getAllUsers, getResultsByEmail, updateUser } from "@/lib/db"
 

export default function AdminDashboardPage() {
  const router = useRouter()
  const [activeUser] = useState<ActiveUser | null>(() => getActiveUser())
  const [users, setUsers] = useState(() => getAllUsers())
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null)
  const [editingEmail, setEditingEmail] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<any>(null)
  const [filter, setFilter] = useState("")

  useEffect(() => {
    if (!activeUser || activeUser.role !== "admin") {
      // not authorized
      router.replace("/login")
    }
  }, [router, activeUser])

  // users initialized via lazy state; call `Refresh` button if you need to refresh during runtime

  const totals = useMemo(() => {
    const students = db.getStudents().length
    const teachers = db.getTeachers().length
    const admins = db.getAdmins().length
    const quizzes = db.getQuizzes().length
    const results = db.getResults().length
    return { students, teachers, admins, quizzes, results }
  }, [])

  const handleDelete = (email: string) => {
    if (!confirm(`Delete user ${email}? This cannot be undone.`)) return
    db.deleteUser(email)
    if (activeUser?.email?.toLowerCase() === email.toLowerCase()) {
      clearActiveUser()
      router.push('/login')
      return
    }
    setUsers(getAllUsers())
  }

  const handleClearResults = (email: string) => {
    if (!confirm(`Clear results for ${email}?`)) return
    db.clearResultsByEmail(email)
    setUsers(getAllUsers())
  }

  const handleResetPassword = (email: string) => {
    const newPass = prompt(`Enter new password for ${email} (blank to cancel)`) || ""
    if (!newPass.trim()) return
    const users = getStoredUsers()
    const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())
    if (idx === -1) return alert("User not found")
    const user = { ...users[idx], password: newPass }
    upsertUser(user)
    setUsers(getAllUsers())
    alert("Password updated")
  }

  const handleEdit = (u: any) => {
    setEditingEmail(u.email)
    setEditingData({ name: u.name, branch: u.branch, role: u.role, yearClass: u.yearClass, section: u.section })
  }

  const handleCancelEdit = () => {
    setEditingEmail(null)
    setEditingData(null)
  }

  const handleSaveEdit = (email: string) => {
    if (!editingEmail || !editingData) return
    const usersList = getStoredUsers()
    const idx = usersList.findIndex((x) => x.email.toLowerCase() === editingEmail.toLowerCase())
    if (idx === -1) return alert("User not found")
    const updatedUser = { ...usersList[idx], ...editingData }
    updateUser(updatedUser)
    setUsers(getAllUsers())
    setEditingEmail(null)
    setEditingData(null)
    alert("User updated")
  }

  const handleChangeRole = (email: string, role: string) => {
    if (!confirm(`Change role for ${email} to ${role}?`)) return
    db.changeUserRole(email, role as any)
    setUsers(getAllUsers())
  }

  const filtered = users.filter((u) => u.name.toLowerCase().includes(filter.toLowerCase()) || u.email.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Full control of teachers, students, and platform data.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/dashboard">Open Learner View</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Create User</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="grid md:grid-cols-5 gap-4">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage students, teachers and admins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <Input placeholder="Search by name or email" value={filter} onChange={(e) => setFilter(e.target.value)} />
                <Button onClick={() => setUsers(getAllUsers())}>Refresh</Button>
              </div>

              <Table>
                <TableHeader>
                  <tr>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Results</TableHead>
                    <TableHead>Average</TableHead>
                    <TableHead>Action</TableHead>
                  </tr>
                </TableHeader>
                <TableBody>
                  {filtered.map((u) => {
                    const results = getResultsByEmail(u.email)
                    const avg = results.length ? Math.round((results.reduce((a, b) => a + b.score, 0) / results.reduce((a, b) => a + b.total, 0)) * 100) : null
                    return (
                      <TableRow key={u.email}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{u.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}</AvatarFallback>
                            </Avatar>
                            <div>
                              {editingEmail === u.email ? (
                                <input value={editingData?.name ?? ""} onChange={(e) => setEditingData({ ...editingData, name: e.target.value })} className="rounded-md border px-2 py-1 text-sm" />
                              ) : (
                                <p className="font-medium">{u.name}</p>
                              )}
                              <p className="text-xs text-muted-foreground">{u.createdAt}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell className="capitalize">
                          {editingEmail === u.email ? (
                            <select className="rounded-md border px-2 py-1 text-sm" value={editingData?.role} onChange={(e) => setEditingData({ ...editingData, role: e.target.value })}>
                              <option value="student">student</option>
                              <option value="teacher">teacher</option>
                              <option value="admin">admin</option>
                            </select>
                          ) : (
                            u.role
                          )}
                        </TableCell>
                        <TableCell>
                          {editingEmail === u.email ? (
                            <input value={editingData?.branch ?? ""} onChange={(e) => setEditingData({ ...editingData, branch: e.target.value })} className="rounded-md border px-2 py-1 text-sm" />
                          ) : (
                            u.branch
                          )}
                        </TableCell>
                        <TableCell>{results.length}</TableCell>
                        <TableCell>{avg === null ? "—" : `${avg}%`}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setExpandedEmail(expandedEmail === u.email ? null : u.email)}>
                              {expandedEmail === u.email ? "Hide" : "View"}
                            </Button>
                            {editingEmail === u.email ? (
                              <>
                                <Button size="sm" variant="secondary" onClick={() => handleSaveEdit(u.email)}>
                                  Save
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                                  Cancel
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleResetPassword(u.email)}>
                                  Reset
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => {
                                  // impersonate selected user
                                  const copy = { ...u }
                                  // remove password field before making active
                                  // @ts-ignore
                                  delete copy.password
                                  setActiveUser({ ...copy, lastLogin: new Date().toISOString() })
                                  router.push('/dashboard')
                                }}>
                                  Sign in as
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" variant="ghost" onClick={() => handleEdit(u)}>
                                  Edit
                                </Button>
                                <select
                                  defaultValue={u.role}
                                  className="rounded-md border px-2 py-1 text-sm"
                                  onChange={(e) => handleChangeRole(u.email, e.target.value)}
                                >
                                  <option value="student">student</option>
                                  <option value="teacher">teacher</option>
                                  <option value="admin">admin</option>
                                </select>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(u.email)}>
                                  Delete
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleClearResults(u.email)}>
                                  Clear Results
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleResetPassword(u.email)}>
                                  Reset
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {users.map((u) => (
                <div key={`results-${u.email}`} className={`${expandedEmail === u.email ? "block" : "hidden"} mt-2 px-3 py-2 rounded-md border bg-muted/20`}>
                  <h3 className="text-sm font-medium">{u.name} — Results</h3>
                  <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                    {getResultsByEmail(u.email).map((r) => (
                      <li key={r.id}>{r.quizTitle ?? r.quizId} — {r.score}/{r.total} on {new Date(r.takenAt).toLocaleString()}</li>
                    ))}
                    {getResultsByEmail(u.email).length === 0 && <li>No attempts</li>}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Summary</CardTitle>
              <CardDescription>Quick stats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Students</span><strong>{totals.students}</strong></div>
                <div className="flex justify-between"><span>Teachers</span><strong>{totals.teachers}</strong></div>
                <div className="flex justify-between"><span>Admins</span><strong>{totals.admins}</strong></div>
                <div className="flex justify-between"><span>Quizzes</span><strong>{totals.quizzes}</strong></div>
                <div className="flex justify-between"><span>Results</span><strong>{totals.results}</strong></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
