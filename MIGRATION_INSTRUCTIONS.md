# Database Migration Instructions

## Problem
You're getting the error: `relation "branches" does not exist`

This happens because the `branches` table doesn't exist in your database yet.

## Solution: Choose One Approach

You have **two options**:

### Option 1: Create Branches Table (Recommended for Normalized Database)
**Use this if you want proper database normalization with foreign keys.**

Run the SQL in `database_migration_recommendation.sql` - it will:
1. Create the `branches` table
2. Insert all branch data (cse, it, ece, etc.)
3. Add columns to `profiles` table with foreign key reference

**Advantages:**
- Proper database normalization
- Data integrity (can't have invalid branch names)
- Can add more branch metadata later

**Disadvantages:**
- Requires creating the branches table
- Slightly more complex

### Option 2: Store Branch as Text (Simpler)
**Use this if you want a simpler setup without a branches table.**

Run the SQL in `database_migration_simple.sql` - it will:
1. Add columns to `profiles` table
2. Store branch name directly as text (no foreign key)

**Advantages:**
- Simpler - no branches table needed
- Faster to set up
- Less database complexity

**Disadvantages:**
- No data validation (could have typos in branch names)
- Less normalized database structure

## Quick Start

### For Option 1 (With Branches Table):

1. Open Supabase SQL Editor
2. Copy and paste the entire contents of `database_migration_recommendation.sql`
3. Run the query
4. Done! ✅

### For Option 2 (Simple Text Storage):

1. Open Supabase SQL Editor
2. Copy and paste the entire contents of `database_migration_simple.sql`
3. Run the query
4. Done! ✅

## Code Compatibility

The code has been updated to support **both approaches**:
- If `branches` table exists → uses `branch_id` (foreign key)
- If `branches` table doesn't exist → uses `branch` (text field)

So you can choose either option and the code will work!

## After Migration

1. Test signup for each role (admin, student, teacher)
2. Test login redirect
3. Verify data is saved correctly in the `profiles` table

## Troubleshooting

**If you still get errors:**
1. Make sure you're running the SQL in the Supabase SQL Editor (not in your app)
2. Check that the `profiles` table exists
3. Verify you have the correct permissions in Supabase

