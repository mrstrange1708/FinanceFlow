/*
  # Create Goals Table

  1. New Tables
    - `goals` - Financial goals for categories
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `category_id` (uuid, foreign key to categories)
      - `name` (text) - Goal name (e.g., "Car Purchase", "Emergency Fund")
      - `target_amount` (decimal) - Target amount to save/spend
      - `current_amount` (decimal) - Current progress amount
      - `target_date` (date) - Target completion date
      - `description` (text) - Optional description
      - `status` (text) - 'active', 'completed', 'paused'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on goals table
    - Add policies for authenticated users to access only their own goals

  3. Indexes
    - Add indexes for frequently queried columns
*/

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  target_amount decimal(15, 2) NOT NULL,
  current_amount decimal(15, 2) DEFAULT 0.00,
  target_date date NOT NULL,
  description text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for goals
CREATE POLICY "Users can manage their own goals"
  ON goals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_category_id ON goals(category_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_target_date ON goals(target_date);

-- Create trigger for updated_at
CREATE OR REPLACE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update goal progress based on transactions
CREATE OR REPLACE FUNCTION update_goal_progress()
RETURNS TRIGGER AS $$
DECLARE
  goal_record RECORD;
  category_total decimal(15, 2);
BEGIN
  -- Find all active goals for the transaction's category
  FOR goal_record IN 
    SELECT * FROM goals 
    WHERE category_id = COALESCE(NEW.category_id, OLD.category_id) 
    AND status = 'active'
  LOOP
    -- Calculate total amount for this category from transactions
    SELECT COALESCE(SUM(amount), 0) INTO category_total
    FROM transactions 
    WHERE category_id = goal_record.category_id 
    AND user_id = goal_record.user_id
    AND transaction_date >= goal_record.created_at;
    
    -- Update goal progress
    UPDATE goals 
    SET 
      current_amount = category_total,
      status = CASE 
        WHEN category_total >= target_amount THEN 'completed'
        ELSE 'active'
      END,
      updated_at = now()
    WHERE id = goal_record.id;
  END LOOP;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update goal progress
CREATE OR REPLACE TRIGGER update_goal_progress_trigger
  AFTER INSERT OR UPDATE OR DELETE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_goal_progress();