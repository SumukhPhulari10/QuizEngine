import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Role and branch middleware for demonstration only.
// It reads cookies: 'qe-role' and 'qe-branch' and redirects accordingly.
// TODO: Replace this cookie-based check with Supabase auth / server session in production.

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const role = request.cookies.get('qe-role')?.value ?? ''
  const branch = request.cookies.get('qe-branch')?.value ?? ''

  // Redirect root dashboard to correct role-based dashboard
  if (url.pathname === '/dashboard' || url.pathname === '/dashboard/') {
    // Admin overrides everything if role is admin
    if (role === 'admin') {
      url.pathname = '/dashboard/admin'
      return NextResponse.redirect(url)
    }
    if (role === 'teacher') {
      url.pathname = '/dashboard/teacher'
      return NextResponse.redirect(url)
    }
    if (role === 'student') {
      // if there's a branch set, map to branch dashboards
      if (branch === 'cse') url.pathname = '/dashboard/student/cse'
      else if (branch === 'mech' || branch === 'mechanical') url.pathname = '/dashboard/student/mech'
      else if (branch === 'civil') url.pathname = '/dashboard/student/civil'
      else url.pathname = '/dashboard/student/cse'
      return NextResponse.redirect(url)
    }
  }

  // If role tries to access an admin area, block
  if (url.pathname.startsWith('/dashboard/admin') && role !== 'admin') {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Teacher's area protection
  if (url.pathname.startsWith('/dashboard/teacher') && role !== 'teacher' && role !== 'admin') {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Student area protection (route has /dashboard/student/:branch)
  if (url.pathname.startsWith('/dashboard/student')) {
    const pathParts = url.pathname.split('/')
    const branchSegment = pathParts[3] ?? ''
    if (role !== 'student') {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
    if (branch && branchSegment && branchSegment !== branch) {
      // Redirect to the student's branch page
      url.pathname = `/dashboard/student/${branch}`
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/dashboard'],
}
