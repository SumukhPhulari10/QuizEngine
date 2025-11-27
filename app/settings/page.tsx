"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  const [fullName, setFullName] = useState("")
  const [nameMsg, setNameMsg] = useState<string>("")
  const [nameLoading, setNameLoading] = useState(false)

  const [newEmail, setNewEmail] = useState("")
  const [emailMsg, setEmailMsg] = useState<string>("")
  const [emailLoading, setEmailLoading] = useState(false)

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passMsg, setPassMsg] = useState<string>("")
  const [passLoading, setPassLoading] = useState(false)

  const [deleteMsg, setDeleteMsg] = useState<string>("")
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (!isMounted) return
      if (error) {
        setUserId(null)
      } else {
        setUserId(user?.id ?? null)
      }
      setLoadingUser(false)
    })()
    return () => {
      isMounted = false
    }
  }, [])

  // Prefill profile data on load
  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .single()
      if (profile) {
        setFullName(profile.full_name || "")
        setNewEmail(profile.email || "")
      }
    }
    loadProfile()
  }, [])

  const onUpdateName = async (e: React.FormEvent) => {
    e.preventDefault()
    setNameMsg("")
    setNameLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setNameMsg("Not authenticated")
      setNameLoading(false)
      return
    }
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id)
    if (error) setNameMsg(error.message)
    else {
      setNameMsg("Name updated successfully")
      alert("Name updated successfully!")
    }
    setNameLoading(false)
  }

  const onUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setEmailMsg("")
    setEmailLoading(true)
    const { error: authErr } = await supabase.auth.updateUser({ email: newEmail })
    if (authErr) {
      setEmailMsg(authErr.message)
      setEmailLoading(false)
      return
    }
    const { error: profileErr } = await supabase
      .from("profiles")
      .update({ email: newEmail })
      .eq("id", userId)
    if (profileErr) setEmailMsg(profileErr.message)
    else {
      setEmailMsg("Email updated! Please sign in again using your new email.")
      router.refresh()
    }
    setEmailLoading(false)
  }

  const onUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    if (!newPassword || newPassword !== confirmPassword) {
      setPassMsg("Passwords do not match.")
      return
    }
    setPassMsg("")
    setPassLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) setPassMsg(error.message)
    else setPassMsg("Password updated successfully")
    setPassLoading(false)
    setNewPassword("")
    setConfirmPassword("")
  }

  const onDeleteAccount = async () => {
    if (!userId) return
    const ok = window.confirm("Are you sure you want to delete your account? This cannot be undone.")
    if (!ok) return
    setDeleteMsg("")
    setDeleteLoading(true)
    try {
      const res = await fetch("/api/delete-account", { method: "POST" })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Failed to delete account")
      }
      setDeleteMsg("Account deleted")
      router.push("/")
    } catch (err: any) {
      setDeleteMsg(err.message || "Failed to delete account")
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {!loadingUser && !userId && (
        <Card>
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please log in to manage your settings.</CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Change Display Name */}
      <Card>
        <CardHeader>
          <CardTitle>Change Display Name</CardTitle>
          <CardDescription>Update your full name shown across the app.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onUpdateName} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                disabled={!userId}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={!userId || nameLoading}>
                {nameLoading ? "Saving..." : "Save"}
              </Button>
              {nameMsg && <span className="text-sm text-muted-foreground">{nameMsg}</span>}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change Email Address */}
      <Card>
        <CardHeader>
          <CardTitle>Change Email Address</CardTitle>
          <CardDescription>Update the email for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onUpdateEmail} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="newEmail">New Email</Label>
              <Input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="name@example.com"
                disabled={!userId}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={!userId || emailLoading}>
                {emailLoading ? "Updating..." : "Update Email"}
              </Button>
              {emailMsg && <span className="text-sm text-muted-foreground">{emailMsg}</span>}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Choose a new password for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onUpdatePassword} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                disabled={!userId}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={!userId}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={!userId || passLoading}>
                {passLoading ? "Updating..." : "Update Password"}
              </Button>
              {passMsg && <span className="text-sm text-muted-foreground">{passMsg}</span>}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>This action is permanent.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Button variant="destructive" onClick={onDeleteAccount} disabled={!userId || deleteLoading}>
              {deleteLoading ? "Deleting..." : "Delete Account"}
            </Button>
            {deleteMsg && <span className="text-sm text-muted-foreground">{deleteMsg}</span>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
