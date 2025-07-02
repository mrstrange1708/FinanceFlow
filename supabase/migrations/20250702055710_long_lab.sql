/*
  # Fix missing budget columns

  1. Changes
    - Add missing `limit_amount` column to `budgets` table if it doesn't exist
    - Add missing `updated_at` column to `budgets` table if it doesn't exist
    - Ensure the columns have the correct type and constraints

  2. Safety
    - Uses conditional logic to only add columns if they don't exist
    - Preserves existing data
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