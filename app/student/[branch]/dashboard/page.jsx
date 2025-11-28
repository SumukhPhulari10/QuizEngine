import DashboardHeader from "@/components/dashboard/header"
import { DashboardCards } from "@/components/dashboard/cards"
import SubjectList from "@/components/dashboard/subject-list"
import { enforceStudentBranch } from "@/lib/branch-auth"
import { fetchSubjectsForStudentBranch } from "@/lib/supabaseClient"

const BRANCH_COPY = {
  cse: {
    title: "CSE Student Dashboard",
    description: "Curated quizzes for Computer Science Engineering.",
  },
  mech: {
    title: "MECH Student Dashboard",
    description: "Mechanical Engineering focus on thermo, design, and systems.",
  },
  civil: {
    title: "CIVIL Student Dashboard",
    description: "Structural analysis, surveying, and project planning.",
  },
  ece: {
    title: "ECE Student Dashboard",
    description: "Digital design, communications, and embedded systems.",
  },
  aiml: {
    title: "AI/ML Student Dashboard",
    description: "Machine learning labs, neural networks, and data projects.",
  },
  it: {
    title: "IT Student Dashboard",
    description: "Information Technology, automation, and enterprise tooling.",
  },
}

export default async function StudentBranchDashboardPage({ params }) {
  const requestedBranch = params.branch?.toLowerCase()
  const { role, branch } = await enforceStudentBranch(requestedBranch)
  const subjects = await fetchSubjectsForStudentBranch(branch || requestedBranch)
  const copy =
    (branch && BRANCH_COPY[branch]) ||
    BRANCH_COPY[requestedBranch] || {
      title: `${requestedBranch?.toUpperCase() || "Student"} Dashboard`,
      description: "Branch-specific insights and quizzes.",
    }

  return (
    <div className="space-y-6">
      <DashboardHeader hideBranchSwitcher branchLabel={(branch || requestedBranch)?.toUpperCase()} />
      <div>
        <h1 className="text-2xl font-bold">{copy.title}</h1>
        <p className="text-sm text-muted-foreground">{copy.description}</p>
      </div>

      <DashboardCards branch={branch || requestedBranch} />
      <SubjectList branch={branch || requestedBranch} viewerRole={role} viewerBranch={branch} />

      <section className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Available Quizzes</h2>
        {subjects.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No quizzes created yet for this branch. Please check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <div key={subject.id} className="rounded border p-3">
                <h3 className="font-semibold">{subject.title}</h3>
                {subject.description && <p className="text-sm text-muted-foreground">{subject.description}</p>}
                {subject.category && (
                  <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wide">Category: {subject.category}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
