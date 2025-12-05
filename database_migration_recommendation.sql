-- RECOMMENDED: Add these columns to your existing profiles table
-- Run this SQL in your Supabase SQL Editor

-- STEP 1: Create branches table if it doesn't exist
CREATE TABLE IF NOT EXISTS branches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 2: Insert branch data (only if branches don't exist)
INSERT INTO branches (name, display_name)
VALUES 
    ('cse', 'Computer Science & Engineering'),
    ('it', 'Information Technology'),
    ('ece', 'Electronics & Communication'),
    ('mechanical', 'Mechanical Engineering'),
    ('civil', 'Civil Engineering'),
    ('ai-ml', 'AI/ML')
ON CONFLICT (name) DO NOTHING;

-- STEP 3: Add new columns to profiles table
-- Note: We'll add branch_id without foreign key constraint first, then add it
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('student', 'teacher', 'admin')),
ADD COLUMN IF NOT EXISTS branch_id UUID,
ADD COLUMN IF NOT EXISTS year_class TEXT,
ADD COLUMN IF NOT EXISTS section TEXT;

-- STEP 4: Add foreign key constraint for branch_id
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'profiles_branch_id_fkey'
    ) THEN
        ALTER TABLE profiles
        ADD CONSTRAINT profiles_branch_id_fkey 
        FOREIGN KEY (branch_id) REFERENCES branches(id);
    END IF;
END $$;

-- Create index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_branch_id ON profiles(branch_id);

-- Optional: Migrate existing data from user_branches to profiles
-- Uncomment and run this if you have existing users in user_branches table
/*
UPDATE profiles p
SET 
  role = ub.role,
  branch_id = ub.branch_id
FROM user_branches ub
WHERE p.id = ub.user_id;
*/

-- After migration, you can optionally drop the user_branches table
-- (Only if you're sure you don't need it anymore)
-- DROP TABLE IF EXISTS user_branches;

