import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'card' | 'debit_card' | 'wallet' | 'cash' | 'investment' | 'savings' | 'piggy_bank' | 'shop' | 'bitcoin' | 'store';
          balance: number;
          icon: string;
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: 'card' | 'debit_card' | 'wallet' | 'cash' | 'investment' | 'savings' | 'piggy_bank' | 'shop' | 'bitcoin' | 'store';
          balance?: number;
          icon?: string;
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: 'card' | 'debit_card' | 'wallet' | 'cash' | 'investment' | 'savings' | 'piggy_bank' | 'shop' | 'bitcoin' | 'store';
          balance?: number;
          icon?: string;
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          type: 'income' | 'expense';
          icon: string;
          color: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          type: 'income' | 'expense';
          icon?: string;
          color?: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          type?: 'income' | 'expense';
          icon?: string;
          color?: string;
          is_default?: boolean;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          account_id: string;
          category_id: string;
          amount: number;
          type: 'income' | 'expense' | 'transfer';
          description: string | null;
          receipt_url: string | null;
          transaction_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id: string;
          category_id: string;
          amount: number;
          type: 'income' | 'expense' | 'transfer';
          description?: string | null;
          receipt_url?: string | null;
          transaction_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string;
          category_id?: string;
          amount?: number;
          type?: 'income' | 'expense' | 'transfer';
          description?: string | null;
          receipt_url?: string | null;
          transaction_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          limit_amount: number;
          month: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          limit_amount: number;
          month: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string;
          limit_amount?: number;
          month?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          name: string;
          target_amount: number;
          current_amount: number;
          target_date: string;
          description: string | null;
          status: 'active' | 'completed' | 'paused';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          name: string;
          target_amount: number;
          current_amount?: number;
          target_date: string;
          description?: string | null;
          status?: 'active' | 'completed' | 'paused';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string;
          name?: string;
          target_amount?: number;
          current_amount?: number;
          target_date?: string;
          description?: string | null;
          status?: 'active' | 'completed' | 'paused';
          created_at?: string;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          theme: 'light' | 'dark';
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: 'light' | 'dark';
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme?: 'light' | 'dark';
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};