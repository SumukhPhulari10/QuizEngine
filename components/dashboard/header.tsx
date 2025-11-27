"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getActiveUser } from "@/lib/profile-storage";
import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(() => getActiveUser());

  return (
    <header className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-xl font-semibold">
          Dashboard
        </Link>
        <nav className="hidden md:flex gap-2">
          <Link
            href="/dashboard"
            className={pathname === "/dashboard" ? "underline" : ""}
          >
            Home
          </Link>
          <Link
            href="/dashboard/teacher"
            className={pathname?.startsWith("/dashboard/teacher") ? "underline" : ""}
          >
            Teacher
          </Link>
          <Link
            href="/dashboard/student/cse"
            className={pathname?.startsWith("/dashboard/student") ? "underline" : ""}
          >
            Student
          </Link>
          <Link href="/dashboard/admin" className={pathname?.startsWith("/dashboard/admin") ? "underline" : ""}>
            Admin
          </Link>
        </nav>
      </div>

      <div className="flex gap-3 items-center">
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
  );
}
