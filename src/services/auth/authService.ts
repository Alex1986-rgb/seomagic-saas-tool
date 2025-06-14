
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

// Types for authentication
export interface AuthUser {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user?: User;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: 'admin' | 'user';
}

/**
 * Get current authenticated user and their profile
 */
export const getCurrentUser = async (): Promise<AuthUser> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return { isLoggedIn: false, isAdmin: false };
    }

    // Get user profile and role
    const { data: profile } = await supabase
      .from('profiles')
      .select(`
        *,
        user_roles!inner(role)
      `)
      .eq('id', session.user.id)
      .single();

    const isAdmin = profile?.user_roles?.role === 'admin';

    return {
      isLoggedIn: true,
      isAdmin,
      user: session.user,
      profile: {
        id: session.user.id,
        email: session.user.email || '',
        full_name: profile?.full_name,
        avatar_url: profile?.avatar_url,
        role: profile?.user_roles?.role
      }
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { isLoggedIn: false, isAdmin: false };
  }
};

/**
 * Sign up a new user
 */
export const signUpUser = async (email: string, password: string, fullName?: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: fullName || ''
        }
      }
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { data: null, error };
  }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { data: null, error };
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return { data: null, error };
  }
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (updates: Partial<UserProfile>) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { data: null, error };
  }
};

/**
 * Check if current user has admin role
 */
export const checkAdminRole = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    return !!data;
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
};
