"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useState } from "react"
import { getActiveUser } from "@/lib/profile-storage"
import { Button } from "@/components/ui/button"

type DashboardHeaderProps = {
  hideBranchSwitcher?: boolean
  branchLabel?: string
}

export default function DashboardHeader({ hideBranchSwitcher = false, branchLabel }: DashboardHeaderProps = {}) {
  const pathname = usePathname()
  const [user] = useState<any>(() => getActiveUser())
  const isStudent = user?.role === "student"

  return (
    <header className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-xl font-semibold">
          Dashboard
        </Link>
        <nav className="hidden md:flex gap-2">
          <Link href="/dashboard" className={pathname === "/dashboard" ? "underline" : ""}>
            Home
          </Link>
          <Link href="/dashboard/teacher" className={pathname?.startsWith("/dashboard/teacher") ? "underline" : ""}>
            Teacher
          </Link>
          {!hideBranchSwitcher && (
            <>
              {isStudent ? (
                <Link
                  href={`/student/${user.branch?.toLowerCase()}/dashboard`}
                  className={pathname?.startsWith("/student") ? "underline" : ""}
                >
                  Student
                </Link>
              ) : (
                <Link
                  href="/dashboard/student/cse"
                  className={pathname?.startsWith("/dashboard/student") ? "underline" : ""}
                >
                  Student
                </Link>
              )}
            </>
          )}
          <Link href="/dashboard/admin" className={pathname?.startsWith("/dashboard/admin") ? "underline" : ""}>
            Admin
          </Link>
        </nav>
      </div>

      <div className="flex gap-3 items-center">
        {branchLabel && isStudent && (
          <span className="rounded-full bg-muted px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground">
            {branchLabel}
          </span>
        )}
        <span className="text-sm text-muted-foreground">
          {user ? `${user.name} (${user.role})` : "Not signed in"}
        </span>
        {user?.role === "admin" && (
          <Link href="/dashboard/admin">
            <Button size="sm">Admin Panel</Button>
          </Link>
        )}
      </div>
    </header>
  )
}
