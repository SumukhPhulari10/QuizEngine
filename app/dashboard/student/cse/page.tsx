import DashboardHeader from "@/components/dashboard/header"
import { DashboardCards } from "@/components/dashboard/cards"
import SubjectList from "@/components/dashboard/subject-list"
import RoleGuard from "@/components/dashboard/protection"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { fetchSubjectsForBranch } from "@/lib/supabaseClient"

const BRANCH_SLUG = "cse"
const BRANCH_LABEL = "CSE Student Dashboard"
const BRANCH_ALIASES = ["cse", "computer science", "computer science engineering"]

type Subject = {
  id?: string
  title?: string
  description?: string
  category?: string
}

export default async function StudentCsePage() {
  const cookieStore = await cookies()
  const role = cookieStore.get("role")?.value || cookieStore.get("qe-role")?.value || ""
  const branch = cookieStore.get("branch")?.value || cookieStore.get("qe-branch")?.value || ""
  const normalizedBranch = branch?.toLowerCase()

  if (!role) {
    redirect("/login")
  }

  if (role === "student" && normalizedBranch && !BRANCH_ALIASES.includes(normalizedBranch)) {
    redirect(`/dashboard/student/${normalizedBranch}`)
  }

  const subjects: Subject[] = (await fetchSubjectsForBranch(BRANCH_SLUG)) ?? []

  return (
    <RoleGuard allowedRoles={["student"]} requiredBranch={BRANCH_ALIASES}>
      <div className="container mx-auto p-4">
        <DashboardHeader />
        <h1 className="text-2xl font-bold mb-2">{BRANCH_LABEL}</h1>
        <p className="text-sm text-muted-foreground mb-4">Quick overview and suggested quizzes for CSE.</p>
        <DashboardCards />
        <SubjectList branch={BRANCH_SLUG} viewerRole={role} viewerBranch={branch} />

        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Available Quizzes</h2>
          {subjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No quizzes available for this branch yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {subjects.map((s) => (
                <div className="border rounded p-3" key={s.id ?? s.title}>
                  <h3 className="font-semibold">{s.title ?? "Untitled quiz"}</h3>
                  {s.description && <p className="text-sm text-muted-foreground">{s.description}</p>}
                  {s.category && <p className="text-xs text-muted-foreground mt-2">Category: {s.category}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </RoleGuard>
  )
}
