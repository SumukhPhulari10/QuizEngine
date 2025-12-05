import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { supabaseServer } from "./lib/supabase/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = await supabaseServer()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is not signed in and the current path is not /login or /signup redirect to /login
  if (!session && !req.nextUrl.pathname.startsWith('/login') && !req.nextUrl.pathname.startsWith('/signup')) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  // If user is signed in and the current path is /login or /signup, redirect based on role
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
    // Try to get user role from profiles table
    let redirectPath = '/dashboard' // default
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
      
      if (profile?.role) {
        if (profile.role === 'admin') {
          redirectPath = '/dashboard/admin'
        } else if (profile.role === 'teacher') {
          redirectPath = '/dashboard/teacher'
        } else if (profile.role === 'student') {
          redirectPath = '/dashboard/student'
        }
      } else {
        // Fallback to user_branches if profiles.role doesn't exist
        const { data: userBranch } = await supabase
          .from('user_branches')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle()
        
        if (userBranch?.role) {
          if (userBranch.role === 'admin') {
            redirectPath = '/dashboard/admin'
          } else if (userBranch.role === 'teacher') {
            redirectPath = '/dashboard/teacher'
          } else if (userBranch.role === 'student') {
            redirectPath = '/dashboard/student'
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user role in middleware:', error)
      // Default to /dashboard on error
    }
    
    return NextResponse.redirect(new URL(redirectPath, req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}
