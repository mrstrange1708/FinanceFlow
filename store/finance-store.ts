import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';

type Account = Database['public']['Tables']['accounts']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];
type Budget = Database['public']['Tables']['budgets']['Row'];

interface FinanceState {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
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
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  accounts: [],
  categories: [],
  transactions: [],
  budgets: [],
  loading: false,

  // Account methods
  fetchAccounts: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ accounts: data || [] });
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      set({ loading: false });
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
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Transaction methods - FIXED: Removed automatic balance updates to prevent doubling
  fetchTransactions: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false });
      
      if (error) throw error;
      set({ transactions: data || [] });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      set({ loading: false });
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
      
      set((state) => ({
        transactions: [data, ...state.transactions],
      }));
      
      // Refresh accounts to get updated balances from database triggers
      await get().fetchAccounts();
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
      
      set((state) => ({
        transactions: state.transactions.map((transaction) =>
          transaction.id === id ? data : transaction
        ),
      }));
      
      // Refresh accounts to get updated balances from database triggers
      await get().fetchAccounts();
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
      
      set((state) => ({
        transactions: state.transactions.filter((transaction) => transaction.id !== id),
      }));
      
      // Refresh accounts to get updated balances from database triggers
      await get().fetchAccounts();
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
        .select('id, user_id, category_id, limit_amount, month, created_at, updated_at')
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
        .select('id, user_id, category_id, limit_amount, month, created_at, updated_at')
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        budgets: [data, ...state.budgets],
      }));
    } catch (error) {
      console.error('Error adding budget:', error);
      throw error;
    }
  },

  updateBudget: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', id)
        .select('id, user_id, category_id, limit_amount, month, created_at, updated_at')
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
}));