/*
  # Fix Budget Table Schema

  1. Missing Columns
    - Add `limit_amount` column to budgets table
    - Add `updated_at` column to budgets table
  
  2. Triggers
    - Add trigger to update `updated_at` timestamp
  
  3. Notes
    - Uses conditional logic to safely add columns if they don't exist
    - Maintains data integrity and existing functionality
*/

-- Add limit_amount column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'budgets' AND column_name = 'limit_amount'
  ) THEN
    ALTER TABLE budgets ADD COLUMN limit_amount decimal(15, 2) NOT NULL DEFAULT 0.00;
  END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'budgets' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE budgets ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create trigger for updated_at if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'update_budgets_updated_at'
  ) THEN
    CREATE TRIGGER update_budgets_updated_at
      BEFORE UPDATE ON budgets
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;