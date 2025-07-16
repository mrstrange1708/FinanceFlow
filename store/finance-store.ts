import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth-store';

type Account = {
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
type Category = Database['public']['Tables']['categories']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];
type Budget = Database['public']['Tables']['budgets']['Row'];
type Goal = {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  description: string | null;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
  category_id?: string; // Make optional
};

interface FinanceState {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  loading: boolean;
  
  // Account methods
  fetchAccounts: () => Promise<void>;
  addAccount: (account: Omit<Account, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateAccount: (id: string, updates: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  
  // Category methods
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Transaction methods
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Budget methods
  fetchBudgets: () => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  
  // Goal methods
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'created_at' | 'updated_at' | 'current_amount'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  
  // Utility methods
  refreshAllData: () => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  accounts: [],
  categories: [],
  transactions: [],
  budgets: [],
  goals: [],
  loading: false,

  // Utility method to refresh all data
  refreshAllData: async () => {
    const state = get();
    await Promise.all([
      state.fetchAccounts(),
      state.fetchCategories(),
      state.fetchTransactions(),
      state.fetchBudgets(),
      state.fetchGoals(),
    ]);
  },

  // Account methods
  fetchAccounts: async () => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ accounts: data || [] });
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  },

  addAccount: async (account) => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .insert([account])
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        accounts: [data, ...state.accounts],
      }));
    } catch (error) {
      console.error('Error adding account:', error);
      throw error;
    }
  },

  updateAccount: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        accounts: state.accounts.map((account) =>
          account.id === id ? data : account
        ),
      }));
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  },

  deleteAccount: async (id) => {
    try {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        accounts: state.accounts.filter((account) => account.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },

  // Category methods
  fetchCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('type', { ascending: true });
      
      if (error) throw error;
      set({ categories: data || [] });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  },

  addCategory: async (category) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        categories: [...state.categories, data],
      }));
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  updateCategory: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? data : category
        ),
      }));
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      // First check if category exists and get its name for better error handling
      const { data: categoryData, error: fetchError } = await supabase
        .from('categories')
        .select('name')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        throw new Error('Category not found');
      }

      // Delete the category
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) {
        // Provide more specific error messages
        if (error.message.includes('foreign key')) {
          throw new Error(`Cannot delete "${categoryData.name}" because it's being used in transactions, budgets, or goals. Please remove or reassign these items first.`);
        }
        throw error;
      }
      
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Transaction methods
  fetchTransactions: async () => {
    try {
      const user = useAuthStore.getState().user;
      if (!user) return;
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false });
      if (error) throw error;
      set({ transactions: data || [] });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  },

  addTransaction: async (transaction) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh all data to ensure consistency
      await get().refreshAllData();
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },

  updateTransaction: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh all data to ensure consistency
      await get().refreshAllData();
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  deleteTransaction: async (id) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh all data to ensure consistency
      await get().refreshAllData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  // Budget methods
  fetchBudgets: async () => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('month', { ascending: false });
      
      if (error) throw error;
      set({ budgets: data || [] });
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  },

  addBudget: async (budget) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert([budget])
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        budgets: [data, ...state.budgets],
      }));
    } catch (error) {
      console.error('Error adding budget:', error instanceof Error ? error.message : error);
      throw error;
    }
  },

  updateBudget: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        budgets: state.budgets.map((budget) =>
          budget.id === id ? data : budget
        ),
      }));
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  },

  deleteBudget: async (id) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        budgets: state.budgets.filter((budget) => budget.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  },

  // Goal methods
  fetchGoals: async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ goals: data || [] });
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  },

  addGoal: async (goal) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert([{ ...goal, current_amount: 0 }])
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        goals: [data, ...state.goals],
      }));
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  },

  updateGoal: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        goals: state.goals.map((goal) =>
          goal.id === id ? data : goal
        ),
      }));
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  },

  deleteGoal: async (id) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        goals: state.goals.filter((goal) => goal.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  },
}));