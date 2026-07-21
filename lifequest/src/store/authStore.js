import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { localAuth } from '../services/localAuth';

export const useAuthStore = create((set, _get) => ({
  user: null,
  initialized: false,
  loading: false,
  error: null,
  isDemoMode: !isSupabaseConfigured,
  _initStarted: false,

  init: async () => {
    // React 19's StrictMode intentionally double-invokes effects in
    // development to surface exactly this kind of bug: without this guard,
    // init() would run twice and register two onAuthStateChange listeners,
    // leaking a subscription and double-firing auth state updates.
    if (useAuthStore.getState()._initStarted) return () => {};
    set({ _initStarted: true });

    if (isSupabaseConfigured) {
      const { data } = await supabase.auth.getSession();
      set({ user: data?.session?.user || null, initialized: true });
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user || null });
      });
      return () => listener?.subscription?.unsubscribe();
    }

    const session = localAuth.getSession();
    set({ user: session?.user || null, initialized: true });
    return () => {};
  },

  clearError: () => set({ error: null }),

  signUp: async (email, password) => {
    set({ loading: true, error: null });
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        set({ user: data.user, loading: false });
        return { success: true, needsEmailConfirmation: !data.session };
      } else {
        const { data, error } = await localAuth.signUp(email, password);
        if (error) throw error;
        set({ user: data.user, loading: false });
        return { success: true, needsEmailConfirmation: false };
      }
    } catch (err) {
      set({ error: err.message || 'Failed to sign up', loading: false });
      return { success: false };
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        set({ user: data.user, loading: false });
      } else {
        const { data, error } = await localAuth.signIn(email, password);
        if (error) throw error;
        set({ user: data.user, loading: false });
      }
      return { success: true };
    } catch (err) {
      set({ error: err.message || 'Failed to sign in', loading: false });
      return { success: false };
    }
  },

  signOut: async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      await localAuth.signOut();
    }
    set({ user: null });
  },

  resetPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
      } else {
        const { error } = await localAuth.resetPassword(email);
        if (error) throw error;
      }
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.message || 'Failed to send reset email', loading: false });
      return { success: false };
    }
  },
}));
