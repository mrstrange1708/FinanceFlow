-- Update Category RLS Policies to Allow Editing/Deleting Default Categories
-- Run this script in your Supabase SQL editor

-- Step 1: Drop existing policies
DROP POLICY IF EXISTS "Users can view default categories and manage their own" ON categories;
DROP POLICY IF EXISTS "Users can manage their own categories" ON categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON categories;

-- Step 2: Create new policies that allow full access to all categories
-- This allows users to edit and delete any category (including defaults)

-- Policy for SELECT - users can view all categories
CREATE POLICY "Users can view all categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for INSERT - users can create their own categories
CREATE POLICY "Users can create their own categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for UPDATE - users can update any category
CREATE POLICY "Users can update any category"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for DELETE - users can delete any category
CREATE POLICY "Users can delete any category"
  ON categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Step 3: Verify the policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'categories'
ORDER BY policyname;

-- Step 4: Test the policies (optional)
-- You can test by trying to update a default category
-- UPDATE categories SET name = 'Test Update' WHERE is_default = true LIMIT 1; 