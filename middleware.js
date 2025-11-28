import { NextResponse } from 'next/server'
import { validateStudentBranchRequest, getRoleFromRequest, getBranchFromRequest } from './lib/branch-auth'

// Middleware: Strict branch based protection
// - If user is a student and tries to access another student's branch route
//   redirect to the student's branch dashboard.
// - Redirect '/dashboard' to the correct role-based route.
// - Admins and teachers aren't restricted by branch.

export function middleware(request) {
  const url = request.nextUrl.clone()
  const role = getRoleFromRequest(request) || ''
  const branch = getBranchFromRequest(request)

  if (url.pathname === '/dashboard' || url.pathname === '/dashboard/') {
    if (role === 'admin') {
      url.pathname = '/dashboard/admin'
      return NextResponse.redirect(url)
    }
    if (role === 'teacher') {
      url.pathname = '/dashboard/teacher'
      return NextResponse.redirect(url)
    }
    if (role === 'student' && branch) {
      url.pathname = `/student/${branch}/dashboard`
      return NextResponse.redirect(url)
    }
  }

  if (url.pathname.startsWith('/student/') || url.pathname.startsWith('/dashboard/student')) {
    const blocked = validateStudentBranchRequest(request)
    if (blocked) return blocked
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/student/:path*', '/dashboard/:path*', '/dashboard'],
}
