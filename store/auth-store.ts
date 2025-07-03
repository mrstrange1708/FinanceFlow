import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    set({ user: data.user });
  },

  signUp: async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    
    if (data.user) {
      // Create default user preferences
      await supabase.from('user_preferences').insert({
        user_id: data.user.id,
        theme: 'light',
        currency: '₹',
      });
    }
    
    set({ user: data.user });
  },

  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://hhadbqunomvkcehucbih.supabase.co/auth/v1/callback',
      },
    });

    if (error) throw error;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    set({ user: null });
  },

  initialize: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      set({ user, loading: false });

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        const currentUser = session?.user ?? null;
        set({ user: currentUser, loading: false });

        // Create default user preferences for new users
        if (event === 'SIGNED_IN' && currentUser) {
          const { data: existingPrefs } = await supabase
            .from('user_preferences')
            .select('id')
            .eq('user_id', currentUser.id)
            .single();

          if (!existingPrefs) {
            await supabase.from('user_preferences').insert({
              user_id: currentUser.id,
              theme: 'light',
              currency: '₹',
            });
          }
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ loading: false });
    }
  },
}));