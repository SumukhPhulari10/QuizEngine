# Database Structure Recommendation

## ✅ Recommended Approach: Single `profiles` Table

**Yes, you should consolidate everything into the `profiles` table!** This is the best approach for your use case.

## Why This is Better

1. **Simpler Queries**: No joins needed - everything is in one table
2. **Better Performance**: Single query instead of multiple table lookups
3. **Easier Authentication**: Role check is straightforward
4. **Cleaner Code**: Less complexity in your application code

## Current Structure (Before Migration)

- `profiles` table: `id`, `full_name`, `email`, `created_at`, `updated_at`
- `user_branches` table: `id`, `user_id`, `role`, `branch_id`, `created_at`

## Recommended Structure (After Migration)

- `profiles` table: 
  - `id` (UUID, primary key, references auth.users)
  - `full_name` (TEXT)
  - `email` (TEXT)
  - `role` (TEXT: 'student', 'teacher', 'admin')
  - `branch_id` (UUID, references branches.id, nullable for admins)
  - `year_class` (TEXT, nullable for admins/teachers)
  - `section` (TEXT, nullable)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

## Steps to Implement

### 1. Run the SQL Migration

Execute the SQL in `database_migration_recommendation.sql` in your Supabase SQL Editor:

```sql
-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('student', 'teacher', 'admin')),
ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES branches(id),
ADD COLUMN IF NOT EXISTS year_class TEXT,
ADD COLUMN IF NOT EXISTS section TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_branch_id ON profiles(branch_id);
```

### 2. Migrate Existing Data (if you have users)

If you have existing users in `user_branches`, migrate them:

```sql
UPDATE profiles p
SET 
  role = ub.role,
  branch_id = ub.branch_id
FROM user_branches ub
WHERE p.id = ub.user_id;
```

### 3. Code is Already Updated

The code has been updated to:
- ✅ Save all user info to `profiles` table during signup
- ✅ Fetch role from `profiles` table during login (with fallback to `user_branches`)
- ✅ TypeScript types updated

### 4. Optional: Remove `user_branches` Table

After confirming everything works, you can drop the old table:

```sql
DROP TABLE IF EXISTS user_branches;
```

## Important Notes

1. **Authentication**: Supabase Auth (`auth.users`) still handles authentication
2. **Profiles Table**: This is just an extension table for user metadata
3. **Branch Reference**: `branch_id` references the `branches` table
4. **Admin Users**: Admins don't need `branch_id`, `year_class`, or `section` (these are NULL)

## Benefits

- ✅ Single source of truth for user profile data
- ✅ Faster queries (no joins)
- ✅ Easier to maintain
- ✅ Better for authentication/authorization checks
- ✅ Simpler codebase

## Testing Checklist

After running the migration:
- [ ] Test signup for admin user
- [ ] Test signup for student user
- [ ] Test signup for teacher user
- [ ] Test login redirect for each role
- [ ] Verify data is saved correctly in profiles table
- [ ] Check that existing users (if any) are migrated correctly

