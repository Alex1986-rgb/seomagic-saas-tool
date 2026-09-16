
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

// Types for authentication
export interface AuthUser {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user?: User;
  profile?: UserProfile;
  /**
   * Профиль или роль не удалось прочитать. Сессия при этом действительна:
   * человек вошёл, но имя и права могут быть неполными — интерфейс должен
   * сказать об этом, а не показывать пустые поля как настоящие.
   */
  loadError?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  role?: 'admin' | 'user';
}

/** Поля профиля, которые пользователь меняет сам. Роль сюда не входит. */
export interface ProfileUpdate {
  full_name?: string | null;
  avatar_url?: string | null;
}

/**
 * Адрес главной страницы сайта с учётом подпути публикации.
 *
 * Сайт живёт в подпапке (/seomagic-saas-tool/), а после подтверждения почты и
 * входа через Google Supabase возвращал человека на `origin/` — на корень
 * github.io, где его встречала 404. BASE_URL у Vite всегда оканчивается «/».
 */
const appHomeUrl = (): string => {
  const base = import.meta.env.BASE_URL || '/';
  return `${window.location.origin}${base.endsWith('/') ? base : `${base}/`}`;
};

/**
 * Get current authenticated user and their profile
 */
export const getCurrentUser = async (): Promise<AuthUser> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return { isLoggedIn: false, isAdmin: false };
    }

    const userId = session.user.id;

    // Профиль и роли читаем двумя отдельными запросами. Раньше роль вкладывали
    // в запрос профиля (`user_roles(role)`), но связи profiles↔user_roles в базе
    // нет: PostgREST отвечал ошибкой PGRST200, ошибку никто не читал, профиль
    // становился пустым, а администратор — обычным пользователем без доступа
    // в /admin.
    const [profileResult, rolesResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('full_name, avatar_url, created_at')
        .eq('id', userId)
        .maybeSingle(),
      supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId),
    ]);

    const problems: string[] = [];
    if (profileResult.error) {
      console.error('Не удалось загрузить профиль:', profileResult.error);
      problems.push(`профиль: ${profileResult.error.message}`);
    }
    if (rolesResult.error) {
      console.error('Не удалось загрузить роль пользователя:', rolesResult.error);
      problems.push(`роль: ${rolesResult.error.message}`);
    }

    const roles = (rolesResult.data ?? []).map((row) => row.role);
    const isAdmin = roles.includes('admin');
    const role: 'admin' | 'user' | undefined = isAdmin
      ? 'admin'
      : roles.includes('user')
        ? 'user'
        : undefined;

    const profile = profileResult.data;

    return {
      isLoggedIn: true,
      isAdmin,
      user: session.user,
      profile: {
        id: userId,
        email: session.user.email || '',
        full_name: profile?.full_name ?? undefined,
        avatar_url: profile?.avatar_url ?? undefined,
        created_at: profile?.created_at ?? session.user.created_at ?? undefined,
        role
      },
      loadError: problems.length > 0 ? `Не удалось загрузить ${problems.join('; ')}` : undefined,
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
        emailRedirectTo: appHomeUrl(),
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
        redirectTo: appHomeUrl()
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
export const updateProfile = async (updates: ProfileUpdate) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // upsert, а не update: если строки профиля почему-то нет (аккаунт старше
    // триггера создания профиля), update молча менял ноль строк и падал на .single().
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...updates }, { onConflict: 'id' })
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

    // maybeSingle: у обычного пользователя строки с ролью admin нет, и это не ошибка.
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
};
