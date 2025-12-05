-- Run this to verify your database setup is correct
-- This will show you the current structure

-- Check if branches table exists and has data
SELECT 'Branches Table' as check_type, COUNT(*) as count FROM branches;

-- Check if profiles table has the new columns
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('role', 'branch_id', 'year_class', 'section')
ORDER BY column_name;

-- Check existing profiles (if any)
SELECT 
    id, 
    full_name, 
    email, 
    role, 
    branch_id, 
    year_class, 
    section 
FROM profiles 
LIMIT 5;

