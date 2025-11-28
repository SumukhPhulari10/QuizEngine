import Link from "next/link"
import { enforceStudentBranch } from "@/lib/branch-auth"

export default async function StudentBaseLayout({ children }) {
  const { role, branch } = await enforceStudentBranch()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="font-semibold tracking-tight">
            QuizEngine
          </Link>
          {role === "student" && branch && (
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {branch} branch
            </span>
          )}
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
