import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Server-side route handler acting as a proxy for /dashboard, choosing the
// correct sub-route based on cookies. This avoids using the global `middleware.ts`.
// TODO: Replace cookie lookups with session checks from Supabase or your auth provider.

export async function GET(req: Request) {
  const cookieStore = cookies()
  const role = cookieStore.get('qe-role')?.value ?? ''
  const branch = cookieStore.get('qe-branch')?.value ?? ''

  const base = new URL(req.url)

  if (role === 'admin') {
    return NextResponse.redirect(new URL('/dashboard/admin', base))
  }
  if (role === 'teacher') {
    return NextResponse.redirect(new URL('/dashboard/teacher', base))
  }
  if (role === 'student') {
    if (branch === 'cse') return NextResponse.redirect(new URL('/dashboard/student/cse', base))
    if (branch === 'mech' || branch === 'mechanical') return NextResponse.redirect(new URL('/dashboard/student/mech', base))
    if (branch === 'civil') return NextResponse.redirect(new URL('/dashboard/student/civil', base))
    return NextResponse.redirect(new URL('/dashboard/student/cse', base))
  }

  // default to the learner dashboard
  return NextResponse.redirect(new URL('/dashboard', base))
}

export const runtime = 'edge'
