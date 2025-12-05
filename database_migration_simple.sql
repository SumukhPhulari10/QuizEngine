-- SIMPLER ALTERNATIVE: Store branch as text instead of foreign key
-- Use this if you don't want to create a branches table
-- Run this SQL in your Supabase SQL Editor

-- Add new columns to profiles table (branch stored as text)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('student', 'teacher', 'admin')),
ADD COLUMN IF NOT EXISTS branch TEXT,  -- Store branch name directly (cse, it, ece, etc.)
ADD COLUMN IF NOT EXISTS year_class TEXT,
ADD COLUMN IF NOT EXISTS section TEXT;

-- Create index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_branch ON profiles(branch);

-- Optional: Migrate existing data from user_branches to profiles
-- Uncomment and run this if you have existing users in user_branches table
/*
UPDATE profiles p
SET 
  role = ub.role,
  branch = b.name
FROM user_branches ub
LEFT JOIN branches b ON ub.branch_id = b.id
WHERE p.id = ub.user_id;
*/

