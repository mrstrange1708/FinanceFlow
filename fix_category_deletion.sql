-- Fix Category Deletion Issues
-- This script handles foreign key constraints and RLS policies for category deletion

-- Step 1: Check what's preventing category deletion
SELECT 'Checking foreign key constraints...' as status;

-- Check if categories are being used in transactions
SELECT 
  c.name as category_name,
  COUNT(t.id) as transaction_count
FROM categories c
LEFT JOIN transactions t ON c.id = t.category_id
GROUP BY c.id, c.name
HAVING COUNT(t.id) > 0
ORDER BY transaction_count DESC;

-- Check if categories are being used in budgets
SELECT 
  c.name as category_name,
  COUNT(b.id) as budget_count
FROM categories c
LEFT JOIN budgets b ON c.id = b.category_id
GROUP BY c.id, c.name
HAVING COUNT(b.id) > 0
ORDER BY budget_count DESC;

-- Check if categories are being used in goals
SELECT 
  c.name as category_name,
  COUNT(g.id) as goal_count
FROM categories c
LEFT JOIN goals g ON c.id = g.category_id
GROUP BY c.id, c.name
HAVING COUNT(g.id) > 0
ORDER BY goal_count DESC;

-- Step 2: Update foreign key constraints to CASCADE DELETE
-- This will automatically delete related records when a category is deleted

-- Update transactions table foreign key
ALTER TABLE transactions 
DROP CONSTRAINT IF EXISTS transactions_category_id_fkey;

ALTER TABLE transactions 
ADD CONSTRAINT transactions_category_id_fkey 
FOREIGN KEY (category_id) 
REFERENCES categories(id) 
ON DELETE CASCADE;

-- Update budgets table foreign key
ALTER TABLE budgets 
DROP CONSTRAINT IF EXISTS budgets_category_id_fkey;

ALTER TABLE budgets 
ADD CONSTRAINT budgets_category_id_fkey 
FOREIGN KEY (category_id) 
REFERENCES categories(id) 
ON DELETE CASCADE;

-- Update goals table foreign key
ALTER TABLE goals 
DROP CONSTRAINT IF EXISTS goals_category_id_fkey;

ALTER TABLE goals 
ADD CONSTRAINT goals_category_id_fkey 
FOREIGN KEY (category_id) 
REFERENCES categories(id) 
ON DELETE CASCADE;

-- Step 3: Update RLS policies to ensure proper permissions
-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view default categories and manage their own" ON categories;
DROP POLICY IF EXISTS "Users can manage their own categories" ON categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON categories;
DROP POLICY IF EXISTS "Users can view all categories" ON categories;
DROP POLICY IF EXISTS "Users can create their own categories" ON categories;
DROP POLICY IF EXISTS "Users can update any category" ON categories;
DROP POLICY IF EXISTS "Users can delete any category" ON categories;

-- Create comprehensive policies
CREATE POLICY "Users can view all categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update any category"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete any category"
  ON categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Step 4: Create a function to safely delete categories with cleanup
CREATE OR REPLACE FUNCTION safe_delete_category(category_uuid uuid)
RETURNS void AS $$
DECLARE
  category_name text;
  transaction_count integer;
  budget_count integer;
  goal_count integer;
BEGIN
  -- Get category info
  SELECT name INTO category_name FROM categories WHERE id = category_uuid;
  
  -- Count related records
  SELECT COUNT(*) INTO transaction_count FROM transactions WHERE category_id = category_uuid;
  SELECT COUNT(*) INTO budget_count FROM budgets WHERE category_id = category_uuid;
  SELECT COUNT(*) INTO goal_count FROM goals WHERE category_id = category_uuid;
  
  -- Log the deletion (optional)
  RAISE NOTICE 'Deleting category: % (transactions: %, budgets: %, goals: %)', 
    category_name, transaction_count, budget_count, goal_count;
  
  -- Delete the category (cascade will handle related records)
  DELETE FROM categories WHERE id = category_uuid;
  
  RAISE NOTICE 'Category % deleted successfully', category_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Grant necessary permissions
GRANT EXECUTE ON FUNCTION safe_delete_category(uuid) TO authenticated;

-- Step 6: Verify the changes
SELECT 'Verification complete!' as status;

-- Check foreign key constraints
SELECT 
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name IN ('transactions', 'budgets', 'goals')
  AND ccu.table_name = 'categories';

-- Check RLS policies
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

-- Step 7: Test category deletion (optional)
-- Uncomment the line below to test with a specific category ID
-- SELECT safe_delete_category('your-category-id-here'); 