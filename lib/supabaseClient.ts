// Example Supabase client helpers for server-side and browser use
// TODO: Set REAL values in environment variables
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Client for browser/public usage
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Service role client used only on the server to make privileged queries if needed
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

// Example utility - fetch branch-specific subjects with Supabase
export async function fetchSubjectsForBranch(branch: string) {
  if (!branch) return []
  // Use the server client to fetch subject list filtered by branch
  // TODO: Replace with your own RBAC/row-level-security checks
  const { data, error } = await supabaseAdmin
    .from('subjects')
    .select('*')
    .eq('branch', branch.toLowerCase())

  if (error) {
    // Server logs only; don't reveal error in production
    console.error('Supabase error', error)
    return []
  }

  return data ?? []
}

export async function fetchSubjectsForStudentBranch(branch: string) {
  return fetchSubjectsForBranch(branch?.toLowerCase())
}