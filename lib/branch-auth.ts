import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { redirect } from "next/navigation"

const normalize = (value: string = "") => value.trim().toLowerCase()

export const BRANCH_ALIASES: Record<string, string[]> = {
  cse: ["cse", "computer-science", "computer science engineering", "computer science"],
  mech: ["mech", "mechanical", "mechanical engineering"],
  civil: ["civil", "civil engineering"],
  ece: ["ece", "electronics", "electronics and communication"],
  aiml: ["aiml", "ai-ml", "ai", "ml", "artificial-intelligence", "machine-learning"],
  it: ["it", "information-technology", "information technology"],
}

const STUDENT_SEGMENT = "student"

const resolveBaseUrl = (req?: NextRequest) => {
  if (req) return req.url
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
}

export const findCanonicalBranch = (branch?: string | null) => {
  if (!branch) return undefined
  const normalized = normalize(branch)
  return Object.entries(BRANCH_ALIASES).find(([, aliases]) => aliases.includes(normalized))?.[0]
}

const readCookie = (keys: string[], req?: NextRequest) => {
  const valueFromRequest = keys
    .map((key) => req?.cookies?.get(key)?.value)
    .find((val): val is string => Boolean(val))
  if (valueFromRequest) return valueFromRequest

  try {
    const cookieStore = cookies()
    return (
      keys
        .map((key) => cookieStore.get(key)?.value)
        .find((val): val is string => Boolean(val))
    ) || ""
  } catch {
    return ""
  }
}

export function getRoleFromRequest(req?: NextRequest) {
  return normalize(readCookie(["role", "qe-role"], req))
}

export function getBranchFromRequest(req?: NextRequest) {
  return findCanonicalBranch(readCookie(["branch", "qe-branch"], req))
}

export function redirectToStudentBranch(branch: string, req?: NextRequest) {
  const canonical = branch?.toLowerCase()
  const target = `/student/${canonical}/dashboard`
  const url = new URL(target, resolveBaseUrl(req))
  return NextResponse.redirect(url)
}

const extractBranchFromPath = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean)
  const studentIdx = segments.indexOf(STUDENT_SEGMENT)
  if (studentIdx === -1) return undefined
  const branchCandidate = segments[studentIdx + 1]
  return findCanonicalBranch(branchCandidate)
}

export function validateStudentBranchRequest(req: NextRequest) {
  const role = getRoleFromRequest(req)
  const branchCookie = getBranchFromRequest(req)

  if (!role) {
    return NextResponse.redirect(new URL("/login", resolveBaseUrl(req)))
  }

  if (role !== "student") return null

  if (!branchCookie) {
    return NextResponse.redirect(new URL("/login", resolveBaseUrl(req)))
  }

  const requestedBranch = extractBranchFromPath(req.nextUrl.pathname)

  if (!requestedBranch || requestedBranch !== branchCookie) {
    return redirectToStudentBranch(branchCookie, req)
  }

  return null
}

export async function getStudentContext() {
  const cookieStore = await cookies()
  const role = normalize(cookieStore.get("role")?.value || cookieStore.get("qe-role")?.value || "")
  const branch = findCanonicalBranch(cookieStore.get("branch")?.value || cookieStore.get("qe-branch")?.value)

  return { role, branch }
}

export async function enforceStudentBranch(requiredBranch?: string) {
  const { role, branch } = await getStudentContext()

  if (!role) {
    redirect("/login")
  }

  if (role !== "student") {
    return { role, branch }
  }

  if (!branch) {
    redirect("/login")
  }

  if (requiredBranch && branch !== requiredBranch) {
    redirect(`/student/${branch}/dashboard`)
  }

  return { role, branch }
}

