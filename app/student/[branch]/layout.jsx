import { enforceStudentBranch } from "@/lib/branch-auth"

export default async function StudentBranchLayout({ children, params }) {
  await enforceStudentBranch(params.branch?.toLowerCase())
  return <>{children}</>
}
